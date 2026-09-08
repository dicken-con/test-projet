import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { authService } from '../services/authService';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const fakeUser: User = {
  id: '1',
  nom: 'Diop',
  prenom: 'Admin',
  email: 'admin@pharmalink.sn',
  role: 'admin',
};

const MOT_DE_PASSE_LOCAL = 'PHARMA26';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Restaure la session au rechargement de la page (si un token existe déjà)
  useEffect(() => {
    const token = localStorage.getItem('pharmalink-token');
    const savedUser = localStorage.getItem('pharmalink-user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { token, user: apiUser } = await authService.login(email, password);
      localStorage.setItem('pharmalink-token', token);
      localStorage.setItem('pharmalink-user', JSON.stringify(apiUser));
      setUser(apiUser);
    } catch (err) {
      // Le backend n'est pas encore prêt : on garde l'authentification simulée
      // en attendant, pour que l'application reste testable.
      if (password !== MOT_DE_PASSE_LOCAL) {
        throw new Error('Mot de passe incorrect.');
      }
      const localUser = { ...fakeUser, email };
      localStorage.setItem('pharmalink-user', JSON.stringify(localUser));
      setUser(localUser);
    }
  };

  const logout = () => {
    localStorage.removeItem('pharmalink-token');
    localStorage.removeItem('pharmalink-user');
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      localStorage.setItem('pharmalink-user', JSON.stringify(updated));
      return updated;
    });
  };

  const value: AuthContextType = { user, isAuthenticated: !!user, login, logout, updateUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};