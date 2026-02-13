# 🎨 Design System Pixel Art - Poker Menteur

## 📋 Vue d'ensemble

Un design rétro 8-bit/16-bit inspiré des jeux d'arcade des années 90 avec une ambiance "saloon western poker" en version pixelisée.

---

## 🎨 Palette de Couleurs

### Couleurs Principales
```
--color-bg-dark:     #1a0f0a    // Fond bois foncé (table poker)
--color-bg-medium:   #2d1f16    // Bois moyen (panneaux)
--color-bg-light:    #4a3428    // Bois clair (éléments surélevés)
--color-accent-red:  #c41e3a    // Rouge casino
--color-accent-gold: #ffd700    // Or (mise en valeur)
--color-accent-green:#2e8b57    // Vert feutre table
--color-text-light:  #f4e4c1    // Texte crème
--color-text-dark:   #2d1f16    // Texte foncé
--color-border:      #8b4513    // Bordure bois
```

### Couleurs Secondaires
```
--color-danger:      #dc2626    // Danger/Elimination
--color-warning:     #f59e0b    // Attention (4 cartes)
--color-success:     #22c55e    // Succès/Validation
--color-info:        #3b82f6    // Info/Joueur actif
```

---

## 🔤 Typographie Pixel Art

### Fonts Recommandées
```javascript
// Police principale - style rétro gaming
const FONTS = {
  title: 'PressStart2P_400Regular',     // Titres
  body: 'VT323_400Regular',              // Texte courant  
  numbers: 'PixelifySans_400Regular',    // Chiffres/cartes
};
```

### Tailles de Texte
```
Titre écran:     24px (Press Start 2P)
Sous-titre:      16px (Press Start 2P)
Texte bouton:    14px (VT323)
Texte corps:     18px (VT323)
Petit texte:     12px (VT323)
Chiffres cartes: 20px (Pixelify Sans)
```

### Effet de Texte Ombre Portée
```css
text-shadow: 
  2px 2px 0px #000,
  -1px -1px 0px #000;
```

---

## 🖼️ Sprites & Assets

### 1. Cartes à Jouer (Pixel Art)

**Dimensions:** 42x60px (format standard carte)
**Style:** Bordure épaisse 2px, coins arrondis pixel

```
┌─────────────────┐
│ A               │  // Coin haut-gauche: valeur
│                 │
│    ♠️           │  // Centre: gros symbole
│                 │
│               A │  // Coin bas-droite: valeur inversée
└─────────────────┘
```

**Couleurs par famille:**
- **♠ Pique (Spades):** `#2d2d2d` (noir)
- **♥ Cœur (Hearts):** `#c41e3a` (rouge)
- **♦ Carreau (Diamonds):** `#dc2626` (rouge vif)
- **♣ Trèfle (Clubs):** `#1a1a1a` (noir profond)

**Fond carte:** `#f4e4c1` (crème vintage)
**Bordure carte:** `#2d1f16` (bois foncé)

#### Sprite Sheet Cartes (Format PNG 512x512)
```
Layout 4x13:
├─── Piques ───┼─── Cœurs ───┼── Carreaux ─┼── Trèfles ──┐
│ A♠  2♠  3♠   │ A♥  2♥  3♥  │ A♦  2♦  3♦  │ A♣  2♣  3♣  │
│ 4♠  5♠  6♠   │ 4♥  5♥  6♥  │ 4♦  5♦  6♦  │ 4♣  5♣  6♣  │
│ ...          │ ...         │ ...         │ ...         │
│ J♠  Q♠  K♠   │ J♥  Q♥  K♥  │ J♦  Q♦  K♦  │ J♣  Q♣  K♣  │
└──────────────┴─────────────┴─────────────┴─────────────┘
```

**Dos de carte:**
- Motif losanges croisés en damier
- Couleurs: `#8b0000` et `#a52a2a` (rouge bordeaux)

### 2. Boutons Pixel Art

