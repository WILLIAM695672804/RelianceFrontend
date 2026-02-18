import React, { useState } from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaListUl, FaBullseye, FaHandPaper } from 'react-icons/fa';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import '../styles/variables.css';
import './Contact.css';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        prefix: 'M.',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Message envoyé avec succès !');
    };

    return (
        <div className="page-contact">
            <Header />

            {/* Section Titre + Info Cards */}
            <section className="ct-info section">
                <div className="container">
                    <h1 className="ct-title">CONTACTEZ-NOUS</h1>

                    <div className="ct-info-grid">
                        <div className="ct-info-card">
                            <FaMapMarkerAlt className="ct-info-icon" />
                            <h3>Nos Adresses</h3>
                            <p>Douala, Cameroun<br />Quartier Bonapriso</p>
                        </div>
                        <div className="ct-info-card">
                            <FaEnvelope className="ct-info-icon" />
                            <h3>Ecrivez nous</h3>
                            <p>contact@reliance-tech.com</p>
                        </div>
                        <div className="ct-info-card">
                            <FaPhoneAlt className="ct-info-icon" />
                            <h3>Appelez nous</h3>
                            <p>+237 6XX XXX XXX<br />+237 2XX XXX XXX</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Map + Formulaire */}
            <section className="ct-form-section section">
                <div className="container">
                    <div className="ct-form-grid">
                        {/* Map */}
                        <div className="ct-map">
                            <iframe
                                title="Reliance Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15919.403393685765!2d9.6924!3d4.0483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1061128be2e1fe43%3A0x8f0a5e5f4b66e1a0!2sDouala!5e0!3m2!1sfr!2scm!4v1600000000000!5m2!1sfr!2scm"
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: '450px' }}
                                allowFullScreen
                                loading="lazy"
                            ></iframe>
                        </div>

                        {/* Form */}
                        <div className="ct-form">
                            <form onSubmit={handleSubmit}>
                                <div className="ct-form-row">
                                    <div className="ct-form-group">
                                        <label>Préfixe</label>
                                        <select name="prefix" value={formData.prefix} onChange={handleChange}>
                                            <option value="M.">M.</option>
                                            <option value="Mme">Mme</option>
                                            <option value="Dr">Dr</option>
                                        </select>
                                    </div>
                                    <div className="ct-form-group">
                                        <label>Prénom</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="Par exemple : Jean"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="ct-form-row">
                                    <div className="ct-form-group">
                                        <label>Nom de famille</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Par exemple : Dupont"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="ct-form-group">
                                        <label>Numéro de téléphone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="+237 6XX XXX XXX"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="ct-form-group ct-form-full">
                                    <label>Adresse de messagerie <span className="ct-required">*</span></label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Par exemple : jean@exemple.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="ct-form-group ct-form-full">
                                    <label>Message</label>
                                    <textarea
                                        name="message"
                                        placeholder="Saisissez votre message..."
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                    ></textarea>
                                </div>

                                <button type="submit" className="btn btn-primary ct-submit-btn">
                                    Envoyer le message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Philosophie */}
            <section className="ct-philosophy section">
                <div className="container">
                    <div className="ct-philosophy-grid">
                        <div className="ct-philosophy-card">
                            <FaListUl className="ct-philosophy-icon" />
                            <h3>Notre mission</h3>
                        </div>
                        <div className="ct-philosophy-card">
                            <FaBullseye className="ct-philosophy-icon" />
                            <h3>Notre vision</h3>
                        </div>
                        <div className="ct-philosophy-card">
                            <FaHandPaper className="ct-philosophy-icon" />
                            <h3>Nos valeurs</h3>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
