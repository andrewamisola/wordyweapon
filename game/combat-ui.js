// === DECK MODE: combat UI — card components, hand fan, piles ===
'use strict';

function cuiCardEl(card, opts) {
  opts = opts || {};
  const el = document.createElement('div');
  const tier = card.rarity || 0;
  el.className = 'wcard'
    + (tier >= 3 ? ' t3' : tier === 2 ? ' t2' : '')
    + ((card.type === 'rarity' && tier >= 3) ? ' foil' : '')
    + (opts.mini ? ' mini' : '');
  if (card.uid) el.dataset.uid = card.uid;
  const pips = '<i></i>'.repeat(Math.max(1, tier));
  const stat = card.type === 'rarity' ? ('W ×' + card.mult)
             : card.type === 'weapon' ? ('+' + Math.max(1, tier) + ' <b>AP</b>')
             : ('+' + Math.max(1, tier) + ' <b>AP</b>');
  el.innerHTML =
    '<div class="wcard-face">'
    + '<div class="tier-pips">' + pips + '</div>'
    + '<div class="art">' + cuiCardArt(card) + '</div>'
    + '<div class="cname">' + card.name + '</div>'
    + '<div class="ctype">' + cuiTypeLabel(card) + '</div>'
    + '<div class="cstat">' + stat + '</div>'
    + '</div>';
  el.oncontextmenu = (e) => e.preventDefault();
  return el;
}

function cuiTypeLabel(card) {
  const t = card.type === 'weapon' ? 'WEAPON'
          : card.type === 'rarity' ? 'RARITY'
          : 'ELEMENTAL';
  const e = (card.elem !== undefined && typeof EN !== 'undefined') ? ' · ' + EN[card.elem].toUpperCase() : '';
  const cat = card.category ? ' · ' + card.category.toUpperCase() : '';
  return t + e + cat;
}

function cuiCardArt(card) {
  const color = (card.elem !== undefined && typeof EC !== 'undefined') ? EC[card.elem]
              : card.type === 'rarity' ? '#e8c25c'
              : '#a89263';
  // Simple ink-diamond placeholder; type-distinct silhouettes:
  if (card.type === 'weapon') {
    return '<svg viewBox="0 0 48 48"><path d="M24 2 L28 8 L28 30 L24 36 L20 30 L20 8 Z" fill="' + color + '" stroke="rgba(0,0,0,.55)" stroke-width="2"/><rect x="14" y="32" width="20" height="5" rx="2" fill="#8a6a2c" stroke="rgba(0,0,0,.5)" stroke-width="1.5"/></svg>';
  }
  if (card.type === 'rarity') {
    return '<svg viewBox="0 0 48 48"><path d="M14 8 H34 L42 18 L24 42 L6 18 Z" fill="' + color + '" stroke="rgba(0,0,0,.5)" stroke-width="2"/><path d="M14 8 L24 18 L34 8 M6 18 H42 M24 18 L24 42" stroke="rgba(0,0,0,.4)" stroke-width="1.5" fill="none"/></svg>';
  }
  return '<svg viewBox="0 0 48 48"><path d="M24 4 L42 24 L24 44 L6 24 Z" fill="' + color + '" stroke="rgba(0,0,0,.5)" stroke-width="2"/></svg>';
}

// Renders the fanned hand. Skips cards currently slotted in S.sel. Marks the
// pending (selected) card. opts: { onCardClick(card, el), onCardRightClick(card, el) }
function cuiRenderHand(S, opts) {
  opts = opts || {};
  const wrap = document.getElementById('deck-hand');
  if (!wrap) return;
  wrap.innerHTML = '';
  if (!S.deck) { cuiRenderPiles(S); return; }
  const slotted = new Set(Object.values(S.sel || {}).filter(Boolean).map(w => w.uid).filter(Boolean));
  const visible = S.deck.hand.filter(c => !slotted.has(c.uid));
  const n = visible.length, mid = (n - 1) / 2;
  visible.forEach((card, i) => {
    const el = cuiCardEl(card);
    el.style.setProperty('--tilt', ((i - mid) * 3.2) + 'deg');
    el.style.setProperty('--lift', (Math.abs(i - mid) * 7) + 'px');
    if (S.pendingWord && S.pendingWord.uid === card.uid) el.classList.add('pending');
    el.onclick = () => opts.onCardClick && opts.onCardClick(card, el);
    el.oncontextmenu = (e) => { e.preventDefault(); opts.onCardRightClick && opts.onCardRightClick(card, el); };
    wrap.appendChild(el);
  });
  cuiRenderPiles(S);
}

function cuiRenderPiles(S) {
  const lex = document.querySelector('#pile-lexicon .pile-count');
  const sp = document.querySelector('#pile-spent .pile-count');
  const d = document.getElementById('deck-discards-left');
  if (lex) lex.textContent = (S.deck && S.deck.lexicon.length) || 0;
  if (sp) sp.textContent = (S.deck && S.deck.spent.length) || 0;
  if (d) d.innerHTML = 'Discards left: <b>' + (S.discardsLeft != null ? S.discardsLeft : 0) + '</b>';
}

if (typeof module !== 'undefined') {
  module.exports = { cuiCardEl, cuiTypeLabel, cuiRenderHand, cuiRenderPiles };
}
