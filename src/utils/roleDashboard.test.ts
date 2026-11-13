import { describe, expect, it } from 'vitest';
import { getRoleDashboard } from './roleDashboard';

describe('getRoleDashboard', () => {
    it.each([
        ['client', '/espace-client/dashboard'],
        ['technicien', '/technicien/dashboard'],
        ['agence', '/agence/dashboard'],
        ['admin', '/admin/dashboard'],
        ['guest', '/'],
        ['inconnu', '/'],
    ])('%s → %s', (role, route) => {
        expect(getRoleDashboard(role)).toBe(route);
    });
});
