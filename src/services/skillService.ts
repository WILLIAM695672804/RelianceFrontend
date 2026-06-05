import api from './api';

export interface Skill {
  id: string;
  slug: string;
  name: string;
  category: string | null;
}

const skillService = {
  // GET /skills — liste de tous les métiers/compétences disponibles.
  async list(): Promise<Skill[]> {
    const response = await api.get('/skills');
    return response.data?.data ?? [];
  },
};

export default skillService;
