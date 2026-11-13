import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const tech = vi.hoisted(() => ({ getTechProfile: vi.fn(), getTechStats: vi.fn() }));
const reviews = vi.hoisted(() => ({ getMyReviews: vi.fn() }));
const matching = vi.hoisted(() => ({ getTechnicianProposals: vi.fn(), getActiveMission: vi.fn(), acceptProposal: vi.fn(), refuseProposal: vi.fn() }));
const navigate = vi.hoisted(() => vi.fn());
vi.mock('../../services/technicianService', () => tech);
vi.mock('../../services/reviewService', () => ({ default: reviews }));
vi.mock('../../services/matchingService', () => ({ default: matching }));
vi.mock('../../components/maps/TechServiceMap', () => ({ default: (p: any) => <div data-testid="map">{`${p.city}|${p.radiusInKm}`}</div> }));
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import Dashboard from './Dashboard';

const plain = (s: string | null) => (s ?? '').replace(/[  ]/g, ' ');
const renderPage = (url = '/technicien/dashboard') =>
    render(
        <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
            <MemoryRouter initialEntries={[url]}><Dashboard /></MemoryRouter>
        </QueryClientProvider>,
    );
/** Forme réelle de GET /proposals/my : { data: <paginateur> } avec la relation `request`. */
const reponseProposals = (rows: unknown[]) => ({ data: { current_page: 1, data: rows, total: rows.length } });
const proposition = (over = {}) => ({
    id: 'p1', request_id: 'r1', status: 'pending', price: '9000.00',
    request: { id: 'r1', title: 'Fuite évier', description: 'Fuite importante', category: { name: 'Plomberie' } }, ...over,
});

