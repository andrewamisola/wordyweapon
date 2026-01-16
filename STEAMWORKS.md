# Steamworks - Wordy Weapon

**App ID**: 4248130
**Release Date**: December 22, 2025
**Dashboard**: https://partner.steamgames.com/apps/landing/4248130

---

## Quick Reference

| Platform | Depot ID | Build Location |
|----------|----------|----------------|
| Windows | 4248131 | `electron/dist/win-unpacked/` |
| macOS | 4248132 | `electron/dist/mac-universal/` |
| Linux | 4248133 | `electron/dist/linux-unpacked/` |

**Cloud Save Files**: `wordyweapon-stats.json`, `wordyweapon-save.json` (1 MB quota)

---

## Store Page Content

### Short Description (< 300 characters)
```
Fill in the blanks to forge weapons in this madlibs roguelite RPG! Play as the Wordsmith—a mythical blacksmith who crafts mighty weapons from words. Combine adjectives and nouns, target elemental weaknesses, and trigger chain reactions to create the ultimate Wordy Weapon!
```

### About This Game (BBCode)
```
[b]Madlibs[/b] meet [b]roguelite![/b] Use [b]Words[/b] to fill in the blanks & forge a [b]Wordy Weapon[/b] to defeat the enemies!

[h2][b]GAMEPLAY |[/b] [i]SENTENCED TO DEATH[/i][/h2]

Unique [b]Heroes[/b] will call on you — [b]the Wordsmith[/b] — to forge a weapon of their liking.

[img]{STEAM_APP_IMAGE}/extras/ezgif.com-crop[/img]

[list]
[*] Modify the [b]Weapon[/b] using [b]Adjectives[/b] & [b]Nouns[/b], that come in different [b]Rarities[/b] and [b]Elements[/b]!
[*] String together a powerful sentence by targeting [b]Strengths[/b] & [b]Weaknesses[/b]!
[*] Buy & sell [b]Words[/b], manage your [b]Supplies[/b], and use [b]Tools[/b] to perfect your Wordcraft.
[*] Choose [b]Talents[/b] and [b]Skill Upgrades[/b] to increase your damage and create different builds
[*] Art & Music will dynamically change based on your creations
[*] Trigger chain reactions and [b]REREAD[/b] effects to multiply damage—stack enough combos and achieve the legendary [b]ULTIMATE WEAPON VICTORY![/b]
[/list]

[h2][b]ENDLESS ACTION |[/b] RUN-ON SENTENCES[/h2]

[img]{STEAM_APP_IMAGE}/extras/screenshot_2025-12-11_at_4.55.04 pm_cropped[/img]

[list]
[*] [b]6 Heroes, 5 Bosses, 15 Enemies[/b] and [b]1 Secret Boss[/b] with unique dialogue
[*] [b]8 Elements, 4 Weapon Types, 6 Rarities[/b] = [b]42 Words[/b] and 6 blanks to fill = [b]MILLIONS of combinations![/b]
[*] [b]130+ Talents[/b] and [b]Tools[/b] to scale your power and mix up different strategies and playstyles
[*] Skill trees to level up your favorite Hero and achievements to earn
[*] [b]Endless Mode[/b] with Leaderboard and Statistics
[*] 3 Difficulty Modes: Apprentice, Adept, and Master
[*] Steam Achievements & Cloud Saves
[/list]

[h2][b]EXTRA FEATURES[/b][/h2]

[img]{STEAM_APP_IMAGE}/extras/2025-12-07_23-00-13.00_00_26_53.still003[/img]

[list]
[*] Transparent and robust damage breakdown so you know which Words are empowering your Weapons
[*] Dynamic original music with Elements tied to instruments
[/list]
```

---

## Achievements (22 Total)

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
| ACH_HOARDER | Hoarder | Fill your word bank to maximum capacity (24 words) |
| ACH_TREASURE_HUNTER | Treasure Hunter | Accumulate 1000+ gold in a single run |
| ACH_MINIMALIST | Minimalist | Defeat a boss using 3 or fewer words |

---

## System Requirements

### Windows
- **Minimum**: Windows 10, Intel Core i3, 4 GB RAM, Integrated graphics, 500 MB storage
- **Recommended**: Windows 10/11, Intel Core i5, 8 GB RAM, Dedicated GPU 1GB VRAM

### macOS
- **Minimum**: macOS 10.15 (Catalina), Apple M1 or Intel Core i3, 4 GB RAM, 1 GB storage
- **Recommended**: macOS 12 (Monterey), Apple M1 or Intel Core i5, 8 GB RAM

### Linux
- **Minimum**: Ubuntu 20.04, Intel Core i3, 4 GB RAM, 500 MB storage
- **Recommended**: Ubuntu 22.04, Intel Core i5, 8 GB RAM, Dedicated GPU 1GB VRAM

---

## Build & Upload

### Build Commands
```bash
cd electron && npm run build-mac   # macOS
cd electron && npm run build-win   # Windows
cd electron && npm run build-linux # Linux (if needed)
```

### SteamPipe Upload
```bash
./steamcmd.sh +login YOUR_USERNAME +run_app_build ../scripts/app_build.vdf +quit
```

### Launch Options
| OS | Executable |
|----|------------|
| Windows | Wordy Weapon.exe |
| macOS | Wordy Weapon.app |
| Linux | wordy-weapon |

---

## Social Links
- Website: https://andrewamisola.com/interactive/games/wordy-weapon
- X: https://x.com/wordyweapon
- TikTok: https://tiktok.com/@wordyweapon
- YouTube: https://www.youtube.com/@wordyweapon

**Legal**: © 2025 Andrew Amisola. All rights reserved.
