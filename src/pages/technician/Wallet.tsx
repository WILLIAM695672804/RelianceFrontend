import React, { useState } from 'react';
import {
    FaWallet,
    FaArrowDown,
    FaArrowUp,
    FaHistory,
    FaExclamationCircle,
    FaLock,
    FaMoneyBillWave,
    FaExchangeAlt,
    FaChartPie
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Wallet.css';

interface Transaction {
    id: string;
    type: 'credit' | 'debit' | 'hold';
    title: string;
    date: string;
    amount: number;
    grossAmount?: number;
    platformFee?: number;
    status: 'completed' | 'pending' | 'failed';
}

const Wallet: React.FC = () => {
    const [currency, setCurrency] = useState<'XAF' | 'EUR' | 'USD'>('XAF');

    // Exchange rates mock
    const rates = { XAF: 1, EUR: 0.0015, USD: 0.0016 };
    const formatCurrency = (amountInXaf: number) => {
        const converted = amountInXaf * rates[currency];
        return new Intl.NumberFormat(currency === 'XAF' ? 'fr-CM' : 'en-US', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: currency === 'XAF' ? 0 : 2
        }).format(converted);
    };

    // V2 Mock Data
    const availableBalanceXaf = 125000;
    const escrowBalanceXaf = 45000; // Fonds sécurisés pour missions en cours

    // V3: Affiliation State
    const isAgencyEmployee = true; // Set to false to see independent wallet
    const agencyName = "Tech Solutions S.A";

    const [transactions] = useState<Transaction[]>([
        { 
            id: 'TX-982', 
            type: 'hold', 
            title: 'Séquestre Mission #M-2684', 
            date: '10 Mars 2026', 
            amount: 45000, 
            status: 'pending' 
        },
        { 
            id: 'TX-981', 
            type: 'credit', 
            title: 'Paiement Mission #M-2680', 
            date: '08 Mars 2026', 
            grossAmount: 30000,
            platformFee: 3000, // 10% Reliance fee
            amount: 27000, 
            status: 'completed' 
        },
        { 
            id: 'TX-980', 
            type: 'debit', 
            title: 'Retrait vers Compte Pro (Agence)', 
            date: '05 Mars 2026', 
            amount: 50000, 
            status: 'completed' 
        },
        { 
            id: 'TX-979', 
            type: 'credit', 
            title: 'Bonus Parrainage', 
            date: '01 Mars 2026', 
            amount: 5000, 
            status: 'completed' 
        }
    ]);

    return (
        <div className="tech-page wallet-page">
            <div className="wallet-header-controls">
                <h1 className="page-title">Finance & Portefeuille</h1>
                <div className="currency-selector">
                    <FaExchangeAlt />
                    <select value={currency} onChange={(e) => setCurrency(e.target.value as any)}>
                        <option value="XAF">XAF (FCFA)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                    </select>
                </div>
            </div>

            {/* V3: Agency Banner */}
            {isAgencyEmployee && (
                <div className="agency-wallet-banner" style={{
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#92400e'
                }}>
                    <FaExclamationCircle style={{fontSize: '1.5rem'}} />
                    <div>
                        <strong>Mode "Employé d'Agence" : </strong>
                        Ce portefeuille est lié à l'agence <strong>{agencyName}</strong>. Vous ne pouvez pas effectuer de retraits directs.
                    </div>
                </div>
            )}

            {/* Balances Grid */}
            <div className={`balances-grid ${isAgencyEmployee ? 'read-only-grid' : ''}`}>
                {/* Available Balance */}
                <div className="balance-card primary" style={{ opacity: isAgencyEmployee ? 0.8 : 1 }}>
                    <div className="balance-header">
                        <span className="balance-title">Solde Disponible {isAgencyEmployee && "(Agence)"}</span>
                        <FaWallet className="balance-icon" />
                    </div>
                    <div className="balance-amount">{formatCurrency(availableBalanceXaf)}</div>
                    <div className="balance-actions">
                        {isAgencyEmployee ? (
                            <button className="btn-wallet btn-withdraw disabled" disabled style={{ background: 'rgba(255,255,255,0.2)', color: 'white', cursor: 'not-allowed' }}>
                                <FaLock /> Protégé par {agencyName}
                            </button>
                        ) : (
                            <Link to="/technicien/wallet/retrait" className="btn-wallet btn-withdraw">
                                <FaArrowUp /> Retirer les fonds
                            </Link>
                        )}
                    </div>
                </div>

                {/* Escrow Balance (V2 Feature) */}
                <div className="balance-card escrow">
                    <div className="balance-header">
                        <span className="balance-title">Fonds au Séquestre (Holds)</span>
                        <FaLock className="balance-icon" />
                    </div>
                    <div className="balance-amount">{formatCurrency(escrowBalanceXaf)}</div>
                    <p className="escrow-desc">
                        Ce montant est sécurisé par Reliance. Il vous sera transféré dès la clôture des missions en cours.
                    </p>
                </div>
            </div>

            {/* V2: Transparency Stats */}
            <div className="transparency-stats">
                <h3><FaChartPie /> Statistiques du compte</h3>
                <div className="stats-row">
                    <div className="stat-pill">
                        <span className="stat-label">Gains Bruts (30j)</span>
                        <span className="stat-val">{formatCurrency(150000)}</span>
                    </div>
                    <div className="stat-pill deduction">
                        <span className="stat-label">Commissions Reliance (10%)</span>
                        <span className="stat-val">-{formatCurrency(15000)}</span>
                    </div>
                    <div className="stat-pill net">
                        <span className="stat-label">Revenus Nets</span>
                        <span className="stat-val">{formatCurrency(135000)}</span>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="transactions-section">
                <div className="section-header">
                    <h2><FaHistory /> Historique & Audit</h2>
                    <button className="btn-filter">Filtrer</button>
                </div>

                <div className="transactions-list">
                    {transactions.map(tx => (
                        <div key={tx.id} className="transaction-card">
                            <div className={`tx-icon ${tx.type}`}>
                                {tx.type === 'credit' ? <FaArrowDown /> : tx.type === 'debit' ? <FaArrowUp /> : <FaLock />}
                            </div>

                            <div className="tx-info">
                                <h3>{tx.title}</h3>
                                <p className="tx-date">{tx.date} • {tx.id}</p>

                                {/* V2: Fee Transparency Breakdown */}
                                {tx.type === 'credit' && tx.grossAmount && tx.platformFee && (
                                    <div className="tx-fee-breakdown">
                                        Brut: {formatCurrency(tx.grossAmount)} | Frais Plateforme: -{formatCurrency(tx.platformFee)}
                                    </div>
                                )}
                            </div>

                            <div className="tx-amount-col">
                                <div className={`tx-amount ${tx.type}`}>
                                    {tx.type === 'credit' ? '+' : tx.type === 'debit' ? '-' : ''}{formatCurrency(tx.amount)}
                                </div>
                                <div className={`tx-status ${tx.status}`}>
                                    {tx.status === 'completed' ? 'Terminé' : tx.status === 'pending' ? 'En attente' : 'Échoué'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wallet;
