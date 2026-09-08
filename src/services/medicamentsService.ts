import { apiRequest } from './api';
import { Medicament } from '../types';
import { medicamentsData } from '../data/medicaments';

export const medicamentsService = {
  async getAll(): Promise<Medicament[]> {
    try {
      return await apiRequest<Medicament[]>('/medicaments', { auth: true });
    } catch {
      console.warn('Backend indisponible — utilisation des données locales de démonstration.');
      return medicamentsData;
    }
  },

  async create(data: Omit<Medicament, 'id'>): Promise<Medicament> {
    return apiRequest<Medicament>('/medicaments', { method: 'POST', body: data, auth: true });
  },

  async update(id: string, data: Omit<Medicament, 'id'>): Promise<Medicament> {
    return apiRequest<Medicament>(`/medicaments/${id}`, { method: 'PUT', body: data, auth: true });
  },

  async remove(id: string): Promise<void> {
    return apiRequest<void>(`/medicaments/${id}`, { method: 'DELETE', auth: true });
  },
};