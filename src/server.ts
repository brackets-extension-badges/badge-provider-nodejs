import compression = require('compression');
import express = require('express');
import {BadgeUtils} from './badgeUtils';
import {Database} from './database';
import {View} from './view';

export class WebServer {
    private port: number;
    private db: Database;

    constructor(port: number, db: Database) {
        this.port = port;
        this.db = db;
    }

    public start() {
        let self = this;
        let app = express();
        app.use(compression());

        app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        app.use(function (req: any, res: any, next: any) {
            if (req.url === '/' && typeof req.headers.referer !== 'undefined') {
                let parse = require('url-parse');
                let url = parse(req.headers.referer, true);
                req.url = url.pathname;
            }
            next();
        });

        app.param('extension', function (req: any, res: any, next: any, extensionName: string) {
            let e = self.db.get(extensionName);
            if (e == null) {
                return View.unknownBadge(res);
            }
            req.extension = e;
            next();
        });

        app.get('/:extension/:method(total|last-version|week|day).svg', function (req: any, res: any) {
            res.setHeader('Content-Type', 'image/svg+xml');
            let method = req.params['method'];
            let downloads = BadgeUtils.getDownloadsByMethod(req.extension, method);
            res.end(View.getBadge(downloads, method));
        });

        app.get('/:extension/stats.json', function (req: any, res: any) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            let e = req.extension;
            res.end(JSON.stringify({
                lastVersion: e.lastVersionDownloads,
                name: e.name,
                total: e.totalDownloads,
                week: e.weekDownloads,
            }));
        });

        app.get('/*.svg', function (req: any, res: any) {
            return View.unknownBadge(res);
        });

        app.get('/list.json', function (req: any, res: any) {
            let list = self.db.getExtensionList();
            View.extensionList(res, list);
        });

        app.get('/', function (req: any, res: any) {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end('Hello World!');
        });

        app.listen(this.port, function () {
            console.info('Server listening on port ' + self.port + '!');
        });
    }
}
