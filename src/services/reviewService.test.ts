import { beforeEach, describe, expect, it, vi } from 'vitest';

const post = vi.fn();
vi.mock('./api', () => ({ default: { post: (...a: unknown[]) => post(...a), get: vi.fn() } }));

import reviewService from './reviewService';

describe('reviewService.submitReview', () => {
    beforeEach(() => { vi.clearAllMocks(); post.mockResolvedValue({ data: { ok: true } }); });

    it("utilise l'étape « post » par défaut", async () => {
        await reviewService.submitReview('r1', 5, 'Parfait');
        expect(post).toHaveBeenCalledWith('/reviews', { request_id: 'r1', rating: 5, comment: 'Parfait', stage: 'post' });
    });

    it("transmet l'étape « pre »", async () => {
        const res = await reviewService.submitReview('r1', 3, undefined, 'pre');
        expect(post).toHaveBeenCalledWith('/reviews', { request_id: 'r1', rating: 3, comment: undefined, stage: 'pre' });
        expect(res).toEqual({ ok: true });
    });
});
