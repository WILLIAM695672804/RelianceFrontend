import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Withdrawal.css';

const Withdrawal: React.FC = () => {
    const [amount, setAmount] = useState<string>('');
    const navigate = useNavigate();

    return (
        <div className="tech-withdraw-page">
            {/* Header Section */}
            <header className="tech-withdraw-header">
                <button 
                    style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.25rem', 
                        padding: 0, 
                        marginBottom: '0.5rem', 
                        color: 'var(--tech-on-surface-variant)', 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.875rem'
                    }}
                    onClick={() => navigate(-1)}
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>arrow_back</span>
                    Back to Wallet
                </button>
                <h1>Fund Withdrawal</h1>
                <p>Securely transfer your digital assets to your preferred mobile wallet or bank account.</p>
            </header>

            {/* Withdrawal Flow Layout (Asymmetric) */}
            <div className="tech-withdraw-grid">
                
                {/* Main Transaction Panel */}
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
                            {/* MTN */}
                            <div className="tech-method-card">
                                <div className="tech-method-icon" style={{backgroundColor: '#FFCC00'}}>
                                    <span className="material-symbols-outlined text-black">smartphone</span>
                                </div>
                                <span className="tech-method-title">MTN Mobile Money</span>
                                <span className="tech-method-desc">Instant Settlement</span>
                            </div>
                            {/* Orange */}
                            <div className="tech-method-card">
                                <div className="tech-method-icon" style={{backgroundColor: '#FF6600'}}>
                                    <span className="material-symbols-outlined text-white">account_balance_wallet</span>
                                </div>
                                <span className="tech-method-title">Orange Money</span>
                                <span className="tech-method-desc">Instant Settlement</span>
                            </div>
                            {/* Bank */}
                            <div className="tech-method-card">
                                <div className="tech-method-icon bg-primary-container">
                                    <span className="material-symbols-outlined text-on-primary-container">account_balance</span>
                                </div>
                                <span className="tech-method-title">Bank Transfer</span>
                                <span className="tech-method-desc">1-2 Business Days</span>
                            </div>
                        </div>
                    </section>

                    {/* Step 3: Review & Security */}
                    <section className="tech-step-card tech-step-disabled">
                        <div className="tech-step-header">
                            <span className="tech-step-number tech-step-inactive">3</span>
                            <h2>Review &amp; Confirm</h2>
                        </div>
                        <div className="tech-review-info">
                            <span className="material-symbols-outlined">info</span>
                            <p>Review your transaction details carefully. Funds will be sent to the linked account ending in **8921. Ensure the destination account is active.</p>
                        </div>
                        <button className="tech-btn-confirm" disabled>
                            Confirm Withdrawal
                        </button>
                    </section>

                </div>

                {/* Side Summary Panel */}
                <div className="tech-withdraw-sidebar">
                    <div className="tech-summary-card">
                        <h3>Transaction Summary</h3>
                        
                        <div className="tech-summary-lines">
                            <div className="tech-summary-line">
                                <span className="tech-sum-label">Available Balance</span>
                                <span className="tech-sum-value text-primary">$12,450.00</span>
                            </div>
                            <div className="tech-summary-line">
                                <span className="tech-sum-label">Withdrawal Amount</span>
                                <span className="tech-sum-value text-primary">${amount || '0.00'}</span>
                            </div>
                            <div className="tech-summary-line">
                                <span className="tech-sum-label">Processing Fee</span>
                                <span className="tech-sum-value text-primary">$0.00</span>
                            </div>
                            <div className="tech-summary-total">
                                <span className="tech-sum-label-bold">You will receive</span>
                                <span className="tech-sum-total text-secondary">${amount || '0.00'}</span>
                            </div>
                        </div>

                        <div className="tech-secure-box">
                            <div className="tech-secure-header">
                                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
                                <span>Secure Withdrawal</span>
                            </div>
                            <p>This transaction is protected by 256-bit encryption. A verification code will be sent to your registered mobile device before processing.</p>
                        </div>

                        <div className="tech-security-visual">
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7MfXLhDZrYtF7BWEYz3H-LCBE2STR_d7G2AtQuLW_irQiqDCeKGKKJ8dc4m-dVyUhj1FArmt9VsWFx8bXPylEXje5XNTO9wblxsjR1RT2QTGmIzzLHaBIFOqy8RyKBYDxbSKhSYJVGiEXiLhIIoBg0R7THe2QdvxPQnzYh5BymhFGzuMuUTc6kDThK3gBiBGOHyjwQkOySTNSsBjsFahjrbV2SmhAr7sYJs0Rk6AHt47jMLhtLJE95mZp8UUfBhkpgOwJ428L4A" alt="Security visual"/>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Withdrawal;
