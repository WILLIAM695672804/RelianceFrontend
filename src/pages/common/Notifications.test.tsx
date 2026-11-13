import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const svc = vi.hoisted(() => ({ getNotifications: vi.fn(), markAsRead: vi.fn(), markAllAsRead: vi.fn() }));
vi.mock('../../services/notificationService', () => ({ notificationService: svc }));

import Notifications from './Notifications';

const notif = (id: string, over = {}) => ({ id, title: `Titre ${id}`, body: `Corps ${id}`, payload: {}, is_read: false, read_at: null, created_at: new Date().toISOString(), ...over });
const page = (rows: unknown[]) => ({ data: { data: rows } });
const ilYa = (ms: number) => new Date(Date.now() - ms).toISOString();

describe('Notifications', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});
        svc.getNotifications.mockResolvedValue(page([notif('1'), notif('2', { is_read: true })]));
    });
    afterEach(() => vi.useRealTimers());

    it('affiche le chargement puis les notifications et le nombre de non-lues', async () => {
        render(<Notifications />);

        expect(screen.getByText('Chargement...')).toBeInTheDocument();
        expect(await screen.findByText('Titre 1')).toBeInTheDocument();
        expect(screen.getByText('Tout marquer lu (1)')).toBeInTheDocument();
        expect(document.querySelectorAll('.notif-item.unread')).toHaveLength(1);
    });

    it('affiche un état vide', async () => {
        svc.getNotifications.mockResolvedValue(page([]));
        render(<Notifications />);

        expect(await screen.findByText('Aucune notification')).toBeInTheDocument();
        expect(screen.queryByText(/tout marquer lu/i)).not.toBeInTheDocument();
    });

    it('sort du chargement si le serveur est indisponible', async () => {
        svc.getNotifications.mockRejectedValue(new Error('500'));
        render(<Notifications />);

        expect(await screen.findByText('Aucune notification')).toBeInTheDocument();
    });

    it.each([
        [5 * 60_000, 'il y a 5min'],
        [3 * 3_600_000, 'il y a 3h'],
        [2 * 86_400_000, 'il y a 2j'],
    ])("exprime l'ancienneté (%i ms → %s)", async (ecart, texte) => {
        svc.getNotifications.mockResolvedValue(page([notif('1', { created_at: ilYa(ecart) })]));
        render(<Notifications />);

        expect(await screen.findByText(texte)).toBeInTheDocument();
    });

    it('marque une notification lue au clic, une seule fois', async () => {
        svc.markAsRead.mockResolvedValue({});
        render(<Notifications />);

        fireEvent.click(await screen.findByText('Titre 1'));

        await waitFor(() => expect(document.querySelectorAll('.notif-item.unread')).toHaveLength(0));
        expect(svc.markAsRead).toHaveBeenCalledWith('1');
        fireEvent.click(screen.getByText('Titre 1'));
        fireEvent.click(screen.getByText('Titre 2'));
        expect(svc.markAsRead).toHaveBeenCalledTimes(1);
    });

    it('marque tout lu', async () => {
        svc.markAllAsRead.mockResolvedValue({});
        render(<Notifications />);

        fireEvent.click(await screen.findByText('Tout marquer lu (1)'));

        await waitFor(() => expect(screen.queryByText(/tout marquer lu/i)).not.toBeInTheDocument());
        expect(svc.markAllAsRead).toHaveBeenCalled();
    });

    it("propose « Charger plus » seulement avec une page pleine (20) et ajoute la page suivante", async () => {
        const pleine = Array.from({ length: 20 }, (_, i) => notif(`a${i}`));
        svc.getNotifications.mockResolvedValueOnce(page(pleine)).mockResolvedValueOnce(page([notif('b1')]));
        render(<Notifications />);

        fireEvent.click(await screen.findByText('Charger plus'));

        expect(await screen.findByText('Titre b1')).toBeInTheDocument();
        expect(svc.getNotifications).toHaveBeenLastCalledWith(2);
        expect(screen.getByText('Titre a0')).toBeInTheDocument();
        expect(screen.queryByText('Charger plus')).not.toBeInTheDocument();
    });

    it("n'affiche pas « Charger plus » pour une page incomplète", async () => {
        render(<Notifications />);

        await screen.findByText('Titre 1');
        expect(screen.queryByText('Charger plus')).not.toBeInTheDocument();
    });
});
