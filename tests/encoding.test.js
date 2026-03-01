const Encoding = require("../public/js/encoding");

// MARK: Encoding
describe("Encoding", () => {
    // MARK: attributeEncode
    describe("attributeEncode", () => {
        test("encoding encodes double quote correctly", () => {
            const result = Encoding.attributeEncode("test\"test");

            expect(result).toBe("test&#34;test");
        });

        test("encoding encodes empty string correctly", () => {
            const result = Encoding.attributeEncode("");

            expect(result).toBe("");
        });
    });

    // MARK: htmlEncode
    describe("htmlEncode", () => {
        test("encoding encodes ampersand correctly", () => {
            const result = Encoding.htmlEncode("test&test");

            expect(result).toBe("test&amp;test");
        });

        test("encoding encodes less than correctly", () => {
            const result = Encoding.htmlEncode("<test>");

            expect(result).toBe("&lt;test>");
        });

        test("encoding encodes non-ASCII characters correctly", () => {
            const result = Encoding.htmlEncode("testé");

            expect(result).toBe("test&#233;");
        });

        test("encoding encodes empty string correctly", () => {
            const result = Encoding.htmlEncode("");

            expect(result).toBe("");
        });
    });
});
