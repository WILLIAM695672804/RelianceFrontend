import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import '../styles/variables.css';
import './InstallationSecurite.css';

const InstallationSecurite: React.FC = () => {
    return (
        <div className="page-installation">
            <Header />

            {/* Hero Section */}
            <section className="is-hero">
                <div className="container is-hero-content">
                    <h1 className="is-hero-title">
                        INSTALLATION & SÉCURITÉ
                    </h1>
                </div>
            </section>

            {/* Section 1 - Image Left, Text Right */}
            <section className="is-intro section">
                <div className="container">
                    <div className="is-intro-grid">
                        <div className="is-intro-image">
                            <img
                                src="https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=450&fit=crop"
                                alt="Installation de systèmes de sécurité"
                            />
                        </div>
                        <div className="is-intro-content">
                            <h2 className="is-section-title">
                                Installation & Sécurité
                            </h2>
                            <p>
                                À l'ère du numérique, la sécurité de votre domicile et de votre
                                entreprise est une priorité. Vous pouvez compter sur notre réseau
                                de techniciens certifiés, spécialistes en installation de systèmes
                                de sécurité, pour un accompagnement complet.
                            </p>
                            <p>
                                Désormais, dormez tranquille. L'installation, la configuration
                                et la maintenance de vos équipements, c'est notre affaire !
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2 - Text Left, Image Right */}
            <section className="is-approach section">
                <div className="container">
                    <div className="is-intro-grid is-intro-reverse">
                        <div className="is-intro-content">
                            <h2 className="is-section-title">
                                Processus simplifié
                            </h2>
                            <p>
                                L'objectif de Reliance est de simplifier le processus complexe
                                d'installation et de mise en service de vos équipements de
                                sécurité. Que ce soit pour votre résidence, votre bureau ou
                                votre site industriel, nos techniciens qualifiés interviennent
                                rapidement et efficacement.
                            </p>
                        </div>
                        <div className="is-intro-image">
                            <img
                                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=450&fit=crop"
                                alt="Technicienne en sécurité"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Services - Grey Background */}
            <section className="is-services section">
                <div className="container">
                    <h2 className="is-services-title">
                        NOTRE OFFRE D'ACCOMPAGNEMENT EN<br />
                        COLLABORATION AVEC NOS TECHNICIENS<br />
                        SPÉCIALISÉS EN SÉCURITÉ
                    </h2>

                    <ul className="is-services-list">
                        <li>
                            <FaCheckCircle className="is-check-icon" />
                            <span>Installation de caméras de vidéosurveillance (CCTV / IP)</span>
                        </li>
                        <li>
                            <FaCheckCircle className="is-check-icon" />
                            <span>Installation de systèmes d'alarme intrusion et incendie</span>
                        </li>
                        <li>
                            <FaCheckCircle className="is-check-icon" />
                            <span>Mise en place de contrôle d'accès (badge, biométrie, digicode)</span>
                        </li>
                        <li>
                            <FaCheckCircle className="is-check-icon" />
                            <span>Installation de systèmes GPS et tracking véhicule</span>
                        </li>
                        <li>
                            <FaCheckCircle className="is-check-icon" />
                            <span>Configuration réseau et câblage structuré</span>
                        </li>
                        <li>
                            <FaCheckCircle className="is-check-icon" />
                            <span>Maintenance préventive et corrective des équipements</span>
                        </li>
                    </ul>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default InstallationSecurite;
