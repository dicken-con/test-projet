import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/orbit.css';
import logoGreen from '../assets/logo-green.svg';
import PharmaBackgroundAnimation from '../composants/PharmaBackgroundAnimation';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-primary-50 via-white to-primary-100 flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      <PharmaBackgroundAnimation />

      <div className="relative z-10 flex flex-col items-center">
        <img src={logoGreen} alt="Logo PharmaLink" className="h-16 w-auto mb-2" />
        <h1 className="text-3xl font-bold text-gray-800 mb-1">PharmaLink</h1>
        <p className="text-gray-500 text-sm mb-16 text-center max-w-md">
          Choisissez ce que vous souhaitez faire
        </p>

        <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-full bg-primary-600/10 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl shadow-lg">
              💊
            </div>
          </div>

          <div className="absolute w-full h-full rounded-full border-2 border-dashed border-primary-200"></div>

          <div className="absolute orbit-btn-a">
            <button
              onClick={() => navigate('/login')}
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm flex items-center justify-center text-center p-4 shadow-xl transition-colors"
            >
              Gérer sa pharmacie
            </button>
          </div>

          <div className="absolute orbit-btn-b">
            <button
              onClick={() => navigate('/recherche-medicament')}
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white border-2 border-primary-600 hover:bg-primary-50 text-primary-700 font-semibold text-sm flex items-center justify-center text-center p-4 shadow-xl transition-colors"
            >
              Rechercher un produit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;