import api from './api';

export const agencyService = {
  getAgencies: (page = 1) => api.get(`/agencies?page=${page}`),
  getAgency: (id: string) => api.get(`/agencies/${id}`),
  createAgency: (data: { name: string; description?: string; address?: string; phone?: string; email?: string }) =>
    api.post('/agencies', data),
  updateAgency: (id: string, data: any) => api.put(`/agencies/${id}`, data),
  getMembers: (agencyId: string) => api.get(`/agencies/${agencyId}/members`),
  addMember: (agencyId: string, userId: string, role = 'member') =>
    api.post(`/agencies/${agencyId}/members`, { user_id: userId, role }),
  removeMember: (agencyId: string, userId: string) =>
    api.delete(`/agencies/${agencyId}/members/${userId}`),
  getMyAgency: () => api.get('/my-agency'),
};
