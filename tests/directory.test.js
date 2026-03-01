const Directory = require("../web/directory"),
    httpMocks = require("node-mocks-http");

// MARK: Directory
describe("Directory", () => {
    test("directory route is correct", () => {
        expect(Directory.route.path).toStrictEqual(/^(?:|.*\/)$/);
    });

    test("directory returns expected result for root input", async () => {
        const req = httpMocks.createRequest({url: "/"});
        const res = httpMocks.createResponse();

        await Directory.get(req, res);
        expect(res.statusCode).toBe(200);
    });

    test("directory returns expected result for valid input", async () => {
        const req = httpMocks.createRequest({url: "/FokusTrackz/"});
        const res = httpMocks.createResponse();

        await Directory.get(req, res);
        expect(res.statusCode).toBe(200);
    });

    test("directory returns expected result for invalid input", async () => {
        const req = httpMocks.createRequest({url: "/non-existant"});
        const res = httpMocks.createResponse();

        await Directory.get(req, res);
        expect(res.statusCode).toBe(404);
    });

    test("directory returns expected result for an empty directory", async () => {
        const req = httpMocks.createRequest({url: "/EmptyDir/"});
        const res = httpMocks.createResponse();

        await Directory.get(req, res);
        expect(res.statusCode).toBe(200);
    });
});
