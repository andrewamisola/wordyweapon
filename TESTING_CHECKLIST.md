# Gold Build Talents - Testing Checklist

## Pre-Testing Setup
- [ ] Add talent icons from `gold_build_talent_icons.txt` to TALENT_SVG object (line ~6497)
- [ ] Load the game and verify no JavaScript errors in console
- [ ] Start a new run or use existing save

## Individual Talent Tests

### 1. Midas Touch
- [ ] Acquire Midas Touch talent
- [ ] Create forge with 0 elemental words → should not trigger
- [ ] Create forge with 1 elemental word → should grant +5 gold in combat
- [ ] Create forge with 4 elemental words → should grant +20 gold in combat
- [ ] Check combat breakdown displays: `+Xg Midas Touch (Y elemental words)`
- [ ] Verify gold is added DURING combat (check gold counter updates)
- [ ] Test with talent level 2 → should grant +10 per elemental word

**Expected Behavior**:
- Base: 5g × (number of elemental words)
- Gold added IN COMBAT, visible in breakdown
- Scales with talent level

### 2. Golden Reread
- [ ] Acquire Golden Reread talent
- [ ] Create forge with 0 REREAD triggers → should not grant gold
- [ ] Create forge with 1 REREAD → should grant +10 gold in combat
- [ ] Create forge with 4 REREADs → should grant +40 gold in combat
- [ ] Check combat breakdown displays: `+Xg Golden Reread (Y REREADs)`
- [ ] Verify gold is added DURING combat
- [ ] Test with Echo Chamber to generate REREADs
- [ ] Test with talent level 2 → should grant +20 per REREAD

**Expected Behavior**:
- Base: 10g × (number of REREADs)
- Works with any REREAD source (Echo Chamber, Execute, etc.)
- Scales with talent level

