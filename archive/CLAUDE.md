# Wordy Weapon

## Project Overview
Wordy Weapon is a browser-based word-crafting RPG where players build weapons from words to battle enemies. The game combines vocabulary, creativity, and strategic combat in a unique roguelike experience.

## Tech Stack
- Pure HTML/CSS/JavaScript (no frameworks)
- Single-page application
- Client-side only (no backend)

## Folder Structure
```
WordyWeapon-Dev/           # Development source (edit files here)
├── game/                  # The actual game files
│   ├── index.html         # Main HTML structure and UI layout
│   ├── script.js          # Game logic, combat system, and state management
│   ├── styles.css         # All styling and visual effects
│   ├── assets/            # SVG portraits and icons
│   └── sfx/               # Audio samples (ogg format)
├── electron/              # Electron wrapper for desktop builds
│   ├── main.js            # Electron main process
│   ├── preload.js         # Preload script
│   └── package.json       # Build scripts and config
└── CLAUDE.md              # This file

WordyWeapon-Builds/        # Output builds (don't edit here)
├── itch/                  # Web build for itch.io
└── steam/                 # Desktop builds for Steam (mac + win)
```

## Core Game Mechanics

### Word System
Players craft weapons by combining words with specific properties:
- **Word Types**: weapon, affinity, adjective, noun
- **Elements**: Physical, Poison, Fire, Water, Light, Dark, Earth, Lightning
- **Rarities**: T1 (Common), T2 (Uncommon/Magic), T3 (Rare/Epic/Legendary)
- **Damage Types**: slash, pierce, blunt, magic

### Combat System
Turn-based combat featuring:
- Elemental strengths/weaknesses (2x damage)
- Weapon type proficiency (hero-specific bonuses/penalties)
- Damage calculation based on word combinations
- Health bars with damage preview animations

### Heroes (6 playable characters)
1. **Graham Moor** (Warrior) - Physical/Earth, proficient with slash. Capstone: "Duty Bound"
2. **Quivera** (Ranger) - Lightning/Earth, proficient with pierce. Capstone: "Last Arrow"
3. **Belle Lettres** (Mage) - Body & Soul strong (Phys/Poison/Light/Dark), World & Sky weak. Capstone: "Knowledge Eternal" (NEEDS NEW EFFECT)
4. **Alexandria Constanza** (Paladin) - Light/Physical, proficient with blunt. Capstone: "Sacred Flame"
5. **Caesura** (Assassin) - Dark/Poison, proficient with pierce. Capstone: "Final Silence"
6. **Reed** (Druid) - Earth/Water, proficient with blunt. Capstone: "One With Nature"

### Chapter Bosses (5 unique bosses with abilities)
1. **Cinna & Antony** (Round 9) - Unlocks Quivera
2. **Red Aktins** (Round 9) - Blocks a random word slot, unlocks Belle Lettres
3. **Plague Doctor** (Round 9) - Copies hero resistances, unlocks Alexandria
4. **Oxy** (Round 9) - Unlocks Caesura
5. **Dotdotdot** (Round 9) - Unlocks Reed

### Progression
- Round-based encounters with escalating difficulty
- Gold economy for purchasing words and items
- Shop system with crates (World & Sky, Body & Soul) and consumables
- Minibosses at rounds 3, 6 with modifiers
- Chapter bosses at round 9 with unique abilities
- Endless mode after Round 9 with exponential HP scaling
- Inventory management (30 word limit, 2 consumable limit)

## Key Constants (script.js)
```javascript
E = {PHYS:0, POISON:1, FIRE:2, WATER:3, LIGHT:4, DARK:5, EARTH:6, LIGHTNING:7}
R = {RUSTY:-1, COMMON:0, UNCOMMON:2, MAGIC:2, RARE:3, EPIC:3, LEGENDARY:3}
INV_LIMIT = 30
CONSUMABLE_LIMIT = 2
```

## Code Architecture

### State Management
Global state object `S` tracking:
- Current hero selection
- Inventory (words and consumables)
- Gold, streak, round number
- Combat state (hero/enemy HP, current weapon)
- Shop offerings
- Talents (active - pick after boss/miniboss victories)

### Major Functions
- `calc()` - Combat damage calculation with breakdown
- `forge()` - Initiates combat with forged weapon
- `afterCombat()` - Handles post-combat flow (shop, talents, victory)
- `newEnc()` - Generates new enemy encounter
- `showShop()` / `rollShop()` - Shop UI and crate generation
- `showRoundIntro()` - Hearthstone-style hero/enemy entrance
- `playSceneTransition()` - Smooth vignette transitions between scenes

### UI Guards (Rapid Click Protection)
- `isTransitioning` - Global lock for scene transitions
- `isForging` - Prevents double-clicking Forge Weapon button
- Onboarding dialogue blocks forge during tutorial

### Music Engine
- `MusicEngine` class using Tone.js
- Dynamic layering based on elements in forge
- Shop mode with jazzy drums and filter
- Lose effect (pitch bend + slow down)
- Victory effect (all instruments enabled)

## Audio System
- **Sample Playback**: HTML Audio elements for `file://` protocol compatibility
- **Samples Location**: `sfx/` folder (ogg format)
- **Synthesized Tones**: Web Audio API for UI feedback
- **Music**: Tone.js procedural music engine
- **Talk Sound Panning**: Hero babble pans left (-0.7), enemy pans right (+0.7)

