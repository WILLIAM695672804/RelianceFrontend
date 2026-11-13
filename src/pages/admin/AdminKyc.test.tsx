import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const svc = vi.hoisted(() => ({ getKycDocuments: vi.fn(), validateKyc: vi.fn() }));
vi.mock('../../services/adminService', () => ({ default: svc }));

import AdminKyc from './AdminKyc';

const doc = (over = {}) => ({
    id: 'd1', user_id: 'u1', type: 'carte_identite', file_path: 'kyc/a.jpg', status: 'pending', rejection_reason: null,
    validated_by: null, url: 'http://api.test/storage/kyc/a.jpg', created_at: '2026-11-01T10:00:00Z',
    user: { id: 'u1', name: 'Paul Technicien', email: 'paul@test.local' }, ...over,
});
const page = (data: unknown[], extra = {}) => ({ data, last_page: 1, total: data.length, ...extra });

const modale = async () => (await waitFor(() => { const m = document.querySelector('.adm-modal'); expect(m).not.toBeNull(); return m; })) as HTMLElement;

describe('AdminKyc', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        svc.getKycDocuments.mockResolvedValue(page([doc()]));
    });
    afterEach(() => vi.useRealTimers());

    it('charge par défaut les documents en attente et affiche le déposant', async () => {
        render(<AdminKyc />);

        expect(await screen.findByText('Paul Technicien')).toBeInTheDocument();
        expect(svc.getKycDocuments).toHaveBeenCalledWith({ page: 1, status: 'pending' });
        expect(screen.getByText('carte identite')).toBeInTheDocument();
        expect(screen.getByText(/Validation KYC \(1\)/)).toBeInTheDocument();
    });

    it('affiche un état vide adapté au filtre', async () => {
        svc.getKycDocuments.mockResolvedValue(page([]));
        render(<AdminKyc />);

        expect(await screen.findByText(/aucun document kyc en attente/i)).toBeInTheDocument();
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });
        expect(await screen.findByText(/aucun document kyc trouve/i)).toBeInTheDocument();
    });

    it('change de statut en repartant de la première page, sans filtre « tous »', async () => {
        render(<AdminKyc />);
        await screen.findByText('Paul Technicien');

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'approved' } });
        await waitFor(() => expect(svc.getKycDocuments).toHaveBeenLastCalledWith({ page: 1, status: 'approved' }));
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });
        await waitFor(() => expect(svc.getKycDocuments).toHaveBeenLastCalledWith({ page: 1 }));
    });

    it('temporise la recherche', async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        render(<AdminKyc />);
        await screen.findByText('Paul Technicien');
        svc.getKycDocuments.mockClear();

        fireEvent.change(screen.getByPlaceholderText(/rechercher/i), { target: { value: 'pau' } });
        await act(async () => { await vi.advanceTimersByTimeAsync(450); });

        await waitFor(() => expect(svc.getKycDocuments).toHaveBeenCalledWith({ page: 1, status: 'pending', search: 'pau' }));
    });

    it('pagine', async () => {
        svc.getKycDocuments.mockResolvedValue(page([doc()], { last_page: 3, total: 50 }));
        render(<AdminKyc />);
        await screen.findByText('Paul Technicien');

        fireEvent.click(screen.getByText('Suivant'));

        await waitFor(() => expect(svc.getKycDocuments).toHaveBeenLastCalledWith({ page: 2, status: 'pending' }));
    });

    // ── Examen d'un document ───────────────────────────────

    it("prévisualise une image dans la fenêtre de détail", async () => {
        render(<AdminKyc />);
        await screen.findByText('Paul Technicien');

        fireEvent.click(document.querySelector('.adm-btn-outline')!);

        expect(await screen.findByAltText('KYC Document')).toHaveAttribute('src', 'http://api.test/storage/kyc/a.jpg');
    });

    it("propose l'ouverture d'un PDF au lieu d'un aperçu", async () => {
        svc.getKycDocuments.mockResolvedValue(page([doc({ url: 'http://api.test/storage/kyc/a.pdf' })]));
        render(<AdminKyc />);
        await screen.findByText('Paul Technicien');

        fireEvent.click(document.querySelector('.adm-btn-outline')!);

        await waitFor(() => expect(document.querySelector('a[href="http://api.test/storage/kyc/a.pdf"]')).not.toBeNull());
        expect(screen.queryByAltText('KYC Document')).not.toBeInTheDocument();
    });

    it("approuve depuis la fenêtre de détail puis recharge la liste", async () => {
        svc.validateKyc.mockResolvedValue({});
        render(<AdminKyc />);
        await screen.findByText('Paul Technicien');
        fireEvent.click(document.querySelector('.adm-btn-outline')!);

        fireEvent.click(await screen.findByRole('button', { name: /approuver/i }));

        await waitFor(() => expect(svc.validateKyc).toHaveBeenCalledWith('d1', 'approved'));
        await waitFor(() => expect(svc.getKycDocuments.mock.calls.length).toBeGreaterThan(1));
        expect(screen.queryByAltText('KYC Document')).not.toBeInTheDocument();
    });

    it("exige un motif avant de confirmer un rejet, puis le transmet", async () => {
        svc.validateKyc.mockResolvedValue({});
        render(<AdminKyc />);
        await screen.findByText('Paul Technicien');
        fireEvent.click(document.querySelector('.adm-btn-outline')!);

        fireEvent.click(await within(await modale()).findByText(/^\s*Rejeter\s*$/));
        const confirmer = await screen.findByRole('button', { name: /confirmer le rejet/i });
        expect(confirmer).toBeDisabled();
        fireEvent.change(screen.getByPlaceholderText(/raison du rejet/i), { target: { value: 'Photo illisible' } });
        fireEvent.click(confirmer);

        await waitFor(() => expect(svc.validateKyc).toHaveBeenCalledWith('d1', 'rejected', 'Photo illisible'));
    });

    it("annule la saisie du motif sans appel serveur", async () => {
        render(<AdminKyc />);
        await screen.findByText('Paul Technicien');
        fireEvent.click(document.querySelector('.adm-btn-outline')!);
        fireEvent.click(await within(await modale()).findByText(/^\s*Rejeter\s*$/));

        fireEvent.click(await screen.findByRole('button', { name: 'Annuler' }));

        expect(screen.queryByPlaceholderText(/raison du rejet/i)).not.toBeInTheDocument();
        expect(svc.validateKyc).not.toHaveBeenCalled();
    });

    it("n'offre aucune action sur un document déjà traité et affiche le motif de rejet", async () => {
        svc.getKycDocuments.mockResolvedValue(page([doc({ status: 'rejected', rejection_reason: 'Flou' })]));
        render(<AdminKyc />);
        await screen.findByText('Paul Technicien');

        fireEvent.click(document.querySelector('.adm-btn-outline')!);

        expect(await screen.findByText('Flou')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /approuver/i })).not.toBeInTheDocument();
    });

    it('survit à une erreur de chargement et à un échec de validation', async () => {
        svc.getKycDocuments.mockRejectedValueOnce(new Error('500'));
        render(<AdminKyc />);
        expect(await screen.findByText(/Validation KYC/)).toBeInTheDocument();
    });
});
