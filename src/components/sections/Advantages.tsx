import React from 'react';
import { FaShieldAlt, FaLock, FaBrain, FaHeadset } from 'react-icons/fa';
import './Advantages.css';

const Advantages: React.FC = () => {
    const advantages = [
        {
            icon: <FaShieldAlt />,
            title: 'Techniciens Vérifiés',
            description: 'KYC obligatoire pour tous les professionnels de la plateforme.'
        },
        {
            icon: <FaLock />,
            title: 'Paiement Sécurisé',
            description: 'Système Escrow qui protège chacune de vos transactions.'
        },
        {
            icon: <FaBrain />,
            title: 'Matching Intelligent',
            description: 'Algorithme basé sur les compétences, la distance et les notes.'
        },
        {
            icon: <FaHeadset />,
            title: 'Support 24/7',
            description: 'Une assistance disponible à tout moment, où que vous soyez.'
        }
    ];

    return (
        <section id="avantages" className="advantages section">
            <div className="container">
                <h2 className="section-title">Pourquoi Choisir Reliance ?</h2>

                <div className="advantages-grid">
                    {advantages.map((advantage, index) => (
                        <div key={index} className="flip-card">
                            <div className="flip-card-inner">
                                <div className="flip-card-front">
                                    <div className="advantage-icon">{advantage.icon}</div>
                                    <h3 className="advantage-title">{advantage.title}</h3>
                                </div>
                                <div className="flip-card-back">
                                    <h3 className="advantage-title-back">{advantage.title}</h3>
                                    <p className="advantage-description">{advantage.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Advantages;
