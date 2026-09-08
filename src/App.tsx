import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import RechercheMedicament from './pages/RechercheMedicament';
import Dashboard from './pages/Dashboard';
import Medicaments from './pages/Medicaments';
import Employes from './pages/Employes';
import Profil from './pages/Profil';
import Parametres from './pages/Parametres';
import Contact from './pages/Contact';
import ProtectedRoute from './composants/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/recherche-medicament" element={<RechercheMedicament />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/medicaments" element={<ProtectedRoute><Medicaments /></ProtectedRoute>} />
      <Route path="/employes" element={<ProtectedRoute><Employes /></ProtectedRoute>} />
      <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
      <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
      <Route path="/parametres" element={<ProtectedRoute><Parametres /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;