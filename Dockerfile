# Interface de Reliance : compilée ici, puis servie par nginx.
#
# La compilation a lieu sur le serveur. Les valeurs VITE_* sont figées dans les
# fichiers produits — elles ne sont pas lues à l'exécution —, donc changer de
# domaine impose de recompiler.

FROM node:20-alpine AS interface
WORKDIR /interface

COPY package.json package-lock.json ./
# « npm ci » installe exactement le verrou, sans jamais le modifier.
RUN npm ci --no-audit --no-fund

COPY . .

ARG VITE_API_URL
ARG VITE_PUSHER_APP_KEY
ARG VITE_PUSHER_HOST
ARG VITE_PUSHER_PORT=443
ARG VITE_PUSHER_SCHEME=https

# Un fichier, et non des variables d'environnement : vite.config.ts contrôle la
# configuration de production avec loadEnv(), qui lit les fichiers .env. Un
# build sans VITE_API_URL en https échoue volontairement — sinon chaque
# visiteur verrait l'interface appeler 127.0.0.1.
RUN printf '%s\n' \
    "VITE_API_URL=${VITE_API_URL}" \
    "VITE_PUSHER_APP_KEY=${VITE_PUSHER_APP_KEY}" \
    "VITE_PUSHER_HOST=${VITE_PUSHER_HOST}" \
    "VITE_PUSHER_PORT=${VITE_PUSHER_PORT}" \
    "VITE_PUSHER_SCHEME=${VITE_PUSHER_SCHEME}" \
    > .env.production

# Deux cœurs et 4 Go partagés avec une autre application : sans cette borne, le
# ramasse-miettes de Node laisse l'empreinte grossir jusqu'à la mort du
# processus, et le message « Killed » n'explique rien.
ENV NODE_OPTIONS=--max-old-space-size=1536
RUN npm run build

FROM nginx:1.27-alpine
# nginx.conf vient du dépôt du backend, monté par la composition : il décrit le
# découpage entre l'interface, l'API et le WebSocket, qui concerne les deux.
COPY --from=interface /interface/dist /usr/share/nginx/html
EXPOSE 80
