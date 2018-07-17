import request = require('request');
import uuid = require('uuid');

/**
 * Google Analytics
 */
export class Analytics {

    private uuid: string;
    private tid: string;

    /**
     * When starting, get GA tracking id and generate a new UUID
     */
    constructor(env: any) {
        this.uuid = uuid.v4();

        if (!env.gaTrackingID) {
            this.tid = '';
            return;
        }

        this.tid = env.gaTrackingID;
        console.info('Analytics enabled');
    }

    /**
     * Send a 'page view' event.
     * @param req
     * @param method
     */
    public track(req: any, method: string = null): void {
        if (this.tid === '' || typeof req.query.do_not_track !== 'undefined') {
            return;
        }

        let params = {
            cid: this.uuid,
            dp: req.url,
            t: 'pageview',
            tid: this.tid,
            v: 1,
        } as { [key: string]: number | string };

        if (method) {
            params['cg1'] = 'svg/' + method;
        }

        let options = {
            form: params,
            headers: {
                'User-Agent': req.headers['user-agent'],
            },
            url: 'https://www.google-analytics.com/collect',
        };

        request.post(options, function (error: any) {
            if (error) {
                console.error('HTTPS Post error: ' + error);
            }
        });
    }
}
