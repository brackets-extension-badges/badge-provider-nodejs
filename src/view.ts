import path = require('path');
import {BadgeUtils, DOWNLOADS_WIDTH} from './badgeUtils';

/**
 * Things to return at web requests
 */
export class View {

    /**
     * Get a .svg badge
     * @param downloads - number to display
     * @param method
     * @returns {any}
     */
    public static getBadge(downloads: number, method: string): string {
        let text = BadgeUtils.formatNumber(downloads);

        let leftWidth = DOWNLOADS_WIDTH + 10;
        let rightWidth = BadgeUtils.measureTextWidth(text) + 10 + BadgeUtils.getSuffixWidth(method);

        text += BadgeUtils.getSuffix(method);

        let render = require('../views/badge');
        return render({leftWidth, rightWidth, text});
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
