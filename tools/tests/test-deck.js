'use strict';
const assert = require('assert');
const { DeckSys, DECK_HAND_SIZE, DECK_DISCARDS_PER_COMBAT } = require('../../game/deck.js');

// Fake pool mirroring the REAL pool's shapes (type/category/rarity/elem fields)
const POOL = [
  { id: 'sword',  name: 'Sword',  type: 'weapon', category: 'slash', rarity: 1 },
  { id: 'blade',  name: 'Blade',  type: 'weapon', category: 'slash', rarity: 2 },
  { id: 'claymore', name: 'Claymore', type: 'weapon', category: 'slash', rarity: 3 },
  { id: 'club',   name: 'Club',   type: 'weapon', category: 'blunt', rarity: 1 },
  { id: 'fire_n', name: 'Fire',  type: 'elemental', elem: 2, rarity: 1 },
  { id: 'earth_n', name: 'Earth', type: 'elemental', elem: 6, rarity: 1 },
  { id: 'phys_n', name: 'Iron',  type: 'elemental', elem: 0, rarity: 1 },
  { id: 'water_n', name: 'Water', type: 'elemental', elem: 3, rarity: 1 },
  { id: 'fire_n2', name: 'Inferno', type: 'elemental', elem: 2, rarity: 2 },
  { id: 'adj_common', name: 'Common', type: 'rarity', mult: 1.5, rarity: 1 },
  { id: 'adj_rare', name: 'Rare', type: 'rarity', mult: 4.0, rarity: 2 },
];
const HERO = { name: 'TestHero', str: [2, 6], good: 'slash' };

// --- buildStartingDeck: 14 cards = 3 weapons + 10 T1 elementals + 1 T1 rarity ---
const deck = DeckSys.buildStartingDeck(POOL, HERO);
assert.strictEqual(deck.length, 14, 'starting deck has 14 cards, got ' + deck.length);
const weapons = deck.filter(c => c.type === 'weapon');
assert.strictEqual(weapons.length, 3, '3 weapons');
assert.ok(weapons.every(c => c.category === 'slash'), 'weapons match hero.good');
assert.deepStrictEqual(weapons.map(c => c.rarity).sort(), [1, 2, 3], 'one weapon per tier');
const elems = deck.filter(c => c.type === 'elemental');
assert.strictEqual(elems.length, 10, '10 elemental cards');
assert.ok(elems.every(c => c.rarity === 1), 'all elemental cards are T1');
assert.ok(elems.filter(c => HERO.str.includes(c.elem)).length >= 6, 'at least 6 biased to hero.str');
const rarities = deck.filter(c => c.type === 'rarity');
assert.strictEqual(rarities.length, 1, '1 rarity card');
assert.strictEqual(rarities[0].rarity, 1, 'rarity card is T1');
const uids = new Set(deck.map(c => c.uid));
assert.strictEqual(uids.size, deck.length, 'every card has a unique uid');
assert.ok(deck.every(c => POOL.every(p => p !== c)), 'cards are clones, not pool references');

// --- combat zones ---
const S = { deckCards: deck };
DeckSys.initCombat(S);
assert.strictEqual(S.deck.hand.length, DECK_HAND_SIZE, 'draws 8');
assert.strictEqual(S.deck.lexicon.length, 14 - DECK_HAND_SIZE, 'rest in lexicon');
assert.strictEqual(S.deck.spent.length, 0, 'spent empty');
assert.strictEqual(S.discardsLeft, DECK_DISCARDS_PER_COMBAT, '3 discards');

// --- playCards moves hand -> spent ---
const played = S.deck.hand.slice(0, 3).map(c => c.uid);
DeckSys.playCards(S, played);
assert.strictEqual(S.deck.hand.length, DECK_HAND_SIZE - 3);
assert.strictEqual(S.deck.spent.length, 3);

// --- refill draws back to 8, no cards lost ---
DeckSys.refill(S);
assert.strictEqual(S.deck.hand.length, 8, 'refilled to 8');
assert.strictEqual(S.deck.hand.length + S.deck.lexicon.length + S.deck.spent.length, 14, 'no cards lost');

// --- discard spends a discard and redraws same count ---
const before = S.deck.hand.length;
const ok = DeckSys.discard(S, [S.deck.hand[0].uid, S.deck.hand[1].uid]);
assert.strictEqual(ok, true);
assert.strictEqual(S.discardsLeft, DECK_DISCARDS_PER_COMBAT - 1);
assert.strictEqual(S.deck.hand.length, before, 'hand size unchanged after discard+redraw');

// --- discard refused at 0 / with empty list ---
S.discardsLeft = 0;
assert.strictEqual(DeckSys.discard(S, [S.deck.hand[0].uid]), false);
S.discardsLeft = 1;
assert.strictEqual(DeckSys.discard(S, []), false, 'empty discard refused');

// --- reshuffle: drain lexicon, next draw flips spent in ---
S.deck.lexicon = [];
const spentCount = S.deck.spent.length;
assert.ok(spentCount > 0, 'precondition: spent has cards');
DeckSys.draw(S, 1);
assert.strictEqual(S.deck.spent.length, 0, 'spent shuffled back');

// --- draw caps when all cards exhausted (no infinite loop, no dupes) ---
const S2 = { deckCards: DeckSys.buildStartingDeck(POOL, HERO) };
DeckSys.initCombat(S2);
DeckSys.draw(S2, 99);
assert.strictEqual(S2.deck.hand.length, 14, 'cannot draw more than total cards');

// --- scrambleOne: hand card returns to lexicon ---
const S3 = { deckCards: DeckSys.buildStartingDeck(POOL, HERO) };
DeckSys.initCombat(S3);
const h0 = S3.deck.hand.length, l0 = S3.deck.lexicon.length;
const scrambled = DeckSys.scrambleOne(S3);
assert.ok(scrambled, 'returns the scrambled card');
assert.strictEqual(S3.deck.hand.length, h0 - 1);
assert.strictEqual(S3.deck.lexicon.length, l0 + 1);

// --- add/remove (vendor) ---
const n0 = S.deckCards.length;
const addedCard = DeckSys.addCard(S, POOL[4]);
assert.strictEqual(S.deckCards.length, n0 + 1);
assert.ok(addedCard.uid, 'added card has uid');
DeckSys.removeCard(S, addedCard.uid);
assert.strictEqual(S.deckCards.length, n0);
assert.ok(!S.deckCards.some(c => c.uid === addedCard.uid));

// --- syncUidCounter prevents uid collisions after load ---
const S6 = { deckCards: [{ id: 'x', uid: 'c500' }, { id: 'y', uid: 'c42' }] };
DeckSys.syncUidCounter(S6);
const fresh = DeckSys.addCard(S6, { id: 'z', type: 'elemental', rarity: 1 });
assert.ok(!S6.deckCards.slice(0, 2).some(c => c.uid === fresh.uid), 'no uid collision after sync');
assert.strictEqual(fresh.uid, 'c501', 'counter resumed past max loaded uid');

console.log('test-deck: ALL PASS');
