# Deck Mode QA Checklist

Run on Apprentice with Graham unless stated. Check off with the build hash (`git rev-parse --short HEAD`).
This is the human-playtest gate before merging `deck-mode` → `main`.

## Combat core
- [ ] Hand draws 8 at combat start (9 for Quivera); Lexicon/Spent pile counts correct throughout
- [ ] Discard: right-click marks (teal lift), button shows count, confirm swaps cards + decrements; refused at 0; marking a card then slotting it unmarks it
- [ ] Reshuffle: play until Lexicon empties; Spent flips in; no card lost (hand+lexicon+spent === deckCards.length in console)
- [ ] Strike 1 kill → "+10 gold Perfect Forge" toast; next card pick offers one ⚒ ENGRAVED card
- [ ] Non-kill strike: STRIKE! result box (no defeat sting), continue → same enemy, HP persisted, hand refilled, played cards in Spent, heat dropped one band (gauge + breakdown row agree)
- [ ] 4 failed strikes → COLD → normal defeat flow (lives, Alexandria's 2 lives respected)
- [ ] Stick: empty weapon slot → pinned stick card forges a weak weapon; stick returns every strike; never appears in Spent
- [ ] Intents: bubble telegraphs before every strike; block blocks exactly one strike (and doesn't break Red Aktins' own block); douse drops an extra band; scramble pulls a hand card back; Pilfer steals gold; bolster heals (capped at spawn HP)
- [ ] Quench Flask restores one band mid-combat; refused (not consumed) at white-hot
- [ ] Scoring theater: phrase banner styled per element; AP×W×MULT chips count word-by-word; REREAD ribbon on retrigger passes; damage popup abbreviates (1.2M) and shake escalates with magnitude; nothing lingers after combat ends

## Rewards & economy
- [ ] Card pick after every continuing victory; skip → +5 gold; boss-round picks skew rare
- [ ] No card pick after: final R27 victory, Ultimate Weapon victory, defeat
- [ ] Vendor appears ONLY after R6/R15/R24 victories (after pick, before talent select): retire (cost escalates 15/25/35…; refused below 8 cards), engrave (25g, once per card, +1 AP visible in next combat's breakdown), 2 premium cards, tools incl. Quench Flask; LEAVE exits cleanly; gold line updates live
- [ ] Flat interest (gold/10, cap 6) granted between rounds; no slot interest anywhere; Investment talent tooltip coherent
- [ ] Legacy shop NEVER appears in a deck run (R1→R27)

## Systems integrity
- [ ] Talent cadence unchanged: pick at R1, minibosses; mass-upgrade + pick at chapter bosses (celebration intact)
- [ ] REREAD talents fire with ribbon; Ultimate Weapon loop detection still triggers at 1e15
- [ ] Hero passives: Graham −20% HP; Quivera 9-card hand (and back to 8 on a following Graham run); Alexandria 2 lives; Caesura +W; Reed gem-weakness; Belle weakness shuffle
- [ ] Save/continue: quit between rounds → continue lands at forge phase, correct round, deck intact (engraves persisted); old v1 save rejected with "new era" toast
- [ ] Abandon run mid-vendor / mid-card-pick (Esc → new run): no stale overlays, next run unaffected
- [ ] Chapter bosses keep signature mechanics (Red Aktins slot block, Plague Doctor immunity, Oxy opposing-element zero, Dotdotdot gem ignore) layered with intents
- [ ] Low FX mode: theater still plays without flash/flyers; no console errors
- [ ] Electron + browser both boot; full chapter with zero console errors

## Balance feel (subjective — record numbers)
- [ ] R7–R9 difficulty hump: sim flags block-2 HP (800–1600) as potentially brutal before chapter-2 power. Record strikes-used at R7/R8/R9 and whether it felt fair
- [ ] Trash rounds die in 1–2 strikes; bosses take 2–4 with real tension
- [ ] Full run length ≤ 35 min (record actual)
- [ ] Discards feel scarce-but-usable; vendor prices (premium up to 90g) vs gold curve — record gold at R6/R15/R24
- [ ] Heat tension: did you ever strike early with a worse hand to keep the ×2? (That's the design working)

## Known accepted quirks (don't re-report)
- Partial discard with stale marks (scrambled card) still costs the discard — accepted per design
- Save during card-pick overlay → reload replays that combat (save is post-victory only after pick completes)
- 999.5M-999.9M displays as "1000M" (tier-boundary rounding)
- Sim's R7–9 cold% is a model artifact (no mid-run power growth modeled) — judge by play, not sim
