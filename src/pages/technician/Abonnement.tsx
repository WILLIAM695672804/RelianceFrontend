import React, { useState } from 'react';
import {
    FaCheck,
    FaCreditCard,
    FaMobileAlt,
    FaPlus,
    FaDownload,
    FaFileInvoiceDollar
} from 'react-icons/fa';
import './Abonnement.css';

const Abonnement: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

    const invoices = [
        { id: 'INV-2026-003', date: '01 Fév 2026', amount: '15.000 FCFA', status: 'PAID' },
        { id: 'INV-2026-002', date: '01 Jan 2026', amount: '15.000 FCFA', status: 'PAID' },
        { id: 'INV-2025-012', date: '01 Déc 2025', amount: '15.000 FCFA', status: 'PAID' },
    ];

    return (
        <div className="tech-page sub-page">
            <h1 className="page-title">Abonnement & Facturation</h1>

            {/* Status Banner */}
            <div className="sub-status-banner">
                <div className="status-info">
                    <h2>Abonnement Actif</h2>
                    <p>Plan Pro Mensuel • Renouvellement automatique</p>
                </div>
                <div className="countdown-box">
                    <span className="days-left">12</span>
                    <span className="days-label">Jours restants</span>
                </div>
            </div>

            {/* Plans */}
            <div className="plan-section">
                <h3 className="section-heading">Changer de formule</h3>
                <div className="plans-grid">
                    {/* Monthly Plan */}
                    <div
                        className={`plan-card ${selectedPlan === 'monthly' ? 'active' : ''}`}
                        onClick={() => setSelectedPlan('monthly')}
                    >
                        <div className="plan-name">Mensuel</div>
                        <div className="plan-price">
                            15.000 <span>fcfa /mois</span>
                        </div>
                        <ul className="plan-features">
                            <li><FaCheck className="check-icon" /> Accès illimité aux missions</li>
                            <li><FaCheck className="check-icon" /> Commission réduite (10%)</li>
                            <li><FaCheck className="check-icon" /> Support prioritaire</li>
                            <li><FaCheck className="check-icon" /> Badge "Vérifié"</li>
                        </ul>
                        <button className="select-plan-btn">
                            {selectedPlan === 'monthly' ? 'Plan Actuel' : 'Choisir ce plan'}
                        </button>
                    </div>

                    {/* Yearly Plan */}
                    <div
                        className={`plan-card ${selectedPlan === 'yearly' ? 'active' : ''}`}
                        onClick={() => setSelectedPlan('yearly')}
                    >
                        <span className="popular-badge">Économisez 17%</span>
                        <div className="plan-name">Annuel</div>
                        <div className="plan-price">
                            150.000 <span>fcfa /an</span>
                        </div>
                        <p style={{ color: '#22c55e', fontSize: '0.9rem', marginBottom: '15px' }}>
                            Soit 2 mois offerts !
                        </p>
                        <ul className="plan-features">
                            <li><FaCheck className="check-icon" /> Accès illimité aux missions</li>
                            <li><FaCheck className="check-icon" /> Commission réduite (8%)</li>
                            <li><FaCheck className="check-icon" /> Support prioritaire VIP</li>
                            <li><FaCheck className="check-icon" /> Badge "Expert Gold"</li>
                        </ul>
                        <button className="select-plan-btn">
                            {selectedPlan === 'yearly' ? 'Plan Actuel' : 'Passer à l\'annuel'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Billing Handling */}
            <div className="billing-grid">
                {/* Payment Methods */}
                <div className="bg-white-card">
                    <h3 className="section-heading" style={{ fontSize: '1.1rem', marginBottom: '15px' }}>
                        Moyens de paiement
                    </h3>

                    <div className="method-item">
                        <div className="method-info">
                            <FaCreditCard className="method-icon" />
                            <div className="method-details">
                                <h4>Visa **** 4242</h4>
                                <p>Expire 12/28 <span className="default-badge">Défaut</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="method-item">
                        <div className="method-info">
                            <FaMobileAlt className="method-icon" style={{ color: '#f97316' }} />
                            <div className="method-details">
                                <h4>Orange Money</h4>
                                <p>690 *** *89</p>
                            </div>
                        </div>
                    </div>

                    <button className="add-method-btn">
                        <FaPlus /> Ajouter une méthode
                    </button>
                </div>

                {/* Invoices */}
                <div className="bg-white-card">
                    <h3 className="section-heading" style={{ fontSize: '1.1rem', marginBottom: '15px' }}>
                        Historique des factures
                    </h3>
                    <table className="invoices-table">
                        <thead>
                            <tr>
                                <th>Référence</th>
                                <th>Date</th>
                                <th>Montant</th>
                                <th>Statut</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map(inv => (
                                <tr key={inv.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <FaFileInvoiceDollar style={{ color: '#94a3b8' }} />
                                            {inv.id}
                                        </div>
                                    </td>
                                    <td>{inv.date}</td>
                                    <td><strong>{inv.amount}</strong></td>
                                    <td><span className="status-pill paid">Payé</span></td>
                                    <td>
                                        <button className="download-btn" title="Télécharger PDF">
                                            <FaDownload />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Abonnement;
