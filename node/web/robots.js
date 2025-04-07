/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

const os = require("os"),
    RouterBase = require("hot-router").RouterBase;

// MARK: class Robots
/**
 * A class that represents the robots.txt file.
 */
class Robots extends RouterBase {
    // MARK: static get route
    /**
     * Retrieves the route parameters for the class.
     * @returns {RouterBase.Route} The route parameters.
     */
    static get route() {
        const route = {...super.route};

        route.path = "/robots.txt";

        return route;
    }

    // MARK: static async get
    /**
     * Processes the request.
     * @param {Express.Request} req The request object.
     * @param {Express.Response} res The response object.
     * @returns {void}
     */
    static get(req, res) {
        res.status(200).send(`User-agent: *${os.EOL}Disallow: /`);
    }
}

module.exports = Robots;
