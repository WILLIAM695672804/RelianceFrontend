import React, { useState } from 'react';
import StarRating from './StarRating';
import reviewService from '../../services/reviewService';
import './ReviewModal.css';

interface ReviewModalProps {
    requestId: string;
    technicianName: string;
    onClose: () => void;
    onSubmitted: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ requestId, technicianName, onClose, onSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setSubmitting(true);
        setError(null);
        try {
            await reviewService.submitReview(requestId, rating, comment || undefined);
            onSubmitted();
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Erreur lors de l\'envoi de l\'avis.';
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="review-modal-overlay" onClick={onClose}>
            <div className="review-modal" onClick={(e) => e.stopPropagation()}>
                <div className="review-modal-header">
                    <h3>Evaluer {technicianName}</h3>
                    <button onClick={onClose}>&times;</button>
                </div>
                <div className="review-modal-body">
                    <div className="review-stars-section">
                        <p>Comment evaluez-vous cette intervention ?</p>
                        <StarRating value={rating} onChange={setRating} size="lg" />
                    </div>
                    <div className="review-comment-section">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Decrivez votre experience (optionnel)..."
                            maxLength={2000}
                        />
                    </div>
                    {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', margin: 0 }}>{error}</p>}
                </div>
                <div className="review-modal-footer">
                    <button className="review-btn-cancel" onClick={onClose}>Annuler</button>
                    <button
                        className="review-btn-submit"
                        disabled={rating === 0 || submitting}
                        onClick={handleSubmit}
                    >
                        {submitting ? 'Envoi...' : 'Envoyer l\'avis'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
