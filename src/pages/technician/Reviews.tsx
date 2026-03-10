import React, { useState } from 'react';
import { FaStar, FaRegStar, FaChartLine, FaArrowUp, FaArrowDown, FaCommentDots } from 'react-icons/fa';
import './Reviews.css';

interface Review {
    id: string;
    clientName: string;
    rating: number;
    text: string;
    date: string;
    techReply?: string;
    reputationImpact: number; // +10, -5, etc.
}

interface RepChange {
    id: string;
    date: string;
    reason: string;
    change: number;
}

const Reviews: React.FC = () => {
    // V2 Mock Data
    const [reviews] = useState<Review[]>([
        {
            id: 'r1',
            clientName: 'Alice Dubois',
            rating: 5,
            text: 'Intervention très rapide, problème résolu en moins d\'une heure. Le technicien a laissé le chantier propre. Je recommande vivement.',
            date: 'Il y a 2 jours',
            reputationImpact: 15
        },
        {
            id: 'r2',
            clientName: 'Marc T.',
            rating: 4,
            text: 'Bon travail globalement, mais avec 15 minutes de retard sur l\'horaire prévu. Sinon, la réparation du chauffe-eau est impeccable.',
            date: 'La semaine dernière',
            techReply: 'Bonjour Marc, je vous prie de m\'excuser pour ce retard dû aux bouchons. Ravi que la réparation vous satisfasse !',
            reputationImpact: 5
        }
    ]);

    const [repHistory] = useState<RepChange[]>([
        { id: 'h1', date: '08 Mar 2026', reason: 'Avis 5 étoiles (Alice D.)', change: +15 },
        { id: 'h2', date: '05 Mar 2026', reason: 'Avis 4 étoiles (Marc T.)', change: +5 },
        { id: 'h3', date: '01 Mar 2026', reason: 'Annulation tardive sans justification', change: -20 },
        { id: 'h4', date: '25 Fév 2026', reason: 'Mission complétée dans les temps (Bonus SLA)', change: +10 }
    ]);

    const currentRepScore = 850;
    const repLevel = 'Expert Plombier';

    // State for replies
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');

    const toggleReply = (id: string) => {
        setReplyingTo(replyingTo === id ? null : id);
        setReplyText('');
    };

    return (
        <div className="tech-page reviews-page" style={{ paddingTop: 0, marginTop: 0, boxShadow: 'none' }}>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
                Votre score de réputation affecte directement votre visibilité (Radar Live) et les missions qui vous sont proposées.
            </p>

            {/* Reputation Dashboard V2 */}
            <div className="reputation-dashboard">
                <div className="rep-score-card">
                    <h2>Score de Réputation</h2>
                    <div className="rep-score-value">{currentRepScore} <span>/ 1000</span></div>
                    <div className="rep-level-badge">{repLevel}</div>
                    <p>Vous êtes dans le top <strong>10%</strong> des techniciens de votre zone.</p>
                </div>

                <div className="rep-history-card">
                    <h3><FaChartLine /> Historique des Variations</h3>
                    <div className="rep-history-list">
                        {repHistory.map(item => (
                            <div key={item.id} className="rep-history-item">
                                <div className="rep-item-info">
                                    <strong>{item.reason}</strong>
                                    <span>{item.date}</span>
                                </div>
                                <div className={`rep-item-change ${item.change > 0 ? 'positive' : 'negative'}`}>
                                    {item.change > 0 ? <FaArrowUp /> : <FaArrowDown />}
                                    {Math.abs(item.change)} pts
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Standard Reviews Summary */}
            <div className="reviews-summary">
                <div className="average-score-box">
                    <div className="average-score">4.8</div>
                    <div className="stars-container">
                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar style={{ opacity: 0.5 }} />
                    </div>
                    <div className="total-reviews-count">Basé sur 42 avis</div>
                </div>

                <div className="score-bars">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = star === 5 ? 30 : star === 4 ? 10 : star === 3 ? 2 : 0;
                        const percentage = (count / 42) * 100;
                        return (
                            <div key={star} className="score-bar-row">
                                <div className="score-label">{star} <FaStar /></div>
                                <div className="score-bar-bg">
                                    <div className="score-bar-fill" style={{ width: `${percentage}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Review List */}
            <div className="reviews-list">
                <h3>Avis récents</h3>
                {reviews.map(review => (
                    <div key={review.id} className="review-card">
                        <div className="review-header">
                            <div className="reviewer-info">
                                <div className="reviewer-avatar">{review.clientName.charAt(0)}</div>
                                <div>
                                    <div className="reviewer-name">{review.clientName}</div>
                                    <div className="review-meta">{review.date}</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div className="review-rating">
                                    {[...Array(5)].map((_, i) => i < review.rating ? <FaStar key={i} /> : <FaRegStar key={i} />)}
                                </div>
                                <div className="rep-impact">+{review.reputationImpact} pts</div>
                            </div>
                        </div>

                        <div className="review-content">{review.text}</div>

                        {review.techReply ? (
                            <div className="tech-reply-box">
                                <div className="tech-reply-header"><FaCommentDots /> Votre réponse :</div>
                                <div className="tech-reply-content">{review.techReply}</div>
                            </div>
                        ) : (
                            <div className="review-actions">
                                {replyingTo === review.id ? (
                                    <div className="reply-input-area">
                                        <textarea
                                            className="reply-textarea"
                                            placeholder="Rédigez une réponse publique..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                        ></textarea>
                                        <div className="reply-btn-group">
                                            <button className="btn-cancel-reply" onClick={() => toggleReply(review.id)}>Annuler</button>
                                            <button className="btn-send-reply">Poster la réponse</button>
                                        </div>
                                    </div>
                                ) : (
                                    <button className="btn-reply-toggle" onClick={() => toggleReply(review.id)}>
                                        <FaCommentDots /> Répondre publiquement
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reviews;
