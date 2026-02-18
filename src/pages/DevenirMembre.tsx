import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import '../styles/variables.css';
import './DevenirMembre.css';

const DevenirMembre: React.FC = () => {
    return (
        <div className="page-devenir-membre">
            <Header />

            {/* Section Connexion / Inscription */}
            <section className="dm-auth section">
                <div className="container">
                    <div className="dm-auth-grid">
                        {/* Left: Already have an account */}
                        <div className="dm-auth-login">
                            <h2 className="dm-auth-title">J'ai déjà un compte</h2>
                            <Link to="/connexion" className="btn btn-primary dm-login-btn">
                                Connectez-vous maintenant
                            </Link>
                        </div>

                        {/* Right: Register */}
                        <div className="dm-auth-register">
                            <h2 className="dm-auth-title">Je souhaite m'inscrire</h2>
                            <p className="dm-auth-desc">
                                Si vous êtes nouveau, bienvenue ! Vous pouvez créer un compte
                                pour accéder à des avantages tels que le suivi de vos interventions,
                                l'historique de votre compte et bien plus encore.
                            </p>

                            <div className="dm-cards-grid">
                                {/* Technicien Card */}
                                <div className="dm-card dm-card-candidat">
                                    <h3>Je suis technicien</h3>
                                    <p>
                                        Notre plateforme est ouverte toute l'année pour accueillir
                                        les <strong>techniciens, électriciens, plombiers,
                                            installateurs</strong> et <strong>professionnels techniques</strong> dans
                                        leur recherche de missions et de clients.
                                    </p>
                                    <Link to="/inscription/technicien" className="btn dm-card-btn dm-card-btn-white">
                                        je m'enregistre
                                    </Link>
                                </div>

                                {/* Client Card */}
                                <div className="dm-card dm-card-entreprise">
                                    <h3>Je suis un client</h3>
                                    <p>
                                        Découvrez nos ressources pour trouver les meilleurs
                                        techniciens pour vos besoins de dépannage, d'installation
                                        ou de maintenance !
                                    </p>
                                    <p>
                                        <strong>Et si vous avez besoin d'un technicien fiable
                                            et certifié ?</strong>
                                    </p>
                                    <Link to="/inscription/client" className="btn dm-card-btn dm-card-btn-red">
                                        je m'enregistre
                                    </Link>
                                </div>

                                {/* Agence Card */}
                                <div className="dm-card dm-card-agence">
                                    <h3>Je suis une agence</h3>
                                    <p>
                                        Vous gérez une <strong>équipe de techniciens</strong> ?
                                        Inscrivez votre agence et gérez vos techniciens,
                                        suivez les interventions et développez votre activité.
                                    </p>
                                    <Link to="/inscription/agence" className="btn dm-card-btn dm-card-btn-white">
                                        je m'enregistre
                                    </Link>
                                </div>

                                {/* Company Card */}
                                <div className="dm-card dm-card-company">
                                    <h3>Je suis une entreprise</h3>
                                    <p>
                                        Votre entreprise a besoin de <strong>gérer ses interventions
                                            techniques internes</strong> ? Inscrivez-vous pour accéder
                                        à notre réseau de techniciens certifiés.
                                    </p>
                                    <Link to="/inscription/entreprise" className="btn dm-card-btn dm-card-btn-red">
                                        je m'enregistre
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Avantages */}
            <section className="dm-advantages section">
                <div className="container">
                    <div className="dm-advantages-content">
                        <h2 className="dm-advantages-title">Les avantages d'un compte</h2>

                        <ul className="dm-advantages-list">
                            <li>
                                <FaCheckCircle className="dm-check-icon" />
                                <span>
                                    Présélection des techniciens selon le descriptif de vos besoins
                                </span>
                            </li>
                            <li>
                                <FaCheckCircle className="dm-check-icon" />
                                <span>
                                    Vérification préalable des qualifications et certifications des techniciens
                                </span>
                            </li>
                            <li>
                                <FaCheckCircle className="dm-check-icon" />
                                <span>
                                    Accès à la liste de nos techniciens partenaires certifiés
                                </span>
                            </li>
                            <li>
                                <FaCheckCircle className="dm-check-icon" />
                                <span>
                                    Suivi en temps réel de vos interventions et garantie de satisfaction
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default DevenirMembre;
