# Weline — Mobile client

[🇬🇧 English](#english) · [🇫🇷 Français](#francais)

<a id="english"></a>
## 🇬🇧 English

Source code of the Weline mobile client, built with React Native. It is the entry point for end users: sign up, sign in, and manage their place in virtual queues.

### Tech stack

- **Framework:** React Native
- **Language:** JavaScript (with TypeScript support)
- **Navigation:** React Navigation
- **API client:** Axios
- **Secure storage:** React Native Keychain
- **Target platform (MVP):** Android

### Prerequisites

A correctly configured development environment is **required** — follow the official React Native guide (**React Native CLI Quickstart**, **Android**). The critical points:

- **Node.js** (LTS) & npm
- **JDK 17 — exactly.** Newer versions such as JDK 21 are not yet supported by the current React Native toolchain. [Temurin 17 (LTS)](https://adoptium.net/temurin/releases/?version=17) is recommended.
- **Android Studio** — for the Android SDK and emulators.
- **Environment variables:**
    - `ANDROID_HOME` — your Android SDK folder (e.g. `C:\Users\YOUR_NAME\AppData\Local\Android\Sdk`).
    - `JAVA_HOME` — the root of your **JDK 17** install (e.g. `C:\Program Files\Java\jdk-17`).

### Install & run

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Geekers-Joel237/weline-mobile.git
    cd weline-mobile
    ```

2.  **Install JavaScript dependencies:**

    ```bash
    npm install
    ```

3.  **Start the backend** — the app needs [`weline-backend`](https://github.com/Geekers-Joel237/weline-backend) running in Docker:

    ```bash
    # in the backend project folder
    docker-compose up
    ```

4.  **Point the app at your machine** — the app must know your local IP to reach the Dockerised backend:

    - Find your local IP (on Windows: `ipconfig`).
    - Open `src/api/client.js`.
    - Set `YOUR_LOCAL_IP` to your address.

    ```javascript
    // src/api/client.js
    const YOUR_LOCAL_IP = '172.25.2.80'; // <-- your IP here
    const BASE_URL = `http://${YOUR_LOCAL_IP}:8088/api/v1`; // check the port (e.g. 8088)
    ```

5.  **Run on Android** — with an emulator running or a phone connected:

    ```bash
    npx react-native run-android
    ```

### Project structure

```
/src
├── api/          # API client (Axios), interceptors
├── assets/       # Images, fonts
├── components/   # Reusable UI components (Button, Input...)
├── contexts/     # React contexts (AuthContext for session management)
├── navigation/   # Navigation stacks (AuthStack, AppStack)
├── screens/      # Main screens (LoginScreen, OTPScreen, HomeScreen...)
└── services/     # Non-UI logic (SecureStorage)
```

### Debugging

While the app runs on the emulator:

- **Developer menu:** `Ctrl + M`.
- **Reload:** press `R` twice.
- **JavaScript debugger (console & breakpoints):** open the developer menu → `Debug`; a browser tab opens; press `F12` and use the `Console` tab for your `console.log` output.
- **UI inspector (React DevTools):** in a new terminal at the project root, run `npx react-native-devtools`.

### MVP roadmap

- [x] **Epic 1: Project foundations & infrastructure** (backend side)
- [x] **Epic 2: User onboarding & authentication**
- [ ] **Epic 3: Queue core (user experience)**
- [ ] **Epic 4: Agent dashboard**

---

<a id="francais"></a>
## 🇫🇷 Français

Ce dépôt contient le code source du client mobile pour Weline, développé en React Native. Cette application est le point d'entrée pour les utilisateurs finaux souhaitant s'inscrire, se connecter et gérer leur position dans les files d'attente virtuelles.

### Stack Technique

  - **Framework :** React Native
  - **Langage :** JavaScript (avec support TypeScript)
  - **Navigation :** React Navigation
  - **Client API :** Axios
  - **Stockage Sécurisé :** React Native Keychain
  - **Plateforme Cible (MVP) :** Android

### Prérequis

Avant de pouvoir lancer le projet, il est **impératif** d'avoir un environnement de développement correctement configuré. Suivez le guide officiel de React Native (**React Native CLI Quickstart** pour **Android**).

Les points de configuration critiques sont :

  - **Node.js** (version LTS) & npm
  - **JDK (Java Development Kit) :** **Version 17 impérativement.** Les versions plus récentes comme JDK 21 ne sont pas encore supportées par la chaîne de compilation actuelle de React Native. Nous recommandons [Temurin 17 (LTS)](https://adoptium.net/temurin/releases/?version=17).
  - **Android Studio :** Requis pour l'installation du SDK Android et la gestion des émulateurs.
  - **Variables d'Environnement :**
      - `ANDROID_HOME` : Doit pointer vers le dossier de votre SDK Android (ex: `C:\Users\VOTRE_NOM\AppData\Local\Android\Sdk`).
      - `JAVA_HOME` : Doit pointer vers la racine de votre installation de **JDK 17** (ex: `C:\Program Files\Java\jdk-17`).

### Installation & Lancement

1.  **Cloner le dépôt :**

    ```bash
    git clone https://github.com/Geekers-Joel237/weline-mobile.git
    cd weline-mobile
    ```

2.  **Installer les dépendances JavaScript :**

    ```bash
    npm install
    ```

3.  **Lancer le Backend :**
    Cette application mobile a besoin du backend pour fonctionner. Assurez-vous que le projet `weline-backend` est en cours d'exécution via Docker.

    ```bash
    # Dans le dossier du projet backend
    docker-compose up
    ```

4.  **Configurer l'URL de l'API :**
    L'application mobile doit connaître l'adresse IP de votre machine pour communiquer avec le backend Docker.

      - Trouvez votre adresse IP locale (sur Windows, ouvrez CMD et tapez `ipconfig`).
      - Ouvrez le fichier `src/api/client.js`.
      - Modifiez la constante `YOUR_LOCAL_IP` avec votre adresse.

    ```javascript
    // src/api/client.js
    const YOUR_LOCAL_IP = '172.25.2.80'; // <-- Mettez votre IP ici
    const BASE_URL = `http://${YOUR_LOCAL_IP}:8088/api/v1`; // Assurez-vous que le port est correct (ex: 8088)
    ```

5.  **Lancer l'application sur Android :**
    Assurez-vous qu'un émulateur est lancé ou qu'un téléphone est connecté.

    ```bash
    npx react-native run-android
    ```

### Structure du Projet

Le code est organisé dans le dossier `/src` de la manière suivante pour une meilleure maintenabilité :

```
/src
├── api/          # Client API (Axios), intercepteurs
├── assets/       # Images, polices
├── components/   # Composants UI réutilisables (Bouton, Champ de saisie...)
├── contexts/     # Contexts React (AuthContext pour la gestion de session)
├── navigation/   # Piles de navigation (AuthStack, AppStack)
├── screens/      # Écrans principaux (LoginScreen, OTPScreen, HomeScreen...)
└── services/     # Logique non-UI (SecureStorage pour le stockage sécurisé)
```

### Outils de Débogage

Pendant que l'application tourne sur l'émulateur :

  - **Ouvrir le Menu Développeur :** Appuyez sur `Ctrl + M`.
  - **Recharger l'application :** Appuyez deux fois sur la touche `R` (`R`, `R`).
  - **Débogueur JavaScript (Console & Points d'arrêt) :**
    1.  Ouvrez le Menu Développeur et sélectionnez `Debug`.
    2.  Un onglet s'ouvre dans votre navigateur.
    3.  Appuyez sur `F12` pour ouvrir les outils de développement et allez sur l'onglet `Console` pour voir vos `console.log`.
  - **Inspecteur d'UI (React DevTools) :**
    1.  Ouvrez un nouveau terminal à la racine du projet.
    2.  Lancez la commande : `npx react-native-devtools`.

### Roadmap du MVP

  - [x] **Epic 1 : Fondations du Projet & Infrastructure** (Côté Backend)
  - [x] **Epic 2 : Onboarding & Authentification des Utilisateurs**
  - [ ] **Epic 3 : Le Cœur de la File d'Attente (Expérience Utilisateur)**
  - [ ] **Epic 4 : Le Dashboard de l'Agent**

