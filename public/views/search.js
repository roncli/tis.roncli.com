// MARK: class SearchView
/**
 * A class that represents the search view.
 */
class SearchView {
    /* istanbul ignore next - Ignoring browser code. */
    static #Encoding = typeof module === "undefined" ? window.Encoding : require("../js/encoding.js");

    // MARK: static get
    /**
     * Gets the rendered search template.
     * @param {object} params The parameters for the search view.
     * @param {string} params.text The search text.
     * @param {object[]} params.files The search results.
     * @param {string} params.files[].name The name of the file.
     * @param {string} params.files[].size The size of the file.
     * @returns {string} An HTML string of the search view.
     */
    static get({text, files}) {
        return /* html */`
            <a href="/">Home</a><br /><br />
            <form action="/search" method="GET">
                <input type="text" name="text" value="${SearchView.#Encoding.attributeEncode(text)}" />
                <input type="submit" value="Search">
            </form>
            <h2>Search results: ${SearchView.#Encoding.htmlEncode(text)}</h2>
            ${files.length === 0 ? /* html */`
                No results found.
            ` : files.map((file) => /* html */`
                <a href="/${SearchView.#Encoding.attributeEncode(file.name)}">/${SearchView.#Encoding.htmlEncode(file.name)}</a>${SearchView.#Encoding.htmlEncode(file.size)}<br />
            `).join("")}
        `;
    }
}

/* istanbul ignore if - Ignoring browser code. */
if (typeof module === "undefined") {
    window.SearchView = SearchView;
} else {
    module.exports = SearchView;
}
