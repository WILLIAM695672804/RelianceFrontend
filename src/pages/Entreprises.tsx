import React from 'react';
import { FaArrowRight, FaUsers, FaFileAlt, FaShieldAlt, FaChartLine, FaHandshake, FaClock } from 'react-icons/fa';
import Footer from '../components/layout/Footer';
import HeroCarousel from '../components/common/HeroCarousel';
import '../styles/variables.css';
import './Entreprises.css';

const entrepriseSlides = [
    {
        image: '/images/entreprises-hero-bg.png',
        title: <>POUR LES ENTREPRISES<br />PARTENAIRES</>,
    },
    {
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&h=900&fit=crop',
        title: <>DÉVELOPPEZ VOTRE<br />ACTIVITÉ AVEC NOUS</>,
        subtitle: "Accédez à un réseau qualifié de professionnels et de clients potentiels."
    },
    {
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=900&fit=crop',
        title: <>SOLUTIONS SUR MESURE<br />POUR VOTRE CROISSANCE</>,
        subtitle: "Des outils performants pour gérer vos interventions et vos équipes."
    }
];

const Entreprises: React.FC = () => {
    return (
        <div className="page-entreprises">

            {/* Hero Carousel */}
            <HeroCarousel
                slides={entrepriseSlides}
                ctaLink="/inscription/entreprise"
                ctaText="Devenir membre"
                className="ent-hero-carousel"
            />

            {/* Section Offre */}
            <section className="ent-intro section">
                <div className="container">
                    <div className="ent-intro-grid">
                        <div className="ent-intro-image">
                            <img
                                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop"
                                alt="Équipe professionnelle"
                            />
                        </div>
                        <div className="ent-intro-content">
                            <h2 className="ent-section-title">
                                Avantages incalculables pour les entreprises partenaires de Reliance
                            </h2>
                            <p className="ent-intro-text">
                                En rejoignant Reliance, votre entreprise bénéficie d'un accès privilégié
                                à un réseau de techniciens vérifiés et qualifiés. Notre plateforme simplifie
                                la gestion de vos interventions techniques avec un suivi en temps réel,
                                un système de paiement sécurisé Escrow, et un matching intelligent basé
                                sur les compétences et la proximité géographique.
                            </p>
                            <button className="btn btn-primary">
                                Devenir membre <FaArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Détails Bénéfices */}
            <section className="ent-benefits section">
                <div className="container">
                    <div className="ent-benefits-grid">
                        <div className="ent-benefits-text-left">
                            <h3>Pour les Entreprises</h3>
                            <p>
                                Reliance offre aux entreprises un <strong>certificat de conformité</strong> pour
                                chaque intervention réalisée. Ce certificat atteste de la qualité du travail
                                effectué et garantit que le technicien est vérifié et assure un service fiable.
                            </p>
                            <ul className="ent-check-list">
                                <li>Techniciens certifiés et vérifiés (KYC)</li>
                                <li>Suivi en temps réel via GPS</li>
                                <li>Rapports détaillés de chaque intervention</li>
                            </ul>
                        </div>
                        <div className="ent-benefits-image">
                            <div className="ent-circle-collage">
                                <div className="ent-circle ent-circle-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=300&h=300&fit=crop"
                                        alt="Équipe au travail"
                                    />
                                </div>
                                <div className="ent-circle ent-circle-sm">
                                    <img
                                        src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop"
                                        alt="Technicien"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="ent-benefits-text-right">
                            <h3>Pour vos Clients</h3>
                            <p>
                                Vos clients bénéficient d'un service rapide et transparent. Ils peuvent
                                suivre l'avancement de l'intervention en temps réel et évaluer
                                le technicien à la fin de chaque prestation.
                            </p>
                            <ul className="ent-check-list">
                                <li>Transparence totale sur les tarifs</li>
                                <li>Paiement sécurisé via Mobile Money</li>
                                <li>Notation et avis vérifiés</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Cards avec parallax */}
            <section className="ent-cards-parallax">
                <div className="ent-cards-overlay"></div>
                <div className="container ent-cards-content">
                    <div className="ent-cards-grid">
                        <div className="ent-info-card">
                            <FaUsers className="ent-card-icon" />
                            <h4>Réseau de Techniciens</h4>
                            <p>Accédez à +500 techniciens qualifiés dans toute l'Afrique Centrale</p>
                        </div>
                        <div className="ent-info-card">
                            <FaFileAlt className="ent-card-icon" />
                            <h4>Gestion Simplifiée</h4>
                            <p>Tableau de bord complet pour gérer toutes vos interventions</p>
                        </div>
                        <div className="ent-info-card">
                            <FaShieldAlt className="ent-card-icon" />
                            <h4>Garantie Qualité</h4>
                            <p>Certificat de conformité et garantie sur chaque intervention</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Validation */}
            <section className="ent-validation section">
                <div className="container">
                    <div className="ent-validation-grid">
                        <div className="ent-validation-image">
                            <div className="ent-circle-collage">
                                <div className="ent-circle ent-circle-lg">
                                    <img
                                        src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&h=300&fit=crop"
                                        alt="Validation"
                                    />
                                </div>
                                <div className="ent-circle ent-circle-sm ent-circle-offset">
                                    <img
                                        src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=200&h=200&fit=crop"
                                        alt="Professionnel"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="ent-validation-content">
                            <h2 className="ent-section-title">
                                Confirmation de la qualité de chaque intervention
                            </h2>
                            <p>
                                Chaque intervention réalisée par un technicien Reliance est validée par un
                                système de contrôle qualité. Le client et l'entreprise reçoivent un rapport
                                détaillé avec photos avant/après et évaluation du travail.
                            </p>
                            <div className="ent-validation-features">
                                <div className="ent-feature">
                                    <FaChartLine className="ent-feature-icon" />
                                    <div>
                                        <h4>Rapports Détaillés</h4>
                                        <p>Photos avant/après, temps d'intervention, matériaux utilisés</p>
                                    </div>
                                </div>
                                <div className="ent-feature">
                                    <FaHandshake className="ent-feature-icon" />
                                    <div>
                                        <h4>Satisfaction Garantie</h4>
                                        <p>Système Escrow : paiement libéré uniquement après validation</p>
                                    </div>
                                </div>
                                <div className="ent-feature">
                                    <FaClock className="ent-feature-icon" />
                                    <div>
                                        <h4>Réactivité</h4>
                                        <p>Intervention sous 2h en zone urbaine, 24h en zone rurale</p>
                                    </div>
                                </div>
                            </div>
                            <button className="btn btn-primary">
                                Devenir membre <FaArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Entreprises;
