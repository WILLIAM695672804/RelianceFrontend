import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import './Wallet.css';
import './Withdrawal.css';
import { financeService } from '../../services/financeService';
import { Loading, EmptyState, ErrorState } from '../../components/common/AsyncStates';
import CurrencyWallets from '../../components/finance/CurrencyWallets';
import { formatXAF, formatNumber, formatDate } from '../../utils/format';

const Wallet: React.FC = () => {
    const qc = useQueryClient();
    const navigate = useNavigate();

    const { data: walletRes } = useQuery({ queryKey: ['wallet'], queryFn: () => financeService.getWallet() });
    const wallet: any = walletRes?.data?.data ?? walletRes?.data;
    const balance: number = Number(wallet?.available_balance ?? wallet?.balance ?? 0);

    const { data: txRes, isLoading: txLoading, isError: txError, refetch: txRefetch } =
        useQuery({ queryKey: ['wallet-transactions'], queryFn: () => financeService.getTransactions(1) });
    const transactions: any[] = txRes?.data?.data ?? [];

    // Agrégation des crédits par mois (6 derniers mois) depuis les vraies transactions.
    const monthly = useMemo(() => {
        const now = new Date();
        const buckets = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
            return { key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString('fr-FR', { month: 'short' }), total: 0 };
        });
        transactions.forEach((t) => {
            const d = new Date(t.created_at);
            const b = buckets.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
            if (b && Number(t.amount) > 0) b.total += Number(t.amount);
        });
        const max = Math.max(1, ...buckets.map((b) => b.total));
        return { buckets, max };
    }, [transactions]);

    const [showWithdraw, setShowWithdraw] = useState(false);
    const [amount, setAmount] = useState<string>('');
    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const methodCardStyle = (m: string): React.CSSProperties =>
        selectedMethod === m
            ? { border: '2px solid var(--tech-secondary, #6366f1)', boxShadow: '0 0 0 3px rgba(99,102,241,0.15)', cursor: 'pointer' }
            : { border: '2px solid transparent', cursor: 'pointer' };

    const closeWithdraw = () => {
        setShowWithdraw(false);
        setAmount(''); setSelectedMethod(''); setPhoneNumber('');
        setError(''); setSuccess(false); setSubmitting(false);
    };

    const handleWithdraw = async () => {
        setError('');
        const amt = Number(amount);
        if (!amt || amt < 500) { setError('Montant minimum : 500 FCFA'); return; }
        if (!selectedMethod) { setError('Choisissez un moyen de paiement'); return; }
        if ((selectedMethod === 'momo' || selectedMethod === 'om') && !phoneNumber.trim()) {
            setError('Numéro de téléphone requis pour le Mobile Money'); return;
        }
        setSubmitting(true);
        try {
            await financeService.withdraw({
                amount: amt,
                method: selectedMethod,
                phone_number: phoneNumber.trim() || undefined,
            });
            setSuccess(true);
            qc.invalidateQueries({ queryKey: ['wallet'] });
            qc.invalidateQueries({ queryKey: ['wallet-transactions'] });
        } catch (e: any) {
            setError(e?.response?.data?.message || 'Échec de la demande de retrait');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="tech-wallet-page">
            {/* Header Section */}
            <header className="tech-wallet-header">
                <div>
                    <h1>Wallet &amp; Earnings</h1>
                    <p>Comprehensive financial oversight for your mission-based professional services.</p>
                </div>
                <div className="tech-wallet-actions">
                    <button className="tech-btn-statement" onClick={() => navigate('/technicien/wallet/historique')}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>download</span>
                        Statement
                    </button>
                    <button 
                        className="tech-btn-withdraw"
                        onClick={() => setShowWithdraw(true)}
                    >
                        <span className="material-symbols-outlined">payments</span>
                        Withdraw
                    </button>
                </div>
            </header>

            {/* Bento Grid Layout */}
            <div className="tech-wallet-grid">
                {/* Main Balance Card */}
                <div className="tech-balance-card group">
                    <div className="tech-balance-content z-10 relative">
                        <span className="tech-balance-label">Solde disponible</span>
                        <h2 className="tech-balance-total flex items-baseline gap-2">
                            {formatNumber(balance)} <span>XAF</span>
                        </h2>
                        <div className="tech-balance-details space-y-4">
                            <div className="tech-balance-row">
                                <span className="text-sm font-medium">Solde total</span>
                                <span className="font-semibold text-lg">{formatXAF(wallet?.balance ?? balance)}</span>
                            </div>
                            <div className="tech-balance-row">
                                <span className="text-sm font-medium">Réservé (escrow)</span>
                                <span className="font-semibold text-lg">{formatXAF(wallet?.held_amount ?? 0)}</span>
                            </div>
                        </div>
                    </div>
                    {/* Abstract Background Detail */}
                    <div className="tech-balance-bg-blur"></div>
                </div>

                {/* Earnings Chart Container */}
                <div className="tech-chart-card">
                    <div className="tech-chart-header">
                        <div>
                            <h3>Monthly Earnings Trend</h3>
                            <p>Performance metrics for the current fiscal quarter</p>
                        </div>
                        <div className="tech-chart-badge">
                            <span className="material-symbols-outlined" style={{ fontSize: '0.75rem' }}>payments</span>
                            {formatXAF(monthly.buckets[monthly.buckets.length - 1].total)}
                        </div>
                    </div>

                    {/* Barres calculées à partir des crédits réels par mois */}
                    <div className="tech-chart-bars" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.5rem', padding: '0 0.5rem' }}>
                        {monthly.buckets.map((b, i) => (
                            <div
                                key={b.key}
                                className={`tech-chart-bar ${i === monthly.buckets.length - 1 ? 'tech-chart-bar-active' : ''}`}
                                style={{ height: `${Math.max(6, Math.round((b.total / monthly.max) * 100))}%`, position: 'relative' }}
                            >
                                <div className="tech-bar-tooltip">{b.label}: {formatXAF(b.total)}</div>
                                {i === monthly.buckets.length - 1 && <div className="tech-bar-inner"></div>}
                            </div>
                        ))}
                    </div>
                    <div className="tech-chart-labels">
                        {monthly.buckets.map((b) => <span key={b.key}>{b.label}</span>)}
                    </div>
                </div>
            </div>

            {/* Transaction Ledger Section */}
            <section className="tech-transactions-section">
                <div className="tech-trans-header">
                    <h3>Historical Audit Ledger</h3>
                    <select className="tech-trans-select">
                        <option>All Statuses</option>
                        <option>Paid</option>
                        <option>Pending</option>
                        <option>Refunded</option>
                    </select>
                </div>

                {/* Transaction List */}
                <div className="tech-trans-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {txLoading ? (
                        <Loading label="Chargement des transactions…" />
                    ) : txError ? (
                        <ErrorState onRetry={() => txRefetch()} />
                    ) : transactions.length === 0 ? (
                        <EmptyState icon="receipt_long" title="Aucune transaction" message="Vos mouvements apparaîtront ici." />
                    ) : (
                        transactions.map((t) => {
                            const credit = Number(t.amount) >= 0;
                            const label = String(t.meta?.source ?? t.type ?? 'Transaction').replace(/_/g, ' ');
                            return (
                                <div key={t.id} className="tech-trans-item">
                                    <div className="tech-trans-main">
                                        <div className="tech-trans-icon" style={{ backgroundColor: credit ? 'rgba(0, 63, 35, 0.1)' : 'rgba(186, 26, 26, 0.1)', color: credit ? 'var(--tech-tertiary)' : 'var(--tech-error)' }}>
                                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{credit ? 'south_west' : 'north_east'}</span>
                                        </div>
                                        <div>
                                            <p className="tech-trans-ref" style={{ textTransform: 'capitalize' }}>{label}</p>
                                            <p className="tech-trans-desc">{t.meta?.method ? `via ${t.meta.method}` : '—'}</p>
                                        </div>
                                    </div>
                                    <div className="tech-trans-col" style={{ textAlign: 'right' }}>
                                        <p className="tech-trans-col-label">Date</p>
                                        <p className="tech-trans-col-value" style={{ fontWeight: 600 }}>{formatDate(t.created_at)}</p>
                                    </div>
                                    <div className="tech-trans-col" style={{ textAlign: 'right' }}>
                                        <p className="tech-trans-col-label">Montant</p>
                                        <p className="tech-trans-col-value" style={{ fontWeight: 700, fontSize: '1.125rem', color: credit ? undefined : 'var(--tech-error)' }}>
                                            {credit ? '' : '- '}{formatXAF(Math.abs(Number(t.amount)))}
                                        </p>
                                    </div>
                                    <div className="tech-trans-status">
                                        <span className="status-badge" style={{ backgroundColor: credit ? 'var(--tech-tertiary-container)' : 'rgba(186, 26, 26, 0.1)', color: credit ? 'var(--tech-on-tertiary-container)' : 'var(--tech-error)' }}>{credit ? 'Crédit' : 'Débit'}</span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {transactions.length > 0 && (
                    <div className="tech-trans-load-more">
                        <Link to="/technicien/wallet/historique" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Voir tout l'historique
                            <span className="material-symbols-outlined">expand_more</span>
                        </Link>
                    </div>
                )}
            </section>

            <CurrencyWallets />

            {/* ===== Withdrawal Bottom Sheet Modal ===== */}
            <div 
                className={`tech-withdraw-backdrop ${showWithdraw ? 'open' : ''}`}
                onClick={closeWithdraw}
            ></div>
            <div className={`tech-withdraw-sheet ${showWithdraw ? 'open' : ''}`}>
                {/* Handle bar */}
                <div className="tech-sheet-handle-bar">
                    <div className="tech-sheet-handle"></div>
                </div>
                {/* Close button */}
                <button 
                    className="tech-sheet-close"
                    onClick={closeWithdraw}
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                {/* Sheet Content — Withdrawal Flow */}
                <div className="tech-sheet-content">
                    <header className="tech-withdraw-header" style={{ position: 'relative', zIndex: 'auto' }}>
                        <h1>Fund Withdrawal</h1>
                        <p>Securely transfer your digital assets to your preferred mobile wallet or bank account.</p>
                    </header>

                    <div className="tech-withdraw-grid">
                        <div className="tech-withdraw-main">
                            {/* Step 1: Amount */}
                            <section className="tech-step-card tech-step-active">
                                <div className="tech-step-header">
                                    <span className="tech-step-number bg-secondary">1</span>
                                    <h2>Select Amount</h2>
                                </div>
                                <div className="tech-step-content">
                                    <div className="tech-amount-input-group">
                                        <label>Withdrawal Amount</label>
                                        <div className="tech-amount-field">
                                            <span className="tech-currency-symbol">FCFA</span>
                                            <input 
                                                type="number" 
                                                placeholder="0.00" 
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="tech-quick-amounts">
                                        <button type="button" onClick={() => setAmount(String(Math.round(balance * 0.25)))}>25%</button>
                                        <button type="button" onClick={() => setAmount(String(Math.round(balance * 0.50)))}>50%</button>
                                        <button type="button" onClick={() => setAmount(String(Math.round(balance * 0.75)))}>75%</button>
                                        <button type="button" className="tech-amt-max" onClick={() => setAmount(String(Math.round(balance)))}>100%</button>
                                    </div>
                                </div>
                            </section>

                            {/* Step 2: Method */}
                            <section className="tech-step-card">
                                <div className="tech-step-header">
                                    <span className="tech-step-number tech-step-inactive">2</span>
                                    <h2>Select Method</h2>
                                </div>
                                <div className="tech-methods-grid">
                                    <div className="tech-method-card" style={methodCardStyle('momo')} onClick={() => setSelectedMethod('momo')}>
                                        <div className="tech-method-icon" style={{backgroundColor: '#FFCC00'}}>
                                            <span className="material-symbols-outlined" style={{ color: '#000' }}>smartphone</span>
                                        </div>
                                        <span className="tech-method-title">MTN Mobile Money</span>
                                        <span className="tech-method-desc">Instant Settlement</span>
                                    </div>
                                    <div className="tech-method-card" style={methodCardStyle('om')} onClick={() => setSelectedMethod('om')}>
                                        <div className="tech-method-icon" style={{backgroundColor: '#FF6600'}}>
                                            <span className="material-symbols-outlined" style={{ color: '#fff' }}>account_balance_wallet</span>
                                        </div>
                                        <span className="tech-method-title">Orange Money</span>
                                        <span className="tech-method-desc">Instant Settlement</span>
                                    </div>
                                    <div className="tech-method-card" style={methodCardStyle('bank_transfer')} onClick={() => setSelectedMethod('bank_transfer')}>
                                        <div className="tech-method-icon" style={{ backgroundColor: 'var(--tech-primary-container)' }}>
                                            <span className="material-symbols-outlined" style={{ color: 'var(--tech-on-primary-container)' }}>account_balance</span>
                                        </div>
                                        <span className="tech-method-title">Bank Transfer</span>
                                        <span className="tech-method-desc">1-2 Business Days</span>
                                    </div>
                                </div>

                                {(selectedMethod === 'momo' || selectedMethod === 'om') && (
                                    <div className="tech-amount-input-group" style={{ marginTop: '1rem' }}>
                                        <label>Numéro de téléphone</label>
                                        <div className="tech-amount-field">
                                            <input
                                                type="tel"
                                                placeholder="Ex: +237670000000"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Step 3: Review */}
                            <section className="tech-step-card tech-step-disabled">
                                <div className="tech-step-header">
                                    <span className="tech-step-number tech-step-inactive">3</span>
                                    <h2>Review &amp; Confirm</h2>
                                </div>
                                <div className="tech-review-info">
                                    <span className="material-symbols-outlined">info</span>
                                    <p>Vérifiez le montant et le moyen de paiement. La demande est soumise à validation par un administrateur.</p>
                                </div>
                                {error && (
                                    <p style={{ color: '#dc2626', fontWeight: 600, fontSize: '0.85rem', margin: '0 0 0.75rem' }}>{error}</p>
                                )}
                                {success ? (
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ color: '#16a34a', fontWeight: 700, marginBottom: '0.75rem' }}>
                                            Demande de retrait enregistrée ✓
                                        </p>
                                        <button className="tech-btn-confirm" onClick={closeWithdraw}>Fermer</button>
                                    </div>
                                ) : (
                                    <button
                                        className="tech-btn-confirm"
                                        disabled={!amount || !selectedMethod || submitting}
                                        onClick={handleWithdraw}
                                    >
                                        {submitting ? 'Envoi…' : 'Confirm Withdrawal'}
                                    </button>
                                )}
                            </section>
                        </div>

                        <div className="tech-withdraw-sidebar">
                            <div className="tech-summary-card">
                                <h3>Transaction Summary</h3>
                                <div className="tech-summary-lines">
                                    <div className="tech-summary-line">
                                        <span className="tech-sum-label">Solde disponible</span>
                                        <span className="tech-sum-value" style={{ color: 'var(--tech-primary)' }}>{formatXAF(balance)}</span>
                                    </div>
                                    <div className="tech-summary-line">
                                        <span className="tech-sum-label">Montant du retrait</span>
                                        <span className="tech-sum-value" style={{ color: 'var(--tech-primary)' }}>{formatXAF(amount || 0)}</span>
                                    </div>
                                    <div className="tech-summary-line">
                                        <span className="tech-sum-label">Processing Fee</span>
                                        <span className="tech-sum-value" style={{ color: 'var(--tech-primary)' }}>{formatXAF(0)}</span>
                                    </div>
                                    <div className="tech-summary-total">
                                        <span className="tech-sum-label-bold">Vous recevrez</span>
                                        <span className="tech-sum-total" style={{ color: 'var(--tech-secondary)' }}>{formatXAF(amount || 0)}</span>
                                    </div>
                                </div>

                                <div className="tech-secure-box">
                                    <div className="tech-secure-header">
                                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
                                        <span>Secure Withdrawal</span>
                                    </div>
                                    <p>This transaction is protected by 256-bit encryption.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
