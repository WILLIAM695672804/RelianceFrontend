import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import Footer from '../components/layout/Footer';
import HeroCarousel from '../components/common/HeroCarousel';
import '../styles/variables.css';
import './InstallationSecurite.css';

const securiteSlides = [
    {
        image: '/images/security-hero-bg.png', // Assuming image exists or placeholder
        title: <>INSTALLATION & SÉCURITÉ<br />PROFESSIONNELLE</>,
    },
    {
        image: 'https://images.unsplash.com/photo-1558002038-1091a1661113?w=1600&h=900&fit=crop',
        title: <>SYSTÈMES DE SURVEILLANCE<br />DERNIÈRE GÉNÉRATION</>,
        subtitle: "Protégez vos biens et vos proches avec nos solutions connectées."
    },
    {
        image: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=1600&h=900&fit=crop',
        title: <>EXPERTISE EN SÉCURITÉ<br />INCENDIE ET ACCÈS</>,
        subtitle: "Audit, installation et maintenance de vos équipements de sécurité."
    }
];

const InstallationSecurite: React.FC = () => {
    return (
        <div className="page-installation">

            {/* Hero Carousel */}
            <HeroCarousel
                slides={securiteSlides}
                ctaLink="/devenir-membre" // Assuming consistent link
                ctaText="Devenir membre"
                className="is-hero-carousel"
            />

            {/* Section Introduction 1 - Image Left, Text Right */}
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
