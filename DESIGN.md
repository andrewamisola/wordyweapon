# DESIGN - Wordy Weapon

> **Owner**: Design Subagent
> **Last Updated**: 2024-12-20
> **Status**: Stable

## Document Purpose
Combat mechanics, hero balance, talent system, word database, enemy design, economy tuning, and difficulty scaling. This is the authoritative reference for all game design decisions.

---

## Quick Reference

### Elements
| ID | Element | Color | Family |
|----|---------|-------|--------|
| 0 | Physical | #94a3b8 | Body & Soul |
| 1 | Poison | #84cc16 | Body & Soul |
| 2 | Fire | #f97316 | World & Sky |
| 3 | Water | #3b82f6 | World & Sky |
| 4 | Light | #fbbf24 | Body & Soul |
| 5 | Dark | #6b21a8 | Body & Soul |
| 6 | Earth | #78716c | World & Sky |
| 7 | Lightning | #facc15 | World & Sky |

### Damage Types
- Slash, Pierce, Blunt, Magic

### Rarities
| Tier | Name | Drop Weight |
|------|------|-------------|
| T1 | Common | 50% |
| T2 | Uncommon/Magic | 35% |
| T3 | Rare/Epic/Legendary | 15% |

### Key Constants
```javascript
E = {PHYS:0, POISON:1, FIRE:2, WATER:3, LIGHT:4, DARK:5, EARTH:6, LIGHTNING:7}
R = {RUSTY:-1, COMMON:0, UNCOMMON:2, MAGIC:2, RARE:3, EPIC:3, LEGENDARY:3}
INV_LIMIT = 30
CONSUMABLE_LIMIT = 2
```

---

## Combat System

### Damage Calculation
Turn-based combat with:
- **Elemental Strengths/Weaknesses**: 2x damage on weakness
- **Weapon Type Proficiency**: Hero-specific bonuses/penalties
- **Word Combinations**: AP aggregated from word tiers and traits
- **Final Damage**: floor(AP × W × Multipliers)

### Calculation Flow
```
PHASE 1: Base AP (from words + flat AP talents)
    ↓
PHASE 2: Base W (from words + per-word W talents)
    ↓
PHASE 3: Multipliers (×M talents)
    ↓
PHASE 4: REREADs (add AP + W again, track rereadCount)
    ↓
PHASE 4.5: CONVERTERS (transform resources)
    ↓
PHASE 5: THRESHOLDS (check values, trigger effects)
    ↓
PHASE 5.5: LOOP (if thresholds triggered REREADs, max 100 iterations)
    ↓
PHASE 6: Final Damage = floor(AP × W × Mult)
```

### REREAD Mechanics
- REREAD = Retriggers a word's full contribution (AP + W + ×Mult)
- REREAD ALL = Retriggers every word in the forge
- Loop detection: If iterations ≥100 or damage exceeds MAX_SAFE_INTEGER → ULTIMATE WEAPON VICTORY

---

## Heroes (6 Playable Characters)

| Hero | Class | Elements | Proficiency | Capstone |
|------|-------|----------|-------------|----------|
| Graham Moor | Warrior | Physical/Earth | Slash | Duty Bound |
| Quivera | Ranger | Lightning/Earth | Pierce | Last Arrow |
| Belle Lettres | Mage | Body & Soul strong, World & Sky weak | Magic | Knowledge Eternal |
| Alexandria Constanza | Paladin | Light/Physical | Blunt | Sacred Flame |
| Caesura | Assassin | Dark/Poison | Pierce | Final Silence |
| Reed | Druid | Earth/Water | Blunt | One With Nature |

### Belle Lettres Special Mechanics
- **Passive "Well-Read"**: Body & Soul words: +2 AP, World & Sky words: -2 AP
- **Capstone "Knowledge Eternal"**: All words REREAD ×1 (every word triggers twice)

### Hero Unlocks
| Hero | Unlocked By |
|------|-------------|
| Graham Moor | Default |
| Quivera | Defeat Cinna & Antony |
| Belle Lettres | Defeat Red Aktins |
| Alexandria | Defeat Plague Doctor |
| Caesura | Defeat Oxy |
| Reed | Defeat Dotdotdot |

