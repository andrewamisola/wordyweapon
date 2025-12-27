# Gold Build Talents Implementation Summary

## Overview
Four new talents have been added to enable the Gold build archetype in Wordy Weapon. These talents create a feedback loop where gold is generated during combat, which then powers exponential scaling through Compound Interest and enables looping through Fortune's Favor.

## Talents Added

### 1. **Midas Touch** (T2 Uncommon, Converter)
- **File**: `/Users/andrewamisola/Projects/WordyWeapon-Dev/game/script.js`
- **Location**: Lines 3635-3643 (TALENTS array)
- **Effect**: Each elemental word in forge grants +5 gold IN COMBAT
- **Implementation**: Lines 15604-15613 (converter phase)
- **Key Feature**: This is the gold generation enabler - creates gold during the domino loop
- **Scales with**: Talent level (5g base per elemental word)

```javascript
// Midas Touch: Each elemental word in forge → +5 Gold IN COMBAT
if(hasTalent('midas_touch') && loopIteration === 1){
  const elementalWords = allWords.filter(w => w.elem !== undefined);
  if(elementalWords.length > 0){
    const basePerWord = scaleTalentBonus('midas_touch', 5);
    const goldGained = elementalWords.length * basePerWord;
    S.gold += goldGained;
    if(wantBreakdown) breakdown.multipliers.push(`<span class="mod-badge gold">+${goldGained}g</span> Midas Touch (${elementalWords.length} elemental words)`);
  }
}
```

### 2. **Golden Reread** (T2 Uncommon, Converter)
- **File**: `/Users/andrewamisola/Projects/WordyWeapon-Dev/game/script.js`
- **Location**: Lines 3645-3653 (TALENTS array)
- **Effect**: Each REREAD grants +10 gold IN COMBAT
- **Implementation**: Lines 15615-15625 (converter phase)
- **Key Feature**: Synergizes with REREAD builds to generate gold, creates cross-archetype synergy
- **Scales with**: Talent level (10g base per REREAD)

```javascript
// Golden Reread: Each REREAD → +10 Gold IN COMBAT
if(hasTalent('golden_reread') && totalRereadCount > 0){
  const newRereads = totalRereadCount - (loopIteration === 1 ? 0 : rereadCountAtLoopStart);
  if(newRereads > 0 || loopIteration === 1){
    const rereadsToCount = loopIteration === 1 ? totalRereadCount : newRereads;
    const basePerReread = scaleTalentBonus('golden_reread', 10);
    const goldGained = rereadsToCount * basePerReread;
    S.gold += goldGained;
    if(wantBreakdown) breakdown.multipliers.push(`<span class="mod-badge gold">+${goldGained}g</span> Golden Reread (${rereadsToCount} REREADs)`);
  }
}
```

### 3. **Fortune's Favor** (T3 Rare, Threshold)
- **File**: `/Users/andrewamisola/Projects/WordyWeapon-Dev/game/script.js`
- **Location**: Lines 3655-3665 (TALENTS array)
- **Effect**: 200+ gold held → REREAD ALL
- **Implementation**: Lines 15696-15703 (threshold phase)
- **Key Feature**: This is the loop enabler - creates feedback loop similar to Crescendo
- **Trigger**: Once per forge when gold threshold is reached
- **Synergy**: Works with Midas Touch/Golden Reread to build gold, then triggers REREAD ALL to loop

