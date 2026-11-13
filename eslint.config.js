import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Règles de compatibilité avec le React Compiler (eslint-plugin-react-hooks ≥ 7.1), que le projet
      // n'emploie pas : le chargement de données dans un useEffect reste correct à l'exécution.
      // Signalées sans bloquer, à résorber avant toute adoption du compilateur.
      'react-hooks/immutability': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      // Les contextes exportent leur fournisseur et leur hook : seul le rechargement à chaud en pâtit.
      'react-refresh/only-export-components': 'warn',
      // Dette de typage (≈ 160 any, surtout sur les réponses d'API) : signalée, à résorber par module.
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    // Doubles de test : any et réaffectation de variables de module y sont d'usage.
    files: ['**/*.test.{ts,tsx}', 'src/test/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/globals': 'off',
    },
  },
])
