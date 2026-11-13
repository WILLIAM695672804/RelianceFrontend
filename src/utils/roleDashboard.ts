import type { UserRole } from '../context/AuthContext';

/** Tableau de bord d'arrivée selon le rôle (connexion, double authentification). */
export const getRoleDashboard = (role: UserRole | string): string => {
    switch (role) {
        case 'technicien': return '/technicien/dashboard';
        case 'agence': return '/agence/dashboard';
        case 'admin': return '/admin/dashboard';
        case 'client': return '/espace-client/dashboard';
        default: return '/';
    }
};
