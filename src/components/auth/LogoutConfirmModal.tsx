import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../common/AuthModal.css'; 
import '../layout/UserAccountMenu.css';

const LogoutConfirmModal: React.FC = () => {
    const { isLogoutConfirmOpen, closeLogoutConfirm, logout, user } = useAuth();
    const navigate = useNavigate();

    if (!isLogoutConfirmOpen) return null;

    const handleConfirmLogout = async () => {
        await logout();
        closeLogoutConfirm();
        navigate('/');
    };

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal-content confirm-logout-content">
                <button className="auth-modal-close" onClick={closeLogoutConfirm}>
                    <FaTimes />
                </button>
                
                <h2 className="auth-modal-title">Se déconnecter ?</h2>
                <p className="auth-modal-subtitle">
                    {user?.name ? `${user.name}, êtes-vous sûr de vouloir vous déconnecter de votre espace privé ?` : `Êtes-vous sûr de vouloir vous déconnecter de votre espace privé ?`}
                </p>

                <div className="auth-modal-actions">
                    <button className="btn-cancel" onClick={closeLogoutConfirm}>
                        Annuler
                    </button>
                    <button className="btn-confirm-logout" onClick={handleConfirmLogout}>
                        Se déconnecter
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmModal;
