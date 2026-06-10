// === Number formatting (shared, Node-testable) ===
'use strict';
function fmtBig(n) {
  n = Math.floor(n);
  const abbr = (v, suffix) => {
    const x = v >= 100 ? Math.round(v).toString()
      : (Math.round(v * 10) / 10).toString().replace(/\.0$/, '');
    return x + suffix;
  };
  if (n >= 1e15) return abbr(n / 1e15, 'Q');
  if (n >= 1e12) return abbr(n / 1e12, 'T');
  if (n >= 1e9)  return abbr(n / 1e9,  'B');
  if (n >= 1e6)  return abbr(n / 1e6,  'M');
  return n.toLocaleString('en-US');
}
if (typeof module !== 'undefined') module.exports = { fmtBig };
