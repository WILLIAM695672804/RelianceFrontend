import authService from '../services/authService';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../context/AuthContext';
import { getRoleDashboard } from '../utils/roleDashboard';
import Footer from '../components/layout/Footer';
import '../styles/variables.css';
import './Connexion.css';

const Connexion: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated, role } = useAuth();
    const from = (location.state as any)?.from;

    // Si déjà connecté, rediriger vers le dashboard
    useEffect(() => {
        if (isAuthenticated && role !== 'guest') {
            navigate(from || getRoleDashboard(role), { replace: true });
        }
    }, [isAuthenticated, role, navigate, from]);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [needsVerification, setNeedsVerification] = useState(false);
    const [resendInfo, setResendInfo] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setNeedsVerification(false);
        setResendInfo(null);
        setLoading(true);

        try {
            const result = await login({
                email: formData.email,
                password: formData.password,
            });

            if (result.requires_2fa) {
                // Passer les identifiants vers la page 2FA
                navigate('/auth/2fa', {
                    state: { email: formData.email, password: formData.password },
                });
                return;
            }

            // Login réussi — rediriger vers la page d'origine ou le dashboard du rôle
            const userRole = (result.user?.roles?.[0]?.name || 'client') as UserRole;
            navigate(from || getRoleDashboard(userRole), { replace: true });
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Une erreur est survenue';
            setError(msg);
            setNeedsVerification(!!err.response?.data?.requires_email_verification);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-connexion">

            <section className="cx-section">
                <div className="container">
                    <h1 className="cx-page-title">Connectez-vous</h1>

                    <div className="cx-card">
                        {error && (
                            <div className="cx-error" style={{
                                background: 'rgba(220,38,38,0.1)',
                                color: '#dc2626',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                marginBottom: '16px',
                                fontSize: '0.9rem'
                            }}>
                                {error}
                                {needsVerification && (
                                    <div style={{ marginTop: 8 }}>
                                        <button
                                            type="button"
                                            className="cx-link"
                                            style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                                            onClick={async () => {
                                                try {
                                                    const r = await authService.resendVerificationEmailFor(formData.email);
                                                    setResendInfo(r.message);
                                                } catch {
                                                    setResendInfo('Envoi impossible pour le moment, réessayez dans un instant.');
                                                }
                                            }}
                                        >
                                            Renvoyer le lien de vérification
                                        </button>
                                        {resendInfo && <div style={{ marginTop: 4 }}>{resendInfo}</div>}
                                    </div>
                                )}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="cx-field">
                                <label className="cx-label">
                                    <FaEnvelope className="cx-label-icon" />
                                    Adresse email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="cx-input"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="cx-field">
                                <label className="cx-label">
                                    <FaLock className="cx-label-icon" />
                                    Mot de passe
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    className="cx-input"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="cx-remember">
                                <label className="cx-checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                    />
                                    Se souvenir de moi
                                </label>
                            </div>

                            <button type="submit" className="cx-submit-btn" disabled={loading}>
                                {loading ? <><FaSpinner className="spin-icon" /> Connexion...</> : 'Connexion'}
                            </button>

                            <div className="cx-forgot">
                                <Link to="/mot-de-passe-oublie" className="cx-forgot-link">
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                        </form>
                    </div>

                    <p className="cx-register-text">
                        Vous n'avez pas encore de compte ?{' '}
                        <Link to="/devenir-membre" className="cx-register-link">
                            Inscrivez-vous
                        </Link>
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Connexion;
