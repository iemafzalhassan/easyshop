import { api } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async logout() {
    localStorage.removeItem('token');
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async updateProfile(data: Partial<RegisterData>) {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};
