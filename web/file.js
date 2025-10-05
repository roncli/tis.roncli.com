/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 * @typedef {import("fs").Stats} Stats
 */

const Common = require("./common"),
    fs = require("fs/promises"),
    path = require("path"),
    RouterBase = require("hot-router").RouterBase,
    TooManyRequestsView = require("../public/views/429"),

    badPathCharactersRegex = /[<>:"|?*]/,
    leadingSlashesRegex = /^\/+/;

// MARK: class File
/**
 * A class that represents the file route.
 */
class File extends RouterBase {
    static #MAXREQUESTS = 1000;
    /** @type {{[x: string]: {count: number, last: Date}}} */
    static #downloads = {};

    // MARK: static get route
    /**
     * Retrieves the route parameters for the class.
     * @returns {RouterBase.Route} The route parameters.
     */
    static get route() {
        const route = {...super.route};

        route.catchAll = true;

        return route;
    }

    // MARK: static async get
    /**
     * Processes the request.
     * @param {Express.Request} req The request object.
     * @param {Express.Response} res The response object.
     * @param {Function} next The next middleware function.
     * @returns {Promise<void>}
     */
    static async get(req, res, next) {
        // Ensure we have a valid path.
        let reqPath;
        try {
            reqPath = decodeURIComponent(req.path);
        } catch {
            next();
            return;
        }
        if (reqPath.includes("..") || badPathCharactersRegex.test(reqPath)) {
            next();
            return;
        }

        // Get the filename.
        const filesDir = path.resolve(__dirname, "..", "files");
        reqPath = reqPath.replace(leadingSlashesRegex, "");
        const file = path.resolve(filesDir, reqPath);

        // Ensure the file is in the files directory.
        if (!file.startsWith(filesDir)) {
            next();
            return;
        }

        // Check if the file exists and whether it's a directory.
        /** @type {Stats} */
        let stat;
        try {
            stat = await fs.stat(file);
        } catch {
            next();
            return;
        }

        if (stat.isDirectory()) {
            // If the path is a directory but the URL does not end with a slash, redirect to the same path with a trailing slash.
            if (!req.path.endsWith("/")) {
                res.redirect(301, `${req.path}/`);
                return;
            }
            // If it already ends with a slash, let the directory route handle it (should not reach here).
            next();
            return;
        }

        // Ensure that the IP address is logging the number of downloads, and reset it if it's been more than 12 hours since their last download.
        const ip = req.ip.toString();
        if (!File.#downloads[ip]) {
            File.#downloads[ip] = {count: 0, last: new Date()};
        }
        if (new Date().getTime() - File.#downloads[ip].last.getTime() >= 12 * 60 * 60 * 1000) {
            File.#downloads[ip].count = 0;
        }

        if (File.#downloads[ip].count >= File.#MAXREQUESTS) {
            // Send a 429 if they've been downloading too much.
            res.status(429).send(await Common.page("", TooManyRequestsView.get({maxRequests: File.#MAXREQUESTS}), req));
            return;
        }

        // Update the download count.
        File.#downloads[ip].count++;
        File.#downloads[ip].last = new Date();

        // Download the file.
        res.download(file, () => {});
    }
}

module.exports = File;
