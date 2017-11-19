import path = require('path');
import {BadgeUtils, DOWNLOADS_WIDTH, VERSION_WIDTH} from './badgeUtils';

/**
 * Things to return at web requests
 */
export class View {

    /**
     * Get a .svg badge with the number of downloads
     * @param downloads - number to display
     * @param method
     * @returns string
     */
    public static getDownloadsBadge(downloads: number, method: string): string {
        let text = BadgeUtils.formatNumber(downloads);

        let leftWidth = DOWNLOADS_WIDTH + 10;
        let rightWidth = BadgeUtils.measureTextWidth(text) + 10 + BadgeUtils.getSuffixWidth(method);

        text += BadgeUtils.getSuffix(method);

        let render = require('../views/downloads');
        return render({leftWidth, rightWidth, text});
    }

    public static getVersionBadge(version: string): string {
        let leftWidth = VERSION_WIDTH + 10;
        let rightWidth = BadgeUtils.measureTextWidth(version) + 10;

        let render = require('../views/version');
        return render({leftWidth, rightWidth, version});
    }

    /**
     * Get the badge version of a "404 - not found"
     * @param res
     */
    public static unknownBadge(res: any): void {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.sendFile(path.join(__dirname, '../views', 'unknown.svg'));
    }

    /**
     * Get all the extensions with total downloads as a json.
     * @param res
     * @param list
     */
    public static extensionList(res: any, list: { [key: string]: number }): void {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.json(list);
    }
}
