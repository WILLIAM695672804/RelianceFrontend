import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaBuilding, FaMapMarkerAlt, FaInfoCircle, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/layout/Footer';
import '../../styles/variables.css';
import './InscriptionAgence.css';

const InscriptionAgence: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        agencyName: '',
        adminName: '',
        email: '',
        phone: '',
        address: '',
        description: '',
        password: '',
        passwordConfirmation: '',
        acceptTerms: false,
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const target = e.target as HTMLInputElement;
        setFormData({
            ...formData,
            [name]: target.type === 'checkbox' ? target.checked : value,
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
                name: formData.adminName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                password_confirmation: formData.passwordConfirmation,
                role: 'agence',
                agency_name: formData.agencyName,
                address: formData.address,
                description: formData.description,
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
        <div className="page-inscription-agence">

            <section className="ia-section">
                <div className="container">
                    <h1 className="ia-page-title">Inscription Agence</h1>
                    <p className="ia-subtitle">
                        Inscrivez votre agence pour gérer vos équipes de techniciens et développer votre activité
                    </p>

                    <div className="ia-card">
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
                            <div className="ia-row">
                                <div className="ia-field">
                                    <label className="ia-label">
                                        <FaBuilding className="ia-label-icon" />
                                        Nom de l'agence
                                    </label>
                                    <input type="text" name="agencyName" className="ia-input" placeholder="Nom de votre société"
                                        value={formData.agencyName} onChange={handleChange} required />
                                </div>
                                <div className="ia-field">
                                    <label className="ia-label">
                                        <FaUser className="ia-label-icon" />
                                        Administrateur
                                    </label>
                                    <input type="text" name="adminName" className="ia-input" placeholder="Nom du responsable"
                                        value={formData.adminName} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="ia-row">
                                <div className="ia-field">
                                    <label className="ia-label">
                                        <FaEnvelope className="ia-label-icon" />
                                        Email professionnel
                                    </label>
                                    <input type="email" name="email" className="ia-input" placeholder="contact@agence.com"
                                        value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="ia-field">
                                    <label className="ia-label">
                                        <FaPhone className="ia-label-icon" />
                                        Téléphone
                                    </label>
                                    <input type="tel" name="phone" className="ia-input" placeholder="+237 6XX XXX XXX"
                                        value={formData.phone} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="ia-field">
                                <label className="ia-label">
                                    <FaMapMarkerAlt className="ia-label-icon" />
                                    Adresse du siège
                                </label>
                                <input type="text" name="address" className="ia-input" placeholder="Ville, Quartier, Rue..."
                                    value={formData.address} onChange={handleChange} required />
                            </div>

                            <div className="ia-field">
                                <label className="ia-label">
                                    <FaInfoCircle className="ia-label-icon" />
                                    Description de l'activité
                                </label>
                                <textarea name="description" className="ia-input ia-textarea" placeholder="Décrivez vos services et spécialités..."
                                    value={formData.description} onChange={handleChange} rows={3} />
                            </div>

                            <div className="ia-row">
                                <div className="ia-field">
                                    <label className="ia-label">
                                        <FaLock className="ia-label-icon" />
                                        Mot de passe
                                    </label>
                                    <input type="password" name="password" className="ia-input" placeholder="Minimum 8 caractères"
                                        value={formData.password} onChange={handleChange} required />
                                </div>
                                <div className="ia-field">
                                    <label className="ia-label">
                                        <FaLock className="ia-label-icon" />
                                        Confirmer
                                    </label>
                                    <input type="password" name="passwordConfirmation" className="ia-input" placeholder="Confirmez le mot de passe"
                                        value={formData.passwordConfirmation} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="ia-terms">
                                <label className="ia-checkbox-label">
                                    <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms}
                                        onChange={handleChange} required />
                                    J'accepte les <Link to="/cgu">conditions d'utilisation</Link> et la{' '}
                                    <Link to="/confidentialite">politique de confidentialité</Link>
                                </label>
                            </div>

                            <button type="submit" className="ia-submit-btn" disabled={loading}>
                                {loading ? <><FaSpinner className="spin-icon" /> Création...</> : 'Créer mon compte agence'}
                            </button>
                        </form>
                    </div>

                    <p className="ia-login-text">
                        Vous avez déjà un compte ?{' '}
                        <Link to="/connexion" className="ia-login-link">
                            Connectez-vous
                        </Link>
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default InscriptionAgence;