describe('Dashboard technicien', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        tech.getTechProfile.mockResolvedValue({ name: 'Paul', service_perimeter: { city: 'Douala', latitude: 4.05, longitude: 9.77, radius: 20 } });
        tech.getTechStats.mockResolvedValue({ wallet_balance: 42000, monthly_earnings: 15000, completion_rate: 90, rating: 4.5, num_reviews: 3, category_breakdown: [], monthly_missions: [], recent_missions: [] });
        reviews.getMyReviews.mockResolvedValue({ data: { data: [] } });
        matching.getTechnicianProposals.mockResolvedValue(reponseProposals([]));
        matching.getActiveMission.mockRejectedValue(new Error('404'));
    });

    it('affiche le chargement puis le message de bienvenue', async () => {
        renderPage();

        expect(screen.getByText(/loading dashboard/i)).toBeInTheDocument();
        expect(await screen.findByText(/welcome back, paul/i)).toBeInTheDocument();
        expect(screen.getByText(/0 new matching opportunities/i)).toBeInTheDocument();
    });

    it('utilise le rayon réel du technicien pour la carte des zones', async () => {
        renderPage();

        await waitFor(() => expect(screen.getAllByTestId('map').map((m) => m.textContent)).toContain('Douala|20'));
    });

    // ── Propositions (forme réelle de l'API) ───────────────

    it("affiche les propositions en attente d'une réponse paginée, avec titre, catégorie et prix", async () => {
        matching.getTechnicianProposals.mockResolvedValue(reponseProposals([proposition()]));
        renderPage();

        expect(await screen.findByText('Fuite évier')).toBeInTheDocument();
        expect(screen.getByText('Plomberie')).toBeInTheDocument();
        expect(screen.getByText(/9.000 XAF/)).toBeInTheDocument();
        expect(screen.getByText(/1 new matching opportunities/i)).toBeInTheDocument();
    });

    it("n'affiche pas les propositions déjà traitées et ne produit ni « NaN » ni score fictif", async () => {
        matching.getTechnicianProposals.mockResolvedValue(reponseProposals([
            proposition(), proposition({ id: 'p2', status: 'accepted', request: { id: 'r2', title: 'Panne', category: null } }),
            proposition({ id: 'p3', status: 'refused', request: { id: 'r3', title: 'Prise', category: null } }),
        ]));
        renderPage();

        await screen.findByText('Fuite évier');
        expect(screen.queryByText('Panne')).not.toBeInTheDocument();
        expect(screen.queryByText('Prise')).not.toBeInTheDocument();
        expect(document.body.textContent).not.toMatch(/NaN/);
        expect(screen.queryByText(/% Match/)).not.toBeInTheDocument();
    });

    it('affiche score et distance lorsque le serveur les fournit', async () => {
        matching.getTechnicianProposals.mockResolvedValue(reponseProposals([proposition({ score: 87.4, distance: 3.2 })]));
        renderPage();

        expect(await screen.findByText('87% Match')).toBeInTheDocument();
        expect(screen.getByText(/3 km/)).toBeInTheDocument();
    });

    it('tolère une réponse sous forme de simple tableau et le prix « à négocier »', async () => {
        matching.getTechnicianProposals.mockResolvedValue({ data: [proposition({ price: 0 })] });
        renderPage();

        expect(await screen.findByText(/A négocier XAF/)).toBeInTheDocument();
    });

    it("accepte une proposition puis ouvre la mission", async () => {
        matching.getTechnicianProposals.mockResolvedValue(reponseProposals([proposition()]));
        matching.acceptProposal.mockResolvedValue({});
        renderPage();

        fireEvent.click(await screen.findByText('Accepter'));

        await waitFor(() => expect(matching.acceptProposal).toHaveBeenCalledWith('p1'));
        expect(navigate).toHaveBeenCalledWith('/technicien/mission/r1');
    });

    it("décline une proposition et la retire de la liste sans naviguer", async () => {
        matching.getTechnicianProposals.mockResolvedValue(reponseProposals([proposition()]));
        matching.refuseProposal.mockResolvedValue({});
        renderPage();

        fireEvent.click(await screen.findByText('Décliner'));

        await waitFor(() => expect(screen.queryByText('Fuite évier')).not.toBeInTheDocument());
        expect(matching.refuseProposal).toHaveBeenCalledWith('p1');
        expect(navigate).not.toHaveBeenCalled();
    });

    it("conserve la proposition si l'acceptation échoue (expirée)", async () => {
        matching.getTechnicianProposals.mockResolvedValue(reponseProposals([proposition()]));
        matching.acceptProposal.mockRejectedValue({ response: { status: 410 } });
        renderPage();

        fireEvent.click(await screen.findByText('Accepter'));

        await waitFor(() => expect(matching.acceptProposal).toHaveBeenCalled());
        expect(navigate).not.toHaveBeenCalled();
        expect(screen.getByText('Fuite évier')).toBeInTheDocument();
    });

    // ── Indicateurs, missions, avis ────────────────────────

    it('affiche solde, gains, taux de réalisation et note', async () => {
        renderPage();

        await waitFor(() => {
            const kpis = Array.from(document.querySelectorAll('.tech-kpi-value')).map((e) => plain(e.textContent));
            expect(kpis.some((k) => k.includes('42 000'))).toBe(true);
            expect(kpis.some((k) => k.includes('15 000'))).toBe(true);
            expect(kpis.some((k) => k.includes('90'))).toBe(true);
            expect(kpis.some((k) => k.includes('4.50'))).toBe(true);
        });
    });

    it("liste les missions récentes et ouvre la mission au clic", async () => {
        tech.getTechStats.mockResolvedValue({ recent_missions: [{ id: 'abcdef123', title: 'Fuite', city: 'Douala', category: 'plomberie', status: 'in_progress' }], category_breakdown: [{ label: 'plomberie', value: 4 }] });
        renderPage();

        fireEvent.click(await screen.findByText('Fuite'));

        expect(navigate).toHaveBeenCalledWith('/technicien/mission/abcdef123');
        expect(screen.getByText('#abcdef')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
    });

    it("affiche les états vides sans mission ni avis", async () => {
        renderPage();

        expect(await screen.findByText('Aucun avis')).toBeInTheDocument();
        expect(screen.getAllByText('Aucune mission').length).toBeGreaterThan(0);
        expect(screen.getByText('Aucune mission en cours')).toBeInTheDocument();
    });

    it("extrait les avis d'un paginateur ou d'un tableau", async () => {
        reviews.getMyReviews.mockResolvedValue({ data: { data: [{ id: 'a', rating: 5, comment: 'Parfait', reviewer: { name: 'Alice' } }] } });
        const { unmount } = renderPage();
        expect(await screen.findByText(/Alice/)).toBeInTheDocument();
        unmount();

        reviews.getMyReviews.mockResolvedValue({ data: [{ id: 'b', rating: 4, comment: null, reviewer: null }] });
        renderPage();
        expect(await screen.findByText('Client', { selector: 'span' })).toBeInTheDocument();
    });

    it('affiche la mission en cours et ouvre le cockpit', async () => {
        matching.getActiveMission.mockResolvedValue({ data: { request: { title: 'Fuite' }, client: { name: 'Alice' }, address: { city: 'Douala' }, price: 9000 } });
        renderPage();

        expect(await screen.findByText('EN COURS')).toBeInTheDocument();
        fireEvent.click(document.querySelector('.tech-active-mission-card')!);
        expect(navigate).toHaveBeenCalledWith('/technicien/cockpit');
    });

    it("affiche la confirmation de vérification d'e-mail (?verified=1) puis la ferme", async () => {
        renderPage('/technicien/dashboard?verified=1');

        const continuer = await screen.findByText('Continuer');
        fireEvent.click(continuer);

        await waitFor(() => expect(screen.queryByText('Continuer')).not.toBeInTheDocument());
    });

    it("sort du chargement et reste utilisable si le profil est indisponible", async () => {
        tech.getTechProfile.mockRejectedValue(new Error('500'));
        renderPage();

        expect(await screen.findByText(/welcome back, professional/i)).toBeInTheDocument();
    });

    it("mène au radar, aux abonnements et au planning", async () => {
        renderPage();

        fireEvent.click(await screen.findByText('Go Online'));
        fireEvent.click(screen.getByText('Upgrade Now'));
        fireEvent.click(screen.getByText('View All Missions'));

        expect(navigate).toHaveBeenCalledWith('/technicien/radar');
        expect(navigate).toHaveBeenCalledWith('/technicien/abonnements');
        expect(navigate).toHaveBeenCalledWith('/technicien/planning');
    });
});
