# DESIGN - Wordy Weapon

> **Owner**: Design Subagent
> **Last Updated**: 2025-12-23
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

### Ultimate Weapon Victory
When a player achieves **1 quadrillion damage** (or triggers infinite loop detection):
- **Ultimate Weapon is forged** - This is the ultimate victory condition
- **Run ends immediately** with special rewards and recognition
- **No endless mode continuation** - Achieving the Ultimate Weapon is the definitive end goal
- Victory tracked in player stats and achievements

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

### Talent Upgrade System
**Miniboss Rewards (Rounds 3, 6)**:
- Choose to either:
  - Pick NEW talents from the talent pool, OR
  - Upgrade existing talents by +1 level

**Chapter Boss Rewards (Round 9)**:
- ALL equipped talents automatically upgrade +1 level (mass upgrade)
- THEN pick new talents as bonus rewards

**Example Progression**:
```
Round 1: Pick Reread Amplifier (Level 1: ×1.5^REREADs)
Round 3 Miniboss: Upgrade Reread Amplifier to Level 2 (×1.6^REREADs)
Round 6 Miniboss: Pick Echo Chamber (Level 1)
Round 9 Boss:
  → Reread Amplifier auto-upgrades to Level 3 (×1.7^REREADs)
  → Echo Chamber auto-upgrades to Level 2
  → Then pick new talents
```

### Build Archetypes
The talent system supports four major build archetypes, each with distinct scaling mechanics:

#### 1. REREAD Build (Existing System)
**Core Multiplier**: Reread Amplifier - ×1.5^REREADs
**Strategy**: Stack REREAD triggers to multiply damage exponentially
**Key Talents**: Gemination, Echo Chamber, Critical Mass, Crescendo

**Example Infinite Combo**:
1. Gemination (same tier → REREAD all)
2. Echo Chamber (REREAD → +5 W)
3. Critical Mass (50+ W → REREAD all)
4. Crescendo (6+ REREADs → REREAD all again)

Play 6 T2 words → infinite loop → ULTIMATE WEAPON VICTORY

#### 2. W Overflow Build
**Core Multiplier**: Overflow - ×1.5^((W-50)/10)
**Strategy**: Stack massive W values to trigger exponential Overflow scaling
**Key Talents**:
- **Verbose Surplus**: +W per word beyond 3 words in forge
- **Linguistic Density**: Convert excess AP into W (when AP > threshold)

**Scaling Example**:
- W = 50 → ×1.5^0 = ×1.0 (no bonus)
- W = 70 → ×1.5^2 = ×2.25
- W = 100 → ×1.5^5 = ×7.59

#### 3. Gold Build
**Core Multiplier**: Compound Interest - ×1.15^(gold/50)
**Strategy**: Hoard gold instead of spending, convert wealth into power
**Key Talents**:
- **Midas Touch**: Gain gold on combat victories
- **Golden Reread**: Spend gold to trigger REREAD effects
- **Fortune's Favor**: Higher gold = increased crit chance or damage
- **Liquidate**: Convert gold directly into damage multiplier

**Scaling Example**:
- 100 gold → ×1.15^2 = ×1.32
- 500 gold → ×1.15^10 = ×4.05
- 1000 gold → ×1.15^20 = ×16.37

#### 4. Elemental Build
**Core Multiplier**: Prismatic Resonance - ×1.2^(element stacks)
**Strategy**: Build and maintain element stacks across combats in a run
**Key Talents**:
- **Elemental Mastery**: Gain element stacks when using elemental words
- **Prismatic Resonance**: Damage multiplier based on total element stacks
- **Weakness Exploit Amp**: Bonus stacks when hitting enemy weaknesses
- **Chromatic Cascade**: Chain reactions when mixing element families

**Element Stack Mechanics**:
- Stacks persist across all combats within a single run
- Reset to 0 when starting a new run
- Each elemental word played can add stacks (via Elemental Mastery)
- Stacks are consumed or amplified by various talents

**Scaling Example**:
- 5 stacks → ×1.2^5 = ×2.49
- 10 stacks → ×1.2^10 = ×6.19
- 20 stacks → ×1.2^20 = ×38.34

### New Talents (Build Diversity Expansion)

#### Gold Talents
| Talent | Rarity | Effect |
|--------|--------|--------|
| Midas Touch | Uncommon | Gain +X gold on combat victory (scales with level) |
| Golden Reread | Rare | Spend 50 gold to REREAD all words |
| Fortune's Favor | Rare | +1% crit chance per 10 gold (or similar scaling) |
| Liquidate | Rare | Convert 100 gold → ×1.5 damage multiplier (consumable) |

#### W Overflow Talents
| Talent | Rarity | Effect |
|--------|--------|--------|
| Verbose Surplus | Uncommon | +2 W per word beyond 3 words in forge |
| Linguistic Density | Rare | If AP > 100, convert excess AP into W at 5:1 ratio |

#### Elemental Talents
| Talent | Rarity | Effect |
|--------|--------|--------|
| Elemental Mastery | Uncommon | Gain +1 element stack per elemental word played |
| Prismatic Resonance | Rare | ×1.2^(element stacks) damage multiplier |
| Weakness Exploit Amp | Rare | Hitting weakness grants +2 element stacks instead of +1 |
| Chromatic Cascade | Rare | Playing 2+ element families in one forge → REREAD all |

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
| Build Diversity System | Designed | 4 archetypes: REREAD, W Overflow, Gold, Elemental |
| Talent Upgrade System | Designed | Miniboss choices, boss mass upgrades |
| Ultimate Weapon Victory | Designed | 1 quadrillion damage breakpoint, run-ending condition |
| New Talents (10) | Designed | Gold (4), W Overflow (2), Elemental (4) |
| Element Stack System | Designed | Persistent stacks across run combats |

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

## Open Questions

- [ ] Belle Lettres capstone "Knowledge Eternal" - needs testing for balance
- [ ] Talent count: Current 50 vs proposed 59 in rebalance plan
- [ ] Ascension system implementation priority
- [ ] Achievement balance testing: Are any achievements too easy/hard?

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-23 | Add Ultimate Weapon Build Diversity system documentation | Design Subagent |
| 2025-12-23 | Document 4 build archetypes (REREAD, W Overflow, Gold, Elemental) | Design Subagent |
| 2025-12-23 | Add talent upgrade system (miniboss choices, boss mass upgrades) | Design Subagent |
| 2025-12-23 | Document 10 new talents for build diversity | Design Subagent |
| 2025-12-23 | Add element stack system mechanics | Design Subagent |
| 2025-12-23 | Clarify Ultimate Weapon victory as run-ending condition | Design Subagent |
| 2024-12-20 | Add 15 new Steam achievement designs | Design Subagent |
| 2024-12-20 | Initial creation from docs restructure | Documentation Team |
