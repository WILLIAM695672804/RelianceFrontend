import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaTimes, FaGoogle, FaEnvelope, FaUserTie } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AuthModal.css';

const AuthModal: React.FC = () => {
    const { isAuthModalOpen, closeAuthModal, loginAsClient, loginAsTechnician } = useAuth();
    const navigate = useNavigate();

    if (!isAuthModalOpen) return null;

    const handleLoginClient = () => {
        loginAsClient();
        navigate('/client/dashboard'); // Redirection ou maintien sur place
    };

    const handleLoginTech = () => {
        loginAsTechnician();
        navigate('/technicien/dashboard');
    };

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal-content">
                <button className="auth-modal-close" onClick={closeAuthModal}>
                    <FaTimes />
                </button>
                
                <h2 className="auth-modal-title">Rejoignez la communauté</h2>
                <p className="auth-modal-subtitle">Connectez-vous pour interagir avec les artisans, aimer leurs réalisations et demander des interventions.</p>

                <div className="auth-modal-actions">
                    <button className="btn-auth-social google">
                        <FaGoogle /> Continuer avec Google
                    </button>
                    <button className="btn-auth-social email" onClick={handleLoginClient}>
                        <FaEnvelope /> Continuer avec Email (Client)
                    </button>

                    <div className="auth-divider">
                        <span>ou</span>
                    </div>

                    <button className="btn-auth-pro" onClick={handleLoginTech}>
                        <FaUserTie /> Je suis un Professionnel
                    </button>
                </div>

                <p className="auth-modal-footer">
                    En continuant, vous acceptez nos <strong>Conditions d'Utilisation</strong> et notre <strong>Politique de Confidentialité</strong>.
                </p>
            </div>
        </div>
    );
};

export default AuthModal;
