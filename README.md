# tis.roncli.com
The site that allows users to search old Trax in Space 1 files.  You can see this site in action at [http://tis.roncli.com](http://tis.roncli.com).

More generally, this site basically functions as a file repository.  Files are dumped into the `/files` directory, and any accomponying html that is to be displayed on a directory's page is under the corresponding path in the `/html` directory and is listed as `index.htm`.

## Usage

If you use this for yourself, you'll want to go into `index.js` and the `/html` directory, remove the tis.roncli.com-specific content, and replace it with your own.  Next, just dump the files you wish to be available on your website, directory structure and all, into the `/files` directory.

To install the required node modules, run the standard `npm install`.

To run the application, set your `port` environment variable to the port you wish to run, and then run `node index`.

## Version History

### 2.0.0 - 8/25/2020

* Updated packages, and updated for use in Docker.

### 1.0.1 - 1/4/2019

* Updated packages.

### 1.0.0 - 5/5/2018

* Initial version.