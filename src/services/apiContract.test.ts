import { beforeEach, describe, expect, it, vi } from 'vitest';
import routes from '../test/fixtures/api-routes.json';

/**
 * Test de contrat : chaque appel émis par les services frontend doit correspondre à une route
 * réelle du backend (méthode + URI). La table de routage est un instantané de
 * `php artisan route:list --json` (src/test/fixtures/api-routes.json), à régénérer quand l'API évolue.
 */
type Call = { method: string; url: string };
const calls: Call[] = [];

vi.mock('./api', () => {
    const record = (method: string) => (url: string) => {
        calls.push({ method: method.toUpperCase(), url });
        return Promise.resolve({ data: { data: [], meta: {} } });
    };
    return { default: { get: record('get'), post: record('post'), put: record('put'), patch: record('patch'), delete: record('delete') } };
});

const toRegex = (uri: string) =>
    new RegExp('^' + uri.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\{[^}]+\}/g, '[^/]+') + '$');
const table = (routes as { method: string; uri: string }[]).map((r) => ({ method: r.method, re: toRegex(r.uri) }));
const exists = ({ method, url }: Call) => {
    const path = 'api/v1/' + url.split('?')[0].replace(/^\//, '');
    return table.some((r) => r.method === method && r.re.test(path));
};

const dummyFile = () => new File(['x'], 'x.txt');
const args = ['id-1', 'id-2', 'id-3', {}, {}];

async function exerciseAll(mod: Record<string, unknown>) {
    for (const value of Object.values(mod)) {
        const targets = typeof value === 'function' ? [value] : value && typeof value === 'object' ? Object.values(value) : [];
        for (const fn of targets as unknown[]) {
            // verifyEmail reçoit une URL signée complète fournie par le serveur : hors table de routage.
            if (typeof fn !== 'function' || fn.name === 'verifyEmail') continue;
            try {
                await (fn as (...a: unknown[]) => unknown)(...args.slice(0, Math.max(fn.length, 3)).map((a, i) => (i === 1 && fn.name === 'uploadKycDocument' ? dummyFile() : a)));
            } catch {
                /* l'appel peut échouer sur des arguments factices : seule l'URL émise nous importe */
            }
        }
    }
}

const services = import.meta.glob('./*Service.ts', { eager: false }) as Record<string, () => Promise<Record<string, unknown>>>;

describe('contrat services frontend ↔ routes backend', () => {
    beforeEach(() => { calls.length = 0; });

    for (const [path, load] of Object.entries(services)) {
        it(`${path} n'appelle que des routes existantes`, async () => {
            await exerciseAll(await load());
            const orphelins = calls.filter((c) => !exists(c)).map((c) => `${c.method} ${c.url}`);
            expect(orphelins).toEqual([]);
        });
    }

    it('instantané du backend non vide', () => {
        expect(table.length).toBeGreaterThan(150);
    });
});
