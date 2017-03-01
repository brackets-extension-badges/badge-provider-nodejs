import {Database} from "./database";
import {Updater} from "./updater";
import {WebServer} from "./server";

// noinspection JSUnusedGlobalSymbols
export class App {
    private db: Database;
    private updater: Updater;
    private server: WebServer;

    public start(port: number) {
        this.db = new Database();
        this.updater = new Updater(this.db);
        this.server = new WebServer(port, this.db);
        this.server.start();
        this.updater.updateData();
        this.cron();
    }

    private cron(){
        let cron = require('node-cron');
        let self = this;
        cron.schedule('* */6 * * *', function(){
            self.updater.updateData();
        });
    }


}