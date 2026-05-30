import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CTA.css';

const CTA: React.FC = () => {
    const navigate = useNavigate();
    return (
        <section id="cta" className="cta section">
            <div className="container cta-content">
                <h2 className="cta-title">Prêt à Commencer ?</h2>
                <p className="cta-subtitle">
                    Rejoignez des milliers d'utilisateurs satisfaits
                </p>
                <div className="cta-buttons">
                    <button className="btn btn-primary" onClick={() => navigate('/inscription/client')}>
                        Trouver un technicien
                    </button>
                    <button className="btn btn-outline-dark" onClick={() => navigate('/inscription/technicien')}>
                        Devenir technicien
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CTA;
