import api from './api';

export interface AdminStats {
    total_users: number;
    total_clients: number;
    total_technicians: number;
    total_agencies: number;
    pending_technicians: number;
    pending_kyc: number;
    active_users: number;
    inactive_users: number;
    new_users_this_month: number;
    total_requests: number;
    pending_requests: number;
    recent_users: {
        id: string;
        name: string;
        email: string;
        role: string;
        is_active: boolean;
        created_at: string;
    }[];
}

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
    verified: boolean;
    email_verified_at: string | null;
    avatar_url: string | null;
    created_at: string;
    roles: { id: number; name: string }[];
    kyc_documents?: KycDocument[];
    wallet?: { balance: number; currency: string };
}

export interface KycDocument {
    id: string;
    user_id: string;
    type: string;
    file_path: string;
    status: 'pending' | 'approved' | 'rejected';
    rejection_reason: string | null;
    validated_by: string | null;
    url: string;
    created_at: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

const adminService = {
    // Dashboard
    async getStats(): Promise<AdminStats> {
        const response = await api.get('/auth/admin/stats');
        return response.data;
    },

    // User Management
    async getUsers(params?: {
        role?: string;
        status?: string;
        search?: string;
        kyc_status?: string;
        page?: number;
    }): Promise<PaginatedResponse<AdminUser>> {
        const response = await api.get('/auth/admin/users', { params });
        return response.data;
    },

    async getUser(id: string): Promise<{ data: AdminUser }> {
        const response = await api.get(`/auth/admin/users/${id}`);
        return response.data;
    },

    async toggleActive(id: string): Promise<{ message: string; is_active: boolean }> {
        const response = await api.patch(`/auth/admin/users/${id}/toggle-active`);
        return response.data;
    },

    async assignRole(userId: string, role: string): Promise<any> {
        const response = await api.post(`/auth/admin/users/${userId}/roles`, { role });
        return response.data;
    },

    async revokeRole(userId: string, role: string): Promise<any> {
        const response = await api.delete(`/auth/admin/users/${userId}/roles/${role}`);
        return response.data;
    },

    // Technician Approval
    async getPendingTechnicians(page?: number): Promise<PaginatedResponse<AdminUser>> {
        const response = await api.get('/auth/admin/technicians/pending', { params: { page } });
        return response.data;
    },

    async approveTechnician(id: string): Promise<{ message: string; data: AdminUser }> {
        const response = await api.post(`/auth/admin/technicians/${id}/approve`);
        return response.data;
    },

    async rejectTechnician(id: string, reason: string): Promise<{ message: string }> {
        const response = await api.post(`/auth/admin/technicians/${id}/reject`, { reason });
        return response.data;
    },

    // KYC Management
    async getKycDocuments(params?: {
        status?: string;
        type?: string;
        search?: string;
        page?: number;
    }): Promise<PaginatedResponse<KycDocument>> {
        const response = await api.get('/auth/kyc/admin/documents', { params });
        return response.data;
    },

    async validateKyc(id: string, status: 'approved' | 'rejected', rejectionReason?: string): Promise<any> {
        const response = await api.post(`/auth/kyc/${id}/validate`, {
            status,
            rejection_reason: rejectionReason,
        });
        return response.data;
    },

    // Fees & Commissions
    async getFees(): Promise<any> {
        const response = await api.get('/admin/fees');
        return response.data;
    },

    async createFee(data: { name: string; fee_type: string; value: number; applies_to: string }): Promise<any> {
        const response = await api.post('/admin/fees', data);
        return response.data;
    },

    async updateFee(id: string, data: Partial<{ name: string; fee_type: string; value: number; applies_to: string; active: boolean }>): Promise<any> {
        const response = await api.patch(`/admin/fees/${id}`, data);
        return response.data;
    },

    async toggleFee(id: string): Promise<any> {
        const response = await api.patch(`/admin/fees/${id}/toggle`);
        return response.data;
    },

    // Requests Management
    async getAllRequests(params?: { status?: string; page?: number }): Promise<any> {
        const response = await api.get('/admin/requests', { params });
        return response.data;
    },

    async assignTechnician(requestId: string, technicianId: string): Promise<any> {
        const response = await api.post(`/admin/requests/${requestId}/assign`, { technician_id: technicianId });
        return response.data;
    },

    // Conversations Supervision
    async getAllConversations(params?: { page?: number; search?: string }): Promise<any> {
        const response = await api.get('/admin/conversations', { params });
        return response.data;
    },

    async getConversationDetail(id: string): Promise<any> {
        const response = await api.get(`/admin/conversations/${id}`);
        return response.data;
    },

    async searchConversations(query: string): Promise<any> {
        const response = await api.get('/admin/conversations/search', { params: { q: query } });
        return response.data;
    },

    // Analytics
    async getAnalytics(params?: { period?: string }): Promise<any> {
        const response = await api.get('/admin/analytics', { params });
        return response.data;
    },

    async getAnalyticsSummary(): Promise<any> {
        const response = await api.get('/admin/analytics/summary');
        return response.data;
    },
};

export default adminService;
