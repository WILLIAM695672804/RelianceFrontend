import api from './api';

export interface RegisterData {
    name: string;
    email: string;
    phone?: string;
    password: string;
    password_confirmation: string;
    role: 'client' | 'technicien' | 'agence';
    // Technicien
    bio?: string;
    competences?: string[];
    // Agence
    agency_name?: string;
    address?: string;
    description?: string;
}

export interface LoginData {
    email: string;
    password: string;
    code?: string; // 2FA TOTP code
}

export interface AuthResponse {
    message: string;
    user: any;
    token?: string; // Token is now stored in httpOnly cookie, not in response body
}

const authService = {
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    async login(data: LoginData): Promise<AuthResponse> {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    async logout(): Promise<void> {
        await api.post('/auth/logout');
    },

    async getMe(): Promise<any> {
        const response = await api.get('/auth/me');
        return response.data;
    },

    async refreshToken(): Promise<AuthResponse> {
        const response = await api.post('/auth/refresh');
        return response.data;
    },

    async generate2FA(): Promise<{ secret: string; qr_code_svg: string }> {
        const response = await api.post('/auth/2fa/generate');
        return response.data;
    },

    async enable2FA(code: string): Promise<void> {
        await api.post('/auth/2fa/enable', { code });
    },

    async disable2FA(code: string): Promise<void> {
        await api.post('/auth/2fa/disable', { code });
    },

    async updateProfile(data: { name?: string; phone?: string; email?: string }): Promise<any> {
        const response = await api.put('/auth/profile', data);
        return response.data;
    },

    async changePassword(data: { current_password: string; new_password: string; new_password_confirmation: string }): Promise<any> {
        const response = await api.put('/auth/profile/password', data);
        return response.data;
    },

    async updateAvatar(file: File): Promise<any> {
        const formData = new FormData();
        formData.append('avatar', file);
        const response = await api.post('/auth/profile/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Location Management
    async getLocations(): Promise<any[]> {
        const response = await api.get('/locations');
        return response.data;
    },

    async addLocation(data: { label: string; address: string; city?: string; is_default?: boolean }): Promise<any> {
        const response = await api.post('/locations', data);
        return response.data;
    },

    async deleteLocation(id: string): Promise<void> {
        await api.delete(`/locations/${id}`);
    },

    async setDefaultLocation(id: string): Promise<void> {
        await api.patch(`/locations/${id}/default`);
    },

    async verifyEmail(verificationUrl: string): Promise<any> {
        const response = await api.get(verificationUrl);
        return response.data;
    },

    async resendVerificationEmail(): Promise<any> {
        const response = await api.post('/auth/email/verification-notification');
        return response.data;
    },
};

export default authService;
