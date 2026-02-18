import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaBuilding, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import '../../styles/variables.css';
import './InscriptionAgence.css';

const InscriptionAgence: React.FC = () => {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const target = e.target as HTMLInputElement;
        setFormData({
            ...formData,
            [name]: target.type === 'checkbox' ? target.checked : value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.passwordConfirmation) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }
        console.log('Agency Registration Data:', formData);
        alert('Inscription agence en cours...');
    };

    return (
        <div className="page-inscription-agence">
            <Header />

            <section className="ia-section">
                <div className="container">
                    <h1 className="ia-page-title">Inscription Agence</h1>
                    <p className="ia-subtitle">
                        Inscrivez votre agence pour gérer vos équipes de techniciens et développer votre activité
                    </p>

                    <div className="ia-card">
                        <form onSubmit={handleSubmit}>
                            {/* Row: Agency Name + Admin Name */}
                            <div className="ia-row">
                                <div className="ia-field">
                                    <label className="ia-label">
                                        <FaBuilding className="ia-label-icon" />
                                        Nom de l'agence
                                    </label>
                                    <input
                                        type="text"
                                        name="agencyName"
                                        className="ia-input"
                                        placeholder="Nom de votre société"
                                        value={formData.agencyName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="ia-field">
                                    <label className="ia-label">
                                        <FaUser className="ia-label-icon" />
                                        Administrateur
                                    </label>
                                    <input
                                        type="text"
                                        name="adminName"
                                        className="ia-input"
                                        placeholder="Nom du responsable"
                                        value={formData.adminName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Row: Email + Phone */}
                            <div className="ia-row">
                                <div className="ia-field">
                                    <label className="ia-label">
                                        <FaEnvelope className="ia-label-icon" />
                                        Email professionnel
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="ia-input"
                                        placeholder="contact@agence.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="ia-field">
                                    <label className="ia-label">
                                        <FaPhone className="ia-label-icon" />
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="ia-input"
                                        placeholder="+237 6XX XXX XXX"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div className="ia-field">
                                <label className="ia-label">
                                    <FaMapMarkerAlt className="ia-label-icon" />
                                    Adresse du siège
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    className="ia-input"
                                    placeholder="Ville, Quartier, Rue..."
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="ia-field">
                                <label className="ia-label">
                                    <FaInfoCircle className="ia-label-icon" />
                                    Description de l'activité
                                </label>
                                <textarea
                                    name="description"
                                    className="ia-input ia-textarea"
                                    placeholder="Décrivez vos services et spécialités..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                />
                            </div>

                            {/* Row: Password + Confirmation */}
                            <div className="ia-row">
                                <div className="ia-field">
                                    <label className="ia-label">
                                        <FaLock className="ia-label-icon" />
                                        Mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="ia-input"
                                        placeholder="Minimum 8 caractères"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="ia-field">
                                    <label className="ia-label">
                                        <FaLock className="ia-label-icon" />
                                        Confirmer
                                    </label>
                                    <input
                                        type="password"
                                        name="passwordConfirmation"
                                        className="ia-input"
                                        placeholder="Confirmez le mot de passe"
                                        value={formData.passwordConfirmation}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="ia-terms">
                                <label className="ia-checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="acceptTerms"
                                        checked={formData.acceptTerms}
                                        onChange={handleChange}
                                        required
                                    />
                                    J'accepte les <a href="#">conditions d'utilisation</a> et la{' '}
                                    <a href="#">politique de confidentialité</a>
                                </label>
                            </div>

                            <button type="submit" className="ia-submit-btn">
                                Créer mon compte agence
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
