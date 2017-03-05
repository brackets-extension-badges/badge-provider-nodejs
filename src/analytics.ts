import fs = require('fs');
import path = require('path');
import request = require('request');
import uuid = require('uuid');

export class Analytics {

    private activated: boolean;
    private uuid: string;
    private tid: string;

    constructor() {
        this.uuid = uuid.v4();

        if (!fs.existsSync(path.join(__dirname, '../analytics', 'tid'))) {
            this.activated = false;
            return;
        }

        this.tid = fs.readFileSync(path.join(__dirname, '../analytics', 'tid'), 'utf8').replace(/\s/g, '');
        this.activated = true;
        console.info('Analytics activated with tid = ' + this.tid);
    }

    public track(req: any, method: string = null): void {
        if (!this.activated) {
            return;
        }

        let params = {
            cid: this.uuid,
            dp: req.url,
            t: 'pageview',
            tid: this.tid,
            v: 1,
        } as {[key: string]: number|string};

        if (method != null) {
            params['cg1'] = method;
        }

        let options = {
            form: params,
            headers: {
                'User-Agent': req.headers['user-agent'],
            },
            url: 'https://www.google-analytics.com/collect',
        };

        request.post(options);
    }
}
