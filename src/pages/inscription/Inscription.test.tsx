import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const register = vi.hoisted(() => vi.fn());
const navigate = vi.hoisted(() => vi.fn());
vi.mock('../../context/AuthContext', () => ({ useAuth: () => ({ register }) }));
vi.mock('../../components/layout/Footer', () => ({ default: () => null }));
vi.mock('react-router-dom', async (orig) => ({ ...(await orig<typeof import('react-router-dom')>()), useNavigate: () => navigate }));

import InscriptionAgence from './InscriptionAgence';
import InscriptionClient from './InscriptionClient';
import InscriptionEntreprise from './InscriptionEntreprise';
import InscriptionTechnicien from './InscriptionTechnicien';

const champ = (name: string) => document.querySelector(`[name="${name}"]`) as HTMLInputElement;
const saisir = (valeurs: Record<string, string>) =>
    Object.entries(valeurs).forEach(([n, v]) => fireEvent.change(champ(n), { target: { value: v } }));
const cocherCgu = () => fireEvent.click(champ('acceptTerms'));
const soumettre = () => fireEvent.submit(document.querySelector('form')!);
const communs = { email: 'nouveau@test.local', phone: '+237600000000', password: 'Passw0rd!123', passwordConfirmation: 'Passw0rd!123' };

const pages = [
    { nom: 'Client', Page: InscriptionClient, role: 'client', dest: '/espace-client/dashboard', remplir: () => saisir({ name: 'Alice', ...communs }) },
    { nom: 'Technicien', Page: InscriptionTechnicien, role: 'technicien', dest: '/technicien/dashboard',
        remplir: () => { saisir({ name: 'Paul', bio: 'Plombier', ...communs }); fireEvent.click(document.querySelector('.it-comp-tag')!); } },
    { nom: 'Agence', Page: InscriptionAgence, role: 'agence', dest: '/agence/dashboard',
        remplir: () => saisir({ agencyName: 'Dépann SARL', adminName: 'Marie', address: 'Akwa', ...communs }) },
    { nom: 'Entreprise', Page: InscriptionEntreprise, role: 'agence', dest: '/agence/dashboard',
        remplir: () => saisir({ companyName: 'Hôtel Soleil', contactName: 'Jean', address: 'Bonapriso', ...communs }) },
] as const;

describe.each(pages)('Inscription $nom', ({ Page, role, dest, remplir }) => {
    const renderPage = () => render(<MemoryRouter><Page /></MemoryRouter>);

    beforeEach(() => vi.clearAllMocks());

    it("enregistre le compte avec le rôle « " + role + " » puis redirige vers " + dest, async () => {
        register.mockResolvedValue(undefined);
        renderPage();

        remplir();
        cocherCgu();
        soumettre();

        await waitFor(() => expect(register).toHaveBeenCalledWith(expect.objectContaining({
            email: 'nouveau@test.local', password: 'Passw0rd!123', password_confirmation: 'Passw0rd!123', role,
        })));
        await waitFor(() => expect(navigate).toHaveBeenCalledWith(dest));
    });

    it('refuse des mots de passe différents sans appeler le serveur', async () => {
        renderPage();

        remplir();
        saisir({ passwordConfirmation: 'autre' });
        cocherCgu();
        soumettre();

        expect(await screen.findByText('Les mots de passe ne correspondent pas')).toBeInTheDocument();
        expect(register).not.toHaveBeenCalled();
    });

    it("affiche la première erreur de champ renvoyée par l'API (e-mail déjà pris)", async () => {
        register.mockRejectedValue({ response: { data: { message: 'invalid', errors: { email: ['Cette adresse est déjà utilisée.'] } } } });
        renderPage();

        remplir();
        cocherCgu();
        soumettre();

        expect(await screen.findByText('Cette adresse est déjà utilisée.')).toBeInTheDocument();
        expect(navigate).not.toHaveBeenCalled();
    });

    it("affiche une erreur générique sans réponse serveur et ne redirige pas", async () => {
        register.mockRejectedValue(new Error('réseau'));
        renderPage();

        remplir();
        cocherCgu();
        soumettre();

        expect(await screen.findByText(/Une erreur est survenue|Échec de l'inscription\. Vérifiez/)).toBeInTheDocument();
        expect(navigate).not.toHaveBeenCalled();
    });
});

describe('Inscription Technicien — compétences', () => {
    beforeEach(() => vi.clearAllMocks());

    it('exige au moins une compétence', async () => {
        render(<MemoryRouter><InscriptionTechnicien /></MemoryRouter>);
        saisir({ name: 'Paul', ...communs });
        cocherCgu();
        soumettre();

        expect(await screen.findByText('Veuillez sélectionner au moins une compétence')).toBeInTheDocument();
        expect(register).not.toHaveBeenCalled();
    });

    it('transmet les compétences cochées et la bio, et permet de les décocher', async () => {
        register.mockResolvedValue(undefined);
        render(<MemoryRouter><InscriptionTechnicien /></MemoryRouter>);
        const puces = document.querySelectorAll('.it-comp-tag');
        saisir({ name: 'Paul', bio: 'Plombier', ...communs });

        fireEvent.click(puces[0]);
        fireEvent.click(puces[1]);
        fireEvent.click(puces[0]);
        cocherCgu();
        soumettre();

        await waitFor(() => expect(register).toHaveBeenCalledWith(expect.objectContaining({
            bio: 'Plombier', competences: [puces[1].textContent],
        })));
    });
});

describe('Inscription Agence / Entreprise — données de la structure', () => {
    beforeEach(() => vi.clearAllMocks());

    it("transmet le nom de l'agence et l'adresse (rôle agence)", async () => {
        register.mockResolvedValue(undefined);
        render(<MemoryRouter><InscriptionAgence /></MemoryRouter>);

        saisir({ agencyName: 'Dépann SARL', adminName: 'Marie', address: 'Akwa', ...communs });
        cocherCgu();
        soumettre();

        await waitFor(() => expect(register).toHaveBeenCalledWith(expect.objectContaining({ agency_name: 'Dépann SARL', address: 'Akwa' })));
    });

    it("l'entreprise refuse d'envoyer sans accepter les conditions d'utilisation", async () => {
        render(<MemoryRouter><InscriptionEntreprise /></MemoryRouter>);
        saisir({ companyName: 'Hôtel Soleil', contactName: 'Jean', address: 'Bonapriso', ...communs });

        // contourne la contrainte HTML `required` : la page doit aussi valider côté script
        soumettre();

        expect(await screen.findByText(/accepter les conditions d'utilisation/i)).toBeInTheDocument();
        expect(register).not.toHaveBeenCalled();
    });
});
