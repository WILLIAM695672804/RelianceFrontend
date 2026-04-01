import React, { useState } from 'react';
import './Wallet.css';
import './Withdrawal.css';

const Wallet: React.FC = () => {
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [amount, setAmount] = useState<string>('');

    return (
        <div className="tech-wallet-page">
            {/* Header Section */}
            <header className="tech-wallet-header">
                <div>
                    <h1>Wallet &amp; Earnings</h1>
                    <p>Comprehensive financial oversight for your mission-based professional services.</p>
                </div>
                <div className="tech-wallet-actions">
                    <button className="tech-btn-statement">
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
                        <span className="tech-balance-label">Total Liquidity</span>
                        <h2 className="tech-balance-total flex items-baseline gap-2">
                            2,450,000 <span>XAF</span>
                        </h2>
                        <div className="tech-balance-details space-y-4">
                            <div className="tech-balance-row">
                                <span className="text-sm font-medium">EUR Balance</span>
                                <span className="font-semibold text-lg">€ 3,740.50</span>
                            </div>
                            <div className="tech-balance-row">
                                <span className="text-sm font-medium">USD Balance</span>
                                <span className="font-semibold text-lg">$ 4,025.00</span>
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
                            <span className="material-symbols-outlined" style={{ fontSize: '0.75rem' }}>trending_up</span>
                            +12.4%
                        </div>
                    </div>

                    {/* Simple CSS Chart Visualization */}
                    <div className="tech-chart-bars" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.5rem', padding: '0 0.5rem' }}>
                        <div className="tech-chart-bar" style={{ height: '40%', position: 'relative' }}>
                            <div className="tech-bar-tooltip">Jan: 850k</div>
                        </div>
                        <div className="tech-chart-bar" style={{ height: '55%', position: 'relative' }}>
                            <div className="tech-bar-tooltip">Feb: 1.1M</div>
                        </div>
                        <div className="tech-chart-bar" style={{ height: '45%', position: 'relative' }}>
                            <div className="tech-bar-tooltip">Mar: 920k</div>
                        </div>
                        <div className="tech-chart-bar tech-chart-bar-highlight" style={{ height: '75%', position: 'relative' }}>
                            <div className="tech-bar-tooltip">Apr: 1.5M</div>
                        </div>
                        <div className="tech-chart-bar tech-chart-bar-active" style={{ height: '90%', position: 'relative' }}>
                            <div className="tech-bar-tooltip">May: 1.8M</div>
                            <div className="tech-bar-inner"></div>
                        </div>
                        <div className="tech-chart-bar" style={{ height: '65%', position: 'relative' }}>
                            <div className="tech-bar-tooltip">Jun: 1.3M</div>
                        </div>
                    </div>
                    <div className="tech-chart-labels">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
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
                    {/* Transaction Item 1 */}
                    <div className="tech-trans-item">
                        <div className="tech-trans-main">
                            <div className="tech-trans-icon" style={{ backgroundColor: 'rgba(0, 63, 35, 0.1)', color: 'var(--tech-tertiary)' }}>
                                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                            </div>
                            <div>
                                <p className="tech-trans-ref">Mission Ref: #MS-99281</p>
                                <p className="tech-trans-desc">System Integration &amp; Load Testing</p>
                            </div>
                        </div>
                        <div className="tech-trans-col" style={{ textAlign: 'right' }}>
                            <p className="tech-trans-col-label">Date</p>
                            <p className="tech-trans-col-value" style={{ fontWeight: 600 }}>Oct 24, 2023</p>
                        </div>
                        <div className="tech-trans-col" style={{ textAlign: 'right' }}>
                            <p className="tech-trans-col-label">Amount</p>
                            <p className="tech-trans-col-value" style={{ fontWeight: 700, fontSize: '1.125rem' }}>450,000 XAF</p>
                        </div>
                        <div className="tech-trans-status">
                            <span className="status-badge" style={{ backgroundColor: 'var(--tech-tertiary-container)', color: 'var(--tech-on-tertiary-container)' }}>Paid</span>
                        </div>
                    </div>

                    {/* Transaction Item 2 */}
                    <div className="tech-trans-item">
                        <div className="tech-trans-main">
                            <div className="tech-trans-icon" style={{ backgroundColor: 'rgba(25, 96, 163, 0.1)', color: 'var(--tech-secondary)' }}>
                                <span className="material-symbols-outlined">schedule</span>
                            </div>
                            <div>
                                <p className="tech-trans-ref">Mission Ref: #MS-99295</p>
                                <p className="tech-trans-desc">Infrastructure Maintenance</p>
                            </div>
                        </div>
                        <div className="tech-trans-col" style={{ textAlign: 'right' }}>
                            <p className="tech-trans-col-label">Date</p>
                            <p className="tech-trans-col-value" style={{ fontWeight: 600 }}>Oct 27, 2023</p>
                        </div>
                        <div className="tech-trans-col" style={{ textAlign: 'right' }}>
                            <p className="tech-trans-col-label">Amount</p>
                            <p className="tech-trans-col-value" style={{ fontWeight: 700, fontSize: '1.125rem' }}>125,000 XAF</p>
                        </div>
                        <div className="tech-trans-status">
                            <span className="status-badge" style={{ backgroundColor: 'rgba(25, 96, 163, 0.2)', color: 'var(--tech-secondary)' }}>Pending</span>
                        </div>
                    </div>

                    {/* Transaction Item 3 */}
                    <div className="tech-trans-item">
                        <div className="tech-trans-main">
                            <div className="tech-trans-icon" style={{ backgroundColor: 'rgba(186, 26, 26, 0.1)', color: 'var(--tech-error)' }}>
                                <span className="material-symbols-outlined">undo</span>
                            </div>
                            <div>
                                <p className="tech-trans-ref">Mission Ref: #MS-99104</p>
                                <p className="tech-trans-desc">Equipment Calibration</p>
                            </div>
                        </div>
                        <div className="tech-trans-col" style={{ textAlign: 'right' }}>
                            <p className="tech-trans-col-label">Date</p>
                            <p className="tech-trans-col-value" style={{ fontWeight: 600 }}>Oct 15, 2023</p>
                        </div>
                        <div className="tech-trans-col" style={{ textAlign: 'right' }}>
                            <p className="tech-trans-col-label">Amount</p>
                            <p className="tech-trans-col-value" style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--tech-error)' }}>- 85,000 XAF</p>
                        </div>
                        <div className="tech-trans-status">
                            <span className="status-badge" style={{ backgroundColor: 'rgba(186, 26, 26, 0.1)', color: 'var(--tech-error)' }}>Refunded</span>
                        </div>
                    </div>

                    {/* Transaction Item 4 */}
                    <div className="tech-trans-item">
                        <div className="tech-trans-main">
                            <div className="tech-trans-icon" style={{ backgroundColor: 'rgba(0, 63, 35, 0.1)', color: 'var(--tech-tertiary)' }}>
                                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
                            </div>
                            <div>
                                <p className="tech-trans-ref">Mission Ref: #MS-98950</p>
                                <p className="tech-trans-desc">Security Audit Tier 1</p>
                            </div>
                        </div>
                        <div className="tech-trans-col" style={{ textAlign: 'right' }}>
                            <p className="tech-trans-col-label">Date</p>
                            <p className="tech-trans-col-value" style={{ fontWeight: 600 }}>Oct 10, 2023</p>
                        </div>
                        <div className="tech-trans-col" style={{ textAlign: 'right' }}>
                            <p className="tech-trans-col-label">Amount</p>
                            <p className="tech-trans-col-value" style={{ fontWeight: 700, fontSize: '1.125rem' }}>980,000 XAF</p>
                        </div>
                        <div className="tech-trans-status">
                            <span className="status-badge" style={{ backgroundColor: 'var(--tech-tertiary-container)', color: 'var(--tech-on-tertiary-container)' }}>Paid</span>
                        </div>
                    </div>
                </div>

                <div className="tech-trans-load-more">
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Load More Transactions
                        <span className="material-symbols-outlined">expand_more</span>
                    </button>
                </div>
            </section>

            {/* ===== Withdrawal Bottom Sheet Modal ===== */}
            <div 
                className={`tech-withdraw-backdrop ${showWithdraw ? 'open' : ''}`}
                onClick={() => setShowWithdraw(false)}
            ></div>
            <div className={`tech-withdraw-sheet ${showWithdraw ? 'open' : ''}`}>
                {/* Handle bar */}
                <div className="tech-sheet-handle-bar">
                    <div className="tech-sheet-handle"></div>
                </div>
                {/* Close button */}
                <button 
                    className="tech-sheet-close"
                    onClick={() => setShowWithdraw(false)}
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
                                            <span className="tech-currency-symbol">$</span>
                                            <input 
                                                type="number" 
                                                placeholder="0.00" 
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="tech-quick-amounts">
                                        <button>25%</button>
                                        <button>50%</button>
                                        <button>75%</button>
                                        <button className="tech-amt-max">100%</button>
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
                                    <div className="tech-method-card">
                                        <div className="tech-method-icon" style={{backgroundColor: '#FFCC00'}}>
                                            <span className="material-symbols-outlined" style={{ color: '#000' }}>smartphone</span>
                                        </div>
                                        <span className="tech-method-title">MTN Mobile Money</span>
                                        <span className="tech-method-desc">Instant Settlement</span>
                                    </div>
                                    <div className="tech-method-card">
                                        <div className="tech-method-icon" style={{backgroundColor: '#FF6600'}}>
                                            <span className="material-symbols-outlined" style={{ color: '#fff' }}>account_balance_wallet</span>
                                        </div>
                                        <span className="tech-method-title">Orange Money</span>
                                        <span className="tech-method-desc">Instant Settlement</span>
                                    </div>
                                    <div className="tech-method-card">
                                        <div className="tech-method-icon" style={{ backgroundColor: 'var(--tech-primary-container)' }}>
                                            <span className="material-symbols-outlined" style={{ color: 'var(--tech-on-primary-container)' }}>account_balance</span>
                                        </div>
                                        <span className="tech-method-title">Bank Transfer</span>
                                        <span className="tech-method-desc">1-2 Business Days</span>
                                    </div>
                                </div>
                            </section>

                            {/* Step 3: Review */}
                            <section className="tech-step-card tech-step-disabled">
                                <div className="tech-step-header">
                                    <span className="tech-step-number tech-step-inactive">3</span>
                                    <h2>Review &amp; Confirm</h2>
                                </div>
                                <div className="tech-review-info">
                                    <span className="material-symbols-outlined">info</span>
                                    <p>Review your transaction details carefully. Funds will be sent to the linked account ending in **8921.</p>
                                </div>
                                <button className="tech-btn-confirm" disabled>
                                    Confirm Withdrawal
                                </button>
                            </section>
                        </div>

                        <div className="tech-withdraw-sidebar">
                            <div className="tech-summary-card">
                                <h3>Transaction Summary</h3>
                                <div className="tech-summary-lines">
                                    <div className="tech-summary-line">
                                        <span className="tech-sum-label">Available Balance</span>
                                        <span className="tech-sum-value" style={{ color: 'var(--tech-primary)' }}>$12,450.00</span>
                                    </div>
                                    <div className="tech-summary-line">
                                        <span className="tech-sum-label">Withdrawal Amount</span>
                                        <span className="tech-sum-value" style={{ color: 'var(--tech-primary)' }}>${amount || '0.00'}</span>
                                    </div>
                                    <div className="tech-summary-line">
                                        <span className="tech-sum-label">Processing Fee</span>
                                        <span className="tech-sum-value" style={{ color: 'var(--tech-primary)' }}>$0.00</span>
                                    </div>
                                    <div className="tech-summary-total">
                                        <span className="tech-sum-label-bold">You will receive</span>
                                        <span className="tech-sum-total" style={{ color: 'var(--tech-secondary)' }}>${amount || '0.00'}</span>
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
