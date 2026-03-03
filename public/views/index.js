// MARK: class IndexView
/**
 * A class that represents the general website template.
 */
class IndexView {
    // MARK: static get
    /**
     * Gets the rendered page template.
     * @param {{head: string, html: string, protocol: string, host: string, originalUrl: string, year: number, version: string}} data The data to render the page with.
     * @returns {string} An HTML string of the page.
     */
    static get(data) {
        const {head, html, protocol, host, originalUrl, year, version} = data;

        return /* html */`
            <html lang="en">
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <meta http-equiv="Content-Security-Policy" content="default-src 'self'">
                    <title>tis.roncli.com</title>
                    <meta name="description" content="An archive of songs that were on the original Trax in Space website.">
                    <link rel="canonical" href="${protocol}://${host}${encodeURI(originalUrl)}" />
                    <meta property="og:title" content="tis.roncli.com">
                    <meta property="og:description" content="An archive of songs that were on the original Trax in Space website.">
                    <meta property="og:type" content="website">
                    <meta property="og:url" content="${protocol}://${host}${encodeURI(originalUrl)}">
                    <meta property="og:site_name" content="tis.roncli.com">
                    <meta property="og:locale" content="en_US">
                    <meta name="twitter:card" content="summary">
                    <meta name="twitter:creator" content="@roncli">
                    <meta name="twitter:url" content="${protocol}://${host}${encodeURI(originalUrl)}">
                    <meta name="twitter:title" content="tis.roncli.com">
                    <meta name="twitter:description" content="An archive of songs that were on the original Trax in Space website.">
                    <meta name="fediverse:creator" content="@roncli@mastodon.social">
                    <link rel="icon" href="data:,">
                    ${head}
                    <style>
                        body {background-color: #121212; color: #e0e0e0;}
                        a {color: #82aaff;}
                        a:visited {color: #bb86fc;}
                        * {font-family: Arial, sans-serif;}
                    </style>
                </head>
                <body>
                    <h1>tis.roncli.com</h1>
                    ${html}
                    <br /><br />Website Version ${version}, ©2004-${year} roncli Productions<br />
                    Bugs? <a href="https://github.com/roncli/tis.roncli.com/issues" target="_blank">Report on GitHub</a>
                </body>
            </html>
        `;
    }
}

/* istanbul ignore if - Ignoring browser code. */
if (typeof module === "undefined") {
    window.IndexView = IndexView;
} else {
    module.exports = IndexView;
}
