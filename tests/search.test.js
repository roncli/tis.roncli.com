const httpMocks = require("node-mocks-http"),
    Search = require("../web/search");

// MARK: Search
describe("Search", () => {
    test("search route is correct", () => {
        expect(Search.route.path).toBe("/search");
    });

    test("search handler searches for files correctly", async () => {
        const req = httpMocks.createRequest({url: "/search?text=test"});
        const res = httpMocks.createResponse();

        await Search.get(req, res);
        expect(res.statusCode).toBe(200);

        const data = res._getData();

        expect(data).toContain("test.txt");
    });

    test("search handler handles missing text parameter", async () => {
        const req = httpMocks.createRequest({url: "/search"});
        const res = httpMocks.createResponse();

        await Search.get(req, res);
        expect(res.statusCode).toBe(400);
    });

    test("search handler handles HTML tags in text parameter", async () => {
        const req = httpMocks.createRequest({url: "/search?text=<script>"});
        const res = httpMocks.createResponse();

        await Search.get(req, res);
        expect(res.statusCode).toBe(400);
    });

    test("search handler handles no matching files", async () => {
        const req = httpMocks.createRequest({url: "/search?text=nonexistent"});
        const res = httpMocks.createResponse();

        await Search.get(req, res);
        expect(res.statusCode).toBe(200);

        const data = res._getData();

        expect(data).toContain("No results found.");
    });
});
