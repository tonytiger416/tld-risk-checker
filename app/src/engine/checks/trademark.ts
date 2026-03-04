import type { CategoryResult, RiskFlag } from '../types';
import { WELL_KNOWN_BRANDS, SENSITIVE_STRINGS } from '../data/brands';

export function checkTrademark(s: string): CategoryResult {
  const flags: RiskFlag[] = [];

  // 1. Exact brand match
  if (WELL_KNOWN_BRANDS.has(s)) {
    flags.push({
      code: 'TM-001',
      severity: 'HIGH',
      title: `".${s}" matches a well-known global brand`,
      detail: `".${s}" corresponds to a well-known brand that almost certainly holds registered trademarks. Applying for this string would very likely result in a Legal Rights Objection (LRO) filed by the rights holder.`,
      guidebookRef: 'AGB Section 3.5, pp. 124–126; AGB Section 4.2, pp. 196–199',
      recommendation: 'Do not apply for this string unless you are the rights holder or have explicit authorisation from them.',
    });
  }

  // 2. Partial brand match (string contains a well-known brand)
  if (!WELL_KNOWN_BRANDS.has(s)) {
    for (const brand of WELL_KNOWN_BRANDS) {
      if (s.includes(brand) && brand.length >= 4) {
        flags.push({
          code: 'TM-002',
          severity: 'MEDIUM',
          title: `".${s}" contains the well-known brand name "${brand}"`,
          detail: `The string includes "${brand}", which is a well-known brand. Rights holders may file a Legal Rights Objection even for strings that merely contain their trademark.`,
          guidebookRef: 'AGB Section 3.5, pp. 124–126',
          recommendation: `Assess whether "${brand}" rights holders are likely to object. Consider seeking legal advice.`,
        });
        break; // Flag once
      }
    }
  }

  // 3. Sensitive/offensive strings (Limited Public Interest Objection risk)
  for (const sensitive of SENSITIVE_STRINGS) {
    if (s === sensitive || s.includes(sensitive)) {
      flags.push({
        code: 'TM-003',
        severity: 'HIGH',
        title: `".${s}" may be considered offensive or contrary to public policy`,
        detail: `This string matches or contains a term that may be considered offensive, harmful, or contrary to public morality standards. It is at high risk of a Limited Public Interest (LPI) Objection.`,
        guidebookRef: 'AGB Section 3.5.2, pp. 115–120',
        recommendation: 'Reconsider this string. LPI objections on these grounds are difficult to overcome.',
      });
      break;
    }
  }

  // 4. General TMCH reminder (informational for all strings)
  if (flags.filter(f => f.severity !== 'CLEAR').length === 0) {
    flags.push({
      code: 'TM-INFO',
      severity: 'LOW',
      title: 'Trademark Clearinghouse (TMCH) obligations apply to all new gTLDs',
      detail: 'All new gTLD registries must implement a Sunrise period using the TMCH database, allowing trademark holders to register their marks before general registration opens.',
      guidebookRef: 'AGB Section 4.2, pp. 196–199',
      recommendation: 'Budget for TMCH integration costs and Sunrise period operations. Note: This tool cannot query the live TMCH database — a professional trademark search is strongly recommended.',
    });
  }

  const highFlags = flags.filter(f => f.severity === 'HIGH');
  const medFlags = flags.filter(f => f.severity === 'MEDIUM');
  const score = highFlags.length > 0 ? 90 : medFlags.length > 0 ? 55 : flags.some(f => f.severity === 'LOW') ? 10 : 0;

  return {
    category: 'TRADEMARK_RIGHTS',
    level: score >= 80 ? 'HIGH' : score >= 40 ? 'MEDIUM' : score > 0 ? 'LOW' : 'CLEAR',
    score,
    flags: flags.filter(f => f.code !== 'TM-INFO' || score < 20),
    summary: highFlags.length > 0
      ? 'High trademark conflict risk — Legal Rights Objection very likely.'
      : medFlags.length > 0
      ? 'Possible trademark conflict — legal review recommended.'
      : 'No obvious trademark conflicts detected. Professional trademark search still recommended.',
  };
}
