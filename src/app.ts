import {Analytics} from './analytics';
import {Database} from './database';
import {WebServer} from './server';
import {Updater} from './updater';

// noinspection JSUnusedGlobalSymbols
export class App {
    private db: Database;
    private updater: Updater;
    private server: WebServer;

    public start(options: {[key: string]: any[]}) {
        let analytics = new Analytics();
        this.db = new Database();
        this.updater = new Updater(this.db);
        this.server = new WebServer(options, this.db, analytics);
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
