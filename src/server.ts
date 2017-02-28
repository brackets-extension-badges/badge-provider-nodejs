import http = require('http');
import url = require('url');
import compression = require('compression');
import cors = require('cors');
import finalhandler = require('finalhandler');
import {Database} from "./database";
import {Updater} from "./updater";

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
        let Router = require('router');

        let router = Router();
        router.use(compression());
        router.use(cors());

        router.param('extension', function (req: any, res: any, next: any, extensionName: string) {
            req.extension = extensionName + 'yeaa';
            next();
        });

        router.get('/:extension/:method(total|last-version|week|day).svg', function (req: any, res: any) {
            // res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end(req.extension + ' | ' + req.params['method']);
        });

        router.get('/*.svg', function (req: any, res: any) {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end('Nope');
        });

        router.get('/', function (req: any, res: any) {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end('Hello World!');
        });


        let server = http.createServer(function (req, res) {
            router(req, res, finalhandler(req, res));
        });

        console.log('Listening on port ' + this.port);
        server.listen(this.port);
        this.updater.dataUpdate();

    }
}