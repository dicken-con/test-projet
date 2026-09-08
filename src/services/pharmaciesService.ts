import { apiRequest } from './api';
import { PharmacieMap } from '../types';
import { pharmaciesMapData } from '../data/pharmaciesMap';

export const pharmaciesService = {
  async getAll(): Promise<PharmacieMap[]> {
    try {
      return await apiRequest<PharmacieMap[]>('/pharmacies');
    } catch {
      console.warn('Backend indisponible — utilisation des pharmacies locales de démonstration.');
      return pharmaciesMapData;
    }
  },
};