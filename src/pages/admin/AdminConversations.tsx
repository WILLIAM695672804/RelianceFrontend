import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import './Admin.css';

interface Conversation {
  id: string; subject: string; created_at: string;
  members?: { user_id: string; user?: { name: string } }[];
  last_message?: { body: string; created_at: string };
}

interface Message {
  id: string; body: string; created_at: string;
  sender?: { name: string };
}

const AdminConversations: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { loadConversations(); }, []);

  const loadConversations = async () => {
    try {
      const res = await adminService.getAllConversations();
      setConversations(res.data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const loadMessages = async (convId: string) => {
    setSelectedConv(convId);
    try {
      const res = await adminService.getConversationDetail(convId);
      setMessages(res.data?.messages || res.messages || []);
    } catch (e) { console.error(e); }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) { await loadConversations(); return; }
    try {
      const res = await adminService.searchConversations(searchQuery);
      setConversations(res.data || []);
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="admin-loading">Chargement...</div>;

  return (
    <div className="admin-page">
      <h1 className="admin-title">Supervision Messagerie</h1>
      <p style={{ color: 'var(--color-text-gray)', marginBottom: '1rem', fontSize: '0.85rem' }}>Lecture seule — historique des conversations entre utilisateurs</p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input placeholder="Rechercher dans les messages..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #ddd', borderRadius: '8px' }} />
        <button className="btn-primary" onClick={handleSearch}>Rechercher</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedConv ? '1fr 1fr' : '1fr', gap: '1rem' }}>
        <div>
          <table className="admin-table">
            <thead><tr><th>Sujet</th><th>Participants</th><th>Date</th><th>Dernier msg</th></tr></thead>
            <tbody>
              {conversations.map(c => (
                <tr key={c.id} onClick={() => loadMessages(c.id)} style={{ cursor: 'pointer', background: selectedConv === c.id ? 'var(--tech-surface-container-high)' : undefined }}>
                  <td>{c.subject || '(sans sujet)'}</td>
                  <td>{c.members?.map(m => m.user?.name).filter(Boolean).join(', ') || '—'}</td>
                  <td>{new Date(c.created_at).toLocaleDateString('fr-FR')}</td>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.last_message?.body || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedConv && (
          <div style={{ border: '1px solid var(--tech-outline-variant)', borderRadius: '12px', padding: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Messages</h3>
            {messages.map(m => (
              <div key={m.id} style={{ marginBottom: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--tech-surface-container-low)', borderRadius: '8px' }}>
                <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--tech-primary)' }}>{m.sender?.name || 'Utilisateur'}</div>
                <p style={{ fontSize: '0.85rem', margin: '0.25rem 0' }}>{m.body}</p>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-gray)' }}>{new Date(m.created_at).toLocaleString('fr-FR')}</span>
              </div>
            ))}
            {messages.length === 0 && <p style={{ color: 'var(--color-text-gray)', fontSize: '0.85rem' }}>Aucun message</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminConversations;
