import { describe, expect, it } from 'vitest';
import api from './api';

describe('client API (session Sanctum SPA)', () => {
    it("envoie le cookie de session et l'en-tête XSRF entre origines (sinon 419 à la connexion)", () => {
        expect(api.defaults.withCredentials).toBe(true);
        expect(api.defaults.withXSRFToken).toBe(true);
    });

    it("cible l'API versionnée", () => {
        expect(api.defaults.baseURL).toMatch(/\/api\/v1$/);
    });
});
