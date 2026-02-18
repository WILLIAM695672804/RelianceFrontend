import React from 'react';
import { FaShieldAlt, FaLock, FaBrain, FaHeadset } from 'react-icons/fa';
import './Advantages.css';

const Advantages: React.FC = () => {
    const advantages = [
        {
            icon: <FaShieldAlt />,
            title: 'Techniciens Vérifiés',
            description: 'KYC obligatoire pour tous les professionnels'
        },
        {
            icon: <FaLock />,
            title: 'Paiement Sécurisé',
            description: 'Système Escrow pour protéger vos transactions'
        },
        {
            icon: <FaBrain />,
            title: 'Matching Intelligent',
            description: 'Algorithme basé sur compétences, distance et notes'
        },
        {
            icon: <FaHeadset />,
            title: 'Support 24/7',
            description: 'Assistance disponible à tout moment'
        }
    ];

    return (
        <section id="avantages" className="advantages section">
            <div className="container">
                <h2 className="section-title">Pourquoi Choisir Reliance ?</h2>

                <div className="advantages-grid">
                    {advantages.map((advantage, index) => (
                        <div key={index} className="advantage-card card">
                            <div className="advantage-icon">
                                {advantage.icon}
                            </div>
                            <h3 className="advantage-title">{advantage.title}</h3>
                            <p className="advantage-description">{advantage.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Advantages;
