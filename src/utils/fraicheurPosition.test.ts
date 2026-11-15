import { describe, expect, it } from 'vitest';
import { fraicheurPosition } from './fraicheurPosition';

describe('fraicheurPosition', () => {
    const maintenant = Date.parse('2026-11-15T10:30:00Z');

    it('une position de moins d’une minute est en direct', () => {
        expect(fraicheurPosition('2026-11-15T10:29:30Z', maintenant)).toBe('Position en direct');
    });

    it('une position plus ancienne indique son âge en minutes', () => {
        expect(fraicheurPosition('2026-11-15T10:23:00Z', maintenant)).toBe('Dernière position il y a 7 min');
    });

    it('au-delà d’une heure, l’heure de la position est donnée', () => {
        expect(fraicheurPosition('2026-11-15T08:05:00Z', maintenant)).toMatch(/^Dernière position à \d{2}:\d{2}$/);
    });

    it('sans heure connue, la position n’est pas présentée comme en direct', () => {
        expect(fraicheurPosition(undefined, maintenant)).toBe('Position reçue');
        expect(fraicheurPosition('pas une date', maintenant)).toBe('Position reçue');
    });
});
