import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SlaAuditLog.css';

const SlaAuditLog: React.FC = () => {
    const navigate = useNavigate();

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
                            <div className="tech-score-number">94<span>/100</span></div>
                            <div className="tech-score-badge-wrap">
                                <span className="tech-score-badge">Excellent</span>
                            </div>
                        </div>
                        <div className="tech-sla-score-divider"></div>
                        <div className="tech-sla-score-trend">
                            <div className="tech-trend-val">
                                <span className="material-symbols-outlined">trending_up</span>
                                +2.4%
                            </div>
                            <div className="tech-trend-label">Last 30 Days</div>
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
                        <span className="tech-metric-title">Reliability</span>
                    </div>
                    <div className="tech-metric-value">98.2%</div>
                    <div className="tech-metric-desc">Punctuality Rate</div>
                </div>

                {/* Metric Card 2 */}
                <div className="tech-metric-card">
                    <div className="tech-metric-top">
                        <span className="material-symbols-outlined" style={{color: 'var(--tech-secondary)'}}>speed</span>
                        <span className="tech-metric-title">Efficiency</span>
                    </div>
                    <div className="tech-metric-value">14m 20s</div>
                    <div className="tech-metric-desc">Response Time</div>
                </div>

                {/* Metric Card 3 */}
                <div className="tech-metric-card tech-metric-card-error">
                    <div className="tech-metric-top">
                        <span className="material-symbols-outlined" style={{color: 'var(--tech-error)'}}>cancel</span>
                        <span className="tech-metric-title">Attrition</span>
                    </div>
                    <div className="tech-metric-value">1.4%</div>
                    <div className="tech-metric-desc">Cancellation Rate</div>
                </div>

                {/* Metric Card 4 */}
                <div className="tech-metric-card">
                    <div className="tech-metric-top">
                        <span className="material-symbols-outlined" style={{color: 'var(--tech-tertiary)'}}>task_alt</span>
                        <span className="tech-metric-title">Quality</span>
                    </div>
                    <div className="tech-metric-value">99.1%</div>
                    <div className="tech-metric-desc">Success Rate</div>
                </div>
            </section>

            {/* Main Ledger & Sidebar Grid */}
            <section className="tech-sla-main-grid">
                
                {/* 3. Audit Ledger Table */}
                <div className="tech-sla-ledger">
                    <div className="tech-ledger-header">
                        <h3>Historical Audit Ledger</h3>
                        <div className="tech-ledger-filters">
                            <button className="tech-filter-active">All Events</button>
                            <button className="tech-filter-inactive">Critical Only</button>
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
                                <tr>
                                    <td>
                                        <div className="tech-ledger-date">Oct 24, 2023</div>
                                        <div className="tech-ledger-time">14:22 PM</div>
                                    </td>
                                    <td>
                                        <div className="tech-event-type">
                                            <span className="tech-event-dot bg-tertiary"></span>
                                            <span>Successful Completion</span>
                                        </div>
                                    </td>
                                    <td className="tech-impact-positive">+2 pts</td>
                                    <td className="tech-ledger-ref">#MS-9921</td>
                                </tr>

                                <tr>
                                    <td>
                                        <div className="tech-ledger-date">Oct 23, 2023</div>
                                        <div className="tech-ledger-time">09:15 AM</div>
                                    </td>
                                    <td>
                                        <div className="tech-event-type">
                                            <span className="tech-event-dot bg-error"></span>
                                            <span>Late Arrival</span>
                                        </div>
                                    </td>
                                    <td className="tech-impact-negative">-5 pts</td>
                                    <td className="tech-ledger-ref">#MS-8812</td>
                                </tr>

                                <tr>
                                    <td>
                                        <div className="tech-ledger-date">Oct 21, 2023</div>
                                        <div className="tech-ledger-time">18:40 PM</div>
                                    </td>
                                    <td>
                                        <div className="tech-event-type">
                                            <span className="tech-event-dot bg-secondary"></span>
                                            <span>Mission Refusal</span>
                                        </div>
                                    </td>
                                    <td className="tech-impact-neutral">-1 pts</td>
                                    <td className="tech-ledger-ref">#MS-7761</td>
                                </tr>

                                <tr>
                                    <td>
                                        <div className="tech-ledger-date">Oct 20, 2023</div>
                                        <div className="tech-ledger-time">11:05 AM</div>
                                    </td>
                                    <td>
                                        <div className="tech-event-type">
                                            <span className="tech-event-dot bg-tertiary"></span>
                                            <span>Successful Completion</span>
                                        </div>
                                    </td>
                                    <td className="tech-impact-positive">+2 pts</td>
                                    <td className="tech-ledger-ref">#MS-7650</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="tech-ledger-footer">
                            <button>Load Older Ledger Entries</button>
                        </div>
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
                            <button>Apply Recommendations</button>
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
                            <button>
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
