# Sujet - Next.js Streaming Dashboard

## Informations Étudiant

- **Nom** : [Ton Nom]
- **Prénom** : [Ton Prénom]
- **École** : Ynov - Rendu @ynovzelab
- **Date limite** : Avant le 30 juin 2026, 23h59

## Description du Projet

Ce projet consiste en la refactorisation de l'architecture de rendu d'un dashboard analytique pour une application de gestion de projets. L'objectif est d'utiliser le **Streaming SSR** à l'aide de l'**App Router** de Next.js et de balises granulaires `<Suspense>`.

### Fonctionnalités Clés :

1. **Rendu Progressif** : Chaque bloc de données s'affiche de manière indépendante dès que ses données sont prêtes (simulé par un délai réseau).
2. **Aucun blocage global** : La page principale ne s'interrompt pas pour attendre le composant le plus lent.
3. **Skeleton Loaders Dédiés** : Chaque bloc affiche son propre loader animé (`animate-pulse`) pendant l'attente du fetch.
4. **Zéro JavaScript Client pour la donnée** : Les données sont récupérées à 100% via des _Server Components_ (aucun `useEffect`, `fetch` client ou `'use client'`).
5. **Isolation des erreurs** : Le bloc `CommentsBlock` simule une erreur serveur. Elle est interceptée localement, permettant aux 3 autres blocs de fonctionner parfaitement.

## Délais simulés

- **UsersBlock** : 1 000 ms
- **CommentsBlock** : 1 500 ms (Simule un échec volontaire)
- **PostsBlock** : 2 000 ms
- **TodosBlock** : 3 000 ms

## Installation et Lancement

1. Installer les dépendances :
   ```bash
   npm install
   ```
