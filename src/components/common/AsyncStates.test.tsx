import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState, ErrorState, Loading } from './AsyncStates';

describe('AsyncStates', () => {
    it('Loading affiche le libellé par défaut puis personnalisé', () => {
        const { rerender } = render(<Loading />);
        expect(screen.getByText('Chargement…')).toBeInTheDocument();
        rerender(<Loading label="Patientez" />);
        expect(screen.getByText('Patientez')).toBeInTheDocument();
    });

    it('EmptyState affiche titre, message et action optionnels', () => {
        const { rerender } = render(<EmptyState />);
        expect(screen.getByText('Aucune donnée')).toBeInTheDocument();
        rerender(<EmptyState title="Vide" message="Rien ici" action={<button>Créer</button>} />);
        expect(screen.getByText('Rien ici')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Créer' })).toBeInTheDocument();
    });

    it("ErrorState n'affiche « Réessayer » que si un gestionnaire est fourni", () => {
        const retry = vi.fn();
        const { rerender } = render(<ErrorState />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
        rerender(<ErrorState message="Panne" onRetry={retry} />);
        fireEvent.click(screen.getByRole('button', { name: 'Réessayer' }));
        expect(screen.getByText('Panne')).toBeInTheDocument();
        expect(retry).toHaveBeenCalledTimes(1);
    });
});
