/// <reference types="node" />
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Test de contrat des liens : toute cible littérale de `navigate('/…')`, `<Link to="/…">` ou
 * `<Navigate to="/…">` doit correspondre à une route déclarée dans App.tsx.
 */
/**
 * Sources lues avec `fs` (et non `import.meta.glob(..., ?raw)`) : un import « raw » ferait remplacer
 * les instructions de chaque fichier par une seule ligne dans le rapport de couverture V8.
 */
const RACINE = join(process.cwd(), 'src');
function lister(dossier: string): string[] {
    return readdirSync(dossier).flatMap((nom) => {
        const chemin = join(dossier, nom);
        if (statSync(chemin).isDirectory()) return nom === 'test' ? [] : lister(chemin);
        return /\.(ts|tsx)$/.test(nom) && !/\.test\.(ts|tsx)$/.test(nom) ? [chemin] : [];
    });
}
const sources: Record<string, string> = Object.fromEntries(
    lister(RACINE).map((f) => ['./' + relative(RACINE, f).replace(/\\/g, '/'), readFileSync(f, 'utf8')]),
);

/** Routes complètes déduites de la structure JSX de App.tsx (pile de préfixes selon l'imbrication). */
function routesDeApp(): string[] {
    const lignes = sources['./App.tsx'].split('\n');
    const pile: string[] = [];
    const routes: string[] = [];
    for (const ligne of lignes) {
        if (/<\/Route>/.test(ligne)) { pile.pop(); continue; }
        if (!/<Route\b/.test(ligne)) continue;
        const chemin = /\bpath="([^"]*)"/.exec(ligne)?.[1];
        const autoFermante = /\/>\s*$/.test(ligne);
        if (!autoFermante) { pile.push(chemin ?? ''); continue; }
        if (chemin === undefined) continue; // <Route index … /> : même chemin que son parent
        const complet = chemin.startsWith('/') ? chemin : [...pile, chemin].join('/');
        routes.push(complet.replace(/\/{2,}/g, '/'));
    }
    // Les groupes à préfixe sont eux-mêmes des routes (leur « index » redirige vers dashboard).
    for (const ligne of lignes) {
        const groupe = /<Route path="(\/[^"]+)" element=\{$/.exec(ligne.trim());
        if (groupe) routes.push(groupe[1]);
    }
    return Array.from(new Set(routes));
}

const versRegex = (route: string) =>
    new RegExp('^' + route.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/:[A-Za-z]+/g, '[^/]+') + '/?$');

function ciblesDuCode(): { fichier: string; cible: string }[] {
    const motifs = [
        /navigate\(\s*(['"`])(\/[^'"`]*)\1/g,
        /<(?:Link|Navigate|NavLink)\b[^>]*?\bto=(?:\{\s*)?(['"`])(\/[^'"`]*)\1/g,
    ];
    const cibles: { fichier: string; cible: string }[] = [];
    for (const [fichier, contenu] of Object.entries(sources)) {
        if (fichier === './App.tsx') continue;
        for (const motif of motifs) {
            for (const m of contenu.matchAll(motif)) {
                const brute = m[2].replace(/\$\{[^}]*\}/g, 'x').split(/[?#]/)[0];
                cibles.push({ fichier, cible: brute });
            }
        }
    }
    return cibles;
}

describe('contrat des liens de navigation', () => {
    const routes = routesDeApp();
    const regex = routes.map(versRegex);

    it("extrait un nombre plausible de routes de App.tsx", () => {
        expect(routes.length).toBeGreaterThan(60);
        expect(routes).toEqual(expect.arrayContaining(['/connexion', '/espace-client/wallet', '/technicien/dashboard', '/admin/carte', '/agence/dashboard']));
    });

    it("n'a aucun lien vers une route inexistante", () => {
        const cibles = ciblesDuCode();
        expect(cibles.length).toBeGreaterThan(40);
        const morts = cibles.filter(({ cible }) => cible !== '/' && !regex.some((r) => r.test(cible)));
        expect(morts.map((m) => `${m.fichier} → ${m.cible}`)).toEqual([]);
    });
});
