// === DECK MODE: heat bands, strikes, enemy intents ===
// Pure logic, no DOM. Loaded as a classic script before script.js.
'use strict';

const HEAT_BANDS = [
  { key: 'white',  name: 'WHITE HOT', mult: 2.0  },
  { key: 'yellow', name: 'YELLOW',    mult: 1.5  },
  { key: 'orange', name: 'ORANGE',    mult: 1.25 },
  { key: 'red',    name: 'RED',       mult: 1.0  },
];
const HEAT_MAX_STRIKES = 4;

const INTENT_TYPES = ['block', 'douse', 'scramble', 'strikeback', 'bolster'];
const INTENT_DEFS = {
  block:      { label: 'Inserts a pause…',   desc: 'Blocks one of your slots next strike' },
  douse:      { label: 'Douses the forge!',  desc: 'Your heat will drop an extra band' },
  scramble:   { label: 'Rewrites a word…',   desc: 'A random card returns to your Lexicon' },
  strikeback: { label: 'Pilfers your purse!', desc: 'Steals gold from you' },
  bolster:    { label: 'Bolsters itself…',   desc: 'Heals a portion of its health' },
};

const HeatSys = {
  initCombat(S) {
    S.strikeNum = 1;
    S.heatShift = 0;
    S.enemyIntent = null;
  },

  bandIndex(S) {
    return Math.min((S.strikeNum - 1) + (S.heatShift || 0), HEAT_BANDS.length - 1);
  },
  band(S) { return HEAT_BANDS[this.bandIndex(S)]; },
  mult(S) { return this.band(S).mult; },
  isPerfectForge(S) { return S.strikeNum === 1; },

  // Call after a non-killing strike. 'cold' => combat lost (caller handles).
  advance(S) {
    if (S.strikeNum >= HEAT_MAX_STRIKES || this.bandIndex(S) >= HEAT_BANDS.length - 1) return 'cold';
    S.strikeNum++;
    return 'ok';
  },

  douse(S) {
    S.heatShift = Math.min((S.heatShift || 0) + 1, HEAT_BANDS.length - 1);
  },

  // Quench Flask: restore one band. Prefer removing a douse shift; otherwise
  // step the strike band back. Returns false if already at WHITE HOT.
  quench(S) {
    if ((S.heatShift || 0) > 0) { S.heatShift--; return true; }
    if (S.strikeNum > 1) { S.strikeNum--; return true; }
    return false;
  },

  // Gold stolen by 'strikeback' scales gently with round.
  strikebackGold(round) {
    return 5 + Math.floor((round || 1) / 3) * 3;
  },

  rollIntent(S, round) {
    const pool = (S.enemy && S.enemy.intents && S.enemy.intents.length)
      ? S.enemy.intents : INTENT_TYPES;
    let candidates = pool;
    if (S.enemyIntent && new Set(pool).size > 1) {
      candidates = pool.filter(t => t !== S.enemyIntent.type);
    }
    const type = candidates[(Math.random() * candidates.length) | 0];
    S.enemyIntent = {
      type,
      label: INTENT_DEFS[type].label,
      desc: INTENT_DEFS[type].desc,
      value: type === 'strikeback' ? this.strikebackGold(round)
           : type === 'bolster' ? 15 : 0,
    };
    return S.enemyIntent;
  },

  // api: { blockRandomSlot(), stealGold(n), healEnemyPct(pct), scrambleHand(), onDouse() }
  resolveIntent(S, api) {
    const it = S.enemyIntent;
    if (!it) return;
    switch (it.type) {
      case 'block':      api.blockRandomSlot(); break;
      case 'douse':      this.douse(S); api.onDouse(); break;
      case 'scramble':   api.scrambleHand(); break;
      case 'strikeback': api.stealGold(it.value); break;
      case 'bolster':    api.healEnemyPct(it.value); break;
    }
    S.enemyIntent = null;
  },
};

if (typeof module !== 'undefined') {
  module.exports = { HeatSys, HEAT_BANDS, HEAT_MAX_STRIKES, INTENT_TYPES, INTENT_DEFS };
}
