# tis.roncli.com
The site that allows users to search old Trax in Space 1 files.  You can see this site in action at [https://tis.roncli.com](https://tis.roncli.com).

More generally, this site basically functions as a file repository.  Azure Application Insights is used for logging.  Files are loaded in via an Azure Storage file share, and any accompanying html that is to be displayed on a directory's page is under the corresponding path in the `/node/html` directory and is listed as `index.htm`.

## Usage

This project is deployed into an Azure Container App.

If you use this for yourself, you'll want to go into the `package.json` and `index.js` files and the `html` directory, remove the tis.roncli.com-specific content, and replace it with your own.

You need four files under the following environment variables, which you can place in an `.env` file in the root of the4 directory.  It should contain the following:

```sh
PORT=8080
NODE_ENV=production
APPINSIGHTS_CONNECTIONSTRING=InstrumentationKey=...
USE_AZURE_FILE_STORAGE=0
```

If you set `USE_AZURE_FILE_STORAGE` to 0, then the application will use the local `files` directory for files to serve.

If you set `USE_AZURE_FILE_STORAGE` to 1, then you will need to mount a file share to the `/mnt/files` directory.  This needs to be done in Azure by mounting a volume to the container itself.

To run the application locally, set `USE_AZURE_FILE_STORAGE` to 0, have Docker installed, and run the following Docker commands from the root of the project:

```sh
docker build -t tis.roncli.com .
docker run -d -p 8080:8080 --env-file .env --name tis-roncli-com tis-roncli-com
```

## Version History

### v4.0.1 - 10/5/2025
* Fixed bug with directory paths not working when missing the trailing slash.
* Package updates.

### v4.0.0 - 9/28/2025
* Updated to use Azure Container Apps instead of Docker.
* Fixed bug with being unable to download files.
* Package updates.

### v3.0.1 - 9/25/2025
* Fix path traversal attempts throwing errors.
* Package updates.

### v3.0.0 - 4/7/2025
* Major refactor.
* Package updates.

### v2.0.15 - 11/15/2023
* Package updates.

### v2.0.14 - 9/14/2023
* Package updates.

### v2.0.13 - 8/1/2023
* Package updates.

### v2.0.12 - 5/23/2023
* Package updates.

### v2.0.11 - 12/18/2022
* Package updates.

### v2.0.10 - 8/26/2022
* Package updates.

### v2.0.9 - 5/22/2022
* Package updates.

### v2.0.8 - 3/11/2022
* Package updates.

### v2.0.7 - 12/11/2021
* Package updates.

### v2.0.6 - 11/21/2021
* Package updates.

### v2.0.5 - 10/3/2021
* Package updates.

### v2.0.4 - 8/24/2021
* Make Azure File Storage optional.  If not using Azure File Storage, just dump all the files to be available for download into `/node/files/`.
* Make Azure Application Insights optional.

### v2.0.3 - 5/2/2021
* Increased download limit to 1000 per 12 hours per IP.
* Added optional Docker metrics logged to Application Insights.

### v2.0.2 - 9/3/2020
* Added tsconfig.json files.
* Added and updated dependencies.
* Fixed some Application Insights calls.
* Fixed some `fs` constants.

### v2.0.1 - 8/27/2020
* Added Application Insights logging via the logging container, which is a gelf server that Docker can use to log console messages.  Application Insights is now required to function.
* Update nginx container for extended logging.
* Fixed bug with IP address trying to forward to the SSL version of the IP address, now it forwards to the SSL version of the domain.
* Always create and copy the nginx config, regardless if it already exists.
* Refactor of index.js in the node container, includes Application Insights logging for exceptions.

### v2.0.0 - 8/25/2020
* Updated packages, and updated for use in Docker.

### v1.0.1 - 1/4/2019
* Updated packages.

### v1.0.0 - 5/5/2018
* Initial version.
