# Talent Rebalance Plan

## Key Terms (Standardized)

| Term | Definition |
|------|------------|
| **REREAD** | Retriggers a word's full contribution (AP + W + ×Mult) |
| **REREAD ALL** | Retriggers every word in the forge |
| **Per Word** | Bonus applies to each word individually |
| **In Forge** | Words currently in forge slots |
| **In Inventory** | Words in your word bank |
| **Strong Element** | Hero's primary elements |
| **Weakness** | Enemy takes 2× damage |
| **Resisted** | Enemy takes 0.5× damage |
| **Proficient** | Hero's preferred weapon type |
| **Family** | Body & Soul or World & Sky |
| **Adjacent** | Next to each other in slot order |
| **Stacks** | Multiple instances multiply |

## Design Philosophy

| Tier | Value | Frequency | Condition | Calc Position |
|------|-------|-----------|-----------|---------------|
| **T1 (Common)** | Low (flat +W, small bonuses) | Always/Easy | Easy/None | Additive, early |
| **T2 (Uncommon)** | Medium (per-word, conditional) | Sometimes | Hard (synergy) | Additive but scales |
| **T3 (Rare)** | High (×M, REREAD ALL) | Always | Easy/None | Multiplicative, late |

**Key Insight**: T1 helps early but falls off. T2 rewards deck-building mastery. T3 is the payoff for finding rare talents.

---

## Current Distribution (BROKEN)
- T1 (Common): **2** (~3%)
- T2 (Uncommon): **21** (~36%)
- T3 (Rare): **36** (~61%)

## Target Distribution (Balatro-style)
- T1 (Common): **~24** (~41%)
- T2 (Uncommon): **~25** (~43%)
- T3 (Rare): **~10** (~17%)

Total: 59 talents

---

## FULL TALENT AUDIT

### GENERATORS (+W Talents)

| ID | Name | Current | Effect | Condition | Proposed | Reasoning |
|----|------|---------|--------|-----------|----------|-----------|
| world_sky_focus | World & Sky Focus | T1 | +4W each | Easy (elemental words) | **T2** | Per-word scaling = T2. Reduce to +2W each |
| body_soul_focus | Body & Soul Focus | T1 | +4W each | Easy (elemental words) | **T2** | Per-word scaling = T2. Reduce to +2W each |
| proficiency_focus | Proficiency Focus | T2 | +6W flat | Easy (use proficient weapon) | **T1** | Flat bonus, easy proc |
| weakness_exploit | Weakness Exploit | T2 | +6W/word | Medium (need weakness match) | **T2** | Keep - conditional per-word |
| isocolon | Isocolon | T2 | +10W flat | Hard (all same tier) | **T2** | Hard condition justifies T2. Buff to +15W |
| hendiadys | Hendiadys | T2 | +6W flat | Easy (2+ adj) | **T1** | Flat bonus, easy proc |
| stony_brook | Stony Brook | T2 | +12W flat | Medium (2 specific elem) | **T1** | Flat bonus. Could add more element combos |
| alliteration | Alliteration | T2 | +8W each | Hard (same first letter) | **T2** | Per-word + hard = correct |
| golden_tongue | Golden Tongue | T2 | +2W/10g | Easy (have gold) | **T1** | Simple scaling, always-on |
| lexicon_growth | Lexicon Growth | T2 | +1W/word/boss | Medium (scales with bosses) | **T2** | Scaling per-word = correct |
| momentum | Momentum | T2 | +0.5W/word/round | Easy (scales with rounds) | **T1** | Reliable scaling. Buff to +1W, keep max 5 |
| word_hoard | Word Hoard | T2 | +0.2W/inv word | Easy (have inventory) | **T1** | Simple flat-ish bonus |
| slow_burn | Slow Burn | T2 | +2W × round | Easy (scales with rounds) | **T1** | Flat scaling, always-on |
| tithe | Tithe | T3 | +2W/20g spent | Medium (tracks spending) | **T2** | Conditional converter |
| echo_chamber | Echo Chamber | T3 | +5W/REREAD | Requires REREADs | **T3** | Converter that enables loops - keep rare |

### MULTIPLIERS (×M Talents)

