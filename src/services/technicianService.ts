import api from './api';

export const getTechProfile = async () => {
    const response = await api.get('/technician/profile');
    return response.data.data;
};

export const getTechStats = async () => {
    const response = await api.get('/technician/stats');
    return response.data;
};

export const updateTechProfile = async (data: FormData) => {
    // Note: We use POST with FormData. If the backend route is PUT, 
    // we must ensure the FormData contains '_method': 'PUT'.
    const response = await api.post('/technician/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
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

// KYC ENDPOINTS
export const fetchKycDocuments = async () => {
    const response = await api.get('/auth/kyc/mine');
    return response.data;
};

export const uploadKycDocument = async (type: string, file: File) => {
    const formData = new FormData();
    formData.append('type', type);
    formData.append('document', file);

    const response = await api.post('/auth/kyc/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};
