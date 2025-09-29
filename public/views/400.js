// MARK: class BadRequestView
/**
 * A class that gets the 400 view.
 */
class BadRequestView {
    // MARK: static get
    /**
     * Gets the rendered bad request template.
     * @returns {string} An HTML string of the bad request view.
     */
    static get() {
        return /* html */`
            <div id="error">
                <div class="section">400 - Bad Request</div>
                <div class="text">You did something you weren't supposed to.  Go back and try again.</div>
            </div>
        `;
    }
}

if (typeof module === "undefined") {
    window.BadRequestView = BadRequestView;
} else {
    module.exports = BadRequestView;
}