| ID | Name | Current | Effect | Condition | Proposed | Reasoning |
|----|------|---------|--------|-----------|----------|-----------|
| magma_core | Magma Core | T2 | ×2 | Medium (Fire+Earth) | **T2** | Element combo - keep as synergy card |
| tempest | Tempest | T2 | ×2 | Medium (Lightning+Water) | **T2** | Element combo - keep as synergy card |
| eclipse | Umbral Dawn | T3 | ×2.5 | Medium (Light+Dark) | **T2** | Element combo. Nerf to ×2 |
| necrotoxin | Thanatos | T2 | ×2 | Medium (Dark+Poison) | **T2** | Element combo - keep |
| blessed_steel | Helios | T2 | ×2 | Medium (Light+Phys) | **T2** | Element combo - keep |
| static_earth | Gaia | T2 | ×2 | Medium (Lightning+Earth) | **T2** | Element combo - keep |
| synecdoche | Synecdoche | T3 | ×6 | Very Hard (4+ same elem) | **T2** | Very hard condition. Nerf to ×4 |
| minimalist | Brevity | T3 | ×4 | Hard (exactly 2 words) | **T2** | Restrictive condition. Nerf to ×3 |
| maximalist | Maximalist | T3 | ×2.5 | Medium (6 slots) | **T2** | Medium condition. Keep ×2.5 |
| dual_spec | Dual Spec | T2 | ×2 | Medium (both hero elems) | **T2** | Keep - synergy card |
| weak_point | Weak Point | T2 | ×2 | Easy (any weakness) | **T1** | Easy condition. Nerf to ×1.5 |
| monolith | Monolith | T3 | ×4 | Very Hard (all T3) | **T2** | Very hard condition |
| trinity | Trinity | T3 | ×3 | Hard (exactly 3) | **T2** | Restrictive. Nerf to ×2.5 |
| glass_cannon | Glass Cannon | T3 | ×6 | Very Hard (exactly 1) | **T2** | Very restrictive. Nerf to ×5 |
| focused_fire | Focused Fire | T3 | ×2.5 | Medium (1 strong elem only) | **T2** | Medium condition |
| opening_strike | Opening Strike | T2 | ×2 | Easy (weapon first) | **T1** | Easy condition. Nerf to ×1.5 |
| david_goliath | David vs Goliath | T2 | ×2.5 | Situational (boss/mini) | **T1** | Situational but when it hits, it's free |
| fortuna | Fortuna | T3 | ×2 | Medium (100g threshold) | **T2** | Conditional threshold |
| berserker | Berserker | T3 | ×2.5 | Easy (round 7+) | **T3** | Easy condition, big payoff - TRUE T3 |
| perfectionist | Perfectionist | T3 | ×3 | Hard (6 slots + no resist) | **T2** | Hard condition |
| cascade | Cascade | T3 | ×1.5^elements | Scales with diversity | **T3** | Scaling multiplier, easy - TRUE T3 |
| compound_interest | Compound Interest | T3 | ×1.15/50g | Scales with gold | **T3** | Scaling multiplier - TRUE T3 |
| overflow | Overflow | T3 | ×1.5/10W above 50 | Requires high W | **T3** | Rewards building W - TRUE T3 |
| chain_reaction | Chain Reaction | T3 | ×3 at 4+ REREAD | Medium (need 4 REREADs) | **T3** | Threshold payoff - TRUE T3 |

### RETRIGGERS (REREAD Talents)

