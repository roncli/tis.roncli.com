# Copilot Instructions for tis.roncli.com

## Project Overview
- **tis.roncli.com** is a file repository and search site for Trax in Space 1 files, running at [https://tis.roncli.com](https://tis.roncli.com).
- The project is containerized using Docker Compose and consists of multiple services: `node` (main app), `nginx` (web server), `logging`, and `certbot`.
- Files are served from Azure Storage file shares, with secrets and configuration in the `/secrets` directory.
- HTML content for directories is stored in `/node/html/{directory}/index.htm` and displayed on directory pages.

## Key Components
- **/node/**: Main Node.js application. Contains:
  - `index.js`: Entry point, handles server logic and routing.
  - `files/`: File storage, mirrors Azure File Share structure.
  - `html/`: Directory-specific HTML content.
  - `public/`: Static assets (JS, views, etc.).
  - `types/`: TypeScript type definitions.
- **/logging/**: Handles logging, integrates with Azure Application Insights.
- **/nginx/**: Reverse proxy and static file serving.
- **/certbot/**: Handles SSL certificate management.
- **/secrets/**: Required secrets for Azure and Application Insights.

## Developer Workflows
- **Build & Run**: Use `docker-compose up --build -d` to build and start all services.
- **Secrets**: Place `APPINSIGHTS_CONNECTIONSTRING`, `FILES_URI`, `FILES_USERNAME`, and `FILES_PASSWORD` in `/secrets`.
- **Local Development**: If not using Azure File Storage, place files directly in `/node/files/`.
- **Logging**: All logs are routed through the logging container to Application Insights.

## Project Conventions & Patterns
- Directory HTML is always named `index.htm` and must be placed in the matching path under `/node/html/`.
- Views for error and directory pages are in `/node/public/views/`.
- TypeScript is used for type safety, but main logic is in JavaScript.
- Environment-specific configuration is handled via Docker secrets and environment variables.
- Application Insights is required for production logging.

## Integration Points
- **Azure Storage**: Used for file storage and retrieval.
- **Azure Application Insights**: Used for logging and monitoring.
- **Docker Compose**: Orchestrates all services.

## Examples
- To add a new directory with custom HTML, create `/node/html/{NewDir}/index.htm` and place files in `/node/files/{NewDir}/`.
- To update error pages, edit the corresponding file in `/node/public/views/`.

Refer to `README.md` for more details on setup and version history.
