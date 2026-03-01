const Common = require("../web/common");

// MARK: Common
describe("Common", () => {
    test("common route is correct", () => {
        expect(Common.route.path).toBeUndefined();
        expect(Common.route.include).toBe(true);
    });

    test("common handles large file sizes correctly", () => {
        expect(Common.fileSize(1)).toBe("1 Byte");
        expect(Common.fileSize(10)).toBe("10 Bytes");
        expect(Common.fileSize(1024)).toBe("1.00 KB");
        expect(Common.fileSize(1024 * 1024)).toBe("1.00 MB");
        expect(Common.fileSize(1024 * 1024 * 1024)).toBe("1.00 GB");
        expect(Common.fileSize(1024 * 1024 * 1024 * 1024)).toBe("1.00 TB");
        expect(Common.fileSize(1024 * 1024 * 1024 * 1024 * 1024)).toBe("1.00 PB");
        expect(Common.fileSize(1024 * 1024 * 1024 * 1024 * 1024 * 1024)).toBe("1.00 EB");
    });
});
