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
  // Precise pending check: STICK (and any uid-less card) must not match a
  // uid-less pendingWord by accident (undefined === undefined).
  const isPending = (card) => S.pendingWord === card
    || (S.pendingWord && card.uid && S.pendingWord.uid === card.uid);
  visible.forEach((card, i) => {
    const el = cuiCardEl(card);
    el.style.setProperty('--tilt', ((i - mid) * 3.2) + 'deg');
    el.style.setProperty('--lift', (Math.abs(i - mid) * 7) + 'px');
    if (isPending(card)) el.classList.add('pending');
    el.onclick = () => opts.onCardClick && opts.onCardClick(card, el);
    el.oncontextmenu = (e) => { e.preventDefault(); opts.onCardRightClick && opts.onCardRightClick(card, el); };
    wrap.appendChild(el);
  });
  // Stick fallback: pinned to the left edge, outside the fan math. It has no
  // uid by design so it can never enter the deck/spent zones; it guarantees a
  // weapon is always reachable even when every deck weapon is Spent.
  if (typeof STICK !== 'undefined' && !(S.sel && S.sel.item && S.sel.item.isStick)) {
    const st = cuiCardEl(STICK, { mini: true });
    st.classList.add('stick-card');
    st.style.setProperty('--tilt', '-12deg');
    if (isPending(STICK)) st.classList.add('pending');
    st.onclick = () => opts.onCardClick && opts.onCardClick(STICK, st);
    wrap.appendChild(st);
  }
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

// Renders the enemy intent bubble above the enemy portrait container.
// Shows when deck mode is active and the enemy is alive; hides otherwise.
function cuiRenderIntent(S) {
  const el = document.getElementById('intent-bubble');
  if (!el) return;
  const show = S.deck && S.enemyIntent && S.enemy && S.enemy.hp > 0;
  el.classList.toggle('hidden', !show);
  if (!show) return;
  const it = S.enemyIntent;
  el.textContent = it.label + (it.type === 'strikeback' && it.value ? ` (${it.value}g)` : '');
  el.title = it.desc;
}

// === Task 9: Balatro-style scoring theater + phrase banner ===
// Layered ON TOP of the legacy tally loop in showCombat(); never replaces it.
// All entry points are no-ops unless cuiBuildPhraseBanner() has been called
// for the current combat (deck-gating happens at the script.js hook sites).

let cuiTheaterState = null;

function cuiLowFx() {
  return (typeof gfxSettings !== 'undefined') && !!gfxSettings.lowFx;
}

function cuiFmt(n) {
  if (!isFinite(n)) return '∞';
  if (typeof fmtBig === 'function') return fmtBig(n);
  return Math.floor(n).toLocaleString('en-US');
}

// Stat chips (AP/W): keep one decimal for small fractional values,
// abbreviate big ones via fmtBig.
function cuiFmtStat(n) {
  if (!isFinite(n)) return '∞';
  if (n >= 1e6) return cuiFmt(n);
  const r = Math.round(n * 10) / 10;
  return r % 1 ? r.toFixed(1) : r.toLocaleString('en-US');
}

function cuiFmtMult(v) {
  if (!isFinite(v)) return '×∞';
  if (v >= 1000) return '×' + cuiFmt(v);
  const r = Math.round(v * 10) / 10;
  return '×' + (r % 1 ? r.toFixed(1) : r);
}

// Element index (E.*) -> phrase-word class. Word display entry decides
// rarity/connector treatment before this is consulted.
function cuiPhraseClass(w) {
  if (w.italic) return 'pw-of';
  const ref = w.wordRef;
  if (ref && (ref.type === 'rarity' || (ref.mult !== undefined && ref.elem === undefined))) {
    return (ref.rarity >= 3) ? 'pw-legend' : 'pw-rare';
  }
  if (ref && ref.elem !== undefined && typeof E !== 'undefined') {
    switch (ref.elem) {
      case E.FIRE: return 'pw-fire';
      case E.DARK: return 'pw-dark';
      case E.LIGHT: return 'pw-light';
      case E.WATER: return 'pw-water';
      case E.POISON: return 'pw-poison';
      case E.LIGHTNING: return 'pw-lightning';
      case E.EARTH: return 'pw-earth';
      case E.PHYS: return 'pw-phys';
    }
  }
  return 'pw-plain';
}

