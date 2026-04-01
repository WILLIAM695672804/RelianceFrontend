import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import Footer from '../components/layout/Footer';
import '../styles/variables.css';
import './Connexion.css';

const Connexion: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
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
        alert('Connexion en cours...');
    };

    return (
        <div className="page-connexion">

            <section className="cx-section">
                <div className="container">
                    <h1 className="cx-page-title">Connectez-vous</h1>

                    <div className="cx-card">
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

                            <button type="submit" className="cx-submit-btn">
                                Connexion
                            </button>

                            <div className="cx-forgot">
                                <a href="#" className="cx-forgot-link">
                                    Mot de passe oublié ?
                                </a>
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
