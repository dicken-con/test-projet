export type UserRole = 'admin' | 'pharmacien' | 'vendeur';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
}

export interface Medicament {
  id: string;
  nom: string;
  categorie: string;
  prix: number;
  stock: number;
  seuilAlerte: number;
  fournisseur: string;
  dateExpiration: string;
}

export type EmployePoste = 'Pharmacien' | 'Vendeur' | 'Caissier' | 'Gestionnaire de stock';
export type EmployeStatut = 'Actif' | 'Inactif';

export interface Employe {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  poste: EmployePoste;
  dateEmbauche: string;
  statut: EmployeStatut;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export interface Coordonnees {
  lat: number;
  lng: number;
}

export interface PharmacieMap {
  id: string;
  nom: string;
  adresse: string;
  position: Coordonnees;
  medicamentsDisponibles: string[];
  telephone: string;
}

export interface ItineraireResultat {
  distanceKm: number;
  dureeMinutes: number;
  tracé: Coordonnees[];
}

export interface ResultatRecherche {
  pharmacie: PharmacieMap;
  itineraire: ItineraireResultat;
}

export type MoyenPaiement = 'wave' | 'orange_money';