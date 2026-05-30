import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInvoices, payInvoice, type Invoice } from '../../services/operationsService';
import { Loading, EmptyState, ErrorState } from '../../components/common/AsyncStates';
import { formatXAF, formatDate } from '../../utils/format';
import './Invoices.css';

/**
 * GABARIT DE RÉFÉRENCE pour la mise en dynamique des pages :
 *  - lecture via useQuery (cache + loading/error gérés)
 *  - écriture via useMutation + invalidation du cache
 *  - états async via <Loading/> <EmptyState/> <ErrorState/>
 *  - montants via formatXAF, dates via formatDate
 */
const Invoices: React.FC = () => {
    const [page, setPage] = useState(1);
    const qc = useQueryClient();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['invoices', page],
        queryFn: () => getInvoices(page),
    });

    const payMutation = useMutation({
        mutationFn: (invoiceId: string) => payInvoice(invoiceId),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['invoices'] }),
    });

    const invoices: Invoice[] = data?.data ?? [];
    const hasMore = (data?.meta?.last_page ?? 1) > page;

    const handlePay = (invoiceId: string) => {
        if (!window.confirm('Confirmer le paiement de cette facture ?')) return;
        payMutation.mutate(invoiceId);
    };

    const statusConfig: Record<string, { label: string; cls: string; icon: string }> = {
        unpaid: { label: 'Non payee', cls: 'inv-status-unpaid', icon: 'schedule' },
        paid: { label: 'Payee', cls: 'inv-status-paid', icon: 'check_circle' },
        cancelled: { label: 'Annulee', cls: 'inv-status-cancelled', icon: 'cancel' },
        refunded: { label: 'Remboursee', cls: 'inv-status-refunded', icon: 'undo' },
    };

    if (isLoading) return <div className="inv-page"><Loading label="Chargement des factures…" /></div>;
    if (isError) return <div className="inv-page"><ErrorState onRetry={() => refetch()} /></div>;

    return (
        <div className="inv-page">
            <div className="inv-header">
                <h1 className="inv-title">Mes Factures</h1>
                <p className="inv-subtitle">{invoices.length} facture(s)</p>
            </div>

            {invoices.length === 0 ? (
                <EmptyState
                    icon="receipt_long"
                    title="Aucune facture pour le moment"
                    message="Les factures sont générées automatiquement lorsque vous acceptez un devis."
                />
            ) : (
                <div className="inv-list">
                    {invoices.map((inv) => {
                        const st = statusConfig[inv.status] || statusConfig.unpaid;
                        const paying = payMutation.isPending && payMutation.variables === inv.id;
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
                                        <span className="inv-amount">{formatXAF(inv.amount)}</span>
                                        {Number(inv.tax_amount) > 0 && (
                                            <span className="inv-tax">dont {formatXAF(inv.tax_amount)} de taxes</span>
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
                                            <span>{formatDate(inv.created_at)}</span>
                                        </div>
                                    </div>
                                </div>

                                {inv.status === 'unpaid' && (
                                    <div className="inv-card-actions">
                                        <button
                                            className="inv-pay-btn"
                                            onClick={() => handlePay(inv.id)}
                                            disabled={paying}
                                        >
                                            <span className="material-symbols-outlined">payment</span>
                                            {paying ? 'Paiement...' : 'Payer maintenant'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

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
