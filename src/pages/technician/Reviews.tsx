import React from 'react';
import {
    FaStar,
    FaCheckCircle,
    FaReply,
    FaQuoteRight
} from 'react-icons/fa';
import './Reviews.css';

const Reviews: React.FC = () => {
    // Mock Data
    const reviews = [
        {
            id: 1,
            author: "Sophie M.",
            avatar: "SM",
            date: "Il y a 2 jours",
            rating: 5,
            content: "Excellent travail ! William est arrivé à l'heure, a réparé la fuite rapidement et a laissé la salle de bain impeccable. Je recommande vivement.",
            verified: true,
            reply: "Merci Sophie ! Ravi d'avoir pu vous aider. N'hésitez pas si besoin."
        },
        {
            id: 2,
            author: "Jean P.",
            avatar: "JP",
            date: "Il y a 1 semaine",
            rating: 4,
            content: "Bon technicien, compétent. Juste un petit retard de 10 minutes, mais prévenu à l'avance.",
            verified: true,
            reply: null
        },
        {
            id: 3,
            author: "Agence Immobilière du Centre",
            avatar: "AI",
            date: "Il y a 3 semaines",
            rating: 5,
            content: "Intervention professionnelle sur notre chantier de rénovation. Respect des délais et devis conforme.",
            verified: true,
            reply: "Merci pour votre confiance renouvelée !"
        }
    ];

    const distribution = [
        { stars: 5, count: 42, percent: 70 },
        { stars: 4, count: 12, percent: 20 },
        { stars: 3, count: 4, percent: 7 },
        { stars: 2, count: 1, percent: 2 },
        { stars: 1, count: 1, percent: 1 },
    ];

    const renderStars = (rating: number) => {
        return [...Array(5)].map((_, i) => (
            <FaStar key={i} color={i < rating ? "#f59e0b" : "#e2e8f0"} />
        ));
    };

    return (
        <div className="tech-page reviews-page">
            <h1 className="page-title">Avis Clients</h1>

            {/* Rating Summary */}
            <div className="reviews-summary">
                <div className="global-rating">
                    <div className="big-rating">4.8</div>
                    <div className="stars-display">{renderStars(5)}</div>
                    <div className="rating-count">60 avis</div>
                </div>

                <div className="rating-bars">
                    {distribution.map((d) => (
                        <div key={d.stars} className="rating-bar-row">
                            <div className="star-label">{d.stars} ★</div>
                            <div className="bar-container">
                                <div className="bar-fill" style={{ width: `${d.percent}%` }}></div>
                            </div>
                            <div className="bar-count">{d.count}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reviews List */}
            <div className="reviews-list">
                {reviews.map(review => (
                    <div key={review.id} className="review-card">
                        <div className="review-header">
                            <div className="reviewer-info">
                                <div className="reviewer-avatar">{review.avatar}</div>
                                <div className="reviewer-details">
                                    <h4>{review.author}</h4>
                                    <span className="review-date">{review.date}</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: '#f59e0b' }}>{renderStars(review.rating)}</div>
                                {review.verified && (
                                    <div className="review-badge" style={{ marginTop: '5px', justifyContent: 'flex-end' }}>
                                        <FaCheckCircle /> Mission vérifiée
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="review-content">
                            <FaQuoteRight style={{ color: '#e2e8f0', marginRight: '10px', verticalAlign: 'top' }} />
                            {review.content}
                        </div>

                        {review.reply ? (
                            <div className="review-reply">
                                <div className="reply-header">
                                    Votre réponse
                                    <span style={{ fontWeight: 'normal', color: '#94a3b8' }}>Répondu</span>
                                </div>
                                <p className="reply-text">{review.reply}</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button className="btn-reply">
                                    <FaReply /> Répondre
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reviews;
