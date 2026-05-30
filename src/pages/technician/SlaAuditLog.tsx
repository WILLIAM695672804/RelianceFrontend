import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTechStats } from '../../services/technicianService';
import { governanceService } from '../../services/governanceService';
import { EmptyState } from '../../components/common/AsyncStates';
import './SlaAuditLog.css';

const SlaAuditLog: React.FC = () => {
    const navigate = useNavigate();
    const { data: stats } = useQuery({ queryKey: ['tech-stats'], queryFn: getTechStats });
    const { data: slaRes } = useQuery({ queryKey: ['my-sla-events'], queryFn: governanceService.getMySlaEvents });
    const allEvents: any[] = slaRes?.data ?? [];
    const [slaFilter, setSlaFilter] = useState<'all' | 'critical'>('all');
    const events = slaFilter === 'critical'
        ? allEvents.filter((ev: any) => Number(ev.payload?.points ?? ev.payload?.penalty ?? 0) < 0)
        : allEvents;
    const rating = Number(stats?.rating ?? 0);
    const score = Math.round((rating / 5) * 100);
    const scoreBadge = score >= 90 ? 'Excellent' : score >= 75 ? 'Bon' : score >= 50 ? 'Moyen' : 'À améliorer';

    return (
        <div className="tech-sla-page">
            {/* 1. Quality Score Header */}
            <section className="tech-sla-header-section">
                <div className="tech-sla-titles">
                    <button 
                        style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.25rem', 
                            padding: 0, 
                            marginBottom: '0.5rem', 
                            color: 'var(--tech-on-surface-variant)', 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                        }}
                        onClick={() => navigate(-1)}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>arrow_back</span>
                        Back to Profile
                    </button>
                    <h2>SLA Compliance Narrative</h2>
                    <p>Your technical performance is monitored in real-time. Maintaining an 'Excellent' rating ensures priority mission allocation and reduced platform fees.</p>
                </div>
                
                <div className="tech-sla-score-wrapper">
                    <div className="tech-sla-score-card">
                        <div className="tech-sla-score-val">
                            <div className="tech-score-number">{score}<span>/100</span></div>
                            <div className="tech-score-badge-wrap">
                                <span className="tech-score-badge">{scoreBadge}</span>
                            </div>
                        </div>
                        <div className="tech-sla-score-divider"></div>
                        <div className="tech-sla-score-trend">
                            <div className="tech-trend-val">
                                <span className="material-symbols-outlined">star</span>
                                {rating.toFixed(1)}/5
                            </div>
                            <div className="tech-trend-label">{stats?.num_reviews ?? 0} avis</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Key Metrics Row */}
            <section className="tech-sla-metrics-grid">
                {/* Metric Card 1 */}
                <div className="tech-metric-card">
                    <div className="tech-metric-top">
                        <span className="material-symbols-outlined" style={{color: 'var(--tech-secondary)'}}>schedule</span>
                        <span className="tech-metric-title">Fiabilité</span>
                    </div>
                    <div className="tech-metric-value">{stats?.completion_rate ?? 0}%</div>
                    <div className="tech-metric-desc">Taux de complétion</div>
                </div>

                {/* Metric Card 2 */}
                <div className="tech-metric-card">
                    <div className="tech-metric-top">
                        <span className="material-symbols-outlined" style={{color: 'var(--tech-secondary)'}}>speed</span>
                        <span className="tech-metric-title">Activité</span>
                    </div>
                    <div className="tech-metric-value">{stats?.missions_total ?? 0}</div>
                    <div className="tech-metric-desc">Missions totales</div>
                </div>

                {/* Metric Card 3 */}
                <div className="tech-metric-card tech-metric-card-error">
                    <div className="tech-metric-top">
                        <span className="material-symbols-outlined" style={{color: 'var(--tech-error)'}}>cancel</span>
                        <span className="tech-metric-title">Événements</span>
                    </div>
                    <div className="tech-metric-value">{events.length}</div>
                    <div className="tech-metric-desc">Événements SLA</div>
                </div>

                {/* Metric Card 4 */}
                <div className="tech-metric-card">
                    <div className="tech-metric-top">
                        <span className="material-symbols-outlined" style={{color: 'var(--tech-tertiary)'}}>task_alt</span>
                        <span className="tech-metric-title">Missions OK</span>
                    </div>
                    <div className="tech-metric-value">{stats?.missions_completed ?? 0}</div>
                    <div className="tech-metric-desc">Missions complétées</div>
                </div>
            </section>

            {/* Main Ledger & Sidebar Grid */}
            <section className="tech-sla-main-grid">
                
                {/* 3. Audit Ledger Table */}
                <div className="tech-sla-ledger">
                    <div className="tech-ledger-header">
                        <h3>Historical Audit Ledger</h3>
                        <div className="tech-ledger-filters">
                            <button className={slaFilter === 'all' ? 'tech-filter-active' : 'tech-filter-inactive'} onClick={() => setSlaFilter('all')}>All Events</button>
                            <button className={slaFilter === 'critical' ? 'tech-filter-active' : 'tech-filter-inactive'} onClick={() => setSlaFilter('critical')}>Critical Only</button>
                        </div>
                    </div>

                    <div className="tech-ledger-table-wrap">
                        <table className="tech-ledger-table">
                            <thead>
                                <tr>
                                    <th>Date / Time</th>
                                    <th>Event Type</th>
                                    <th>Impact</th>
                                    <th>Reference</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.length === 0 ? (
                                    <tr><td colSpan={4}><EmptyState icon="gavel" title="Aucun événement SLA" message="Vos événements de conformité apparaîtront ici." /></td></tr>
                                ) : (
                                    events.map((ev: any) => {
                                        const pts = Number(ev.payload?.points ?? ev.payload?.penalty ?? 0);
                                        const impactCls = pts > 0 ? 'tech-impact-positive' : pts < 0 ? 'tech-impact-negative' : 'tech-impact-neutral';
                                        const dot = pts > 0 ? 'bg-tertiary' : pts < 0 ? 'bg-error' : 'bg-secondary';
                                        const d = new Date(ev.occurred_at);
                                        return (
                                            <tr key={ev.id}>
                                                <td>
                                                    <div className="tech-ledger-date">{d.toLocaleDateString('fr-FR')}</div>
                                                    <div className="tech-ledger-time">{d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                                                </td>
                                                <td>
                                                    <div className="tech-event-type">
                                                        <span className={`tech-event-dot ${dot}`}></span>
                                                        <span style={{ textTransform: 'capitalize' }}>{String(ev.event_key).replace(/_/g, ' ')}</span>
                                                    </div>
                                                </td>
                                                <td className={impactCls}>{pts > 0 ? '+' : ''}{pts} pts</td>
                                                <td className="tech-ledger-ref">#{String(ev.request_id).slice(0, 6)}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 4. SLA Rules & AI recommendations */}
                <div className="tech-sla-sidebar">
                    
                    {/* AI Recommendation */}
                    <div className="tech-ai-card">
                        <div className="tech-ai-bg-icon">
                            <span className="material-symbols-outlined">psychology</span>
                        </div>
                        <div className="tech-ai-content">
                            <div className="tech-ai-header">
                                <span className="material-symbols-outlined">auto_awesome</span>
                                <span>Reliance Insight</span>
                            </div>
                            <p>Your late-night response time is slowing down. Consider updating your schedule exceptions to maintain your 'Excellent' status.</p>
                            <button onClick={() => navigate('/technicien/planning')}>Apply Recommendations</button>
                        </div>
                    </div>

                    {/* SLA Rules Reference */}
                    <div className="tech-rules-card">
                        <h4>Policy Reference</h4>
                        <ul className="tech-rules-list">
                            <li>
                                <div className="tech-rule-dot bg-error"></div>
                                <div className="tech-rule-text">
                                    <span>Late Arrival &gt; 15m</span>
                                    <p>-5 pts and manual review.</p>
                                </div>
                            </li>
                            <li>
                                <div className="tech-rule-dot bg-secondary"></div>
                                <div className="tech-rule-text">
                                    <span>Mission Refusal</span>
                                    <p>-1 pt if within accepted availability.</p>
                                </div>
                            </li>
                            <li>
                                <div className="tech-rule-dot bg-tertiary"></div>
                                <div className="tech-rule-text">
                                    <span>Success Completion</span>
                                    <p>+2 pts for verified resolution.</p>
                                </div>
                            </li>
                            <li>
                                <div className="tech-rule-dot bg-primary"></div>
                                <div className="tech-rule-text">
                                    <span>5-Star Rating</span>
                                    <p>+1 pt bonus for technician excellence.</p>
                                </div>
                            </li>
                        </ul>
                        <div className="tech-rules-footer">
                            <button onClick={() => navigate('/contact')}>
                                Full SLA Documentation
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default SlaAuditLog;
