import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { disputeService } from '../../services/disputeService';
import './DisputeDetail.css';

interface DisputeMsg {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender?: { name: string };
}

interface DisputeFull {
  id: string;
  reason: string;
  description: string;
  status: string;
  resolution: string | null;
  created_at: string;
  opener?: { id: string; name: string };
  defendant?: { id: string; name: string };
  request?: { id: string; title: string };
  messages?: DisputeMsg[];
}

const DisputeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dispute, setDispute] = useState<DisputeFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (id) loadDispute();
  }, [id]);

  const loadDispute = async () => {
    try {
      const res = await disputeService.getDispute(id!);
      setDispute(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !id) return;
    setSending(true);
    try {
      await disputeService.addMessage(id, newMessage.trim());
      setNewMessage('');
      await loadDispute();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur');
    } finally {
      setSending(false);
    }
  };

  const statusLabel = (s: string) => {
    const map: Record<string, string> = { open: 'Ouvert', under_review: 'En examen', resolved: 'Résolu', closed: 'Fermé' };
    return map[s] || s;
  };

  if (loading) return <div className="dispute-loading"><div className="dispute-spinner" /><p>Chargement...</p></div>;
  if (!dispute) return <div className="dispute-detail-page"><p>Litige introuvable</p></div>;

  return (
    <div className="dispute-detail-page">
      <div className="dispute-detail-header">
        <h1>Litige #{dispute.id.slice(0, 8)}</h1>
        <button className="dispute-back-btn" onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">arrow_back</span> Retour
        </button>
      </div>

      <div className="dispute-info-card">
        <div className="dispute-info-row">
          <span className="dispute-info-label">Statut</span>
          <span className="dispute-info-value">{statusLabel(dispute.status)}</span>
        </div>
        <div className="dispute-info-row">
          <span className="dispute-info-label">Motif</span>
          <span className="dispute-info-value">{dispute.reason}</span>
        </div>
        <div className="dispute-info-row">
          <span className="dispute-info-label">Ouvert par</span>
          <span className="dispute-info-value">{dispute.opener?.name || '—'}</span>
        </div>
        <div className="dispute-info-row">
          <span className="dispute-info-label">Contre</span>
          <span className="dispute-info-value">{dispute.defendant?.name || '—'}</span>
        </div>
        <div className="dispute-info-row">
          <span className="dispute-info-label">Demande</span>
          <span className="dispute-info-value">{dispute.request?.title || dispute.request?.id || '—'}</span>
        </div>
        <div className="dispute-info-row">
          <span className="dispute-info-label">Date</span>
          <span className="dispute-info-value">{new Date(dispute.created_at).toLocaleDateString('fr-FR')}</span>
        </div>
        <p style={{ marginTop: '0.75rem', color: 'var(--color-text-gray)', fontSize: '0.85rem' }}>{dispute.description}</p>
      </div>

      {dispute.resolution && (
        <div className="dispute-resolution-box">
          <h4>Résolution</h4>
          <p>{dispute.resolution}</p>
        </div>
      )}

      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '1.5rem 0 0.5rem' }}>Messages</h3>
      <div className="dispute-messages">
        {(!dispute.messages || dispute.messages.length === 0) && (
          <p style={{ color: 'var(--color-text-gray)', fontSize: '0.85rem' }}>Aucun message pour le moment.</p>
        )}
        {dispute.messages?.map((m) => (
          <div key={m.id} className={`dispute-msg ${m.sender_id === user?.id ? 'mine' : 'other'}`}>
            <div className="dispute-msg-sender">{m.sender?.name || 'Utilisateur'}</div>
            <div className="dispute-msg-body">{m.message}</div>
            <div className="dispute-msg-time">{new Date(m.created_at).toLocaleString('fr-FR')}</div>
          </div>
        ))}
      </div>

      {dispute.status !== 'resolved' && dispute.status !== 'closed' && (
        <form className="dispute-reply-form" onSubmit={handleSendMessage}>
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrire un message..."
            disabled={sending}
          />
          <button type="submit" disabled={sending || !newMessage.trim()}>Envoyer</button>
        </form>
      )}
    </div>
  );
};

export default DisputeDetail;
