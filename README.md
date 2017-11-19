[![Build Status](https://travis-ci.org/brackets-extension-badges/badge-provider-nodejs.svg?branch=master)](https://travis-ci.org/brackets-extension-badges/badge-provider-nodejs)

# Node.js badge provider

![brackets-extension-badges](https://cloud.githubusercontent.com/assets/17952318/24578041/b908d05e-16d8-11e7-9152-47b66656ee0e.gif)

---

## [<p align="center">brackets-extension-badges.github.io</p>](https://brackets-extension-badges.github.io)

---

**Brackets extension badges** are download counters for your [Brackets](https://github.com/adobe/brackets) extensions, as Adobe doesn't provide any official way to retrieve statistics, even for your own extension.

This repository is the Node.js version of the server, which manages both statistics databases and `.svg` badge generation.

Currently available at [badges.ml](https://badges.ml/list.json)

## Routes

- `/` - Redirects to [brackets-extension-badges.github.io](https://brackets-extension-badges.github.io)
- `/EXTENSION_NAME/version.svg` - A badge showing the version number
- `/EXTENSION_NAME/total.svg` - A badge showing the total number of downloads
- `/EXTENSION_NAME/last-version.svg` - A badge showing number of downloads for the latest version of the extension
- `/EXTENSION_NAME/week.svg` - A badge showing the number of downloads during the last 7 days
- `/EXTENSION_NAME/day.svg` - A badge showing the average downloads per day, based on the last 7 days
- `/list.json` - A list of all extensions with total download numbers.

## Finding the extension name

The *name* of an extension is defined in the `package.json` file, at the root of the extension.

## Deployment

The badge provider is very light, and doesn't need any third-party database. 

Deploying it is super fast and easy, you just need `git` and `Node.js`:

```sh
# Clone the project
git clone https://github.com/brackets-extension-badges/badge-provider-nodejs && cd badge-provider-nodejs

# Install dependencies
npm install

# Install and run Gulp
npm install -g gulp
gulp

# Run the badge provider
npm start
```

The data is refreshed every time the server starts and every 2 hours. Everything is saved in `db.json`, so make sure you have write access.

## HTTPS support

Once you have generated a SSL certificate, you can enable HTTPS with one of the following methods:

Method 1: use the the `CERT_DIR` environment variable to define the certificates location

Method 2: Copy the following files into the `/cert` directory:
- chain.pem
- fullchain.pem
- privkey.pem

Just restart the server, and the provider will listen to both the ports 80 and 443.

## Environment

The server's behaviour can be customized by setting the environment variables used in `index.js`, such as ports, hostnames, or certificates location.

## Gulp

Running `gulp` will achieve two things:
- It will compile the typescript from the /src folder to javascript
- It will compile the doT.js template

You should run gulp every time the code changes.

Running `gulp tslint` will validate the quality of your typescript code.

