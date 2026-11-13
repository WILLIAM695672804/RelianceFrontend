import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/queryClient'
import './index.css'
import App from './App.tsx'
import { protegerIcones } from './utils/protegerIcones'

// Les icônes Material Symbols sont des ligatures textuelles (« home », « edit »…) : sans cette protection,
// la traduction automatique du navigateur les traduit et casse l'affichage.
protegerIcones()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
