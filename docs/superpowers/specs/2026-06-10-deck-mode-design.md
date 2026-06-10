# Deck Mode — Design Spec

> **Date:** 2026-06-10
> **Status:** Approved by Andre (design conversation, 2026-06-10)
> **Branch:** `deck-mode` (main remains the playable classic build)

## Summary

Wordy Weapon pivots from shop/inventory management to deckbuilding, and from one-shot combat to a multi-strike "heat" system. Words become cards in a deck (the **Lexicon**); players draw hands, forge phrases, and strike while the iron is hot. Card acquisition moves from per-round shops to post-combat picks (Slay the Spire model). The combat screen adopts the approved visual redesign (card hand fan, phrase banner, Balatro-style scoring theater) prototyped in `mockup-combat-redesign.html`.

**Pitch:** Balatro × Bookworm Adventures, with Slay the Spire's reward pacing.

## Goals

- More action: back into combat within seconds of a victory; no per-round shop browsing.
- Per-combat variance: each fight is a new hand, not a re-placement of the same 6 owned words.
- Preserve the madlibs identity: grammar-shaped phrase slots (weapon + adjectives + noun + gem) are untouched.
- Preserve the one-big-turn dream: Perfect Forge rewards a strike-1 kill; REREAD loops still exist.
- The combat screen becomes the marketing screenshot.

## Non-Goals (named future phases, do not build now)

- Slay-the-Spire-style branching node map (design must not block it; do not implement).
- Endless mode, daily seeded runs, new Steam achievements, full enemy art pass.
- New heat talents (Bellows, Cold Forge, Quench) — stretch only, see §6.

---

## 1. Combat loop

### 1.1 Deck zones

| Zone | Name | Behavior |
|---|---|---|
| Draw pile | **Lexicon** | Shuffled at combat start. |
| Hand | Hand | Drawn to **8 cards**; refilled to 8 after each strike. |
| Discard pile | **Spent** | Played and discarded cards. When Lexicon empties, shuffle Spent into Lexicon. |

Cards persist for the run (the deck is the collection). Zones reset every combat: all cards return to the Lexicon and are reshuffled.

### 1.2 Strikes and heat

- Up to **4 strikes** per combat. Enemy HP persists between strikes.
- Heat bands (a decaying damage multiplier applied in `calc()` as a sequential multiplier):

| Strike | Band | Multiplier |
|---|---|---|
| 1 | WHITE HOT | ×2.0 |
| 2 | YELLOW | ×1.5 |
| 3 | ORANGE | ×1.25 |
| 4 | RED | ×1.0 |
| — | COLD | Combat lost: player loses 1 life (existing life/defeat system unchanged). |

- **Perfect Forge:** enemy killed on strike 1 → +10 gold and the post-combat card pick offers one upgraded (engraved) option.
- **Discards:** **3 per combat**. Discard any number of cards from hand, draw that many. Discards do not consume heat or a strike.
- Forging: player builds a phrase from hand into the existing slot structure, presses STRIKE (replaces "Forge Weapon"). Played cards go to Spent.

### 1.3 Weapon guarantee

- The **Stick** (existing T0 word, ×0.5) becomes a permanent fallback weapon: always available in the weapon slot, never part of the deck, cannot be removed.
- Starting decks contain 3 real weapons (§7), so Stick forges are an emergency, not the norm.

### 1.4 Enemy intents

Between strikes (if alive), the enemy performs a telegraphed action, shown as an intent bubble before the player's strike (Slay the Spire model). Intents are grammatical sabotage, not a defense minigame:

| Intent | Effect |
|---|---|
| Block slot | One named slot unusable next strike (reuses existing `S.blockedSlot` mechanics). |
| Douse | Heat drops an extra band after the next strike. |
| Scramble | One random card from hand returns to the Lexicon (shuffled in). |
| Strike back | Chip damage to hero HP (existing hero HP/lives system). |
| Bolster | Enemy self-buff (e.g., +15% HP heal, or temporary resistance shift). |

