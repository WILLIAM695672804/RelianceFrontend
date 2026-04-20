import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import '../admin/Admin.css';

interface SubscriptionStat { active: number; cancelled: number; trial: number; total: number; estimated_monthly_revenue: number; }

const AdminSubscriptions: React.FC = () => {
  const [stats, setStats] = useState<SubscriptionStat | null>(null);
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [statsRes, subsRes] = await Promise.all([
        api.get('/admin/subscriptions/stats'),
        api.get('/admin/subscriptions'),
      ]);
      setStats(statsRes.data);
      setSubs(subsRes.data.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  if (loading) return <div className="admin-loading">Chargement...</div>;

  return (
    <div className="admin-page">
      <h1 className="admin-title">Gestion des Abonnements</h1>
      {stats && (
        <div className="admin-stats-row">
          <div className="admin-stat-card"><span className="stat-value">{stats.active}</span><span className="stat-label">Actifs</span></div>
          <div className="admin-stat-card"><span className="stat-value">{stats.total}</span><span className="stat-label">Total</span></div>
          <div className="admin-stat-card"><span className="stat-value">{stats.estimated_monthly_revenue.toLocaleString()} XAF</span><span className="stat-label">Revenu mensuel estimé</span></div>
        </div>
      )}
      <table className="admin-table">
        <thead><tr><th>Utilisateur</th><th>Plan</th><th>Statut</th><th>Début</th><th>Fin</th></tr></thead>
        <tbody>
          {subs.map(s => (
            <tr key={s.id}>
              <td>{s.subscriber_id}</td>
              <td>{s.plan_name}</td>
              <td><span className={`status-badge status-${s.status}`}>{s.status}</span></td>
              <td>{new Date(s.start_date).toLocaleDateString('fr-FR')}</td>
              <td>{s.end_date ? new Date(s.end_date).toLocaleDateString('fr-FR') : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminSubscriptions;
