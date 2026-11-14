// MapLibre 6 calcule l'adresse de son worker à l'exécution
// (new URL('./maplibre-gl-worker.mjs', import.meta.url), nom construit dynamiquement) :
// Vite ne peut pas la repérer, n'émet pas le fichier, et en production le worker répond 404.
// Sans worker, aucune tuile n'est décodée : la carte reste vierge, seuls les marqueurs
// (éléments HTML) s'affichent. On fait donc empaqueter le worker par Vite et on impose son adresse.
import { setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

setWorkerUrl(workerUrl);
