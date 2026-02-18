import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import '../styles/variables.css';
import './Equipe.css';

const Equipe: React.FC = () => {
    return (
        <div className="page-equipe">
            <Header />

            {/* Section Titre */}
            <section className="eq-hero section">
                <div className="container">
                    <h1 className="eq-title">Equipe</h1>
                    <p className="eq-subtitle">
                        Une équipe engagée pour fournir des services techniques de qualité.
                    </p>
                </div>
            </section>

            {/* Section Galerie Photos */}
            <section className="eq-gallery">
                <div className="container">
                    <div className="eq-gallery-grid">
                        <div className="eq-gallery-item">
                            <img
                                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
                                alt="Équipe Reliance en réunion"
                            />
                        </div>
                        <div className="eq-gallery-item">
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                                alt="Équipe Reliance au travail"
                            />
                        </div>
                        <div className="eq-gallery-item">
                            <img
                                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop"
                                alt="Équipe Reliance ensemble"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Equipe;
