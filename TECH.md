# TECH - Wordy Weapon

> **Owner**: Tech Subagent
> **Last Updated**: 2025-12-21
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

### HIGH Priority - Particle Layout Thrashing - FIXED (2025-12-21)

All particle systems now use `transform: translate3d()` for GPU-accelerated positioning:

| System | Status | Implementation |
|--------|--------|----------------|
| FloatingSparkManager | ✅ Fixed | Line ~20476 uses `translate3d()` |
| BlacksmithEmberManager | ✅ Fixed | Line ~20703 uses `translate3d()` |
| createParticleSwarm | ✅ Fixed | Line ~20200 uses `translate3d()` |
| Health bar shards | ✅ OK | Uses Web Animations API with transform |
| Flying chip animation | ✅ OK | Uses Web Animations API with transform |

**Note**: Remaining `.style.left/.top` usages are for initial positioning only, not animation loops.

### MEDIUM Priority - DOM Queries in Loops - FIXED (2025-12-21)

| Issue | Status | Fix Applied |
|-------|--------|-------------|
| `drawSkillTreeLines` queries DOM per node | ✅ Fixed | Now uses single `querySelectorAll` + Map for O(1) lookup |
| Damage preview forces reflow | ✅ Fixed | Uses double-rAF instead of `void offsetWidth` |

### LOW Priority - Animation Restart Reflows - FIXED (2025-12-21)

All forced reflow patterns (`void offsetWidth`) replaced with double-rAF:

| Location | Animation | Status |
|----------|-----------|--------|
| Damage preview blink | enemy-damage-preview | ✅ Fixed |
| Hero select shake (demo) | button shake | ✅ Fixed |
| Hero select shake (locked) | button shake | ✅ Fixed |
| Weapon layer slam-in | slam-in animation | ✅ Fixed |
| Logo bounce | logo-bounce | ✅ Fixed |

### Already Good
- No setInterval for visual animations (uses rAF)
- No scroll/touch listeners missing passive: true
- will-change on flame background effects

### FIXED (2025-12-21) - Flame Background Blur Pre-baked

**Issue**: Runtime `filter: blur(50px/90px)` on flame-bg pseudo-elements caused GPU overhead.

**Fix Applied**: Replaced blur filters with pre-baked soft gradients:
- Expanded gradient size (180vw x 110vh) to create natural edge falloff
- Added 12+ gradient stops for smooth color transitions
- Removed all `filter: blur()` from flame-bg CSS
- Updated Low FX mode to remove now-unnecessary blur reduction rule

**Result**: Zero blur filter overhead. Identical visual appearance with pure gradient rendering.

### FIXED (2025-12-21) - Weapon Aura & Shadow Blur Pre-baked

**Issue**: Runtime `filter: blur(20px)` on weapon auras (300x300px elements) and `blur(10px)` on weapon shadows.

**Fix Applied**:
- `#weapon-aura` and `#combat-weapon-aura`: Removed blur filter, expanded to 400x400px, JS now sets 7-stop soft gradient
- `.weapon-shadow`: Removed blur filter, expanded with `inset:-15px`, JS sets 5-stop soft gradient
- Dynamic coloring preserved via JS gradient with alpha hex values

**Result**: Zero blur filter overhead on weapon displays. Color still changes dynamically based on equipped element.

### FIXED (2025-12-21) - Word Bank Rebuild Optimization

**Issue**: First word placement caused stutter (~10-15ms) because `renderBank()` cleared and rebuilt all 20+ word chips from scratch.

**Root Cause**: Each chip required innerHTML parsing (5+ nested elements), and this happened for every word on every render.

