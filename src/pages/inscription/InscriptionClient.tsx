import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/layout/Footer';
import '../../styles/variables.css';
import './InscriptionClient.css';

const InscriptionClient: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        passwordConfirmation: '',
        acceptTerms: false,
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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

        if (formData.password !== formData.passwordConfirmation) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        setLoading(true);
        try {
            await register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                password_confirmation: formData.passwordConfirmation,
                role: 'client',
            });
            navigate('/espace-client/dashboard');
        } catch (err: any) {
            const data = err.response?.data;
            if (data?.errors) {
                const firstError = Object.values(data.errors).flat()[0] as string;
                setError(firstError);
            } else {
                setError(data?.message || 'Une erreur est survenue');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-inscription-client">

            <section className="ic-section">
                <div className="container">
                    <h1 className="ic-page-title">Inscription Client</h1>
                    <p className="ic-subtitle">
                        Créez votre compte client pour accéder à notre réseau de techniciens certifiés
                    </p>

                    <div className="ic-card">
                        {error && (
                            <div style={{
                                background: 'rgba(220,38,38,0.1)',
                                color: '#dc2626',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                marginBottom: '16px',
                                fontSize: '0.9rem'
                            }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="ic-field">
                                <label className="ic-label">
                                    <FaUser className="ic-label-icon" />
                                    Nom complet
                                </label>
                                <input type="text" name="name" className="ic-input" placeholder="Entrez votre nom complet"
                                    value={formData.name} onChange={handleChange} required />
                            </div>

                            <div className="ic-field">
                                <label className="ic-label">
                                    <FaEnvelope className="ic-label-icon" />
                                    Adresse email
                                </label>
                                <input type="email" name="email" className="ic-input" placeholder="Entrez votre adresse email"
                                    value={formData.email} onChange={handleChange} required />
                            </div>

                            <div className="ic-field">
                                <label className="ic-label">
                                    <FaPhone className="ic-label-icon" />
                                    Téléphone
                                </label>
                                <input type="tel" name="phone" className="ic-input" placeholder="Ex: +237 6XX XXX XXX"
                                    value={formData.phone} onChange={handleChange} required />
                            </div>

                            <div className="ic-field">
                                <label className="ic-label">
                                    <FaLock className="ic-label-icon" />
                                    Mot de passe
                                </label>
                                <input type="password" name="password" className="ic-input" placeholder="Minimum 8 caractères"
                                    value={formData.password} onChange={handleChange} required />
                            </div>

                            <div className="ic-field">
                                <label className="ic-label">
                                    <FaLock className="ic-label-icon" />
                                    Confirmer le mot de passe
                                </label>
                                <input type="password" name="passwordConfirmation" className="ic-input" placeholder="Confirmez votre mot de passe"
                                    value={formData.passwordConfirmation} onChange={handleChange} required />
                            </div>

                            <div className="ic-terms">
                                <label className="ic-checkbox-label">
                                    <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms}
                                        onChange={handleChange} required />
                                    J'accepte les <Link to="/cgu">conditions d'utilisation</Link> et la{' '}
                                    <Link to="/confidentialite">politique de confidentialité</Link>
                                </label>
                            </div>

                            <button type="submit" className="ic-submit-btn" disabled={loading}>
                                {loading ? <><FaSpinner className="spin-icon" /> Création...</> : 'Créer mon compte'}
                            </button>
                        </form>
                    </div>

                    <p className="ic-login-text">
                        Vous avez déjà un compte ?{' '}
                        <Link to="/connexion" className="ic-login-link">
                            Connectez-vous
                        </Link>
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default InscriptionClient;
