import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './SocialWall.css';

interface Post { id: string; content: string; attachments: any; created_at: string; author?: { name: string; avatar_url: string | null }; likes_count?: number; comments_count?: number; }

const SocialWall: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    const load = async () => {
      try { const res = await api.get('/posts/feed'); setPosts(res.data.data || []); }
      catch (e) { console.error(e); } finally { setLoading(false); }
    };
    load();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    try {
      await api.post('/posts', { content: newContent });
      setNewContent('');
      const res = await api.get('/posts/feed');
      setPosts(res.data.data || []);
    } catch (err: any) { alert(err.response?.data?.message || 'Erreur'); }
  };

  const handleLike = async (postId: string) => {
    try { await api.post(`/posts/${postId}/like`); const res = await api.get('/posts/feed'); setPosts(res.data.data || []); }
    catch { /* silent */ }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;

  return (
    <div className="social-wall-page">
      <h1>Mon Réseau</h1>
      <form className="social-post-form" onSubmit={handlePost}>
        <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Partagez une réalisation, un conseil..." rows={3} />
        <button type="submit" disabled={!newContent.trim()}>Publier</button>
      </form>
      <div className="social-feed">
        {posts.map(p => (
          <div key={p.id} className="social-card">
            <div className="social-card-header">
              <div className="social-avatar">{p.author?.name?.charAt(0) || '?'}</div>
              <div><span className="social-author">{p.author?.name || 'Utilisateur'}</span><span className="social-time">{new Date(p.created_at).toLocaleDateString('fr-FR')}</span></div>
            </div>
            <p className="social-content">{p.content}</p>
            <div className="social-actions">
              <button onClick={() => handleLike(p.id)}><span className="material-symbols-outlined">favorite</span> {p.likes_count || 0}</button>
              <span><span className="material-symbols-outlined">comment</span> {p.comments_count || 0}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialWall;
