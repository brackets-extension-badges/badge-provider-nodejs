import compression = require('compression');
import cors = require('cors');
import express = require('express');
import Handlebars = require('handlebars');
import {Database} from "./database";
import {View} from "./view";
import {_total, _lastVersion, _week, _day} from "./badgeUtils";

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

        app.param('extension', function (req: any, res: any, next: any, extensionName: string) {
            let e = self.db.get(extensionName);
            if (e === null) {
                return View.unknownBadge(res);
            }
            req.extension = e;
            next();
        });

        app.get('/:extension/:method(total|last-version|week|day).svg', function (req: any, res: any) {
            res.setHeader('Content-Type', 'image/svg+xml');
            // res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            let method = req.params['method'];
            let e = req.extension;
            let downloads;

            switch (method) {
                case _total:
                    downloads = e.totalDownloads;
                    break;
                case _lastVersion:
                    downloads = e.lastVersionDownloads;
                    break;
                case _week:
                    downloads = e.weekDownloads;
                    break;
                case _day:
                    downloads = e.weekDownloads / 7;
                    break;
                default:
                    downloads = 0;
            }
            res.end(View.getBadge(downloads, method));
        });

        // stats.json route
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
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end('Nope');
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
