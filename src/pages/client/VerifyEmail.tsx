import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import './Auth2FA.css';

const VerifyEmail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verification de votre adresse e-mail en cours...');

    // La vérification ne doit s'exécuter qu'une fois : refreshUser() modifie `user`, ce qui
    // relancerait l'effet en boucle (vérifications et redirections répétées).
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return;
        started.current = true;
        const verify = async () => {
            const queryParams = new URLSearchParams(location.search);
            const verificationUrl = queryParams.get('url');

            if (!verificationUrl) {
                setStatus('error');
                setMessage('Lien de verification invalide ou manquant.');
                return;
            }

            try {
                const response = await authService.verifyEmail(verificationUrl);
                setStatus('success');
                setMessage(response.message || 'Votre e-mail a ete verifie avec succes !');

                // Refresh user data so email_verified_at is updated
                await refreshUser();

                // Redirect to the appropriate dashboard with verified flag
                const role = user?.roles?.[0]?.name;
                const dashboardPath = role === 'technicien'
                    ? '/technicien/dashboard'
                    : '/espace-client/dashboard';

                setTimeout(() => {
                    navigate(`${dashboardPath}?verified=1`, { replace: true });
                }, 1500);
            } catch (error: any) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Le lien de verification a expire ou est invalide.');
            }
        };

        verify();
    }, [location, navigate, refreshUser, user]);

    return (
        <div className="auth-2fa-container">
            <div className="auth-2fa-card">
                <div className="auth-2fa-header">
                    <div className="auth-2fa-icon-wrapper">
                        <span className="material-symbols-outlined auth-2fa-icon">
                            {status === 'loading' ? 'sync' : (status === 'success' ? 'verified' : 'error')}
                        </span>
                    </div>
                    <h2 className="auth-2fa-title">Verification E-mail</h2>
                    <p className="auth-2fa-subtitle">{message}</p>
                </div>

                <div className="auth-2fa-body">
                    {status === 'loading' && (
                        <div key="loading" className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {status === 'success' && (
                        <div key="success" className="text-center py-4">
                            <p className="text-on-surface-variant mb-6">
                                Redirection vers votre tableau de bord...
                            </p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div key="error" className="text-center py-4">
                            <button
                                onClick={() => navigate('/connexion')}
                                className="btn-primary w-full py-3 rounded-xl mb-4"
                            >
                                Retour a la connexion
                            </button>
                            <p className="text-sm text-on-surface-variant">
                                Si le probleme persiste, demandez un nouveau lien depuis votre profil.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
