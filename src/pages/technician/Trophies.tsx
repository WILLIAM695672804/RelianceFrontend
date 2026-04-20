import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import reviewService from '../../services/reviewService';
import './Trophies.css';

interface Badge { id: string; code: string; title: string; description: string; icon_ref: string; awarded_at: string; }

const Trophies: React.FC = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [reputation, setReputation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      try {
        const [badgesRes, repRes] = await Promise.all([reviewService.getUserBadges(user.id), reviewService.getReputation(user.id)]);
        setBadges(badgesRes?.data || badgesRes || []);
        setReputation(repRes);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    load();
  }, [user?.id]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;

  return (
    <div className="trophies-page">
      <h1>Trophées & Badges</h1>

      {reputation && (
        <div className="trophies-rep-card">
          <div className="trophies-rep-score">
            <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: '#F59E0B' }}>military_tech</span>
            <span className="rep-value">{reputation.rating?.toFixed(1) || '—'}</span>
            <span className="rep-label">Note moyenne</span>
          </div>
          <div className="trophies-rep-stats">
            <div><strong>{reputation.num_reviews || 0}</strong> avis</div>
            <div><strong>{badges.length}</strong> badges</div>
          </div>
        </div>
      )}

      {badges.length === 0 ? (
        <div className="trophies-empty">
          <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: 'var(--tech-outline-variant)' }}>emoji_events</span>
          <p>Aucun badge obtenu pour le moment.</p>
          <p className="trophies-hint">Complétez des missions et obtenez de bonnes notes pour débloquer des badges !</p>
        </div>
      ) : (
        <div className="trophies-grid">
          {badges.map(b => (
            <div key={b.id} className="trophy-card">
              <span className="material-symbols-outlined trophy-icon">{b.icon_ref || 'emoji_events'}</span>
              <h3>{b.title}</h3>
              <p>{b.description}</p>
              <span className="trophy-date">Obtenu le {new Date(b.awarded_at).toLocaleDateString('fr-FR')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trophies;
