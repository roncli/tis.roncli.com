# Copilot Instructions for `tis.roncli.com`

This project is a Node.js/Express web application for searching and serving files from a Trax in Space 1 archive. It is designed for deployment in Azure Container Apps, with optional Azure File Storage integration.

## Architecture Overview
- **Entry Point:** `index.js` initializes the Express app, sets up middleware, and configures routing using `hot-router`.
- **Routing:**
  - All main routes are defined as classes in `web/` (e.g., `directory.js`, `file.js`, `search.js`).
  - Each route class extends `hot-router`'s `RouterBase` and implements static `get` methods for handling requests.
- **Views:**
  - HTML is generated server-side using view classes in `public/views/` (e.g., `directory.js`, `search.js`, `404.js`).
  - Views use a custom `Encoding` utility (`public/js/encoding.js`) for safe HTML output.
- **File Storage:**
  - By default, files are served from the local `files/` directory.
  - If `USE_AZURE_FILE_STORAGE=1`, files are served from a mounted Azure File Share at `/mnt/files` (see `start.sh`).
- **Error Handling:**
  - Custom error pages for 400, 404, 405, 429, and 500 are implemented as view classes.
  - Download rate limiting is enforced in `web/file.js` (1000 downloads per IP per 12 hours).
- **Logging:**
  - Uses `@roncli/node-application-insights-logger` for logging to Azure Application Insights if configured.

## Developer Workflows
- **Local Development:**
  - Use `USE_AZURE_FILE_STORAGE=0` in `.env` to serve files from the local `files/` directory.
  - Start the app with `node index` or via Docker using `start.sh`.
- **Docker Build/Run:**
  - `docker build -t tis.roncli.com .`
  - `docker run -d -p 8080:8080 --env-file .env --name tis-roncli-com tis-roncli-com`
- **Environment Variables:**
  - `PORT`, `NODE_ENV`, `APPINSIGHTS_CONNECTIONSTRING`, `USE_AZURE_FILE_STORAGE` (see `README.md` for details).
- **Reinstalling Dependencies:**
  - Use `npm run reinstall` to clean and reinstall node modules.

## Project Conventions & Patterns
- **Routing:**
  - Route classes in `web/` define static `route` and `get` methods. Use regex or catch-all patterns for flexible routing.
- **Views:**
  - All HTML output is generated via view classes; avoid inline HTML in route handlers.
- **Encoding:**
  - Always use the `Encoding` class for HTML and attribute encoding in views.
- **Error Handling:**
  - Use the appropriate view class for error responses (e.g., `NotFoundView`, `BadRequestView`).
- **Sorting:**
  - Directory and search results are sorted with directories first, then files, then by name.
- **Testing:**
  - No formal test suite is present; manual testing is expected.

## Key Files & Directories
- `index.js` – App entry point and main setup
- `web/` – Route handlers (directory, file, search)
- `public/views/` – HTML view templates
- `public/js/encoding.js` – HTML/attribute encoding utility
- `files/` – Local file storage (or symlink to Azure File Share)
- `start.sh` – Startup script for Docker/production
- `Dockerfile` – Container build instructions

## Integration Points
- **Azure Application Insights:** Logging if `APPINSIGHTS_CONNECTIONSTRING` is set.
- **Azure File Storage:** Optional, controlled by `USE_AZURE_FILE_STORAGE`.
- **hot-router:** Used for modular, class-based routing.

## License
This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.

---

For questions or issues, see the [README.md](../README.md) or [GitHub Issues](https://github.com/roncli/tis.roncli.com/issues).
