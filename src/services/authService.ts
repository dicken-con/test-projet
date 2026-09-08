import { apiRequest } from './api';
import { User } from '../types';

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/auth/login', { method: 'POST', body: { email, password } });
  },
};