import React, { useState, useEffect } from 'react';
import reviewService from '../../services/reviewService';
import './ReviewsList.css';

interface Review { id: string; rating: number; comment: string; created_at: string; reviewer?: { name: string; avatar_url: string | null }; request?: { title: string }; }

const ReviewsList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const res = await reviewService.getMyReviews(); setReviews(res?.data || res || []); }
      catch (e) { console.error(e); } finally { setLoading(false); }
    };
    load();
  }, []);

  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '—';
  const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>;

  return (
    <div className="reviews-list-page">
      <h1>Mes Avis</h1>
      <div className="reviews-summary">
        <div className="reviews-avg"><span className="reviews-avg-num">{avgRating}</span><span className="reviews-avg-stars">{stars(Math.round(parseFloat(avgRating) || 0))}</span><span className="reviews-count">{reviews.length} avis</span></div>
      </div>
      {reviews.length === 0 ? (
        <div className="reviews-empty"><p>Aucun avis reçu pour le moment.</p></div>
      ) : (
        <div className="reviews-grid">
          {reviews.map(r => (
            <div key={r.id} className="review-card">
              <div className="review-card-top">
                <div className="review-avatar">{r.reviewer?.name?.charAt(0) || '?'}</div>
                <div><div className="review-name">{r.reviewer?.name || 'Client'}</div><div className="review-date">{new Date(r.created_at).toLocaleDateString('fr-FR')}</div></div>
                <div className="review-stars">{stars(r.rating)}</div>
              </div>
              {r.comment && <p className="review-comment">{r.comment}</p>}
              {r.request && <span className="review-request">Mission : {r.request.title}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
