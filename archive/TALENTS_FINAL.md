# Wordy Weapon - Final Talent System (50 Talents)

## Design Philosophy

**The Domino Effect**: Talents should interact with each other to create feedback loops. Finding the right combination lets players "break" the game and forge THE ULTIMATE WEAPON.

**Parallel to Balatro**:
- Words = Cards
- Weapon/Sentence = Hand played
- Elements = Suits
- Tiers (T1/T2/T3) = Ranks
- AP = Chips
- W (Word Count) = Mult
- REREAD = Retrigger
- Final Damage = AP × W × Multipliers

**Key Difference**: Player sees preview and commits once. Combos must be discoverable in the preview. Satisfaction comes from building toward a big number.

---

## Calculation Flow

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
    - Echo Chamber: rereadCount → +W
    - Residual: W bonuses → +AP
    - Golden Tongue: Gold → +W
    - Reread Amplifier: rereadCount → ×Mult
    ↓
PHASE 5: THRESHOLDS (check values, trigger effects)
    - Critical Mass: 50+ W → REREAD all
    - Crescendo: 6+ REREADs → REREAD all again
    - Chain Reaction: 4+ REREADs → ×3
    ↓
PHASE 5.5: LOOP (if thresholds triggered REREADs, go back to 4.5)
    - Max 100 iterations OR damage > MAX_SAFE_INTEGER
    - If loop detected → ULTIMATE WEAPON VICTORY
    ↓
