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
        exclude: ['src/test/**', 'src/**/*.test.{ts,tsx}', 'src/main.tsx', 'src/**/*.d.ts'],
        // Plancher de non-régression : à relever à mesure que les pages sont couvertes.
        // Recalé au passage à vitest 5 : le remappage V8 fondé sur l'AST (vitest ≥ 4) mesure autrement
        // (lignes 71,6 % → 94,0 %, branches 85,2 % → 82,1 % à code constant).
        thresholds: { lines: 92, statements: 90, functions: 85, branches: 81 },
      },
    },
  }
})
