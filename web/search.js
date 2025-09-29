/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

const BadRequestView = require("../public/views/400.js"),
    Common = require("./common.js"),
    fs = require("fs/promises"),
    path = require("path"),
    RouterBase = require("hot-router").RouterBase,
    SearchView = require("../public/views/search.js");

// MARK: class Search
/**
 * A class that represents the search page.
 */
class Search extends RouterBase {
    // MARK: static async #searchFiles
    /**
     * Searches the files in the directory for the given text.
     * @param {string} text The text to search for.
     * @param {string} fileDir The directory to search in.
     * @returns {Promise<string[]>} A promise that resolves to a list of matching file paths.
     */
    static async #searchFiles(text, fileDir) {
        const matchingFiles = [];

        const stack = [fileDir]; // Use a stack to manage directories to process.

        while (stack.length > 0) {
            const currentDir = stack.pop();
            const entries = await fs.readdir(currentDir, {withFileTypes: true});

            for (const entry of entries) {
                const fullPath = path.join(currentDir, entry.name);

                if (entry.isDirectory()) {
                    stack.push(fullPath); // Add directories to the stack for further processing.
                } else if (entry.isFile() && entry.name.includes(text)) {
                    let relativePath = fullPath.substring(fileDir.length + 1);
                    if (process.platform === "win32") {
                        relativePath = relativePath.replace(/\\/g, "/");
                    }
                    matchingFiles.push(relativePath); // Add matching files to the result list.
                }
            }
        }

        return matchingFiles;
    }

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

        // Search for matching files.
        const matchingFiles = await Search.#searchFiles(text, fileDir);

        const files = [];

        for (const file of matchingFiles) {
            const stats = await fs.lstat(path.join(fileDir, file));
            files.push({
                name: file,
                size: Common.fileSize(stats.size)
            });
        }

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
    }
}

module.exports = Search;
