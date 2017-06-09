import compression = require('compression');
import fs = require('fs');
import express = require('express');
import http = require('http');
import https = require('https');
import path = require('path');
import {Analytics} from './analytics';
import {BadgeUtils} from './badgeUtils';
import {Database} from './database';
import {View} from './view';

/**
 * Web server management
 */
export class WebServer {
    private analytics: Analytics;
    private app: any;
    private db: Database;
    private env: {[key: string]: any};

    constructor(env: {[key: string]: any}, db: Database, analytics: Analytics) {
        this.analytics = analytics;
        this.db = db;
        this.env = env;
    }

    /**
     * Create the web server and start it
     */
    public start() {
        this.app = express();

        this.useMiddleware();
        this.decodeParams();
        this.route();
        this.startServer();
    }

    /**
     * Define the server routes
     */
    private route(): void {
        let self = this;

        this.app.get('/:extension/:method(total|last-version|week|day).svg', function (req: any, res: any) {
            res.setHeader('Content-Type', 'image/svg+xml');
            let method = req.params['method'];
            let downloads = BadgeUtils.getDownloadsByMethod(req.extension, method);
            res.end(View.getBadge(downloads, method));
            self.analytics.track(req, method);
        });

        this.app.get('/:extension/stats.json', function (req: any, res: any) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            let e = req.extension;
            res.end(JSON.stringify({
                /* tslint:disable */
                name: e.name,
                total: e.totalDownloads,
                lastVersion: e.lastVersionDownloads,
                week: e.weekDownloads,
                /* tslint:enable */
            }));
            self.analytics.track(req, 'stats');
        });

        this.app.get('/*.svg', function (req: any, res: any) {
            View.unknownBadge(res);
            self.analytics.track(req);
        });

        this.app.get('/list.json', function (req: any, res: any) {
            let list = self.db.getExtensionList();
            View.extensionList(res, list);
            self.analytics.track(req);
        });

        this.app.get('/', function (req: any, res: any) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end('<script>window.location.replace(\'https://brackets-extension-badges.github.io\');</script>');
            self.analytics.track(req);
        });
    }

    /**
     * Define the server middleware
     */
    private useMiddleware(): void {
        this.app.use(compression());

        this.app.use(function (req: any, res: any, next: any) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.header('Expires', new Date(Date.now() + 900 * 1000).toUTCString());
            next();
        });
    }

    /**
     * Find the good extension in database from URL
     */
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

    /**
     * Start the server, with HTTPS if certificates are available
     */
    private startServer(): void {
        let certDir = this.env.certDir.toString();
        if (fs.existsSync(path.join(certDir, 'chain.pem'))
            && fs.existsSync(path.join(certDir, 'fullchain.pem'))
            && fs.existsSync(path.join(certDir, 'privkey.pem'))
        ) {
            let options = {
                ca: fs.readFileSync(path.join(certDir, 'chain.pem')),
                cert: fs.readFileSync(path.join(certDir, 'fullchain.pem')),
                key: fs.readFileSync(path.join(certDir, 'privkey.pem')),
            };
            https.createServer(options, this.app).listen(this.env.portHttps, this.env.hostnameHttps.toString());
            console.info('Server listening on port ' + this.env.portHttps + '!');
        }

        http.createServer(this.app).listen(this.env.port, this.env.hostname.toString());
        console.info('Server listening on port ' + this.env.port + '!');
    }
}
