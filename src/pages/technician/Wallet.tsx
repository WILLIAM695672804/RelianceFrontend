import React, { useState } from 'react';
import {
    FaWallet,
    FaArrowUp,
    FaArrowDown,
    FaMoneyBillWave,
    FaUniversity,
    FaCalendarAlt,
    FaExchangeAlt
} from 'react-icons/fa';
import './Wallet.css';

const Wallet: React.FC = () => {
    // Mock Data
    const transactions = [
        { id: 1, type: 'INCOME', title: 'Mission #M-2684 (Sophie M.)', date: 'Aujourd\'hui, 16:30', amount: '+ 13.500 FCFA' },
        { id: 2, type: 'INCOME', title: 'Mission #M-2680 (Bureau Central)', date: 'Hier, 14:15', amount: '+ 22.500 FCFA' },
        { id: 3, type: 'WITHDRAWAL', title: 'Retrait vers Orange Money', date: '15 Fév 2026', amount: '- 50.000 FCFA' },
        { id: 4, type: 'INCOME', title: 'Mission #M-2675 (Jean P.)', date: '14 Fév 2026', amount: '+ 18.000 FCFA' },
    ];

    const weeklyEarnings = [
        { day: 'Lun', amount: 15000 },
        { day: 'Mar', amount: 22500 },
        { day: 'Mer', amount: 13500 }, // Today
        { day: 'Jeu', amount: 0 },
        { day: 'Ven', amount: 0 },
        { day: 'Sam', amount: 0 },
        { day: 'Dim', amount: 0 },
    ];

    const maxEarning = Math.max(...weeklyEarnings.map(e => e.amount), 30000);

    return (
        <div className="tech-page wallet-page">
            <h1 className="page-title">Mes Finances</h1>

            {/* Balance Cards */}
            <div className="balance-section">
                {/* Main Wallet Card */}
                <div className="balance-card main">
                    <div className="balance-title">Solde Disponible</div>
                    <div className="balance-amount">36.000 FCFA</div>
                    <div className="balance-trend positive">
                        <FaArrowUp /> +36% cette semaine
                    </div>
                    <button className="withdraw-btn">
                        <FaMoneyBillWave /> Demander un retrait
                    </button>
                    {/* Background Icon Decoration */}
                    <FaWallet style={{
                        position: 'absolute',
                        right: '-20px',
                        bottom: '-20px',
                        fontSize: '10rem',
                        opacity: 0.1,
                        color: 'white',
                        transform: 'rotate(-15deg)'
                    }} />
                </div>

                {/* Secondary Stats */}
                <div className="balance-card">
                    <div className="balance-title">Revenus (Février 2026)</div>
                    <div className="balance-amount">185.000 FCFA</div>
                    <div className="balance-trend positive">
                        Obj. mensuel à 62%
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
                            <span style={{ color: '#64748b' }}>Progression</span>
                            <span style={{ fontWeight: '600' }}>300k FCFA</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px' }}>
                            <div style={{ width: '62%', height: '100%', background: '#2563eb', borderRadius: '3px' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Earnings Chart */}
            <div className="chart-section">
                <div className="chart-header">
                    <h3>Revenus Hebdomadaires</h3>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: '#64748b' }}>
                        <FaCalendarAlt /> 16 - 22 Février
                    </div>
                </div>
                <div className="chart-placeholder">
                    {weeklyEarnings.map((day, index) => (
                        <div
                            key={index}
                            className="chart-bar"
                            style={{
                                height: `${(day.amount / maxEarning) * 100}%`,
                                backgroundColor: day.amount > 0 ? '#2563eb' : '#e2e8f0'
                            }}
                            data-label={day.day}
                            title={`${day.amount} FCFA`}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="transactions-list">
                <h3>Transactions Récentes</h3>
                {transactions.map(t => (
                    <div key={t.id} className="transaction-item">
                        <div className={`t-icon ${t.type.toLowerCase()}`}>
                            {t.type === 'INCOME' ? <FaArrowDown /> : <FaExchangeAlt />}
                        </div>
                        <div className="t-details">
                            <h4>{t.title}</h4>
                            <p>{t.date}</p>
                        </div>
                        <div className={`t-amount ${t.type.toLowerCase()}`}>
                            {t.amount}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wallet;
