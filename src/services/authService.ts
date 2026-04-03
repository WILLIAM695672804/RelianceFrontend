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
    token: string;
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
};

export default authService;
