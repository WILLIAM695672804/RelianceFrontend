import api from './api';

export const financeService = {
  // Wallet
  getWallet: () => api.get('/wallet'),
  // Portefeuilles multi-devises (XAF, EUR, USD) et conversion au taux de l'administrateur
  rechargeWallet: (data: { amount: number; method: string; phone_number?: string }) =>
    api.post('/wallet/recharge', data),
  getTransactions: (page = 1) => api.get(`/wallet/transactions?page=${page}`),
  withdraw: (data: { amount: number; method: string; phone_number?: string }) =>
    api.post('/wallet/withdraw', data),

  // Payments
  getPayments: (page = 1) => api.get(`/payments?page=${page}`),
  getPayment: (id: string) => api.get(`/payments/${id}`),
  //  Simule le webhook de la passerelle (passe le paiement à "settled" + crédite le wallet).
  // À n'utiliser qu'en développement local : en production c'est le webhook NotchPay qui appelle ce endpoint.
  confirmPayment: (id: string) => api.post(`/payments/${id}/confirm`),

  // Frais de diagnostic
  getDiagnostic: (requestId: string) => api.get(`/requests/${requestId}/diagnostic`),
  setDiagnostic: (requestId: string, amount: number) => api.post(`/requests/${requestId}/diagnostic`, { amount }),
  payDiagnostic: (diagnosticId: string) => api.post(`/diagnostics/${diagnosticId}/pay`),

  // Holds
  getHolds: () => api.get('/holds'),

  // Credits
  getExchangeRates: () => api.get('/credits/rates'),
  purchaseCredits: (data: { amount: number; from_currency: string }) =>
    api.post('/credits/purchase', data),
};
