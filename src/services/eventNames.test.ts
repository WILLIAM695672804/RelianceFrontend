import { describe, expect, it } from 'vitest';
import { EventFormatter } from 'laravel-echo';

// Sans broadcastAs(), Laravel diffuse le nom complet de la classe (App\Events\<Classe>).
// Les tests des hooks simulent Echo : ils ne vérifient pas cette correspondance, d'où ce garde-fou.
const sources = import.meta.glob(['/src/**/*.{ts,tsx}', '!/src/**/*.test.{ts,tsx}'], {
    query: '?raw',
    import: 'default',
    eager: true,
}) as Record<string, string>;

const ECOUTE = /\.(?:listen|stopListening)\(\s*['"]([^'"]+)['"]/g;

const evenementsEcoutes = Object.entries(sources).flatMap(([fichier, code]) =>
    [...code.matchAll(ECOUTE)].map((m) => ({ fichier, nom: m[1] })),
);

describe('noms des événements temps réel', () => {
    it('le formateur d’Echo produit le nom diffusé par Laravel', () => {
        const formateur = new EventFormatter('App.Events');

        expect(formateur.format('ProposalCreated')).toBe('App\\Events\\ProposalCreated');
        expect(formateur.format('Admin\\NewUserRegistered')).toBe('App\\Events\\Admin\\NewUserRegistered');
        // Un point initial désigne un nom littéral, que le serveur n'émet jamais.
        expect(formateur.format('.ProposalCreated')).toBe('ProposalCreated');
    });

    it('les écoutes de l’application sont détectées', () => {
        expect(evenementsEcoutes.length).toBeGreaterThanOrEqual(20);
    });

    it('aucune écoute n’emploie le point initial', () => {
        const fautives = evenementsEcoutes.filter(({ nom }) => nom.startsWith('.'));
        expect(fautives).toEqual([]);
    });
});
