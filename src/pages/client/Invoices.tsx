import React, { useState, useEffect } from 'react';
import { getInvoices, payInvoice, type Invoice } from '../../services/operationsService';
import './Invoices.css';

const Invoices: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [payingId, setPayingId] = useState<string | null>(null);

    useEffect(() => {
        fetchInvoices();
    }, [page]);

    const fetchInvoices = async () => {
        try {
            const res = await getInvoices(page);
            setInvoices(res.data);
            setHasMore(res.meta?.last_page > page);
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async (invoiceId: string) => {
        if (!window.confirm('Confirmer le paiement de cette facture ?')) return;
        setPayingId(invoiceId);
        try {
            await payInvoice(invoiceId);
            fetchInvoices();
        } catch {
            // silent
        } finally {
            setPayingId(null);
        }
    };

    const statusConfig: Record<string, { label: string; cls: string; icon: string }> = {
        unpaid: { label: 'Non payee', cls: 'inv-status-unpaid', icon: 'schedule' },
        paid: { label: 'Payee', cls: 'inv-status-paid', icon: 'check_circle' },
        cancelled: { label: 'Annulee', cls: 'inv-status-cancelled', icon: 'cancel' },
        refunded: { label: 'Remboursee', cls: 'inv-status-refunded', icon: 'undo' },
    };

    if (loading) {
        return <div className="inv-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>Chargement des factures...</div>;
    }

    return (
        <div className="inv-page">
            <div className="inv-header">
                <h1 className="inv-title">Mes Factures</h1>
                <p className="inv-subtitle">{invoices.length} facture(s)</p>
            </div>

            {invoices.length === 0 ? (
                <div className="inv-empty">
                    <span className="material-symbols-outlined" style={{ fontSize: 56, color: '#cbd5e1' }}>receipt_long</span>
                    <p>Aucune facture pour le moment.</p>
                    <p className="inv-empty-hint">Les factures sont generees automatiquement lorsque vous acceptez un devis.</p>
                </div>
            ) : (
                <div className="inv-list">
                    {invoices.map((inv) => {
                        const st = statusConfig[inv.status] || statusConfig.unpaid;
                        return (
                            <div key={inv.id} className="inv-card">
                                <div className="inv-card-top">
                                    <div className="inv-ref">
                                        <span className="material-symbols-outlined">receipt</span>
                                        <span>{inv.reference}</span>
                                    </div>
                                    <span className={`inv-status-badge ${st.cls}`}>
                                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{st.icon}</span>
                                        {st.label}
                                    </span>
                                </div>

                                <div className="inv-card-body">
                                    <div className="inv-amount-block">
                                        <span className="inv-amount">{Number(inv.amount).toLocaleString()} XAF</span>
                                        {Number(inv.tax_amount) > 0 && (
                                            <span className="inv-tax">dont {Number(inv.tax_amount).toLocaleString()} XAF de taxes</span>
                                        )}
                                    </div>
                                    <div className="inv-details">
                                        {inv.issuer && (
                                            <div className="inv-detail-item">
                                                <span className="material-symbols-outlined">person</span>
                                                <span>Emis par: {inv.issuer.name}</span>
                                            </div>
                                        )}
                                        <div className="inv-detail-item">
                                            <span className="material-symbols-outlined">calendar_today</span>
                                            <span>{new Date(inv.created_at).toLocaleDateString('fr-FR')}</span>
                                        </div>
                                    </div>
                                </div>

                                {inv.status === 'unpaid' && (
                                    <div className="inv-card-actions">
                                        <button
                                            className="inv-pay-btn"
                                            onClick={() => handlePay(inv.id)}
                                            disabled={payingId === inv.id}
                                        >
                                            <span className="material-symbols-outlined">payment</span>
                                            {payingId === inv.id ? 'Paiement...' : 'Payer maintenant'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {hasMore && (
                <div className="inv-pagination">
                    <button className="inv-load-more" onClick={() => setPage(p => p + 1)}>
                        Charger plus
                    </button>
                </div>
            )}
        </div>
    );
};

export default Invoices;
