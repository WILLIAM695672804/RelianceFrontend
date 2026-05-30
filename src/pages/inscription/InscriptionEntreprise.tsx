import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaMapMarkerAlt, FaHome, FaInfo } from 'react-icons/fa';
import Footer from '../../components/layout/Footer';
import '../../styles/variables.css';
import './InscriptionEntreprise.css';

const InscriptionEntreprise: React.FC = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
        sector: '',
        password: '',
        passwordConfirmation: '',
        acceptTerms: false,
    });

    const navigate = useNavigate();
    const { register } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const target = e.target as HTMLInputElement;
        setFormData({
            ...formData,
            [name]: target.type === 'checkbox' ? target.checked : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.passwordConfirmation) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }
        if (!formData.acceptTerms) {
            setError('Veuillez accepter les conditions d\'utilisation');
            return;
        }
        setLoading(true);
        try {
            await register({
                name: formData.contactName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                password_confirmation: formData.passwordConfirmation,
                role: 'agence',
                agency_name: formData.companyName,
                address: formData.address,
                description: formData.sector,
            });
            navigate('/agence/dashboard');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Échec de l\'inscription. Vérifiez vos informations.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-inscription-entreprise">

            <section className="ie-section">
                <div className="container">
                    <h1 className="ie-page-title">Inscription Entreprise</h1>
                    <p className="ie-subtitle">
                        Accédez à notre réseau de techniciens certifiés pour la maintenance de vos installations
                    </p>

                    <div className="ie-card">
                        <form onSubmit={handleSubmit}>
                            {/* Row: Company Name + Contact Name */}
                            <div className="ie-row">
                                <div className="ie-field">
                                    <label className="ie-label">
                                        <FaHome className="ie-label-icon" />
                                        Nom de l'entreprise
                                    </label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        className="ie-input"
                                        placeholder="Nom de votre société"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="ie-field">
                                    <label className="ie-label">
                                        <FaUser className="ie-label-icon" />
                                        Nom du contact
                                    </label>
                                    <input
                                        type="text"
                                        name="contactName"
                                        className="ie-input"
                                        placeholder="Votre nom complet"
                                        value={formData.contactName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Row: Email + Phone */}
                            <div className="ie-row">
                                <div className="ie-field">
                                    <label className="ie-label">
                                        <FaEnvelope className="ie-label-icon" />
                                        Email professionnel
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="ie-input"
                                        placeholder="contact@entreprise.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="ie-field">
                                    <label className="ie-label">
                                        <FaPhone className="ie-label-icon" />
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="ie-input"
                                        placeholder="+237 6XX XXX XXX"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Row: Address + Sector */}
                            <div className="ie-row">
                                <div className="ie-field">
                                    <label className="ie-label">
                                        <FaMapMarkerAlt className="ie-label-icon" />
                                        Adresse du siège
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        className="ie-input"
                                        placeholder="Ville, Quartier, Rue..."
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="ie-field">
                                    <label className="ie-label">
                                        <FaInfo className="ie-label-icon" />
                                        Secteur d'activité
                                    </label>
                                    <select
                                        name="sector"
                                        className="ie-input ie-select"
                                        value={formData.sector}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Sélectionnez...</option>
                                        <option value="Hôtellerie">Hôtellerie / Restauration</option>
                                        <option value="Immobilier">Immobilier / Gestion locative</option>
                                        <option value="Commerce">Commerce / Distribution</option>
                                        <option value="Industrie">Industrie / Production</option>
                                        <option value="Bureaux">Bureaux / Tertiaire</option>
                                        <option value="Autre">Autre</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row: Password + Confirmation */}
                            <div className="ie-row">
                                <div className="ie-field">
                                    <label className="ie-label">
                                        <FaLock className="ie-label-icon" />
                                        Mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="ie-input"
                                        placeholder="Minimum 8 caractères"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="ie-field">
                                    <label className="ie-label">
                                        <FaLock className="ie-label-icon" />
                                        Confirmer
                                    </label>
                                    <input
                                        type="password"
                                        name="passwordConfirmation"
                                        className="ie-input"
                                        placeholder="Confirmez le mot de passe"
                                        value={formData.passwordConfirmation}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="ie-terms">
                                <label className="ie-checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="acceptTerms"
                                        checked={formData.acceptTerms}
                                        onChange={handleChange}
                                        required
                                    />
                                    J'accepte les <Link to="/cgu">conditions d'utilisation</Link> et la{' '}
                                    <Link to="/confidentialite">politique de confidentialité</Link>
                                </label>
                            </div>

                            {error && (
                                <p style={{ color: '#dc2626', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>
                            )}
                            <button type="submit" className="ie-submit-btn" disabled={loading}>
                                {loading ? 'Création en cours…' : 'Créer mon compte entreprise'}
                            </button>
                        </form>
                    </div>

                    <p className="ie-login-text">
                        Vous avez déjà un compte ?{' '}
                        <Link to="/connexion" className="ie-login-link">
                            Connectez-vous
                        </Link>
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default InscriptionEntreprise;
