import type { CategoryResult, RiskFlag } from '../types';
import { WELL_KNOWN_BRANDS, SENSITIVE_STRINGS, STOCK_EXCHANGES } from '../data/brands';

// Brands that are also common English words — only flag on exact match, never as substring
// (e.g. "american" in "americanstores" is intentional; flagging "fundamental" for "fund" is not)
const GENERIC_WORD_BRANDS = new Set([
  'delta', 'united', 'american', 'british', 'universal', 'national',
  'first', 'one', 'next', 'new', 'direct', 'express', 'open', 'capital',
  'fox', 'life', 'green', 'gold', 'prime', 'star', 'target', 'champion',
]);

export function checkTrademark(s: string, appType: 'open' | 'brand' = 'open'): CategoryResult {
  const flags: RiskFlag[] = [];

  // 1. Exact brand match — always flag, regardless of app type
  if (WELL_KNOWN_BRANDS.has(s)) {
    if (appType === 'brand') {
      // For .brand applicants, this is expected — they ARE the brand
      flags.push({
        code: 'TM-BRAND',
        severity: 'LOW',
        title: `".${s}" matches a known brand — confirm you are the rights holder`,
        detail: `".${s}" corresponds to a well-known brand. As a .brand applicant you should be the rights holder or have explicit authorisation. If you are the brand owner, trademark risk is low. However, you must provide evidence of trademark ownership in your application.`,
        guidebookRef: 'AGB Section 4.2, pp. 196–199',
        recommendation: 'Include registered trademark certificates in your application. Ensure your TMCH records are up to date.',
      });
    } else {
      flags.push({
        code: 'TM-001',
        severity: 'HIGH',
        title: `".${s}" matches a well-known global brand`,
        detail: `".${s}" corresponds to a well-known brand that almost certainly holds registered trademarks in multiple jurisdictions. Applying for this string as an open TLD would very likely result in a Legal Rights Objection (LRO) filed by the rights holder.`,
        guidebookRef: 'AGB Section 3.5, pp. 124–126; AGB Section 4.2, pp. 196–199',
        recommendation: 'Do not apply for this string unless you are the rights holder or have explicit authorisation. A Legal Rights Objection from the brand owner would almost certainly succeed.',
      });
    }
  }

  // 2. Prefix brand match — string starts with a well-known brand (e.g. ".nikestore", ".googlecloud")
  // Only for brands that are NOT generic English words, and brand must be >= 4 chars
  if (!WELL_KNOWN_BRANDS.has(s) && appType === 'open') {
    for (const brand of WELL_KNOWN_BRANDS) {
      if (
        brand.length >= 4 &&
        !GENERIC_WORD_BRANDS.has(brand) &&
        s.startsWith(brand)
      ) {
        flags.push({
          code: 'TM-002',
          severity: 'MEDIUM',
          title: `".${s}" starts with the well-known brand "${brand}"`,
          detail: `The string begins with "${brand}", a well-known brand. Rights holders may file a Legal Rights Objection even for strings that are expansions of their trademark (e.g. ".nikestore", ".googlecloud").`,
          guidebookRef: 'AGB Section 3.5, pp. 124–126',
          recommendation: `Obtain explicit authorisation from the "${brand}" rights holder, or choose a string that does not begin with their trademark.`,
        });
        break;
      }
    }
  }

  // 3. Sensitive/offensive strings — EXACT MATCH ONLY (no false positives from substrings)
  for (const sensitive of SENSITIVE_STRINGS) {
    if (s === sensitive) {
      flags.push({
        code: 'TM-003',
        severity: 'HIGH',
        title: `".${s}" is likely to be considered offensive or contrary to public policy`,
        detail: `This string matches a term that may be considered offensive, harmful, or contrary to public morality standards under international law. It is at high risk of a Limited Public Interest (LPI) Objection.`,
        guidebookRef: 'AGB Section 3.5.2, pp. 115–120',
        recommendation: 'Do not apply for this string. LPI objections on public morality grounds are very difficult to overcome and ICANN evaluators are empowered to reject the application outright.',
      });
      break;
    }
  }

  // 4. Stock exchange / financial market identifier
  if (STOCK_EXCHANGES.has(s)) {
    flags.push({
      code: 'TM-004',
      severity: 'HIGH',
      title: `".${s}" is a recognised stock exchange or financial market identifier`,
      detail: `".${s}" is an identifier for a major stock exchange or financial market. These entities hold strong trademark registrations and operate under heavy regulatory oversight. Applying for this string would very likely result in a Legal Rights Objection from the exchange operator and potential regulatory scrutiny from securities regulators.`,
      guidebookRef: 'AGB Section 3.5, pp. 124–126; AGB Section 4.2, pp. 196–199',
      recommendation: 'Do not apply for this string unless you are the exchange operator or have an explicit licensing agreement. The LRO risk is very high and securities regulators may also object.',
    });
  }

  // 5. TMCH reminder — always shown when no other flags (regardless of app type)
  const hasMeaningfulFlags = flags.some(f => f.severity === 'HIGH' || f.severity === 'MEDIUM');
  if (!hasMeaningfulFlags) {
    flags.push({
      code: 'TM-INFO',
      severity: 'LOW',
      title: 'Trademark Clearinghouse (TMCH) obligations apply to all new gTLDs',
      detail: `All new gTLD registries must implement a Sunrise period using the TMCH database. ${appType === 'brand' ? 'As a .brand applicant, ensure your own trademark records in the TMCH are current.' : 'This allows trademark holders to register their marks before general registration opens.'}`,
      guidebookRef: 'AGB Section 4.2, pp. 196–199',
      recommendation: 'Important: This tool cannot query the live TMCH database. A professional trademark search across all relevant jurisdictions is strongly recommended before filing.',
    });
  }

  const highFlags = flags.filter(f => f.severity === 'HIGH');
  const medFlags = flags.filter(f => f.severity === 'MEDIUM');
  const score = highFlags.length > 0 ? 90 : medFlags.length > 0 ? 50 : 0;

  return {
    category: 'TRADEMARK_RIGHTS',
    level: score >= 80 ? 'HIGH' : score >= 40 ? 'MEDIUM' : score > 0 ? 'LOW' : 'CLEAR',
    score,
    flags,
    summary: highFlags.length > 0
      ? 'High trademark conflict risk — Legal Rights Objection very likely.'
      : medFlags.length > 0
      ? 'Possible trademark conflict — legal review recommended.'
      : 'No obvious trademark conflicts. Professional trademark search still required.',
  };
}