Common enemies get 2–3 intents from this table. Chapter bosses get heat-interactive signature intents (e.g., a water-aligned boss starts combat at ORANGE; a fire-aligned boss locks heat at WHITE HOT but heals every strike). Existing boss mechanics (slot block, element immunity, gem ignore) are retained and expressed through the intent system.

---

## 2. Acquisition and economy

### 2.1 Post-combat card pick

- After every victory: **pick 1 of 3 word cards**, or skip for **+5 gold**.
- Rarity weights scale by round; miniboss and chapter-boss victories pull from rarer pools.
- Boss/elite reveals reuse the existing crate-reel animation as the card-reveal moment.

### 2.2 Forge Vendor

Appears **3× per run, at rounds 6, 15, 24** (after the second miniboss of each chapter). Offers:

- **Remove a card** from the deck (deck thinning) — priced in gold, price escalates per removal.
- **Engrave a card** (permanent upgrade: +1 AP, or add an element, exact engrave table tuned during implementation).
- Consumables (existing items + **Quench Flask**: restore one heat band mid-combat; consumable limit stays 2).
- 1–2 premium cards purchasable with gold.

### 2.3 Gold

- Income: victory rewards (existing values), Perfect Forge bonus, skip-pick bonus, gold talents.
- Spend: Forge Vendor only, plus gold-spending talents (Golden Reread etc.).
- **Slot-based interest is removed** (no inventory slots exist). Flat interest survives: +1 gold per 10 held, capped at +6, awarded after each combat — keeping the Compound Interest archetype alive.

### 2.4 Removed systems

Word inventory (24-cap) and its UI, per-round shop browsing, crate purchasing, sell mechanic, reroll costs. Dead code paths removed on the branch, not flag-gated.

---

## 3. Systems that survive untouched

- `calc()` damage pipeline (heat multiplier is one new sequential multiplier input).
- All 50 talents, their categories, leveling, and cadence: picks at R1 and minibosses, mass upgrade at chapter bosses.
- Heroes, passives, skill trees, XP, hero unlocks, difficulties (Apprentice/Adept/Master).
- 27-round linear spine: minibosses R3/R6 pattern, chapter bosses R9/R18/R27.
- Enemies and bosses (plus new intent data per enemy).
- Lives/defeat flow, PStats meta-progression.

---

## 4. Visual integration

Port the approved mockup (`mockup-combat-redesign.html`) into the live game:

- Card-ified words: parchment card faces, tier pips, element ink washes, rarity frames, legendary foil sweep. Used in hand, forge slots (mini variant), and reward picks.
- Fanned hand at screen bottom with hover-lift; Lexicon/Spent pile widgets with counts; "Discards left" indicator.
- Phrase banner: large blackletter phrase center-screen with per-element word treatments (fire gradient, foil, dark pulse).
- Scoring theater on STRIKE: per-word tally (cards pulse in sequence, +AP/+W flyups, burning MULT chip), REREAD ribbon slam, damage rollup, magnitude-tiered screen shake (3 tiers), white-out flash, enemy flinch, scaled damage popup.
- Heat UI: glowing ingot gauge that dims per band + 4 strike pips near the STRIKE button. Intent bubble above enemy.
- Enemy presentation: large portrait layout, wax-seal weakness/resist badges.
- Number formatting: `fmtBig()` gains abbreviation ≥1M (1.2M / 3.4B / 1.1T / 1Q).
- Mockup CSS merged into `styles.css`, namespaced under the new combat screen's classes; existing token systems (typography, z-index, RHYTHM timing) reused.

---

## 5. Architecture and migration

- All work on branch **`deck-mode`**; `main` stays the playable classic build. Merge only when deck mode is validated as better.
- New systems in new files (plain script tags, shared globals, existing code conventions):
  - `game/deck.js` — Lexicon/hand/Spent state, draw/shuffle/discard logic, starting deck construction.
  - `game/heat.js` — heat bands, strike counter, intent selection/resolution, Perfect Forge detection.
  - `game/combat-ui.js` — hand fan rendering, card components, scoring theater, heat/intent UI.