function cuiChipHtml(id, label, val) {
  return '<div class="theater-chip" id="' + id + '">'
    + '<div class="lbl">' + label + '</div>'
    + '<div class="val">' + val + '</div></div>';
}

// Builds banner + scoreboard + ribbon inside the combat overlay.
// words: the showCombat display array (adjective/noun forms already applied).
// result: the safeResult object (calc() output merged with defaults).
function cuiBuildPhraseBanner(words, result) {
  cuiTheaterCleanup();
  const container = document.getElementById('combat-container');
  if (!container || !words || !words.length) return;

  const st = {
    words: words,
    result: result || {},
    ap: 0,
    w: 0,
    tAP: (result && isFinite(result.baseAP)) ? result.baseAP : 0,
    tW: (result && isFinite(result.wordCount)) ? result.wordCount : 0,
    tMult: (result && result.totalMultiplier) || 1,
    tDmg: (result && result.heroDmg) || 0,
    totalTriggers: words.reduce((s, w) => s + (w.retriggerCount || 1), 0),
    triggersCompleted: 0,
    spans: [],
    timers: []
  };

  // --- phrase banner (mounted above the weapon canvas) ---
  const banner = document.createElement('div');
  banner.id = 'theater-banner';
  const label = document.createElement('div');
  label.id = 'theater-phrase-label';
  label.textContent = 'THE FORGING OF';
  const phrase = document.createElement('div');
  phrase.id = 'theater-phrase';
  words.forEach((w, i) => {
    const span = document.createElement('span');
    span.className = 'pw ' + cuiPhraseClass(w);
    span.dataset.idx = i;
    span.textContent = w.name;
    phrase.appendChild(span);
    st.spans[i] = span;
  });
  banner.appendChild(label);
  banner.appendChild(phrase);
  container.insertBefore(banner, container.firstChild);

  // --- scoreboard chips: AP × W × MULT = DMG ---
  const board = document.createElement('div');
  board.id = 'theater-scoreboard';
  board.innerHTML =
    cuiChipHtml('theater-chip-ap', 'ATTACK', '0')
    + '<div class="theater-op">×</div>'
    + cuiChipHtml('theater-chip-w', 'WORDS', '0')
    + '<div class="theater-op">×</div>'
    + cuiChipHtml('theater-chip-mult', 'MULT', '×1')
    + '<div class="theater-op">=</div>'
    + cuiChipHtml('theater-chip-dmg', 'DAMAGE', '—');
  const totalEl = document.getElementById('combat-total');
  if (totalEl && totalEl.parentElement === container) {
    container.insertBefore(board, totalEl);
  } else {
    container.appendChild(board);
  }

  // --- REREAD ribbon (hidden until a pass > 0 starts) ---
  const ribbon = document.createElement('div');
  ribbon.id = 'theater-ribbon';
  ribbon.textContent = 'REREAD!';
  container.appendChild(ribbon);

  st.banner = banner;
  st.board = board;
  st.ribbon = ribbon;
  st.chipAP = board.querySelector('#theater-chip-ap');
  st.chipW = board.querySelector('#theater-chip-w');
  st.chipMult = board.querySelector('#theater-chip-mult');
  st.chipDmg = board.querySelector('#theater-chip-dmg');
  cuiTheaterState = st;
}

function cuiChipTick(chip, text) {
  if (!chip) return;
  const val = chip.querySelector('.val');
  if (val && text !== undefined) val.textContent = text;
  chip.classList.remove('tick');
  void chip.offsetWidth;
  chip.classList.add('tick');
}

function cuiFly(text, color, fromEl) {
  if (cuiLowFx()) return; // Low FX: skip flyer spawns
  const st = cuiTheaterState;
  if (!st || !fromEl) return;
  const ov = document.getElementById('combat-overlay');
  if (!ov) return;
  const r = fromEl.getBoundingClientRect();
  const f = document.createElement('div');
  f.className = 'theater-fly';
  f.textContent = text;
  f.style.color = color;
  f.style.left = (r.left + r.width / 2 - 20) + 'px';
  f.style.top = (r.top - 14) + 'px';
  ov.appendChild(f);
  st.timers.push(setTimeout(() => f.remove(), 1100));
}