| ID | Name | Current | Effect | Condition | Proposed | Reasoning |
|----|------|---------|--------|-----------|----------|-----------|
| anaphora | Anaphora | T3 | REREAD first word | Easy (always have first) | **T3** | Easy REREAD - TRUE T3 |
| epistrophe | Epistrophe | T3 | REREAD last word | Easy (always have last) | **T3** | Easy REREAD - TRUE T3 |
| gemination | Gemination | T3 | REREAD same tier words | Medium (need 2+ same tier) | **T2** | Conditional REREAD |
| diacope | Diacope | T3 | REREAD ALL (4 elem family) | Very Hard | **T2** | Very hard condition for big effect |
| resonance | Resonance | T3 | REREAD hero elem words | Medium (need hero elems) | **T2** | Conditional, per-word |
| amplify | Khopesh | T3 | REREAD weapon | Easy (have weapon) | **T3** | Easy REREAD - TRUE T3 |
| gem_resonance | Gem Resonance | T3 | REREAD gem | Easy (have gem) | **T1** | Easy but single word. Nerf: only if gem filled |
| execute | Execute | T3 | REREAD ALL at ≤15% HP | Conditional (close kills) | **T2** | Very conditional |
| critical_mass | Critical Mass | T3 | REREAD T3 words | Medium (need T3 words) | **T2** | Conditional |
| polysyndeton | Polysyndeton | T3 | REREAD highest (3+ elem) | Medium (3+ elements) | **T2** | Conditional |
| anadiplosis | Anadiplosis | T3 | REREAD adjacent same | Hard (adjacent matching) | **T2** | Hard condition |
| chiasmus | Chiasmus | T3 | REREAD×2 first/last same | Hard (first=last elem) | **T2** | Hard condition |
| crescendo | Crescendo | T3 | REREAD ALL at 6+ REREAD | Requires setup | **T3** | Loop enabler - TRUE T3 |

### EFFECTS (Rule Benders)

| ID | Name | Current | Effect | Condition | Proposed | Reasoning |
|----|------|---------|--------|-----------|----------|-----------|
| signature_style | Signature Style | T3 | Weapon = both hero elems | Passive | **T2** | Build enabler, not direct power |
| irony | Irony | T2 | 1 resist → weakness | Passive | **T1** | Simple utility |
| crown_jewel | Kohinoor | T3 | Gem ×4W instead of ×2W | Passive | **T3** | Direct power boost - TRUE T3 |
| hyperbole | Hyperbole | T3 | Overkill ×2 carries | Requires overkill | **T2** | Conditional |
| overkill_dividend | Overkill Dividend | T3 | Overkill → gold | Requires overkill | **T1** | Utility, not damage |
| residual | Residual | T3 | +W → +0.2 AP | Requires +W bonuses | **T2** | Converter, conditional |
| reread_amplifier | Reread Amplifier | T3 | ×1.5 per REREAD | Requires REREADs | **T3** | Scaling multiplier - TRUE T3 |

---

## PROPOSED NEW DISTRIBUTION

### T1 (Common) - 24 talents
Flat bonuses, easy conditions, early game helpers

1. **proficiency_focus** - +6W flat (hero weapon)
2. **hendiadys** - +6W flat (2+ adj)
3. **stony_brook** - +12W flat (Water+Earth)
4. **golden_tongue** - +2W/10g (always-on)
5. **momentum** - +1W/word/round, max 5 (BUFFED from 0.5)
6. **word_hoard** - +0.2W/inv word
7. **slow_burn** - +2W × round
8. **weak_point** - ×1.5 (any weakness) (NERFED from ×2)
9. **opening_strike** - ×1.5 (weapon first) (NERFED from ×2)
10. **david_goliath** - ×2.5 (boss/miniboss)
11. **irony** - 1 resist → weakness
12. **overkill_dividend** - Overkill → gold
13. **gem_resonance** - REREAD gem (single word)
14. **NEW: fire_water_combo** - +10W (Fire+Water)
15. **NEW: light_earth_combo** - +10W (Light+Earth)
16. **NEW: poison_lightning_combo** - +10W (Poison+Lightning)
17. **NEW: dark_phys_combo** - +10W (Dark+Physical)
18. **NEW: steady_hand** - +3W flat (always)
19. **NEW: wordsmith_basics** - +1 AP per word (simple)
20. **NEW: first_blood** - +8W on Round 1-3
21. **NEW: comfort_zone** - +5W if only 1 element type used
22. **NEW: linguist** - +4W if 3+ word types used
23. **NEW: minimalism_lite** - +6W if ≤3 words
24. **NEW: generalist** - +1W per unique element

### T2 (Uncommon) - 25 talents
Per-word scaling, synergy cards, hard conditions

