import compression = require('compression');
import cors = require('cors');
import express = require('express');
import {Database} from "./database";
import {View} from "./view";
import {BadgeUtils} from "./badgeUtils";

export class WebServer {
    private port: number;
    private db: Database;

    constructor(port: number, db: Database) {
        this.port = port;
        this.db = db;
    }

    start() {
        let self = this;
        let app = express();
        app.use(compression());
        app.use(cors());

        app.use(function (req: any, res: any, next: any) {
            if (req.url === '/' && typeof req.headers.referer != 'undefined') {
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
                'name': e.name,
                'total': e.totalDownloads,
                'lastVersion': e.lastVersionDownloads,
                'week': e.weekDownloads
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
            console.log('Server listening on port ' + self.port + '!')
        });
    }
}
