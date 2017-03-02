import http = require('http');
import https = require('https');
import dateFormat = require('dateformat');
import fs = require('fs');
import {Database, Extension} from "./database";

const host = 'brackets-registry.aboutweb.com';
const path = '/registryList';

export class Updater {
    private db: Database;
    private weekDays: string[];

    constructor(db: Database) {
        this.db = db;
        this.weekDays = [];
    }

    public updateData() {
        let self = this;
        let list: {[key: string]: number} = {};
        self.weekDays = Updater.getWeekDays();

        this.getNewData(function (results: any) {
            results = results.registry;

            for (let i in results) {
                let extension;
                if (results.hasOwnProperty(i)) {
                    extension = self.hydrate(results[i]);
                    self.db.upsert(extension);
                    list[extension.name] = extension.totalDownloads;
                }
            }

            self.db.saveExtensionList(JSON.stringify(list));
            console.log('Data updated :  ' + results.length + ' rows');
        });
    }

    private getNewData(callback: any) {
        let options = {
            hostname: host,
            port: 443,
            path: path,
            method: 'GET',
            rejectUnauthorized: false,
            headers: {
                'Accept': 'application/json'
            }
        };

        let httpCallback = function (res: http.IncomingMessage) {
            if (res.statusCode != 200) {
                return {};
            }

            let results = '';
            res.on('data', function (chunk) {
                results += chunk;
            });

            res.on('end', function () {
                callback(JSON.parse(results));
            });
        };

        let req = https.request(options, httpCallback);
        req.end();

        req.on('error', (e) => {
            console.error(e);
        });
    }

    private hydrate(result: any): Extension {
        let e = {
            name: result.metadata.name,
            totalDownloads: 0,
            lastVersionDownloads: 0,
            weekDownloads: 0,
        };
        e.totalDownloads = result.totalDownloads;

        if (typeof result.versions != 'undefined') {
            e.lastVersionDownloads = result.versions[result.versions.length - 1].downloads;
        }

        e.weekDownloads = this.getWeekDownloads(result.recent);

        return e;
    }

    private getWeekDownloads(recent: any) {
        let count = 0;
        for (let i = 0; i < this.weekDays.length; i++) {
            if (typeof recent[this.weekDays[i]] != 'undefined') {
                count += recent[this.weekDays[i]];
            }
        }
        return count;
    }

    static getWeekDays() {
        let day = new Date();
        let weekDays = [];

        for (let x = 1; x <= 7; x++) {
            weekDays.push(dateFormat(day, "yyyymmdd"));
            day.setDate(day.getDate() - 1);
        }

        return weekDays;
    }
}

