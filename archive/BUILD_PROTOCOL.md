# Wordy Weapon Build Protocol

## Quick Reference

| Setting | Demo Build | Full Build |
|---------|-----------|------------|
| `IS_DEMO` in script.js | `true` | `false` |
| `steam_appid.txt` | Demo App ID | Full App ID |
| `package.json` productName | "Wordy Weapon Demo" | "Wordy Weapon" |
| `package.json` appId | `com.andrewamisola.wordyweapondemo` | `com.andrewamisola.wordyweapon` |

---

## Demo Build Checklist

### 1. Game Code (`game/script.js`)
```javascript
// Line 1-4
const IS_DEMO = true;
const DEMO_ROUND_LIMIT = 18;
const DEMO_HERO_LIMIT = 2;
```

**Demo restrictions when `IS_DEMO = true`:**
- Only first 2 heroes available (Graham Moor, Quivera)
- Game ends at Round 18 with victory screen
- Only Apprentice difficulty available (Adept/Master locked)
- "DEMO" label shown on splash screen
- Demo footer shown
- Victory overlay prompts wishlist
- Locked heroes show "Full Game" message

### 2. Electron Config (`electron/package.json`)
```json
{
  "productName": "Wordy Weapon Demo",
  "build": {
    "appId": "com.andrewamisola.wordyweapondemo",
    "productName": "Wordy Weapon Demo"
  }
}
```

### 3. Steam App ID (`electron/steam_appid.txt`)
```
YOUR_DEMO_APP_ID
```
Replace with actual Steam Demo App ID when assigned.
Currently using `480` (Spacewar test ID).

### 4. Build Commands
```bash
cd /Users/andrewamisola/Desktop/WordyWeapon-Dev/electron

# For Steam (Mac + Windows)
npm run build-steam
# Output: ../../WordyWeapon-Builds/steam/

# For itch.io (Web)
npm run build-itch
# Output: ../../WordyWeapon-Builds/itch/
```

---

## Full Build Checklist

### 1. Game Code (`game/script.js`)
```javascript
// Line 1-4
const IS_DEMO = false;
const DEMO_ROUND_LIMIT = 18;   // ignored when IS_DEMO=false
const DEMO_HERO_LIMIT = 2;     // ignored when IS_DEMO=false
```

**Full game features when `IS_DEMO = false`:**
- All 6 heroes (unlock via boss defeats)
- Endless mode after Round 9
- All 3 difficulties (Apprentice/Adept/Master)
- No demo labels or footer
- Standard victory flow

### 2. Electron Config (`electron/package.json`)
```json
{
  "productName": "Wordy Weapon",
  "build": {
    "appId": "com.andrewamisola.wordyweapon",
    "productName": "Wordy Weapon"
  }
}
```

### 3. Steam App ID (`electron/steam_appid.txt`)
```
YOUR_FULL_GAME_APP_ID
```
Replace with actual Steam Full Game App ID.

### 4. Build Commands
```bash
cd /Users/andrewamisola/Desktop/WordyWeapon-Dev/electron

# For Steam (Mac + Windows)
npm run build-steam
# Output: ../../WordyWeapon-Builds/steam/

# Individual platforms
npm run build-mac
npm run build-win
npm run build-linux
npm run build-all
```

---

## Steam Integration Notes

### Achievement IDs (must match Steamworks config)
```
ACH_FIRST_VICTORY      - First boss defeated
ACH_WORDSMITH_MASTER   - 100+ damage single hit
ACH_ENDLESS_WARRIOR    - Reach Round 15
ACH_BOSS_SLAYER        - Defeat all 5 chapter bosses
ACH_APPRENTICE_SMITH   - Clear on Apprentice
ACH_ADEPT_FORGER       - Clear on Adept
ACH_MASTER_BLACKSMITH  - Clear on Master
ACH_BOSS_CINNA         - Defeat Cinna & Antony
ACH_BOSS_REDAKTINS     - Defeat Red Aktins
ACH_BOSS_PLAGUE        - Defeat Plague Doctor
ACH_BOSS_OXY           - Defeat Oxy
ACH_BOSS_DOTDOTDOT     - Defeat Dotdotdot
ACH_HERO_GRAHAM        - Win with Graham Moor
ACH_HERO_QUIVERA       - Win with Quivera
ACH_HERO_BELLE         - Win with Belle Lettres
ACH_HERO_ALEXANDRIA    - Win with Alexandria
ACH_HERO_CAESURA       - Win with Caesura
ACH_HERO_REED          - Win with Reed
```

### Steam Cloud Keys
- `wordy_weapon_stats` - Persistent stats (PStats)
- `wordy_weapon_run` - Current run state (S)

### Testing Without Steam
The game gracefully falls back to localStorage when Steam is unavailable.
Steam errors in console are expected during local development.

---

## Pre-Release Checklist

- [ ] Set correct `IS_DEMO` value
- [ ] Update `steam_appid.txt` with real App ID
- [ ] Update `package.json` productName and appId
- [ ] Remove debug console.logs (especially in MusicEngine ~lines 7079-7127)
- [ ] Test save/load functionality
- [ ] Test all difficulty levels (full build)
- [ ] Test hero unlocks (full build)
- [ ] Verify Steam achievements trigger correctly
- [ ] Test on both Mac and Windows

---

## Current Status

**IS_DEMO:** `false` (set for development/testing)
**steam_appid.txt:** `480` (Spacewar test ID)
**package.json:** Demo configuration

**To build demo:** Set `IS_DEMO = true` in script.js, then run build commands.
