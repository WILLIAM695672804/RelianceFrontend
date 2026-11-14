import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Garde-fou : un build de production sans API configurée ciblerait 127.0.0.1 chez chaque visiteur.
  if (command === 'build' && mode === 'production') {
    const env = loadEnv(mode, process.cwd(), 'VITE_')
    const erreurs = []
    if (!env.VITE_API_URL?.startsWith('https://')) erreurs.push('VITE_API_URL doit être définie et en https')
    if (env.VITE_PUSHER_SCHEME !== 'https') erreurs.push('VITE_PUSHER_SCHEME doit valoir https (wss)')
    if (!env.VITE_PUSHER_APP_KEY || env.VITE_PUSHER_APP_KEY === 'reliance-key') erreurs.push('VITE_PUSHER_APP_KEY doit être la clé de production')
    if (erreurs.length) {
      throw new Error(`Configuration de production incomplète (voir .env.example) :\n  - ${erreurs.join('\n  - ')}`)
    }
  }

  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          // Bibliothèques stables dans des fichiers distincts : mieux mises en cache d'une version à l'autre.
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            realtime: ['laravel-echo', 'pusher-js'],
            maplibre: ['maplibre-gl'],
          },
        },
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      css: false,
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        // App.tsx : table de routage (chargements différés), vérifiée par routes.contract.test.ts.
        exclude: ['src/test/**', 'src/**/*.test.{ts,tsx}', 'src/main.tsx', 'src/App.tsx', 'src/**/*.d.ts'],
        // Plancher de non-régression : à relever à mesure que les pages sont couvertes.
        // Recalé au passage à vitest 5 : le remappage V8 fondé sur l'AST (vitest ≥ 4) dénombre davantage
        // de branches et de fonctions (à code constant : branches 85,2 % → 63,9 %, fonctions 78,4 % → 67,1 %).
        thresholds: { lines: 72, statements: 70, functions: 66, branches: 63 },
      },
    },
  }
})
