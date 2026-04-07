import api from './api';

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  reviewer: {
    name: string;
    avatar_url: string | null;
  };
  created_at: string;
}

export interface TechBadge {
  code: string;
  title: string;
  icon_ref: string;
  awarded_at?: string;
}

const reviewService = {
  async submitReview(requestId: string, rating: number, comment?: string) {
    const response = await api.post('/reviews', {
      request_id: requestId,
      rating,
      comment,
    });
    return response.data;
  },

  async getTechnicianReviews(technicianId: string, page = 1) {
    const response = await api.get(`/reviews/technician/${technicianId}?page=${page}`);
    return response.data;
  },

  async getMyReviews(page = 1) {
    const response = await api.get(`/reviews/mine?page=${page}`);
    return response.data;
  },

  async getUserBadges(userId: string) {
    const response = await api.get(`/badges/user/${userId}`);
    return response.data;
  },

  async getReputation(userId: string) {
    const response = await api.get(`/reputation/${userId}`);
    return response.data;
  },
};

export default reviewService;
