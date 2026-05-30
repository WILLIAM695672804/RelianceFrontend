import api from './api';

export const governanceService = {
    /** Journal SLA du technicien connecté (events de ses missions). */
    getMySlaEvents: async () => {
        const response = await api.get('/sla-events/mine');
        return response.data;
    },
};

export default governanceService;
