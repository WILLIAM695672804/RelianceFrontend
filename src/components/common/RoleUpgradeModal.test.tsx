import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const post = vi.hoisted(() => vi.fn());
vi.mock('../../services/api', () => ({ default: { post } }));

import RoleUpgradeModal from './RoleUpgradeModal';

const remplir = () => {
    fireEvent.change(screen.getByPlaceholderText(/décrivez votre expérience/i), { target: { value: '10 ans de plomberie' } });
    fireEvent.change(screen.getByPlaceholderText(/pourquoi souhaitez-vous/i), { target: { value: 'Développer mon activité' } });
};

describe('RoleUpgradeModal', () => {
    beforeEach(() => { vi.clearAllMocks(); vi.spyOn(window, 'alert').mockImplementation(() => {}); });

    it("ne rend rien lorsqu'elle est fermée", () => {
        const { container } = render(<RoleUpgradeModal isOpen={false} onClose={vi.fn()} />);
        expect(container).toBeEmptyDOMElement();
    });

    it("désactive l'envoi tant qu'aucune compétence n'est choisie", () => {
        render(<RoleUpgradeModal isOpen onClose={vi.fn()} />);

        expect(screen.getByRole('button', { name: 'Soumettre' })).toBeDisabled();
        fireEvent.click(screen.getByRole('button', { name: 'Plomberie' }));
        expect(screen.getByRole('button', { name: 'Soumettre' })).toBeEnabled();
    });

    it('bascule une compétence à la sélection puis à la désélection', () => {
        render(<RoleUpgradeModal isOpen onClose={vi.fn()} />);
        const puce = screen.getByRole('button', { name: 'Plomberie' });

        fireEvent.click(puce);
        expect(puce).toHaveClass('selected');
        fireEvent.click(puce);
        expect(puce).not.toHaveClass('selected');
    });

    it('soumet la demande puis confirme son envoi', async () => {
        post.mockResolvedValue({});
        const onClose = vi.fn();
        render(<RoleUpgradeModal isOpen onClose={onClose} />);

        remplir();
        fireEvent.click(screen.getByRole('button', { name: 'Plomberie' }));
        fireEvent.click(screen.getByRole('button', { name: 'Électricité' }));
        fireEvent.click(screen.getByRole('button', { name: 'Soumettre' }));

        await waitFor(() => expect(post).toHaveBeenCalledWith('/auth/request-upgrade', {
            bio: '10 ans de plomberie', motivation: 'Développer mon activité', skills: ['Plomberie', 'Électricité'],
        }));
        expect(await screen.findByText('Demande envoyée !')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Fermer' }));
        expect(onClose).toHaveBeenCalled();
    });

    it("affiche le message serveur en cas d'échec et reste sur le formulaire", async () => {
        post.mockRejectedValue({ response: { data: { message: 'Une demande est déjà en cours.' } } });
        render(<RoleUpgradeModal isOpen onClose={vi.fn()} />);

        remplir();
        fireEvent.click(screen.getByRole('button', { name: 'Plomberie' }));
        fireEvent.click(screen.getByRole('button', { name: 'Soumettre' }));

        await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Une demande est déjà en cours.'));
        expect(screen.queryByText('Demande envoyée !')).not.toBeInTheDocument();
    });

    it('annule sans appel serveur', () => {
        const onClose = vi.fn();
        render(<RoleUpgradeModal isOpen onClose={onClose} />);

        fireEvent.click(screen.getByRole('button', { name: 'Annuler' }));

        expect(onClose).toHaveBeenCalled();
        expect(post).not.toHaveBeenCalled();
    });
});
