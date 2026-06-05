import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { disputeService } from '../../services/disputeService';
import requestService from '../../services/requestService';
import type { ClientRequest } from '../../services/requestService';
import './Disputes.css';

interface Dispute {
  id: string;
  reason: string;
  description: string;
  status: string;
  resolution: string | null;
  created_at: string;
  opener?: { name: string };
  defendant?: { name: string };
}

const Disputes: React.FC = () => {
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ request_id: '', against: '', reason: '', description: '' });
  const [requests, setRequests] = useState<ClientRequest[]>([]);

  useEffect(() => {
    loadDisputes();
  }, []);

  // Charge les demandes du client une fois, à l'ouverture du formulaire.
  useEffect(() => {
    if (showForm && requests.length === 0) {
      loadRequests();
    }
  }, [showForm]);

  const loadRequests = async () => {
    try {
      const res = await requestService.list();
      setRequests(res.data || []);
    } catch (err) {
      console.error('Failed to load requests', err);
    }
  };

  // Sélection d'une demande → dérive request_id et against (interlocuteur retenu).
  const handleSelectRequest = (requestId: string) => {
    const req = requests.find((r) => r.id === requestId);
    setFormData({
      ...formData,
      request_id: requestId,
      against: req?.counterpart?.id ?? '',
    });
  };

  const selectedRequest = requests.find((r) => r.id === formData.request_id);

  const loadDisputes = async () => {
    try {
      const res = await disputeService.getDisputes();
      setDisputes(res.data.data || []);
    } catch (err) {
      console.error('Failed to load disputes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await disputeService.openDispute(formData);
      setShowForm(false);
      setFormData({ request_id: '', against: '', reason: '', description: '' });
      await loadDisputes();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'open': return '#EF4444';
      case 'under_review': return '#F59E0B';
      case 'resolved': return '#10B981';
      case 'closed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Ouvert';
      case 'under_review': return 'En examen';
      case 'resolved': return 'Résolu';
      case 'closed': return 'Fermé';
      default: return status;
    }
  };

  if (loading) return <div className="dispute-loading"><div className="dispute-spinner" /><p>Chargement...</p></div>;

  return (
    <div className="disputes-page">
      <div className="dispute-header">
        <h1>Mes litiges</h1>
        <button className="dispute-open-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Annuler' : '+ Ouvrir un litige'}
        </button>
      </div>

      {showForm && (
        <form className="dispute-form" onSubmit={handleSubmit}>
          <label className="dispute-field-label">Demande concernée</label>
          <select
            value={formData.request_id}
            onChange={(e) => handleSelectRequest(e.target.value)}
            required
          >
            <option value="" disabled>Sélectionnez une demande…</option>
            {requests.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}{r.category ? ` — ${r.category.name}` : ''}
              </option>
            ))}
          </select>

          {/* Interlocuteur dérivé automatiquement de la demande sélectionnée */}
          {selectedRequest && (
            selectedRequest.counterpart ? (
              <div className="dispute-counterpart">
                <span className="material-symbols-outlined">person</span>
                <span>Litige contre&nbsp;: <strong>{selectedRequest.counterpart.name}</strong></span>
              </div>
            ) : (
              <div className="dispute-counterpart dispute-counterpart--warn">
                <span className="material-symbols-outlined">info</span>
                <span>Aucun technicien n'a encore été retenu sur cette demande&nbsp;; impossible d'ouvrir un litige.</span>
              </div>
            )
          )}

          <input placeholder="Motif" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} required />
          <textarea placeholder="Description détaillée…" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={4} />
          <button type="submit" className="dispute-submit-btn" disabled={!formData.against}>Soumettre le litige</button>
        </form>
      )}

      {disputes.length === 0 ? (
        <div className="dispute-empty">
          <p>Aucun litige en cours</p>
        </div>
      ) : (
        <div className="dispute-list">
          {disputes.map((d) => (
            <div key={d.id} className="dispute-card" onClick={() => navigate(`litiges/${d.id}`)} style={{ cursor: 'pointer' }}>
              <div className="dispute-card-top">
                <span className="dispute-status" style={{ background: statusColor(d.status) }}>
                  {statusLabel(d.status)}
                </span>
                <span className="dispute-date">
                  {new Date(d.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <h3>{d.reason}</h3>
              <p className="dispute-desc">{d.description}</p>
              {d.resolution && <div className="dispute-resolution"><strong>Résolution :</strong> {d.resolution}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Disputes;
