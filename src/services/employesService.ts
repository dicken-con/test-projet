import { apiRequest } from './api';
import { Employe } from '../types';
import { employesData } from '../data/employes';

export const employesService = {
  async getAll(): Promise<Employe[]> {
    try {
      return await apiRequest<Employe[]>('/employes', { auth: true });
    } catch {
      console.warn('Backend indisponible — utilisation des données locales de démonstration.');
      return employesData;
    }
  },

  async create(data: Omit<Employe, 'id'>): Promise<Employe> {
    return apiRequest<Employe>('/employes', { method: 'POST', body: data, auth: true });
  },

  async update(id: string, data: Omit<Employe, 'id'>): Promise<Employe> {
    return apiRequest<Employe>(`/employes/${id}`, { method: 'PUT', body: data, auth: true });
  },

  async remove(id: string): Promise<void> {
    return apiRequest<void>(`/employes/${id}`, { method: 'DELETE', auth: true });
  },
};