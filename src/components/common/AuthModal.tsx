import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaTimes, FaEnvelope, FaUserTie } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './AuthModal.css';

const AuthModal: React.FC = () => {
    const { isAuthModalOpen, closeAuthModal } = useAuth();
    const navigate = useNavigate();

    if (!isAuthModalOpen) return null;

    const handleLoginClient = () => {
        closeAuthModal();
        navigate('/connexion');
    };

    const handleLoginTech = () => {
        closeAuthModal();
        navigate('/connexion');
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
                    <button className="btn-auth-social email" onClick={handleLoginClient}>
                        <FaEnvelope /> Se connecter / S'inscrire
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
