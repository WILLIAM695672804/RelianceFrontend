import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroCarousel from '../components/common/HeroCarousel';
import '../styles/variables.css';
import './DepannageMaintenance.css';

const depannageSlides = [
    {
        image: '/images/depannage-hero-bg.png', // Assuming image exists or placeholder
        title: <>DÉPANNAGE & MAINTENANCE<br />TECHNIQUE</>,
    },
    {
        image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1600&h=900&fit=crop',
        title: <>INTERVENTION RAPIDE<br />24/7 SUR SITE</>,
        subtitle: "Nos techniciens sont prêts à intervenir pour tous vos besoins urgents."
    },
    {
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1600&h=900&fit=crop',
        title: <>MAINTENANCE PRÉVENTIVE<br />POUR VOTRE TRANQUILLITÉ</>,
        subtitle: "Évitez les pannes coûteuses grâce à nos plans de maintenance réguliers."
    }
];

const DepannageMaintenance: React.FC = () => {
    return (
        <div className="page-depannage">
            <Header />

            {/* Hero Carousel */}
            <HeroCarousel
                slides={depannageSlides}
                ctaLink="/devenir-membre" // Assuming consistent link
                ctaText="Devenir membre"
                className="dm-hero-carousel"
            />

            {/* Section Introduction 1 - Image Left, Text Right */}
            <section className="dm-intro section">
                <div className="container">
                    <div className="dm-intro-grid">
                        <div className="dm-intro-image">
                            <img
                                src="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=450&fit=crop"
                                alt="Technicien en intervention"
                            />
                        </div>
                        <div className="dm-intro-content">
                            <h2 className="dm-section-title">
                                Pour vos besoins urgents<br />Dépannage rapide et fiable
                            </h2>
                            <p>
                                Vous avez une panne électrique, une fuite d'eau ou un problème de
                                climatisation ? Vous ne savez pas vers quel technicien vous tourner ?
                                Reliance est là pour vous. Nous mettons à votre disposition un réseau
                                de techniciens certifiés, disponibles pour intervenir rapidement.
                            </p>
                            <p>
                                Souhaitez-vous profiter de notre réseau de professionnels qualifiés ?
                                Devenez membre Reliance et bénéficiez d'interventions garanties.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Introduction 2 - Text Left, Image Right */}
            <section className="dm-approach section">
                <div className="container">
                    <div className="dm-intro-grid dm-intro-reverse">
                        <div className="dm-intro-content">
                            <h2 className="dm-section-title">
                                Une démarche structurée
                            </h2>
                            <p>
                                Le dépannage et la maintenance recouvrent l'ensemble des actions
                                destinées à résoudre vos problèmes techniques rapidement et
                                efficacement. Loin d'être anodin, trouver le bon technicien est
                                crucial pour la sécurité et le confort de votre domicile ou entreprise.
                            </p>
                            <p>
                                La démarche Reliance est claire, structurée et transparente.
                                Notre objectif est de vous faciliter la tâche en vous connectant
                                directement avec des professionnels vérifiés et compétents.
                            </p>
                        </div>
                        <div className="dm-intro-image">
                            <img
                                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=450&fit=crop"
                                alt="Processus structuré"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Processus - Dark Background */}
            <section className="dm-process section">
                <div className="container">
                    <h2 className="dm-process-title">
                        Comment fonctionne le dépannage<br />via Reliance ?
                    </h2>

                    <div className="dm-process-grid">
                        <div className="dm-process-card">
                            <div className="dm-process-card-image">
                                <img
                                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=150&fit=crop"
                                    alt="Demande d'intervention"
                                />
                            </div>
                            <div className="dm-process-card-content">
                                <h3>1. DEMANDE D'INTERVENTION</h3>
                                <p>
                                    Décrivez votre problème technique via notre plateforme.
                                    Notre système identifie automatiquement les techniciens
                                    qualifiés disponibles dans votre zone géographique et
                                    vous propose les meilleurs profils.
                                </p>
                            </div>
                        </div>

                        <div className="dm-process-card">
                            <div className="dm-process-card-image">
                                <img
                                    src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=200&h=150&fit=crop"
                                    alt="Vérification du technicien"
                                />
                            </div>
                            <div className="dm-process-card-content">
                                <h3>2. VÉRIFICATION & VALIDATION</h3>
                                <p>
                                    Chaque technicien est vérifié : compétences techniques,
                                    références professionnelles, antécédents et certifications.
                                    Nous garantissons la qualité de chaque intervenant pour
                                    votre tranquillité d'esprit.
                                </p>
                            </div>
                        </div>

                        <div className="dm-process-card">
                            <div className="dm-process-card-image">
                                <img
                                    src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200&h=150&fit=crop"
                                    alt="Intervention sur site"
                                />
                            </div>
                            <div className="dm-process-card-content">
                                <h3>3. INTERVENTION SUR SITE</h3>
                                <p>
                                    Le technicien se rend à votre domicile ou sur votre site
                                    professionnel. L'intervention est suivie en temps réel
                                    via la plateforme. Vous êtes informé à chaque étape
                                    du processus de réparation.
                                </p>
                            </div>
                        </div>

                        <div className="dm-process-card">
                            <div className="dm-process-card-image">
                                <img
                                    src="https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=150&fit=crop"
                                    alt="Suivi et garantie"
                                />
                            </div>
                            <div className="dm-process-card-content">
                                <h3>4. SUIVI & GARANTIE</h3>
                                <p>
                                    Après l'intervention, vous évaluez le technicien.
                                    Reliance offre une garantie sur les travaux réalisés
                                    et assure un suivi post-intervention pour s'assurer
                                    de votre entière satisfaction.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default DepannageMaintenance;
