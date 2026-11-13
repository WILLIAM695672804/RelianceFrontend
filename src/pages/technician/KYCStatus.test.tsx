import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const tech = vi.hoisted(() => ({ fetchKycDocuments: vi.fn(), uploadKycDocument: vi.fn() }));
const navigate = vi.hoisted(() => vi.fn());
vi.mock('../../services/technicianService', () => tech);
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import KYCStatus from './KYCStatus';

const doc = (type: string, status: string, over = {}) => ({ id: `d-${type}-${status}`, type, status, url: `http://api.test/${type}.jpg`, rejection_reason: null, created_at: '2026-11-01T00:00:00Z', ...over });

/** Simule le sélecteur de fichier (input créé dynamiquement) en déclenchant onchange au clic. */
const choisirFichier = (taille = 1024) => {
    const fichier = new File(['x'], 'cni.jpg', { type: 'image/jpeg' });
    Object.defineProperty(fichier, 'size', { value: taille });
    vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(function (this: HTMLInputElement) {
        (this as any).onchange?.({ target: { files: [fichier] } });
    });
    return fichier;
};

describe('KYCStatus', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        tech.fetchKycDocuments.mockResolvedValue([]);
    });

    it('affiche les quatre pièces requises « À fournir » avec une progression nulle', async () => {
        render(<KYCStatus />);

        expect(await screen.findByText("Carte d'Identité Nationale")).toBeInTheDocument();
        expect(screen.getAllByText('À fournir')).toHaveLength(4);
        expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('calcule la progression sur les documents vérifiés uniquement', async () => {
        tech.fetchKycDocuments.mockResolvedValue([doc('cni', 'approved'), doc('casier', 'pending')]);
        render(<KYCStatus />);

        expect(await screen.findByText('25%')).toBeInTheDocument();
        expect(screen.getByText('Vérifié')).toBeInTheDocument();
        expect(screen.getByText("En cours d'analyse")).toBeInTheDocument();
    });

    it('survit à un échec de chargement', async () => {
        tech.fetchKycDocuments.mockRejectedValue(new Error('500'));
        render(<KYCStatus />);

        expect(await screen.findByText("Carte d'Identité Nationale")).toBeInTheDocument();
    });

    it('affiche le motif de rejet et autorise un nouveau dépôt', async () => {
        tech.fetchKycDocuments.mockResolvedValue([doc('cni', 'rejected', { rejection_reason: 'Photo illisible' })]);
        render(<KYCStatus />);

        expect(await screen.findByText('Motif du rejet : Photo illisible')).toBeInTheDocument();
        expect(screen.getAllByText('Téléverser')).toHaveLength(4);
    });

    it("retient le document le plus récent lorsqu'un type a été redéposé après un rejet", async () => {
        tech.fetchKycDocuments.mockResolvedValue([
            doc('cni', 'rejected', { id: 'ancien', created_at: '2026-10-01T00:00:00Z', rejection_reason: 'Flou' }),
            doc('cni', 'pending', { id: 'recent', created_at: '2026-11-05T00:00:00Z' }),
        ]);
        render(<KYCStatus />);

        expect(await screen.findByText("En cours d'analyse")).toBeInTheDocument();
        expect(screen.queryByText(/motif du rejet/i)).not.toBeInTheDocument();
    });

    it('ouvre un document déjà fourni dans un nouvel onglet', async () => {
        const open = vi.spyOn(window, 'open').mockImplementation(() => null);
        tech.fetchKycDocuments.mockResolvedValue([doc('cni', 'pending')]);
        render(<KYCStatus />);

        fireEvent.click(await screen.findByTitle('Voir le document'));

        expect(open).toHaveBeenCalledWith('http://api.test/cni.jpg', '_blank');
    });

    // ── Dépôt ──────────────────────────────────────────────

    it("téléverse le document choisi sous son type et le passe « en cours d'analyse »", async () => {
        const fichier = choisirFichier();
        tech.uploadKycDocument.mockResolvedValue({ document: { status: 'pending', url: 'http://api.test/new.jpg' } });
        render(<KYCStatus />);

        fireEvent.click((await screen.findAllByText('Téléverser'))[0]);

        await waitFor(() => expect(tech.uploadKycDocument).toHaveBeenCalledWith('cni', fichier));
        expect(await screen.findByText(/téléversé avec succès/i)).toBeInTheDocument();
        expect(screen.getByText("En cours d'analyse")).toBeInTheDocument();
    });

    it("refuse un fichier de plus de 5 Mo sans appeler le serveur", async () => {
        choisirFichier(6 * 1024 * 1024);
        render(<KYCStatus />);

        fireEvent.click((await screen.findAllByText('Téléverser'))[0]);

        expect(await screen.findByText(/trop volumineux/i)).toBeInTheDocument();
        expect(tech.uploadKycDocument).not.toHaveBeenCalled();
        fireEvent.click(screen.getByText('Fermer'));
        expect(screen.queryByText(/trop volumineux/i)).not.toBeInTheDocument();
    });

    it("signale l'échec du dépôt et conserve le statut « À fournir »", async () => {
        choisirFichier();
        tech.uploadKycDocument.mockRejectedValue(new Error('422'));
        render(<KYCStatus />);

        fireEvent.click((await screen.findAllByText('Téléverser'))[0]);

        expect(await screen.findByText(/erreur est survenue lors de l'envoi/i)).toBeInTheDocument();
        expect(screen.getAllByText('À fournir')).toHaveLength(4);
    });

    it('revient à la page précédente', async () => {
        render(<KYCStatus />);

        fireEvent.click(await screen.findByText('Retour'));

        expect(navigate).toHaveBeenCalledWith(-1);
    });
});
