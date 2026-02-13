# 🎮 Intégration Pixel Art - Poker Menteur

Ce document résume tous les fichiers créés pour le design pixel art.

---

## ✅ Fichiers Créés

### 🎨 Styles et Thème
```
frontend/src/styles/
└── pixelTheme.ts          # Thème complet (couleurs, fonts, spacing)
```

### 🧩 Composants Pixel Art
```
frontend/src/components/pixel/
├── PixelButton.tsx        # Bouton avec effet pressé
├── PixelInput.tsx         # Input style rétro
├── PixelCard.tsx          # Carte à jouer
├── PlayerCard.tsx         # Carte info joueur
├── PixelModal.tsx         # Modale avec cadre décoratif
├── AnnouncementBanner.tsx # Bannière d'annonce
├── CombinationSelector.tsx# Sélecteur de combinaison
└── index.ts               # Exports
```

### 📱 Écrans Pixel Art
```
frontend/src/screens/
├── LobbyScreenPixel.tsx   # Écran d'accueil
├── GameScreenPixel.tsx    # Table de jeu
└── GameEndScreenPixel.tsx # Écran de victoire
```

### 🔧 Hooks
```
frontend/src/hooks/
└── useFonts.ts            # Chargement des polices
```

### 🔄 App.tsx Modifié
- Intégration du chargement des fonts
- Écran de loading
- Navigation vers les écrans pixel

### 📦 Types Mis à Jour
```
shared/types.ts            # Ajout de COMBINATION_LABELS
```

---

## 📥 Installation des Fonts

### 1. Télécharger les polices

Télécharge ces 3 fonts depuis Google Fonts :

1. **Press Start 2P** - https://fonts.google.com/specimen/Press+Start+2P
2. **VT323** - https://fonts.google.com/specimen/VT323  
3. **Pixelify Sans** - https://fonts.google.com/specimen/Pixelify+Sans

### 2. Placer les fichiers

Copie les fichiers `.ttf` dans :
```
frontend/assets/fonts/
├── PressStart2P-Regular.ttf
├── VT323-Regular.ttf
└── PixelifySans-Regular.ttf
```

### 3. Installer expo-font

```bash
cd frontend
npx expo install expo-font
```

### 4. Configurer app.json

Ajoute ceci à ton `frontend/app.json` :

```json
{
  "expo": {
    "plugins": [
      [
        "expo-font",
        {
          "fonts": [
            "./assets/fonts/PressStart2P-Regular.ttf",
            "./assets/fonts/VT323-Regular.ttf",
            "./assets/fonts/PixelifySans-Regular.ttf"
          ]
        }
      ]
    ]
  }
}
```

---

## 🚀 Lancer l'Application

```bash
cd frontend
npx expo start
```

---

## 🎨 Aperçu du Design

### Lobby Screen
```
┌─────────────────────────────┐
│      🎰 POKER MENTEUR       │
│      ═══════════════        │
│                             │
│  Pseudo                     │
│  ┌─────────────────────┐    │
│  │ [Votre nom...]      │    │
│  └─────────────────────┘    │
│                             │
│  ┌─────────────────────┐    │
│  │ 🎮 CRÉER PARTIE     │    │ ← Rouge
│  └─────────────────────┘    │
│         ── ou ──            │
│  ┌─────────────────────┐    │
│  │ 🔗 REJOINDRE        │    │ ← Vert
│  └─────────────────────┘    │
│                             │
│  ╔═════════════════════╗    │
│  ║ 🎮 LOBBY  ID: XXX   ║    │
│  ║ ┌───────────────┐   ║    │
│  ║ │ 👑 Alice      │   ║    │
│  ║ │    Bob        │   ║    │
│  ║ └───────────────┘   ║    │
│  ║                     ║    │
│  ║ ┌───────────────┐   ║    │
│  ║ │ ⚡ LANCER     │   ║    │ ← Or
│  ║ └───────────────┘   ║    │
│  ╚═════════════════════╝    │
└─────────────────────────────┘
```

