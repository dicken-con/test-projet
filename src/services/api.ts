const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  auth?: boolean;
}

/**
 * Point d'entrée unique pour tous les appels au backend.
 * Ajoute automatiquement le token JWT si "auth: true" est demandé,
 * et lève une erreur claire en cas d'échec réseau ou de réponse invalide.
 */
export const apiRequest = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { method = 'GET', body, auth = false } = options;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = localStorage.getItem('pharmalink-token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur serveur (${response.status})`);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
};