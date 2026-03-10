import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaClock,
    FaCheckCircle,
    FaRoute,
    FaFileInvoiceDollar,
    FaRobot,
    FaArrowRight,
    FaToolbox,
    FaLock,
    FaExclamationTriangle
} from 'react-icons/fa';
import './MissionDetail.css';

// Props for V4 (Cockpit overlay)
interface MissionDetailProps {
    missionId?: string;
    onClose?: () => void;
}

const MissionDetail: React.FC<MissionDetailProps> = ({ missionId, onClose }) => {
    // If we have a missionId prop, we are in the Cockpit overlay. Otherwise, fallback to URL params.
    const params = useParams();
    const id = missionId || params.id;
    const navigate = useNavigate();

    // V3: Strict B2B Escrow Workflow States
    const [missionStatus, setMissionStatus] = useState<
        'pending' | 
        'accepted' | 
        'arrived' | 
        'diagnostic_billed' | 
        'quote_submitted' | 
        'quote_accepted' | 
        'in_progress'
    >('pending');

    // Mocks for Escrow funds validation
    const [diagEscrowSecured] = useState(true); // Simulate client already locked 5000 XAF
    const [quoteEscrowSecured, setQuoteEscrowSecured] = useState(false); // Simulate client needs to lock 150000 XAF

    const handleAccept = () => setMissionStatus('accepted');
    const handleStartRoute = () => navigate(`/technicien/mission/${id}/route`);
    const handleArrived = () => setMissionStatus('arrived');

    // Phase 1 : Diagnostic
    const handleBillDiagnostic = () => {
        // In reality, this pings the backend. Here we simulate the process.
        setMissionStatus('diagnostic_billed');
    };

    // Phase 2 : Devis
    const handleCreateQuote = () => {
        // Here we simulate the technician submits a quote of 150,000 XAF
        setMissionStatus('quote_submitted');
        
        // Simulate client approving and locking funds in Escrow after 3 seconds
        setTimeout(() => {
            setQuoteEscrowSecured(true);
            setMissionStatus('quote_accepted');
        }, 3000);
    };

    const handleStartWork = () => setMissionStatus('in_progress');
    const handleCompleteWork = () => navigate(`/technicien/mission/${id}/travaux`);

    return (
        <div className="tech-page mission-detail-page" style={{ paddingTop: 0, marginTop: 0 }}>
            {/* Header / Close button for Cockpit */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>
                    Intervention {id ? `#${id}` : '#M-2684'}
                </h2>
                {onClose && (
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}>
                        &times;
                    </button>
                )}
            </div>

            {/* V3: Permanent Escrow Security Banner */}
            <div className={`mission-status-banner ${missionStatus}`} style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    {missionStatus === 'pending' && <><FaClock /> En attente de votre confirmation</>}
                    {missionStatus === 'accepted' && <><FaRoute /> Mission Acceptée - En attente de départ</>}
                    {missionStatus === 'arrived' && <><FaMapMarkerAlt /> Sur place - Phase de diagnostic</>}
                    {missionStatus === 'diagnostic_billed' && <><FaFileInvoiceDollar /> Diagnostic facturé - En attente du devis</>}
                    {missionStatus === 'quote_submitted' && <><FaClock /> Attente de provisionnement Escrow par le client...</>}
                    {missionStatus === 'quote_accepted' && <><FaCheckCircle /> Devis Validé & Fonds Sécurisés</>}
                    {missionStatus === 'in_progress' && <><FaToolbox /> Travaux en cours</>}
                </div>
                
                {/* Dynamically show what funds are locked in Escrow by Reliance */}
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FaLock /> 
                    Garantie Reliance : 
                    {missionStatus === 'pending' || missionStatus === 'accepted' || missionStatus === 'arrived' 
                        ? " 5 000 FCFA (Diagnostic) sécurisés" 
                        : quoteEscrowSecured 
                            ? " 155 000 FCFA (Diagnostic + Travaux) sécurisés"
                            : " 5 000 FCFA (Diagnostic) sécurisés. Paiement Travaux en attente."}
                </div>
            </div>

            {/* Main Info */}
            <div className="mission-card-main">
                <div className="mission-header-info">
                    <h2>Fuite d'eau sous évier</h2>
                    <span className="badge badge-urgent">Urgence Haute</span>
                </div>

                <div className="mission-meta-grid">
                    <div className="meta-item">
                        <FaMapMarkerAlt className="meta-icon" />
                        <div>
                            <strong>Adresse</strong>
                            <p>Rue 5, Bonapriso, Douala</p>
                        </div>
                    </div>
                    <div className="meta-item">
                        <FaCalendarAlt className="meta-icon" />
                        <div>
                            <strong>Date souhaitée</strong>
                            <p>Aujourd'hui, 14:00 - 15:00</p>
                        </div>
                    </div>
                    <div className="meta-item">
                        <FaCheckCircle className="meta-icon" />
                        <div>
                            <strong>Client</strong>
                            <p>Alice Dubois (Nouveau)</p>
                        </div>
                    </div>
                </div>

                <div className="problem-description">
                    <h3>Description du client</h3>
                    <p>"L'eau coule abondamment sous l'évier de la cuisine depuis ce matin. J'ai dû couper l'arrivée générale d'eau."</p>
                    <div className="attached-photos">
                        <div className="photo-thumb">Photos jointes (2)</div>
                    </div>
                </div>

                {missionStatus === 'pending' && (
                    <div className="ml-estimation-box" style={{ marginTop: '20px', background: '#f8fafc', border: '1px solid #cbd5e1' }}>
                        <div className="ml-header" style={{ color: '#0ea5e9' }}><FaRobot /> Analyse IA (Données du marché)</div>
                        <p><strong>Diagnostic estimé : </strong> Rupture de flexible ou joint endommagé.</p>
                        <p><strong>Temps de réparation moyen : </strong> 45 minutes.</p>
                        <div className="suggested-price" style={{ color: '#0ea5e9' }}>Tarif de base estimé : 15 000 FCFA</div>
                    </div>
                )}
            </div>

            {/* Workflow Action Sticker */}
            <div className="action-sticker">
                {missionStatus === 'pending' && (
                    <div className="action-group">
                        <button className="btn-secondary" onClick={onClose || (() => window.history.back())}>Décliner</button>
                        <button className="btn-primary" onClick={handleAccept}>Accepter la Mission</button>
                    </div>
                )}

                {missionStatus === 'accepted' && (
                    <div className="action-group">
                        <button className="btn-primary" onClick={handleStartRoute}>
                            <FaRoute /> Lancer l'itinéraire GPS <FaArrowRight style={{ marginLeft: '8px' }} />
                        </button>
                        <button className="btn-secondary" onClick={handleArrived}>
                            <FaMapMarkerAlt /> Je suis sur place
                        </button>
                    </div>
                )}

                {/* V3 Phase 1: Diagnostic Lock */}
                {missionStatus === 'arrived' && (
                    <div className="action-group vertical">
                        {diagEscrowSecured ? (
                            <div style={{ background: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaCheckCircle /> Les frais de diagnostic (5000 FCFA) sont garantis.
                            </div>
                        ) : (
                            <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaExclamationTriangle /> En attente des fonds de diagnostic du client...
                            </div>
                        )}
                        
                        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>Procédez à l'inspection de l'équipement.</p>
                        <button 
                            className="btn-primary" 
                            onClick={handleBillDiagnostic}
                            disabled={!diagEscrowSecured}
                            style={{ opacity: diagEscrowSecured ? 1 : 0.5 }}
                        >
                            <FaFileInvoiceDollar /> Valider le Diagnostic
                        </button>
                    </div>
                )}

                {/* V3 Phase 2: Quote Submission & Lock */}
                {missionStatus === 'diagnostic_billed' && (
                    <div className="action-group vertical">
                        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>Diagnostic terminé. Soumettez un devis pour les pièces et la main d'œuvre.</p>
                        <button className="btn-primary outline" onClick={handleCreateQuote}>
                            Émettre le Devis de Réparation
                        </button>
                    </div>
                )}

                {missionStatus === 'quote_submitted' && (
                    <div className="action-group vertical">
                        <div style={{ background: '#fef3c7', color: '#92400e', padding: '16px', borderRadius: '8px', fontSize: '0.9rem', textAlign: 'center' }}>
                            <FaClock style={{ fontSize: '1.5rem', marginBottom: '8px' }} />
                            <p style={{ margin: 0, fontWeight: 600 }}>Devis envoyé au client.</p>
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem' }}>Ne commencez pas les travaux. En attente que le client transfère les fonds (150 000 FCFA) vers le compte de séquestre Reliance.</p>
                        </div>
                    </div>
                )}

                {missionStatus === 'quote_accepted' && (
                    <div className="action-group vertical">
                        <div style={{ background: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaCheckCircle style={{ fontSize: '1.2rem' }} /> 
                            <div>
                                <strong>Fonds débloqués !</strong> 150 000 FCFA ont été ajoutés au séquestre pour cette réparation.
                            </div>
                        </div>
                        <button className="btn-primary" onClick={handleStartWork}>
                            Démarrer les travaux
                        </button>
                    </div>
                )}

                {missionStatus === 'in_progress' && (
                    <div className="action-group vertical">
                        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#10b981' }}>Travaux rémunérés en cours de réalisation...</p>
                        <button className="btn-primary" style={{ background: '#10b981' }} onClick={handleCompleteWork}>
                            <FaCheckCircle /> Terminer & Demander Paiement Final
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MissionDetail;
