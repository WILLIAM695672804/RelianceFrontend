import api from './api';

export const getTechCalendar = async () => {
    const response = await api.get('/technician/calendar');
    return response.data.data;
};

export const addTimeSlot = async (data: { day_of_week: number, start_time: string, end_time: string, repeat_weekly: boolean }) => {
    const response = await api.post('/technician/time-slots', data);
    return response.data.data;
};

export const removeTimeSlot = async (id: string) => {
    const response = await api.delete(`/technician/time-slots/${id}`);
    return response.data;
};

export const addScheduleException = async (data: { start_ts: string, end_ts: string, reason?: string }) => {
    const response = await api.post('/technician/exceptions', data);
    return response.data.data;
};

export const removeScheduleException = async (id: string) => {
    const response = await api.delete(`/technician/exceptions/${id}`);
    return response.data;
};
