/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

const Common = require("./common"),
    DirectoryView = require("../public/views/directory"),
    fs = require("fs/promises"),
    NotFoundView = require("../public/views/404"),
    path = require("path"),
    RouterBase = require("hot-router").RouterBase;

// MARK: class Directory
/**
 * A class that represents the directory listing page.
 */
class Directory extends RouterBase {
    // MARK: static get route
    /**
     * Retrieves the route parameters for the class.
     * @returns {RouterBase.Route} The route parameters.
     */
    static get route() {
        const route = {...super.route};

        route.path = /^(?:|.*\/)$/;

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
        // Get the directory of the file.
        const fileDir = path.join(__dirname, "..", "files", req.path);

        // Check if the directory exists, and that it actually a directory.
        let contents;
        try {
            await fs.access(fileDir, fs.constants.F_OK);
            contents = await fs.readdir(fileDir);
        } catch {
            // Directory does not exist.
            res.status(404).send(await Common.page("", NotFoundView.get(), req));
            return;
        }

        // Get the path of the HTML file to be displayed for this directory.
        const htmlPath = path.join(__dirname, "..", "html", req.path, "index.htm");

        let html = "";
        try {
            await fs.access(htmlPath, fs.constants.F_OK);
            html = await fs.readFile(htmlPath, {encoding: "utf8"});
        } catch {}

        const files = [];

        // Loop through the files to find all of the files and directories and output them.
        for (const file of contents) {
            const obj = path.join(fileDir, file);

            const stats = await fs.lstat(obj);

            files.push({
                name: file,
                size: stats.isDirectory() ? void 0 : Common.fileSize(stats.size)
            });
        }

        let parent = "";
        if (req.path !== "/") {
            parent = path.posix.join("/", req.path, "..", "/");
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
        res.status(200).send(await Common.page("", DirectoryView.get({path: req.path, parent, html, files}), req));
    }
}

module.exports = Directory;