---

## Talent System (50 Talents)

### Design Philosophy
**The Domino Effect**: Talents interact to create feedback loops. Finding the right combination lets players "break" the game.

### Category Summary
| Category | Count | Purpose |
|----------|-------|---------|
| Generators | 8 | Build W pool |
| Multipliers | 12 | Boost damage |
| Retriggers | 8 | Add contributions again |
| Converters | 8 | Transform resources |
| Thresholds | 10 | Trigger on values |
| Effects | 4 | Bend rules |

### Rarity Distribution
| Rarity | Count | Drop Weight |
|--------|-------|-------------|
| Common | 2 | 50% |
| Uncommon | 18 | 35% |
| Rare | 30 | 15% |

### Example Infinite Combo
1. Gemination (same tier → REREAD all)
2. Echo Chamber (REREAD → +5 W)
3. Critical Mass (50+ W → REREAD all)
4. Crescendo (6+ REREADs → REREAD all again)

Play 6 T2 words → infinite loop → ULTIMATE WEAPON VICTORY

---

## Enemies

### Common Enemies (15)
| Enemy | What They Are | Weaknesses |
|-------|--------------|------------|
| Vowel Goblin | Hoards vowels | 2 weaknesses, 2-4 resistances |
| Ghost | Phantom word that refused deletion | varies |
| Synonym Roll | Bread-creature of redundancy | varies |
| Comma Chameleon | Causes pauses everywhere | varies |
| Webster Spiderling | Spins webs of definitions | varies |
| Hyphen-Hyena | Two-faced compound creature | varies |
| Pun Goblin | Desperately tries to be funny | varies |
| Apostro-Fiend | Possessive demon | varies |
| Idiomatic Undead | Corpse animated by dead metaphors | varies |
| Vulgar Vandal | Creature of censored rage | varies |
| Double Negative | Paradox that can't not exist | varies |
| Run-On Sentence | Never stops never pauses | varies |
| Split Infinitive | Boldly goes where it shouldn't | varies |
| Mixed Metaphor | Chaotic mashup | varies |
| Passive Voice | Amorphous, agency avoided | varies |

### Chapter Bosses (5)
| Boss | Ability | Unlocks |
|------|---------|---------|
| Cinna & Antony | Only hurt by harmony or opposition | Quivera |
| Red Aktins | Blocks random word slots | Belle Lettres |
| Plague Doctor | Immune to your strongest element | Alexandria |
| Oxy | Opposing elements deal 0 damage | Caesura |
| Dotdotdot | Gem slot ignored | Reed |

### Scaling
- Minibosses at Rounds 3, 6 with stat modifiers
- Chapter bosses at Round 9
- Endless mode after Round 9 with exponential HP scaling

---

## Economy

### Starting Resources by Difficulty
| Difficulty | Gold | Enemy HP | Skill Tree |
|------------|------|----------|------------|
| Apprentice | 20 | 100% | Full |
| Adept | 10 | 150% | 50% effectiveness |
| Master | 10 | 200% | Disabled |

### Shop System
- **Crates**: World & Sky (Fire/Water/Earth/Lightning), Body & Soul (Phys/Poison/Light/Dark)
- **Reroll Cost**: First 5 gold, escalates per use
- **Inventory Limit**: 30 words, 2 consumables

---

## Difficulty System

### Three-Tier System (Blacksmithing Ranks)
| Mode | Enemy HP | Skill Tree | Start Gold |
|------|----------|------------|------------|
| Apprentice | 100% | Full effectiveness | 20 |
| Adept | 150% | 50% effectiveness | 10 |
| Master | 200% | Disabled | 10 |

### Future: Ascension System (Proposed)
10-level cumulative modifiers inspired by Slay the Spire. See archived PLAN.md for details.

---

## Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| 6 Heroes | Done | All implemented with skill trees |
| 50 Talents | Done | Categories and synergies working |
| 15 Enemies | Done | All with dialogue |
| 5 Bosses | Done | Unique mechanics |
| 3 Difficulties | Done | Apprentice/Adept/Master |
| Talent Rebalance | Planned | 50→59 talents, tier redistribution |

---

## Steam Achievements (NEW)

### Design Philosophy
- **Fun over grind**: No 200+ hour grinds. Achievements should be entertaining challenges.
- **Playstyle variety**: Encourage players to explore different heroes, elements, talents, and strategies.
- **Skill-based**: Reward creative play and mastery, not just time investment.
- **Discoverable**: Most achievements should emerge naturally from skilled play.

### Achievement List (15 New Achievements)

#### Precision & Mastery
| ID | Name | Description | Unlock Condition |
|----|------|-------------|------------------|
| ACH_PERFECT_STRIKE | Perfect Strike | Deal damage exactly equal to enemy's remaining HP | heroDmg === enemyHp (any combat) |
| ACH_LEGENDARY_FORGE | Legendary Forge | Forge a weapon with all 6 slots filled using only Tier 3 words | All 6 slots filled AND all words are tier === 3 |
| ACH_ULTIMATE_WEAPON | The Ultimate Weapon | Trigger an infinite loop and forge the Ultimate Weapon | ultimateWeaponForged === true (⚠️ Needs testing) |

#### Element & Synergy
| ID | Name | Description | Unlock Condition |
|----|------|-------------|------------------|
| ACH_RAINBOW_WARRIOR | Rainbow Warrior | Forge a weapon using all 8 elements in a single run | Track unique elements used across run, check === 8 |
| ACH_PURE_ELEMENT | Elemental Purist | Win a combat using only words from a single element (no Physical) | All words in forge are same element (Fire/Water/Earth/Lightning/Poison/Light/Dark) |
| ACH_FAMILY_REUNION | Family Reunion | Forge a weapon using 4 words from the same element family (World & Sky OR Body & Soul) | 4+ words from same family in one forge |

#### Talent Mastery
| ID | Name | Description | Unlock Condition |
|----|------|-------------|------------------|
| ACH_ECHO_CHAMBER | Echo Chamber | Trigger 10+ REREADs in a single combat | rereadCount >= 10 |
| ACH_WORDS_OF_POWER | Words of Power | Win a round with 100+ W in the calculation | Final W >= 100 before multipliers |
| ACH_MULTIPLIER_MADNESS | Multiplier Madness | Win with a 10x or higher damage multiplier | Final damage multiplier >= 10 |

#### Hero Challenges
| ID | Name | Description | Unlock Condition |
|----|------|-------------|------------------|
| ACH_WELL_READ | Well-Read Scholar | Win a run with Belle Lettres using only Body & Soul words | Belle + all words used are Body & Soul (Phys/Poison/Light/Dark) |
| ACH_SILENT_VICTORY | Silent Victory | Win a combat with Caesura using only Dark and Poison words | Caesura + all words are Dark or Poison |
| ACH_NATURES_WRATH | Nature's Wrath | Win a run with Reed reaching Round 15+ | Reed + roundIndex >= 15 |

#### Economy & Strategy
| ID | Name | Description | Unlock Condition |
|----|------|-------------|------------------|
| ACH_HOARDER | Word Hoarder | Fill your Word Bank to maximum capacity (24 words) | inventory.length >= 24 |
| ACH_TREASURE_HUNTER | Treasure Hunter | Accumulate 1000+ gold in a single run | S.gold >= 1000 at any point (track peak) |
| ACH_MINIMALIST | Minimalist Victory | Win a boss fight using only 3 words or fewer in the forge | Boss fight won with wordCount <= 3 |

### Achievement Tracking Requirements

