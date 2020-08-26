const fs = require("fs"),
    os = require("os"),
    path = require("path"),
    process = require("process"),
    util = require("util"),

    appInsights = require("applicationinsights"),
    compression = require("compression"),
    express = require("express"),
    find = require("find"),
    prettysize = require("prettysize"),

    Queue = require("./queue"),

    app = express(),
    downloads = {},
    port = process.env.PORT || 3030;

//   ###              #
//    #               #
//    #    # ##    ## #   ###   #   #
//    #    ##  #  #  ##  #   #   # #
//    #    #   #  #   #  #####    #
//    #    #   #  #  ##  #       # #
//   ###   #   #   ## #   ###   #   #
/**
 * The primary class for the application.
 */
class Index {
    //         #                 #
    //         #                 #
    //  ###   ###    ###  ###   ###   #  #  ###
    // ##      #    #  #  #  #   #    #  #  #  #
    //   ##    #    # ##  #      #    #  #  #  #
    // ###      ##   # #  #       ##   ###  ###
    //                                      #
    /**
     * Starts up the application.
     * @returns {void}
     */
    static startup() {
        // Setup application insights.
        appInsights.setup().setAutoCollectRequests(false);
        appInsights.start();

        // Remove powered by.
        app.disable("x-powered-by");

        // Get a consistent IP address.
        app.use((req, res, next) => {
            req.headers.ip = req.headers["x-forwarded-for"] || req.ip || req.connection.remoteAddress;
            next();
        });

        // Use compression!
        app.use(compression());

        app.get(/^\/?robots.txt$/, (req, res) => {
            res.status(200);
            res.write(`User-agent: *${os.EOL}Disallow: /`);
            res.end();
        });

        // Search the files.
        app.get(/^\/?search$/, (req, res) => {
            // "text" is a required parameter, also don't allow HTML tags.
            if (!req.query.text || req.query.text.indexOf("<") !== -1) {
                res.status(400);
                res.write("400 Bad Request");
                res.end();
                return;
            }

            // This will be a 200, begin writing the HTML.
            res.status(200);
            res.write("<html><head><style>* {font-family: Arial, sans-serif;}</style></head><body>");
            res.write(`<h1>tis.roncli.com</h1><a href="/">Home</a><br /><br /><form action="/search" method="GET"><input type="text" name="text" value="${req.query.text.replace(/"/g, "&quot;")}" /> <input type="submit" value="Search"></form><h2>Search results: ${req.query.text}</h2>`);

            // Get the files directory.
            const fileDir = path.join(__dirname, "files");

            // Startup a new queue.
            const queue = new Queue();

            // Loop through the files found and output them.
            find.eachfile(new RegExp(req.query.text, "i"), fileDir, (file) => {
                queue.push(async () => {
                    let stats;
                    try {
                        stats = await util.promisify(fs.lstat)(file);
                    } catch (err) {
                        appInsights.defaultClient.trackException({tagOverrides: {"ai.location.ip": req.headers.ip}, properties: {application: "tis.roncli.com", container: "tisronclicom-node", path: req.path, file, route: "^/?search$/"}, exception: err, message: "Error while looping through searched files."});
                        return;
                    }

                    file = file.substring(fileDir.length + 1);
                    if (process.platform === "win32") {
                        file = file.replace(/\\/g, "/");
                    }

                    res.write(`<a href="/${file.replace(/"/g, "&quot;")}">/${file}</a> - ${prettysize(stats.size, false, false, stats.size >= 1024 ? 2 : 0)}<br />`);
                });
            }).end(() => {
                // Finish up the HTML document and send.
                queue.push(() => {
                    res.write("</body></html>");
                    res.end();
                });
            });
        });

        // Retrieve a directory.
        app.get(/.*\/$/, async (req, res) => {
            // Get the directory of the file.
            const fileDir = path.join(__dirname, "files", req.path);

            // Check if the directory exists, and that it actually a directory.
            let files;
            try {
                await util.promisify(fs.access)(fileDir, fs.F_OK);
                files = await util.promisify(fs.readdir)(fileDir);
            } catch (err) {
                // Directory does not exist.
                res.status(404);
                res.write("404 Directory not found.");
                res.end();
                return;
            }

            // This will be a 200, begin writing the HTML.
            res.status(200);
            res.write("<html><head><style>* {font-family: Arial, sans-serif;}</style></head><body>");
            res.write(`<h1>tis.roncli.com</h1><a href="/">Home</a><br /><br /><form action="/search" method="GET"><input type="text" name="text" /> <input type="submit" value="Search"></form><h2>Current directory: ${req.path}</h2>`);

            // Get the path of the HTML file to be displayed for this directory.
            const html = path.join(__dirname, "html", req.path, "index.htm");

            let data;
            try {
                await util.promisify(fs.access)(html, fs.F_OK);
                data = await util.promisify(fs.readFile)(html);
            } catch {
            } finally {
                // If the HTML file exists, output it now.
                if (data) {
                    res.write(`${data}`);
                }
            }

            // List the directory contents.
            res.write("<h2>Directory contents:</h2>");

            // Go to the parent directory if we're not in the root.
            if (req.path !== "/") {
                res.write(`<a href="${path.posix.join("/", req.path, "..", "/").replace(/"/g, "&quot;")}">Parent Directory</a><br />`);
            }

            // Loop through the files to find all of the directories and output them.
            for (const file of files) {
                const obj = path.join(fileDir, file);

                let stats;
                try {
                    stats = await util.promisify(fs.lstat)(obj);
                } catch (err) {
                    appInsights.defaultClient.trackException({tagOverrides: {"ai.location.ip": req.headers.ip}, properties: {application: "tis.roncli.com", container: "tisronclicom-node", path: req.path, file, filename: obj, route: ".*/$"}, exception: err, message: "Error while looping through directories."});
                    return;
                }

                if (stats.isDirectory()) {
                    res.write(`<a href="${path.posix.join("/", req.path, file).replace(/"/g, "&quot;")}/">${file}/</a><br />`);
                }
            }

            // Loop through the files to find all of the files and output them.
            for (const file of files) {
                const obj = path.join(fileDir, file);

                let stats;
                try {
                    stats = await util.promisify(fs.lstat)(obj);
                } catch (err) {
                    appInsights.defaultClient.trackException({tagOverrides: {"ai.location.ip": req.headers.ip}, properties: {application: "tis.roncli.com", container: "tisronclicom-node", path: req.path, file, filename: obj, route: ".*/$"}, exception: err, message: "Error while looping through files."});
                    return;
                }

                if (stats.isFile()) {
                    res.write(`<a href="${path.posix.join("/", req.path, file).replace(/"/g, "&quot;")}">${file}</a> - ${prettysize(stats.size, false, false, stats.size >= 1024 ? 2 : 0)}<br />`);
                }
            }

            // Finish up the HTML document and send.
            res.write("</body></html>");
            res.end();
        });

        // Retrieve a file.
        app.get(/.*[^/]$/, async (req, res) => {
            // Get the filename.
            const file = path.join(__dirname, "files", decodeURIComponent(req.path));

            // Check if the file exists.
            try {
                await util.promisify(fs.access)(file, fs.F_OK);
            } catch (err) {
                // File does not exist.
                res.status(404);
                res.write(`404 File ${decodeURIComponent(req.path)} not found.`);
                res.end();
                return;
            }

            // Ensure that the IP address is logging the number of downloads, and reset it if it's been more than 12 hours since their last download.
            if (!downloads[req.headers.ip]) {
                downloads[req.headers.ip] = {count: 0, last: new Date()};
            }
            if (new Date() - downloads[req.headers.ip].last >= 12 * 60 * 60 * 1000) {
                downloads[req.headers.ip].count = 0;
            }

            if (downloads[req.headers.ip].count >= 50) {
                // Send a 429 if they've been downloading too much.
                res.status(429);
                res.write("429 Too many requests, you are limited to 50 downloads in a 12 hour period.  Please contact roncli@roncli.com if you need to exceed this limit.");
                res.end();
            } else {
                // Update the download count.
                downloads[req.headers.ip].count++;
                downloads[req.headers.ip].last = new Date();
                appInsights.defaultClient.trackMetric({tagOverrides: {"ai.location.ip": req.headers.ip}, properties: {application: "tis.roncli.com", container: "tisronclicom-node", ipaddress: req.headers.ip}, name: "Downloads", value: downloads[req.headers.ip].count});

                // Download the file.
                res.download(file, () => {});
            }
        });

        // Start server.
        app.listen(port, () => {
            console.log(`Server PID ${process.pid} listening on port ${port} in ${app.get("env")} mode.`);
        });
    }
}

Index.startup();
