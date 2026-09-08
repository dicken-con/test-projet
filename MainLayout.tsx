import React from 'react';
import Navbar from '../composants/Navbar';

interface MainLayoutProps {
  title: string;
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ title, children }) => {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <div
        className="min-h-[calc(100vh-5rem)] bg-no-repeat bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.stockcake.com/public/7/2/0/720d6097-e589-40b9-90e0-c2b226bd8a3d_large/pharmacy-aisle-view-stockcake.jpg')",
        }}
      >
        <div className="min-h-[calc(100vh-5rem)] bg-gray-50/88 dark:bg-gray-900/92">
          <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">{title}</h2>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;