import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const submitReview = vi.fn();
vi.mock('../../services/reviewService', () => ({ default: { submitReview: (...a: unknown[]) => submitReview(...a) } }));

import ReviewModal from './ReviewModal';

const setup = (stage?: 'pre' | 'post') => {
    const onClose = vi.fn();
    const onSubmitted = vi.fn();
    render(<ReviewModal requestId="r1" technicianName="Paul" stage={stage} onClose={onClose} onSubmitted={onSubmitted} />);
    return { onClose, onSubmitted };
};

describe('ReviewModal', () => {
    beforeEach(() => vi.clearAllMocks());

    it("désactive l'envoi tant qu'aucune note n'est choisie", () => {
        setup();
        expect(screen.getByRole('button', { name: /envoyer/i })).toBeDisabled();
    });

    it("envoie l'avis « post » par défaut avec la note choisie", async () => {
        submitReview.mockResolvedValue({});
        const { onSubmitted } = setup();

        fireEvent.click(screen.getAllByText('star')[3]);
        fireEvent.click(screen.getByRole('button', { name: /envoyer/i }));

        await waitFor(() => expect(onSubmitted).toHaveBeenCalled());
        expect(submitReview).toHaveBeenCalledWith('r1', 4, undefined, 'post');
    });

    it("transmet l'étape « pre » et adapte la question posée", async () => {
        submitReview.mockResolvedValue({});
        setup('pre');

        expect(screen.getByText(/avant l'intervention/i)).toBeInTheDocument();
        fireEvent.click(screen.getAllByText('star')[0]);
        fireEvent.change(screen.getByPlaceholderText(/decrivez/i), { target: { value: 'Rassurant' } });
        fireEvent.click(screen.getByRole('button', { name: /envoyer/i }));

        await waitFor(() => expect(submitReview).toHaveBeenCalledWith('r1', 1, 'Rassurant', 'pre'));
    });

    it("affiche l'erreur serveur (avis en double) sans fermer la fenêtre", async () => {
        submitReview.mockRejectedValue({ response: { data: { message: 'Avis déjà déposé' } } });
        const { onSubmitted } = setup();

        fireEvent.click(screen.getAllByText('star')[4]);
        fireEvent.click(screen.getByRole('button', { name: /envoyer/i }));

        expect(await screen.findByText('Avis déjà déposé')).toBeInTheDocument();
        expect(onSubmitted).not.toHaveBeenCalled();
    });
});
