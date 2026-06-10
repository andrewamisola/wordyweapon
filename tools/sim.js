'use strict';
// === T14 Balance Simulator ===
// Node, no framework. Simulates 5000 runs x 27 rounds of deck-mode combat.
//
// DAMAGE MODEL FORMULA (from T14 spec, chapter-based):
//   chapter     = floor((r-1)/9)   -- 0=R1-9, 1=R10-18, 2=R19-27
//   ap          = 6 + chapter*6 + rand*4
//   w           = 10 + chapter*25 + rand*10
//   talentMult  = 1 + chapter*2 + rand*chapter
//   heatMult    = HEAT_BANDS[strikeNum-1].mult
//   dmg         = ap x w x talentMult x heatMult
//
// CRUDE APPROXIMATIONS (T15/QA read this):
//   - ap and w are random draws from a uniform range, not the real word-pool
//     distribution. Real AP varies by weapon rarity (T1-T3); real w depends
//     on the typed word's letter count. Expect high variance in actual play.
//   - talentMult at chapter 0 is always exactly 1.0 (no random component there).
//     Talent ramp is coarse -- only 3 chapter steps, not per-round upgrades.
//   - No hero passives modelled (Graham -20% HP, Quivera +1 card, etc.).
//   - No elemental weakness/resist bonuses, forge-vendor card upgrades, or
//     intent effects (block, douse, scramble, strikeback, bolster) modelled.
//   - All encounters use Apprentice difficulty (DIFF_HP_MULT=1.0).
//   - Damage model does NOT account for the forge vendor between rounds, which
//     in real play provides block-by-block upgrades that the chapter-step model
//     cannot capture. Expect real damage to be smoother than sim output.
//   - 'Cold death' means enemy not killed in 4 strikes -- combat loss in game.
//
// Use this sim to validate the SHAPE of the HP curve (easy trash, hard bosses),
// not to get exact kill-strike counts. Real play will vary significantly.

const path = require('path');
const { HEAT_BANDS, HEAT_MAX_STRIKES } = require(path.join(__dirname, '../game/heat.js'));

// === HP formula replicated exactly from script.js ===
// (BASE_HP_BLOCK0 changed from 20 to 50 as part of T14 multi-strike retune)
const BASE_HP_BLOCK0 = 50;
const BLOCK_GROWTH   = 4.0;
const ROUND_MULTS    = [1.0, 1.5, 2.0]; // Small blind, Big blind, Boss
const DIFF_HP_MULT   = [1.0, 1.5, 2.0]; // Index 0 = Apprentice (sim uses Apprentice only)

function enemyHp(round, difficulty) {
  const blockIndex   = Math.floor((round - 1) / 3);
  const posInBlock   = (round - 1) % 3;
  const baseForBlock = BASE_HP_BLOCK0 * Math.pow(BLOCK_GROWTH, blockIndex);
  const diffMult     = DIFF_HP_MULT[difficulty || 0];
  return Math.floor(baseForBlock * ROUND_MULTS[posInBlock] * diffMult);
}

// === Player damage estimate (spec formula) ===
function playerDamageEstimate(strikeNum, chapter) {
  const ap         = 6 + chapter * 6 + Math.random() * 4;
  const w          = 10 + chapter * 25 + Math.random() * 10;
  const talentMult = 1 + chapter * 2 + Math.random() * chapter;

  // Heat band multiplier by strike number (WHITE HOT=2.0 on strike 1, etc.)
  const bandIdx  = Math.min(strikeNum - 1, HEAT_BANDS.length - 1);
  const heatMult = HEAT_BANDS[bandIdx].mult;

  return ap * w * talentMult * heatMult;
}

// === Simulate one combat encounter ===
// Returns { strikes, coldDeath }
function simulateCombat(round) {
  const chapter = Math.floor((round - 1) / 9);
  let hp = enemyHp(round, 0); // Apprentice difficulty

  for (let strike = 1; strike <= HEAT_MAX_STRIKES; strike++) {
    const dmg = playerDamageEstimate(strike, chapter);
    hp -= dmg;
    if (hp <= 0) {
      return { strikes: strike, coldDeath: false };
    }
  }
  return { strikes: HEAT_MAX_STRIKES, coldDeath: true };
}

