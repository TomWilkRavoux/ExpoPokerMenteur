# 🏗️ Architecture du Projet Poker Menteur

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Structure du projet](#structure-du-projet)
3. [Backend (Game Engine)](#backend-game-engine)
4. [Frontend (Expo/React Native)](#frontend-exporeact-native)
5. [Types partagés](#types-partagés)
6. [Flux de données](#flux-de-données)
7. [Diagrammes](#diagrammes)

---

## Vue d'ensemble

```
┌─────────────────┐      WebSocket      ┌─────────────────┐
│    Frontend     │ ◄─────────────────► │    Backend      │
│  (React Native) │                     │  (Node.js)      │
└─────────────────┘                     └─────────────────┘
        │                                        │
        │        Types partagés (shared/)        │
        └────────────────────────────────────────┘
```

**Stack technique :**
- **Frontend** : React Native + Expo + Zustand + Socket.IO Client
- **Backend** : Node.js + Express + Socket.IO + TypeScript
- **Communication** : WebSocket (temps réel)

---

## Structure du projet

```
poker-menteur/
├── backend/                    # Game Engine (Serveur)
│   ├── src/
│   │   ├── engine/            # Logique métier du jeu
│   │   ├── models/            # Entités (Carte, Joueur)
│   │   └── services/          # Services (Socket.IO)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Application mobile
│   ├── src/
│   │   ├── screens/           # Écrans de l'app
│   │   ├── services/          # Client Socket.IO
│   │   ├── stores/            # Zustand stores
│   │   └── shared/            # Types partagés (copié)
│   ├── App.tsx                # Point d'entrée
│   └── package.json
│
├── shared/                     # Types & constantes (source)
│   └── types.ts
│
└── ARCHITECTURE.md            # Ce fichier
```

---

## Backend (Game Engine)

### 📁 `backend/src/engine/`

#### `GameEngine.ts`
**Rôle :** Cœur du jeu, orchestre toute la logique métier

**Fonctions principales :**
- Création/gestion des parties
- Gestion des joueurs (ajout, suppression, élimination)
- Déroulement des manches
- Validation des annonces
- Résolution des disputes ("Menteur !")

**Méthodes clés :**
```typescript
addPlayer()           // Ajoute un joueur à la partie
startGame()           // Démarre la partie
announceCombination() // Valide une annonce
callLiar()           // Gère l'accusation
resolveRound()       // Résout la manche
initRound()          // Initialise une manche
prepareNextRound()   // Prépare la manche suivante
```

**Dépendances :**
- `DeckManager` - Gestion du deck
- `CombinationEvaluator` - Évaluation des combinaisons
- `PlayerModel` - Gestion des joueurs

---

#### `DeckManager.ts`
**Rôle :** Gestion du deck de cartes

**Fonctions :**
- Création d'un nouveau deck (52 cartes ou 32 si 5 joueurs)
- Mélange des cartes
- Distribution des cartes
- Gestion des cartes retournées

**Méthodes :**
```typescript
createNewDeck()      // Crée un deck selon la config
shuffle()            // Mélange le deck
draw()               // Pioche 1 carte
drawMultiple(n)      // Pioche n cartes
addCards(cards)      // Remet des cartes dans le deck
```

---

#### `CombinationEvaluator.ts`
**Rôle :** Évaluation des combinaisons poker

**Fonctions :**
- Détecte toutes les combinaisons possibles dans un ensemble de cartes
- Vérifie si une annonce est valide
- Compare la force des combinaisons

**Méthodes :**
```typescript
evaluate(cards)              // Retourne toutes les combinaisons trouvées
hasCombination(cards, combo) // Vérifie si une combinaison existe
isStrongerThan(a, b)         // Compare deux combinaisons
findPairs()                  // Détecte les paires
findThreeOfAKind()           // Détecte les brelans
// ... etc
```

**Hiérarchie des combinaisons :**
1. Carte Haute → 2. Paire → 3. Double Paire → 4. Brelan → 5. Suite → 6. Couleur → 7. Full → 8. Carré → 9. Quinte Flush

---

### 📁 `backend/src/models/`

#### `Card.ts`
**Rôle :** Modèle de données pour une carte

**Propriétés :**
- `suit` : Couleur (♥️ ♦️ ♣️ ♠️)
- `rank` : Valeur (2-10, J, Q, K, A)
- `value` : Valeur numérique (2-14)

**Méthodes :**
```typescript
static createDeck(excludedRanks)  // Crée un deck
static shuffle(deck)              // Mélange
```

---

#### `Player.ts`
**Rôle :** Modèle de données pour un joueur

**Propriétés :**
- `id` : Identifiant unique
- `name` : Nom du joueur
- `hand` : Main (cartes en possession)
- `cardCount` : Nombre de cartes
- `status` : ACTIVE / DANGER / ELIMINATED
- `isHost` : Est l'hôte de la partie
- `isActive` : Toujours en jeu

**Méthodes :**
```typescript
addCard(card)        // Ajoute une carte
addCards(cards)      // Ajoute plusieurs cartes
clearHand()          // Vide la main
eliminate()          // Élimine le joueur
updateStatus()       // Met à jour le statut
```

---

### 📁 `backend/src/services/`

#### `SocketService.ts`
**Rôle :** Gestion des connexions WebSocket

**Fonctions :**
- Gère les connexions/déconnexions des clients
- Route les événements entre clients et GameEngine
- Diffuse les mises à jour d'état à tous les joueurs

**Événements gérés :**
```typescript
// Reçus du client
CREATE_GAME          // Créer une partie
JOIN_GAME            // Rejoindre une partie
START_GAME           // Démarrer
ANNOUNCE_COMBINATION // Annoncer
CALL_LIAR           // Dire "Menteur !"

// Envoyés aux clients
GAME_CREATED
GAME_STARTED
COMBINATION_ANNOUNCED
RESOLUTION_PHASE
ROUND_RESOLVED
GAME_ENDED
ERROR
```

---

### 📄 `backend/src/index.ts`
**Rôle :** Point d'entrée du serveur

- Initialise Express
- Configure Socket.IO
- Démarre le serveur sur le port 3001

---

## Frontend (Expo/React Native)

### 📁 `frontend/src/screens/`

#### `LobbyScreen.tsx`
**Rôle :** Écran d'accueil et de lobby

**Fonctionnalités :**
- Création d'une partie
- Rejoindre une partie existante
- Liste des joueurs connectés
- Configuration du deck (52 ou 32 cartes)
- Lancement de la partie (hôte uniquement)

**État local :**
```typescript
playerName    // Nom du joueur
gameIdInput   // ID de la partie à rejoindre
isJoining     // Mode "rejoindre" actif
```

---

#### `GameScreen.tsx`
**Rôle :** Écran principal de jeu

**Fonctionnalités :**
- Affichage de la table avec tous les joueurs
- Visualisation de sa propre main
- Annonce d'une combinaison
- Bouton "Menteur !"
- Phase de résolution (cartes révélées)

**État local :**
```typescript
showCombinationModal  // Affichage du modal d'annonce
selectedType          // Type de combinaison choisi
selectedRank          // Valeur choisie
resolutionData        // Données de la phase de résolution
```

**Composants UI :**
- Liste des joueurs (avec indicateur de tour)
- Affichage de la dernière annonce
- Modal de sélection de combinaison
- Cartes révélées (phase de résolution)

---

#### `GameEndScreen.tsx`
**Rôle :** Écran de fin de partie

**Fonctionnalités :**
- Affichage du gagnant
- Historique des manches
- Boutons "Rejouer" / "Quitter"

---

### 📁 `frontend/src/services/`

#### `socket.ts`
**Rôle :** Client Socket.IO

**Fonctions :**
- Connexion au serveur WebSocket
- Émission d'événements vers le serveur
- Réception d'événements du serveur
- Gestion des listeners

**Méthodes :**
```typescript
connect()                    // Connexion au serveur
disconnect()                 // Déconnexion
createGame(playerName)       // Créer une partie
joinGame(gameId, name)       // Rejoindre
startGame(gameId)            // Démarrer
announceCombination(gameId, combo)  // Annoncer
callLiar(gameId)             // Dire "Menteur !"
on(event, callback)          // Écouter un événement
```

---

### 📁 `frontend/src/stores/`

#### `gameStore.ts`
**Rôle :** Store global Zustand pour l'état du jeu

**État :**
```typescript
gameState     // État complet de la partie
playerId      // ID du joueur courant
gameId        // ID de la partie
isLoading     // Chargement en cours
error         // Message d'erreur
```

**Actions :**
```typescript
setGameState(state)   // Met à jour l'état du jeu
setPlayerId(id)       // Définit l'ID joueur
setGameId(id)         // Définit l'ID partie
reset()               // Réinitialise tout
```

**Selectors :**
```typescript
getCurrentPlayer()    // Joueur courant
getActivePlayers()    // Joueurs actifs
isCurrentPlayer()     // Est-ce mon tour ?
isHost()              // Suis-je l'hôte ?
canStartGame()        // Peut-on démarrer ?
```

---

### 📄 `frontend/App.tsx`
**Rôle :** Point d'entrée de l'application

**Fonctions :**
- Configure la navigation (React Navigation)
- Définit les écrans disponibles
- Gère la navigation automatique selon l'état du jeu
- Fournit le SafeAreaProvider

**Navigation :**
```
Lobby → Game → GameEnd
```

---

## Types partagés

### 📄 `shared/types.ts` (et `frontend/src/shared/types.ts`)
**Rôle :** Définitions TypeScript partagées

**Énumérations :**
```typescript
GameState          // WAITING, INIT_ROUND, PLAYING, RESOLUTION, ROUND_END, GAME_END
CardSuit           // ♥️ ♦️ ♣️ ♠️
CardRank           // 2-10, J, Q, K, A
CombinationType    // HIGH_CARD, PAIR, TWO_PAIR, etc.
PlayerStatus       // ACTIVE, DANGER, ELIMINATED
```

**Interfaces :**
```typescript
Card               // Une carte
Player             // Un joueur
Combination        // Une combinaison annoncée
Announcement       // Une annonce faite par un joueur
GameStateData      // État complet d'une partie
GameConfig         // Configuration de la partie
```

**Constantes :**
```typescript
DEFAULT_GAME_CONFIG    // Config par défaut
FIVE_PLAYER_CONFIG     // Config pour 5 joueurs (32 cartes)
COMBINATION_HIERARCHY  // Ordre de force des combinaisons
RANK_VALUES           // Valeurs numériques des rangs
```

---

## Flux de données

### 1. Création d'une partie

```
┌──────────┐     CREATE_GAME      ┌──────────┐
│ Frontend │ ───────────────────► │ Backend  │
│ (Joueur) │                      │ (Server) │
└──────────┘                      └────┬─────┘
                                       │
                                       ▼
                              ┌────────────────┐
                              │  GameEngine    │
                              │  addPlayer()   │
                              └───────┬────────┘
                                      │
┌──────────┐     GAME_CREATED        │
│ Frontend │ ◄───────────────────────┘
│ (Joueur) │     + gameState
└──────────┘
```

### 2. Annonce d'une combinaison

```
┌──────────┐   ANNOUNCE_COMBINATION   ┌──────────┐
│ Frontend │ ───────────────────────► │ Backend  │
│ (Joueur) │   { gameId, combination} │ (Server) │
└──────────┘                          └────┬─────┘
                                           │
                                           ▼
                                  ┌────────────────┐
                                  │ GameEngine     │
                                  │ validate +     │
                                  │ announce()     │
                                  └───────┬────────┘
                                          │
                          ┌───────────────┼───────────────┐
                          ▼               ▼               ▼
                   ┌──────────┐    ┌──────────┐    ┌──────────┐
                   │ Joueur 1 │    │ Joueur 2 │    │ Joueur 3 │
                   │(Annonceur)│   │(Suivant) │    │(Attente) │
                   └──────────┘    └──────────┘    └──────────┘
```

### 3. Résolution "Menteur !"

```
┌──────────┐     CALL_LIAR        ┌──────────┐
│ Frontend │ ───────────────────► │ Backend  │
│(Accuseur)│                      │ (Server) │
└──────────┘                      └────┬─────┘
                                       │
                                       ▼
                              ┌────────────────┐
                              │ GameEngine     │
                              │ callLiar()     │
                              │ - Vérifie      │
                              │ - Détermine    │
                              │   perdant      │
                              └───────┬────────┘
                                      │
                                      ▼
                              ┌────────────────┐
                              │RESOLUTION_PHASE│
                              │ { isLiar,      │
                              │   allCards,    │
                              │   loserId }    │
                              └───────┬────────┘
                                      │
                                      ▼
                          ┌───────────────────────┐
                          │   TOUS LES JOUEURS    │
                          │   (voir les cartes)   │
                          └───────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
              ┌─────────┐      ┌──────────┐      ┌──────────┐
              │ Après   │      │ROUND_    │      │NEW_ROUND │
              │ 3 sec   │      │RESOLVED  │      │(si jeu   │
              │         │      │          │      │continue) │
              └────┬────┘      └────┬─────┘      └────┬─────┘
                   │                │                 │
                   └────────────────┴─────────────────┘
```

### 4. Cycle complet d'une manche

```
INIT_ROUND ──► PLAYING ──► Annonce ──► Annonce ──► ... ──► Menteur !
                                            │                  │
                                            └──────────────────┘
                                                               ▼
                                                    RESOLUTION ──► ROUND_END
                                                                         │
                                                                         ▼
                                                              Nouvelle manche
                                                              (ou GAME_END)
```

---

## Diagrammes

### Architecture complète

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (Expo)                            │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │ LobbyScreen  │  │  GameScreen  │  │ GameEndScreen│               │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘               │
│         │                 │                 │                       │
│         └─────────────────┼─────────────────┘                       │
│                           │                                         │
│                    ┌──────▼───────┐                                 │
│                    │  gameStore   │                                 │
│                    │   (Zustand)  │                                 │
│                    └──────┬───────┘                                 │
│                           │                                         │
│                    ┌──────▼───────┐                                 │
│                    │socket.ts     │                                 │
│                    │(Socket.IO    │                                 │
│                    │   Client)    │                                 │
│                    └──────┬───────┘                                 │
└───────────────────────────┼─────────────────────────────────────────┘
                            │ WebSocket
                            ▼
┌────────────────────────────────────────────────────────────────────┐
│                          BACKEND (Node.js)                         │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │                    SocketService                         │      │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │      │
│  │  │on CREATE_GAME│  │on ANNOUNCE_ │  │on CALL_LIAR     │  │      │
│  │  │on JOIN_GAME  │  │  COMBINATION│  │                 │  │      │
│  │  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘   │      │
│  └─────────┼────────────────┼──────────────────┼────────────┘      │
│            │                │                  │                   │
│            └────────────────┼──────────────────┘                   │
│                             │                                      │
│                      ┌──────▼───────┐                              │
│                      │  GameEngine  │                              │
│                      │  ┌─────────┐ │                              │
│                      │  │addPlayer│ │                              │
│                      │  │announce │ │                              │
│                      │  │callLiar │ │                              │
│                      │  │resolve  │ │                              │
│                      │  │...      │ │                              │
│                      │  └────┬────┘ │                              │
│                      └───┬───┬───┬───┘                             │
│                          │   │   │                                 │
│              ┌───────────┘   │   └───────────┐                     │
│              ▼               ▼               ▼                     │
│       ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│       │DeckManager │  │Combination │  │  Models    │               │
│       │            │  │Evaluator   │  │(Card,Player)│              │
│       └────────────┘  └────────────┘  └────────────┘               │
└────────────────────────────────────────────────────────────────────┘
```

### Structure des données

```
GameStateData
├── id: string                    # ID unique de la partie
├── state: GameState              # État actuel
├── players: Player[]             # Liste des joueurs
│   ├── id: string
│   ├── name: string
│   ├── hand: Card[]              # Main (seulement pour le joueur)
│   ├── cardCount: number         # Nombre de cartes (public)
│   ├── status: PlayerStatus      # ACTIVE / DANGER / ELIMINATED
│   ├── isHost: boolean
│   └── isActive: boolean
├── currentPlayerId: string       # Joueur dont c'est le tour
├── lastAnnouncement: Announcement
│   ├── playerId: string
│   ├── playerName: string
│   ├── combination: Combination
│   │   ├── type: CombinationType
│   │   ├── rank: CardRank
│   │   └── value: number
│   └── timestamp: number
├── round: number                 # Numéro de manche
├── config: GameConfig            # Configuration
└── history: GameEvent[]          # Historique des événements
```

---

## Règles métier implémentées

### Distribution des cartes
- **2-4 joueurs** : 52 cartes (2 à As)
- **5 joueurs** : 32 cartes (7 à As uniquement)
- Chaque joueur reçoit **1 carte** au début de chaque manche

### Pénalités
- Le perdant d'une manche pioche **1 carte supplémentaire**
- Le perdant commence la manche suivante
- À **5 cartes**, le joueur est éliminé

### Ordre de jeu
1. Premier joueur : celui qui a créé la partie (manche 1)
2. Manches suivantes : le perdant de la manche précédente
3. Rotation : sens horaire

### Hiérarchie des combinaisons
Les combinaisons doivent être **strictement supérieures** à la précédente.

Ordre croissant :
1. Carte Haute (avec valeur)
2. Paire
3. Double Paire
4. Brelan
5. Suite
6. Couleur
7. Full
8. Carré
9. Quinte Flush

### Fin de partie
- Dernier joueur non éliminé = **Gagnant**
- Ou : 1 seul joueur restant après éliminations

---

## Fichiers de configuration

### `backend/package.json`
Dépendances principales :
- `express` : Serveur HTTP
- `socket.io` : WebSocket
- `uuid` : Génération d'IDs
- `tsx` : Exécution TypeScript

### `frontend/package.json`
Dépendances principales :
- `expo` : Framework React Native
- `@react-navigation/*` : Navigation
- `socket.io-client` : Client WebSocket
- `zustand` : State management

### `tsconfig.json`
Configuration TypeScript pour chaque package (frontend/backend).

---

## Conseils de développement

### Ajouter une nouvelle fonctionnalité

1. **Backend** : Ajouter la logique dans `GameEngine.ts`
2. **Backend** : Ajouter l'événement dans `SocketService.ts`
3. **Frontend** : Ajouter l'appel dans `socket.ts`
4. **Frontend** : Gérer l'événement dans l'écran concerné
5. **Types** : Mettre à jour `shared/types.ts` si nécessaire

### Débogage

**Côté serveur :**
```bash
cd backend
npm run dev  # Mode watch avec logs
```

**Côté client :**
- Ouvrir les DevTools (F12)
- Voir l'onglet Console pour les logs
- Utiliser React DevTools pour le state

### Tests manuels

1. Créer une partie (2+ joueurs)
2. Vérifier la distribution des cartes
3. Tester les annonces
4. Tester le "Menteur !"
5. Vérifier les pénalités
6. Tester l'élimination à 5 cartes

---

## Ressources utiles

- [Documentation Expo](https://docs.expo.dev/)
- [Socket.IO](https://socket.io/docs/)
- [Zustand](https://docs.pmnd.rs/zustand/)
- [Règles du Poker Menteur (Liar's Poker)](https://en.wikipedia.org/wiki/Liar%27s_poker)

---

*Documentation générée le 9 février 2026*
