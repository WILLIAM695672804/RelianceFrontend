import React, { useState, useEffect } from 'react';
import { financeService } from '../../services/financeService';
import './Subscriptions.css';

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  features: string[];
  active: boolean;
}

interface Subscription {
  id: string;
  plan_name: string;
  status: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const Subscriptions: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSub, setCurrentSub] = useState<Subscription | null>(null);
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [plansRes, subRes] = await Promise.all([
        financeService.getPlans(),
        financeService.getMySubscription(),
      ]);
      setPlans(plansRes.data.data || []);
      setCurrentSub(subRes.data.data || null);
    } catch (err) {
      console.error('Failed to load subscription data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    setSubscribing(true);
    try {
      await financeService.subscribe(planId, billing);
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur lors de la souscription');
    } finally {
      setSubscribing(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ?')) return;
    try {
      const res = await financeService.cancelSubscription();
      alert(res.data.message);
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  if (loading) {
    return (
      <div className="sub-loading">
        <div className="sub-spinner" />
        <p>Chargement des plans...</p>
      </div>
    );
  }

  return (
    <div className="subscriptions-page">
      <div className="sub-header">
        <h1>Abonnements</h1>
        <p className="sub-subtitle">Choisissez le plan qui correspond à votre activité</p>
        
        <div className="billing-toggle">
          <button
            className={`toggle-btn ${billing === 'monthly' ? 'active' : ''}`}
            onClick={() => setBilling('monthly')}
          >
            Mensuel
          </button>
          <button
            className={`toggle-btn ${billing === 'yearly' ? 'active' : ''}`}
            onClick={() => setBilling('yearly')}
          >
            Annuel <span className="save-badge">-20%</span>
          </button>
        </div>
      </div>

      {currentSub && (
        <div className="current-sub-banner">
          <div className="current-sub-info">
            <span className="current-sub-label">Abonnement actif</span>
            <strong>{currentSub.plan_name}</strong>
            <span className="current-sub-date">
              Expire le {new Date(currentSub.end_date).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <button className="btn-cancel" onClick={handleCancel}>Annuler</button>
        </div>
      )}

      <div className="plans-grid">
        {plans.map((plan) => {
          const price = billing === 'monthly' ? plan.price_monthly : plan.price_yearly;
          const isCurrentPlan = currentSub?.plan_name === plan.slug;
          
          return (
            <div key={plan.id} className={`plan-card ${isCurrentPlan ? 'current' : ''}`}>
              <div className="plan-card-header">
                <h3>{plan.name}</h3>
                <p className="plan-desc">{plan.description}</p>
              </div>
              <div className="plan-price">
                <span className="price-amount">{price.toLocaleString()}</span>
                <span className="price-currency">{plan.currency}</span>
                <span className="price-period">/{billing === 'monthly' ? 'mois' : 'an'}</span>
              </div>
              <ul className="plan-features">
                {(plan.features || []).map((f, i) => (
                  <li key={i}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`plan-btn ${isCurrentPlan ? 'disabled' : ''}`}
                disabled={isCurrentPlan || subscribing}
                onClick={() => handleSubscribe(plan.id)}
              >
                {isCurrentPlan ? 'Plan actuel' : 'Souscrire'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Subscriptions;
