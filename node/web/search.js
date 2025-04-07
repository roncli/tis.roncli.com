/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

const BadRequestView = require("../public/views/400.js"),
    Common = require("./common.js"),
    find = require("find"),
    fs = require("fs/promises"),
    Log = require("@roncli/node-application-insights-logger"),
    path = require("path"),
    Queue = require("../src/queue.js"),
    RouterBase = require("hot-router").RouterBase,
    SearchView = require("../public/views/search.js");

// MARK: class Search
/**
 * A class that represents the search page.
 */
class Search extends RouterBase {
    // MARK: static get route
    /**
     * Retrieves the route parameters for the class.
     * @returns {RouterBase.Route} The route parameters.
     */
    static get route() {
        const route = {...super.route};

        route.path = "/search";

        return route;
    }

    // MARK: static async get
    /**
     * Processes the request.
     * @param {Express.Request} req The request object.
     * @param {Express.Response} res The response object.
     * @returns {Promise<void>}
     */
    static async get(req, res) {
        const text = req.query.text && req.query.text.toString() || "";

        // "text" is a required parameter, also don't allow HTML tags.
        if (!req.query.text || text.indexOf("<") !== -1) {
            res.status(400).send(await Common.page("", BadRequestView.get(), req));
            return;
        }

        // Get the files directory.
        const fileDir = path.join(__dirname, "..", "files");

        // Startup a new queue.
        const queue = new Queue();

        const files = [];

        // Loop through the files found and output them.
        find.eachfile(new RegExp(text, "i"), fileDir, (file) => {
            queue.push(async () => {
                let stats;
                try {
                    stats = await fs.lstat(file);
                } catch (err) {
                    Log.error("Error while looping through searched files.", {err, req, properties: {file, route: Search.route.path.toString()}});
                }

                file = file.substring(fileDir.length + 1);
                if (process.platform === "win32") {
                    file = file.replace(/\\/g, "/");
                }

                files.push({
                    name: file,
                    size: stats.isDirectory() ? void 0 : Common.fileSize(stats.size)
                });
            });
        }).end(() => {
            queue.push(async () => {
                files.sort((a, b) => {
                    // Put directories first, then files.
                    if (a.size && !b.size) {
                        return 1;
                    } else if (!a.size && b.size) {
                        return -1;
                    }

                    // Sort by name.
                    return a.name.localeCompare(b.name);
                });
                res.status(200).send(await Common.page("", SearchView.get({text, files}), req));
            });
        });
    }
}

module.exports = Search;
