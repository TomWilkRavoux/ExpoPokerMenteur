# 🎨 Guide d'Installation - Design Pixel Art

Ce guide t'explique comment intégrer le design pixel art dans ton projet Poker Menteur.

---

## 📦 Étape 1: Installer les Fonts

### 1.1 Installation via Expo

```bash
cd frontend
npx expo install expo-font
```

### 1.2 Télécharger les Fonts

Télécharge ces fonts depuis Google Fonts :

1. **Press Start 2P** (titres) - https://fonts.google.com/specimen/Press+Start+2P
2. **VT323** (texte) - https://fonts.google.com/specimen/VT323
3. **Pixelify Sans** (chiffres) - https://fonts.google.com/specimen/Pixelify+Sans

### 1.3 Placer les Fonts

```
frontend/
├── assets/
│   └── fonts/
│       ├── PressStart2P-Regular.ttf
│       ├── VT323-Regular.ttf
│       └── PixelifySans-Regular.ttf
```

### 1.4 Configurer app.json

```json
{
  "expo": {
    "name": "Poker Menteur",
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

### 1.5 Créer le Hook de Fonts

```typescript
// frontend/src/hooks/useFonts.ts
import { useFonts } from 'expo-font';

export const usePixelFonts = () => {
  const [fontsLoaded] = useFonts({
    'PressStart2P_400Regular': require('../../assets/fonts/PressStart2P-Regular.ttf'),
    'VT323_400Regular': require('../../assets/fonts/VT323-Regular.ttf'),
    'PixelifySans_400Regular': require('../../assets/fonts/PixelifySans-Regular.ttf'),
  });

  return fontsLoaded;
};
```

---

## 🎮 Étape 2: Créer les Assets Graphiques

### 2.1 Structure des Assets

```
frontend/
├── assets/
│   ├── fonts/           ← (déjà créé)
│   └── pixel/
│       ├── cards/
│       ├── ui/
│       └── backgrounds/
```

### 2.2 Sprite Sheet des Cartes (À créer)

Crée une image PNG 512x512px avec toutes les cartes :

```
┌─────────────────────────────────────┐
│ A♠ │ 2♠ │ 3♠ │ ... │ K♠ │ A♥ │     │  Ligne 1: Piques
├────┼────┼────┼─────┼────┼────┤     │
│ 2♥ │ ...│    │     │    │    │     │  Ligne 2-4: Autres familles
└─────────────────────────────────────┘
```

**Outils recommandés :**
- Aseprite (payant) - https://www.aseprite.org/
- Piskel (gratuit) - https://www.piskelapp.com/
- Pixilart (gratuit) - https://www.pixilart.com/

---

## 🚀 Étape 3: Intégrer les Composants

### 3.1 Remplacer les imports dans App.tsx

```typescript
// frontend/App.tsx
import { usePixelFonts } from './src/hooks/useFonts';

export default function App() {
  const fontsLoaded = usePixelFonts();

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {/* ... */}
    </NavigationContainer>
  );
}
```

### 3.2 Utiliser les nouveaux écrans

Remplace les imports dans ton router/navigation :

```typescript
// Avant
import { LobbyScreen } from './src/screens/LobbyScreen';

// Après
import { LobbyScreenPixel } from './src/screens/LobbyScreenPixel';
```

Ou bien, adapte le style de tes écrans existants avec le thème :

```typescript
// Dans tes screens existants, remplace les styles :
import { COLORS, FONTS, commonStyles } from '../styles/pixelTheme';

// Utilise les composants pixel :
import { PixelButton, PixelInput, PixelCard, PlayerCard } from '../components/pixel';
```

---

## 🎨 Étape 4: Personnaliser les Couleurs

Si tu veux modifier la palette, édite :

```typescript
// frontend/src/styles/pixelTheme.ts

export const COLORS = {
  // Change ces valeurs selon tes préférences
  bgDark: '#1a0f0a',      // ← Fond principal
  accentRed: '#c41e3a',   // ← Rouge principal
  accentGold: '#ffd700',  // ← Or
  // ... etc
};
```

---

## 📱 Étape 5: Tester sur Mobile

```bash
cd frontend
npx expo start
npx expo start --ios     # Pour iOS
npx expo start --android # Pour Android
```

---

## 🎯 Checklist

- [ ] Fonts installées dans `assets/fonts/`
- [ ] `app.json` configuré avec le plugin expo-font
- [ ] Hook `useFonts.ts` créé
- [ ] Composants pixel dans `src/components/pixel/`
- [ ] Thème dans `src/styles/pixelTheme.ts`
- [ ] Au moins un écran testé avec le nouveau style
- [ ] Tester sur mobile réel ou émulateur

---

## 🔧 Composants Disponibles

| Composant | Description | Props principales |
|-----------|-------------|-------------------|
| `PixelButton` | Bouton style pixel | `variant`, `icon`, `onPress` |
| `PixelInput` | Champ de texte | `label`, `placeholder` |
| `PixelCard` | Carte à jouer | `card`, `hidden`, `small` |
| `PlayerCard` | Info joueur table | `name`, `cardCount`, `isCurrentTurn` |

---

## 💡 Astuces

1. **Performance** : Utilise `React.memo` pour les cartes si beaucoup de rendus
2. **Accessibilité** : Ajoute des `accessibilityLabel` aux boutons
3. **Responsive** : Le design est pensé pour mobile, teste sur plusieurs tailles
4. **Dark Mode** : Le thème est déjà sombre, parfait pour jouer la nuit !

---

*Design Pixel Art créé pour Poker Menteur 🎰*
