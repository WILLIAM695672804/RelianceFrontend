import React, { useState } from 'react';
import { 
    FaUserCircle, 
    FaTools, 
    FaShieldAlt,
    FaExclamationCircle,
    FaStar,
    FaTrophy
} from 'react-icons/fa';
import './IdentityHub.css';

// Import sub-components for tabs
import Profile from './Profile';
import SkillMatrix from './SkillMatrix';
import KYCStatus from './KYCStatus';
import Reviews from './Reviews';
import Trophies from './Trophies';

const IdentityHub: React.FC = () => {
    // State for tabs
    const [activeTab, setActiveTab] = useState<'profil' | 'competences' | 'kyc' | 'avis' | 'trophees'>('profil');

    // Mock completion score
    const completionScore = 85; 

    return (
        <div className="identity-hub-container">
            {/* Unified Hub Header */}
            <div className="hub-header">
                <div className="hub-user-summary">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="hub-avatar" />
                    <div className="hub-user-info">
                        <h2>Pierre Dupont</h2>
                        <span className="hub-title">Artisan Indépendant (Électricité)</span>
                    </div>
                </div>

                <div className="hub-completion-card">
                    <div className="completion-header">
                        <span>Complétion du Hub d'Identité</span>
                        <strong>{completionScore}%</strong>
                    </div>
                    <div className="completion-bar">
                        <div className="completion-fill" style={{ width: `${completionScore}%` }}></div>
                    </div>
                    <div className="completion-hint">
                        <FaExclamationCircle className="warning-icon" />
                        Il manque votre avis d'imposition (KYC).
                    </div>
                </div>
            </div>

            {/* Hub Navigation Pills */}
            <div className="hub-tabs-container">
                <button 
                    className={`hub-tab ${activeTab === 'profil' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profil')}
                >
                    <FaUserCircle /> Mon CV Public
                </button>
                <button 
                    className={`hub-tab ${activeTab === 'competences' ? 'active' : ''}`}
                    onClick={() => setActiveTab('competences')}
                >
                    <FaTools /> Mes Services & Tarifs
                </button>
                <button 
                    className={`hub-tab ${activeTab === 'kyc' ? 'active' : ''}`}
                    onClick={() => setActiveTab('kyc')}
                >
                    <FaShieldAlt /> Légal (KYC)
                    <FaExclamationCircle className="notification-dot warning" />
                </button>
                <button 
                    className={`hub-tab ${activeTab === 'avis' ? 'active' : ''}`}
                    onClick={() => setActiveTab('avis')}
                >
                    <FaStar /> Avis Clients
                </button>
                <button 
                    className={`hub-tab ${activeTab === 'trophees' ? 'active' : ''}`}
                    onClick={() => setActiveTab('trophees')}
                >
                    <FaTrophy /> Trophées
                </button>
            </div>

            {/* Dynamic Hub Content */}
            <div className="hub-content-area">
                {activeTab === 'profil' && <div className="tab-pane-wrapper"><Profile /></div>}
                {activeTab === 'competences' && <div className="tab-pane-wrapper"><SkillMatrix /></div>}
                {activeTab === 'kyc' && <div className="tab-pane-wrapper"><KYCStatus /></div>}
                {activeTab === 'avis' && <div className="tab-pane-wrapper"><Reviews /></div>}
                {activeTab === 'trophees' && <div className="tab-pane-wrapper"><Trophies /></div>}
            </div>
        </div>
    );
};

export default IdentityHub;
