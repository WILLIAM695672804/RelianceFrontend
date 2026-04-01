import os

path = './src/pages/client/RequestWizard/RequestWizard.tsx'

with open(path, 'r', encoding='utf-8') as f:
    code = f.read()

target1 = """                    {/* STEP 1: CATEGORY SELECTION */}
                    {step === 1 && (
                        <div className="rw-step1-wrapper anim-fade-in">
                            <header className="rw-step-header">
                                <span className="rw-step-tag">REQUESTWIZARD</span>
                                <h1 className="rw-step-title">What do you need help with?</h1>
                                <p className="rw-step-desc">Select a category that best describes your technical request. We'll match you with the right specialist for the job.</p>
                            </header>

                            {/* Categories Grid (Asymmetric Bento Inspired Layout) */}
                            <div className="rw-categories-grid">"""

replace1 = """                    {/* STEP 1: CATEGORY SELECTION */}
                    {step === 1 && (
                        <div className="rw-step1-wrapper rw-split-layout anim-fade-in">
                            <div className="rw-split-left">
                                <header className="rw-step-header">
                                    <span className="rw-step-tag">REQUESTWIZARD</span>
                                    <h1 className="rw-step-title">What do you need help with?</h1>
                                    <p className="rw-step-desc">Select a category that best describes your technical request. We'll match you with the right specialist for the job.</p>
                                </header>
                                {/* Descriptive Image Card (Bento Style Extension) */}
                                <div className="rw-promo-grid">
                                    <div className="rw-promo-image-card group-hover-trigger">
                                        <img 
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8SEJfzRWe7laPxlk9GCTnsVpcIJqN-VQc3qpfpuiGE4p238f4WlZOWPD6KYFIUUnD0kAd1hueBq6E52VGgK14J1eHg1JLX0dtC8TPvJSV_B0-qTUnX--HIg6GKC0rhMoXeRuYwXbyKYDsa8bDIlKycYwzCCQBNHO6TASZnnaMLfNbtY_keaIGx0wO2d2ZZJvDOlSbnTdXDoqIY7FkfN4fW0hneN3h6-9J3lMA7WCIKxsE_3sKMw7ELamIeZa1xZDNLm_LfOAIFA" 
                                            alt="Technician at work" 
                                            className="rw-promo-img"
                                        />
                                        <div className="rw-promo-img-overlay">
                                            <h4>Trusted Experts Only</h4>
                                            <p>Every specialist on TechMarket is verified through a rigorous 5-step background and skills assessment.</p>
                                        </div>
                                    </div>
                                    <div className="rw-promo-text-card">
                                        <div className="rw-promo-icon-wrap">
                                            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
                                        </div>
                                        <h3>Satisfaction Guaranteed</h3>
                                        <p>We hold your payment in escrow until the job is completed to your satisfaction.</p>
                                        
                                        <button 
                                            className="rw-promo-btn"
                                            onClick={nextStep}
                                            disabled={!formData.category}   
                                        >
                                            Next Step
                                            <span className="material-symbols-outlined ml-2 arrow-icon">arrow_forward</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="rw-split-right">
                                <div className="rw-categories-grid">"""

if target1 in code:
    code = code.replace(target1, replace1)
else:
    print("target1 not found")

target2 = """                            </div>

                            {/* Descriptive Image Card (Bento Style Extension) */}
                            <div className="rw-promo-grid">
                                <div className="rw-promo-image-card group-hover-trigger">
                                    <img 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8SEJfzRWe7laPxlk9GCTnsVpcIJqN-VQc3qpfpuiGE4p238f4WlZOWPD6KYFIUUnD0kAd1hueBq6E52VGgK14J1eHg1JLX0dtC8TPvJSV_B0-qTUnX--HIg6GKC0rhMoXeRuYwXbyKYDsa8bDIlKycYwzCCQBNHO6TASZnnaMLfNbtY_keaIGx0wO2d2ZZJvDOlSbnTdXDoqIY7FkfN4fW0hneN3h6-9J3lMA7WCIKxsE_3sKMw7ELamIeZa1xZDNLm_LfOAIFA" 
                                        alt="Technician at work" 
                                        className="rw-promo-img"
                                    />
                                    <div className="rw-promo-img-overlay">
                                        <h4>Trusted Experts Only</h4>
                                        <p>Every specialist on TechMarket is verified through a rigorous 5-step background and skills assessment.</p>
                                    </div>
                                </div>
                                <div className="rw-promo-text-card">
                                    <div className="rw-promo-icon-wrap">
                                        <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>verified_user</span>
                                    </div>
                                    <h3>Satisfaction Guaranteed</h3>
                                    <p>We hold your payment in escrow until the job is completed to your satisfaction. Our 24/7 support team is always here to help.</p>
                                    
                                    <button 
                                        className="rw-promo-btn"
                                        onClick={nextStep}
                                        disabled={!formData.category}   
                                    >
                                        Next Step
                                        <span className="material-symbols-outlined ml-2 arrow-icon">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}"""

replace2 = """                            </div>
                            </div>
                        </div>
                    )}"""

if target2 in code:
    code = code.replace(target2, replace2)
else:
    print("target2 not found")


with open(path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Split Step 1 Done!")
