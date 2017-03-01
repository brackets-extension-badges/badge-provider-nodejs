import numeral = require('numeral');
import Handlebars = require('handlebars');

export const _total = 'total';
export const _lastVersion = 'last-version';
export const _week = 'week';
export const _day = 'day';

const _totalSuffix = ' total';
const _lastVersionSuffix = ' latest version';
const _weekSuffix = '/week';
const _daySuffix = '/day';

const _totalWidth = 28.83740234375;
const _lastVersionWidth = 78.35888671875;
const _weekWidth = 33.6123046875;
const _dayWidth = 24.87890625;
export const _downloadsWidth = 58.37841796875;

const _charWidths = {
    'k': 6.509765625,
    'M': 9.2705078125,
    '0': 6.9931640625,
    '1': 6.9931640625,
    '2': 6.9931640625,
    '3': 6.9931640625,
    '4': 6.9931640625,
    '5': 6.9931640625,
    '6': 6.9931640625,
    '7': 6.9931640625,
    '8': 6.9931640625,
    '9': 6.9931640625,
} as any;

export class BadgeUtils {
    public static measureTextWidth(text: string): number {

        let chars = text.split('');
        let width = 0;

        for (let i = 0; i < chars.length; i++) {
            if (typeof _charWidths[chars[i]] != null) {
                width += _charWidths[chars[i]];
            }
        }

        return width;
    }

    public static formatNumber(number: number): string {
        let formatted;
        if (number < 10000) {
            formatted = numeral(number).format('0');
        } else if (number < 10000000) {
            formatted = numeral(number / 1000).format('0') + 'k';
        } else {
            formatted = numeral(number / 1000000).format('0') + 'M';

        }
        return formatted;
    }

    public static getSuffix(method: string) {
        switch (method) {
            case _total:
                return _totalSuffix;
            case _lastVersion:
                return _lastVersionSuffix;
            case _week:
                return _weekSuffix;
            case _day:
                return _daySuffix;
        }
        return null;
    }

    public static getSuffixWidth(method: string) {
        switch (method) {
            case _total:
                return _totalWidth;
            case _lastVersion:
                return _lastVersionWidth;
            case _week:
                return _weekWidth;
            case _day:
                return _dayWidth;
        }
        return null;
    }
}

