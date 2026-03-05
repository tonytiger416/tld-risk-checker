import type { CategoryResult, RiskFlag, SimilarTLD } from '../types';
import { EXISTING_TLDS_ARRAY } from '../data/existing-tlds';
import { getCharSimilarity, getDigraphSimilarity } from '../data/confusables';

// ---------------------------------------------------------------------------
// NIST Visual Similarity Algorithm
// Ported from Paul E. Black's Python implementation (NIST, May 2008)
// Source: https://hissa.nist.gov/~black/GTLD/ (strSimilarity.py v1.14)
// US Government work — public domain (17 USC 105)
//
// Key differences from plain Levenshtein:
//   1. Fractional substitution costs based on visual character similarity
//   2. Digraph substitutions (rn↔m, vv↔w, cl↔d, nn↔m, etc.)
//   3. Repetition-aware insert/delete costs
//   4. Damerau-style transposition with character-similarity weighting
//   5. NIST normalisation formula: (maxLen-D) / (maxLen + 3D + |lenDiff|·D)
// ---------------------------------------------------------------------------

/** Repetition-aware insert/delete cost (NIST formula) */
function repetitionCost(s: string, pos: number): number {
  const ch = s[pos].toLowerCase();
  let back = 0;
  let i = pos - 1;
  while (i >= 0 && s[i].toLowerCase() === ch) { back++; i--; }
  return Math.max(0, 1.7 - 0.4 * back);
}

/** Full NIST enhanced Levenshtein distance (returns a float) */
function nistLevenshtein(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;

  // Initialise DP table with repetition-aware boundary costs
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) dp[i][0] = dp[i - 1][0] + repetitionCost(s1, i - 1);
  for (let j = 1; j <= n; j++) dp[0][j] = dp[0][j - 1] + repetitionCost(s2, j - 1);

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const a = s1[i - 1];
      const b = s2[j - 1];

      // 1. Substitution / exact match
      const subCost = 1 - getCharSimilarity(a, b);
      let best = dp[i - 1][j - 1] + subCost;

      // 2. Delete from s1 / insert from s2 (repetition-aware)
      best = Math.min(best, dp[i - 1][j] + repetitionCost(s1, i - 1));
      best = Math.min(best, dp[i][j - 1] + repetitionCost(s2, j - 1));

      // 3. Transposition (Damerau) — cost = 1 - similarity of the two transposed chars
      if (i >= 2 && j >= 2) {
        const a1 = s1[i - 2], a2 = s1[i - 1];
        const b1 = s2[j - 2], b2 = s2[j - 1];
        if (a1.toLowerCase() === b2.toLowerCase() && a2.toLowerCase() === b1.toLowerCase()) {
          best = Math.min(best, dp[i - 2][j - 2] + (1 - getCharSimilarity(a1, a2)));
        }
      }

      // 4. Digraph 2→1: two chars from s1 replace one char in s2
      if (i >= 2) {
        const dg = s1[i - 2].toLowerCase() + s1[i - 1].toLowerCase();
        const dsim = getDigraphSimilarity(dg, s2[j - 1].toLowerCase());
        if (dsim >= 0) best = Math.min(best, dp[i - 2][j - 1] + (1 - dsim));
      }

      // 5. Digraph 1→2: one char from s1 replaces two chars in s2
      if (j >= 2) {
        const dg = s2[j - 2].toLowerCase() + s2[j - 1].toLowerCase();
        const dsim = getDigraphSimilarity(s1[i - 1].toLowerCase(), dg);
        if (dsim >= 0) best = Math.min(best, dp[i - 1][j - 2] + (1 - dsim));
      }

      // 6. Digraph 2→2: two chars from s1 replace two chars in s2
      if (i >= 2 && j >= 2) {
        const dg1 = s1[i - 2].toLowerCase() + s1[i - 1].toLowerCase();
        const dg2 = s2[j - 2].toLowerCase() + s2[j - 1].toLowerCase();
        const dsim = getDigraphSimilarity(dg1, dg2);
        if (dsim >= 0) best = Math.min(best, dp[i - 2][j - 2] + (1 - dsim));
      }

      dp[i][j] = best;
    }
  }
  return dp[m][n];
}

/**
 * NIST howConfusableAre() — returns 0–100 integer percentage.
 * Formula: (maxLen - D) / (maxLen + 3·D + |lenDiff|·D)
 * Penalises length differences more aggressively than plain (1 - D/maxLen).
 */
function visualSimilarity(a: string, b: string): number {
  const s1 = a.toLowerCase();
  const s2 = b.toLowerCase();
  if (s1 === s2) return 100;

  const D = nistLevenshtein(s1, s2);
  const maxLen = Math.max(s1.length, s2.length);
  const lenDiff = Math.abs(s1.length - s2.length);

  if (maxLen === 0) return 100;
  if (D === 0) return 100;

  const score = (maxLen - D) / (maxLen + 3 * D + lenDiff * D);
  return Math.round(Math.max(0, score) * 100);
}

// Soundex phonetic encoding
function soundex(s: string): string {
  if (!s) return '';
  const map: Record<string, string> = {
    b:'1', f:'1', p:'1', v:'1',
    c:'2', g:'2', j:'2', k:'2', q:'2', s:'2', x:'2', z:'2',
    d:'3', t:'3', l:'4', m:'5', n:'5', r:'6',
  };
  const first = s[0].toUpperCase();
  let code = first;
  let prev = map[s[0].toLowerCase()] ?? '0';
  for (let i = 1; i < s.length && code.length < 4; i++) {
    const c = s[i].toLowerCase();
    const d = map[c] ?? '0';
    if (d !== '0' && d !== prev) code += d;
    prev = d;
  }
  return code.padEnd(4, '0');
}

