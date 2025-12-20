# Difficulty / Challenge Mode System

## Problem
Players with maxed skill trees will breeze through Chapter 1. The skill tree provides ~15-20 flat AP bonuses plus powerful capstones, which trivializes the base 20 HP enemies in early rounds.

## Proposed Solution: "Ascension" System

Inspired by Slay the Spire's Ascension and Hades' Heat system - voluntary difficulty modifiers that stack.

### Core Concept
- **Ascension Levels 1-10** (or more)
- Each level adds a modifier that increases difficulty
- Players choose their Ascension level before starting a run
- Higher Ascension = more challenge, bragging rights, maybe cosmetic rewards

### Ascension Modifiers (Cumulative)

| Level | Modifier | Effect |
|-------|----------|--------|
| 1 | **Sturdy Foes** | Enemies have +25% HP |
| 2 | **Lean Pickings** | Start with 10 gold instead of 20 |
| 3 | **Hardened** | Enemies have +50% HP (replaces +25%) |
| 4 | **Slow Learner** | Skill tree bonuses reduced by 50% |
| 5 | **Armored** | Enemies have +75% HP (replaces +50%) |
| 6 | **Sparse Offerings** | Shop offers 1 fewer word per crate |
| 7 | **Fortified** | Enemies have +100% HP (replaces +75%) |
| 8 | **Muted Skills** | Skill tree bonuses disabled entirely |
| 9 | **Elite Foes** | All enemies gain miniboss stat scaling |
| 10 | **The Word Weeps** | Boss abilities active from Round 1 |

### Alternative: Simpler 3-Tier System

If 10 levels feels excessive:

| Mode | Effect |
|------|--------|
| **Normal** | Base game (current difficulty) |
| **Hard** | +50% enemy HP, -50% skill tree bonuses, start with 10 gold |
| **Nightmare** | +100% enemy HP, skill tree disabled, shop offers reduced |

### UI Integration

**Option A: Hero Select Screen**
- Add difficulty selector below hero carousel
- Simple toggle or dropdown: Normal / Hard / Nightmare
- Or Ascension counter with +/- buttons

**Option B: Separate "Challenge" Button**
- Main menu gets "CHALLENGE MODE" button
- Opens modal to configure difficulty before hero select

### Implementation Hooks

1. **Enemy HP scaling** - Multiply in `enemyHp()` function
2. **Skill tree reduction** - Scale `bonusPerPoint` values or apply multiplier to final bonuses
3. **Starting gold** - Modify initial gold in `startRun()`
4. **Shop offerings** - Reduce crate contents in `rollShop()`

### Code Locations

```javascript
// Enemy HP - line ~61
function enemyHp(round) {
  // Add: * S.difficultyMult or * getDifficultyHPMult()
}

// Skill bonuses - line ~3464
// Apply skill tree bonuses based on slot type
// Add: * getSkillTreeEffectiveness()

// Starting gold - in startRun()
S.gold = BASE_GOLD * getStartingGoldMult();

// Shop - in rollShop()
const numWords = BASE_CRATE_SIZE - getDifficultyShopReduction();
```

### Persistent Tracking

- Store highest Ascension completed per hero in `PStats`
- Display on hero select: "Highest Ascension: 5"
- Optional: unlock cosmetics or titles

### Lore Angle (fits your world)

"Ascension" could represent venturing deeper into areas of semantic drift - where meaning is more corrupted and enemies are stronger manifestations of that corruption. Higher Ascension = closer to the sealed Library.

---

## Recommendation

Start with the **Simple 3-Tier System** (Normal/Hard/Nightmare):
- Quick to implement
- Easy to understand
- Can expand to full Ascension system later if players want more granularity

Key changes needed:
1. Add `S.difficulty` state (0=Normal, 1=Hard, 2=Nightmare)
2. Difficulty selector UI on hero select screen
3. HP multiplier in `enemyHp()`
4. Skill tree effectiveness multiplier
5. Starting gold adjustment