// Called by the legacy tally loop for every word trigger (every pass).
// Uses REAL per-word numbers from result.wordDataMap on first appearance;
// REREAD passes interpolate the remainder toward the known calc() totals.
function cuiTheaterTickWord(i, isFirstAppearance) {
  const st = cuiTheaterState;
  if (!st) return;
  const word = st.words[i];
  const span = st.spans[i];
  if (span) {
    span.classList.add('counting');
    st.timers.push(setTimeout(() => span.classList.remove('counting'), 340));
  }
  if (!word) return;

  const wdMap = st.result.wordDataMap;
  const wd = (isFirstAppearance && wdMap && word.wordRef && wdMap.get) ? wdMap.get(word.wordRef) : null;

  let apAdd = 0, wAdd = 0;
  if (wd) {
    apAdd = wd.apContribution || 0;
    wAdd = wd.wCountTotal || 0;
    if (wd.mult && wd.mult !== 1) cuiFly('W ' + cuiFmtMult(wd.mult), '#fbbf24', span);
  } else {
    // No per-word data (connector line, stick, or a REREAD trigger):
    // walk the remaining distance to the real totals proportionally.
    const remaining = Math.max(1, st.totalTriggers - st.triggersCompleted);
    if (isFinite(st.tAP)) apAdd = Math.max(0, (st.tAP - st.ap) / remaining);
    if (isFinite(st.tW)) wAdd = Math.max(0, (st.tW - st.w) / remaining);
  }
  st.triggersCompleted++;

  if (apAdd > 0) {
    st.ap += apAdd;
    cuiChipTick(st.chipAP, cuiFmtStat(st.ap));
    if (wd) cuiFly('+' + cuiFmtStat(apAdd) + ' AP', '#8fc3ff', span);
  }
  if (wAdd > 0) {
    st.w += wAdd;
    cuiChipTick(st.chipW, cuiFmtStat(st.w));
    if (wd) cuiFly('+' + cuiFmtStat(wAdd) + ' W', '#9ef0a8', span);
  }

  // Final trigger: snap both chips to the exact calc() totals.
  if (st.triggersCompleted >= st.totalTriggers) {
    st.ap = st.tAP;
    st.w = st.tW;
    cuiChipTick(st.chipAP, cuiFmtStat(st.tAP));
    cuiChipTick(st.chipW, cuiFmtStat(st.tW));
  }
}

// Called when the legacy pass loop enters any pass beyond pass 0.
function cuiTheaterPassStart(passIdx) {
  const st = cuiTheaterState;
  if (!st || !passIdx || passIdx < 1 || !st.ribbon) return;
  st.ribbon.classList.remove('show');
  void st.ribbon.offsetWidth;
  st.ribbon.classList.add('show');
  cuiTheaterShake(1);
}

// After all words are counted: MULT burns from ×1 to the final multiplier,
// then the DAMAGE chip rolls up to the real heroDmg. Awaited by showCombat.
async function cuiTheaterMult(finalMult) {
  const st = cuiTheaterState;
  if (!st) return;
  const mult = (finalMult !== undefined) ? finalMult : st.tMult;
  const valMult = st.chipMult && st.chipMult.querySelector('.val');
  if (st.chipMult && mult && mult !== 1 && isFinite(mult)) {
    st.chipMult.classList.add('burning');
    if (valMult) await cuiRollNumber(valMult, 1, mult, 600, cuiFmtMult);
    cuiChipTick(st.chipMult, cuiFmtMult(mult));
    await new Promise(r => setTimeout(r, 220));
  } else if (valMult && !isFinite(mult)) {
    valMult.textContent = '×∞';
    st.chipMult.classList.add('burning');
  }
  // Damage rollup
  if (st.chipDmg) {
    st.chipDmg.classList.add('blazing');
    const valDmg = st.chipDmg.querySelector('.val');
    if (valDmg) {
      if (isFinite(st.tDmg)) {
        await cuiRollNumber(valDmg, 0, st.tDmg, 900, cuiFmt);
      } else {
        valDmg.textContent = '∞';
      }
    }
  }
  if (st.chipMult) st.chipMult.classList.remove('burning');
}

