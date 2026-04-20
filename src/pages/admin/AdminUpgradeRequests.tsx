import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import '../admin/Admin.css';

interface UpgradeRequest { id: string; name: string; email: string; motivation: string; skills: string[]; status: string; created_at: string; }

const AdminUpgradeRequests: React.FC = () => {
  const [requests, setRequests] = useState<UpgradeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    try {
      const res = await api.get('/admin/upgrade-requests');
      setRequests(res.data.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Approuver cette demande de promotion ?')) return;
    try {
      await api.post(`/admin/upgrade-requests/${id}/approve`);
      await loadRequests();
    } catch (err: any) { alert(err.response?.data?.message || 'Erreur'); }
  };

  const handleReject = async (id: string) => {
    try {
      await api.post(`/admin/upgrade-requests/${id}/reject`, { reason: rejectReason });
      setRejectId(null);
      setRejectReason('');
      await loadRequests();
    } catch (err: any) { alert(err.response?.data?.message || 'Erreur'); }
  };

  if (loading) return <div className="admin-loading">Chargement...</div>;

  return (
    <div className="admin-page">
      <h1 className="admin-title">Demandes de Promotion</h1>
      <p className="admin-subtitle">Clients demandant à devenir technicien</p>
      <table className="admin-table">
        <thead><tr><th>Nom</th><th>Email</th><th>Motivation</th><th>Statut</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td className="truncate-cell">{r.motivation}</td>
              <td><span className={`status-badge status-${r.status}`}>{r.status}</span></td>
              <td>{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
              <td>
                {r.status === 'pending' && <>
                  <button className="btn-success" onClick={() => handleApprove(r.id)}>Approuver</button>
                  <button className="btn-danger" onClick={() => setRejectId(r.id)}>Refuser</button>
                </>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rejectId && (
        <div className="admin-modal-overlay" onClick={() => setRejectId(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>Motif de refus</h3>
            <textarea placeholder="Raison du refus..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} />
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setRejectId(null)}>Annuler</button>
              <button className="btn-danger" onClick={() => handleReject(rejectId)}>Confirmer le refus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUpgradeRequests;
