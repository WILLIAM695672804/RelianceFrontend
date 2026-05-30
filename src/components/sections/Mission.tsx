import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import './Mission.css';

const Mission: React.FC = () => {
    const navigate = useNavigate();
    return (
        <section id="mission" className="mission section">
            <div className="container">
                <div className="mission-grid">
                    <div className="mission-image">
                        <div className="image-wrapper">
                            <div className="circle circle-red"></div>
                            <div className="circle circle-blue"></div>
                            <div className="image-placeholder">
                                <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=600&fit=crop" alt="Techniciens Reliance" />
                            </div>
                        </div>
                    </div>

                    <div className="mission-content">
                        <h2 className="section-title">Notre Mission</h2>
                        <p className="mission-text">
                            Reliance révolutionne l'accès aux services techniques en Afrique Centrale. Notre plateforme met en relation clients et techniciens vérifiés pour tous vos besoins de dépannage et maintenance, avec un système de paiement sécurisé et un matching intelligent.
                        </p>

                        <ul className="mission-list">
                            <li>
                                <FaCheckCircle className="icon" />
                                <span>Matching automatique intelligent basé sur compétences et proximité</span>
                            </li>
                            <li>
                                <FaCheckCircle className="icon" />
                                <span>Paiement sécurisé avec système Escrow (Mobile Money, OM, Cartes)</span>
                            </li>
                            <li>
                                <FaCheckCircle className="icon" />
                                <span>Techniciens vérifiés avec KYC obligatoire</span>
                            </li>
                            <li>
                                <FaCheckCircle className="icon" />
                                <span>Service rapide et fiable disponible 24/7</span>
                            </li>
                        </ul>

                        <button className="btn btn-primary" onClick={() => navigate('/qui-sommes-nous')}>
                            En savoir plus <FaArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Mission;
