/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // ⚠️ preflight désactivé : on N'APPLIQUE PAS le reset global de Tailwind,
  // pour ne pas écraser le style déjà construit (variables.css, classes cw-*/ps-*…).
  // Seules les classes utilitaires Tailwind deviennent disponibles, en complément.
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        // Tokens custom utilisés dans les pages écrites en Tailwind
        // (alignés sur la palette --tech-* / Material You du projet)
        primary: '#29446c',
        secondary: '#1960a3',
        tertiary: '#00693d',
        'primary-container': '#425b85',
        'tertiary-container': '#00693d',
        'on-tertiary-container': '#81e8a9',
        'tertiary-fixed': '#a6f4c5',
        'on-tertiary-fixed': '#002111',
        'surface-container': '#e5e9eb',
        'on-surface-color': '#181c1e',
        'on-surface-variant': '#6B7280',
      },
      fontFamily: {
        headline: ['Manrope', 'Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
