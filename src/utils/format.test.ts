import { describe, expect, it } from 'vitest';
import { formatDate, formatDateTime, formatNumber, formatXAF } from './format';

// Intl insère des espaces insécables (U+202F / U+00A0) : on normalise avant comparaison.
const plain = (s: string) => s.replace(/[  ]/g, ' ');

describe('formatXAF', () => {
    it("arrondit à l'entier et suffixe la devise", () => {
        expect(plain(formatXAF(12000))).toBe('12 000 XAF');
        expect(plain(formatXAF(1234.6))).toBe('1 235 XAF');
        expect(plain(formatXAF('5000'))).toBe('5 000 XAF');
    });
    it.each([[null], [undefined], [NaN], ['abc'], [Infinity]])('renvoie 0 XAF pour %s', (v) => {
        expect(formatXAF(v as never)).toMatch(/^0 XAF$/);
    });
});

describe('formatNumber', () => {
    it('formate sans suffixe', () => {
        expect(plain(formatNumber(1500000))).toBe('1 500 000');
    });
    it('renvoie 0 pour une valeur non finie', () => {
        expect(formatNumber('x')).toBe('0');
        expect(formatNumber(undefined)).toBe('0');
    });
});

describe('formatDate / formatDateTime', () => {
    it('formate une date valide en français', () => {
        expect(formatDate('2026-11-12T10:00:00Z')).toMatch(/12 nov\.? 2026/);
        expect(formatDateTime('2026-11-12T10:00:00Z')).toMatch(/2026/);
    });
    it.each([[null], [undefined], [''], ['pas une date']])("renvoie un tiret pour %s", (v) => {
        expect(formatDate(v as never)).toBe('—');
        expect(formatDateTime(v as never)).toBe('—');
    });
});