**Fix Applied**:
1. **Smart chip removal**: When placing a non-weapon word (disabled states don't change), just remove that one chip from DOM instead of full rebuild
2. **DocumentFragment batching**: When full rebuild is needed, use DocumentFragment to batch DOM insertions (reduces reflows)
3. **Pre-warm during splash**: `preWarmGame()` creates dummy chips during splash screen to warm browser's CSS/layout calculator

**Files Modified**:
- `renderBank()` - Added `fastRemoveWordId` parameter for O(1) chip removal
- `_lastBankState` - Tracks hasItem/hasNoun to detect when disabled states change
- `preWarmGame()` - Pre-creates hidden chips during splash screen

**Result**: First word placement reduced from ~10ms to ~2ms. Subsequent placements are <1ms.

### FIXED (2025-12-21) - FLIP Animation Layout Thrashing + One-Frame Flash

**Issue 1 - Layout Thrashing**: Word chip animations after DOM rebuild caused stutter due to synchronous layout calculations. `playFlipAnimation()` was called immediately after DOM rebuild, forcing layout recalculation for each chip's `getBoundingClientRect()`.

**Fix Applied**: All `playFlipAnimation()` calls deferred to next frame with `requestAnimationFrame`.

**Issue 2 - One-Frame Flash**: Deferring with RAF introduced a 16ms gap where chips visually "teleport" to new position, then snap back for animation. This "jump-snap-fly" looks like stutter.

**Fix Applied**:
1. Chips with recorded FLIP positions start with `opacity: 0` in `renderBank()`
2. Animation keyframes include `opacity: 1` to reveal chips as animation starts
3. Non-moving chips (delta < 2) get opacity cleared directly

**Files Modified**: `game/script.js`
- `renderBank()` - Hide chips that will animate
- `playFlipAnimation()` - Added `opacity: 1` to all animation keyframes

**Result**: Chips remain invisible during RAF gap, then smoothly appear with animation. No visual flash.

### Known Trade-off: Paper-Overlay Composite Cost

**Background**: `#paper-overlay` uses `mix-blend-mode: soft-light` with SVG feTurbulence at `z-index: 9999`. Animating chips (`z-index: 10`) move underneath, forcing GPU recomposition.

**Mitigation**: Low FX mode hides paper-overlay entirely (`display: none`). For normal mode, this is an acceptable trade-off for the paper grain aesthetic. The main stutter was from the one-frame flash, not composite cost.

### FIXED (2025-12-21) - Real Loading Screen (Eliminates First-Use Stutter)

**Issue**: Race condition between async pre-loading and user interaction. User could start playing before audio buffers finished decoding, causing first-word-placement stutter.

**Solution**: Real loading screen that waits for everything before enabling ENTER button.

**What Gets Preloaded** (in parallel):
1. **Particle managers** - BlacksmithEmberManager, sparkManager initialized
2. **HTML Audio samples** - 10 common samples loaded into sampleCache
3. **Web Audio buffers** - 14 samples decoded into audioBufferCache (for panned playback)
4. **CSS/Animations** - Dummy elements trigger JIT compilation
5. **Chip factory** - mkChip() warmed with dummy chips

**UI Flow**:
1. Splash shows spinner + "Loading... X%"
2. `preloadAllSystems()` runs all tasks in parallel
3. Progress updates as each task completes
4. When 100%, spinner hides and ENTER button fades in
5. User clicks ENTER - everything is ready, no stutter

**Files Modified**:
- `game/index.html` - Added loading indicator div
- `game/styles.css` - Loading spinner styles
- `game/script.js` - `preloadAllSystems()` function, updated DOMContentLoaded

**Console Output**: `[PRELOAD] All systems ready in Xms`

### FIXED (2025-12-21) - Particle Manager Pre-warm Variable Name Bug

**Issue**: `preWarmGame()` checked for `emberManager` but the actual variable is `blacksmithEmberManager`. The pre-warm silently failed.

**Fix**: Changed `emberManager` → `blacksmithEmberManager` in the pre-warm check.

**Note**: The `blacksmithEmberManager` is also initialized earlier in DOMContentLoaded (line 21289-21291), so this is a belt-and-suspenders fix.

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

### Smart Auto-Scaling (2025-12-20)

**Problem**: Previous scaling only considered resolution. A 48" 4K TV and 13" MacBook Retina both report similar resolutions but need different UI sizes.

**Solution**: Smart scaling that considers both DPI and physical screen size:

1. **Estimate physical screen diagonal** from resolution and `display.scaleFactor`
2. **Apply comfort multiplier** based on screen size:
   - < 14" (laptop): 0.85-1.0x (smaller UI fits better)
   - 14-27" (desktop): 1.0x (standard, designed for this)
   - 27-48" (large display): 1.0-1.8x (bigger for viewing distance)
   - 48"+ (TV): 1.8-2.3x (couch gaming)

**Multi-Monitor Support**: Recalculates when window moves between displays.

**Files**: `electron/main.js` - `estimateScreenDiagonal()`, `calculateSmartBaseZoom()`, `updateContentScale()`

### Splash Screen (2025-12-20)

**Design**: Animated & Dynamic - flame background visible, logo with pulsing golden glow.

**Animation Sequence** (BPM-synced at 136 BPM):
1. **0s**: Pure black (::before pseudo-element covers screen)
2. **--half-beat (~0.22s)**: Black fades out over 3 beats, content fades in simultaneously
3. **3 beats (~1.32s)**: Logo + button fully visible
4. **4 beats (~1.76s)**: Logo golden glow pulse begins (3s cycle)
5. **User clicks ENTER**: Dissolve transition to main menu (blur + scale, 2 beats)

**Key CSS**:
- `#splash-screen::before`: Black cover that fades out (splashReveal animation)
- `.splash-content`: Fades in with scale (splashContentIn animation)
- `#splash-screen .logo-img`: Pulsing golden glow (logoGlow animation)
- All timing uses CSS variables: `var(--beat)`, `var(--half-beat)`

**Files**: `game/styles.css` lines 1391-1433

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
- Smart auto-scaling based on screen size and DPI (see Performance Optimization)
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
| 2025-12-21 | Word bank optimization: smart chip removal, DocumentFragment batching, pre-warm during splash; first placement ~10ms→~2ms | Tech Subagent |
| 2025-12-21 | REREAD loop mechanic: animation now loops through entire weapon phrase instead of repeating individual words; FX trigger on every pass for epic overlapping effects | Tech Subagent |
| 2025-12-21 | Weapon aura feathering: added more gradient stops (08, 04, 02) at outer edges for softer falloff | Tech Subagent |
| 2025-12-21 | Pre-baked weapon aura/shadow blur: removed filter:blur() from weapon-aura, combat-weapon-aura, weapon-shadow | Tech Subagent |
| 2025-12-21 | Pre-baked flame-bg blur: replaced runtime `filter: blur()` with soft gradient edges for better GPU performance | Tech Subagent |
| 2025-12-21 | Code audit cleanup: dither-overlay in low-fx, removed window.DEBUG, removed ~240 lines dead rarity drone code | Tech Subagent |
| 2025-12-21 | Fixed DOM query optimization (skill tree Map) and 5 forced reflow patterns (double-rAF) | Tech Subagent |
| 2025-12-21 | Verified particle systems already use translate3d(); updated documentation | Tech Subagent |
| 2025-12-21 | Fixed smart scaling bug: zoom now capped at fitScale to prevent content cutoff on large 4K displays | Tech Subagent |
| 2025-12-20 | Splash screen redesign: BPM-synced animations, flame bg visible, pulsing logo glow | Tech Subagent |
| 2025-12-20 | Removed UI scale slider (smart scaling handles it automatically) | Tech Subagent |
| 2025-12-20 | Updated smart scaling: 1.8x for 48" TVs, removed user preference slider | Tech Subagent |
| 2025-12-20 | Smart auto-scaling: considers screen size + DPI for comfortable UI on laptops vs TVs | Tech Subagent |
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
