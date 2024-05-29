# Projet-L3

## Instructions d'installation

1. Télécharger le projet
2. Ajouter le .env dans la racine du projet
3. Exécuter `npm install`
4. Exécuter `npm run dev`
5. Aller sur http://localhost:5173/

## Structure du projet

```
Projet-L3/
├─ src/                             // contient le code de l'application
│  ├─ lib/                          // ensemble des composants
│  │  ├─ content/                   // composants principaux d'interaction
│  │  ├─ files/                     // composants de gestion de fichiers
│  │  ├─ login/                     // composants de connexion/création de compte
│  │  ├─ misc/                      // assets divers
│  │  ├─ sidebar/                   // composants de la sidebar
│  │  ├─ widgets/                   // composants des widgets
│  │  ├─ firebase.js                // connexion à Firebase
│  │  ├─ Icon.svelte                // composant d'icones SVG
│  │  └─ function.js                // fonctions d'appel au SGBD MySQL
│  ├─ routes/
│  │  └─ +page.svelte               // routeur de l'application
│  ├─ app.d.ts
│  ├─ app.html                      // page principale + fond d'écran animé
│  ├─ global.css                    // classes CSS globales
│  └─ store.js                      // déclaration des variables 'writable' Svelte
├─ static/
│  └─ favicon.png                   // icone d'onglet de l'application
├─ tests/
├─ .gitignore
├─ package.json
└─ README.md
```

## Annexes

**Rapport de stage** : https://docs.google.com/document/d/1nRO5l_HmjnMr34_bVxar0nRPntMR-OIBWzhNlwiCYKE/edit?usp=sharing

**Diaporama de la soutenance** : https://docs.google.com/presentation/d/1a_GKb5c_qd89r6f-qNeZ4DZoikS-JEgE3b11MJYYtSQ/edit?usp=sharing
