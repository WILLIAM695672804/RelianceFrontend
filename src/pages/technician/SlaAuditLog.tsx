import React, { useState } from 'react';
import { 
    FaClipboardList, 
    FaCheckCircle, 
    FaCalendarTimes, 
    FaBalanceScale,
    FaInfoCircle,
    FaArrowDown,
    FaArrowUp
} from 'react-icons/fa';
import './Reviews.css'; // Reuse some table/list styles from reviews or wallet

interface AuditEvent {
    id: string;
    date: string;
    type: 'sla_breach' | 'sla_bonus' | 'financial_penalty' | 'admin_warning';
    missionId?: string;
    description: string;
    reputationImpact: number;
    financialImpact?: number;
    status: 'applied' | 'appealed' | 'reversed';
}

const SlaAuditLog: React.FC = () => {
    // V3: SLA Audit Mock Data
    const [events] = useState<AuditEvent[]>([
        {
            id: 'AUD-004',
            date: '10 Mars 2026',
            type: 'sla_breach',
            missionId: 'M-2680',
            description: 'Retard sur site > 30 minutes sans notification au client via le chat.',
            reputationImpact: -10,
            status: 'applied'
        },
        {
            id: 'AUD-003',
            date: '05 Mars 2026',
            type: 'financial_penalty',
            missionId: 'M-2655',
            description: 'Annulation abusive de la mission par le technicien moins de 2h avant l\'intervention.',
            reputationImpact: -20,
            financialImpact: -5000,
            status: 'applied'
        },
        {
            id: 'AUD-002',
            date: '28 Fév 2026',
            type: 'sla_bonus',
            description: 'Bonus de performance : 10 missions consécutives sans retard et notées > 4 étoiles.',
            reputationImpact: +50,
            status: 'applied'
        },
        {
            id: 'AUD-001',
            date: '15 Fév 2026',
            type: 'admin_warning',
            description: 'Avertissement : Pièce d\'identité arrivée à expiration. Veuillez mettre à jour votre profil KYC.',
            reputationImpact: 0,
            status: 'applied'
        }
    ]);

    const getEventIcon = (type: string) => {
        switch (type) {
            case 'sla_breach': return <FaCalendarTimes style={{ color: '#f59e0b' }} />;
            case 'financial_penalty': return <FaBalanceScale style={{ color: '#ef4444' }} />;
            case 'sla_bonus': return <FaCheckCircle style={{ color: '#10b981' }} />;
            case 'admin_warning': return <FaInfoCircle style={{ color: '#3b82f6' }} />;
            default: return <FaClipboardList />;
        }
    };

    return (
        <div className="tech-page sla-audit-page">
            <h1 className="page-title">Logs d'Audit & SLA</h1>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
                Journal officiel de vos performances, de vos infractions aux règles métiers (SLA), et de leurs impacts sur votre réputation et vos finances.
            </p>

            {/* SLA Dashboard Stats */}
            <div className="reputation-dashboard" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '32px' }}>
                <div className="rep-score-card" style={{ background: 'linear-gradient(135deg, #10b981, #059669)'}}>
                    <h2 style={{ fontSize: '1rem', opacity: 0.9 }}>Taux de Ponctualité</h2>
                    <div className="rep-score-value" style={{ fontSize: '2rem' }}>92%</div>
                    <p style={{ marginTop: '8px', fontSize: '0.85rem' }}>Objectif Reliance : &gt; 90%</p>
                </div>
                
                <div className="rep-score-card" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)'}}>
                    <h2 style={{ fontSize: '1rem', opacity: 0.9 }}>Taux d'Annulation</h2>
                    <div className="rep-score-value" style={{ fontSize: '2rem' }}>2%</div>
                    <p style={{ marginTop: '8px', fontSize: '0.85rem' }}>Objectif Reliance : &lt; 5%</p>
                </div>

                <div className="rep-score-card" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
                    <h2 style={{ fontSize: '1rem', opacity: 0.9 }}>Pénalités (30j)</h2>
                    <div className="rep-score-value" style={{ fontSize: '2rem' }}>1</div>
                    <p style={{ marginTop: '8px', fontSize: '0.85rem' }}>Attention au maintien de votre compte</p>
                </div>
            </div>

            {/* Audit List */}
            <div className="transactions-section">
                <div className="section-header">
                    <h2><FaClipboardList /> Registre des Événements</h2>
                </div>

                <div className="transactions-list">
                    {events.map((event) => (
                        <div key={event.id} className="transaction-card" style={{ borderLeft: event.reputationImpact < 0 ? '4px solid #ef4444' : event.reputationImpact > 0 ? '4px solid #10b981' : '4px solid #3b82f6' }}>
                            <div className="tx-icon" style={{ background: '#f8fafc' }}>
                                {getEventIcon(event.type)}
                            </div>

                            <div className="tx-info" style={{ flex: 2 }}>
                                <h3>{event.type === 'sla_breach' ? 'Infraction SLA' : event.type === 'financial_penalty' ? 'Pénalité Financière' : event.type === 'sla_bonus' ? 'Bonus SLA' : 'Avertissement Système'} {event.missionId && `(Mission #${event.missionId})`}</h3>
                                <p className="tx-date">{event.date} • {event.id}</p>
                                <p style={{ fontSize: '0.9rem', color: '#334155', marginTop: '8px', lineHeight: '1.4' }}>
                                    {event.description}
                                </p>
                            </div>

                            <div className="tx-amount-col" style={{ flex: 1, alignItems: 'flex-end' }}>
                                {event.reputationImpact !== 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', color: event.reputationImpact > 0 ? '#10b981' : '#ef4444', marginBottom: '8px' }}>
                                        {event.reputationImpact > 0 ? <FaArrowUp /> : <FaArrowDown />} 
                                        {Math.abs(event.reputationImpact)} Pts Réputation
                                    </div>
                                )}
                                
                                {event.financialImpact && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold', color: '#ef4444', fontSize: '0.9rem' }}>
                                        <FaArrowDown /> {Math.abs(event.financialImpact)} FCFA
                                    </div>
                                )}

                                {event.status === 'appealed' && (
                                    <span style={{ marginTop: '8px', fontSize: '0.75rem', background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '12px' }}>Appel en cours</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SlaAuditLog;