**Bouton Principal (CTA):**
```
Dimensions: 160x48px

État Normal:
┌────────────────────────────────────────┐
│██████████████████████████████████████│  // Bordure haut: #8b4513
│██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██│  // Fond: #c41e3a
│██░░░░░░ ANNONCER ░░░░░░░░░░░░░░░░░░██│  // Texte: #f4e4c1
│██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██│
│██████████████████████████████████████│  // Bordure bas: #5d2e0c
└────────────────────────────────────────┘

État Pressé:
┌────────────────────────────────────────┐
│██████████████████████████████████████│  // Bordure: #5d2e0c
│██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██│  // Fond: #9a1830 (plus foncé)
│██▓▓▓▓▓▓▓▓▓▓ ANNONCER ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██│
│██▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓██│
│██████████████████████████████████████│
└────────────────────────────────────────┘
```

**Bouton Secondaire:**
```
Fond: #2e8b57 (vert)
Bordure: #1a5233
```

**Bouton Danger (Menteur!):**
```
Fond: #dc2626 (rouge vif)
Bordure: #991b1b
```

### 3. Icônes Pixel Art (16x16px ou 24x24px)

**Couronne (Host):**
```
   ▄▄▄   
  █▀▀▀█  
 ▄█▄▄▄█▄ 
 ███████ 
```
Couleur: `#ffd700`

**Carte (Nombre de cartes):**
```
 ┌───┐
 │░░░│
 └───┘
```

**Flèche (Joueur actif):**
```
   ▄    
  ███   
 █████  
  ███   
```

**Attention/Danger:**
```
   ▲    
  ▲ ▲   
 ▲ ▲ ▲  
 ▀▀▀▀▀  
```
Couleur: `#f59e0b`

### 4. Arrière-plans

**Fond Table de Poker:**
- Texture feutre verte en pixel art
- Motif répétitif: `#2e8b57` base + `#276749` motifs

**Fond Bois (Lobby/Modales):**
- Texture bois avec nœuds
- Couleurs: dégradé de `#2d1f16` à `#4a3428`
- Veines de bois horizontales 2px

**Motif Bordure:**
```
Ornement coin:
╔═══╗  ╔═╦═╗  ╔═╦═╗
║   ║  ║ ║ ║  ║ ║ ║
╚═╦═╝  ╠═╬═╣  ╠═╬═╣
  ║    ║ ║ ║  ║ ║ ║
       ╚═╩═╝  ╚═╩═╝
```

---

## 🎭 Écrans Détaillés

### Écran 1: Lobby (Accueil)

```
┌────────────────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  // Fond bois
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│    🎰 POKER MENTEUR 🎰                 │
│         ═══════════════                │  // Titre avec ligne décorative
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│                                        │
│  ┌────────────────────────────────┐    │
│  │  [👤 Votre nom          ]      │    │  // Input pixel
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │      CRÉER UNE PARTIE          │    │  // Bouton principal
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────────────────────────┐    │
│  │    REJOINDRE UNE PARTIE        │    │  // Bouton secondaire
│  └────────────────────────────────┘    │
│                                        │
│         ─── ou ───                     │
│                                        │
│  ┌────────────────────────────────┐    │
│  │  [🎮 ID Partie         ]       │    │
│  └────────────────────────────────┘    │
│                                        │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│  🎮 4 Joueurs en ligne                 │
└────────────────────────────────────────┘
```

**Style Input:**
- Fond: `#1a0f0a`
- Bordure: 2px `#8b4513`
- Texte: `#f4e4c1`
- Placeholder: `#8b7355`
- Padding: 12px

---

### Écran 2: Game (Table de Jeu)

