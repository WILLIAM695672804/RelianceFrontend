import api from './api';

export const disputeService = {
  // User-facing
  getDisputes: (page = 1) => api.get(`/disputes?page=${page}`),
  getDispute: (id: string) => api.get(`/disputes/${id}`),
  openDispute: (data: {
    request_id: string;
    against: string;
    reason: string;
    description: string;
  }) => api.post('/disputes', data),
  addMessage: (disputeId: string, message: string) =>
    api.post(`/disputes/${disputeId}/message`, { message }),

  // Admin
  getAllDisputes: (page = 1) => api.get(`/admin/disputes?page=${page}`),
  resolveDispute: (id: string, resolution: string, refundAmount?: number) =>
    api.post(`/admin/disputes/${id}/resolve`, {
      resolution,
      refund_amount: refundAmount,
    }),
};
