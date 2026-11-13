import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const tech = vi.hoisted(() => ({ getTechStats: vi.fn() }));
const gov = vi.hoisted(() => ({ getMySlaEvents: vi.fn() }));
const navigate = vi.hoisted(() => vi.fn());
vi.mock('../../services/technicianService', () => tech);
vi.mock('../../services/governanceService', () => ({ governanceService: gov }));
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import SlaAuditLog from './SlaAuditLog';

const renderPage = () =>
    render(
        <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
            <MemoryRouter><SlaAuditLog /></MemoryRouter>
        </QueryClientProvider>,
    );
const evt = (id: string, over = {}) => ({ id, event_key: 'late_arrival', request_id: `req-${id}-abcdef`, occurred_at: '2026-11-05T10:00:00Z', payload: { points: -5 }, ...over });

describe('SlaAuditLog', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        tech.getTechStats.mockResolvedValue({ rating: 4.6, num_reviews: 8, completion_rate: 92, missions_total: 30 });
        gov.getMySlaEvents.mockResolvedValue({ data: [] });
    });

    it.each([
        [5, '100', 'Excellent'],
        [4.6, '92', 'Excellent'],
        [4, '80', 'Bon'],
        [3, '60', 'Moyen'],
        [1, '20', 'À améliorer'],
    ])("note %s/5 → score %s/100 (%s)", async (note, score, libelle) => {
        tech.getTechStats.mockResolvedValue({ rating: note, num_reviews: 1 });
        renderPage();

        await waitFor(() => expect(document.querySelector('.tech-score-number')).toHaveTextContent(`${score}/100`));
        expect(document.querySelector('.tech-score-badge')).toHaveTextContent(libelle);
    });

    it('affiche note, nombre d’avis, fiabilité et missions totales', async () => {
        renderPage();

        expect(await screen.findByText('92%')).toBeInTheDocument();
        expect(screen.getByText('30')).toBeInTheDocument();
        expect(screen.getByText('8 avis')).toBeInTheDocument();
        expect(screen.getByText('4.6/5')).toBeInTheDocument();
    });

    it('affiche un état vide sans événement SLA', async () => {
        renderPage();

        expect(await screen.findByText('Aucun événement SLA')).toBeInTheDocument();
    });

    it('liste les événements avec leur libellé et la demande concernée', async () => {
        gov.getMySlaEvents.mockResolvedValue({ data: [evt('1')] });
        renderPage();

        expect(await screen.findByText('late arrival')).toBeInTheDocument();
        expect(screen.getByText('#req-1-')).toBeInTheDocument();
    });

    it('ne garde que les pénalités avec « Critical Only » puis revient à tous', async () => {
        gov.getMySlaEvents.mockResolvedValue({ data: [
            evt('1', { event_key: 'late_arrival', payload: { points: -5 } }),
            evt('2', { event_key: 'good_review', payload: { points: 3 } }),
            evt('3', { event_key: 'no_show', payload: { penalty: -10 } }),
        ] });
        renderPage();
        await screen.findByText('late arrival');

        fireEvent.click(screen.getByText('Critical Only'));
        expect(screen.queryByText('good review')).not.toBeInTheDocument();
        expect(screen.getByText('no show')).toBeInTheDocument();
        expect(screen.getByText('late arrival')).toBeInTheDocument();

        fireEvent.click(screen.getByText('All Events'));
        expect(screen.getByText('good review')).toBeInTheDocument();
    });

    it('permet de revenir au profil, de consulter le planning et de contacter le support', async () => {
        renderPage();

        fireEvent.click(await screen.findByText('Back to Profile'));
        fireEvent.click(screen.getByText('Apply Recommendations'));
        fireEvent.click(document.querySelector('.tech-rules-footer button')!);

        expect(navigate).toHaveBeenCalledWith(-1);
        expect(navigate).toHaveBeenCalledWith('/technicien/planning');
        expect(navigate).toHaveBeenCalledWith('/contact');
    });
});
