import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getInvoices, type Invoice } from '../../services/operationsService';
import { financeService } from '../../services/financeService';
import { Loading, EmptyState, ErrorState } from '../../components/common/AsyncStates';
import CurrencyWallets from '../../components/finance/CurrencyWallets';
import { formatXAF, formatDateTime } from '../../utils/format';
import './ClientWallet.css';

const ClientWallet: React.FC = () => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0); // Available balance
    const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);

    const qc = useQueryClient();
    const { data: txRes, isLoading: txLoading, isError: txError, refetch: txRefetch } =
        useQuery({ queryKey: ['client-wallet-transactions'], queryFn: () => financeService.getTransactions(1) });

    // Taux de change réels (depuis l'API) pour les équivalents en devises.
    const { data: ratesRes } = useQuery({ queryKey: ['exchange-rates'], queryFn: () => financeService.getExchangeRates() });
    const equivalents: { currency: string; value: number }[] = (() => {
        const rows: any[] = ratesRes?.data?.data ?? [];
        // On ne garde que les taux vers le XAF (1 devise = N XAF) pour convertir le solde.
        return rows
            .filter((r) => r.to_currency === 'XAF' && Number(r.rate) > 0)
            .map((r) => ({ currency: r.from_currency, value: balance / Number(r.rate) }));
    })();
    const txList: any[] = txRes?.data?.data ?? [];
    const [ledgerFilter, setLedgerFilter] = useState<'all' | 'holds' | 'payments'>('all');
    const [visibleTx, setVisibleTx] = useState(8);
    const filteredTx = txList.filter((t) =>
        ledgerFilter === 'all' ? true : ledgerFilter === 'holds' ? t.type === 'hold' : ['debit', 'payment'].includes(t.type)
    );
    const shownTx = filteredTx.slice(0, visibleTx);

    // Dépenses mensuelles = somme des débits par mois (6 derniers mois), vraies transactions.
    const spending = (() => {
        const now = new Date();
        const buckets = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
            return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString('fr-FR', { month: 'short' }), total: 0 };
        });
        txList.forEach((t) => {
            const d = new Date(t.created_at);
            const b = buckets.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
            if (b && Number(t.amount) < 0) b.total += Math.abs(Number(t.amount));
        });
        const max = Math.max(1, ...buckets.map((b) => b.total));
        return { buckets, max };
    })();

    // Recharge Modal States
    const [showRechargeModal, setShowRechargeModal] = useState(false);
    const [rechargeStep, setRechargeStep] = useState(1);
    const [selectedMethod, setSelectedMethod] = useState('');
    const [rechargeAmount, setRechargeAmount] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [rechargeError, setRechargeError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [currentPaymentId, setCurrentPaymentId] = useState<string | null>(null);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchWallet = async () => {
        try {
            const res = await financeService.getWallet();
            const data = res.data?.data ?? res.data;
            if (data?.available_balance != null) setBalance(data.available_balance);
            else if (data?.balance != null) setBalance(data.balance);
        } catch {
            // silent
        }
    };

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await getInvoices(1);
                setRecentInvoices(res.data?.slice(0, 3) || []);
            } catch {
                // silent
            }
        };
        fetchInvoices();
        fetchWallet();
        return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }, []);

    const resetRecharge = () => {
        if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
        setShowRechargeModal(false);
        setRechargeStep(1);
        setSelectedMethod('');
        setRechargeAmount('');
        setPhoneNumber('');
        setRechargeError('');
        setSubmitting(false);
        setCurrentPaymentId(null);
    };

    // DEV uniquement : simule la confirmation de la passerelle (le webhook ne peut pas
    // joindre localhost en local). Désactivé en production via import.meta.env.DEV.
    const devConfirmPayment = async () => {
        if (!currentPaymentId) return;
        setRechargeError('');
        try {
            await financeService.confirmPayment(currentPaymentId);
            if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
            await fetchWallet();
            qc.invalidateQueries({ queryKey: ['client-wallet-transactions'] });
            setRechargeStep(3);
        } catch (err: any) {
            setRechargeError(err?.response?.data?.message || 'Échec de la confirmation');
        }
    };

    const startRecharge = async () => {
        setRechargeError('');
        const amount = Number(rechargeAmount);
        if (!amount || amount < 100) { setRechargeError('Montant minimum : 100 FCFA'); return; }
        if ((selectedMethod === 'momo' || selectedMethod === 'om') && !phoneNumber.trim()) {
            setRechargeError('Numéro de téléphone requis pour le Mobile Money'); return;
        }
        setSubmitting(true);
        try {
            const res = await financeService.rechargeWallet({
                amount,
                method: selectedMethod,
                phone_number: phoneNumber.trim() || undefined,
            });
            const paymentId = res.data?.payment_id;
            setCurrentPaymentId(paymentId);
            setRechargeStep(2);
            pollPaymentStatus(paymentId);
        } catch (err: any) {
            setRechargeError(err?.response?.data?.message || 'Échec de l\'initiation du paiement');
        } finally {
            setSubmitting(false);
        }
    };

    const pollPaymentStatus = (paymentId: string) => {
        if (!paymentId) return;
        const startedAt = Date.now();
        const TIMEOUT_MS = 90_000;
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = setInterval(async () => {
            try {
                const res = await financeService.getPayment(paymentId);
                const status = (res.data?.data ?? res.data)?.status;
                if (status === 'settled') {
                    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
                    await fetchWallet();
                    qc.invalidateQueries({ queryKey: ['client-wallet-transactions'] });
                    setRechargeStep(3);
                } else if (status === 'failed' || status === 'cancelled') {
                    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
                    setRechargeError('Le paiement a échoué. Veuillez réessayer.');
                    setRechargeStep(1);
                } else if (Date.now() - startedAt > TIMEOUT_MS) {
                    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
                    setRechargeError('Délai dépassé. Vérifiez votre téléphone puis consultez votre historique.');
                    setRechargeStep(1);
                }
            } catch {
                // on continue à interroger malgré une erreur ponctuelle
            }
        }, 3000);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <div className="cw-page">
            <div className="cw-content-area">
                
                {/* Balance Bento Grid Section */}
                <div className="cw-bento-grid top-tiles">
                    {/* Main Balance Card */}
                    <div className="cw-balance-card">
                        <div className="cw-balance-glow"></div>
                        <div className="cw-balance-content">
                            <p className="cw-balance-label">Total Available Balance</p>
                            <h1 className="cw-balance-amount">{formatCurrency(balance).replace('FCFA', '').trim()} <span className="cw-currency-symbol">XAF</span></h1>
                            
                            {equivalents.length > 0 && (
                                <div className="cw-equivalent-rates">
                                    {equivalents.map((eq) => (
                                        <div className="cw-rate-item" key={eq.currency}>
                                            <p className="cw-rate-label">Équivalent {eq.currency}</p>
                                            <p className="cw-rate-value">
                                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: eq.currency, maximumFractionDigits: 2 }).format(eq.value)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="cw-balance-actions">
                            <button className="cw-btn-add-funds" onClick={() => setShowRechargeModal(true)}>
                                <span className="material-symbols-outlined">add_circle</span>
                                Add Funds
                            </button>
                            <button className="cw-btn-share text-primary bg-white hover-bg-slate-50" onClick={() => window.print()}>
                                <span className="material-symbols-outlined">ios_share</span>
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats / Actions */}
                    <div className="cw-funding-methods-card">
                        <div>
                            <h3 className="cw-card-title">Funding Methods</h3>
                            <div className="cw-methods-list">
                                <div className="cw-method-item">
                                    <div className="cw-method-info">
                                        <div className="cw-method-icon orange">
                                            <span className="material-symbols-outlined">smartphone</span>
                                        </div>
                                        <span className="cw-method-name">Mobile Money</span>
                                    </div>
                                    <span className="material-symbols-outlined cw-icon-chevron">chevron_right</span>
                                </div>
                                <div className="cw-method-item">
                                    <div className="cw-method-info">
                                        <div className="cw-method-icon blue">
                                            <span className="material-symbols-outlined">credit_card</span>
                                        </div>
                                        <span className="cw-method-name">Bank Card</span>
                                    </div>
                                    <span className="material-symbols-outlined cw-icon-chevron">chevron_right</span>
                                </div>
                            </div>
                        </div>
                        <div className="cw-secure-badge">
                            <span className="material-symbols-outlined">shield</span>
                            Secure PCI-DSS Payments
                        </div>
                    </div>
                </div>

                {/* Spending Insights & Invoices Asymmetric Section */}
                <div className="cw-bento-grid split-insights">
                    {/* Spending Chart Simulation */}
                    <div className="cw-chart-card">
                        <div className="cw-card-header-flex">
                            <div>
                                <h3 className="cw-card-title">Monthly Spending</h3>
                                <p className="cw-card-subtitle italic text-slate-500">Financial velocity tracking</p>
                            </div>
                            <select className="cw-select-filter">
                                <option>Last 6 Months</option>
                                <option>This Year</option>
                            </select>
                        </div>
                        
                        <div className="cw-chart-simulation">
                            {spending.buckets.map((b, i) => (
                                <div key={b.key} className={`cw-bar-group ${i === spending.buckets.length - 1 ? 'focus' : ''}`}>
                                    <div
                                        className="cw-bar"
                                        style={{ height: `${Math.max(8, Math.round((b.total / spending.max) * 160))}px` }}
                                        title={formatXAF(b.total)}
                                    ></div>
                                    <span className="cw-bar-label">{b.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Saved Invoices Section */}
                    <div className="cw-invoices-card">
                        <div className="cw-card-header-flex mb-6">
                            <h3 className="cw-card-title">Factures</h3>
                            <button className="cw-btn-link text-primary hover:underline" onClick={() => navigate('/espace-client/factures')}>Voir tout</button>
                        </div>
                        <div className="cw-invoices-list">
                            {recentInvoices.length > 0 ? recentInvoices.map(inv => (
                                <div className="cw-invoice-item" key={inv.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/espace-client/factures')}>
                                    <div className="cw-invoice-icon" style={{ background: inv.status === 'paid' ? '#f0fdf4' : '#fef3c7', color: inv.status === 'paid' ? '#16a34a' : '#d97706' }}>
                                        <span className="material-symbols-outlined">{inv.status === 'paid' ? 'check_circle' : 'schedule'}</span>
                                    </div>
                                    <div className="cw-invoice-info">
                                        <div className="cw-invoice-id">{inv.reference}</div>
                                        <div className="cw-invoice-metatext-slate-400">
                                            {new Date(inv.created_at).toLocaleDateString('fr-FR')} • {Number(inv.amount).toLocaleString()} XAF
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: '0.7rem', fontWeight: 600, padding: '3px 8px',
                                        borderRadius: '10px', textTransform: 'uppercase',
                                        background: inv.status === 'paid' ? '#dcfce7' : '#fef3c7',
                                        color: inv.status === 'paid' ? '#16a34a' : '#d97706'
                                    }}>{inv.status === 'paid' ? 'Payee' : 'Non payee'}</span>
                                </div>
                            )) : (
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center', padding: '16px 0' }}>
                                    Aucune facture. Elles apparaitront ici apres acceptation d'un devis.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Transaction Ledger */}
                <div className="cw-ledger-card rounded-3xl overflow-hidden mt-6">
                    <div className="cw-ledger-header flex items-center justify-between p-6 border-b border-slate-100">
                        <div>
                            <h3 className="cw-card-title">Transaction Ledger</h3>
                            <p className="cw-card-subtitle text-slate-500">History of all financial movements</p>
                        </div>
                        <div className="cw-ledger-filters flex gap-2">
                            <button className={`cw-filter-pill ${ledgerFilter === 'all' ? 'active' : ''}`} onClick={() => { setLedgerFilter('all'); setVisibleTx(8); }}>All</button>
                            <button className={`cw-filter-pill ${ledgerFilter === 'holds' ? 'active' : ''}`} onClick={() => { setLedgerFilter('holds'); setVisibleTx(8); }}>Holds</button>
                            <button className={`cw-filter-pill ${ledgerFilter === 'payments' ? 'active' : ''}`} onClick={() => { setLedgerFilter('payments'); setVisibleTx(8); }}>Payments</button>
                        </div>
                    </div>

                    <div className="cw-table-wrapper overflow-x-auto w-full">
                        <table className="cw-ledger-table w-full text-left">
                            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Transaction Details</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {txLoading ? (
                                    <tr><td colSpan={4}><Loading label="Chargement des mouvements…" /></td></tr>
                                ) : txError ? (
                                    <tr><td colSpan={4}><ErrorState onRetry={() => txRefetch()} /></td></tr>
                                ) : filteredTx.length === 0 ? (
                                    <tr><td colSpan={4}><EmptyState icon="account_balance_wallet" title="Aucun mouvement" message="Vos transactions apparaîtront ici." /></td></tr>
                                ) : (
                                    shownTx.map((t) => {
                                        const credit = Number(t.amount) >= 0;
                                        const label = String(t.meta?.source ?? t.type ?? 'Transaction').replace(/_/g, ' ');
                                        return (
                                            <tr key={t.id} className="cw-ledger-row hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="cw-td-flex">
                                                        <div className="cw-td-icon bg-surface-container">
                                                            <span className="material-symbols-outlined text-slate-500">{credit ? 'south_west' : 'north_east'}</span>
                                                        </div>
                                                        <div>
                                                            <div className="cw-td-title font-bold text-sm" style={{ textTransform: 'capitalize' }}>{label}</div>
                                                            <div className="cw-td-meta text-xs text-slate-400">{formatDateTime(t.created_at)}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-medium text-slate-600" style={{ textTransform: 'capitalize' }}>{t.type}</td>
                                                <td className="px-6 py-4"><span className="cw-status-badge green bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">OK</span></td>
                                                <td className={`px-6 py-4 text-right cw-td-amount font-bold ${credit ? 'text-tertiary-container' : 'text-slate-800'}`}>
                                                    {credit ? '+ ' : '- '}{formatXAF(Math.abs(Number(t.amount)))}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    {shownTx.length < filteredTx.length && (
                        <div className="cw-ledger-footer p-4 bg-slate-50 text-center">
                            <button className="cw-btn-load-more text-xs font-bold text-slate-500 hover:text-primary transition-colors" onClick={() => setVisibleTx((v) => v + 8)}>Load more transactions...</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Float Action Add Funds (Mobile mainly) */}
            <div className="cw-content-area"><CurrencyWallets /></div>

            <button className="cw-mobile-fab md:hidden fixed right-6 bottom-24 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50" onClick={() => setShowRechargeModal(true)}>
                <span className="material-symbols-outlined">add</span>
            </button>

            {/* Recharge Modal overlay (Retained & Stylized via Glassmorphism) */}
            {showRechargeModal && (
                <div className="cw-modal-backdrop fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={resetRecharge}>
                    <div className="cw-modal-content bg-white/95 backdrop-blur-md rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <button className="cw-modal-close absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full transition-all text-slate-500" onClick={resetRecharge}>
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        {rechargeStep === 1 && (
                            <div className="cw-recharge-step">
                                <h2 className="font-headline text-2xl font-bold text-primary mb-2">Recharger mon compte</h2>
                                <p className="text-sm text-slate-500 mb-8">Choisissez votre méthode de paiement sécurisée.</p>

                                <div className="cw-payment-methods flex gap-4 mb-8">
                                    <div 
                                        className={`cw-pm-card flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedMethod === 'om' ? 'border-orange-500 bg-orange-50' : 'border-slate-100 hover:border-slate-300'}`}
                                        onClick={() => setSelectedMethod('om')}
                                    >
                                        <div className="cw-pm-logo w-12 h-12 bg-orange-100 text-orange-600 font-bold rounded-xl flex items-center justify-center">OM</div>
                                        <span className="text-xs font-bold text-slate-700">Orange</span>
                                    </div>
                                    <div 
                                        className={`cw-pm-card flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedMethod === 'momo' ? 'border-yellow-500 bg-yellow-50' : 'border-slate-100 hover:border-slate-300'}`}
                                        onClick={() => setSelectedMethod('momo')}
                                    >
                                        <div className="cw-pm-logo w-12 h-12 bg-yellow-100 text-yellow-600 font-bold rounded-xl flex items-center justify-center">MOMO</div>
                                        <span className="text-xs font-bold text-slate-700">MTN MoMo</span>
                                    </div>
                                    <div 
                                        className={`cw-pm-card flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-300'}`}
                                        onClick={() => setSelectedMethod('card')}
                                    >
                                        <div className="cw-pm-logo w-12 h-12 bg-blue-100 text-blue-600 font-bold rounded-xl flex items-center justify-center"><span className="material-symbols-outlined">credit_card</span></div>
                                        <span className="text-xs font-bold text-slate-700">Carte</span>
                                    </div>
                                </div>

                                <div className="cw-amount-input mb-6">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Montant à recharger (FCFA)</label>
                                    <input
                                        type="number"
                                        placeholder="Ex: 50000"
                                        value={rechargeAmount}
                                        onChange={(e) => setRechargeAmount(e.target.value)}
                                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-semibold text-lg text-primary focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>

                                {(selectedMethod === 'momo' || selectedMethod === 'om') && (
                                    <div className="cw-phone-input mb-6">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Numéro de téléphone</label>
                                        <input
                                            type="tel"
                                            placeholder="Ex: +237670000000"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-semibold text-lg text-primary focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                )}

                                {rechargeError && (
                                    <p className="text-sm text-red-500 font-semibold mb-4">{rechargeError}</p>
                                )}

                                <button
                                    className={`w-full py-4 rounded-full font-bold transition-all ${selectedMethod && !submitting ? 'bg-primary text-white hover:bg-secondary shadow-lg hover:shadow-xl' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                                    disabled={!selectedMethod || submitting}
                                    onClick={startRecharge}
                                >
                                    {submitting ? 'Initiation…' : 'Continuer vers le paiement'}
                                </button>
                            </div>
                        )}

                        {rechargeStep === 2 && (
                            <div className="cw-recharge-step flex flex-col items-center text-center py-4">
                                <div className="cw-process-icon w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                    <span className="material-symbols-outlined text-4xl">{selectedMethod === 'card' ? 'credit_card' : 'smartphone'}</span>
                                </div>
                                <h2 className="font-headline text-2xl font-bold text-primary mb-2">
                                    {selectedMethod === 'card' ? 'Paiement par carte' : 'Validation Mobile'}
                                </h2>
                                <p className="text-sm text-slate-500 mb-8 max-w-[250px] mx-auto">
                                    {selectedMethod === 'card'
                                        ? 'Suivez les instructions de votre banque pour confirmer le paiement.'
                                        : 'Un menu USSD a été envoyé sur votre téléphone. Composez votre code secret pour valider le rechargement.'}
                                </p>
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                                    <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                                    En attente de confirmation…
                                </div>

                                {/* DEV uniquement : le webhook NotchPay ne peut pas joindre localhost,
                                    donc on simule la confirmation pour tester le crédit du wallet. */}
                                {import.meta.env.DEV && (
                                    <button
                                        className="mt-6 px-4 py-2 rounded-full border border-dashed border-amber-400 text-amber-600 text-xs font-bold hover:bg-amber-50 transition-all"
                                        onClick={devConfirmPayment}
                                    >
                                        [DEV] Simuler la confirmation du paiement
                                    </button>
                                )}
                            </div>
                        )}

                        {rechargeStep === 3 && (
                            <div className="cw-recharge-step flex flex-col items-center text-center py-4">
                                <div className="cw-success-icon w-20 h-20 bg-tertiary-fixed text-on-tertiary-fixed rounded-full flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-4xl">check</span>
                                </div>
                                <h2 className="font-headline text-2xl font-bold text-primary mb-2">Paiement réussi !</h2>
                                <p className="text-sm text-slate-500 mb-8 max-w-[250px] mx-auto">Votre portefeuille a été crédité avec succès. Les fonds sont disponibles immédiatement.</p>
                                <button className="w-full bg-primary text-white font-bold py-4 rounded-full shadow-lg hover:bg-secondary transition-all" onClick={resetRecharge}>
                                    Fermer et retourner au wallet
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientWallet;
