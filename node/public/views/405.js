// MARK: class MethodNotAllowedView
/**
 * A class that represents the 405 view.
 */
class MethodNotAllowedView {
    // MARK: static get
    /**
     * Gets the rendered method not allowed template.
     * @returns {string} An HTML string of the method not allowed view.
     */
    static get() {
        return /* html */`
            <div id="error">
                <div class="section">405 - Method Not Allowed</div>
                <div class="text">There's nothing here, sorry.</div>
            </div>
        `;
    }
}

if (typeof module === "undefined") {
    window.MethodNotAllowedView = MethodNotAllowedView;
} else {
    module.exports = MethodNotAllowedView;
}
