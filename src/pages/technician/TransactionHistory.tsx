import React, { useState } from 'react';
import {
    FaArrowLeft,
    FaDownload,
    FaFilter,
    FaSearch
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './TransactionHistory.css';

const TransactionHistory: React.FC = () => {
    const navigate = useNavigate();
    const [filterType, setFilterType] = useState('ALL');

    // Mock Data
    const transactions = [
        { id: "TX-9823", date: "18 Fév 2026", desc: "Mission #M-2684 (Sophie M.)", type: "INCOME", amount: 15000, status: "COMPLETED", method: "Solde" },
        { id: "TX-9822", date: "15 Fév 2026", desc: "Retrait vers Orange Money", type: "WITHDRAWAL", amount: -25000, status: "COMPLETED", method: "Mobile Money" },
        { id: "TX-9821", date: "12 Fév 2026", desc: "Mission #M-2670 (Jean P.)", type: "INCOME", amount: 8500, status: "COMPLETED", method: "Solde" },
        { id: "TX-9820", date: "10 Fév 2026", desc: "Abonnement Pro (Mensuel)", type: "EXPENSE", amount: -5000, status: "COMPLETED", method: "Carte Bancaire" },
        { id: "TX-9819", date: "05 Fév 2026", desc: "Retrait vers Virement", type: "WITHDRAWAL", amount: -50000, status: "PENDING", method: "Virement" },
    ];

    const filteredTransactions = filterType === 'ALL'
        ? transactions
        : transactions.filter(t => t.type === filterType);

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'COMPLETED': return <span className="status-badge completed">Succès</span>;
            case 'PENDING': return <span className="status-badge pending">En cours</span>;
            case 'FAILED': return <span className="status-badge failed">Échec</span>;
            default: return status;
        }
    };

    return (
        <div className="tech-page transactions-page">
            <button className="back-btn" onClick={() => navigate('/technicien/wallet')} style={{ marginBottom: '20px' }}>
                <FaArrowLeft /> Retour au portefeuille
            </button>

            <h1 className="page-title">Historique des Transactions</h1>

            {/* Filters */}
            <div className="history-filters">
                <div className="filter-group">
                    <FaFilter style={{ color: '#64748b' }} />
                    <select
                        className="filter-select"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="ALL">Toutes les transactions</option>
                        <option value="INCOME">Revenus (Missions)</option>
                        <option value="WITHDRAWAL">Retraits</option>
                        <option value="EXPENSE">Dépenses (Abo/Frais)</option>
                    </select>
                </div>

                <div className="filter-group date-range-inputs">
                    <input type="date" className="filter-input" placeholder="Du" />
                    <span style={{ color: '#94a3b8' }}>-</span>
                    <input type="date" className="filter-input" placeholder="Au" />
                </div>

                <button className="btn-export">
                    <FaDownload /> Exporter CSV
                </button>
            </div>

            {/* Table */}
            <div className="history-table-container">
                <table className="history-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Méthode</th>
                            <th>Statut</th>
                            <th style={{ textAlign: 'right' }}>Montant</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map(tx => (
                            <tr key={tx.id}>
                                <td data-label="Date">{tx.date}</td>
                                <td data-label="Description">
                                    <div style={{ fontWeight: '500' }}>{tx.desc}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{tx.id}</div>
                                </td>
                                <td data-label="Méthode">{tx.method}</td>
                                <td data-label="Statut">{getStatusLabel(tx.status)}</td>
                                <td data-label="Montant" style={{ textAlign: 'right' }} className={tx.amount > 0 ? 'amount-positive' : 'amount-negative'}>
                                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} FCFA
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredTransactions.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                        Aucune transaction trouvée pour ces critères.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionHistory;
