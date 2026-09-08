import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { ThemeContextType } from '../types';

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit être utilisé à l\'intérieur d\'un ThemeProvider');
  }
  return context;
};