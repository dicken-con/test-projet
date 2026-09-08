import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../hooks/useAuth';

const roleLabels: Record<string, string> = {
  admin: 'Administrateur',
  pharmacien: 'Pharmacien',
  vendeur: 'Vendeur',
};

const Profil: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [nom, setNom] = useState(user?.nom || '');
  const [prenom, setPrenom] = useState(user?.prenom || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ nom, prenom, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <MainLayout title="Profil">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-semibold">
              {prenom.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white text-lg">
                {prenom} {nom}
              </h3>
              <span className="inline-block mt-1 px-2.5 py-0.5 bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 text-xs font-medium rounded-full">
                {roleLabels[user?.role || 'admin']}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prénom</label>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
              >
                Enregistrer les modifications
              </button>
              {saved && (
                <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                  ✓ Profil mis à jour
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profil;