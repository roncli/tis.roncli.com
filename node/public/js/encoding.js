// MARK: class Encoding
/**
 * A class of encoding functions.
 */
class Encoding {
    // MARK: static attributeEncode
    /**
     * Attribute-encodes a string.
     * @param {string} str The string.
     * @returns {string} The encoded string.
     */
    static attributeEncode(str) {
        return str && `${str}`.replace(/"/g, "&#34;") || "";
    }

    // MARK: static htmlEncode
    /**
     * HTML-encodes a string.
     * @param {string} str The string.
     * @returns {string} The encoded string.
     */
    static htmlEncode(str) {
        return str && str.replace(/&/gm, "&amp;").replace(/</gm, "&lt;").replace(/[\u0080-\u1FFF]/gm, (i) => `&#${i.charCodeAt(0)};`) || "";
    }
}

if (typeof module === "undefined") {
    window.Encoding = Encoding;
} else {
    module.exports = Encoding;
}
