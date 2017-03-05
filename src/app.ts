import {Database} from './database';
import {WebServer} from './server';
import {Updater} from './updater';

// noinspection JSUnusedGlobalSymbols
export class App {
    private db: Database;
    private updater: Updater;
    private server: WebServer;

    public start(ports: {[key: string]: number}) {
        this.db = new Database();
        this.updater = new Updater(this.db);
        this.server = new WebServer(ports, this.db);
        this.server.start();
        this.updater.updateData();
        this.cron();
    }

    private cron() {
        let cron = require('node-cron');
        let self = this;
        cron.schedule('0 */6 * * *', function () {
            self.updater.updateData();
        });
    }
}
