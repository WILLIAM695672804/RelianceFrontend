import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { disputeService } from '../../services/disputeService';
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

  useEffect(() => {
    loadDisputes();
  }, []);

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
          <input placeholder="ID de la demande" value={formData.request_id} onChange={(e) => setFormData({ ...formData, request_id: e.target.value })} required />
          <input placeholder="ID de l'utilisateur concerné" value={formData.against} onChange={(e) => setFormData({ ...formData, against: e.target.value })} required />
          <input placeholder="Motif" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} required />
          <textarea placeholder="Description détaillée…" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={4} />
          <button type="submit" className="dispute-submit-btn">Soumettre le litige</button>
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
