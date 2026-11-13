import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import './Admin.css';

const AdminAnalytics: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState<any[]>([]);
  const [trainMessage, setTrainMessage] = useState('');
  const [training, setTraining] = useState(false);

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

  const loadModels = async () => {
    try { const res = await adminService.getMlModels(); setModels(res.data ?? []); } catch { /* section facultative */ }
  };

  useEffect(() => { void loadModels(); }, []);

  const train = async () => {
    setTraining(true);
    setTrainMessage('');
    try {
      const res = await adminService.trainMlModel();
      setTrainMessage(res.message || 'Calibrage terminé');
      await loadModels();
    } catch (e: any) {
      setTrainMessage(e?.response?.data?.message || 'Le calibrage a échoué');
    } finally { setTraining(false); }
  };

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

      <h2 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '2rem 0 1rem' }}>Modèle de prix suggéré</h2>
      <p style={{ opacity: 0.8, marginBottom: 12 }}>
        Le prix suggéré aux clients est calibré sur la médiane des prix réellement acceptés, par niveau de difficulté.
      </p>
      <button className="btn-primary" onClick={train} disabled={training}>{training ? 'Calibrage…' : 'Recalibrer maintenant'}</button>
      {trainMessage && <p role="status" style={{ marginTop: 8 }}>{trainMessage}</p>}
      {models.length === 0 ? (
        <p style={{ marginTop: 12 }}>Aucun modèle entraîné pour le moment.</p>
      ) : (
        <table className="admin-table" style={{ marginTop: 12 }}>
          <thead><tr><th>Version</th><th>État</th><th>Échantillons</th><th>Erreur moyenne (modèle)</th><th>Erreur moyenne (défaut)</th></tr></thead>
          <tbody>
            {models.map((m) => (
              <tr key={m.id}>
                <td>{m.version}</td>
                <td>{m.deployed ? 'Déployé' : 'Archivé'}</td>
                <td>{m.metrics?.samples ?? '—'}</td>
                <td>{m.metrics?.mae_model ?? '—'}</td>
                <td>{m.metrics?.mae_default ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminAnalytics;