export function checkSimilarity(s: string): { result: CategoryResult; similarTLDs: SimilarTLD[] } {
  const flags: RiskFlag[] = [];
  const similar: SimilarTLD[] = [];
  const sCode = soundex(s);

  for (const tld of EXISTING_TLDS_ARRAY) {
    if (tld === s) continue;

    const vis = visualSimilarity(s, tld);
    if (vis >= 75) {
      similar.push({ tld, visualScore: vis, type: 'visual' });
      continue;
    }

    if (soundex(tld) === sCode) {
      similar.push({ tld, visualScore: vis, type: 'phonetic' });
      continue;
    }

    const isVariant = s === tld + 's' || s === tld + 'es' || tld === s + 's' || tld === s + 'es';
    if (isVariant) {
      similar.push({ tld, visualScore: visualSimilarity(s, tld), type: 'plural' });
    }
  }

  similar.sort((a, b) => b.visualScore - a.visualScore);
  const top = similar.slice(0, 5);
  const topVisual = top.filter(t => t.type === 'visual');
  const topScore = topVisual.length > 0 ? topVisual[0].visualScore : (top.length > 0 ? top[0].visualScore : 0);

  if (topVisual.some(t => t.visualScore >= 90)) {
    const t = topVisual.find(t => t.visualScore >= 90)!;
    flags.push({
      code: 'SIM-001',
      severity: 'HIGH',
      title: `Extremely similar to existing TLD ".${t.tld}" — ${t.visualScore}% visual match`,
      detail: `ICANN applies the NIST visual similarity algorithm during string review. ".${s}" scores ${t.visualScore}% against ".${t.tld}" using visually-weighted character comparison (accounting for confusables like rn/m, 0/O, 1/l). This level of similarity is likely to trigger a string confusion finding at Initial Evaluation.`,
      guidebookRef: 'AGB Section 7.3, pp. 236–247; NIST Visual Similarity Algorithm',
      recommendation: `Very high rejection risk at string review. Modify the string to significantly increase visual distinctiveness from ".${t.tld}".`,
    });
  } else if (topVisual.some(t => t.visualScore >= 75)) {
    const t = topVisual.find(t => t.visualScore >= 75)!;
    flags.push({
      code: 'SIM-002',
      severity: 'HIGH',
      title: `Visually similar to existing TLD ".${t.tld}" — ${t.visualScore}% match (at or above ICANN rejection threshold)`,
      detail: `".${s}" scores ${t.visualScore}% visual similarity against ".${t.tld}" under visually-weighted character comparison. ICANN's published threshold for string similarity objections is historically 70–75%. Strings at or above this level have been rejected at Initial Evaluation or flagged for expert panel review. This is a high application risk — not merely a caution.`,
      guidebookRef: 'AGB Section 7.3, pp. 236–247; NIST Visual Similarity Algorithm',
      recommendation: `Test immediately against ICANN's official NIST string similarity tool before investing further. At ${t.visualScore}% similarity to an existing TLD, rejection at Initial Evaluation is a realistic outcome. Modify the string or prepare a strong distinctiveness argument.`,
    });
  }

  const phoneticMatch = top.find(t => t.type === 'phonetic');
  if (phoneticMatch) {
    flags.push({
      code: 'SIM-003',
      severity: 'LOW',
      title: `Phonetically similar to ".${phoneticMatch.tld}"`,
      detail: `".${s}" sounds similar to ".${phoneticMatch.tld}" when spoken aloud. Phonetic similarity is a secondary check in ICANN's string evaluation.`,
      guidebookRef: 'AGB Section 7.3, pp. 236–247',
      recommendation: 'Consider how the string sounds in multiple languages. Verify no consumer confusion risk with the similar TLD.',
    });
  }

  const pluralMatch = top.find(t => t.type === 'plural');
  if (pluralMatch) {
    flags.push({
      code: 'SIM-004',
      severity: 'MEDIUM',
      title: `Singular/plural variant of existing TLD ".${pluralMatch.tld}"`,
      detail: `".${s}" is the singular or plural form of ".${pluralMatch.tld}". ICANN evaluators treat singular/plural relationships as string similarity.`,
      guidebookRef: 'AGB Section 7.3, pp. 236–247',
      recommendation: `Assess whether the distinction from ".${pluralMatch.tld}" is commercially justified and whether registrants would be confused.`,
    });
  }

  const score = topScore >= 90 ? 92   // SIM-001: extreme — near-certain rejection
    : topScore >= 75 ? 82             // SIM-002: at/above ICANN published threshold → HIGH
    : topScore >= 60 ? 45             // below threshold but notable → MEDIUM
    : topScore >= 50 ? 20             // mild similarity → LOW
    : 0;

  return {
    result: {
      category: 'STRING_SIMILARITY',
      level: score >= 80 ? 'HIGH' : score >= 40 ? 'MEDIUM' : score > 0 ? 'LOW' : 'CLEAR',
      score,
      flags,
      summary: top.length === 0
        ? 'No visually or phonetically similar existing TLDs found.'
        : `Most similar: ".${top[0].tld}" (${top[0].visualScore}% — ${top[0].type}).`,
    },
    similarTLDs: top,
  };
}
