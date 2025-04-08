const compression = require("compression"),
    express = require("express"),
    hotRouter = require("hot-router"),
    Log = require("@roncli/node-application-insights-logger"),
    path = require("path");

// MARK: async function startup
(async function startup() {
    // Setup application insights.
    if (process.env.APPINSIGHTS_CONNECTIONSTRING) {
        Log.setupApplicationInsights(process.env.APPINSIGHTS_CONNECTIONSTRING, {application: "tis.roncli.com", container: "tisronclicom-node"});
    }

    console.log("Starting up...");

    // Set title.
    if (process.platform === "win32") {
        process.title = "tis.roncli.com";
    } else {
        process.stdout.write("\x1b]2;tis.roncli.com\x1b\x5c");
    }

    // Setup express app.
    const app = express();

    // Remove powered by.
    app.disable("x-powered-by");

    // Initialize middleware stack.
    app.use(compression());

    // Trust proxy to get correct IP from web server.
    app.enable("trust proxy");

    // Setup hot-router.
    const router = new hotRouter.Router();
    router.on("error", (data) => {
        Log.error(data.message, {err: data.err, req: data.req});
    });
    try {
        app.use("/", await router.getRouter(path.join(__dirname, "web"), {hot: false}));
    } catch (err) {
        Log.critical("Could not set up routes.", {err});
    }

    app.use((err, req, res, next) => {
        router.error(err, req, res, next);
    });

    // Startup webserver
    const port = process.env.PORT || 3030;

    app.listen(port);

    Log.info(`Server PID ${process.pid} listening on port ${port}.`);
}());
