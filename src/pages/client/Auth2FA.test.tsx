import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const login = vi.hoisted(() => vi.fn());
const navigate = vi.hoisted(() => vi.fn());
vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ login }) }));
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import Auth2FA from './Auth2FA';

const renderPage = (state: any = { email: 'a@test.local', password: 'Passw0rd!123' }) =>
    render(<MemoryRouter initialEntries={[{ pathname: '/auth/2fa', state }]}><Auth2FA /></MemoryRouter>);
const cases = () => Array.from(document.querySelectorAll<HTMLInputElement>('.otp-digit-input'));
const saisir = (code: string) => code.split('').forEach((c, i) => fireEvent.change(cases()[i], { target: { value: c } }));
const verifier = () => fireEvent.submit(document.querySelector('form')!);

describe('Auth2FA', () => {
    beforeEach(() => vi.clearAllMocks());

    it("renvoie vers la connexion lorsque la page est ouverte sans identifiants", async () => {
        renderPage(null);

        await waitFor(() => expect(navigate).toHaveBeenCalledWith('/connexion'));
    });

    it("donne le focus à la première case et passe à la suivante après un chiffre", async () => {
        renderPage();

        await waitFor(() => expect(cases()[0]).toHaveFocus());
        fireEvent.change(cases()[0], { target: { value: '1' } });
        expect(cases()[1]).toHaveFocus();
    });

    it.each([['a'], [' '], ['12']])("refuse la saisie « %s » (un seul chiffre par case)", (valeur) => {
        renderPage();

        fireEvent.change(cases()[0], { target: { value: valeur } });

        expect(cases()[0]).toHaveValue('');
    });

    it('revient à la case précédente avec Retour arrière sur une case vide', async () => {
        renderPage();
        fireEvent.change(cases()[0], { target: { value: '1' } });

        fireEvent.keyDown(cases()[1], { key: 'Backspace' });

        expect(cases()[0]).toHaveFocus();
    });

    it('exige les 6 chiffres', async () => {
        renderPage();

        saisir('123');
        verifier();

        expect(await screen.findByText(/6 chiffres du code otp/i)).toBeInTheDocument();
        expect(login).not.toHaveBeenCalled();
    });

    it("signale une session expirée lorsque le mot de passe n'est pas transmis", async () => {
        renderPage({ email: 'a@test.local' });

        saisir('123456');
        verifier();

        expect(await screen.findByText(/session expirée/i)).toBeInTheDocument();
        expect(login).not.toHaveBeenCalled();
    });

    it.each([
        ['technicien', '/technicien/dashboard'],
        ['admin', '/admin/dashboard'],
        ['agence', '/agence/dashboard'],
        ['client', '/espace-client/dashboard'],
    ])("connecte avec le code puis redirige un %s vers %s", async (role, destination) => {
        login.mockResolvedValue({ user: { roles: [{ name: role }] } });
        renderPage();

        saisir('123456');
        verifier();

        await waitFor(() => expect(login).toHaveBeenCalledWith({ email: 'a@test.local', password: 'Passw0rd!123', code: '123456' }));
        await waitFor(() => expect(navigate).toHaveBeenCalledWith(destination));
    });

    it("affiche le message serveur, efface les cases et redonne le focus après un code invalide", async () => {
        login.mockRejectedValue({ response: { data: { message: 'Code 2FA invalide' } } });
        renderPage();

        saisir('000000');
        verifier();

        expect(await screen.findByText('Code 2FA invalide')).toBeInTheDocument();
        expect(cases().every((c) => c.value === '')).toBe(true);
        expect(cases()[0]).toHaveFocus();
        expect(navigate).not.toHaveBeenCalledWith(expect.stringContaining('dashboard'));
    });

    it("utilise un message par défaut sans réponse serveur", async () => {
        login.mockRejectedValue(new Error('réseau'));
        renderPage();

        saisir('111111');
        verifier();

        expect(await screen.findByText('Code invalide')).toBeInTheDocument();
    });

    it('permet de revenir à la connexion', () => {
        renderPage();

        fireEvent.click(screen.getByText('Retour'));

        expect(navigate).toHaveBeenCalledWith('/connexion');
    });
});
