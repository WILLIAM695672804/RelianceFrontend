import React from 'react';
import { FaListUl, FaBullseye, FaHandPaper } from 'react-icons/fa';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import '../styles/variables.css';
import './QuiSommesNous.css';

const QuiSommesNous: React.FC = () => {
    return (
        <div className="page-qui-sommes-nous">
            <Header />

            {/* Section Introduction */}
            <section className="qsn-intro section">
                <div className="container">
                    <div className="qsn-intro-grid">
                        {/* Left: Image Collage */}
                        <div className="qsn-intro-visual">
                            <div className="qsn-deco-circle qsn-circle-blue"></div>
                            <div className="qsn-deco-circle qsn-circle-red"></div>
                            <div className="qsn-main-image">
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=500&fit=crop"
                                    alt="L'équipe Reliance"
                                />
                            </div>
                            <div className="qsn-dots-pattern"></div>
                        </div>

                        {/* Right: Text */}
                        <div className="qsn-intro-content">
                            <h2 className="qsn-title">Qui sommes nous ?</h2>
                            <p>
                                <strong>Reliance</strong> est une plateforme innovante née en Afrique Centrale
                                avec la mission de transformer la manière dont les clients trouvent et engagent
                                des techniciens qualifiés. Notre objectif est de créer un écosystème fiable
                                et transparent qui profite à tous : clients, techniciens et entreprises.
                            </p>
                            <p>
                                Notre association souhaite avant tout développer un réseau de confiance
                                entre nos membres et nos partenaires afin de rendre le processus de recherche
                                de techniciens plus transparent, équitable et simple. Nous désirons ainsi
                                aider à créer une communauté au sein de laquelle tous pourront partager
                                leur expérience, poser des questions et suggérer des pistes de solutions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Mission, Vision, Valeurs */}
            <section className="qsn-values section">
                <div className="container">
                    <div className="qsn-values-grid">
                        <div className="qsn-value-card">
                            <FaListUl className="qsn-value-icon" />
                            <h3>Notre mission</h3>
                            <p>
                                Connecter les clients aux techniciens qualifiés en Afrique Centrale
                                grâce à une plateforme fiable, sécurisée et accessible. Nous facilitons
                                l'accès aux services techniques de qualité pour tous.
                            </p>
                        </div>
                        <div className="qsn-value-card">
                            <FaBullseye className="qsn-value-icon" />
                            <h3>Notre vision</h3>
                            <p>
                                Devenir la référence incontournable en Afrique Centrale pour la mise
                                en relation entre clients et professionnels techniques, en offrant
                                un service complet qui va au-delà du simple dépannage.
                            </p>
                        </div>
                        <div className="qsn-value-card">
                            <FaHandPaper className="qsn-value-icon" />
                            <h3>Nos valeurs</h3>
                            <p>
                                Respect, transparence, qualité et responsabilité. Chaque intervention
                                réalisée via Reliance est guidée par ces principes fondamentaux
                                pour garantir la satisfaction de tous.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default QuiSommesNous;
