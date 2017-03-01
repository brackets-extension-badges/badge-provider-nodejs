import http = require('http');
import url = require('url');
import compression = require('compression');
import cors = require('cors');
import finalhandler = require('finalhandler');
import express = require('express')
import path = require('path')
import {Database} from "./database";
import {Updater} from "./updater";
import {extension} from "mime";

//noinspection JSUnusedGlobalSymbols
export class WebServer {

    private port: number;
    private db: Database;
    private updater: Updater;

    //noinspection JSUnusedGlobalSymbols
    constructor(port: number) {
        this.port = port;
        this.db = new Database();
        this.updater = new Updater(this.db);
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
            req.extension = extensionName + 'yeaa';
            next();
        });

        app.get('/:extension/:method(total|last-version|week|day).svg', function (req: any, res: any) {
            // res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end(req.extension + ' | ' + req.params['method']);
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

        this.updater.dataUpdate();
    }
}

class View {
    static unknownBadge(res: any) {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.sendFile(path.join(__dirname, '../views', 'unknown.svg'));
    }
}