### 3. Fortune's Favor
- [ ] Acquire Fortune's Favor talent
- [ ] Start combat with <200 gold → should not trigger
- [ ] Use Midas Touch or other means to reach 200+ gold in combat
- [ ] Verify Fortune's Favor triggers: `REREAD ×X Fortune's Favor (Yg ≥ 200)`
- [ ] Verify it triggers REREAD ALL (all words in forge get retriggered)
- [ ] Check that it only triggers ONCE per forge (uses triggeredThresholds)
- [ ] Verify the REREAD ALL creates a new loop iteration

**Expected Behavior**:
- Triggers at 200+ gold (checked each loop iteration)
- Triggers REREAD ALL once per forge
- Creates feedback loop with gold generation talents
- Should enable Ultimate Weapon with proper setup

### 4. Liquidate
- [ ] Acquire Liquidate talent
- [ ] Create forge with <10 W total → should not trigger
- [ ] Create forge with 10+ W total → should convert -10W to +20g
- [ ] Check combat breakdown displays: `+20g Liquidate (-10 W)`
- [ ] Verify W is reduced (check final word count)
- [ ] Verify gold is added IN COMBAT
- [ ] Test with talent level 2 → should grant +40g per conversion

**Expected Behavior**:
- Base: -10W → +20g conversion
- Only runs once per forge (loopIteration === 1)
- Requires 10+ W to trigger
- Scales with talent level

## Combo Tests

### 5. Midas Touch + Compound Interest
- [ ] Acquire both talents
- [ ] Create forge with 4 elemental words
- [ ] Verify Midas Touch grants 20 gold
- [ ] Verify Compound Interest calculates: 20g ÷ 50 = 0 stacks → ×1.0 (no bonus yet)
- [ ] Accumulate 50+ gold total
- [ ] Verify Compound Interest: 50g ÷ 50 = 1 stack → ×1.15
- [ ] Accumulate 100+ gold total
- [ ] Verify Compound Interest: 100g ÷ 50 = 2 stacks → ×1.32

**Expected Behavior**:
- Gold from Midas Touch feeds Compound Interest
- Each 50g grants ×1.15 multiplier (stacking)

### 6. Golden Reread + Echo Chamber
- [ ] Acquire both talents
- [ ] Create forge with words that have REREAD
- [ ] Verify Echo Chamber grants +5W per REREAD
- [ ] Verify Golden Reread grants +10g per REREAD
- [ ] Check both appear in combat breakdown
- [ ] Multiple REREADs should multiply both bonuses

**Expected Behavior**:
- Cross-synergy between W generation and gold generation
- Both talents trigger from same REREAD source

### 7. Full Gold Build Combo
**Setup**: Midas Touch + Golden Reread + Fortune's Favor + Compound Interest + elemental words with REREAD

- [ ] Create forge with 4+ elemental words, each with REREAD capability
- [ ] **Turn 1**:
  - Midas Touch: 4 words × 5g = 20g
  - Golden Reread: 4 REREADs × 10g = 40g
  - Total gold in combat: 60g
  - Compound Interest: 60g ÷ 50 = 1 stack → ×1.15
- [ ] **Continue building gold** through multiple rounds
- [ ] **At 200g threshold**:
  - Fortune's Favor triggers REREAD ALL
  - New REREADs generate more gold via Golden Reread
  - Loop continues building gold
- [ ] **Target**: Reach 400+ gold for ×1.15^8 = ×3.06 multiplier from Compound Interest
- [ ] **Ultimate Goal**: Create infinite loop to reach Ultimate Weapon

**Expected Behavior**:
- Exponential gold growth through REREAD loop
- Fortune's Favor enables feedback loop at 200g
- Can reach Ultimate Weapon with proper setup
- Should see combat breakdown with multiple gold talents firing

### 8. Liquidate Trade-off Test
- [ ] Acquire Liquidate + high W generation talents (Echo Chamber, Word Hoard, etc.)
- [ ] Build forge with 50+ W
- [ ] Verify Liquidate converts -10W → +20g
- [ ] Check final damage calculation uses reduced W count
- [ ] Determine if gold gain is worth W loss

**Expected Behavior**:
- Intentional trade-off: sacrifice damage for gold
- Most useful when W is abundant
- Gold can feed Compound Interest for multiplier

## Edge Cases

### 9. Multiple Loop Iterations
- [ ] Set up Fortune's Favor loop
- [ ] Verify Golden Reread counts NEW REREADs on each loop iteration
- [ ] Verify Midas Touch and Liquidate only run once (loopIteration === 1)
- [ ] Check triggeredThresholds prevents Fortune's Favor from retriggering

**Expected Behavior**:
- Golden Reread should add gold on each loop
- Midas Touch and Liquidate should NOT retrigger
- Fortune's Favor should only trigger once

### 10. Ultimate Weapon Detection
- [ ] Build maximum gold + REREAD loop
- [ ] Verify Ultimate Weapon triggers (damage >= MAX_DAMAGE)
- [ ] Check loop safety (max 100 iterations)
- [ ] Verify breakdown shows "ULTIMATE WEAPON FORGED" or "INFINITE LOOP DETECTED"

**Expected Behavior**:
- Loop should reach Ultimate Weapon with proper setup
- Safety limits prevent actual infinite loops
- Game remains playable after Ultimate Weapon

### 11. Talent Level Scaling
- [ ] Test each talent at level 1 (base values)
- [ ] Level up talent to level 2
- [ ] Verify scaled values:
  - Midas Touch: 5g → 10g per elemental word
  - Golden Reread: 10g → 20g per REREAD
  - Liquidate: 20g → 40g per conversion
  - Fortune's Favor: No scaling (threshold talent)
- [ ] Check combat breakdown shows correct scaled values

**Expected Behavior**:
- All converter talents scale with level
- Threshold talents typically don't scale (just trigger condition)

## UI/UX Tests

### 12. Talent Display
- [ ] Open talent selection screen
- [ ] Verify all 4 talents appear with correct:
  - Name
  - Description (with proper HTML badges)
  - Flavor text
  - Rarity (Midas/Golden/Liquidate = Uncommon cyan, Fortune's = Rare purple)
  - Category (Converter or Threshold)
- [ ] Verify talent icons display correctly (after adding icons)
- [ ] Check tooltip shows talent details

### 13. Combat Breakdown
- [ ] In combat, check damage breakdown
- [ ] Verify gold talents appear in correct section (multipliers)
- [ ] Check formatting: `+Xg Talent Name (details)`
- [ ] Gold badges should be gold colored (#fbbf24)
- [ ] Verify breakdown is readable and clear

### 14. Gold Counter Update
- [ ] Watch gold counter during combat
- [ ] Verify it updates when gold talents trigger
- [ ] Check final gold value after combat matches expected
- [ ] Test with multiple sources of gold (talents + victory rewards)

## Balance Testing

### 15. Power Level Assessment
- [ ] Test early game (rounds 1-9): Are values too strong/weak?
- [ ] Test mid game (rounds 10-18): Does build scale appropriately?
- [ ] Test late game (rounds 19+): Can it compete with other builds?
- [ ] Compare to existing meta builds (REREAD, Element, W stacking)

**Target Power Level**:
- Should be viable but not dominant
- Requires 3-4 talents to fully online
- Payoff should be exponential scaling
- Trade-offs exist (Liquidate reduces W, Fortune's Favor requires high gold)

### 16. Gold Generation Rate
- [ ] Track gold per combat with different setups
- [ ] 4 elemental words + Midas Touch = 20g
- [ ] 4 REREADs + Golden Reread = 40g
- [ ] Combined = 60g per combat
- [ ] Determine if 200g threshold is reachable in reasonable time

**Expected Timeline**:
- 4-6 combats to reach 200g (with both talents)
- Fortune's Favor triggers by round 5-7
- Ultimate Weapon possible by round 10-15 (with full combo)

### 17. Interaction with Difficulty
- [ ] Test on Apprentice difficulty
- [ ] Test on Adept difficulty (HP +50%, prices +25%)
- [ ] Test on Master difficulty (HP +100%, prices +50%)
- [ ] Verify gold talents work consistently across difficulties

**Expected Behavior**:
- Gold generation unchanged by difficulty
- May need more gold for shop purchases on higher difficulties
- Compound Interest multiplier unchanged

## Bug Checks

### 18. Common Issues
- [ ] Check for JavaScript errors in console
- [ ] Verify no NaN or Infinity values in calculations
- [ ] Test with 0 values (0 elements, 0 REREADs, 0 gold)
- [ ] Test with extreme values (100 elements, 1000 REREADs, 10000 gold)
- [ ] Verify game doesn't crash or freeze

### 19. Save/Load
- [ ] Save game with gold talents equipped
- [ ] Exit and reload game
- [ ] Verify talents persist
- [ ] Test combat with loaded talents

### 20. Talent Removal
- [ ] Acquire gold talent
- [ ] Remove talent (if possible in game)
- [ ] Verify talent no longer triggers
- [ ] Check no lingering effects

## Performance Testing

### 21. Loop Performance
- [ ] Trigger Fortune's Favor loop
- [ ] Monitor frame rate during loop
- [ ] Check combat breakdown generation time
- [ ] Verify game remains responsive
- [ ] Test with 10+ loop iterations

**Expected Behavior**:
- Loops should complete quickly (<1 second)
- No noticeable lag or stuttering
- Breakdown should remain readable

## Final Validation

### 22. Completeness Check
- [ ] All 4 talents defined in TALENTS array
- [ ] All 4 implementations in converter/threshold phases
- [ ] All 4 icons added to TALENT_SVG (manual step required)
- [ ] All talents appear in game
- [ ] All talents functional
- [ ] No console errors
- [ ] Game playable end-to-end

### 23. Documentation
- [ ] Review GOLD_BUILD_TALENTS_SUMMARY.md
- [ ] Verify all code snippets match implementation
- [ ] Check all line numbers are correct
- [ ] Update any outdated information

## Sign-off

**Date Tested**: _______________

**Tester**: _______________

**Results**:
- [ ] All tests passed
- [ ] Minor issues found (list below)
- [ ] Major issues found (list below)

**Issues Found**:
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

**Recommended Changes**:
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

**Final Status**:
- [ ] Ready for production
- [ ] Needs adjustments
- [ ] Requires redesign
