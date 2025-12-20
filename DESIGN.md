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

## Open Questions

- [ ] Belle Lettres capstone "Knowledge Eternal" - needs testing for balance
- [ ] Talent count: Current 50 vs proposed 59 in rebalance plan
- [ ] Ascension system implementation priority

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2024-12-20 | Initial creation from docs restructure | Documentation Team |
