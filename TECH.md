# TECH - Wordy Weapon

> **Owner**: Tech Subagent
> **Last Updated**: 2024-12-20
> **Status**: Stable

## Document Purpose
Build pipeline, performance optimization, architecture overview, persistence/save system, and platform differences. This is the authoritative technical reference.

---

## Quick Reference

### Key File Locations
| File | Purpose |
|------|---------|
| `game/script.js` | All game logic (21.7K lines) |
| `game/styles.css` | Styling (136KB) |
| `game/index.html` | HTML structure (39KB) |
| `electron/main.js` | Desktop wrapper |
| `electron/package.json` | Build config |

### Build Commands
```bash
cd electron
npm start              # Local dev
npm run build-itch     # Web build
npm run build-steam    # Mac + Win
npm run build-mac      # Mac only
npm run build-win      # Windows only
npm run build-all      # All platforms
```

---

## Architecture Overview

### Tech Stack
- Pure HTML/CSS/JavaScript (no frameworks)
- Single-page application
- Client-side only (no backend)
- Tone.js for music synthesis

### Folder Structure
```
wordyweapon/
├── game/                  # Source files (edit here)
│   ├── index.html
│   ├── script.js
│   ├── styles.css
│   ├── assets/            # SVG portraits
│   └── sfx/               # Audio (ogg format)
├── electron/              # Desktop wrapper
│   ├── main.js
│   ├── preload.js
│   └── package.json
└── builds/                # Output (don't edit)
    ├── itch/
    └── steam/
```

---

## Code Architecture

### State Management
Global state object `S` tracks:
- Current hero selection
- Inventory (words and consumables)
- Gold, streak, round number
- Combat state (hero/enemy HP, current weapon)
- Shop offerings
- Talents (active after boss/miniboss victories)

### Persistent Stats (`PStats` object)
- Attempts, victories, best damage, highest round
- Hero unlocks and progress per hero
- Difficulty clear tracking
- XP and skill allocation per hero

### Major Functions
| Function | Purpose |
|----------|---------|
| `calc()` | Combat damage calculation with breakdown |
| `forge()` | Initiates combat with forged weapon |
| `afterCombat()` | Post-combat flow (shop, talents, victory) |
| `newEnc()` | Generates new enemy encounter |
| `showShop()` / `rollShop()` | Shop UI and crate generation |
| `showRoundIntro()` | Hearthstone-style hero/enemy entrance |
| `playSceneTransition()` | Vignette transitions between scenes |
| `saveRun()` / `loadRun()` | Run persistence |

### UI Guards (Rapid Click Protection)
- `isTransitioning` - Global lock for scene transitions
- `isForging` - Prevents double-clicking Forge Weapon button
- Onboarding dialogue blocks forge during tutorial

---

## Build Protocol

### Demo vs Full Build Settings
| Setting | Demo | Full |
|---------|------|------|
| `IS_DEMO` in script.js | `true` | `false` |
| `steam_appid.txt` | Demo App ID | Full App ID |
| `package.json` productName | "Wordy Weapon Demo" | "Wordy Weapon" |

### Demo Restrictions (IS_DEMO = true)
- Only first 2 heroes (Graham, Quivera)
- Game ends at Round 18
- Only Apprentice difficulty
- "DEMO" label on splash
- Victory prompts wishlist

### Pre-Release Checklist
- [ ] Set correct `IS_DEMO` value
- [ ] Update `steam_appid.txt` with real App ID
- [ ] Update `package.json` productName and appId
- [ ] Remove debug console.logs (MusicEngine ~lines 7079-7127)
- [ ] Test save/load functionality
- [ ] Test all difficulties
- [ ] Test hero unlocks
- [ ] Verify Steam achievements
- [ ] Test on Mac and Windows

---

## Steam Integration

### Achievement IDs
```
ACH_FIRST_VICTORY      - First boss defeated
ACH_WORDSMITH_MASTER   - 100+ damage single hit
ACH_ENDLESS_WARRIOR    - Reach Round 15
ACH_BOSS_SLAYER        - Defeat all 5 chapter bosses
ACH_APPRENTICE_SMITH   - Clear on Apprentice
ACH_ADEPT_FORGER       - Clear on Adept
ACH_MASTER_BLACKSMITH  - Clear on Master
ACH_BOSS_[name]        - Per-boss achievements
ACH_HERO_[name]        - Per-hero win achievements
```

### Steam Cloud Keys
- `wordy_weapon_stats` - Persistent stats (PStats)
- `wordy_weapon_run` - Current run state (S)

### Fallback
Game uses localStorage when Steam unavailable. Steam errors expected during local dev.

---

## Performance Optimization

### HIGH Priority - Particle Layout Thrashing
These use `.style.left/.top` every frame instead of `transform: translate3d()`:

| Line | System | Fix |
|------|--------|-----|
| 15588 | Orbiting particles | Use transform |
| 15767 | Swarm particles | Use transform |
| 16042 | Spark emitter | Consolidate transform |
| 16271 | Ember emitter | Consolidate position + rotation |

**Fix Pattern:**
```javascript
// BAD (triggers layout)
p.element.style.left = x + 'px';
p.element.style.top = y + 'px';

// GOOD (GPU-accelerated)
p.element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
```

### MEDIUM Priority - DOM Queries in Loops
| Line | Issue | Fix |
|------|-------|-----|
| 5066-5073 | `drawSkillTreeLines` queries DOM per node | Cache refs in Map |
| 8466-8471 | Damage preview forces reflow | Use rAF |

### LOW Priority - Animation Restart Reflows
Multiple spots force reflow to restart CSS animations. Use double-rAF instead:
```javascript
el.classList.remove('anim');
requestAnimationFrame(() => {
  requestAnimationFrame(() => el.classList.add('anim'));
});
```

### Already Good
- No setInterval for visual animations (uses rAF)
- No scroll/touch listeners missing passive: true
- will-change on flame background effects

### CSS Improvements Needed
```css
.particle, .spark, .ember, .orb {
  will-change: transform, opacity;
  position: absolute;
}
```

---

## Audio System

### Music Engine
- `MusicEngine` class using Tone.js
- Dynamic layering based on forge elements
- Shop mode with jazzy drums and filter
- Lose effect (pitch bend + slow down)
- Victory effect (all instruments enabled)

### Sample Playback
- HTML Audio elements for file:// compatibility
- Samples in `sfx/` folder (ogg format)
- Talk sound panning: Hero left (-0.7), Enemy right (+0.7)

---

## Persistence

### LocalStorage Keys
- Run state saved via `saveRun()`
- Stats saved via `savePStats()`

### Steam Cloud
- `steamCloudSaveStats()` / `steamCloudLoadStats()`
- Syncs across devices

---

## Platform Differences

### Electron (Desktop)
- Window: 1280x800 base, 1.5x max scale
- Local HTTP server for Tone.js
- Steamworks.js bridge via preload.js

### Browser (itch.io)
- No Steam integration
- localStorage only
- Full Tone.js support

---

## Known Issues / Technical Debt

- Portrait SVG files in `assets/` are unused backups (game uses inline SVGs from PORTRAITS object)
- Console.log statements in MusicEngine could be removed for production
- 21.7K line monolithic script.js could benefit from modularization

---

## Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Steam Integration | Done | Achievements + Cloud Save |
| Electron Wrapper | Done | Mac + Win builds |
| Performance Audit | Identified | Fixes documented above |
| Low FX Mode | Done | Toggle in settings |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2024-12-20 | Initial creation from docs restructure | Documentation Team |
