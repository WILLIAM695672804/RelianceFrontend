import api from './api';

export const getTechProfile = async () => {
    const response = await api.get('/technician/profile');
    return response.data.data;
};

export const updateTechProfile = async (data: { bio?: string, phone?: string, languages?: string[] }) => {
    const response = await api.put('/technician/profile', data);
    return response.data.data;
};

export const updateTechLocation = async (latitude: number, longitude: number, city?: string, radius: number = 50) => {
    const response = await api.put('/technician/location', { latitude, longitude, city, radius });
    return response.data.data;
};

export const getTechSkills = async () => {
    const response = await api.get('/technician/skills');
    return response.data.data;
};

export const getAllSkillsCatalog = async () => {
    const response = await api.get('/skills');
    return response.data.data;
};

export const addTechSkill = async (data: { skill_id: string, proficiency: number, experience_years: number }) => {
    const response = await api.post('/technician/skills', data);
    return response.data;
};

export const deleteTechSkill = async (id: string) => {
    const response = await api.delete(`/technician/skills/${id}`);
    return response.data;
};
