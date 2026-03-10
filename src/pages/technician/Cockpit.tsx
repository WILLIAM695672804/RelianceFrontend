import React, { useState } from 'react';
import { 
    FaPowerOff, 
    FaMapMarkedAlt, 
    FaCalendarAlt, 
    FaMapPin,
    FaShieldAlt
} from 'react-icons/fa';
import './CockpitSlideover.css';
import './Cockpit.css';

// Import the existing pages to be rendered as tabs
import LiveRadar from './LiveRadar';
import Planning from './Planning';
import ZoneIntervention from './ZoneIntervention';
import MissionDetail from './MissionDetail';

const Cockpit: React.FC = () => {
    // State for the active tab (Radar by default)
    const [activeTab, setActiveTab] = useState<'radar' | 'planning' | 'zone'>('radar');
    
    // State for Technician Availability (Online/Offline)
    const [isOnline, setIsOnline] = useState(false);

    // V4: State for the Mission Slide-over Panel
    const [activeMissionId, setActiveMissionId] = useState<string | null>(null);

    const handleToggleOnline = () => {
        setIsOnline(!isOnline);
    };

    const handleAcceptMission = (id: string) => {
        setActiveMissionId(id);
    };

    const handleCloseMission = () => {
        setActiveMissionId(null);
    };

    return (
        <div className="tech-cockpit-container">
            {/* Super-Header for the Cockpit */}
            <div className="cockpit-header">
                <div className="cockpit-status-controls">
                    <button 
                        className={`btn-toggle-status ${isOnline ? 'online' : 'offline'}`}
                        onClick={handleToggleOnline}
                    >
                        <FaPowerOff /> 
                        {isOnline ? 'En Ligne (Prêt pour intervention)' : 'Hors Ligne'}
                    </button>
                    
                    {isOnline && (
                        <div className="escrow-guardian-shield">
                            <FaShieldAlt style={{color: '#10b981'}} />
                            <span>Garantie Reliance Active</span>
                        </div>
                    )}
                </div>

                {/* Internal Tab Navigation (Pills) */}
                <div className="cockpit-tabs">
                    <button 
                        className={`cockpit-tab ${activeTab === 'radar' ? 'active' : ''}`}
                        onClick={() => setActiveTab('radar')}
                    >
                        <FaMapMarkedAlt /> Le Radar Live
                    </button>
                    <button 
                        className={`cockpit-tab ${activeTab === 'planning' ? 'active' : ''}`}
                        onClick={() => setActiveTab('planning')}
                    >
                        <FaCalendarAlt /> Mon Planning
                    </button>
                    <button 
                        className={`cockpit-tab ${activeTab === 'zone' ? 'active' : ''}`}
                        onClick={() => setActiveTab('zone')}
                    >
                        <FaMapPin /> Ma Zone d'Action
                    </button>
                </div>
            </div>

            {/* Dynamic Content Area */}
            <div className="cockpit-content-area">
                {!isOnline && activeTab === 'radar' ? (
                    <div className="offline-overlay">
                        <h2>Vous êtes actuellement Hors Ligne</h2>
                        <p>Passez en ligne pour commencer à recevoir des missions sécurisées sur votre radar.</p>
                        <button className="btn-primary" onClick={handleToggleOnline}>
                            Me connecter au réseau
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Render the appropriate component based on the active tab */}
                        {activeTab === 'radar' && <div className="tab-pane-wrapper radar-wrapper"><LiveRadar onAcceptMission={handleAcceptMission} /></div>}
                        {activeTab === 'planning' && <div className="tab-pane-wrapper"><Planning /></div>}
                        {activeTab === 'zone' && <div className="tab-pane-wrapper"><ZoneIntervention /></div>}
                    </>
                )}
            </div>

            {/* V4: Mission Slide-over Panel */}
            {activeMissionId && (
                <div className="mission-slideover-overlay" onClick={handleCloseMission}>
                    <div className="mission-slideover-panel" onClick={(e) => e.stopPropagation()}>
                        <MissionDetail missionId={activeMissionId} onClose={handleCloseMission} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cockpit;