function cuiRollNumber(el, from, to, dur, fmt) {
  return new Promise(res => {
    const t0 = performance.now();
    const step = now => {
      const p = Math.min((now - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  });
}

function cuiTheaterShake(tier) {
  const targets = [document.getElementById('game-container'),
                   document.querySelector('#combat-overlay .modal')];
  targets.forEach(t => {
    if (!t) return;
    t.classList.remove('theater-shake-1', 'theater-shake-2', 'theater-shake-3');
    void t.offsetWidth;
    t.classList.add('theater-shake-' + tier);
    t.addEventListener('animationend', function clear() {
      t.classList.remove('theater-shake-1', 'theater-shake-2', 'theater-shake-3');
      t.removeEventListener('animationend', clear);
    });
  });
}

// Final impact: white-out flash + tiered screen shake + damage popup.
// Fires alongside the legacy HP-bar shatter (does not replace it).
function cuiTheaterImpact(dmg) {
  const st = cuiTheaterState;
  if (!st) return;
  const ov = document.getElementById('combat-overlay');
  if (!ov) return;
  const big = !isFinite(dmg) || dmg >= 1e6;
  const tier = big ? 3 : (dmg >= 1e4 ? 2 : 1);

  // White-out flash (skipped in Low FX mode)
  if (!cuiLowFx()) {
    let flash = document.getElementById('theater-flash');
    if (!flash) {
      flash = document.createElement('div');
      flash.id = 'theater-flash';
      ov.appendChild(flash);
    }
    flash.classList.remove('go');
    void flash.offsetWidth;
    flash.classList.add('go');
  }

  cuiTheaterShake(tier);

  // Damage popup anchored near the enemy HP bar
  const anchor = document.getElementById('bar-enemy');
  const anchorBox = anchor && (anchor.closest('.bar-block') || anchor.parentElement);
  let popup = document.getElementById('theater-popup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'theater-popup';
    ov.appendChild(popup);
  }
  popup.textContent = isFinite(dmg) ? cuiFmt(dmg) : '∞';
  popup.style.fontSize = tier === 3 ? '84px' : tier === 2 ? '66px' : '48px';
  if (anchorBox) {
    const r = anchorBox.getBoundingClientRect();
    popup.style.left = (r.left + r.width / 2) + 'px';
    popup.style.top = (r.top - 30) + 'px';
  } else {
    popup.style.left = '70%';
    popup.style.top = '40%';
  }
  popup.classList.remove('show');
  void popup.offsetWidth;
  popup.classList.add('show');
  st.timers.push(setTimeout(() => popup.remove(), 1800));
}

// Removes every theater DOM node + shake classes. Safe to call at any time,
// including non-deck mode (no-op when nothing is mounted).
function cuiTheaterCleanup() {
  const st = cuiTheaterState;
  if (st && st.timers) st.timers.forEach(t => clearTimeout(t));
  cuiTheaterState = null;
  ['theater-banner', 'theater-scoreboard', 'theater-ribbon', 'theater-flash', 'theater-popup']
    .forEach(id => { const el = document.getElementById(id); if (el) el.remove(); });
  document.querySelectorAll('.theater-fly').forEach(el => el.remove());
  [document.getElementById('game-container'),
   document.querySelector('#combat-overlay .modal')].forEach(t => {
    if (t) t.classList.remove('theater-shake-1', 'theater-shake-2', 'theater-shake-3');
  });
}

if (typeof module !== 'undefined') {
  module.exports = {
    cuiCardEl, cuiTypeLabel, cuiRenderHand, cuiRenderPiles, cuiRenderIntent,
    cuiBuildPhraseBanner, cuiTheaterTickWord, cuiTheaterPassStart,
    cuiTheaterMult, cuiTheaterImpact, cuiTheaterCleanup, cuiPhraseClass
  };
}
