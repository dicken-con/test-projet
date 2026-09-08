import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Pill, AlertTriangle, Wallet, Package } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import StatCard from '../composants/StatCard';
import { medicamentsData } from '../data/medicaments';

const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0'];

const Dashboard: React.FC = () => {
  const totalMedicaments = medicamentsData.length;
  const stockFaible = medicamentsData.filter((m) => m.stock <= m.seuilAlerte).length;
  const valeurStock = medicamentsData.reduce((sum, m) => sum + m.prix * m.stock, 0);
  const totalUnites = medicamentsData.reduce((sum, m) => sum + m.stock, 0);

  const recentActivities = [
    { action: 'Ajout de stock', item: 'Paracétamol 500mg', time: 'Il y a 2h' },
    { action: 'Vente', item: 'Ibuprofène 400mg x3', time: 'Il y a 4h' },
    { action: 'Alerte stock faible', item: 'Amoxicilline 500mg', time: 'Il y a 6h' },
    { action: 'Nouveau fournisseur', item: 'NutriSanté', time: 'Hier' },
  ];

  const stockParMedicament = medicamentsData.map((m) => ({
    nom: m.nom.split(' ')[0],
    stock: m.stock,
  }));

  const categories = Array.from(new Set(medicamentsData.map((m) => m.categorie)));
  const repartitionCategories = categories.map((cat) => ({
    name: cat,
    value: medicamentsData.filter((m) => m.categorie === cat).length,
  }));

  return (
    <MainLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        <div className="animate-fadeInUp" style={{ animationDelay: '0ms' }}>
          <StatCard label="Médicaments" value={totalMedicaments} icon={Pill} trend="+2 ce mois" trendUp color="blue" />
        </div>
        <div className="animate-fadeInUp" style={{ animationDelay: '80ms' }}>
          <StatCard label="Stock faible" value={stockFaible} icon={AlertTriangle} trend="À réapprovisionner" trendUp={false} color="red" />
        </div>
        <div className="animate-fadeInUp" style={{ animationDelay: '160ms' }}>
          <StatCard label="Valeur du stock" value={`${valeurStock.toLocaleString()} FCFA`} icon={Wallet} trend="+8% ce mois" trendUp color="green" />
        </div>
        <div className="animate-fadeInUp" style={{ animationDelay: '240ms' }}>
          <StatCard label="Unités en stock" value={totalUnites} icon={Package} trend="Stable" trendUp color="orange" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Stock par médicament</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stockParMedicament}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="nom" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="stock" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Répartition par catégorie</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={repartitionCategories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={{ fontSize: 11 }}
              >
                {repartitionCategories.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-shadow hover:shadow-md">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Médicaments en stock critique</h3>
          <div className="space-y-3">
            {medicamentsData
              .filter((m) => m.stock <= m.seuilAlerte)
              .map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors hover:bg-red-100 dark:hover:bg-red-900/30">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white text-sm">{m.nom}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{m.categorie}</p>
                  </div>
                  <span className="text-red-600 dark:text-red-400 font-semibold text-sm">{m.stock} restants</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-shadow hover:shadow-md">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Activités récentes</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex flex-col border-l-2 border-primary-300 dark:border-primary-600 pl-3 py-1 transition-all hover:border-primary-600 dark:hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 rounded-r-md"
              >
                <p className="text-sm font-medium text-gray-800 dark:text-white">{activity.action}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.item}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;