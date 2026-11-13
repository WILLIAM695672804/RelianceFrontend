import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const api = vi.hoisted(() => ({ post: vi.fn() }));
const auth = vi.hoisted(() => ({ forgotPassword: vi.fn() }));
vi.mock('../services/api', () => ({ default: api }));
vi.mock('../services/authService', () => ({ default: auth }));
vi.mock('../components/layout/Footer', () => ({ default: () => null }));

import Contact from './Contact';
import ForgotPassword from './ForgotPassword';

const champ = (name: string) => document.querySelector(`[name="${name}"]`) as HTMLInputElement;

describe('Contact', () => {
    beforeEach(() => vi.clearAllMocks());
    const rendre = () => render(<MemoryRouter><Contact /></MemoryRouter>);
    const remplir = () => {
        fireEvent.change(champ('prefix'), { target: { value: 'Dr' } });
        fireEvent.change(champ('firstName'), { target: { value: 'Jean' } });
        fireEvent.change(champ('lastName'), { target: { value: 'Dupont' } });
        fireEvent.change(champ('email'), { target: { value: 'jean@test.local' } });
        fireEvent.change(champ('message'), { target: { value: 'Bonjour' } });
    };

    it("envoie nom complet, e-mail et message ; omet le téléphone vide ; vide le formulaire ensuite", async () => {
        api.post.mockResolvedValue({});
        rendre();

        remplir();
        fireEvent.submit(document.querySelector('form')!);

        await waitFor(() => expect(api.post).toHaveBeenCalledWith('/contact', { name: 'Dr Jean Dupont', email: 'jean@test.local', phone: undefined, message: 'Bonjour' }));
        expect(await screen.findByText(/message a bien été envoyé/i)).toBeInTheDocument();
        expect(champ('message')).toHaveValue('');
        expect(champ('prefix')).toHaveValue('M.');
    });

    it("transmet le téléphone lorsqu'il est renseigné", async () => {
        api.post.mockResolvedValue({});
        rendre();

        remplir();
        fireEvent.change(champ('phone'), { target: { value: '+237600000000' } });
        fireEvent.submit(document.querySelector('form')!);

        await waitFor(() => expect(api.post).toHaveBeenCalledWith('/contact', expect.objectContaining({ phone: '+237600000000' })));
    });

    it("affiche le message du serveur (limitation de débit) et conserve la saisie", async () => {
        api.post.mockRejectedValue({ response: { status: 429, data: { message: 'Too Many Attempts.' } } });
        rendre();

        remplir();
        fireEvent.submit(document.querySelector('form')!);

        expect(await screen.findByText('Too Many Attempts.')).toBeInTheDocument();
        expect(champ('message')).toHaveValue('Bonjour');
    });

    it("affiche un message générique sans réponse serveur", async () => {
        api.post.mockRejectedValue(new Error('réseau'));
        rendre();

        remplir();
        fireEvent.submit(document.querySelector('form')!);

        expect(await screen.findByText(/échec de l'envoi/i)).toBeInTheDocument();
    });
});

describe('ForgotPassword', () => {
    beforeEach(() => vi.clearAllMocks());
    const rendre = () => render(<MemoryRouter><ForgotPassword /></MemoryRouter>);
    const soumettre = (mail = 'a@test.local') => {
        fireEvent.change(document.querySelector('input[type="email"]')!, { target: { value: mail } });
        fireEvent.submit(document.querySelector('form')!);
    };

    it("confirme l'envoi avec un message neutre, sans révéler l'existence du compte", async () => {
        auth.forgotPassword.mockResolvedValue({ message: 'ok' });
        rendre();

        soumettre();

        await waitFor(() => expect(auth.forgotPassword).toHaveBeenCalledWith('a@test.local'));
        expect(await screen.findByText(/si un compte existe pour cette adresse/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /retour à la connexion/i })).toHaveAttribute('href', '/connexion');
    });

    it("affiche l'erreur serveur et permet de réessayer", async () => {
        auth.forgotPassword.mockRejectedValue({ response: { status: 429, data: { message: 'Trop de demandes' } } });
        rendre();

        soumettre();

        expect(await screen.findByText('Trop de demandes')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Envoyer le lien' })).toBeEnabled();
    });

    it("utilise un message par défaut sans réponse serveur", async () => {
        auth.forgotPassword.mockRejectedValue(new Error('réseau'));
        rendre();

        soumettre();

        expect(await screen.findByText(/impossible d'envoyer le lien/i)).toBeInTheDocument();
    });
});
