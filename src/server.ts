import compression = require('compression');
import fs = require('fs');
import express = require('express');
import http = require('http');
import https = require('https');
import path = require('path');
import {BadgeUtils} from './badgeUtils';
import {Database} from './database';
import {View} from './view';

export class WebServer {
    private ports: {[key: string]: number};
    private db: Database;
    private app: any;

    constructor(ports: {[key: string]: number}, db: Database) {
        this.ports = ports;
        this.db = db;
    }

    public start() {
        this.app = express();

        this.useMiddleware();
        this.decodeParams();
        this.route();
        this.startServer();
    }

    private route(): void {
        let self = this;

        this.app.get('/:extension/:method(total|last-version|week|day).svg', function (req: any, res: any) {
            res.setHeader('Content-Type', 'image/svg+xml');
            let method = req.params['method'];
            let downloads = BadgeUtils.getDownloadsByMethod(req.extension, method);
            res.end(View.getBadge(downloads, method));
        });

        this.app.get('/:extension/stats.json', function (req: any, res: any) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            let e = req.extension;
            res.end(JSON.stringify({
                lastVersion: e.lastVersionDownloads,
                name: e.name,
                total: e.totalDownloads,
                week: e.weekDownloads,
            }));
        });

        this.app.get('/*.svg', function (req: any, res: any) {
            return View.unknownBadge(res);
        });

        this.app.get('/list.json', function (req: any, res: any) {
            let list = self.db.getExtensionList();
            View.extensionList(res, list);
        });

        this.app.get('/', function (req: any, res: any) {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end('Hello World!');
        });
    }

    private useMiddleware(): void {
        this.app.use(compression());

        this.app.use(function (req: any, res: any, next: any) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
    }

    private decodeParams(): void {
        let self = this;

        this.app.param('extension', function (req: any, res: any, next: any, extensionName: string) {
            let e = self.db.get(extensionName);
            if (e == null) {
                return View.unknownBadge(res);
            }
            req.extension = e;
            next();
        });
    }

    private startServer(): void {
        if (fs.existsSync(path.join(__dirname, '../cert', 'chain.pem'))
            && fs.existsSync(path.join(__dirname, '../cert', 'fullchain.pem'))
            && fs.existsSync(path.join(__dirname, '../cert', 'privkey.pem'))
        ) {
            let options = {
                ca: fs.readFileSync(path.join(__dirname, '../cert', 'chain.pem')),
                cert: fs.readFileSync(path.join(__dirname, '../cert', 'fullchain.pem')),
                key: fs.readFileSync(path.join(__dirname, '../cert', 'privkey.pem')),
            };
            https.createServer(options, this.app).listen(this.ports.https);
            console.info('Server listening on port ' + this.ports.https + '!');
        }

        http.createServer(this.app).listen(this.ports.http);
        console.info('Server listening on port ' + this.ports.http + '!');
    }
}
