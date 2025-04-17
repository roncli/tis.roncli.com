const appInsights = require("applicationinsights"),
    Docker = require("./src/docker"),
    gelfserver = require("graygelf/server");

// MARK: class Index
/**
 * The primary class for the application.
 */
class Index {
    static #docker = new Docker();
    static #logMatch = /(?<ipaddress>\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}) - (?<remoteuser>.+) \[(?<date>\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+\d{2}:\d{2})\] (?<servername>.+) (?<serverport>\d+) "(?<request>(?<method>[a-z]+) (?<url>.+)(?<http>http\/[12]\.[01])|.+)" (?<statuscode>\d{3}) (?<bytessent>\d+) (?<requesttime>\d+(?:.\d+)) "(?<referrer>.+)" "(?<useragent>.+)"/i;
    static #successMatch = /^[23]/;

    // MARK: static startup
    /**
     * Starts up the application.
     * @returns {void}
     */
    static startup() {
        // Setup application insights.
        appInsights.setup();
        appInsights.start();

        const server = gelfserver();

        server.on("message", (gelf) => {
            const tagOverrides = {};
            if (gelf._container_name) {
                tagOverrides.Container = gelf._container_name;
            }

            if (Index.#logMatch.test(gelf.short_message)) {
                const {groups: {ipaddress, remoteuser, date, servername, serverport, request, method, url, http, statuscode, bytessent, requesttime, referrer, useragent}} = Index.#logMatch.exec(gelf.short_message);

                appInsights.defaultClient.trackRequest({name: `${method} ${url}`, url: `${serverport === "443" ? "https" : "http"}://${servername}${url}`, duration: +requesttime * 1000, resultCode: statuscode, success: Index.#successMatch.test(statuscode), time: new Date(date), properties: {application: "tis.roncli.com", container: gelf._container_name || "tisronclicom-logging", ipaddress, remoteuser, serverport: +serverport, request, http, bytessent: +bytessent, referrer, useragent}});
            } else {
                appInsights.defaultClient.trackTrace({message: gelf.short_message, properties: {application: "tis.roncli.com", container: gelf._container_name || "tisronclicom-logging"}});
            }
        });

        const port = process.env.PORT || 12201;
        server.listen(port);
        console.log(`Server PID ${process.pid} listening on port ${port}.`);

        if (+process.env.APPINSIGHTS_PERFORMANCE_METRICS) {
            Index.#docker.start();
        }
    }
}

Index.startup();
