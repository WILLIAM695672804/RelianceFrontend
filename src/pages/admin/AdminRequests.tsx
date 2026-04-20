import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import './Admin.css';

interface ClientRequest {
  id: string; title: string; description: string; status: string; created_at: string;
  client?: { name: string }; detected_category?: { name: string };
}

const AdminRequests: React.FC = () => {
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [assignModal, setAssignModal] = useState<string | null>(null);
  const [techId, setTechId] = useState('');

  useEffect(() => { loadRequests(); }, [statusFilter]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllRequests({ status: statusFilter || undefined });
      setRequests(res.data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleAssign = async (requestId: string) => {
    if (!techId.trim()) return;
    try {
      await adminService.assignTechnician(requestId, techId.trim());
      setAssignModal(null);
      setTechId('');
      await loadRequests();
    } catch (err: any) { alert(err.response?.data?.message || 'Erreur'); }
  };

  const statusColor = (s: string) => {
    const map: Record<string, string> = { new: 'status-new', analyzed: 'status-active', quoted: 'status-trial', assigned: 'status-active', in_progress: 'status-trial', completed: 'status-resolved', cancelled: 'status-cancelled' };
    return map[s] || '';
  };

  if (loading) return <div className="admin-loading">Chargement...</div>;

  return (
    <div className="admin-page">
      <h1 className="admin-title">Gestion des Demandes</h1>

      <div style={{ marginBottom: '1rem' }}>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}>
          <option value="">Tous les statuts</option>
          <option value="new">Nouveau</option>
          <option value="analyzed">Analysé</option>
          <option value="quoted">Devis envoyé</option>
          <option value="assigned">Assigné</option>
          <option value="in_progress">En cours</option>
          <option value="completed">Terminé</option>
          <option value="cancelled">Annulé</option>
        </select>
      </div>

      <table className="admin-table">
        <thead><tr><th>Date</th><th>Titre</th><th>Client</th><th>Catégorie</th><th>Statut</th><th>Action</th></tr></thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.id}>
              <td>{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
              <td>{r.title}</td>
              <td>{r.client?.name || '—'}</td>
              <td>{r.detected_category?.name || '—'}</td>
              <td><span className={`status-badge ${statusColor(r.status)}`}>{r.status}</span></td>
              <td>
                {r.status === 'new' && <button className="btn-action" onClick={() => setAssignModal(r.id)}>Assigner</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {assignModal && (
        <div className="admin-modal-overlay" onClick={() => setAssignModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>Assigner un technicien</h3>
            <input placeholder="ID du technicien" value={techId} onChange={e => setTechId(e.target.value)} />
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setAssignModal(null)}>Annuler</button>
              <button className="btn-primary" onClick={() => handleAssign(assignModal)}>Assigner</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;
