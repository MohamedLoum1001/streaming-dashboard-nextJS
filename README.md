# Sujet - Next.js Streaming Dashboard

## Informations Étudiant

- **Nom** : LOUM
- **Prénom** : Mohamed
- **École** : Paris Ynov Campus - Rendu @ynovzelab

# StreamDash v1.0

StreamDash est un tableau de bord SaaS analytique et communautaire moderne. L'application met en œuvre une architecture de rendu asynchrone isolée utilisant les dernières spécifications de **Next.js (App Router)** couplées à un backend headless **Strapi** hautement relationnel.

---

## Stack Technique

- **Framework Frontend :** Next.js 15+ (App Router, TypeScript, Tailwind CSS)
- **Backend Headless :** Strapi CMS (Base de données relationnelle SQLite / PostgreSQL)
- **Authentification :** JWT sécurisé via le plugin native Strapi _Users-Permissions_
- **Gestion du Rendu :** Streaming SSR, React Suspense Boundaries, et Server/Client Components isolés

---

## Fonctionnalités Majeures

- **Système d'Authentification Complet :** Pages d'inscription et de connexion étanches reliées au gestionnaire de jetons (JWT) de Strapi avec persistance locale sécurisée.
- **Flux Communautaire Réactif :** Création et publication de posts en temps réel avec liaison automatique à l'utilisateur connecté (Relation `Many-to-One`).
- **Système de Réponses Imbriquées :** Possibilité de commenter des publications spécifiques via un sélecteur dynamique lié en base de données (Relations croisées `Post ↔ Comment ↔ User`).
- **Streaming SSR & Performance :** Chargement indépendant et progressif des blocs de données (`Users`, `Posts`, `Comments`, `Todos`) grâce à l'implémentation fine de `React.Suspense`.
- **Modularité Client/Server :** Séparation stricte des composants pour préserver le rendu asynchrone côté serveur tout en isolant les interactions clients (comme la déconnexion ou la soumission de formulaires).

---

## Installation et Démarrage

### 1. Cloner le projet

```bash
git clone [https://github.com/MohamedLoum1001/streaming-dashboard-nextJS.git](https://github.com/MohamedLoum1001/streaming-dashboard-nextJS.git)
cd streaming-dashboard-nextJS
```
