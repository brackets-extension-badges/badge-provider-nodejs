import dateFormat = require('dateformat');
import http = require('http');
import https = require('https');
import {Database, Extension} from './database';

const host = 'brackets-registry.aboutweb.com';
const path = '/registryList';

/**
 * Everything about fetching data
 */
export class Updater {
    private db: Database;
    private weekDays: string[];

    constructor(db: Database) {
        this.db = db;
        this.weekDays = [];
    }

    /**
     * Fetch the data from the registry, then save it in database
     */
    public updateData() {
        let self = this;
        let list: { [key: string]: number } = {};
        self.weekDays = getWeekDays();

        this.getNewData(function (results: any) {
            results = results.registry;

            for (let i in results) {
                if (results.hasOwnProperty(i)) {
                    let extension;
                    if (results.hasOwnProperty(i)) {
                        extension = self.hydrate(results[i]);
                        // Upsert in DB
                        self.db.upsert(extension);
                        list[extension.name] = extension.total;
                    }
                }
            }
            self.db.saveExtensionList(list);
            console.info('Data updated :  ' + results.length + ' rows');
        });
    }

    /**
     * Fetch data from the registry
     * @param callback
     */
    private getNewData(callback: any) {
        let options = {
            headers: {
                Accept: 'application/json',
            },
            hostname: host,
            method: 'GET',
            path,
            port: 443,
            rejectUnauthorized: false,
        };

        let httpCallback = function (res: http.IncomingMessage) {
            if (res.statusCode !== 200) {
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
            console.error('HTTPS Get error: ' + e);
        });
    }

    /**
     * Cast a result (undefined type) into an Extension
     * @param result
     * @returns {{lastVersion: number, name, total: number, week: number}}
     */
    private hydrate(result: any): Extension {
        let e = {
            lastVersion: 0,
            name: result.metadata.name,
            total: 0,
            version: '',
            week: 0,
        };
        e.total = result.totalDownloads;

        if (result.versions && result.versions[result.versions.length - 1].downloads) {
            e.lastVersion = result.versions[result.versions.length - 1].downloads;
            e.version = result.versions[result.versions.length - 1].version;
        }

        e.week = this.getWeekDownloads(result.recent);
        return e;
    }

    /**
     * Compute downloads of the week
     * @param recent
     * @returns {number}
     */
    private getWeekDownloads(recent: any) {
        let count = 0;
        for (let i of this.weekDays) {
            if (recent && recent[i]) {
                count += recent[i];
            }
        }
        return count;
    }
}

/**
 * Create an array of the last 7 days formatted as YYYYMMDD
 * @returns {Array}
 */
function getWeekDays() {
    let day = new Date();
    let weekDays = [];

    for (let x = 1; x <= 7; x++) {
        weekDays.push(dateFormat(day, 'yyyymmdd'));
        day.setDate(day.getDate() - 1);
    }

    return weekDays;
}
