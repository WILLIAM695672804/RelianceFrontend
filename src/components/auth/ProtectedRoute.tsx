import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactElement;
    allowedRoles: UserRole[];
}

/**
 * Route guard qui vérifie :
 * 1. L'utilisateur est authentifié (sinon → /connexion)
 * 2. L'utilisateur a le bon rôle (sinon → son dashboard approprié)
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, isLoading, role } = useAuth();
    const location = useLocation();

    // Pendant le chargement initial (restauration session), afficher un loader
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: '#0a0a0f',
                color: '#ffffff',
                fontFamily: 'Inter, sans-serif',
                fontSize: '1.1rem',
                gap: '12px',
            }}>
                <div style={{
                    width: '24px',
                    height: '24px',
                    border: '3px solid rgba(255,255,255,0.2)',
                    borderTopColor: '#6366f1',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }} />
                Chargement...
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // Non authentifié → redirection vers /connexion avec sauvegarde de l'URL voulue
    if (!isAuthenticated) {
        return <Navigate to="/connexion" state={{ from: location.pathname }} replace />;
    }

    // Rôle non autorisé → redirection vers le bon dashboard
    if (!allowedRoles.includes(role)) {
        const redirectMap: Record<UserRole, string> = {
            client: '/espace-client/dashboard',
            technicien: '/technicien/dashboard',
            agence: '/agence/dashboard',
            admin: '/admin/dashboard',
            guest: '/connexion',
        };
        return <Navigate to={redirectMap[role] || '/'} replace />;
    }

    // Tout OK → afficher le contenu protégé
    return children;
};

export default ProtectedRoute;
