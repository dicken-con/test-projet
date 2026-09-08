import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Modal from '../composants/Modal';
import EmployeForm from '../composants/EmployeForm';
import { Employe } from '../types';
import { employesService } from '../services/employesService';

const Employes: React.FC = () => {
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState<Employe[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Employe | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employe | null>(null);

  useEffect(() => {
    employesService.getAll().then((data) => {
      setEmployes(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFiltered(
      employes.filter(
        (e) => e.nom.toLowerCase().includes(term) || e.prenom.toLowerCase().includes(term) || e.poste.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, employes]);

  const openAddModal = () => { setEditingItem(null); setIsModalOpen(true); };
  const openEditModal = (item: Employe) => { setEditingItem(item); setIsModalOpen(true); };

  const handleFormSubmit = async (data: Omit<Employe, 'id'>) => {
    try {
      if (editingItem) {
        const updated = await employesService.update(editingItem.id, data);
        setEmployes((prev) => prev.map((e) => (e.id === editingItem.id ? updated : e)));
      } else {
        const created = await employesService.create(data);
        setEmployes((prev) => [...prev, created]);
      }
    } catch {
      if (editingItem) {
        setEmployes((prev) => prev.map((e) => (e.id === editingItem.id ? { ...data, id: editingItem.id } : e)));
      } else {
        setEmployes((prev) => [...prev, { ...data, id: Date.now().toString() }]);
      }
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await employesService.remove(deleteTarget.id);
    } catch {
      // Backend indisponible : suppression locale en attendant
    }
    setEmployes((prev) => prev.filter((e) => e.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <MainLayout title="Employés">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input type="text" placeholder="Rechercher un employé..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
        </div>
        <button onClick={openAddModal} className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm">
          <span>+</span> Ajouter un employé
        </button>
      </div>

      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="py-12 text-center">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-400">Chargement des employés...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/60 text-left text-gray-500 dark:text-gray-400">
                  <th className="px-5 py-3 font-medium">Nom complet</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Téléphone</th>
                  <th className="px-5 py-3 font-medium">Poste</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-gray-400">Aucun employé trouvé.</td></tr>
                ) : (
                  filtered.map((e, index) => (
                    <tr key={e.id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-primary-50/40 dark:hover:bg-gray-700/40 transition-colors animate-fadeInUp" style={{ animationDelay: `${index * 40}ms` }}>
                      <td className="px-5 py-3 font-medium text-gray-800 dark:text-white">{e.prenom} {e.nom}</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{e.email}</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{e.telephone}</td>
                      <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{e.poste}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${e.statut === 'Actif' ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/40 dark:text-primary-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                          {e.statut}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right space-x-2 whitespace-nowrap">
                        <button onClick={() => openEditModal(e)} className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium">Modifier</button>
                        <button onClick={() => setDeleteTarget(e)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium">Supprimer</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? "Modifier l'employé" : "Ajouter un employé"}>
        <EmployeForm initialData={editingItem} onSubmit={handleFormSubmit} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Confirmer la suppression">
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
          Voulez-vous vraiment supprimer <strong>{deleteTarget?.prenom} {deleteTarget?.nom}</strong> ?
        </p>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Annuler</button>
          <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">Supprimer</button>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default Employes;