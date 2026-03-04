import type { CategoryResult, RiskFlag, SimilarTLD } from '../types';
import { EXISTING_TLDS_ARRAY } from '../data/existing-tlds';

// Levenshtein distance (standard)
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// Visual similarity score 0–100 between two strings
function visualSimilarity(a: string, b: string): number {
  if (a === b) return 100;
  const dist = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  return Math.round((1 - dist / maxLen) * 100);
}

// Simple Soundex phonetic encoding
function soundex(s: string): string {
  if (!s) return '';
  const map: Record<string, string> = {
    b:'1', f:'1', p:'1', v:'1',
    c:'2', g:'2', j:'2', k:'2', q:'2', s:'2', x:'2', z:'2',
    d:'3', t:'3',
    l:'4',
    m:'5', n:'5',
    r:'6',
  };
  const first = s[0].toUpperCase();
  let code = first;
  let prev = map[s[0].toLowerCase()] ?? '0';
  for (let i = 1; i < s.length && code.length < 4; i++) {
    const c = s[i].toLowerCase();
    const d = map[c] ?? '0';
    if (d !== '0' && d !== prev) { code += d; }
    prev = d;
  }
  return code.padEnd(4, '0');
}

export function checkSimilarity(s: string): { result: CategoryResult; similarTLDs: SimilarTLD[] } {
  const flags: RiskFlag[] = [];
  const similar: SimilarTLD[] = [];

  const sCode = soundex(s);

  // Check against all existing TLDs
  for (const tld of EXISTING_TLDS_ARRAY) {
    if (tld === s) continue; // exact match handled by reserved check

    // Visual similarity
    const vis = visualSimilarity(s, tld);
    if (vis >= 80) {
      similar.push({ tld, visualScore: vis, type: 'visual' });
    }

    // Phonetic similarity
    if (soundex(tld) === sCode && vis < 80) {
      similar.push({ tld, visualScore: vis, type: 'phonetic' });
    }
  }

  // Check singular/plural variants
  for (const tld of EXISTING_TLDS_ARRAY) {
    if (tld === s) continue;
    const isPlural = s === tld + 's' || s === tld + 'es' || tld === s + 's' || tld === s + 'es';
    if (isPlural && !similar.find(x => x.tld === tld)) {
      similar.push({ tld, visualScore: visualSimilarity(s, tld), type: 'plural' });
    }
  }

  // Sort by score desc, take top 5
  similar.sort((a, b) => b.visualScore - a.visualScore);
  const top = similar.slice(0, 5);

  const topScore = top.length > 0 ? top[0].visualScore : 0;

  if (top.some(t => t.visualScore >= 90)) {
    const t = top.find(t => t.visualScore >= 90)!;
    flags.push({
      code: 'SIM-001',
      severity: 'HIGH',
      title: `Extremely similar to existing TLD ".${t.tld}" (${t.visualScore}% visual match)`,
      detail: `The string ".${s}" is visually very close to the existing TLD ".${t.tld}". ICANN evaluators apply the NIST visual similarity algorithm; a score this high is likely to trigger a String Confusion Objection.`,
      guidebookRef: 'AGB Section 7.3, pp. 236–247',
      recommendation: `Consider modifying the string to increase distinctiveness from ".${t.tld}".`,
    });
  } else if (top.some(t => t.visualScore >= 75)) {
    const t = top.find(t => t.visualScore >= 75)!;
    flags.push({
      code: 'SIM-002',
      severity: 'MEDIUM',
      title: `Visually similar to existing TLD ".${t.tld}" (${t.visualScore}% match)`,
      detail: `".${s}" has moderate visual similarity to ".${t.tld}". This may not automatically trigger confusion objection but could attract scrutiny from ICANN evaluators.`,
      guidebookRef: 'AGB Section 7.3, pp. 236–247',
      recommendation: `Review the NIST string similarity criteria and assess whether your string would be considered confusingly similar.`,
    });
  }

  // Phonetic flag
  const phoneticMatch = top.find(t => t.type === 'phonetic');
  if (phoneticMatch) {
    flags.push({
      code: 'SIM-003',
      severity: 'LOW',
      title: `Phonetically similar to ".${phoneticMatch.tld}"`,
      detail: `".${s}" sounds similar to existing TLD ".${phoneticMatch.tld}" when spoken aloud. This is a secondary similarity check under ICANN evaluation.`,
      guidebookRef: 'AGB Section 7.3, pp. 236–247',
      recommendation: 'Evaluate phonetic distinctiveness, especially for marketing and consumer clarity.',
    });
  }

  // Plural/singular flag
  const pluralMatch = top.find(t => t.type === 'plural');
  if (pluralMatch) {
    flags.push({
      code: 'SIM-004',
      severity: 'MEDIUM',
      title: `Singular/plural variant of existing TLD ".${pluralMatch.tld}"`,
      detail: `".${s}" appears to be a singular or plural form of ".${pluralMatch.tld}". ICANN evaluators consider such relationships when assessing string confusion.`,
      guidebookRef: 'AGB Section 7.3, pp. 236–247',
      recommendation: `Consider whether the plural/singular distinction is commercially meaningful enough to justify potential confusion risk.`,
    });
  }

  const score = topScore >= 90 ? 90
    : topScore >= 75 ? 65
    : topScore >= 60 ? 40
    : topScore >= 50 ? 20
    : 0;

  return {
    result: {
      category: 'STRING_SIMILARITY',
      level: score >= 80 ? 'HIGH' : score >= 40 ? 'MEDIUM' : score > 0 ? 'LOW' : 'CLEAR',
      score,
      flags,
      summary: top.length === 0
        ? 'No visually or phonetically similar existing TLDs found.'
        : `Most similar existing TLD: ".${top[0].tld}" (${top[0].visualScore}% similarity).`,
    },
    similarTLDs: top,
  };
}
