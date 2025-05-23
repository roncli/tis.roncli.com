const Common = require("./common"),
    MethodNotAllowedView = require("../public/views/405"),
    RouterBase = require("hot-router").RouterBase;

/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

// MARK: class MethodNotAllowed
/**
 * A class that represents the 405 page.
 */
class MethodNotAllowed extends RouterBase {
    // MARK: static get route
    /**
     * Retrieves the route parameters for the class.
     * @returns {RouterBase.Route} The route parameters.
     */
    static get route() {
        const route = {...super.route};

        route.methodNotAllowed = true;

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
        res.status(405).send(await Common.page("", MethodNotAllowedView.get(), req));
    }
}

module.exports = MethodNotAllowed;
