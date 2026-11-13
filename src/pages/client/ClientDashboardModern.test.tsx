import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const auth = vi.hoisted(() => ({ resendVerificationEmail: vi.fn() }));
const fin = vi.hoisted(() => ({ getHolds: vi.fn(), getTransactions: vi.fn() }));
const req = vi.hoisted(() => ({ list: vi.fn() }));
const navigate = vi.hoisted(() => vi.fn());
let currentUser: any;
const auth2fa = { value: false };
vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ user: currentUser, requires2faSetup: auth2fa.value }) }));
vi.mock('../../services/authService', () => ({ default: auth }));
vi.mock('../../services/financeService', () => ({ financeService: fin }));
vi.mock('../../services/requestService', () => ({ default: req }));
vi.mock('../../components/maps/ClientLocationMap', () => ({ default: () => <div data-testid="map" /> }));
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import ClientDashboardModern from './ClientDashboardModern';

const plain = (s: string | null) => (s ?? '').replace(/[\u202f\u00a0]/g, ' ');
const renderPage = (url = '/espace-client/dashboard') =>
    render(
        <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
            <MemoryRouter initialEntries={[url]}><ClientDashboardModern /></MemoryRouter>
        </QueryClientProvider>,
    );

describe('ClientDashboardModern', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        currentUser = { id: 'u1', name: 'Alice', email_verified_at: '2026-11-01' };
        req.list.mockResolvedValue({ data: [] });
        fin.getHolds.mockResolvedValue({ data: { data: [] } });
        fin.getTransactions.mockResolvedValue({ data: { data: [] } });
    });
    afterEach(() => vi.useRealTimers());

    // ── Vérification d'e-mail ──────────────────────────────

    it("affiche la bannière de vérification uniquement pour un e-mail non vérifié", async () => {
        const { unmount } = renderPage();
        await screen.findByTestId('map');
        expect(screen.queryByText(/vérifiez votre adresse e-mail/i)).not.toBeInTheDocument();
        unmount();

        currentUser = { ...currentUser, email_verified_at: undefined };
        renderPage();
        expect(await screen.findByText(/vérifiez votre adresse e-mail/i)).toBeInTheDocument();
    });

    it("renvoie le lien, confirme l'envoi puis réarme le bouton après 5 s", async () => {
        currentUser = { ...currentUser, email_verified_at: undefined };
        auth.resendVerificationEmail.mockResolvedValue({});
        vi.useFakeTimers({ shouldAdvanceTime: true });
        renderPage();

        fireEvent.click(await screen.findByText('Renvoyer le lien'));
        const bouton = await screen.findByText('E-mail envoyé !');
        expect(bouton).toBeDisabled();

        await act(async () => { await vi.advanceTimersByTimeAsync(5100); });
        expect(screen.getByText('Renvoyer le lien')).toBeEnabled();
    });

    it("tolère un échec d'envoi (limite de débit) et réarme le bouton", async () => {
        currentUser = { ...currentUser, email_verified_at: undefined };
        auth.resendVerificationEmail.mockRejectedValue({ response: { status: 503 } });
        vi.useFakeTimers({ shouldAdvanceTime: true });
        renderPage();

        fireEvent.click(await screen.findByText('Renvoyer le lien'));
        await waitFor(() => expect(auth.resendVerificationEmail).toHaveBeenCalled());
        await act(async () => { await vi.advanceTimersByTimeAsync(5100); });

        expect(screen.getByText('Renvoyer le lien')).toBeEnabled();
    });

    it("affiche la confirmation après vérification (?verified=1) et la ferme", async () => {
        const { container } = renderPage('/espace-client/dashboard?verified=1');

        await waitFor(() => expect(container.querySelector('.verified-modal')).not.toBeNull());
        fireEvent.click(container.querySelector('.verified-modal button')!);

        await waitFor(() => expect(container.querySelector('.verified-modal')).toBeNull());
    });

    // ── Indicateurs ────────────────────────────────────────

    it("totalise les fonds séquestrés (holds « held ») et les dépenses (débits)", async () => {
        fin.getHolds.mockResolvedValue({ data: { data: [{ status: 'held', amount: 8000 }, { status: 'captured', amount: 5000 }, { status: 'held', amount: 2000 }] } });
        fin.getTransactions.mockResolvedValue({ data: { data: [{ amount: -3000 }, { amount: 12000 }, { amount: -1500 }] } });
        renderPage();

        await waitFor(() => {
            const valeurs = Array.from(document.querySelectorAll('.sm-stat-value')).map((e) => plain(e.textContent));
            expect(valeurs.some((v) => v.includes('10 000'))).toBe(true);
            expect(valeurs.some((v) => v.includes('4 500'))).toBe(true);
        });
    });

    it("compte les interventions actives en excluant les demandes terminées ou annulées", async () => {
        req.list.mockResolvedValue({ data: [
            { id: 'a', title: 'Fuite', status: 'assigned' }, { id: 'b', title: 'Panne', status: 'completed' },
            { id: 'c', title: 'Prise', status: 'cancelled' }, { id: 'd', title: 'Clim', status: 'analyzed' },
        ] });
        renderPage();

        await waitFor(() => expect(document.querySelector('.sm-stat-value')).toHaveTextContent('02'));
        expect(screen.getAllByText('Fuite').length).toBeGreaterThan(0);
    });

    it("affiche des états vides sans demande", async () => {
        renderPage();

        expect(await screen.findByText('Aucune activité')).toBeInTheDocument();
        expect(screen.getByText('Aucune intervention active')).toBeInTheDocument();
    });

    // ── Navigation ─────────────────────────────────────────

    it('mène à la création de demande, aux factures et au suivi', async () => {
        req.list.mockResolvedValue({ data: [{ id: 'a', title: 'Fuite', status: 'assigned' }] });
        renderPage();

        fireEvent.click(await screen.findByText('Ask AI'));
        fireEvent.click(screen.getByText('Mes Factures'));
        fireEvent.click(await screen.findByText('Fuite', { selector: '.sm-job-name' }));

        expect(navigate).toHaveBeenCalledWith('/espace-client/demande');
        expect(navigate).toHaveBeenCalledWith('/espace-client/factures');
        expect(navigate).toHaveBeenCalledWith('/espace-client/suivi');
    });

    it("affiche la bannière « double authentification » uniquement lorsque le serveur l'exige", async () => {
        const { unmount } = renderPage();
        await screen.findByTestId('map');
        expect(screen.queryByText(/activez la double authentification/i)).not.toBeInTheDocument();
        unmount();

        auth2fa.value = true;
        renderPage();
        fireEvent.click(await screen.findByRole('button', { name: 'Activer' }));
        expect(navigate).toHaveBeenCalledWith('/espace-client/profil');
        auth2fa.value = false;
    });
});
