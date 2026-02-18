# Documentation des Routes : Espace Technicien V1

Ce document recense l'ensemble des écrans et fonctionnalités implémentés pour la partie Frontend de l'Espace Technicien.

## Architecture Globale
- **Base URL** : `/technicien`
- **Structure** : Layout avec Sidebar responsive (navigation par Hubs) et Header commun.
- **État** : Routes non sécurisées pour faciliter le développement et les tests.

---

## HUB 1 : Administration & Configuration
*Ce hub gère le profil technique et administratif du professionnel.*

| Route | Description & Fonctionnalités |
| :--- | :--- |
| `/technicien/competences` | **Matrice de Compétences**<br>- Sélection des métiers et spécialités.<br>- Définition du Tarif Horaire et des Frais de Déplacement.<br>- Upload de certificats/diplômes. |
| `/technicien/zone` | **Zone d'Intervention**<br>- Carte interactive pour définir le rayon d'action.<br>- Gestion des adresses de départ. |
| `/technicien/verification` | **Centre de Vérification (KYC)**<br>- Upload des pièces justificatives (CNI, Casier Judiciaire, RCP).<br>- Suivi du statut de validation (En attente, Validé, Rejeté). |
| `/technicien/abonnement` | **Abonnement & Facturation**<br>- Choix du plan (Free, Starter, Pro).<br>- Gestion des méthodes de paiement.<br>- Historique des factures de la plateforme. |

---

## HUB 2 : Cockpit Opérationnel
*Les outils du quotidien pour gérer l'activité en temps réel.*

| Route | Description & Fonctionnalités |
| :--- | :--- |
| `/technicien/dashboard` | **Dashboard Live (Accueil)**<br>- Interrupteur "En ligne / Hors ligne".<br>- Widgets Météo et Info Trafic.<br>- **Fil de Missions** : Apparition des nouvelles demandes avec compte à rebours. |
| `/technicien/planning` | **Planning & Disponibilités**<br>- Vue Calendrier (Semaine/Mois).<br>- Visualisation des missions acceptées.<br>- Ajout de créneaux d'indisponibilité. |

---

## HUB 3 : Gestion de Mission (Workflow)
*Le cycle de vie complet d'une intervention, de l'acceptation à la clôture.*

| Route | Description & Fonctionnalités |
| :--- | :--- |
| `/technicien/mission/:id` | **Détail Mission**<br>- Informations client et adresse.<br>- Carrousel photos du problème.<br>- Checklist de sécurité.<br>- Actions principales : "Je pars", "J'arrive", "Terminer". |
| `/technicien/mission/:id/route` | **GPS & Chat**<br>- Carte d'itinéraire (simulée avec lien Waze/Google Maps).<br>- Messagerie instantanée avec le client (avec réponse auto simulée). |
| `/technicien/mission/:id/devis` | **Éditeur de Devis**<br>- Création de devis pour travaux supplémentaires.<br>- Ajout dynamique de lignes (Designation, Qté, Prix).<br>- Calcul automatique des totaux et TVA.<br>- Simulation d'envoi au client. |
| `/technicien/mission/:id/travaux` | **Fin de Mission (Clôture)**<br>- Upload obligatoire de photos "Avant / Après".<br>- Checklist de fin de chantier (Propreté, Test ok).<br>- Signature numérique du client sur l'écran. |

---

## HUB 4 : Finance & Portefeuille
*Gestion des revenus et des flux financiers.*

| Route | Description & Fonctionnalités |
| :--- | :--- |
| `/technicien/wallet` | **Dashboard Wallet**<br>- Solde actuel et Revenus du mois.<br>- Graphique d'évolution des gains hebdomadaires.<br>- Liste rapide des dernières transactions. |
| `/technicien/wallet/retrait` | **Demande de Retrait**<br>- Interface de virement vers Mobile Money ou Banque.<br>- Calculateur de frais de retrait en temps réel (2%). |
| `/technicien/wallet/historique` | **Historique des Transactions**<br>- Tableau complet des mouvements.<br>- Filtres par type (Revenus, Retraits, Dépenses) et par date.<br>- Indication visuelle des status (Succès, En cours, Échec). |

---

## HUB 5 : Social & Réputation
*L'image du technicien et sa communauté.*

| Route | Description & Fonctionnalités |
| :--- | :--- |
| `/technicien/profil` | **Éditeur de Profil Public**<br>- Photo de couverture et Avatar.<br>- Rédaction de la Bio.<br>- Gestion du Portfolio (Galerie photo des réalisations).<br>- Affichage des statistiques publiques (Note, Missions, Ancienneté). |
| `/technicien/avis` | **Avis Clients**<br>- Synthèse des notes (Graphique en barres).<br>- Liste des commentaires clients.<br>- Interface de réponse aux avis. |
| `/technicien/social` | **Mur Communautaire**<br>- Fil d'actualité type réseau social pour les Pros.<br>- Filtres : Tout, Entraide, Annonces Officielles.<br>- Création de posts, Likes et Commentaires. |
| `/technicien/trophees` | **Gamification**<br>- Niveau du technicien et barre d'XP.<br>- Collection de Badges (Succès débloqués et à venir). |
