/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac',
          400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d',
          800: '#166534', 900: '#14532d',
        },
      },
      backgroundImage: {
        'mortar-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Cpath d='M40 150c0 16 13 26 30 26s30-10 30-26H40z'/%3E%3Crect x='60' y='120' width='20' height='35' rx='6' transform='rotate(20 70 137)'/%3E%3Cpath d='M67 130 L60 108' stroke='%23ffffff' stroke-width='5' stroke-linecap='round'/%3E%3Cpath d='M65 143h10M70 138v10' stroke='%2315803d' stroke-width='3' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        scaleIn: 'scaleIn 0.2s ease-out',
        fadeInUp: 'fadeInUp 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}