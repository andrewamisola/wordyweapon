# Steamworks Release Checklist - Wordy Weapon

**App ID**: 4248130
**Release Date**: December 22, 2025

---

## Phase 1: Build All Platforms

### Windows (Done)
- [x] Build completed: `electron/dist/win-unpacked/`
- [x] Minified with Terser
- [x] Path fix for packaged app applied
- [ ] Test exe runs correctly

### Linux
- [ ] Run: `cd electron && npm run build-linux`
- [ ] Output: `electron/dist/linux-unpacked/`
- [ ] Test on Linux (if available)

### macOS (Requires Mac)
- [ ] Run on Mac: `cd electron && npm run build-mac`
- [ ] Output: `electron/dist/mac-universal/Wordy Weapon.app`
- [ ] Notarization (optional but recommended)

---

## Phase 2: Prepare Build Folders for Steam

Steam expects this folder structure:
```
WordyWeapon-Builds/
├── steam/
│   ├── windows/
│   │   └── [contents of win-unpacked]
│   ├── linux/
│   │   └── [contents of linux-unpacked]
│   └── mac/
│       └── Wordy Weapon.app
```

### Commands to organize:
```bash
# From electron folder:
mkdir -p ../../WordyWeapon-Builds/steam/windows
mkdir -p ../../WordyWeapon-Builds/steam/linux
mkdir -p ../../WordyWeapon-Builds/steam/mac

# Copy builds
cp -r dist/win-unpacked/* ../../WordyWeapon-Builds/steam/windows/
cp -r dist/linux-unpacked/* ../../WordyWeapon-Builds/steam/linux/
cp -r dist/mac-universal/*.app ../../WordyWeapon-Builds/steam/mac/
```

---

## Phase 3: Steamworks Partner Dashboard

### 3.1 Store Page (Already Done?)
- [ ] Capsule images (header, small capsule, large capsule)
- [ ] Screenshots (at least 5)
- [ ] Trailer video
- [ ] Short description
- [ ] Long description (About This Game)
- [ ] System requirements
- [ ] Tags/genres selected

### 3.2 Achievements (22 Total)
Verify these are configured in Steamworks:

**Existing (19):**
| API Name | Display Name | Description |
|----------|--------------|-------------|
| ACH_FIRST_VICTORY | First Victory | Win your first battle |
| ACH_WORDSMITH_MASTER | Wordsmith Master | Clear the game with all 6 heroes |
| ACH_ENDLESS_WARRIOR | Endless Warrior | Reach Round 15 |
| ACH_BOSS_SLAYER | Boss Slayer | Defeat all 5 chapter bosses |
| ACH_APPRENTICE_SMITH | Apprentice Smith | Clear on Apprentice difficulty |
| ACH_ADEPT_FORGER | Adept Forger | Clear on Adept difficulty |
| ACH_MASTER_BLACKSMITH | Master Blacksmith | Clear on Master difficulty |
| ACH_BOSS_CINNA_ANTONY | Cinna & Antony | Defeat Cinna & Antony |
| ACH_BOSS_RED_AKTINS | Red Aktins | Defeat Red Aktins |
| ACH_BOSS_PLAGUE_DOCTOR | Plague Doctor | Defeat The Plague Doctor |
| ACH_BOSS_OXY | Oxy | Defeat Oxy |
| ACH_BOSS_DOTDOTDOT | ... | Defeat ... |
| ACH_BOSS_SILENT_KNIGHT | Silent Knight | Defeat Silent Knight |
| ACH_HERO_GRAHAM | Graham's Victory | Win with Graham Moor |
| ACH_HERO_QUIVERA | Quivera's Victory | Win with Quivera |
| ACH_HERO_BELLE | Belle's Victory | Win with Belle Lettres |
| ACH_HERO_ALEXANDRIA | Alexandria's Victory | Win with Alexandria Constanza |
| ACH_HERO_CAESURA | Caesura's Victory | Win with Caesura |
| ACH_HERO_REED | Reed's Victory | Win with Reed |

