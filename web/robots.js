/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

const os = require("os"),
    HotRouter = require("hot-router");

// MARK: class Robots
/**
 * A class that represents the robots.txt file.
 */
class Robots extends HotRouter.RouterBase {
    // MARK: static get route
    /**
     * Retrieves the route parameters for the class.
     * @returns {HotRouter.RouterBase.Route} The route parameters.
     */
    static get route() {
        const route = {...super.route};

        route.path = "/robots.txt";

        return route;
    }

    // MARK: static async get
    /**
     * Processes the request.
     * @param {Express.Request} _req The request object.
     * @param {Express.Response} res The response object.
     * @returns {void}
     */
    static get(_req, res) {
        res.status(200).send(`User-agent: *${os.EOL}Disallow: /`);
    }
}

module.exports = Robots;
