# Talent Description Improvement Plan

## Research Findings: Balatro Joker Design Patterns

Balatro uses clear, consistent language patterns:

1. **Condition-First Structure**: Conditions come first, then effects
   - "If played hand contains X: +N Mult"
   - "Per each X: +N Chips"

2. **Current Value Tracking**: Dynamic values shown in parentheses
   - "(Currently +0 Mult)" for scaling effects
   - Shows player exactly where they are

3. **Clear Trigger Words**:
   - **"Per/For each"** - scaling mechanics
   - **"If X contains Y"** - conditional checks
   - **"Gains"** - permanent accumulation
   - **"Retrigger"** - score again (their word for REREAD)

4. **Thresholds**: Clean "At X: effect" or "X+ triggers Y" format

---

## Current Problems in Wordy Weapon

### 1. Inconsistent W Badge Usage
- Some talents use `+5 W` plaintext, others use badges
- "Echo Chamber: Each REREAD grants +5 W" - the +5 W should be badged

### 2. Threshold Talents Are Unclear
- "At 50 W:" is better than "50+ W:" but still unclear
- Players don't understand these are THRESHOLDS that trigger effects
- Need to show current progress toward threshold

### 3. Grammar Issues
- "4+ REREADs this round: ×3" - awkward pluralization with badge
- Should be "4+ REREAD triggers: ×3"

### 4. Missing Visual Feedback
- W-based thresholds don't show current W on the talent card
- REREAD-based thresholds don't show current REREAD count

### 5. Kohinoor Description
- "Gem Slot: ×4 W (instead of ×2)" - confusing
- Should be: "Gem Slot gives ×4 W instead of ×2"

---

## Proposed Description Rewrites

### GENERATORS (Category 1)
| Talent | Current | Proposed |
|--------|---------|----------|
| World & Sky Focus | World & Sky Words: +5 W each | Each World & Sky word: `+5 W` |
| Body & Soul Focus | Body & Soul Words: +5 W each | Each Body & Soul word: `+5 W` |
| Proficiency Focus | Hero's proficient Weapon: +8 W | Proficient weapon type: `+8 W` |
| Weakness Exploit | Hitting enemy Weakness: +6 W per Word | Each word hitting weakness: `+6 W` |
| Isocolon | All Words same Tier: +10 W | All words same tier: `+10 W` |
| Hendiadys | 2+ Adjective slots filled: +6 W | 2+ adjectives: `+6 W` |
| Stony Brook | Water + Earth in weapon: +12 W | Water + Earth: `+12 W` |
| Alliteration | 2+ consecutive words same first letter: +8 W each | Alliterative words: `+8 W` each |
| Word Hoard | Each Word in inventory: +0.2 W | Per inventory word: `+0.2 W` |
| Slow Burn | +2 W × Round | Per round: `+2 W` (Currently +0 W) |

### MULTIPLIERS (Category 2)
Keep current format - these are clear

### RETRIGGERS (Category 3)
| Talent | Current | Proposed |
|--------|---------|----------|
| Anaphora | First Word: REREAD ×1 | First word: `REREAD` |
| Epistrophe | Last Word: REREAD ×1 | Last word: `REREAD` |
| Gemination | 2+ Words same Tier: REREAD all matching | 2+ same tier: `REREAD` all |
| Execute | Enemy survives ≤15% HP: REREAD ALL | Enemy ≤15% HP: `REREAD ALL` |

### CONVERTERS (Category 4)
| Talent | Current | Proposed |
|--------|---------|----------|
| Echo Chamber | Each REREAD grants +5 W | Per `REREAD`: `+5 W` |
| Residual | Each +W bonus grants +0.2 AP | Per `+W` bonus: `+0.2 AP` |
| Golden Tongue | Each 10 Gold held: +2 W | Per 10 gold: `+2 W` |
| Reread Amplifier | Each REREAD grants ×1.1 (stacking) | Per `REREAD`: `×1.1` (stacks) |
| Lexicon Growth | +1 W per Word per Boss defeated | Per word, per boss kill: `+1 W` |
| Momentum | +1 W per Word per win streak (max 10) | Per word, per win streak: `+1 W` (max 10) |
| Compound Interest | Each 50 Gold held: ×1.15 | Per 50 gold: `×1.15` |
| Tithe | Each 20 Gold spent this run: +2 W | Per 20 gold spent: `+2 W` |

### THRESHOLDS (Category 5) - THE BIG FIX
| Talent | Current | Proposed |
|--------|---------|----------|
| Critical Mass | At 50 W: All Words REREAD ×1 | 50 W threshold: `REREAD ALL` |
| Overflow | At 75 W: ×2 | 75 W threshold: `×2` |
| Cascade | At 100 W: ×4 | 100 W threshold: `×4` |
| Chain Reaction | 4+ REREADs this round: ×3 | 4+ REREAD triggers: `×3` |
| Crescendo | 6+ REREADs this round: REREAD ALL again | 6+ REREAD triggers: `REREAD ALL` again |
| Fortuna | 100+ Gold held: ×2 | 100 gold threshold: `×2` |

### EFFECTS (Category 6)
| Talent | Current | Proposed |
|--------|---------|----------|
| Kohinoor | Gem Slot: ×4 W (instead of ×2) | Gem slot: `×4 W` (instead of `×2 W`) |
| Hyperbole | Overkill ×2 carries to next round (max 25% HP) | Overkill `×2` carries (max 25% enemy HP) |

---

## Implementation Steps

### Step 1: Fix Badge Consistency
- Update all `+N W` in descriptions to use `<span class="mod-badge word">+N W</span>`
- Update `×N W` to use the word badge class

### Step 2: Rewrite Threshold Talent Descriptions
- Use "N threshold:" format consistently
- Add "(Currently X/N)" display for W-based thresholds

### Step 3: Fix Chain Reaction Grammar
- Change "4+ REREADs" to "4+ REREAD triggers"
- Same for Crescendo

### Step 4: Improve Kohinoor Clarity
- Show both the new multiplier and what it replaces

### Step 5: Add Dynamic Tracking Display
- Already partially done (Current W shown for threshold talents)
- Extend to show REREAD count for REREAD-threshold talents

---

## CSS Badge Reference

Current badge classes:
- `.mod-badge.word` - Blue, for W values
- `.mod-badge.add` - Green, for AP values
- `.mod-badge.scale` - Pink, for multipliers
- `.mod-badge.reread` - Orange, for REREAD
- `.mod-badge.threshold` - For threshold triggers (needs to exist or use scale)