- `script.js` edited only at the seams: `forge()` (becomes the strike handler), `afterCombat()` (card pick replaces shop routing), `newEnc()` (intent assignment, combat-start deck reset), save/load, and deletion of dead shop/inventory code.
- **Save versioning introduced now:** `saveVersion: 2` in run saves. Loading a v1 run save shows a friendly "a new era of forging has begun" message and clears the run save. PStats (XP, unlocks, stats) is schema-compatible and migrates untouched.
- State additions on `S`: `deck: {lexicon:[], hand:[], spent:[]}`, `discardsLeft`, `heatBand`, `strikeNum`, `enemyIntent`.

---

## 6. Talents and heat (stretch)

Core talent set ships unchanged. If playtesting shows heat needs build hooks, add (in this order): **Bellows** (heat does not drop after your first strike), **Quench** (Perfect Forge carries +1 band into next combat), **Cold Forge** (×2 mult at RED or lower — inverts the tension). These are pre-designed but not part of the initial build.

---

## 7. Balance baseline (starting numbers, tuned via sim + playtest)

- Hand size 8 · discards 3 · strikes 4 · heat ×2.0/×1.5/×1.25/×1.0.
- Starting deck, ~14 cards per hero: 3 weapons matching hero proficiency, 8 T1 adjectives biased toward hero elements, 2 nouns, 1 flex card (hero-flavored).
- Enemy HP: existing curve ×2.5 as the first retune for multi-strike + heat. Difficulty multipliers unchanged.
- Reward rarity weights by round and engrave pricing: set during implementation, validated by sim.

---

## 8. Testing

- **Sim:** `tools/sim.js` (Node, no framework) — simulates thousands of combats with random hands against the HP curve to validate strike counts, heat math, and the ×2.5 retune. Run with `node tools/sim.js`.
- **Manual checklist per chapter:** strike flow, discard edge cases (0 cards, full hand), Lexicon reshuffle, Stick fallback, every intent type, Perfect Forge trigger, vendor remove/engrave, save/load mid-run (including v1-save rejection), talent cadence intact, demo flag behavior.

## Risks

- **Run length bloat:** 27 rounds × multi-strike fights. Mitigations: trash mobs tuned to die in 1–2 strikes, heat bonus rewards speed; if runs exceed ~35 min in playtest, reduce rounds per chapter (9 → 7) as a tuning lever.
- **Talent interactions with redraws** (e.g., per-word run-tracking talents now see more total words): flagged for the sim; individual talents may need per-combat caps.
- **Monolith seams:** `forge()`/`afterCombat()` have many callers; the implementation plan must enumerate call sites before editing.

---

## Amendments (made during implementation, 2026-06-10)

Discovery against the real codebase forced these deviations from the spec above; the implemented behavior is authoritative:

1. **Strikeback steals gold, not HP.** The game has no hero-HP stat (lives only), so the `strikeback` intent ("Pilfers your purse!") steals `5 + floor(round/3)×3` gold instead of dealing chip damage (§1.4 table superseded).
2. **Starting deck composition.** No "noun" or "adj" word types exist — words are weapon/rarity/elemental, and elemental words serve all adjective/noun roles. Starting deck = 3 weapons (hero's proficient category, one per tier) + 10 T1 elementals (6 biased to hero's strong elements) + 1 T1 rarity word (§7 superseded).
3. **No gem items exist.** "Gem slot" is the noun1 forge slot filled by ordinary words; the vendor's Rare Stock is 2 premium cards only (§2.2 adjusted).
4. **Quivera passive reworked.** "Resourceful" (formerly shop-entry word grant — shop retired) is now: draw 1 extra card each combat (hand size 9).
5. **Engraves arrive earlier.** Perfect Forge offers one pre-engraved card at the post-combat pick (in addition to vendor engraving).
6. **Boss loot replaced.** Legacy boss word-loot to inventory is retired; boss-weighted card picks are the boss reward.
7. **Interest.** Flat interest = min(gold/10, 6) × difficulty interest mult, granted between rounds by the round bridge (`deckNextRound`); slot interest deleted with the inventory.
