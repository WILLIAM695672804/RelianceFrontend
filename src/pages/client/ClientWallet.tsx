import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInvoices, type Invoice } from '../../services/operationsService';
import './ClientWallet.css';

interface Transaction {
    id: string;
    type: 'recharge' | 'escrow' | 'payment';
    amount: number;
    date: string;
    label: string;
}

const ClientWallet: React.FC = () => {
    const navigate = useNavigate();
    // Mock Data
    const [balance] = useState(4250500); // Available balance
    const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);

    // Recharge Modal States
    const [showRechargeModal, setShowRechargeModal] = useState(false);
    const [rechargeStep, setRechargeStep] = useState(1);
    const [selectedMethod, setSelectedMethod] = useState('');

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
    }, []);

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
                            
                            <div className="cw-equivalent-rates">
                                <div className="cw-rate-item">
                                    <p className="cw-rate-label">Equivalent EUR</p>
                                    <p className="cw-rate-value">€ 6,480.00</p>
                                </div>
                                <div className="cw-rate-item">
                                    <p className="cw-rate-label">Equivalent USD</p>
                                    <p className="cw-rate-value">$ 7,025.15</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="cw-balance-actions">
                            <button className="cw-btn-add-funds" onClick={() => setShowRechargeModal(true)}>
                                <span className="material-symbols-outlined">add_circle</span>
                                Add Funds
                            </button>
                            <button className="cw-btn-share text-primary bg-white hover-bg-slate-50">
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
                            <div className="cw-bar-group">
                                <div className="cw-bar h-12"></div>
                                <span className="cw-bar-label">Jan</span>
                            </div>
                            <div className="cw-bar-group">
                                <div className="cw-bar h-24"></div>
                                <span className="cw-bar-label">Feb</span>
                            </div>
                            <div className="cw-bar-group active">
                                <div className="cw-bar h-36"></div>
                                <span className="cw-bar-label">Mar</span>
                            </div>
                            <div className="cw-bar-group">
                                <div className="cw-bar h-16"></div>
                                <span className="cw-bar-label">Apr</span>
                            </div>
                            <div className="cw-bar-group">
                                <div className="cw-bar h-20"></div>
                                <span className="cw-bar-label">May</span>
                            </div>
                            <div className="cw-bar-group focus">
                                <div className="cw-bar h-40"></div>
                                <span className="cw-bar-label">Jun</span>
                            </div>
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
                            <button className="cw-filter-pill active">All</button>
                            <button className="cw-filter-pill">Holds</button>
                            <button className="cw-filter-pill">Payments</button>
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
                                <tr className="cw-ledger-row hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="cw-td-flex">
                                            <div className="cw-td-icon bg-surface-container">
                                                <span className="material-symbols-outlined text-slate-500">lock_clock</span>
                                            </div>
                                            <div>
                                                <div className="cw-td-title font-bold text-sm">Escrow: Logistics Task #42</div>
                                                <div className="cw-td-meta text-xs text-slate-400">June 21, 2024 • 14:20</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-600">Hold</td>
                                    <td className="px-6 py-4"><span className="cw-status-badge blue bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">ACTIVE</span></td>
                                    <td className="px-6 py-4 text-right cw-td-amount text-slate-800 font-bold">- 850,000 XAF</td>
                                </tr>
                                <tr className="cw-ledger-row hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="cw-td-flex">
                                            <div className="cw-td-icon deposit bg-tertiary-fixed-dim/20">
                                                <span className="material-symbols-outlined text-tertiary-container">account_balance</span>
                                            </div>
                                            <div>
                                                <div className="cw-td-title font-bold text-sm">Top-up via Orange Money</div>
                                                <div className="cw-td-meta text-xs text-slate-400">June 18, 2024 • 09:12</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-600">Deposit</td>
                                    <td className="px-6 py-4"><span className="cw-status-badge green bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">COMPLETED</span></td>
                                    <td className="px-6 py-4 text-right cw-td-amount text-tertiary-container font-bold">+ 1,200,000 XAF</td>
                                </tr>
                                <tr className="cw-ledger-row hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="cw-td-flex">
                                            <div className="cw-td-icon bg-surface-container">
                                                <span className="material-symbols-outlined text-slate-500">shopping_bag</span>
                                            </div>
                                            <div>
                                                <div className="cw-td-title font-bold text-sm">Marketplace Purchase: Server Rack</div>
                                                <div className="cw-td-meta text-xs text-slate-400">June 15, 2024 • 11:45</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-600">Payment</td>
                                    <td className="px-6 py-4"><span className="cw-status-badge green bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">COMPLETED</span></td>
                                    <td className="px-6 py-4 text-right cw-td-amount text-slate-800 font-bold">- 325,000 XAF</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="cw-ledger-footer p-4 bg-slate-50 text-center">
                        <button className="cw-btn-load-more text-xs font-bold text-slate-500 hover:text-primary transition-colors">Load more transactions...</button>
                    </div>
                </div>
            </div>

            {/* Float Action Add Funds (Mobile mainly) */}
            <button className="cw-mobile-fab md:hidden fixed right-6 bottom-24 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50" onClick={() => setShowRechargeModal(true)}>
                <span className="material-symbols-outlined">add</span>
            </button>

            {/* Recharge Modal overlay (Retained & Stylized via Glassmorphism) */}
            {showRechargeModal && (
                <div className="cw-modal-backdrop fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={() => {setShowRechargeModal(false); setRechargeStep(1)}}>
                    <div className="cw-modal-content bg-white/95 backdrop-blur-md rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <button className="cw-modal-close absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full transition-all text-slate-500" onClick={() => {setShowRechargeModal(false); setRechargeStep(1)}}>
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

                                <div className="cw-amount-input mb-8">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Montant à recharger (FCFA)</label>
                                    <input type="number" placeholder="Ex: 50000" className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 font-semibold text-lg text-primary focus:ring-2 focus:ring-primary/20" />
                                </div>

                                <button 
                                    className={`w-full py-4 rounded-full font-bold transition-all ${selectedMethod ? 'bg-primary text-white hover:bg-secondary shadow-lg hover:shadow-xl' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`} 
                                    disabled={!selectedMethod}
                                    onClick={() => setRechargeStep(2)}
                                >
                                    Continuer vers le paiement
                                </button>
                            </div>
                        )}

                        {rechargeStep === 2 && (
                            <div className="cw-recharge-step flex flex-col items-center text-center py-4">
                                <div className="cw-process-icon w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                    <span className="material-symbols-outlined text-4xl">smartphone</span>
                                </div>
                                <h2 className="font-headline text-2xl font-bold text-primary mb-2">Validation Mobile</h2>
                                <p className="text-sm text-slate-500 mb-8 max-w-[250px] mx-auto">Un menu USSD a été envoyé. Entrez votre code secret pour valider le rechargement sur votre mobile.</p>
                                
                                <button className="text-sm font-bold text-primary hover:underline" onClick={() => setRechargeStep(3)}>
                                    (Simuler le Succès de la transaction)
                                </button>
                            </div>
                        )}

                        {rechargeStep === 3 && (
                            <div className="cw-recharge-step flex flex-col items-center text-center py-4">
                                <div className="cw-success-icon w-20 h-20 bg-tertiary-fixed text-on-tertiary-fixed rounded-full flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-4xl">check</span>
                                </div>
                                <h2 className="font-headline text-2xl font-bold text-primary mb-2">Paiement réussi !</h2>
                                <p className="text-sm text-slate-500 mb-8 max-w-[250px] mx-auto">Votre portefeuille a été crédité avec succès. Les fonds sont disponibles immédiatement.</p>
                                <button className="w-full bg-primary text-white font-bold py-4 rounded-full shadow-lg hover:bg-secondary transition-all" onClick={() => {setShowRechargeModal(false); setRechargeStep(1)}}>
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
