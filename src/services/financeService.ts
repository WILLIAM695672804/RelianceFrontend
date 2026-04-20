import api from './api';

export const financeService = {
  // Wallet
  getWallet: () => api.get('/wallet'),
  rechargeWallet: (data: { amount: number; method: string; phone_number?: string }) =>
    api.post('/wallet/recharge', data),
  getTransactions: (page = 1) => api.get(`/wallet/transactions?page=${page}`),
  withdraw: (data: { amount: number; method: string; phone_number?: string }) =>
    api.post('/wallet/withdraw', data),

  // Payments
  getPayments: (page = 1) => api.get(`/payments?page=${page}`),
  getPayment: (id: string) => api.get(`/payments/${id}`),

  // Holds
  getHolds: () => api.get('/holds'),

  // Subscriptions
  getPlans: () => api.get('/subscriptions/plans'),
  getMySubscription: () => api.get('/subscriptions/mine'),
  subscribe: (planId: string, billing: 'monthly' | 'yearly') =>
    api.post('/subscriptions/subscribe', { plan_id: planId, billing_cycle: billing }),
  cancelSubscription: () => api.post('/subscriptions/cancel'),

  // Credits
  getExchangeRates: () => api.get('/credits/rates'),
  purchaseCredits: (data: { amount: number; from_currency: string }) =>
    api.post('/credits/purchase', data),
};
