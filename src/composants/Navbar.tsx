import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Pill,
  Users,
  User,
  Mail,
  Settings,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import logoWhite from '../assets/logo-white.svg';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Médicaments', path: '/medicaments', icon: Pill },
  { label: 'Employés', path: '/employes', icon: Users },
  { label: 'Profil', path: '/profil', icon: User },
  { label: 'Contact', path: '/contact', icon: Mail },
  { label: 'Paramètres', path: '/parametres', icon: Settings },
];

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initiale = user?.prenom?.charAt(0).toUpperCase() || 'A';

  return (
    <header className="sticky top-0 z-30 shadow-xl relative overflow-hidden bg-gradient-to-r from-primary-800 via-primary-600 to-primary-800 dark:from-gray-950 dark:via-gray-800 dark:to-gray-950">
      <div className="absolute inset-0 bg-mortar-pattern bg-repeat opacity-[0.15]"></div>
      <div className="absolute -top-16 left-1/4 w-64 h-64 bg-primary-300 rounded-full opacity-20 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 right-1/4 w-64 h-64 bg-white rounded-full opacity-10 blur-3xl pointer-events-none"></div>
      <div className="absolute left-0 bottom-0 w-full h-[3px] bg-gradient-to-r from-transparent via-primary-200 to-transparent"></div>

      <div className="relative z-10 px-4 sm:px-8">
        <div className="h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
          <h1 className="text-lg font-bold text-white flex items-center gap-2 shrink-0 tracking-wide">
              <img src={logoWhite} alt="Logo PharmaLink" className="h-9 w-auto" />
              PharmaLink
            </h1>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-white text-primary-700 dark:bg-gray-100 dark:text-gray-900 shadow-md'
                          : 'text-primary-100 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <Icon size={16} strokeWidth={2} />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="text-primary-100 hover:text-white transition-colors"
              title="Changer de thème"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white text-primary-700 flex items-center justify-center font-semibold text-sm shadow-inner">
                {initiale}
              </div>
              <span className="text-sm font-medium text-white hidden sm:inline">{user?.prenom || 'Admin'}</span>
            </div>

            <button
              onClick={handleLogout}
              className="text-primary-100 hover:text-white transition-colors"
              title="Se déconnecter"
            >
              <LogOut size={18} />
            </button>

            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="text-white lg:hidden"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden flex flex-col gap-1 pb-4 animate-fadeIn">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-white text-primary-700' : 'text-primary-100 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon size={16} strokeWidth={2} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;