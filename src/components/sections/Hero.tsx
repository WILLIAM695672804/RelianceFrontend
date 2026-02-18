import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero: React.FC = () => {
    return (
        <section id="accueil" className="hero">
            <div className="hero-overlay"></div>
            <div className="container hero-content">
                <h1 className="hero-title">
                    TROUVEZ LE BON<br />
                    TECHNICIEN EN UN CLIC
                </h1>
                <p className="hero-subtitle">
                    La plateforme a pour mission de connecter<br />
                    les clients aux techniciens qualifiés<br />
                    en Afrique Centrale.
                </p>
                <Link to="/devenir-membre" className="btn btn-primary hero-cta">
                    Devenir membre
                </Link>
            </div>
        </section>
    );
};

export default Hero;
