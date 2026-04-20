import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createQuote, sendQuote, getQuotesForRequest, type QuoteBreakdownItem, type Quote } from '../../services/operationsService';
import matchingService from '../../services/matchingService';
import './QuoteEditor.css';

const QuoteEditor: React.FC = () => {
    const { id: requestId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [mission, setMission] = useState<any>(null);
    const [existingQuotes, setExistingQuotes] = useState<Quote[]>([]);
    const [breakdown, setBreakdown] = useState<QuoteBreakdownItem[]>([
        { label: '', amount: 0 }
    ]);
    const [validUntil, setValidUntil] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const missionData = await matchingService.getActiveMission();
                setMission(missionData.data);

                if (requestId) {
                    const quotes = await getQuotesForRequest(requestId);
                    setExistingQuotes(quotes);
                }
            } catch {
                // silent
            }
        };
        fetchData();
    }, [requestId]);

    const totalAmount = breakdown.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    const addLine = () => {
        setBreakdown([...breakdown, { label: '', amount: 0 }]);
    };

    const removeLine = (index: number) => {
        if (breakdown.length <= 1) return;
        setBreakdown(breakdown.filter((_, i) => i !== index));
    };

    const updateLine = (index: number, field: keyof QuoteBreakdownItem, value: string | number) => {
        const updated = [...breakdown];
        if (field === 'amount') {
            updated[index][field] = Number(value) || 0;
        } else {
            updated[index][field] = value as string;
        }
        setBreakdown(updated);
    };

    const handleSubmit = async (andSend: boolean) => {
        setError('');
        setSuccess('');

        if (!requestId) return;
        if (breakdown.some(item => !item.label.trim())) {
            setError('Veuillez remplir tous les libelles des lignes du devis.');
            return;
        }
        if (totalAmount <= 0) {
            setError('Le montant total doit etre superieur a 0.');
            return;
        }

        setIsSubmitting(true);
        try {
            const quote = await createQuote({
                request_id: requestId,
                total_amount: totalAmount,
                breakdown: breakdown.filter(b => b.label.trim()),
                valid_until: validUntil || undefined,
            });

            if (andSend) {
                await sendQuote(quote.id);
                setSuccess('Devis cree et envoye au client !');
            } else {
                setSuccess('Devis sauvegarde en brouillon.');
            }

            const quotes = await getQuotesForRequest(requestId);
            setExistingQuotes(quotes);
            setBreakdown([{ label: '', amount: 0 }]);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la creation du devis.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendExisting = async (quoteId: string) => {
        try {
            await sendQuote(quoteId);
            if (requestId) {
                const quotes = await getQuotesForRequest(requestId);
                setExistingQuotes(quotes);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de l\'envoi.');
        }
    };

    const statusLabel = (status: string) => {
        const map: Record<string, { label: string; cls: string }> = {
            draft: { label: 'Brouillon', cls: 'qe-status-draft' },
            sent: { label: 'Envoye', cls: 'qe-status-sent' },
            accepted: { label: 'Accepte', cls: 'qe-status-accepted' },
            rejected: { label: 'Refuse', cls: 'qe-status-rejected' },
            expired: { label: 'Expire', cls: 'qe-status-expired' },
        };
        return map[status] || { label: status, cls: '' };
    };

    return (
        <div className="qe-page">
            <div className="qe-header">
                <button className="qe-back-btn" onClick={() => navigate(-1)}>
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div>
                    <h1 className="qe-title">Editeur de Devis</h1>
                    <p className="qe-subtitle">{mission?.request?.title || 'Mission'}</p>
                </div>
            </div>

            {/* Existing quotes */}
            {existingQuotes.length > 0 && (
                <div className="qe-section">
                    <h3 className="qe-section-title">
                        <span className="material-symbols-outlined">receipt_long</span>
                        Devis existants
                    </h3>
                    <div className="qe-quotes-list">
                        {existingQuotes.map((q) => {
                            const st = statusLabel(q.status);
                            return (
                                <div key={q.id} className="qe-quote-card">
                                    <div className="qe-quote-card-top">
                                        <span className={`qe-status-badge ${st.cls}`}>{st.label}</span>
                                        <span className="qe-quote-amount">{Number(q.total_amount).toLocaleString()} XAF</span>
                                    </div>
                                    {q.breakdown && (
                                        <div className="qe-quote-breakdown">
                                            {q.breakdown.map((b, i) => (
                                                <div key={i} className="qe-breakdown-line">
                                                    <span>{b.label}</span>
                                                    <span>{Number(b.amount).toLocaleString()} XAF</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="qe-quote-card-bottom">
                                        <span className="qe-quote-date">
                                            {new Date(q.created_at).toLocaleDateString('fr-FR')}
                                        </span>
                                        {q.status === 'draft' && (
                                            <button className="qe-send-btn" onClick={() => handleSendExisting(q.id)}>
                                                <span className="material-symbols-outlined">send</span>
                                                Envoyer
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* New quote form */}
            <div className="qe-section">
                <h3 className="qe-section-title">
                    <span className="material-symbols-outlined">add_circle</span>
                    Nouveau devis
                </h3>

                {error && <div className="qe-alert qe-alert-error">{error}</div>}
                {success && <div className="qe-alert qe-alert-success">{success}</div>}

                <div className="qe-form">
                    <div className="qe-lines-header">
                        <span>Description</span>
                        <span>Montant (XAF)</span>
                        <span></span>
                    </div>

                    {breakdown.map((item, index) => (
                        <div key={index} className="qe-line-row">
                            <input
                                type="text"
                                className="qe-input"
                                placeholder="Ex: Main d'oeuvre, Pieces, Deplacement..."
                                value={item.label}
                                onChange={(e) => updateLine(index, 'label', e.target.value)}
                            />
                            <input
                                type="number"
                                className="qe-input qe-input-amount"
                                placeholder="0"
                                value={item.amount || ''}
                                onChange={(e) => updateLine(index, 'amount', e.target.value)}
                            />
                            <button className="qe-remove-line" onClick={() => removeLine(index)} disabled={breakdown.length <= 1}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    ))}

                    <button className="qe-add-line" onClick={addLine}>
                        <span className="material-symbols-outlined">add</span>
                        Ajouter une ligne
                    </button>

                    <div className="qe-total-bar">
                        <span>Total</span>
                        <span className="qe-total-value">{totalAmount.toLocaleString()} XAF</span>
                    </div>

                    <div className="qe-valid-until">
                        <label>Valide jusqu'au (optionnel)</label>
                        <input
                            type="date"
                            className="qe-input"
                            value={validUntil}
                            onChange={(e) => setValidUntil(e.target.value)}
                        />
                    </div>

                    <div className="qe-actions">
                        <button
                            className="qe-btn-draft"
                            onClick={() => handleSubmit(false)}
                            disabled={isSubmitting}
                        >
                            <span className="material-symbols-outlined">save</span>
                            Sauvegarder brouillon
                        </button>
                        <button
                            className="qe-btn-send"
                            onClick={() => handleSubmit(true)}
                            disabled={isSubmitting}
                        >
                            <span className="material-symbols-outlined">send</span>
                            Creer et envoyer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuoteEditor;
