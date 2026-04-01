import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';
import Footer from '../../components/layout/Footer';
import '../../styles/variables.css';
import './InscriptionClient.css';

const InscriptionClient: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        passwordConfirmation: '',
        acceptTerms: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.passwordConfirmation) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }
        alert('Inscription client en cours...');
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
                        <form onSubmit={handleSubmit}>
                            <div className="ic-field">
                                <label className="ic-label">
                                    <FaUser className="ic-label-icon" />
                                    Nom complet
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    className="ic-input"
                                    placeholder="Entrez votre nom complet"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="ic-field">
                                <label className="ic-label">
                                    <FaEnvelope className="ic-label-icon" />
                                    Adresse email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    className="ic-input"
                                    placeholder="Entrez votre adresse email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="ic-field">
                                <label className="ic-label">
                                    <FaPhone className="ic-label-icon" />
                                    Téléphone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="ic-input"
                                    placeholder="Ex: +237 6XX XXX XXX"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="ic-field">
                                <label className="ic-label">
                                    <FaLock className="ic-label-icon" />
                                    Mot de passe
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    className="ic-input"
                                    placeholder="Minimum 8 caractères"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="ic-field">
                                <label className="ic-label">
                                    <FaLock className="ic-label-icon" />
                                    Confirmer le mot de passe
                                </label>
                                <input
                                    type="password"
                                    name="passwordConfirmation"
                                    className="ic-input"
                                    placeholder="Confirmez votre mot de passe"
                                    value={formData.passwordConfirmation}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="ic-terms">
                                <label className="ic-checkbox-label">
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

                            <button type="submit" className="ic-submit-btn">
                                Créer mon compte
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
