const HttpMocks = require("node-mocks-http"),
    os = require("os"),
    Robots = require("../web/robots");

// MARK: Robots
describe("Robots", () => {
    test("Robots route is correct", () => {
        expect(Robots.route.path).toBe("/robots.txt");
    });

    test("Robots handler sends expected response", () => {
        const req = HttpMocks.createRequest();
        const res = HttpMocks.createResponse();

        res.send = jest.fn();
        Robots.get(req, res);
        expect(res.statusCode).toBe(200);
        expect(res.send).toHaveBeenCalledWith(`User-agent: *${os.EOL}Disallow: /`);
    });
});
