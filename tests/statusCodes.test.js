/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {import("express").Response} Express.Response
 */

const HttpMocks = require("node-mocks-http"),
    InternalServerError = require("../web/500"),
    MethodNotAllowed = require("../web/405"),
    NotFound = require("../web/404");

// MARK: Status Codes
describe("Status Codes", () => {
    /** @type {HttpMocks.MockRequest<Express.Request>} */
    let req;

    /** @type {HttpMocks.MockResponse<Express.Response>} */
    let res;

    beforeEach(() => {
        req = HttpMocks.createRequest();
        res = HttpMocks.createResponse();
    });

    test("404 route is correct", () => {
        expect(NotFound.route.path).toBeUndefined();
        expect(NotFound.route.notFound).toBe(true);
    });

    test("404 handler sends error", () => {
        NotFound.get(req, res);
        expect(res.statusCode).toBe(404);
    });

    test("405 route is correct", () => {
        expect(MethodNotAllowed.route.path).toBeUndefined();
        expect(MethodNotAllowed.route.methodNotAllowed).toBe(true);
    });

    test("405 handler sends error", () => {
        MethodNotAllowed.get(req, res);
        expect(res.statusCode).toBe(405);
    });

    test("500 route is correct", () => {
        expect(InternalServerError.route.path).toBeUndefined();
        expect(InternalServerError.route.serverError).toBe(true);
    });

    test("500 handler sends error", () => {
        InternalServerError.get(req, res);
        expect(res.statusCode).toBe(500);
    });
});
