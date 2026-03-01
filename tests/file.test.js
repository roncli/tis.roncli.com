const File = require("../web/file"),
    httpMocks = require("node-mocks-http");

// MARK: File
describe("File", () => {
    test("file route is correct", () => {
        expect(File.route.path).toBeUndefined();
        expect(File.route.catchAll).toBe(true);
    });

    test("file handler reads file correctly", async () => {
        const req = httpMocks.createRequest({url: "/test.txt"});
        const res = httpMocks.createResponse();

        res.download = jest.fn();
        await File.get(req, res, void 0);
        expect(res.statusCode).toBe(200);
        expect(res.download).toHaveBeenCalledWith(expect.stringMatching("files[/\\\\]test.txt"));
    });

    test("file handler handles invalid uri", async () => {
        const req = httpMocks.createRequest({url: "/%zz"});
        const res = httpMocks.createResponse();
        const next = jest.fn();

        await File.get(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    test("file handler handles path traversal", async () => {
        const req = httpMocks.createRequest({url: "/../test.txt"});
        const res = httpMocks.createResponse();
        const next = jest.fn();

        await File.get(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    test("file handler handles file outside of files directory", async () => {
        const req = httpMocks.createRequest({url: "\\\\tempered\\c$"});
        const res = httpMocks.createResponse();
        const next = jest.fn();

        await File.get(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    test("file handler handles directory", async () => {
        const req = httpMocks.createRequest({url: "/0"});
        const res = httpMocks.createResponse();

        await File.get(req, res, void 0);
        expect(res.statusCode).toBe(301);
    });

    test("file handler handles root directory", async () => {
        const req = httpMocks.createRequest({url: "/"});
        const res = httpMocks.createResponse();
        const next = jest.fn();

        await File.get(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    test("file handler handles 1001st request as a 429", async () => {
        const req = httpMocks.createRequest({url: "/test.txt", ip: "127.0.0.1"});
        const res = httpMocks.createResponse();

        res.download = jest.fn();
        for (let i = 0; i < 1000; i++) {
            await File.get(req, res, void 0); // eslint-disable-line no-await-in-loop -- The intent is to make 1000 requests before making the 1001st request.
        }
        await File.get(req, res, void 0);
        expect(res.statusCode).toBe(429);
    });

    test("file handler resets download count after 12 hours", async () => {
        const req = httpMocks.createRequest({url: "/test.txt", ip: "127.0.0.2"});
        const res = httpMocks.createResponse();
        const time = Date.now() - 13 * 60 * 60 * 1000;

        res.download = jest.fn();
        jest.spyOn(Date, "now").mockReturnValue(time);
        await File.get(req, res, void 0);
        expect(res.statusCode).toBe(200);
        jest.spyOn(Date, "now").mockRestore();

        for (let i = 0; i < 999; i++) {
            await File.get(req, res, void 0); // eslint-disable-line no-await-in-loop -- The intent is to make 999 requests before making the 1000th request.
        }
        await File.get(req, res, void 0);
        expect(res.statusCode).toBe(200);
        await File.get(req, res, void 0);
        expect(res.statusCode).toBe(429);
    });
});
