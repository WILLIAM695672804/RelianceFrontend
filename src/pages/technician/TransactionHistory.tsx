import React, { useState, useEffect } from 'react';
import { financeService } from '../../services/financeService';
import './TransactionHistory.css';

interface Transaction { id: string; amount: number; balance_after: number; type: string; meta: any; created_at: string; }

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => { loadTransactions(page); }, [page]);

  const loadTransactions = async (p: number) => {
    try {
      const res = await financeService.getTransactions(p);
      const data = res.data?.data || [];
      if (p === 1) setTransactions(data); else setTransactions(prev => [...prev, ...data]);
      setHasMore(data.length >= 20);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const formatAmount = (n: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(n);

  if (loading && page === 1) return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;

  return (
    <div className="txn-page">
      <h1>Historique des Transactions</h1>
      {transactions.length === 0 ? (
        <div className="txn-empty"><p>Aucune transaction pour le moment.</p></div>
      ) : (
        <div className="txn-list">
          {transactions.map(t => (
            <div key={t.id} className={`txn-row ${t.type}`}>
              <div className="txn-icon">
                <span className="material-symbols-outlined">{t.type === 'credit' ? 'arrow_downward' : 'arrow_upward'}</span>
              </div>
              <div className="txn-info">
                <span className="txn-label">{t.meta?.description || (t.type === 'credit' ? 'Crédit reçu' : 'Débit')}</span>
                <span className="txn-date">{new Date(t.created_at).toLocaleString('fr-FR')}</span>
              </div>
              <div className="txn-amounts">
                <span className={`txn-amount ${t.amount >= 0 ? 'positive' : 'negative'}`}>{t.amount >= 0 ? '+' : ''}{formatAmount(t.amount)}</span>
                <span className="txn-balance">Solde: {formatAmount(t.balance_after)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {hasMore && transactions.length > 0 && (
        <button className="txn-load-more" onClick={() => setPage(p => p + 1)}>Charger plus</button>
      )}
    </div>
  );
};

export default TransactionHistory;
