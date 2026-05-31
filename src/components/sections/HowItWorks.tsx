import React from 'react';
import './HowItWorks.css';

const HowItWorks: React.FC = () => {
    const steps = [
        {
            number: 1,
            title: 'Décrivez votre problème',
            description: 'Soumettez votre demande avec photos et localisation GPS',
            color: 'blue'
        },
        {
            number: 2,
            title: 'Recevez 3-5 propositions',
            description: 'Notre algorithme sélectionne les meilleurs techniciens pour vous',
            color: 'red'
        },
        {
            number: 3,
            title: 'Choisissez et payez',
            description: 'Sélectionnez votre technicien et payez en toute sécurité',
            color: 'green'
        }
    ];

    return (
        <section id="fonctionnement" className="how-it-works section">
            <div className="container">
                <h2 className="section-title">Comment Ça Fonctionne</h2>

                <div className="steps-grid">
                    {steps.map((step) => (
                        <div key={step.number} className="flip-card">
                            <div className="flip-card-inner">
                                <div className="flip-card-front">
                                    <div className={`step-number ${step.color}`}>
                                        {step.number}
                                    </div>
                                    <h3 className="step-title">{step.title}</h3>
                                </div>
                                <div className={`flip-card-back ${step.color}`}>
                                    <h3 className="step-title-back">{step.title}</h3>
                                    <p className="step-description">{step.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
