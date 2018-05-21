import numeral = require('numeral');
import {Extension} from './database';

export const TOTAL = 'total';
export const LAST_VERSION = 'last-version';
export const WEEK = 'week';
export const DAY = 'day';

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
        if (unFormatted < 10000) {
            return numeral(unFormatted).format('0');
        }
        if (unFormatted < 1000000) {
            return numeral(unFormatted / 1000).format('0') + 'k';
        }
        return numeral(unFormatted / 1000000).format(unFormatted < 10000000 ? '0.0' : '0') + 'M';
    }

    /**
     * Get the end of the badge text depending on the requested statistic
     * @param method
     * @returns {string}
     */
    public static getSuffix(method: string): string {
        const suffixes: {[key: string]: string} = {
            'total': ' total',
            'last-version': ' latest version',
            'week': '/week',
            'day': '/day',
        };
        return suffixes[method] ? suffixes[method] : ''
    }

    /**
     * Get the width of a suffix
     * @param method
     * @returns {number}
     */
    public static getSuffixWidth(method: string): number {
        const widths: {[key: string]: number} = {
            'total': 28.837,
            'last-version': 78.358,
            'week': 33.612,
            'day': 24.878,
        };
        return widths[method] ? widths[method] : 0
    }

    /**
     * Count the downloads depending on the requested statistic
     * @param e
     * @param method
     * @returns {number}
     */
    public static getDownloadsByMethod(e: Extension, method: string): number {
        switch (method) {
            case TOTAL:
                return e.total;
            case LAST_VERSION:
                return e.lastVersion;
            case WEEK:
                return e.week;
            case DAY:
                return e.week / 7;
            default:
                return 0;
        }
    }
}