```
┌────────────────────────────────────────┐
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒┌────────┐▒│  // Fond feutre vert
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│MANCHE 3│▒│  // Badge manche
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒└────────┘▒│
│▒                                    ▒│
│▒        ┌──────────┐               ▒│
│▒        │  Alice   │◄── 👑         ▒│  // Joueur avec couronne
│▒        │ 🃏 x 2   │               ▒│
│▒        └──────────┘               ▒│
│▒                                    ▒│
│▒  ┌────────┐      ┌────────┐       ▒│
│▒  │  Bob   │◄───►│ Charlie│       ▒│  // Joueurs actifs
│▒  │ 🃏 x 3 │      │ 🃏 x 1 │◄── 👆 ▒│  // Flèche = tour actuel
│▒  └────────┘      └────────┘       ▒│
│▒                                    ▒│
│▒        ┌──────────┐               ▒│
│▒        │   You    │◄── 🎯         ▒│
│▒        │ 🃏 x 4 ⚠️ │               ▒│  // Warning = danger
│▒        └──────────┘               ▒│
│▒                                    ▒│
│▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│
│  ┌────────────────────────────────┐  │
│  │ 📢 Dernière annonce:           │  │
│  │    PAIRE DE ROIS par Alice     │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────┐┌────────┐┌────────┐     │
│  │   A♠   ││   7♥   ││   K♣   │     │  // Cartes du joueur
│  │        ││        ││        │     │
│  └────────┘└────────┘└────────┘     │
│                                      │
│  ┌──────────────┐┌──────────────┐   │
│  │  📢 ANNONCER ││  🤥 MENTEUR │   │  // Boutons action
│  └──────────────┘└──────────────┘   │
└────────────────────────────────────────┘
```

**Carte Joueur:**
- Background: Dégradé `#16213e` → `#0f3460`
- Border: 2px solid `#8b4513`
- Border-radius: 4px
- Shadow: 0 4px 0 `#00000040`

**Badge "Tour Actuel":**
- Background: `#ffd700`
- Text: `#2d1f16`
- Animation: Pulse toutes les 1s

---

### Modale "Annoncer"

```
┌────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  // Overlay semi-transparent
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░    ╔══════════════════════════╗   ░░│
│░░    ║  CHOISIR COMBINATION     ║   ░░│  // Titre modale
│░░    ╠══════════════════════════╣   ░░│
│░░    ║                          ║   ░░│
│░░    ║  Type:                   ║   ░░│
│░░    ║  ┌────┬────┬────┬────┐  ║   ░░│
│░░    ║  │PAIRE│BREL│FULL│ etc│  ║   ░░│  // Grille types
│░░    ║  └────┴────┴────┴────┘  ║   ░░│
│░░    ║                          ║   ░░│
│░░    ║  Valeur:                 ║   ░░│
│░░    ║  ┌──┬──┬──┬──┬──┬──┬──┐  ║   ░░│
│░░    ║  │2 │3 │4 │5 │6 │7 │8 │  ║   ░░│  // Grille valeurs
│░░    ║  ├──┼──┼──┼──┼──┼──┼──┤  ║   ░░│
│░░    ║  │9 │10│ V│ D│ R│ A│  │  ║   ░░│
│░░    ║  └──┴──┴──┴──┴──┴──┴──┘  ║   ░░│
│░░    ║                          ║   ░░│
│░░    ║  ┌────────┐┌────────┐    ║   ░░│
│░░    ║  │ANNULER ││VALIDER │    ║   ░░│  // Boutons
│░░    ║  └────────┘└────────┘    ║   ░░│
│░░    ╚══════════════════════════╝   ░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└────────────────────────────────────────┘
```

**Style Modale:**
- Background: `#2d1f16`
- Border: 3px `#8b4513`
- Corner ornaments: Coins décoratifs en or
- Shadow: 0 8px 0 `#00000080`

**Bouton Type Sélectionné:**
- Background: `#c41e3a`
- Border: 2px `#f4e4c1`

---

### Écran 3: Résolution

```
┌────────────────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│         🎭 RÉSOLUTION 🎭               │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│                                        │
│  ┌────────────────────────────────┐    │
│  │ Annonce: PAIRE DE ROIS         │    │
│  └────────────────────────────────┘    │
│                                        │
│         ┌────────────┐                 │
│         │  ✅ ou ❌  │                 │  // Résultat
│         │            │                 │
│         │ C'ÉTAIT    │                 │
│         │ UN MENTEUR │                 │
│         └────────────┘                 │
│                                        │
│     Bob perd et pioche une carte!      │
│                                        │
│  Cartes révélées:                      │
│  ┌────┐┌────┐┌────┐┌────┐┌────┐       │
│  │ A♠ ││ 7♥ ││ K♣ ││ K♦ ││ 3♠ │       │  // Révélation
│  └────┘└────┘└────┘└────┘└────┘       │
│           ↑↑                           │
│      ✓ LA PAIRE!                       │
│                                        │
│  ┌────────────────────────────────┐    │
│  │      CONTINUER →               │    │
│  └────────────────────────────────┘    │
│                                        │
└────────────────────────────────────────┘
```

