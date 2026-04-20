import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import './Admin.css';

const AdminAnalytics: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, summaryRes] = await Promise.all([
          adminService.getStats(),
          adminService.getAnalyticsSummary().catch(() => null),
        ]);
        setStats(statsRes);
        setSummary(summaryRes);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <div className="admin-loading">Chargement...</div>;

  return (
    <div className="admin-page">
      <h1 className="admin-title">Analytics & KPIs</h1>

      <div className="admin-stats-row">
        <div className="admin-stat-card"><span className="stat-value">{stats?.total_users || 0}</span><span className="stat-label">Utilisateurs totaux</span></div>
        <div className="admin-stat-card"><span className="stat-value">{stats?.total_requests || 0}</span><span className="stat-label">Demandes totales</span></div>
        <div className="admin-stat-card"><span className="stat-value">{stats?.pending_requests || 0}</span><span className="stat-label">Demandes en attente</span></div>
        <div className="admin-stat-card"><span className="stat-value">{stats?.new_users_this_month || 0}</span><span className="stat-label">Nouveaux ce mois</span></div>
      </div>

      <div className="admin-stats-row" style={{ marginTop: '1rem' }}>
        <div className="admin-stat-card"><span className="stat-value">{stats?.total_clients || 0}</span><span className="stat-label">Clients</span></div>
        <div className="admin-stat-card"><span className="stat-value">{stats?.total_technicians || 0}</span><span className="stat-label">Techniciens</span></div>
        <div className="admin-stat-card"><span className="stat-value">{stats?.total_agencies || 0}</span><span className="stat-label">Agences</span></div>
        <div className="admin-stat-card"><span className="stat-value">{stats?.active_users || 0}</span><span className="stat-label">Actifs</span></div>
      </div>

      {summary && (
        <>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '2rem 0 1rem' }}>Événements récents</h2>
          <table className="admin-table">
            <thead><tr><th>Événement</th><th>Nombre</th></tr></thead>
            <tbody>
              {Object.entries(summary).map(([key, val]) => (
                <tr key={key}><td>{key}</td><td>{String(val)}</td></tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;
