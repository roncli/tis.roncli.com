/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

const Common = require("./common"),
    NotFoundView = require("../public/views/404"),
    RouterBase = require("hot-router").RouterBase;

// MARK: class NotFound
/**
 * A class that represents the 404 page.
 */
class NotFound extends RouterBase {
    // MARK: static get route
    /**
     * Retrieves the route parameters for the class.
     * @returns {RouterBase.Route} The route parameters.
     */
    static get route() {
        const route = {...super.route};

        route.notFound = true;

        return route;
    }

    // MARK: static async get
    /**
     * Processes the request.
     * @param {Express.Request} req The request.
     * @param {Express.Response} res The response.
     * @returns {Promise<void>}
     */
    static async get(req, res) {
        res.status(404).send(await Common.page("", NotFoundView.get(), req));
    }
}

module.exports = NotFound;
