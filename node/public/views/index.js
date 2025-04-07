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
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>tis.roncli.com</title>
                    <meta name="og:title" content="tis.roncli.com" />
                    <meta name="og:type" content="website" />
                    <meta name="og:url" content="${protocol}://${host}${encodeURI(originalUrl)}" />
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:creator" content="@roncli" />
                    <link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon"> 
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

if (typeof module === "undefined") {
    window.IndexView = IndexView;
} else {
    module.exports = IndexView;
}
