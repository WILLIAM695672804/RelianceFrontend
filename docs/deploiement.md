# Déploiement en production — RelianceFrontend

Application monopage (React, Vite) servie en fichiers statiques. Elle dialogue avec l'API Laravel
(cookie de session Sanctum) et avec le serveur WebSocket Reverb (protocole Pusher).

## 1. Configuration de compilation

Les adresses sont figées **à la compilation** : un changement d'API impose de recompiler.
Partir de `.env.example` et renseigner, dans `.env.production.local` ou dans les variables
d'environnement de la CI :

| Variable | Production |
|---|---|
| `VITE_API_URL` | `https://api.<domaine>` (sans `/api/v1`) |
| `VITE_PUSHER_APP_KEY` | valeur de `PUSHER_APP_KEY` du backend |
| `VITE_PUSHER_HOST` | hôte public du WebSocket (souvent celui de l'API) |
| `VITE_PUSHER_PORT` | `443` derrière le proxy inverse |
| `VITE_PUSHER_SCHEME` | `https` (connexion `wss`) |

`npm run build` **échoue** si l'API n'est pas en https, si le WebSocket n'est pas chiffré ou si la
clé de développement est employée (garde-fou de `vite.config.ts`).

Côté backend, ces valeurs doivent concorder : `FRONTEND_URL` = origine du frontend (CORS et liens
envoyés par courriel), `SANCTUM_STATEFUL_DOMAINS` = hôte du frontend, `SESSION_DOMAIN` = domaine
parent commun (ex. `.reliance.cm`) pour que le cookie de session soit partagé.

## 2. Compilation

```bash
npm ci
npm run build        # produit dist/
```

## 3. Service des fichiers (Nginx)

L'application utilise `BrowserRouter` : toute route inconnue du serveur doit renvoyer `index.html`,
faute de quoi un rechargement sur `/client/portefeuille` répond 404.

```nginx
server {
    listen 443 ssl http2;
    server_name app.reliance.cm;
    root /srv/reliance/frontend/dist;

    # Fichiers à empreinte (assets/*-<hash>.js|css) : cache long et immuable.
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        try_files $uri =404;
    }

    # Repli SPA ; index.html jamais mis en cache, pour qu'un déploiement soit visible aussitôt.
    location / {
        add_header Cache-Control "no-cache";
        try_files $uri $uri/ /index.html;
    }

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-Frame-Options "DENY" always;
    add_header Permissions-Policy "geolocation=(self), camera=(), microphone=()" always;
    # CSP déduite des origines appelées par le code (cartes, géocodage, itinéraires, avatars, polices).
    # Remplacer api.reliance.cm par l'hôte réel ; valider d'abord en Content-Security-Policy-Report-Only.
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://api.reliance.cm https://tiles.openfreemap.org https://images.unsplash.com https://api.dicebear.com https://ui-avatars.com https://upload.wikimedia.org https://via.placeholder.com; connect-src 'self' https://api.reliance.cm wss://api.reliance.cm https://tiles.openfreemap.org https://nominatim.openstreetmap.org https://router.project-osrm.org; worker-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" always;
}
```

`worker-src blob:` est requis par MapLibre ; `img-src data:` par le QR code de la double
authentification ; l'API figure dans `img-src` pour les pièces KYC et jointes (URL signées).

## 4. Vérifications après déploiement

1. Rechargement direct d'une route profonde (`/client/portefeuille`) : la page s'affiche (repli SPA).
2. Connexion : pas d'erreur 419 (cookie CSRF) ni 401 sur `/auth/me` (domaines Sanctum, `SESSION_DOMAIN`).
3. Console : connexion WebSocket en `wss://` établie, aucune violation CSP.
4. Une page avec carte : la carte s'affiche (MapLibre exige WebGL2 dans le navigateur).

## 5. Retour arrière

Les fichiers de `dist/assets/` portent une empreinte : conserver le `dist/` précédent et rebasculer
la racine Nginx (`ln -sfn`) suffit. `index.html` n'étant pas mis en cache, le retour est immédiat.

## 6. Points connus

- **Dette de typage** : environ 160 `any`, et des règles de compatibilité avec le React Compiler,
  sont signalés en avertissements par `npm run lint` (ils ne bloquent pas la CI).
- **Services tiers** sans contrat : `router.project-osrm.org` (démonstration, sans garantie de
  disponibilité) et `nominatim.openstreetmap.org` (politique d'usage restrictive) ; prévoir des
  instances dédiées pour un trafic de production.
