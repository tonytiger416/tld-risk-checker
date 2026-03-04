import type { CategoryResult, RiskFlag } from '../types';
import { IGO_ACRONYMS, IGO_FULL_NAMES } from '../data/igo';

export function checkIGO(s: string): CategoryResult {
  const flags: RiskFlag[] = [];

  // 1. Exact acronym match
  if (IGO_ACRONYMS.has(s)) {
    flags.push({
      code: 'IGO-001',
      severity: 'HIGH',
      title: `".${s.toUpperCase()}" is a protected IGO acronym`,
      detail: `"${s.toUpperCase()}" is a registered acronym of an Intergovernmental Organization (IGO) protected under ICANN policy. ICANN's AGB explicitly protects IGO names and acronyms from use as TLDs. Any application would face an objection from the IGO and almost certainly result in rejection.`,
      guidebookRef: 'AGB Section 4.1.2, pp. 193–196; ICANN IGO-INGO Protections Policy',
      recommendation: `Do not apply for this string. "${s.toUpperCase()}" is protected IGO intellectual property. This is a hard blocker — not a manageable risk.`,
    });
  }

  // 2. Full IGO name match
  if (IGO_FULL_NAMES.has(s)) {
    flags.push({
      code: 'IGO-002',
      severity: 'HIGH',
      title: `".${s}" matches the name of a protected Intergovernmental Organization`,
      detail: `"${s}" corresponds to the name of an IGO protected under ICANN's mandatory IGO protections. This is not a discretionary risk — ICANN policy requires rejection of applications for protected IGO names.`,
      guidebookRef: 'AGB Section 4.1.2, pp. 193–196; ICANN IGO-INGO Protections Policy',
      recommendation: `Do not apply for this string. ICANN's IGO protections are mandatory, not subject to appeal or negotiation.`,
    });
  }

  // 3. Check if string strongly resembles an IGO acronym (common misspellings/expansions)
  if (!IGO_ACRONYMS.has(s) && !IGO_FULL_NAMES.has(s)) {
    const knownExpansions: Record<string, string> = {
      'unitednations': 'UN',
      'who': 'WHO',
      'worldhealthorganization': 'WHO',
      'internationalmonetary': 'IMF',
      'worldtradeorganization': 'WTO',
      'northatlantic': 'NATO',
      'unitednation': 'UN',
      'olympics': 'IOC',
      'olympic': 'IOC',
    };
    const expansion = knownExpansions[s];
    if (expansion) {
      flags.push({
        code: 'IGO-003',
        severity: 'HIGH',
        title: `".${s}" is associated with the protected IGO "${expansion}"`,
        detail: `This string strongly corresponds to the protected Intergovernmental Organization "${expansion}". Even expanded forms of IGO names are protected under ICANN policy.`,
        guidebookRef: 'AGB Section 4.1.2, pp. 193–196',
        recommendation: `Do not apply. Even non-acronym forms of IGO names fall within ICANN's protection framework.`,
      });
    }
  }

  const score = flags.length > 0 ? 100 : 0;

  return {
    category: 'IGO_PROTECTED',
    level: score > 0 ? 'HIGH' : 'CLEAR',
    score,
    flags,
    summary: flags.length === 0
      ? 'No IGO/INGO name conflicts detected.'
      : `HARD BLOCKER: "${s.toUpperCase()}" is a protected Intergovernmental Organization name/acronym.`,
  };
}