```javascript
// Fortune's Favor: 200+ gold → REREAD ALL (ONCE per forge)
if(hasTalent('fortunes_favor') && (S.gold || 0) >= 200 && !triggeredThresholds.has('fortunes_favor')){
  triggeredThresholds.add('fortunes_favor');
  const newRereads = rereadAllWords("Fortune's Favor");
  totalRereadCount += newRereads;
  if(newRereads > 0) continueLoop = true;
  if(wantBreakdown) breakdown.multipliers.push(`<span class="mod-badge reread">REREAD ×${newRereads}</span> Fortune's Favor (${S.gold}g ≥ 200)`);
}
```

### 4. **Liquidate** (T2 Uncommon, Converter)
- **File**: `/Users/andrewamisola/Projects/WordyWeapon-Dev/game/script.js`
- **Location**: Lines 3667-3675 (TALENTS array)
- **Effect**: Convert -10 W → +20 gold IN COMBAT
- **Implementation**: Lines 15627-15637 (converter phase)
- **Key Feature**: Alternative path to build gold from W surplus
- **Trade-off**: Reduces word count to gain gold
- **Scales with**: Talent level (20g base gained)

```javascript
// Liquidate: Convert -10 W → +20 Gold IN COMBAT
if(hasTalent('liquidate') && loopIteration === 1){
  const currentW = wordCount + globalWBonus;
  if(currentW >= 10){
    const wCost = 10;
    const baseGoldGained = scaleTalentBonus('liquidate', 20);
    globalWBonus -= wCost;
    S.gold += baseGoldGained;
    if(wantBreakdown) breakdown.multipliers.push(`<span class="mod-badge gold">+${baseGoldGained}g</span> Liquidate (${fmtMod(-wCost, 'word', ' W')})`);
  }
}
```

## How the Gold Build Works

### Core Loop
1. **Generate Gold**: Midas Touch generates gold from elemental words in forge (5g × elemental word count)
2. **Amplify with REREADs**: Golden Reread adds gold for each REREAD (10g × REREAD count)
3. **Exponential Scaling**: Compound Interest (existing talent) provides ×1.15 per 50 gold
4. **Loop Enabler**: Fortune's Favor triggers REREAD ALL at 200+ gold, restarting the cycle

### Example Combo
- **Setup**: 4 elemental words + Midas Touch + Golden Reread + Fortune's Favor + Compound Interest
- **Turn 1**:
  - Midas Touch: 4 elemental words = 20 gold
  - Compound Interest: 20g = ×1.15^0 = 1.0 (no bonus yet)
- **With REREADs**:
  - If words have REREAD: 4 words × 1 REREAD each = 4 REREADs
  - Golden Reread: 4 REREADs = 40 gold
  - Total: 20g + 40g = 60 gold in combat
  - Compound Interest: 60g = ×1.15^1 = ×1.15
- **Loop Trigger**:
  - After multiple rounds or loops, reach 200+ gold
  - Fortune's Favor: REREAD ALL → generates more gold → more REREADs → more gold
  - Compound Interest: 200g = ×1.15^4 = ×1.75 damage multiplier

## Synergies

### With Existing Talents
- **Compound Interest**: Exponential multiplier that scales with gold (×1.15 per 50g)
- **Fortuna**: Additional ×2 multiplier at 100+ gold
- **Echo Chamber**: Generates W from REREADs, which can be converted via Liquidate
- **Any REREAD talent**: Powers Golden Reread (Echo Chamber, Reread Amplifier, etc.)

### Cross-Archetype Builds
- **Gold + REREAD**: Golden Reread creates cross-synergy between gold and REREAD builds
- **Gold + Element**: Midas Touch rewards elemental-heavy forges
- **Gold + W**: Liquidate converts excess W into gold when needed

## Technical Implementation Details

### Phase Execution
All gold talents execute in the **converter phase** of the domino loop, except Fortune's Favor which executes in the **threshold phase**:

1. **Converter Phase** (lines 15279-15657):
   - Midas Touch: Runs once per forge (loopIteration === 1)
   - Golden Reread: Runs on each loop iteration, counting new REREADs
   - Liquidate: Runs once per forge (loopIteration === 1)

2. **Threshold Phase** (lines 15673-15709):
   - Fortune's Favor: Checks gold threshold and triggers REREAD ALL once per forge

### Gold Addition
Gold is added directly to `S.gold` during combat:
```javascript
S.gold += goldGained;
```

This is different from existing gold talents which use `goldBonus()` and add gold **after** victory. The key innovation is **in-combat gold generation** which enables the feedback loop.

### Breakdown Display
All talents properly display their contribution in combat breakdown:
```javascript
if(wantBreakdown) breakdown.multipliers.push(`<span class="mod-badge gold">+${goldGained}g</span> Talent Name (details)`);
```

## Remaining Work

### Icons (REQUIRED)
The talent icons need to be added to the `TALENT_SVG` object (around line 6497). Icon definitions have been created in:
- **File**: `/Users/andrewamisola/Projects/WordyWeapon-Dev/gold_build_talent_icons.txt`

These need to be manually inserted before the `default:` icon in the TALENT_SVG object.

### Testing Recommendations
1. **Basic Gold Generation**: Test Midas Touch with 4-6 elemental words
2. **REREAD Synergy**: Test Golden Reread with Echo Chamber or other REREAD talents
3. **Loop Trigger**: Test Fortune's Favor reaching 200g threshold
4. **Liquidate Trade-off**: Test W → Gold conversion with high W builds
5. **Full Combo**: Test all 4 talents together with Compound Interest for exponential scaling
6. **Ultimate Weapon**: Verify the loop can reach Ultimate Weapon with proper setup

### Balance Considerations
- **Midas Touch**: 5g per elemental word (scalable) - may need adjustment based on typical elemental word counts
- **Golden Reread**: 10g per REREAD (scalable) - synergizes with REREAD builds
- **Fortune's Favor**: 200g threshold - this is 4× the Fortuna threshold (100g), requires significant gold generation
- **Liquidate**: -10W → +20g trade-off - intentionally punishing to balance the gold gain

## File Changes Summary
- **Main file**: `/Users/andrewamisola/Projects/WordyWeapon-Dev/game/script.js`
- **Total changes**: +218 lines (4 talent definitions, 4 implementations, documentation)
- **Talent definitions**: Lines 3629-3676
- **Converter implementations**: Lines 15602-15637
- **Threshold implementation**: Lines 15696-15703

## Integration with Existing Systems
- ✅ Follows existing talent structure (id, name, desc, flavor, rarity, category, apply)
- ✅ Uses existing helper functions (hasTalent, scaleTalentBonus, scaleTalentMult)
- ✅ Integrates with domino loop phases (converter, threshold)
- ✅ Respects loop iteration tracking (loopIteration, triggeredThresholds)
- ✅ Provides proper breakdown display
- ✅ Scales with talent level system
- ⚠️ Icons need to be added manually (see gold_build_talent_icons.txt)
