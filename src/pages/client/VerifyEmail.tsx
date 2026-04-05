import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import './Auth2FA.css'; // Re-using existing auth styles for consistency

const VerifyEmail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Vérification de votre adresse e-mail en cours...');

    useEffect(() => {
        const verify = async () => {
            const queryParams = new URLSearchParams(location.search);
            const verificationUrl = queryParams.get('url');

            if (!verificationUrl) {
                setStatus('error');
                setMessage('Lien de vérification invalide ou manquant.');
                return;
            }

            try {
                const response = await authService.verifyEmail(verificationUrl);
                setStatus('success');
                setMessage(response.message || 'Votre e-mail a été vérifié avec succès !');
                
                // Redirect to dashboard after 3 seconds
                setTimeout(() => {
                    navigate('/espace-client/dashboard');
                }, 3000);
            } catch (error: any) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Le lien de vérification a expiré ou est invalide.');
            }
        };

        verify();
    }, [location, navigate]);

    return (
        <div className="auth-2fa-container">
            <div className="auth-2fa-card">
                <div className="auth-2fa-header">
                    <div className="auth-2fa-icon-wrapper">
                        <span className="material-symbols-outlined auth-2fa-icon">
                            {status === 'loading' ? 'sync' : (status === 'success' ? 'verified' : 'error')}
                        </span>
                    </div>
                    <h2 className="auth-2fa-title">Vérification E-mail</h2>
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
                                Votre adresse e-mail a été confirmée. Redirection vers votre tableau de bord...
                            </p>
                            <Link to="/espace-client/dashboard" className="btn-primary w-full inline-block py-3 rounded-xl text-center">
                                Aller au Dashboard
                            </Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div key="error" className="text-center py-4">
                            <button 
                                onClick={() => navigate('/connexion')}
                                className="btn-primary w-full py-3 rounded-xl mb-4"
                            >
                                Retour à la connexion
                            </button>
                            <p className="text-sm text-on-surface-variant">
                                Si le problème persiste, demandez un nouveau lien depuis votre profil.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
