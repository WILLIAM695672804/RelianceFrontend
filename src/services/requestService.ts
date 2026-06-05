import api from './api';

export interface CreateRequestPayload {
  title: string;
  description: string;
  category_slug?: string;
  address_id?: string;
  latitude?: number;
  longitude?: number;
  address_label?: string;
  city?: string;
  photos?: File[];
}

export interface ClientRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  category: { id: string; name: string; slug: string } | null;
  address: { id: string; city: string; address: string } | null;
  photos: string[];
  diagnostic_fee: number;
  analysis?: {
    estimated_difficulty: string;
    suggested_price: number;
    estimated_skills: string[];
  };
  proposals_count?: number;
  counterpart?: { id: string; name: string; role: string } | null;
  created_at: string;
}

const requestService = {
  async create(payload: CreateRequestPayload) {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    if (payload.category_slug) formData.append('category_slug', payload.category_slug);
    if (payload.address_id) formData.append('address_id', payload.address_id);
    if (payload.latitude !== undefined) formData.append('latitude', String(payload.latitude));
    if (payload.longitude !== undefined) formData.append('longitude', String(payload.longitude));
    if (payload.address_label) formData.append('address_label', payload.address_label);
    if (payload.city) formData.append('city', payload.city);
    if (payload.photos) {
      payload.photos.forEach((photo, i) => formData.append(`photos[${i}]`, photo));
    }

    const response = await api.post('/requests', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async list() {
    const response = await api.get('/requests');
    return response.data;
  },

  async get(id: string) {
    const response = await api.get(`/requests/${id}`);
    return response.data;
  },

  async match(requestId: string) {
    const response = await api.post(`/requests/${requestId}/match`);
    return response.data;
  },

  async selectTechnician(requestId: string, technicianId: string, price: number, message?: string) {
    const response = await api.post(`/requests/${requestId}/select-technician`, {
      technician_id: technicianId,
      price,
      message,
    });
    return response.data;
  },

  // Legacy aliases for backward compatibility
  createRequest: async (data: any) => {
    return requestService.create({
      title: data.subject || data.title,
      description: data.description,
      category_slug: data.category,
      latitude: data.latitude,
      longitude: data.longitude,
    });
  },

  getRequests: async () => requestService.list(),

  getRequest: async (id: string) => requestService.get(id),
};

export default requestService;