**Carte Révélée (Gagnante):**
- Glow doré pulsant
- Scale: 1.1x
- Border: 3px `#ffd700`

---

### Écran 4: Fin de Partie

```
┌────────────────────────────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│         🏆 FIN DE PARTIE 🏆            │
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│                                        │
│  ╔════════════════════════════════╗    │
│  ║                                ║    │
│  ║           👑                   ║    │
│  ║                                ║    │
│  ║         ALICE                  ║    │  // Gagnant
│  ║     ━━━━━━━━━━━━━━━            ║    │
│  ║       A GAGNÉ!                 ║    │
│  ║                                ║    │
│  ╚════════════════════════════════╝    │
│  (Bordure or clignotante)              │
│                                        │
│  ┌────────────────────────────────┐    │
│  │ 📜 HISTORIQUE                  │    │
│  │ ┌──────────────────────────┐   │    │
│  │ │ Manche 1: Bob a pioché   │   │    │
│  │ │ Manche 2: Charlie a pioché│  │    │
│  │ │ Manche 3: David éliminé  │   │    │
│  │ └──────────────────────────┘   │    │
│  └────────────────────────────────┘    │
│                                        │
│  ┌────────────┐    ┌────────────┐     │
│  │ 🔄 REJOUER │    │ 🚪 QUITTER │     │
│  └────────────┘    └────────────┘     │
│                                        │
└────────────────────────────────────────┘
```

---

## ✨ Animations Pixel Art

### 1. Animation Carte (Distribution)
```css
@keyframes dealCard {
  0% {
    transform: translateY(-100px) scale(0.5);
    opacity: 0;
  }
  50% {
    transform: translateY(10px) scale(1.1);
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
```
Duration: 400ms
Easing: cubic-bezier(0.175, 0.885, 0.32, 1.275)

### 2. Animation Bouton Pressé
```css
@keyframes buttonPress {
  0% { transform: translateY(0); }
  50% { transform: translateY(4px); }
  100% { transform: translateY(4px); }
}
```
Ajouter ombre qui disparaît

### 3. Animation Tour Actif (Pulse)
```css
@keyframes activePulse {
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7);
    border-color: #ffd700;
  }
  50% { 
    box-shadow: 0 0 0 10px rgba(255, 215, 0, 0);
    border-color: #ffed4e;
  }
}
```
Duration: 1.5s
Iteration: infinite

### 4. Animation "Menteur" (Shake)
```css
@keyframes liarShake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}
```
Duration: 500ms

### 5. Animation Confetti (Victoire)
```javascript
// Particules pixel carrées qui tombent
const confetti = [
  { color: '#ffd700', size: 8, speed: 2 },
  { color: '#c41e3a', size: 6, speed: 3 },
  { color: '#2e8b57', size: 8, speed: 2.5 },
  // ...
];
```

---

## 📦 Assets à Créer

### Fichiers PNG Nécessaires

```
assets/
├── pixel/
│   ├── cards/
│   │   ├── sprite_sheet_cards.png     // 512x512 - 52 cartes
│   │   ├── card_back.png              // 42x60 - Dos carte
│   │   └── card_placeholder.png       // 42x60 - Emplacement vide
│   │
│   ├── ui/
│   │   ├── button_red.png             // 160x48 - 3 états
│   │   ├── button_red_pressed.png
│   │   ├── button_green.png
│   │   ├── button_green_pressed.png
│   │   ├── button_gold.png
│   │   ├── button_gold_pressed.png
│   │   ├── input_field.png            // 280x48
│   │   ├── input_field_focused.png
│   │   ├── modal_frame.png            // 320x400 - 9-slice
│   │   ├── player_card_bg.png         // 140x80 - 3 états
│   │   ├── player_card_active.png
│   │   ├── player_card_danger.png
│   │   ├── badge_crown.png            // 24x24
│   │   ├── badge_arrow.png            // 24x24
│   │   ├── badge_warning.png          // 24x24
│   │   ├── icon_cards.png             // 16x16
│   │   └── particle_confetti.png      // 8x8 couleurs variées
│   │
│   ├── backgrounds/
│   │   ├── bg_lobby.png               // 360x640 - Texture bois
│   │   ├── bg_table.png               // 360x640 - Feutre vert
│   │   └── bg_winner.png              // 360x640 - Doré
│   │
│   └── animations/
│       ├── anim_deal_1.png            // Frames distribution
│       ├── anim_deal_2.png
│       ├── anim_deal_3.png
│       └── anim_confetti.png
│
└── fonts/
    ├── PressStart2P-Regular.ttf
    ├── VT323-Regular.ttf
    └── PixelifySans-Regular.ttf
```