PHASE 6: Final Damage = floor(AP × W × Mult)
```

---

## CATEGORY 1: GENERATORS (+W Base) - 8 Talents

Build your W pool. Fuel for thresholds.

| ID | Name | Description | Rarity | Scales |
|----|------|-------------|--------|--------|
| `world_sky_focus` | World & Sky Focus | World & Sky Words (Fire/Water/Earth/Lightning): +5 W each | Common | Per chapter |
| `body_soul_focus` | Body & Soul Focus | Body & Soul Words (Phys/Poison/Light/Dark): +5 W each | Common | Per chapter |
| `proficiency_focus` | Proficiency Focus | Hero's proficient Weapon: +8 W | Uncommon | Per chapter |
| `weakness_exploit` | Weakness Exploit | Hitting enemy Weakness: +6 W per Word | Uncommon | Per chapter |
| `isocolon` | Isocolon | All Words same Tier: +10 W | Uncommon | Per chapter |
| `hendiadys` | Hendiadys | 2+ Adjective slots filled: +6 W | Uncommon | Per chapter |
| `stony_brook` | Stony Brook | Water + Earth in weapon: +12 W | Uncommon | Flat |
| `alliteration` | Alliteration | 2+ consecutive words start with same letter: +8 W each | Uncommon | Flat |

---

## CATEGORY 2: MULTIPLIERS (×M) - 12 Talents

Multiply final damage when conditions are met.

### Dual Element Synergies (6)
| ID | Name | Description | Rarity |
|----|------|-------------|--------|
| `magma_core` | Magma Core | Fire + Earth: ×2 | Uncommon |
| `tempest` | Tempest | Lightning + Water: ×2 | Uncommon |
| `eclipse` | Umbral Dawn | Light + Dark: ×2.5 | Rare |
| `necrotoxin` | Thanatos | Dark + Poison: ×2 | Uncommon |
| `blessed_steel` | Helios | Light + Physical: ×2 | Uncommon |
| `static_earth` | Gaia | Lightning + Earth: ×2 | Uncommon |

### Structural Multipliers (6)
| ID | Name | Description | Rarity |
|----|------|-------------|--------|
| `synecdoche` | Synecdoche | 4+ Words same Element: ×6 | Rare |
| `minimalist` | Brevity | Exactly 2 Words: ×4 | Rare |
| `maximalist` | Maximalist | All 6 slots filled: ×2.5 | Rare |
| `dual_spec` | Dual Spec | Both Hero's Strong Elements present: ×2 | Uncommon |
| `weak_point` | Weak Point | Any word hits Enemy Weakness: ×2 | Uncommon |
| `monolith` | Monolith | All Words T3: ×4 | Rare |

---

## CATEGORY 3: RETRIGGERS (REREAD) - 8 Talents

Add word contributions again (AP + W). Feed the combo engine.

| ID | Name | Description | Rarity |
|----|------|-------------|--------|
| `anaphora` | Anaphora | First Word: REREAD ×1 | Rare |
| `epistrophe` | Epistrophe | Last Word: REREAD ×1 | Rare |
| `gemination` | Gemination | 2+ Words same Tier: REREAD all matching | Rare |
| `diacope` | Diacope | All 4 elements from one Family: REREAD all | Rare |
| `resonance` | Resonance | Hero's Strong Element Words: REREAD ×1 each | Rare |
| `amplify` | Khopesh | Weapon slot: REREAD ×1 | Rare |
| `gem_resonance` | Gem Resonance | Gem Slot: REREAD ×1 | Rare |
| `execute` | Execute | Enemy survives ≤15% HP: REREAD ALL | Rare |

---

## CATEGORY 4: CONVERTERS (Domino Fuel) - 8 Talents

Transform one resource into another. Create chains.

| ID | Name | Description | Rarity | Conversion |
|----|------|-------------|--------|------------|
| `echo_chamber` | Echo Chamber | Each REREAD grants +5 W | Rare | REREAD → W |
| `residual` | Residual | Each +W bonus grants +0.2 AP | Rare | W → AP |
| `golden_tongue` | Golden Tongue | Each 10 Gold held: +2 W | Uncommon | Gold → W |
| `overkill_dividend` | Overkill Dividend | Overkill damage becomes Gold (10:1, max 50) | Rare | Damage → Gold |
| `reread_amplifier` | Reread Amplifier | Each REREAD grants ×1.1 (stacking multiplicatively) | Rare | REREAD → Mult |
| `lexicon_growth` | Lexicon Growth | +1 W per Word per Boss defeated | Uncommon | Progress → W |
| `momentum` | Momentum | +1 W per Word per win streak (max 10) | Uncommon | Streak → W |
| `compound_interest` | Compound Interest | Each 50 Gold held: ×1.15 | Rare | Gold → Mult |

---

## CATEGORY 5: THRESHOLDS (The Payoff) - 10 Talents

Check accumulated values. Trigger big effects. Enable loops.

| ID | Name | Description | Rarity | Threshold |
|----|------|-------------|--------|-----------|
| `critical_mass` | Critical Mass | 50+ W: All words REREAD ×1 | Rare | W ≥ 50 |
| `overflow` | Overflow | 75+ W: ×2 | Rare | W ≥ 75 |
| `cascade` | Cascade | 100+ W: ×4 | Rare | W ≥ 100 |
| `chain_reaction` | Chain Reaction | 4+ REREADs this round: ×3 | Rare | REREADs ≥ 4 |
| `crescendo` | Crescendo | 6+ REREADs this round: REREAD ALL again | Rare | REREADs ≥ 6 |
| `fortuna` | Fortuna | 100+ Gold held: ×2 | Rare | Gold ≥ 100 |
| `underdog` | Underdog | Enemy HP ≥ 150: ×2 | Uncommon | Enemy HP |
| `berserker` | Berserker | Round 7+: ×2.5 | Rare | Round ≥ 7 |
| `first_blood` | First Blood | Round 1 only: ×3 | Uncommon | Round = 1 |
| `perfectionist` | Perfectionist | No empty slots AND no resisted elements: ×3 | Rare | Perfect weapon |

---

## CATEGORY 6: EFFECTS (Rule Benders) - 4 Talents

Unique mechanics that change how the game works.

| ID | Name | Description | Rarity |
|----|------|-------------|--------|
| `signature_style` | Signature Style | Proficient Weapon counts as both Hero's Strong Elements | Rare |
| `irony` | Irony | One Enemy Resistance becomes Weakness | Uncommon |
| `crown_jewel` | Kohinoor | Gem Slot: ×4 W (instead of ×2) | Rare |
| `hyperbole` | Hyperbole | Overkill ×2 carries to next round (max 25% enemy HP) | Rare |

---

## TOTAL: 50 Talents

| Category | Count | Purpose |
|----------|-------|---------|
| Generators | 8 | Build W pool |
| Multipliers | 12 | Boost damage |
| Retriggers | 8 | Add contributions again |
| Converters | 8 | Transform resources |
| Thresholds | 10 | Trigger on values |
| Effects | 4 | Bend rules |
| **TOTAL** | **50** | |

---

## Example Infinite Combo

**The Build:**
1. Gemination (same tier → REREAD all)
2. Echo Chamber (REREAD → +5 W)
3. Critical Mass (50+ W → REREAD all)
4. Crescendo (6+ REREADs → REREAD all again)

**The Play:** 6 T2 words (all slots, same tier)

**The Loop:**
1. Gemination: 6 REREADs
2. Echo Chamber: +30 W
3. Crescendo: 6+ REREADs → REREAD all → 6 more REREADs
4. Echo Chamber: +30 more W (60 total)
5. Critical Mass: 60+ W → REREAD all → 6 more REREADs
6. Crescendo: still ≥6 → REREAD all again
7. Echo Chamber: +30 more W (90 total)
8. **LOOP CONTINUES INFINITELY**
9. System detects loop → **ULTIMATE WEAPON FORGED** → **YOU WIN**

---

## Victory Condition

```javascript
if (loopIterations >= 100 || heroDmg >= Number.MAX_SAFE_INTEGER || !Number.isFinite(heroDmg)) {
  // ULTIMATE WEAPON FORGED
  // Player wins the entire run
  // Special victory screen with "∞" damage display
}
```

---

## Rarity Distribution

| Rarity | Count | Drop Weight |
|--------|-------|-------------|
| Common | 2 | 50% |
| Uncommon | 18 | 35% |
| Rare | 30 | 15% |

Rare talents are the combo pieces. Finding them is the challenge.