// === Run simulation ===
const RUNS = 5000;
const ROUNDS = 27;

const totalStrikes = new Array(ROUNDS + 1).fill(0);
const coldDeaths   = new Array(ROUNDS + 1).fill(0);

for (let run = 0; run < RUNS; run++) {
  for (let r = 1; r <= ROUNDS; r++) {
    const { strikes, coldDeath } = simulateCombat(r);
    totalStrikes[r] += strikes;
    if (coldDeath) coldDeaths[r]++;
  }
}

// === Print results table ===
const BOSS_ROUNDS = new Set([3, 6, 9, 12, 15, 18, 21, 24, 27]);

console.log('\n=== Wordy Weapon T14 Balance Simulator ===');
console.log('Runs: ' + RUNS + '  |  Rounds: ' + ROUNDS + '  |  BASE_HP_BLOCK0: ' + BASE_HP_BLOCK0);
console.log('');
console.log('Round | HP       | AvgStrikes | ColdDeath% | Type');
console.log('------|----------|------------|------------|------');

let trashAvgSum = 0, trashCount = 0;
let bossAvgSum  = 0, bossCount  = 0;
let trashColdSum = 0, bossColdSum = 0;

for (let r = 1; r <= ROUNDS; r++) {
  const avgStrikes = totalStrikes[r] / RUNS;
  const coldPct    = (coldDeaths[r] / RUNS) * 100;
  const hp         = enemyHp(r, 0);
  const type       = BOSS_ROUNDS.has(r) ? 'BOSS' : (r % 3 === 2 ? 'big' : 'trash');

  if (type !== 'BOSS') {
    trashAvgSum  += avgStrikes;
    trashColdSum += coldPct;
    trashCount++;
  } else {
    bossAvgSum  += avgStrikes;
    bossColdSum += coldPct;
    bossCount++;
  }

  const hpStr = hp >= 1000000 ? (hp / 1000000).toFixed(2) + 'M'
              : hp >= 1000    ? (hp / 1000).toFixed(1)    + 'K'
              : String(hp);

  console.log(
    '  R' + String(r).padStart(2) + '  | ' + hpStr.padEnd(8) +
    ' | ' + avgStrikes.toFixed(2).padStart(10) +
    ' | ' + coldPct.toFixed(1).padStart(9) + '% | ' + type
  );
}

// === Acceptance criteria ===
const trashAvg  = trashAvgSum  / trashCount;
const bossAvg   = bossAvgSum   / bossCount;
const trashCold = trashColdSum / trashCount;
const bossCold  = bossColdSum  / bossCount;

const trashOk    = trashAvg <= 2.2;
const bossAvgOk  = bossAvg >= 2.5 && bossAvg <= 3.5;
const trashColOk = trashCold < 10;
const bossColOk  = bossCold  < 25;

console.log('');
console.log('=== Tuning Summary ===');
console.log('Trash rounds avg strikes : ' + trashAvg.toFixed(3)  + '  (target <=2.2)  ' + (trashOk    ? 'OK' : 'FAIL'));
console.log('Boss  rounds avg strikes : ' + bossAvg.toFixed(3)   + '  (target 2.5-3.5) ' + (bossAvgOk  ? 'OK' : 'FAIL'));
console.log('Trash rounds avg cold%   : ' + trashCold.toFixed(1) + '%  (target <10%)   ' + (trashColOk ? 'OK' : 'FAIL'));
console.log('Boss  rounds avg cold%   : ' + bossCold.toFixed(1)  + '%  (target <25%)   ' + (bossColOk  ? 'OK' : 'FAIL'));
console.log('');
console.log('BASE_HP_BLOCK0 chosen: ' + BASE_HP_BLOCK0);
console.log('');
console.log('NOTE: The chapter-based damage model has 3 steps (R1/R10/R19).');
console.log('Real play uses forge-vendor upgrades every round, giving smoother');
console.log('progression. Mid-chapter HP jumps (e.g. R7-9 at chapter 0) will');
console.log('appear harder in the sim than in real play. See sim.js comments.');
