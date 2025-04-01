# Arrosaje Mobile

Application mobile pour la gestion et l'entretien des plantes, développée avec React Native et Expo.

## Fonctionnalités

- 🌱 **Gestion des plantes**
  - Ajout, modification et suppression de plantes
  - Prise de photos de plantes
  - Ajout d'instructions d'entretien
  - Localisation des plantes

- 👤 **Gestion des utilisateurs**
  - Inscription et connexion
  - Profils botanistes et utilisateurs standard
  - Modification du profil

- 🤝 **Système de garde de plantes**
  - Demandes de garde de plantes
  - Acceptation des demandes par les botanistes
  - Suivi des plantes en cours de garde

- 💬 **Commentaires et instructions**
  - Échange d'informations entre propriétaires et botanistes
  - Conseils d'entretien
  - Historique des communications

## Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Émulateur Android/iOS ou un appareil physique avec Expo Go

## Installation

1. Cloner le dépôt
```bash
git clone <URL_du_dépôt>
cd arrosaje-mobile
```

2. Installer les dépendances
```bash
npm install
# ou
yarn install
```

3. Lancer l'application
```bash
npx expo start
```

4. Ouvrir l'application sur un émulateur ou un appareil avec Expo Go

## Configuration

L'application se connecte par défaut à un backend FastAPI sur `http://10.0.2.2:8000` pour l'émulateur Android. Si vous utilisez un appareil physique ou un autre environnement, modifiez l'URL dans `src/api/api.ts`.

## Structure du projet

```
arrosaje-mobile/
├── App.tsx                # Point d'entrée de l'application
├── src/
│   ├── api/               # Communication avec le backend
│   ├── components/        # Composants réutilisables
│   ├── contexts/          # Contextes React (Auth)
│   ├── hooks/             # Hooks personnalisés
│   ├── navigation/        # Configuration de la navigation
│   ├── screens/           # Écrans de l'application
│   ├── types/             # Types TypeScript
│   └── utils/             # Fonctions utilitaires
├── assets/                # Images et ressources
└── ...
```

## Fonctionnement avec le backend

Cette application mobile est conçue pour fonctionner avec le backend Arrosaje développé en FastAPI. Elle communique avec l'API via des requêtes HTTP pour:

- Authentifier les utilisateurs
- Récupérer, créer et modifier des plantes
- Gérer les demandes de soins
- Échanger des commentaires

Assurez-vous que le backend est en cours d'exécution et accessible avant d'utiliser l'application.

## Technologies utilisées

- **React Native**: Framework pour applications mobiles
- **Expo**: Plateforme simplifiant le développement React Native
- **TypeScript**: Typage statique pour JavaScript
- **React Navigation**: Navigation entre les écrans
- **React Native Paper**: Bibliothèque de composants UI
- **Axios**: Client HTTP pour les requêtes API
- **React Hook Form**: Gestion des formulaires
- **Yup**: Validation des données
- **Expo Image Picker**: Accès à la caméra et à la galerie
- **Expo Secure Store**: Stockage sécurisé pour les tokens