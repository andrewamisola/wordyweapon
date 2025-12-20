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
├── game/                  # Source files (SINGLE SOURCE OF TRUTH)
│   ├── index.html
│   ├── script.js
│   ├── styles.css
│   ├── assets/            # SVG portraits
│   └── sfx/               # Audio (ogg format)
├── electron/              # Desktop wrapper (uses ../game/)
│   ├── main.js            # Points to ../game for dev
│   ├── preload.js
│   └── package.json       # Build scripts copy game/ for dist
└── builds/                # Output (don't edit)
    ├── itch/
    └── steam/
```

**Note**: Electron dev mode uses the shared `game/` folder via `path.join(__dirname, '..', 'game')`. Build scripts copy `game/` into `electron/game/` for self-contained distribution packages.

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

#### Existing Achievements
```
ACH_FIRST_VICTORY      - First boss defeated
ACH_WORDSMITH_MASTER   - 100+ damage single hit
ACH_ENDLESS_WARRIOR    - Reach Round 15
ACH_BOSS_SLAYER        - Defeat all 5 chapter bosses
ACH_APPRENTICE_SMITH   - Clear on Apprentice
ACH_ADEPT_FORGER       - Clear on Adept
ACH_MASTER_BLACKSMITH  - Clear on Master
ACH_BOSS_[name]        - Per-boss achievements (6 total)
ACH_HERO_[name]        - Per-hero win achievements (6 total)
```

#### New Achievements (Design Phase - Not Yet Implemented)
```
# Precision & Mastery
ACH_PERFECT_STRIKE        - Deal exact damage = enemy HP
ACH_LEGENDARY_FORGE       - All 6 slots filled with T3 words only
ACH_ULTIMATE_WEAPON       - Trigger infinite loop victory (⚠️ needs testing)

# Element & Synergy
ACH_RAINBOW_WARRIOR       - Use all 8 elements in one run
ACH_PURE_ELEMENT          - Win using only one element type
ACH_FAMILY_REUNION        - Use 4+ words from same element family

# Talent Mastery
ACH_ECHO_CHAMBER          - Trigger 10+ REREADs in one combat
ACH_WORDS_OF_POWER        - Win with 100+ W value
ACH_MULTIPLIER_MADNESS    - Win with 10x+ damage multiplier

# Hero Challenges
ACH_WELL_READ             - Belle victory using only Body & Soul
ACH_SILENT_VICTORY        - Caesura win with only Dark/Poison
ACH_NATURES_WRATH         - Reed reaches Round 15+

# Economy & Strategy
ACH_HOARDER               - Fill Word Bank to max (24 words)
ACH_TREASURE_HUNTER       - Accumulate 1000+ gold in one run
ACH_MINIMALIST            - Win boss fight with 3 or fewer words
```

See DESIGN.md for full achievement specifications and unlock conditions.

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

### FIXED (2024-12-20) - Fullscreen Scaling & Canvas Performance

**Issue**: Elemental FX dropped to <10 FPS in fullscreen on Windows (4K displays). Game didn't scale proportionally.

**Root Cause**: Game tried to render at native resolution (e.g., 4K) instead of fixed resolution with scaling.

**Fix Applied - Fixed 1080p Resolution with Electron Zoom**:

1. **Game renders at fixed 1920x1080** regardless of window/screen size
2. **Electron uses `setZoomFactor()`** to scale content uniformly (`electron/main.js`)
3. **Browser builds use CSS transform** for scaling (`game/script.js` scaleGame())
4. **Letterboxing** via black body background and centered game container

**Files Modified**:
- `electron/main.js`: Changed BASE_WIDTH/HEIGHT to 1920x1080, aspect ratio to 16:9, updateContentScale() uses setZoomFactor()
- `game/script.js`: Added GAME_WIDTH/HEIGHT constants, IS_ELECTRON detection, scaleGame() for browser builds, resizeFxCanvas() uses fixed dimensions
- `game/styles.css`: Added #game-container (fixed 1920x1080), body letterboxing, fixed flame-bg dimensions
- `game/index.html`: Added game-container wrapper div

**Performance Result**: Consistent 60 FPS at any resolution including 4K fullscreen

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
- Fixed 1920x1080 render resolution, scaled via setZoomFactor()
- Window: 16:9 aspect ratio locked, min 960x540
- Local HTTP server for Tone.js
- Steamworks.js bridge via preload.js

### Browser (itch.io)
- No Steam integration
- localStorage only
- Full Tone.js support

---

## UI Elements - Demo vs Full Build

### Wishlist Button
- **Location**: Main menu footer, Pause menu footer, Victory screen
- **Visibility**: Only shown when `IS_DEMO = true`
- **Behavior**: Opens Steam wishlist page in new tab
- **Implementation**: Added to `demoElements` array in script.js (~line 21292-21299)
  - `wishlist-btn` (main menu)
  - `pause-wishlist-btn` (pause menu)
  - `victory-wishlist-btn` (victory screen)

### Discord Button
- **Location**: Main menu footer, Pause menu footer
- **Visibility**: Always shown (both demo and full builds)
- **Styling**: Subtle/lowkey design
  - Small font (10px)
  - Semi-transparent (opacity 0.7, 1.0 on hover)
  - Muted Discord purple colors (rgba(88,101,242))
  - Positioned below Wishlist button when both visible
- **URL**: Placeholder `https://discord.gg/wordyweapon` (update when real invite created)
- **Implementation**:
  - HTML: index.html lines 463, 576
  - Event handlers: script.js lines 21511-21541
  - URL constant: script.js line 210

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
| 2025-12-20 | Fixed flame background position in Low FX mode: center transform + skip mouse tracking | Tech Subagent |
| 2025-12-20 | Fixed Electron first-word-placement lag: pre-warm Web Audio node types (BufferSource, Gain, StereoPanner) | Tech Subagent |
| 2025-12-20 | Fixed first-word-placement stutter: pre-warm BlacksmithEmberManager and preload audio samples | Tech Subagent |
| 2025-12-20 | Fixed parallax blur on 4K 120Hz: use translate3d + integer pixels + will-change | Tech Subagent |
| 2025-12-20 | Consolidated codebase: Electron now uses shared game/ folder, deleted duplicate electron/game/ | Manager |
| 2025-12-20 | Fixed wishlist buttons visibility: added pause-wishlist-btn and victory-wishlist-btn to demoElements | Manager |
| 2025-12-20 | Removed duplicate "Close Menu" button from pause menu | Manager |
| 2024-12-20 | Fixed 1080p resolution + Electron setZoomFactor for 4K fullscreen | Tech Subagent |
| 2024-12-20 | Add Discord button (always visible) and restrict Wishlist to demo-only | Tech Subagent |
| 2024-12-20 | Initial creation from docs restructure | Documentation Team |