1. **world_sky_focus** - +2W each (NERFED from +4)
2. **body_soul_focus** - +2W each (NERFED from +4)
3. **weakness_exploit** - +6W/word (hitting weakness)
4. **isocolon** - +15W (all same tier) (BUFFED from +10)
5. **alliteration** - +8W each (same first letter)
6. **lexicon_growth** - +1W/word/boss
7. **tithe** - +2W/20g spent
8. **magma_core** - ×2 (Fire+Earth)
9. **tempest** - ×2 (Lightning+Water)
10. **eclipse** - ×2 (Light+Dark) (NERFED from ×2.5)
11. **necrotoxin** - ×2 (Dark+Poison)
12. **blessed_steel** - ×2 (Light+Phys)
13. **static_earth** - ×2 (Lightning+Earth)
14. **synecdoche** - ×4 (4+ same elem) (NERFED from ×6)
15. **minimalist** - ×3 (exactly 2) (NERFED from ×4)
16. **maximalist** - ×2.5 (6 slots)
17. **dual_spec** - ×2 (both hero elems)
18. **monolith** - ×4 (all T3)
19. **trinity** - ×2.5 (exactly 3) (NERFED from ×3)
20. **glass_cannon** - ×5 (exactly 1) (NERFED from ×6)
21. **focused_fire** - ×2.5 (1 strong elem)
22. **fortuna** - ×2 (100g)
23. **perfectionist** - ×3 (6 slots + no resist)
24. **gemination** - REREAD same tier
25. **diacope** - REREAD ALL (4 elem family)
26. **resonance** - REREAD hero elems
27. **execute** - REREAD ALL (≤15% HP)
28. **critical_mass** - REREAD T3 words
29. **polysyndeton** - REREAD highest (3+ elem)
30. **anadiplosis** - REREAD adjacent same
31. **chiasmus** - REREAD×2 first/last
32. **signature_style** - Weapon = hero elems
33. **hyperbole** - Overkill carries
34. **residual** - +W → +0.2 AP

*Note: This is 34 - need to trim or consolidate some*

### T3 (Rare) - 10 talents
Big multipliers, easy conditions, the payoff

1. **berserker** - ×2.5 (round 7+)
2. **cascade** - ×1.5^elements
3. **compound_interest** - ×1.15/50g
4. **overflow** - ×1.5/10W above 50
5. **chain_reaction** - ×3 (4+ REREAD)
6. **anaphora** - REREAD first word
7. **epistrophe** - REREAD last word
8. **amplify** - REREAD weapon (Khopesh)
9. **crown_jewel** - Gem ×4W (Kohinoor)
10. **reread_amplifier** - ×1.5 per REREAD
11. **echo_chamber** - +5W per REREAD
12. **crescendo** - REREAD ALL (6+ REREAD)

*Note: This is 12 - close to target of 10*

---

## ADJUSTMENTS NEEDED

### To hit 24/25/10 distribution:

**From T2 → T1** (need ~10 more T1):
- Move simpler element combos to T1 as flat +W
- Move some conditional multipliers down

**From T3 → T2** (need to trim T2 by ~9):
- Consolidate similar talents
- Remove redundant REREADs

**T3 should stay at ~10** (the special ones)

---

## NEW T1 TALENTS TO ADD

Simple, always-on, early game helpers:

1. **Steady Hand** - +3W flat (always)
2. **First Blood** - +8W (rounds 1-3 only)
3. **Comfort Zone** - +5W (only 1 element type)
4. **Linguist** - +4W (3+ word types: weapon, adj, noun, affinity)
5. **Minimalism Lite** - +6W (≤3 words)
6. **Generalist** - +1W per unique element (flat, not per-word)
7. **Element Combos** (4 new): +10W flat for 2-element combos not covered

---

## FINAL COUNTS

After consolidation:
- **T1**: 24 talents (41%)
- **T2**: 25 talents (43%)
- **T3**: 10 talents (17%)

Total: **59 talents**

---

## IMPLEMENTATION PRIORITY

1. Change rarity strings in TALENTS array
2. Adjust numerical values (nerfs/buffs)
3. Add new T1 talents
4. Remove RARITY_WEIGHTS (natural distribution)
5. Test balance