**New (3) - Must Add:**
| API Name | Display Name | Description |
|----------|--------------|-------------|
| ACH_HOARDER | Hoarder | Fill your word bank to maximum capacity (24 words) |
| ACH_TREASURE_HUNTER | Treasure Hunter | Accumulate 1000+ gold in a single run |
| ACH_MINIMALIST | Minimalist | Defeat a boss using 3 or fewer words |

### 3.3 Cloud Saves
- [ ] Enable Steam Cloud
- [ ] Cloud quota: 1 MB should be plenty
- [ ] Files to sync:
  - `wordyweapon-stats.json` (persistent stats)
  - `wordyweapon-save.json` (current run)

### 3.4 Depots Configuration
Create depots for each platform:

| Depot ID | Platform | Content |
|----------|----------|---------|
| 4248131 | Windows | windows/* |
| 4248132 | macOS | mac/* |
| 4248133 | Linux | linux/* |

---

## Phase 4: SteamPipe Upload

### 4.1 Install Steamworks SDK
Download from: https://partner.steamgames.com/downloads/steamworks_sdk.zip

### 4.2 Create app_build.vdf
```vdf
"appbuild"
{
    "appid" "4248130"
    "desc" "Wordy Weapon 1.0 Release"
    "buildoutput" "../output/"
    "contentroot" "../content/"
    "setlive" "default"
    "preview" "0"
    "local" ""

    "depots"
    {
        "4248131" "depot_build_windows.vdf"
        "4248132" "depot_build_mac.vdf"
        "4248133" "depot_build_linux.vdf"
    }
}
```

### 4.3 Create depot VDFs

**depot_build_windows.vdf:**
```vdf
"DepotBuildConfig"
{
    "DepotID" "4248131"
    "contentroot" "windows/"
    "FileMapping"
    {
        "LocalPath" "*"
        "DepotPath" "."
        "recursive" "1"
    }
}
```

**depot_build_mac.vdf:**
```vdf
"DepotBuildConfig"
{
    "DepotID" "4248132"
    "contentroot" "mac/"
    "FileMapping"
    {
        "LocalPath" "*"
        "DepotPath" "."
        "recursive" "1"
    }
}
```

**depot_build_linux.vdf:**
```vdf
"DepotBuildConfig"
{
    "DepotID" "4248133"
    "contentroot" "linux/"
    "FileMapping"
    {
        "LocalPath" "*"
        "DepotPath" "."
        "recursive" "1"
    }
}
```

### 4.4 Upload Command
```bash
# From steamworks sdk tools folder:
./steamcmd.sh +login YOUR_USERNAME +run_app_build ../scripts/app_build.vdf +quit
```

---

## Phase 5: Launch Configuration

### 5.1 Set Launch Options in Steamworks

| OS | Executable | Arguments |
|----|------------|-----------|
| Windows | Wordy Weapon.exe | (none) |
| macOS | Wordy Weapon.app | (none) |
| Linux | wordy-weapon | (none) |

### 5.2 Steam Input (Optional)
- [ ] Controller support configured (if applicable)

---

## Phase 6: Final Verification

- [ ] Download and test Windows build from Steam
- [ ] Download and test Mac build from Steam
- [ ] Download and test Linux build from Steam
- [ ] Verify Steam overlay works (Shift+Tab)
- [ ] Unlock one achievement, verify it appears
- [ ] Test cloud save: play, close, reopen
- [ ] Check store page renders correctly

---

## Phase 7: Release

- [ ] Set release date in Steamworks
- [ ] Prepare launch announcement
- [ ] Click "Release App" when ready

---

## Quick Reference

**Steam App ID**: 4248130
**Steamworks Dashboard**: https://partner.steamgames.com/apps/landing/4248130

**Local Build Locations:**
- Windows: `electron/dist/win-unpacked/`
- Linux: `electron/dist/linux-unpacked/`
- Mac: `electron/dist/mac-universal/`

**Game identifies itself via:**
- `electron/steam_appid.txt` contains `4248130`
