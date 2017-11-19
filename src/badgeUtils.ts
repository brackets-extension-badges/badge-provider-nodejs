import numeral = require('numeral');
import {Extension} from './database';

export const TOTAL = 'total';
export const LAST_VERSION = 'last-version';
export const WEEK = 'week';
export const DAY = 'day';

const TOTAL_SUFFIX = ' total';
const LAST_VERSION_SUFFIX = ' latest version';
const WEEK_SUFFIX = '/week';
const DAY_SUFFIX = '/day';

const TOTAL_WIDTH = 28.837;
const LAST_VERSION_WIDTH = 78.358;
const WEEK_WIDTH = 33.612;
const DAY_WIDTH = 24.878;
export const DOWNLOADS_WIDTH = 58.378;
export const VERSION_WIDTH = 40.046;

const CHAR_WIDTHS = {
    '.': 4.001,
    '0': 6.993,
    '1': 6.993,
    '2': 6.993,
    '3': 6.993,
    '4': 6.993,
    '5': 6.993,
    '6': 6.993,
    '7': 6.993,
    '8': 6.993,
    '9': 6.993,
    'M': 9.270,
    'k': 6.509,
} as any;

/**
 * Tools and utils for badge generation
 */
export class BadgeUtils {

    /**
     * Measure the width of a text
     * @param text
     * @returns {number}
     */
    public static measureTextWidth(text: string): number {

        let chars = text.split('');
        let width = 0;

        for (let i of chars) {
            if (CHAR_WIDTHS[i]) {
                width += CHAR_WIDTHS[i];
            }
        }

        return width;
    }

    /**
     * Format a number nicely for display
     * @param unFormatted
     * @returns {string}
     */
    public static formatNumber(unFormatted: number): string {
        let formatted: string;
        if (unFormatted < 10000) {
            formatted = numeral(unFormatted).format('0');
        } else if (unFormatted < 10000000) {
            formatted = numeral(unFormatted / 1000).format('0') + 'k';
        } else {
            formatted = numeral(unFormatted / 1000000).format('0') + 'M';

        }
        return formatted;
    }

    /**
     * Get the end of the badge text depending on the requested statistic
     * @param method
     * @returns {string}
     */
    public static getSuffix(method: string): string {
        switch (method) {
            case TOTAL:
                return TOTAL_SUFFIX;
            case LAST_VERSION:
                return LAST_VERSION_SUFFIX;
            case WEEK:
                return WEEK_SUFFIX;
            case DAY:
                return DAY_SUFFIX;
            default:
                return '';
        }
    }

    /**
     * Get the width of a suffix
     * @param method
     * @returns {number}
     */
    public static getSuffixWidth(method: string): number {
        switch (method) {
            case TOTAL:
                return TOTAL_WIDTH;
            case LAST_VERSION:
                return LAST_VERSION_WIDTH;
            case WEEK:
                return WEEK_WIDTH;
            case DAY:
                return DAY_WIDTH;
            default:
                return 0;
        }
    }

    /**
     * Count the downloads depending on the requested statistic
     * @param e
     * @param method
     * @returns {number}
     */
    public static getDownloadsByMethod(e: Extension, method: string): number {
        let downloads: number;
        switch (method) {
            case TOTAL:
                downloads = e.total;
                break;
            case LAST_VERSION:
                downloads = e.lastVersion;
                break;
            case WEEK:
                downloads = e.week;
                break;
            case DAY:
                downloads = e.week / 7;
                break;
            default:
                downloads = 0;
        }

        return downloads;
    }
}