**New PStats fields needed:**
```javascript
PStats.achievements = {
  ACH_PERFECT_STRIKE: false,
  ACH_LEGENDARY_FORGE: false,  // Renamed from MASTER_WORDSMITH
  ACH_ULTIMATE_WEAPON: false,
  ACH_RAINBOW_WARRIOR: false,
  ACH_PURE_ELEMENT: false,
  ACH_FAMILY_REUNION: false,
  ACH_ECHO_CHAMBER: false,
  ACH_WORDS_OF_POWER: false,
  ACH_MULTIPLIER_MADNESS: false,
  ACH_WELL_READ: false,
  ACH_SILENT_VICTORY: false,
  ACH_NATURES_WRATH: false,
  ACH_HOARDER: false,
  ACH_TREASURE_HUNTER: false,
  ACH_MINIMALIST: false
};
```

**New run tracking needed:**
- `S.elementsUsedThisRun` (Set) - Track unique elements used
- `S.highestGoldReached` - Track peak gold for Treasure Hunter

**Combat tracking needed:**
- Check exact damage on each combat resolution
- Track rereadCount, W value, multiplier from calc() breakdown
- Track word count in forge

### Implementation Notes for Tech Subagent

1. **Perfect Strike**: Check `c.heroDmg === safeEnemy.hp` in combat resolution (before hp update)
2. **Echo Chamber**: Access `ctx.rereadCount` from calc() or expose via lastCombatResult
3. **Ultimate Weapon**: Already tracked via `ultimateWeaponForged` flag
4. **Element tracking**: Count unique elements in `S.elementsUsedThisRun` on each forge
5. **Pure Element**: Check all words in forge array have same element (filter nulls)
6. **Multiplier check**: Extract final multiplier from calc() breakdown
7. **Boss victories**: Check `S.enemy.boss === true` when evaluating Minimalist

---

## Ultimate Weapon Build Diversity (TODO)

### Current State
Only **2 viable paths** to Ultimate Weapon (9 quadrillion damage):
1. **REREAD Build**: Reread Amplifier (×1.5^REREADs) + REREAD talents
2. **W Overflow Build**: Overflow (×1.5^W) + W generator talents

**Problem:** Gold, AP, Element, and Chapter builds cannot reach Ultimate Weapon practically.

### Design Goal
Create **4-6 distinct build archetypes** that can achieve Ultimate Weapon, each requiring 4-6 upgraded talents working in tandem. No single talent should solo-carry.

---

### BUILD 1: REREAD Build (Existing ✓)
**Core:** Reread Amplifier (×1.5 per REREAD, exponential)
**Support:** Gemination, Critical Mass, Resonance, Khopesh, Crescendo, Echo Chamber

**Synergy:** REREAD talents stack count → Amplifier multiplies exponentially

---

### BUILD 2: W Overflow Build (Existing ✓)
**Core:** Overflow (×1.5 per 10 W above 50, exponential)
**Support:** Echo Chamber, Slow Burn, Momentum, Reverberation, Golden Tongue

**Synergy:** W generators stack W → Overflow multiplies exponentially

---

### BUILD 3: Gold Tycoon Build (NEEDS NEW TALENT)

**Problem:** Compound Interest (×1.15 per 50g) scales too slowly. Need 8000+ gold.

**Proposed New Talent - "Midas Touch" (Rare, Threshold):**
> Per 100 gold held: ×1.4 (stacks multiplicatively)

**Support talents needed:**
- Golden Tongue (gold → W, feeds Overflow too)
- Overkill Dividend (overkill → gold)
- Tithe (gold spent → W)
- Compound Interest (existing)
- **NEW: "Investor" (Common, Generator):** +5 gold per round survived

**Math check:**
```
2000 gold / 100 = 20 stacks
×1.4^20 = 836x (at level 1)
×1.55^20 = 14,000x (at level 3)
Combined with base multipliers: achievable at ~3000 gold
```

---

### BUILD 4: AP Overflow Build (NEEDS NEW TALENT)

**Problem:** No exponential AP scaler exists.

**Proposed New Talent - "Verbosity" (Rare, Threshold):**
> Per 50 AP above 100: ×1.3 (stacks multiplicatively)

