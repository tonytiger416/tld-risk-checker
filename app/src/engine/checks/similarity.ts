import type { CategoryResult, RiskFlag, SimilarTLD } from '../types';
import { EXISTING_TLDS_ARRAY } from '../data/existing-tlds';
import { getCharSimilarity } from '../data/confusables';

// Visually-weighted Levenshtein distance
// Uses confusables data to reduce substitution cost for visually similar characters
// e.g. substituting 'rn' for 'm' costs much less than substituting 'r' for 'z'
function weightedLevenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        const charSim = getCharSimilarity(a[i - 1], b[j - 1]);
        const substitutionCost = 1 - charSim;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + substitutionCost
        );
      }
    }
  }
  return dp[m][n];
}

// Normalize common visual confusable digraphs before comparison
function normalizeConfusables(s: string): string {
  return s
    .replace(/rn/g, 'm')
    .replace(/vv/g, 'w')
    .replace(/cl/g, 'd')
    .replace(/0/g, 'o')
    .replace(/1/g, 'l')
    .replace(/5/g, 's');
}

// Visual similarity score 0–100
function visualSimilarity(a: string, b: string): number {
  if (a === b) return 100;
  const dist = weightedLevenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  const rawScore = Math.round((1 - dist / maxLen) * 100);

  // Also check after normalising confusables — catches rn/m, 0/O, 1/l etc.
  const aNorm = normalizeConfusables(a);
  const bNorm = normalizeConfusables(b);
  const normDist = weightedLevenshtein(aNorm, bNorm);
  const normScore = Math.round((1 - normDist / Math.max(aNorm.length, bNorm.length)) * 100);

  return Math.max(rawScore, normScore);
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
      severity: 'MEDIUM',
      title: `Visually similar to existing TLD ".${t.tld}" — ${t.visualScore}% match`,
      detail: `".${s}" has notable visual similarity to ".${t.tld}" under visually-weighted comparison. While this may not automatically fail string review, it warrants verification against ICANN's official NIST similarity tool before filing.`,
      guidebookRef: 'AGB Section 7.3, pp. 236–247',
      recommendation: `Test against ICANN's official string similarity checker. If the NIST score crosses the threshold, this will be flagged at Initial Evaluation.`,
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

  const score = topScore >= 90 ? 92
    : topScore >= 80 ? 75
    : topScore >= 70 ? 55
    : topScore >= 60 ? 35
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
