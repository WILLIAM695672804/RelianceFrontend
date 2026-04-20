import React, { useState, useEffect } from 'react';
import { disputeService } from '../../services/disputeService';
import '../admin/Admin.css';

interface Dispute {
  id: string; reason: string; description: string; status: string; resolution: string | null; created_at: string;
  opener?: { name: string }; defendant?: { name: string }; request?: { id: string; title: string };
}

const AdminDisputes: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolveModal, setResolveModal] = useState<string | null>(null);
  const [resolution, setResolution] = useState('');

  useEffect(() => { loadDisputes(); }, []);

  const loadDisputes = async () => {
    try {
      const res = await disputeService.getAllDisputes();
      setDisputes(res.data.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleResolve = async (id: string) => {
    try {
      await disputeService.resolveDispute(id, resolution);
      setResolveModal(null);
      setResolution('');
      await loadDisputes();
    } catch (err: any) { alert(err.response?.data?.message || 'Erreur'); }
  };

  if (loading) return <div className="admin-loading">Chargement...</div>;

  return (
    <div className="admin-page">
      <h1 className="admin-title">Gestion des Litiges</h1>
      <div className="admin-stats-row">
        <div className="admin-stat-card"><span className="stat-value">{disputes.filter(d => d.status === 'open').length}</span><span className="stat-label">Ouverts</span></div>
        <div className="admin-stat-card"><span className="stat-value">{disputes.filter(d => d.status === 'under_review').length}</span><span className="stat-label">En examen</span></div>
        <div className="admin-stat-card"><span className="stat-value">{disputes.filter(d => d.status === 'resolved').length}</span><span className="stat-label">Résolus</span></div>
      </div>
      <table className="admin-table">
        <thead><tr><th>Date</th><th>Motif</th><th>Ouvert par</th><th>Contre</th><th>Statut</th><th>Action</th></tr></thead>
        <tbody>
          {disputes.map(d => (
            <tr key={d.id}>
              <td>{new Date(d.created_at).toLocaleDateString('fr-FR')}</td>
              <td>{d.reason}</td>
              <td>{d.opener?.name || '—'}</td>
              <td>{d.defendant?.name || '—'}</td>
              <td><span className={`status-badge status-${d.status}`}>{d.status}</span></td>
              <td>
                {d.status === 'open' && <button className="btn-action" onClick={() => setResolveModal(d.id)}>Résoudre</button>}
                {d.resolution && <span className="text-muted text-sm">{d.resolution}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {resolveModal && (
        <div className="admin-modal-overlay" onClick={() => setResolveModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>Résoudre le litige</h3>
            <textarea placeholder="Décision / Résolution..." value={resolution} onChange={e => setResolution(e.target.value)} rows={4} />
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setResolveModal(null)}>Annuler</button>
              <button className="btn-primary" onClick={() => handleResolve(resolveModal)}>Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDisputes;
