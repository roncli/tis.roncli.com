/**
 * @typedef {import("express").Request} Express.Request
 */

const HtmlMinifierTerser = require("html-minifier-terser"),
    pjson = require("../package.json"),
    RouterBase = require("hot-router").RouterBase;

/** @type {typeof import("../public/views/index")} */
let IndexView;

// MARK: class Common
/**
 * A class that handles common web functions.
 */
class Common extends RouterBase {
    static #sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB"];

    // MARK: static get route
    /**
     * Retrieves the route parameters for the class.
     * @returns {RouterBase.Route} The route parameters.
     */
    static get route() {
        const route = {...super.route};

        route.include = true;

        return route;
    }

    // MARK: static fileSize
    /**
     * Returns the size of a file.
     * @param {number} size The size to convert.
     * @returns {string} The size of the file in a human readable format.
     */
    static fileSize(size) {
        let factors = 0;
        while (size >= 1024 && factors < Common.#sizes.length - 1) {
            size /= 1024;
            factors++;
        }
        let unit = Common.#sizes[factors];
        if (size === 1) {
            unit = unit.substring(0, unit.length - 1);
        }
        return `${size.toFixed(factors === 0 ? 0 : 2)} ${unit}`;
    }

    // MARK: static page
    /**
     * Generates a webpage from the provided HTML using a common template.
     * @param {string} head The HTML to insert into the header.
     * @param {string} html The HTML to make a full web page from.
     * @param {Express.Request} req The request of the page.
     * @returns {Promise<string>} The HTML of the full web page.
     */
    static page(head, html, req) {
        if (!IndexView) {
            IndexView = require("../public/views/index");
        }

        return HtmlMinifierTerser.minify(
            IndexView.get({
                head,
                html,
                protocol: req.protocol,
                host: req.get("host"),
                originalUrl: req.originalUrl,
                year: new Date().getFullYear(),
                version: pjson.version
            }),
            {
                collapseBooleanAttributes: true,
                collapseWhitespace: true,
                conservativeCollapse: true,
                decodeEntities: true,
                html5: true,
                removeAttributeQuotes: true,
                removeComments: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true,
                removeRedundantAttributes: true,
                useShortDoctype: true
            }
        );
    }
}

module.exports = Common;
