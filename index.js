const fs = require("fs"),
    path = require("path"),
    process = require("process"),
    util = require("util"),

    compression = require("compression"),
    express = require("express"),
    find = require("find"),
    morgan = require("morgan"),
    prettysize = require("prettysize"),

    morganExtensions = require("./morgan-extensions"),
    Queue = require("./queue"),

    app = express(),
    downloads = {},
    port = process.env.PORT || 15351;

// Remove powered by.
app.disable("x-powered-by");

// Get a consistent IP address.
app.use((req, res, next) => {
    req.headers.ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    next();
});

// Use compression!
app.use(compression());

// Setup morgan logging.
morganExtensions(morgan);
app.use(morgan(":colorstatus \x1b[30m\x1b[1m:method\x1b[0m :url\x1b[30m\x1b[1m:newline    Date :date[iso]    IP :req[ip]    Time :colorresponse ms"));

// Search the files.
app.get(/search/, (req, res) => {
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
        queue.push(() => util.promisify(fs.lstat)(file).then((stats) => {
            file = file.substring(fileDir.length + 1);
            if (process.platform === "win32") {
                file = file.replace(/\\/g, "/");
            }

            res.write(`<a href="/${file.replace(/"/g, "&quot;")}">/${file}</a> - ${prettysize(stats.size, false, false, stats.size >= 1024 ? 2 : 0)}<br />`);
        }).catch(() => {
            res.write(`${file}<br />`);
        }));
    }).end(() => {
        // Finish up the HTML document and send.
        queue.push(() => {
            res.write("</body></html>");
            res.end();
        });
    });
});

// Retrieve a directory.
app.get(/.*\/$/, (req, res) => {
    // Get the directory of the file.
    const fileDir = path.join(__dirname, "files", req.path);

    // Check if the directory exists, and that it actually a directory.
    util.promisify(fs.access)(fileDir, fs.F_OK).then(() => util.promisify(fs.readdir)(fileDir)).then((files) => {
        // This will be a 200, begin writing the HTML.
        res.status(200);
        res.write("<html><head><style>* {font-family: Arial, sans-serif;}</style></head><body>");
        res.write(`<h1>tis.roncli.com</h1><a href="/">Home</a><br /><br /><form action="/search" method="GET"><input type="text" name="text" /> <input type="submit" value="Search"></form><h2>Current directory: ${req.path}</h2>`);

        // Startup a new queue.
        const queue = new Queue();

        // Get the path of the HTML file to be displayed for this directory.
        const html = path.join(__dirname, "html", req.path, "index.htm");

        util.promisify(fs.access)(html, fs.F_OK).then(() => util.promisify(fs.readFile)(html)).then((data) => {
            // If the HTML file exists, output it now.
            queue.push(() => {
                res.write(`${data}`);
            });
        }).catch(() => {}).then(() => {
            // List the directory contents.
            queue.push(() => {
                res.write("<h2>Directory contents:</h2>");
            });

            // Go to the parent directory if we're not in the root.
            if (req.path !== "/") {
                queue.push(() => {
                    res.write(`<a href="${path.posix.join("/", req.path, "..", "/").replace(/"/g, "&quot;")}">Parent Directory</a><br />`);
                });
            }

            // Loop through the files to find all of the directories and output them.
            files.forEach((file) => {
                const obj = path.join(fileDir, file);

                queue.push(() => util.promisify(fs.lstat)(obj).then((stats) => {
                    if (stats.isDirectory()) {
                        res.write(`<a href="${path.posix.join("/", req.path, file).replace(/"/g, "&quot;")}/">${file}/</a><br />`);
                    }
                }).catch(() => {
                    res.write(`${file}<br />`);
                }));
            });

            // Loop through the files to find all of the files and output them.
            files.forEach((file) => {
                const obj = path.join(fileDir, file);

                queue.push(() => util.promisify(fs.lstat)(obj).then((stats) => {
                    if (stats.isFile()) {
                        res.write(`<a href="${path.posix.join("/", req.path, file).replace(/"/g, "&quot;")}">${file}</a> - ${prettysize(stats.size, false, false, stats.size >= 1024 ? 2 : 0)}<br />`);
                    }
                }).catch(() => {
                    res.write(`${file}<br />`);
                }));
            });

            // Finish up the HTML document and send.
            queue.push(() => {
                res.write("</body></html>");
                res.end();
            });
        });
    }).catch(() => {
        // Directory does not exist.
        res.status(404);
        res.write("404 Directory not found.");
        res.end();
    });
});

// Retrieve a file.
app.get(/.*[^/]$/, (req, res) => {
    // Get the filename.
    const file = path.join(__dirname, "files", decodeURIComponent(req.path));

    // Check if the file exists.
    util.promisify(fs.access)(file, fs.F_OK).then(() => {
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

            // Download the file.
            res.download(file, () => {});
        }
    }).catch(() => {
        // File does not exist.
        res.status(404);
        res.write(`404 File ${decodeURIComponent(req.path)} not found.`);
        res.end();
    });
});

// Start server.
app.listen(port, () => {
    console.log(`Server PID ${process.pid} listening on port ${port} in ${app.get("env")} mode.`);
});
