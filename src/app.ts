import {Analytics} from './analytics';
import {Database} from './database';
import {WebServer} from './server';
import {Updater} from './updater';

// noinspection JSUnusedGlobalSymbols
export class App {
    private db: Database;
    private updater: Updater;
    private server: WebServer;

    /**
     * Start the application
     * @param env
     */
    public start(env: { [key: string]: any }) {
        let analytics = new Analytics(env);
        this.db = new Database();
        this.updater = new Updater(this.db);
        this.server = new WebServer(env, this.db, analytics);
        this.server.start();
        this.updater.updateData();
        this.cron();
    }

    /**
     * Setup a cron job to update data every X hours
     */
    private cron() {
        let cron = require('node-cron');
        let self = this;
        cron.schedule('0 */2 * * *', function () {
            self.updater.updateData();
        });
    }
}
