// MARK: class NotFoundView
/**
 * A class that represents the 404 view.
 */
class NotFoundView {
    // MARK: static get
    /**
     * Gets the rendered not found template.
     * @returns {string} An HTML string of the not found view.
     */
    static get() {
        return /* html */`
            <div id="error">
                <div class="section">404 - Not Found</div>
                <div class="text">There's nothing here, sorry.</div>
            </div>
        `;
    }
}

if (typeof module === "undefined") {
    window.NotFoundView = NotFoundView;
} else {
    module.exports = NotFoundView;
}