**Support talents needed:**
- Bibliophile (words → AP)
- Eloquent/Erudite/Verbose (round scaling AP)
- Bibliography (bosses → AP)
- Residual (W bonuses → AP)
- **NEW: "Lexical Density" (Uncommon, Converter):** Per T3 word: +8 AP

**Math check:**
```
500 AP total, 100 base = 400 excess
400 / 50 = 8 stacks
×1.3^8 = 8x (needs more support)
With upgrades and more AP gen: ×1.45^15 = 250x
Need ~25 stacks at level 3 for viable path
```

---

### BUILD 5: Elemental Cascade Build (NEEDS NEW TALENT)

**Problem:** Cascade capped at 8 elements (×1.5^8 = 25x max).

**Proposed New Talent - "Prismatic Convergence" (Rare, Threshold):**
> All 8 Elements in forge: ×3, and each element word grants ×1.2

**Alternative - "Elemental Resonance" (Rare, Converter):**
> Per element match with enemy weakness: ×1.5 AND REREAD matching words

**Support talents needed:**
- Cascade (existing)
- Spectrum (elements → W)
- Diacope (family → REREAD ALL)
- Element combo talents (Yin Yang, Magma, Storm, etc.)
- **NEW: "Chromatic" (Uncommon):** 6+ unique elements: ×2.5

**Synergy:** Hitting all 8 elements unlocks massive multipliers + feeds into REREAD/W builds

---

### BUILD 6: Endurance/Chapter Build (NEEDS NEW TALENT)

**Problem:** Pilgrimage (×1.5 per chapter) requires 50+ chapters alone.

**Proposed New Talent - "Eternal Scholar" (Rare, Threshold):**
> Per 5 rounds survived: ×1.25 (stacks multiplicatively)

**Support talents needed:**
- Pilgrimage (existing)
- Slow Burn (rounds → W)
- Momentum (rounds → W per word)
- **NEW: "Veteran's Wisdom" (Uncommon):** Per round: +2 AP per word
- **NEW: "Compounding Knowledge" (Rare):** Round number × talent count = bonus ×mult

**Math check:**
```
Round 50: 50/5 = 10 stacks
×1.25^10 = 9.3x (level 1)
×1.375^10 = 23x (level 3)
Combined with Pilgrimage chapter 6: ×1.625^6 × 23x = 420x
Still needs W/AP support, but viable as hybrid
```

---

### Implementation Priority

| Build | New Talents Needed | Complexity | Priority |
|-------|-------------------|------------|----------|
| Gold Tycoon | 2 (Midas Touch, Investor) | Low | High |
| AP Overflow | 2 (Verbosity, Lexical Density) | Medium | Medium |
| Elemental | 2 (Prismatic Convergence, Chromatic) | Medium | Medium |
| Endurance | 2-3 (Eternal Scholar, Veteran's Wisdom, Compounding Knowledge) | High | Low |

**Total new talents:** 8-9 talents to enable 4 new build paths

---

### Key Design Principles

1. **No Solo Carries:** Each build needs 4-6 talents working together
2. **Upgrade Dependency:** Level 3+ required for Ultimate Weapon viability
3. **Cross-Pollination:** Builds should have some talent overlap (e.g., W generators help multiple builds)
4. **Distinct Fantasy:** Each build should feel different to play
   - REREAD: "My words echo infinitely"
   - W Overflow: "Every word carries immense weight"
   - Gold: "I'm literally too rich to fail"
   - AP: "Raw power through vocabulary"
   - Element: "Master of all elements"
   - Endurance: "I grow stronger each round"

---

## Open Questions

- [ ] Belle Lettres capstone "Knowledge Eternal" - needs testing for balance
- [ ] Talent count: Current 50 vs proposed 59 in rebalance plan
- [ ] Ascension system implementation priority
- [ ] Achievement balance testing: Are any achievements too easy/hard?

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2024-12-23 | Add Ultimate Weapon build diversity plan (6 archetypes, 8-9 new talents proposed) | Design |
| 2024-12-20 | Add 15 new Steam achievement designs | Design Subagent |
| 2024-12-20 | Initial creation from docs restructure | Documentation Team |
