// === DECK MODE: Lexicon / Hand / Spent zones, starting decks ===
// Pure logic, no DOM. Loaded as a classic script before script.js.
'use strict';

const DECK_HAND_SIZE = 8;
const DECK_DISCARDS_PER_COMBAT = 3;
const DECK_STARTING_SIZE = 14;

let _deckUidCounter = 1;

function deckCloneWord(word) {
  const c = Object.assign({}, word);
  c.uid = 'c' + (_deckUidCounter++);
  return c;
}

function deckShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const DeckSys = {
  // pool: the WORDS array; hero: a HEROES entry (hero.good = weapon category,
  // hero.str = strong element indices). 14 cards: 3 weapons of the hero's
  // proficient category (one per tier), 10 T1 elementals (6 biased to strong
  // elements), 1 T1 rarity word.
  buildStartingDeck(pool, hero) {
    const deck = [];
    const weapons = pool
      .filter(w => w.type === 'weapon' && w.category === hero.good)
      .sort((a, b) => a.rarity - b.rarity)
      .slice(0, 3);
    weapons.forEach(w => deck.push(deckCloneWord(w)));

    const t1elem = pool.filter(w => w.type === 'elemental' && w.rarity === 1);
    const strong = t1elem.filter(w => (hero.str || []).includes(w.elem));
    const other = t1elem.filter(w => !(hero.str || []).includes(w.elem));
    for (let i = 0; i < 6; i++) {
      const src = strong.length ? strong : t1elem;
      deck.push(deckCloneWord(src[i % src.length]));
    }
    for (let i = 0; i < 4; i++) {
      const src = other.length ? other : t1elem;
      deck.push(deckCloneWord(src[i % src.length]));
    }

    const t1rarity = pool.filter(w => w.type === 'rarity' && w.rarity === 1);
    if (t1rarity.length) deck.push(deckCloneWord(t1rarity[0]));

    return deck.slice(0, DECK_STARTING_SIZE);
  },

  initRunDeck(S, pool, hero) {
    S.deckCards = this.buildStartingDeck(pool, hero);
  },

  addCard(S, word) {
    const c = deckCloneWord(word);
    S.deckCards.push(c);
    return c;
  },

  removeCard(S, uid) {
    S.deckCards = S.deckCards.filter(c => c.uid !== uid);
  },

  initCombat(S) {
    S.deck = {
      lexicon: deckShuffle(S.deckCards.slice()),
      hand: [],
      spent: [],
    };
    S.discardsLeft = DECK_DISCARDS_PER_COMBAT;
    this.draw(S, DECK_HAND_SIZE);
  },

  draw(S, n) {
    for (let i = 0; i < n; i++) {
      if (!S.deck.lexicon.length) {
        if (!S.deck.spent.length) break;
        S.deck.lexicon = deckShuffle(S.deck.spent.splice(0));
      }
      S.deck.hand.push(S.deck.lexicon.pop());
    }
  },

  refill(S) {
    this.draw(S, DECK_HAND_SIZE - S.deck.hand.length);
  },

  playCards(S, uids) {
    const set = new Set(uids);
    const played = S.deck.hand.filter(c => set.has(c.uid));
    S.deck.hand = S.deck.hand.filter(c => !set.has(c.uid));
    S.deck.spent.push(...played);
    return played;
  },

  // Returns false if no discards left or nothing marked; otherwise moves the
  // cards to spent, draws the same count, and spends one discard.
  discard(S, uids) {
    if (S.discardsLeft <= 0 || !uids.length) return false;
    const n = this.playCards(S, uids).length;
    if (!n) return false;
    this.draw(S, n);
    S.discardsLeft--;
    return true;
  },

  // After loading a save: bump the uid counter past every loaded card uid so
  // newly added cards can't collide.
  syncUidCounter(S) {
    let max = 0;
    (S.deckCards || []).forEach(c => {
      const n = parseInt(String(c.uid || '').replace(/^c/, ''), 10);
      if (!isNaN(n) && n > max) max = n;
    });
    if (max >= _deckUidCounter) _deckUidCounter = max + 1;
  },

  // Intent "scramble": a random hand card returns to the lexicon.
  scrambleOne(S) {
    if (!S.deck.hand.length) return null;
    const i = (Math.random() * S.deck.hand.length) | 0;
    const card = S.deck.hand.splice(i, 1)[0];
    S.deck.lexicon.splice((Math.random() * (S.deck.lexicon.length + 1)) | 0, 0, card);
    return card;
  },
};

if (typeof module !== 'undefined') {
  module.exports = { DeckSys, DECK_HAND_SIZE, DECK_DISCARDS_PER_COMBAT, DECK_STARTING_SIZE, deckCloneWord, deckShuffle };
}