## Recent Changes (Beta 2)
- **Rapid Click Protection**: Added transition locks and forge guards
- **Music Hard Reset**: Fresh start at Round 1
- **Battle-view Fix**: Properly hides on loss/main menu
- **Tone.js Stability**: Wrapped all .stop() calls in try-catch
- **Forge Guard**: Blocks during onboarding dialogue
- **Terminology**: "Hero's Strong Elements" (not "Primary"), "World & Sky" crate
- **GPU Optimizations**: Removed backdrop-filter blur, optimized animation loops
- **Graphics Settings**: Brightness slider (80-150%) for HDR monitors
- **Talk Sound Panning**: Stereo positioning for dialogue
- **Skip Dialogue**: Stops babble sound when clicking to skip

## Development Workflow

### Edit Game Files
All game edits happen in `WordyWeapon-Dev/game/`:
- `game/index.html` - HTML structure
- `game/script.js` - Game logic
- `game/styles.css` - Styling

### Test Locally
```bash
cd WordyWeapon-Dev/electron
npm start              # Runs Electron app with latest game files
```
Or open `game/index.html` directly in browser.

### Build for Distribution
```bash
cd WordyWeapon-Dev/electron

npm run build-itch     # Copies web files to ../WordyWeapon-Builds/itch/
npm run build-steam    # Builds mac + win apps to ../WordyWeapon-Builds/steam/

npm run build-mac      # Mac only (to electron/dist/)
npm run build-win      # Windows only (to electron/dist/)
npm run build-all      # All platforms (to electron/dist/)
```

### Electron Config
- `main.js` - Window sizing (1280x800 base, 1.5x max scale), local HTTP server for Tone.js
- `package.json` - electron-builder config, build scripts
- Game files auto-sync from `../game/` on every build command

## Known Areas to Review
- Portrait SVG files in `assets/` folder are unused backups (game uses inline SVGs from `PORTRAITS` object in script.js)
- Console.log statements in MusicEngine (lines ~7079-7127) could be removed for production

## Recent Session Progress

### Difficulty System
- Implemented 3-tier difficulty: **Apprentice / Adept / Master** (blacksmithing ranks)
- Apprentice: 100% enemy HP, full skill tree, 20 gold
- Adept: 150% enemy HP, 50% skill tree effectiveness, 10 gold
- Master: 200% enemy HP, skill tree disabled, 10 gold

### Skill Trees Overhaul
- All 6 heroes have straightforward node names (Strength I/II/III, Element Mastery, etc.)
- Capstones renamed to reflect hero resolve (Duty Bound, Last Arrow, Sacred Flame, etc.)

### Lore Updates
- Enemies are now called "Erratum" (not "Unwritten")
- Two element categories: Body & Soul (Phys/Poison/Light/Dark) and World & Sky (Fire/Water/Earth/Lightning)

### Belle Lettres Rework
- **Elements**: Strong with Body & Soul, Weak with World & Sky (sheltered princess who reads about things but hasn't experienced nature)
- **Passive "Well-Read"**: Body & Soul words: +2 AP, World & Sky words: -2 AP
- **Capstone "Knowledge Eternal"**: All words REREAD ×1 (every word in forge triggers twice)

---

## Performance Audit (December 2024)

### HIGH Priority - Particle System Layout Thrashing

These use `.style.left/.top` every frame instead of `transform: translate3d()`:

| Line | System | Fix |
|------|--------|-----|
| 15588 | Orbiting particles | Use `transform: translate3d(x, y, 0)` |
| 15767 | Swarm particles | Use `transform: translate3d(x, y, 0)` |
| 16042 | Spark emitter | Consolidate into single transform |
| 16271 | Ember emitter | Consolidate position + rotation into single transform |

**Impact:** Every particle triggers layout recalculation per frame. With 50+ particles, this causes significant jank on low-end devices.

**Fix pattern:**
```javascript
// BAD (triggers layout)
p.element.style.left = x + 'px';
p.element.style.top = y + 'px';

// GOOD (GPU-accelerated)
p.element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${r}deg) scale(${s})`;
```

### MEDIUM Priority - DOM Queries in Loops

| Line | Issue | Fix |
|------|-------|-----|
| 5066-5073 | `drawSkillTreeLines` queries DOM + reads offsetLeft/offsetWidth per node | Cache node refs in a Map outside the loop |
| 8466-8471 | Damage preview forces reflow with `void edp.offsetWidth` | Use rAF or animation class toggle |

### LOW Priority - Animation Restart Reflows

Multiple spots (7920, 7931, 10652-10655, 17461-17464) force reflow to restart CSS animations:
```javascript
// Current pattern (forces layout)
el.classList.remove('anim');
void el.offsetWidth; // Force reflow
el.classList.add('anim');

// Better pattern
el.classList.remove('anim');
requestAnimationFrame(() => {
  requestAnimationFrame(() => el.classList.add('anim'));
});
```

### Already Good
- ✅ No `setInterval`/`setTimeout` for visual animations (uses rAF)
- ✅ No scroll/touch/wheel listeners missing `passive: true`
- ✅ `will-change` already used on flame background effects

### CSS Improvements Needed
Add to `styles.css` for particle elements:
```css
.particle, .spark, .ember, .orb {
  will-change: transform, opacity;
  position: absolute;
  /* Set initial position with left/top, then animate with transform */
}
```
