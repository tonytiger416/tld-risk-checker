// NIST Visual Similarity Character Tables
// Ported from the original NIST gTLD visual similarity algorithm by Paul E. Black
// Source: https://hissa.nist.gov/~black/GTLD/ (charSimilarity.py v1.11, May 2008)
// The original is a US Government work (17 USC 105) and is in the public domain.
//
// The NIST code normalises all inputs to lowercase before lookup.
// This table stores all pairs as lowercase (including the auto-generated
// lowercase expansions of pairs that originally contained uppercase letters).

// ---------------------------------------------------------------------------
// Single-character similarity table
// Score 0–1: 1 = visually indistinguishable, 0 = no similarity
// ---------------------------------------------------------------------------
export const CHAR_SIMILARITY: Map<string, number> = new Map([
  // Digit / letter lookalikes
  ['0|o', 0.9],   // '0' / 'O' in NIST (+ auto-lowercase)
  ['1|7', 0.5],   // European-style 1s
  ['1|i', 0.9],   // in some fonts
  ['1|l', 1.0],   // identical in some fonts
  ['2|z', 0.2],
  ['3|e', 0.1],   // maybe?
  ['4|a', 0.1],   // in some fonts
  ['4|h', 0.1],   // in some fonts
  ['4|9', 0.2],   // in some fonts
  ['5|s', 0.2],
  ['6|b', 0.3],
  ['8|b', 0.3],   // '8' / 'B' in NIST (+ auto-lowercase)
  ['9|p', 0.1],   // maybe?  ('9','P' + auto-lowercase)

  // Letter confusables — all stored lowercase
  ['a|c', 0.2],
  ['a|d', 0.2],
  ['a|e', 0.2],
  ['a|h', 0.1],   // 'A'/'H' in NIST → auto-lowercase → 'a'/'h'
  ['a|o', 0.3],
  ['b|d', 0.2],
  ['b|e', 0.1],   // 'B'/'E' → 'b'/'e'
  ['b|h', 0.2],
  ['b|p', 0.2],   // 'B'/'P' → 'b'/'p'
  ['b|r', 0.2],   // 'B'/'R' → 'b'/'r'
  ['c|e', 0.2],
  ['c|g', 0.2],   // 'C'/'G' → 'c'/'g'
  ['c|o', 0.3],
  ['d|o', 0.2],
  ['e|f', 0.2],   // 'E'/'F' → 'e'/'f'
  ['e|o', 0.2],
  ['f|p', 0.1],   // 'F'/'P' → 'f'/'p'
  ['f|t', 0.3],
  ['g|o', 0.1],   // 'G'/'O' → 'g'/'o'
  ['g|q', 0.2],   // in some fonts
  ['h|k', 0.1],
  ['h|n', 0.4],
  ['i|j', 0.5],   // in some fonts
  ['i|l', 1.0],   // 'I'/'l' in NIST → auto-lowercase → 'i'/'l'; identical in some fonts
  ['k|x', 0.1],   // 'K'/'X' → 'k'/'x'
  ['m|n', 0.1],   // proportional fonts
  ['n|r', 0.1],
  ['o|p', 0.1],
  ['o|q', 0.4],   // 'O'/'Q' → 'o'/'q'
  ['p|q', 0.1],
  ['p|r', 0.2],   // 'P'/'R' → 'p'/'r'
  ['u|v', 0.1],
  ['v|w', 0.1],
  ['v|x', 0.1],
  ['v|y', 0.2],
  ['x|y', 0.1],
]);

// ---------------------------------------------------------------------------
// Digraph similarity table
// Maps two-character sequences to one-character (or two-character) sequences
// Score 0–1: 1 = visually indistinguishable
// ---------------------------------------------------------------------------
export const DIGRAPH_SIMILARITY: Map<string, number> = new Map([
  ['cl|d',  0.4],   // proportional fonts
  ['fl|f',  0.5],   // ligature fonts
  ['mn|nm', 0.5],   // proportional fonts — transposition variant
  ['nn|m',  0.5],   // proportional fonts
  ['aa|m',  0.2],   // 'AA'/'M' in NIST → auto-lowercase
  ['rn|m',  1.0],   // classic: "warns" read as "wams"
  ['vv|w',  0.8],   // 'VV'/'W' in NIST → auto-lowercase
]);

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

/** Single-character visual similarity score 0–1 */
export function getCharSimilarity(a: string, b: string): number {
  const aL = a.toLowerCase();
  const bL = b.toLowerCase();
  if (aL === bL) return 1;
  const key1 = `${aL}|${bL}`;
  const key2 = `${bL}|${aL}`;
  return CHAR_SIMILARITY.get(key1) ?? CHAR_SIMILARITY.get(key2) ?? 0;
}

/**
 * Digraph visual similarity score 0–1, or -1 if the pair is not in the table.
 * A return of -1 means: do not attempt this digraph substitution.
 */
export function getDigraphSimilarity(a: string, b: string): number {
  const aL = a.toLowerCase();
  const bL = b.toLowerCase();
  const key1 = `${aL}|${bL}`;
  const key2 = `${bL}|${aL}`;
  const v1 = DIGRAPH_SIMILARITY.get(key1);
  if (v1 !== undefined) return v1;
  const v2 = DIGRAPH_SIMILARITY.get(key2);
  if (v2 !== undefined) return v2;
  return -1; // not in table
}