---

## 🎨 Guide de Style CSS (React Native)

```typescript
// styles/pixelTheme.ts

export const PIXEL_COLORS = {
  // Fonds
  bgDark: '#1a0f0a',
  bgMedium: '#2d1f16',
  bgLight: '#4a3428',
  
  // Accents
  accentRed: '#c41e3a',
  accentGold: '#ffd700',
  accentGreen: '#2e8b57',
  
  // Texte
  textLight: '#f4e4c1',
  textDark: '#2d1f16',
  
  // États
  danger: '#dc2626',
  warning: '#f59e0b',
  success: '#22c55e',
  info: '#3b82f6',
  
  // Cartes
  cardBg: '#f4e4c1',
  spade: '#2d2d2d',
  heart: '#c41e3a',
  diamond: '#dc2626',
  club: '#1a1a1a',
};

export const PIXEL_FONTS = {
  title: 'PressStart2P_400Regular',
  body: 'VT323_400Regular',
  numbers: 'PixelifySans_400Regular',
};

export const PIXEL_SHADOWS = {
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 4,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 2,
  },
};

export const PIXEL_BORDERS = {
  thin: {
    borderWidth: 1,
    borderColor: PIXEL_COLORS.bgLight,
  },
  thick: {
    borderWidth: 2,
    borderColor: '#8b4513',
  },
  gold: {
    borderWidth: 2,
    borderColor: PIXEL_COLORS.accentGold,
  },
};
```

---

## 🎯 Résumé Visuel

```
┌─────────────────────────────────────────────────────────────┐
│                    STYLE VISUEL FINAL                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🎨 AMBIANCE: Saloon western poker années 90 rétro         │
│                                                             │
│  🖼️  RENDU: Pixel art 8-bit/16-bit authentique             │
│                                                             │
│  🎨 PALETTE:                                                │
│     • Bois chaud (#2d1f16)                                 │
│     • Rouge casino (#c41e3a)                               │
│     • Or (#ffd700)                                         │
│     • Vert feutre (#2e8b57)                                │
│                                                             │
│  ✨ EFFETS:                                                 │
│     • Ombres pixelisées (pas de blur)                      │
│     • Bordures épaisses (2-3px)                            │
│     • Coins arrondis pixel (4px max)                       │
│     • Animations frame-by-frame                            │
│                                                             │
│  🔤 TYPO: Fonts pixel Google (Press Start 2P, VT323)        │
│                                                             │
│  🎵 AUDIO (suggestion): SFX 8-bit pour interactions        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Implémentation Proposée

### Étape 1: Setup Fonts
```bash
cd frontend
npx expo install expo-font
# Télécharger et installer les fonts pixel
```

### Étape 2: Composants UI de Base
- `PixelButton` - Bouton avec effet pressé
- `PixelCard` - Carte de jeu stylisée
- `PixelInput` - Input avec bordure pixel
- `PixelModal` - Modale avec cadre décoratif
- `PlayerCard` - Carte joueur avec badges

### Étape 3: Assets
- Créer la sprite sheet des cartes
- Exporter les textures de fond
- Générer les icônes pixel

### Étape 4: Animations
- Implémenter les keyframes
- Ajouter les transitions
- Créer les sprites d'animation

---

*Design créé pour Poker Menteur - Style Pixel Art Rétro Western*