### Game Screen
```
┌─────────────────────────────┐
│  🎮 POKER MENTEUR   ┌───┐   │
│                     │ M │   │
├─────────────────────────────┤
│  📢 Dernière annonce        │
│  ┌─────────────────────┐    │
│  │   PAIRE DE ROIS     │    │
│  │   par Alice         │    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│  👥 JOUEURS                 │
│  ┌─────────┐ ┌─────────┐    │
│  │👑 Alice │ │ Bob ◄───┤    │ ← Tour actif
│  │ 🃏 x 2  │ │ 🃏 x 3  │    │
│  └─────────┘ └─────────┘    │
│  ┌─────────┐ ┌─────────┐    │
│  │ Charlie │ │  You ⚠️ │    │ ← Danger
│  │ 🃏 x 1  │ │ 🃏 x 4  │    │
│  └─────────┘ └─────────┘    │
├─────────────────────────────┤
│  🎴 VOTRE MAIN      3 cartes│
│  ┌────┐ ┌────┐ ┌────┐       │
│  │ A♠ │ │ 7♥ │ │ K♣ │       │
│  └────┘ └────┘ └────┘       │
├─────────────────────────────┤
│  ┌──────────┐ ┌──────────┐  │
│  │📢 Annoncer│ │🤥 Menteur│  │
│  └──────────┘ └──────────┘  │
└─────────────────────────────┘
```

### Game End Screen
```
┌─────────────────────────────┐
│       🏆 FIN DE PARTIE      │
│      ═══════════════════    │
│                             │
│         ╭─────────╮         │
│        ╱  👑      ╲        │
│       │   🎰      │         │
│       │   ALICE   │         │
│       │  ━━━━━━━  │         │
│       │  A GAGNÉ! │         │
│        ╲  ✨🎉🎊  ╱         │
│         ╰─────────╯         │
│                             │
│  ┌─────────┐  ┌─────────┐   │
│  │🎮   5   │  │🃏   2   │   │
│  │ manches │  │  cartes │   │
│  └─────────┘  └─────────┘   │
│                             │
│  ╔═══════════════════════╗  │
│  ║ 📜 HISTORIQUE         ║  │
│  ║ ┌───────────────────┐ ║  │
│  ║ │M1 Bob a pioché    │ ║  │
│  ║ │M2 Charlie éliminé │ ║  │
│  ║ └───────────────────┘ ║  │
│  ╚═══════════════════════╝  │
│                             │
│  ┌────────┐  ┌────────┐     │
│  │🔄Rejouer│  │🚪Quitter│     │
│  └────────┘  └────────┘     │
└─────────────────────────────┘
```

---

## 🎨 Palette de Couleurs

| Nom | Code | Usage |
|-----|------|-------|
| `bgDark` | `#1a0f0a` | Fond principal |
| `bgMedium` | `#2d1f16` | Panneaux |
| `accentRed` | `#c41e3a` | Boutons principaux |
| `accentGold` | `#ffd700` | Titres, accents |
| `accentGreen` | `#2e8b57` | Boutons secondaires |
| `textLight` | `#f4e4c1` | Texte principal |

---

## 🧩 Composants Disponibles

### PixelButton
```tsx
<PixelButton
  title="Jouer"
  onPress={() => {}}
  variant="primary"   // primary | secondary | danger | gold | disabled
  icon="🎮"           // Emoji optionnel
  disabled={false}
/>
```

### PixelInput
```tsx
<PixelInput
  value={name}
  onChangeText={setName}
  placeholder="Nom"
  label="Pseudo"
/>
```

### PixelCard
```tsx
<PixelCard
  card={{ suit: '♠️', rank: 'A' }}
  hidden={false}      // Pour dos de carte
  small={false}       // Version réduite
/>
```

### PlayerCard
```tsx
<PlayerCard
  name="Alice"
  cardCount={3}
  isCurrentTurn={true}
  isHost={true}
  isMe={false}
  status={PlayerStatus.ACTIVE}
/>
```

### PixelModal
```tsx
<PixelModal
  visible={showModal}
  title="Titre"
  onClose={() => {}}
>
  {/* Contenu */}
</PixelModal>
```

### AnnouncementBanner
```tsx
<AnnouncementBanner
  combination={{ type: 'PAIR', rank: 'A' }}
  playerName="Alice"
/>
```

### CombinationSelector
```tsx
<CombinationSelector
  selectedType={type}
  onSelectType={setType}
  selectedRank={rank}
  onSelectRank={setRank}
/>
```

---

## 🔧 Personnalisation

Pour modifier les couleurs, édite :
```typescript
// frontend/src/styles/pixelTheme.ts

export const COLORS = {
  bgDark: '#1a0f0a',      // Change ici
  accentRed: '#c41e3a',   // Et ici
  // ...
};
```

---

## ⚠️ Notes Importantes

1. **Les fonts doivent être chargées** avant l'affichage de l'app
2. **L'écran de chargement** s'affiche pendant le chargement des fonts
3. **Les émojis** sont utilisés comme icônes (pas besoin d'images !)
4. **Style rétro** : pas de blur, ombres nettes, bordures épaisses

---

*Design Pixel Art créé avec ❤️ pour Poker Menteur*
