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

const TOTAL_WIDTH = 28.83740234375;
const LAST_VERSION_WIDTH = 78.35888671875;
const WEEK_WIDTH = 33.6123046875;
const DAY_WIDTH = 24.87890625;
export const DOWNLOADS_WIDTH = 58.37841796875;

const CHAR_WIDTHS = {
    M: 9.2705078125,
    k: 6.509765625,
    0: 6.9931640625,
    1: 6.9931640625,
    2: 6.9931640625,
    3: 6.9931640625,
    4: 6.9931640625,
    5: 6.9931640625,
    6: 6.9931640625,
    7: 6.9931640625,
    8: 6.9931640625,
    9: 6.9931640625,
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
            if (typeof CHAR_WIDTHS[i] != null) {
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
                downloads = e.totalDownloads;
                break;
            case LAST_VERSION:
                downloads = e.lastVersionDownloads;
                break;
            case WEEK:
                downloads = e.weekDownloads;
                break;
            case DAY:
                downloads = e.weekDownloads / 7;
                break;
            default:
                downloads = 0;
        }

        return downloads;
    }
}
