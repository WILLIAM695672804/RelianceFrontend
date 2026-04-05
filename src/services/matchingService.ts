import api from './api';

export interface MatchedTechnician {
  id: string;
  name: string;
  avatar_url: string | null;
  rating: number;
  num_reviews: number;
  verified: boolean;
  distance_km: number;
  match_score: number;
  scores: {
    distance: number;
    rating: number;
    proficiency: number;
    availability: number;
    success_rate: number;
    total: number;
  };
  skills: {
    name: string;
    proficiency: number;
    hourly_rate: number;
  }[];
}

export interface MatchResult {
  technicians: MatchedTechnician[];
  scoring_details: {
    weights: Record<string, number>;
    candidates_found: number;
    returned: number;
    radius_km: number;
  };
}

export interface Proposal {
  id: string;
  request_id: string;
  technician_id: string;
  price: number;
  status: string;
  expires_at: string;
  request?: {
    id: string;
    title: string;
    description: string;
  };
}

const matchingService = {
  async getProposals() {
    const response = await api.get('/proposals/my');
    return response.data;
  },

  async acceptProposal(proposalId: string) {
    const response = await api.post(`/proposals/${proposalId}/accept`);
    return response.data;
  },

  async refuseProposal(proposalId: string) {
    const response = await api.post(`/proposals/${proposalId}/refuse`);
    return response.data;
  },

  // Legacy alias used by older MatchingResults component
  getTechnicianProposals: async () => {
    const response = await api.get('/proposals/my');
    return response.data;
  },
};

export default matchingService;
