// MARK: class TooManyRequestsView
/**
 * A class that represents the 429 view.
 */
class TooManyRequestsView {
    // MARK: static get
    /**
     * Gets the rendered too many requests template.
     * @param {Object} options The options for the view.
     * @param {number} options.maxRequests The maximum number of requests allowed.
     * @returns {string} An HTML string of the too many requests view.
     */
    static get({maxRequests}) {
        return /* html */`
            <div id="error">
                <div class="section">429 - Too Many Requests</div>
                <div class="text">You are limited to ${maxRequests} downloads in a 12 hour period.  Please contact <a href="mailto:roncli@roncli.com">roncli@roncli.com</a> if you need to exceed this limit.</div>
            </div>
        `;
    }
}

if (typeof module === "undefined") {
    window.TooManyRequestsView = TooManyRequestsView;
} else {
    module.exports = TooManyRequestsView;
}
