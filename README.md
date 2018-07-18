
# Badge provider

[![Build Status](https://img.shields.io/travis/brackets-extension-badges/badge-provider-nodejs.svg?branch=master&style=flat-square)](https://travis-ci.org/brackets-extension-badges/badge-provider-nodejs)
[![License](https://img.shields.io/badge/license-Apache_2.0-f49068.svg?style=flat-square)](https://raw.githubusercontent.com/bokub/git-history-editor/master/LICENSE)

> The back-end service powering [brackets-extension-badges.github.io](https://brackets-extension-badges.github.io)

[![brackets-extension-badges](https://user-images.githubusercontent.com/17952318/33060113-6fa50e88-ce97-11e7-9694-e282b634ce9b.png)](https://brackets-extension-badges.github.io)


**Brackets extension badges** are download counters for your [Brackets](https://github.com/adobe/brackets) extensions

This repository is the node.js version of the server, which manages both statistics databases and `.svg` badge generation.

Currently deployed at [badges.ml](https://badges.ml/list.json) using [▲now](http://zeit.co/now)

## Finding an extension name

The **name** of an extension is defined in the `package.json` file, at the root of the extension.

## Routes

- `/` - Redirects to [brackets-extension-badges.github.io](https://brackets-extension-badges.github.io)
- `/EXTENSION_NAME/version.svg` - A badge showing the version number
- `/EXTENSION_NAME/total.svg` - A badge showing the total number of downloads
- `/EXTENSION_NAME/last-version.svg` - A badge showing number of downloads for the latest version of the extension
- `/EXTENSION_NAME/week.svg` - A badge showing the number of downloads during the last 7 days
- `/EXTENSION_NAME/day.svg` - A badge showing the average downloads per day, based on the last 7 days
- `/list.json` - A list of all extensions with total download numbers.

## Deployment

The badge provider is very light, and doesn't need any third-party database. 

Deploying it is super fast and easy, you just need `git` and `node.js`:

```sh
# Clone the project
git clone https://github.com/brackets-extension-badges/badge-provider-nodejs && cd badge-provider-nodejs

# Install dependencies
npm i

# Build the project
npm run build

# Choose a port (default to 80)
export PORT=80

# Run the badge provider
npm start
```

The data is refreshed every time the server starts and every 2 hours. Everything is saved in RAM, which means the data
is erased when the server stops.

## Building

Running `npm run build` will achieve two things:
- It will compile the typescript from the /src folder to javascript
- It will compile the doT.js template

You should build every time the code changes.

Running `npm test` will validate the quality of your typescript code.

## License

Apache-2.0 © [Boris K](https://github.com/bokub)
