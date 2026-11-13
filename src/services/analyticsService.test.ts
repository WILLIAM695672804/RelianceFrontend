import { beforeEach, describe, expect, it, vi } from 'vitest';

const post = vi.hoisted(() => vi.fn());
vi.mock('./api', () => ({ default: { post } }));

import analyticsService from './analyticsService';

describe('analyticsService', () => {
    beforeEach(() => vi.clearAllMocks());

    it("envoie le nom et les propriétés de l'événement", async () => {
        post.mockResolvedValue({});
        await analyticsService.track('page_view', { path: '/x' });
        expect(post).toHaveBeenCalledWith('/analytics/track', { event_name: 'page_view', event_props: { path: '/x' } });
    });

    it("n'interrompt jamais l'interface en cas d'échec", async () => {
        post.mockRejectedValue(new Error('500'));
        await expect(analyticsService.track('page_view')).resolves.toBeUndefined();
    });
});
