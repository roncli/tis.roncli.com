# tis.roncli.com
The site that allows users to search old Trax in Space 1 files.  You can see this site in action at [http://tis.roncli.com](http://tis.roncli.com).

More generally, this site basically functions as a file repository.  Files are loaded in via an Azure Storage file share, and any accompanying html that is to be displayed on a directory's page is under the corresponding path in the `/node/html` directory and is listed as `index.htm`.

## Usage

If you use this for yourself, you'll want to go into the `/docker-compose.yml`, `/node/package.json`, and `/node/index.js` files and the `/node/html` directory, remove the tis.roncli.com-specific content, and replace it with your own.

You need three files under the `/secrets` directory: `FILES_URI`, `FILES_USERNAME`, and `FILES_PASSWORD`.  These should respectively contain the file share URI (Example, `//your-storage-url.file.core.windows.net/your-share-name`), the name of the resource, and the storage key.

To run the application, have Docker and Docker Compose installed, and run `docker-compose up -d`.

## Version History

### 2.0.0 - 8/25/2020

* Updated packages, and updated for use in Docker.

### 1.0.1 - 1/4/2019

* Updated packages.

### 1.0.0 - 5/5/2018

* Initial version.