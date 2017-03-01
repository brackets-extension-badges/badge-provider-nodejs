import path = require('path')
import {BadgeUtils, _downloadsWidth} from "./badgeUtils";

export class View {
    public static unknownBadge(res: any) {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.sendFile(path.join(__dirname, '../views', 'unknown.svg'));
    }

    public static getBadge(downloads: number, method: string): string {
        let text = BadgeUtils.formatNumber(downloads);

        let leftWidth = _downloadsWidth + 10;
        let rightWidth = BadgeUtils.measureTextWidth(text) + 10 + BadgeUtils.getSuffixWidth(method);

        text += BadgeUtils.getSuffix(method);

        let render = require('../views/badge');
        return render({leftWidth, rightWidth, text});
    }
}