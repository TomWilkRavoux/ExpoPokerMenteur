# 🎮 Poker Menteur

Un jeu de Poker Menteur en temps réel avec React Native (Expo) et Node.js.

## 📁 Structure du projet

```
poker-menteur/
├── frontend/          # Application React Native (Expo)
├── backend/           # Serveur Node.js + Socket.IO
├── shared/            # Types et constantes partagés
└── README.md
```

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)

### Backend

```bash
cd backend
npm install
npm run dev
```

Le serveur démarre sur `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm install
npm start
```

Scannez le QR code avec l'application Expo Go sur votre téléphone, ou appuyez sur `w` pour la version web.

## 🎮 Règles du jeu

### Configuration

- **2-4 joueurs** : Deck de 52 cartes
- **5 joueurs** : Cartes 2-6 exclues (7 à As uniquement)

### Déroulement

1. **Manche** : Chaque joueur reçoit 1 carte secrète
2. **Tour de jeu** :
   - Annoncer une combinaison (doit être plus forte que la précédente)
   - Ou dire **"Menteur !"** pour défier l'annonce précédente
3. **Résolution** :
   - Si l'annonce était vraie → l'accusateur perd
   - Si l'annonce était fausse → l'annonceur perd
4. **Pénalité** : Le perdant pioche 1 carte
5. **Élimination** : Un joueur avec 5 cartes est éliminé
6. **Victoire** : Dernier joueur non éliminé

### Hiérarchie des combinaisons

1. Carte Haute
2. Paire
3. Double Paire
4. Brelan
5. Suite
6. Couleur
7. Full
8. Carré
9. Quinte Flush

## 🏗️ Architecture

### Frontend (Expo / React Native)

- **Screens** : Lobby, Game, GameEnd
- **Stores** : Zustand pour la gestion d'état
- **Services** : Socket.IO client
- **Components** : UI réutilisable

### Backend (Node.js)

- **GameEngine** : Logique métier centralisée
- **SocketService** : Gestion des connexions temps réel
- **Models** : Cartes, Joueurs
- **Utils** : Évaluateur de combinaisons poker

### États du jeu

```
WAITING → INIT_ROUND → PLAYING → RESOLUTION → ROUND_END → GAME_END
```

## 🔌 API Socket.IO

### Événements clients → serveur

| Événement | Données | Description |
|-----------|---------|-------------|
| `CREATE_GAME` | `{ playerName }` | Créer une nouvelle partie |
| `JOIN_GAME` | `{ gameId, playerName }` | Rejoindre une partie |
| `START_GAME` | `{ gameId }` | Démarrer la partie (host) |
| `ANNOUNCE_COMBINATION` | `{ gameId, combination }` | Annoncer une combinaison |
| `CALL_LIAR` | `{ gameId }` | Accuser de mentir |

### Événements serveur → clients

| Événement | Données | Description |
|-----------|---------|-------------|
| `GAME_CREATED` | `{ gameId, playerId, gameState }` | Partie créée |
| `GAME_JOINED` | `{ gameId, playerId, gameState }` | Rejoint la partie |
| `GAME_STARTED` | `{ gameState }` | Partie démarrée |
| `COMBINATION_ANNOUNCED` | `{ playerId, combination, gameState }` | Annonce faite |
| `RESOLUTION_PHASE` | `{ isLiar, allCards, loserId }` | Phase de résolution |
| `ROUND_RESOLVED` | `{ loserId, eliminated, gameState }` | Manche terminée |
| `GAME_ENDED` | `{ winnerId, history }` | Partie terminée |

## 📱 Screens

### Lobby (AVANT lancement)

- Liste des joueurs connectés
- Configuration du deck
- Bouton "Lancer la partie" (host uniquement)

### Game (EN JEU)

- Table avec les joueurs
- Annonce en cours
- Cartes du joueur
- Actions : Annoncer / Menteur

### Résolution

- Cartes révélées
- Résultat du défi
- Annonceur accusé

### Game End

- Gagnant
- Historique des manches
- Rejouer / Quitter

## 🛡️ Garanties de l'agent

- ✅ Aucune désynchronisation client / serveur
- ✅ Règles centralisées sur le serveur
- ✅ États de jeu déterministes
- ✅ UX claire et lisible

## 📝 License

MIT
