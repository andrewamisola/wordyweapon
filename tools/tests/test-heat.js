'use strict';
const assert = require('assert');
const { HeatSys, HEAT_BANDS, HEAT_MAX_STRIKES, INTENT_TYPES, INTENT_DEFS } = require('../../game/heat.js');

const S = {};
HeatSys.initCombat(S);
assert.strictEqual(S.strikeNum, 1);
assert.strictEqual(HeatSys.band(S).key, 'white');
assert.strictEqual(HeatSys.mult(S), 2.0);
assert.strictEqual(HeatSys.isPerfectForge(S), true);

assert.strictEqual(HeatSys.advance(S), 'ok');
assert.strictEqual(S.strikeNum, 2);
assert.strictEqual(HeatSys.mult(S), 1.5);
assert.strictEqual(HeatSys.isPerfectForge(S), false);

assert.strictEqual(HeatSys.advance(S), 'ok'); // -> strike 3, x1.25
assert.strictEqual(HeatSys.mult(S), 1.25);
assert.strictEqual(HeatSys.advance(S), 'ok'); // -> strike 4, x1.0
assert.strictEqual(HeatSys.mult(S), 1.0);
assert.strictEqual(HeatSys.advance(S), 'cold'); // out of strikes
assert.strictEqual(S.strikeNum, 4, 'strikeNum does not advance past max');

// Douse: extra band drop. After douse on strike 1, strike 2 behaves like band 3 (orange).
const S2 = {};
HeatSys.initCombat(S2);
HeatSys.douse(S2);
assert.strictEqual(HeatSys.advance(S2), 'ok');
assert.strictEqual(S2.strikeNum, 2);
assert.strictEqual(HeatSys.band(S2).key, 'orange', 'douse skipped a band');

// Douse clamps at the bottom; advance then ends combat.
HeatSys.douse(S2); HeatSys.douse(S2); HeatSys.douse(S2);
assert.strictEqual(HeatSys.band(S2).key, 'red', 'clamped at RED');
assert.strictEqual(HeatSys.advance(S2), 'cold');

// Quench (consumable hook): restores one band.
const S5 = {};
HeatSys.initCombat(S5);
HeatSys.douse(S5);
assert.strictEqual(HeatSys.band(S5).key, 'yellow');
assert.strictEqual(HeatSys.quench(S5), true, 'quench removes a douse first');
assert.strictEqual(HeatSys.band(S5).key, 'white');
assert.strictEqual(HeatSys.quench(S5), false, 'cannot quench above white at strike 1');
HeatSys.advance(S5); HeatSys.advance(S5); // strike 3
assert.strictEqual(HeatSys.quench(S5), true, 'quench steps strike band back');
assert.strictEqual(S5.strikeNum, 2);

// Intents: roll respects enemy pool, avoids immediate repeats, resolve dispatches.
const S3 = { enemy: { intents: ['block', 'douse', 'strikeback'] } };
HeatSys.initCombat(S3);
for (let i = 0; i < 50; i++) {
  const prev = S3.enemyIntent;
  HeatSys.rollIntent(S3, 9);
  assert.ok(S3.enemy.intents.includes(S3.enemyIntent.type));
  assert.ok(S3.enemyIntent.label && S3.enemyIntent.desc, 'intent has display strings');
  if (prev && S3.enemy.intents.length > 1) {
    assert.notStrictEqual(S3.enemyIntent.type, prev.type, 'no immediate repeat');
  }
}

const calls = [];
const api = {
  blockRandomSlot: () => calls.push('block'),
  stealGold: (n) => calls.push('steal' + n),
  healEnemyPct: (p) => calls.push('heal' + p),
  scrambleHand: () => calls.push('scramble'),
  onDouse: () => calls.push('douse'),
};
S3.enemyIntent = { type: 'strikeback', value: 8 };
HeatSys.resolveIntent(S3, api);
assert.deepStrictEqual(calls, ['steal8']);
assert.strictEqual(S3.enemyIntent, null, 'intent consumed after resolve');
S3.enemyIntent = { type: 'douse' };
const shiftBefore = S3.heatShift || 0;
HeatSys.resolveIntent(S3, api);
assert.ok(calls.includes('douse'));
assert.strictEqual(S3.heatShift, shiftBefore + 1, 'douse applied to state');
S3.enemyIntent = { type: 'bolster', value: 15 };
HeatSys.resolveIntent(S3, api);
assert.ok(calls.includes('heal15'));
S3.enemyIntent = { type: 'block' };
HeatSys.resolveIntent(S3, api);
assert.ok(calls.includes('block'));
S3.enemyIntent = { type: 'scramble' };
HeatSys.resolveIntent(S3, api);
assert.ok(calls.includes('scramble'));
HeatSys.resolveIntent(S3, api); // null intent: no-op, no throw

// strikeback gold scales with round
const v1 = (() => { const s = { enemy: { intents: ['strikeback'] } }; HeatSys.initCombat(s); return HeatSys.rollIntent(s, 1).value; })();
const v27 = (() => { const s = { enemy: { intents: ['strikeback'] } }; HeatSys.initCombat(s); return HeatSys.rollIntent(s, 27).value; })();
assert.ok(v27 > v1, 'late-round theft is larger');

// Default intent set for enemies without one.
const S4 = { enemy: {} };
HeatSys.initCombat(S4);
HeatSys.rollIntent(S4, 5);
assert.ok(INTENT_TYPES.includes(S4.enemyIntent.type));

console.log('test-heat: ALL PASS');
