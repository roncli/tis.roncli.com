// MARK: class DirectoryView
/**
 * A class that represents the directory view.
 */
class DirectoryView {
    // MARK: static get
    /**
     * Gets the rendered directory template.
     * @param {object} params The parameters for the directory view.
     * @param {string} params.path The current path.
     * @param {string} params.parent The parent directory.
     * @param {string} params.html The HTML to append to the page.
     * @param {object[]} params.files The directory contents.
     * @param {string} params.files[].name The name of the file.
     * @param {string} params.files[].size The size of the file.
     * @returns {string} An HTML string of the directory view.
     */
    static get({path, parent, html, files}) {
        return /* html */`
            <a href="/">Home</a><br /><br />
            <form action="/search" method="GET">
                <input type="text" name="text" />
                <input type="submit" value="Search">
            </form>
            <h2>Current directory: ${DirectoryView.Encoding.htmlEncode(path)}</h2>
            ${html}
            <h2>Directory contents:</h2>
            ${path === "/" ? "" : /* html */`
                <a href="${DirectoryView.Encoding.attributeEncode(parent)}">Parent Directory</a><br />
            `}
            ${files.length === 0 ? /* html */`
                No files found.
            ` : files.map((file) => /* html */`
                <a href="${DirectoryView.Encoding.attributeEncode(`${path}${file.name}`)}${file.size ? "" : "/"}">/${DirectoryView.Encoding.htmlEncode(file.name)}</a>${file.size ? `- ${DirectoryView.Encoding.htmlEncode(file.size)}` : ""}<br />
            `).join("")}
        `;
    }
}

/** @type {typeof import("../js/encoding")} */
// @ts-ignore
DirectoryView.Encoding = typeof Encoding === "undefined" ? require("../js/encoding.js") : Encoding; // eslint-disable-line no-undef

if (typeof module === "undefined") {
    window.DirectoryView = DirectoryView;
} else {
    module.exports = DirectoryView;
}
