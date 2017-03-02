import path = require('path');
import {BadgeUtils, DOWNLOADS_WIDTH} from './badgeUtils';

export class View {
    public static getBadge(downloads: number, method: string): string {
        let text = BadgeUtils.formatNumber(downloads);

        let leftWidth = DOWNLOADS_WIDTH + 10;
        let rightWidth = BadgeUtils.measureTextWidth(text) + 10 + BadgeUtils.getSuffixWidth(method);

        text += BadgeUtils.getSuffix(method);

        let render = require('../views/badge');
        return render({leftWidth, rightWidth, text});
    }

    public static unknownBadge(res: any): void {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.sendFile(path.join(__dirname, '../views', 'unknown.svg'));
    }

    public static extensionList(res: any, list: string): void {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(list);
    }
}
