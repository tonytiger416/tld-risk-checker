import type { CategoryResult, RiskFlag } from '../types';
import { HIGHLY_REGULATED, REGULATED_SECTOR_KEYWORDS } from '../data/regulated';

export function checkRegulated(s: string): CategoryResult {
  const flags: RiskFlag[] = [];

  // 1. Exact match to highly regulated string
  if (HIGHLY_REGULATED.has(s)) {
    flags.push({
      code: 'REG-001',
      severity: 'HIGH',
      title: `".${s}" is classified as a highly regulated TLD string`,
      detail: `This string falls into a category that ICANN identifies as requiring enhanced registry obligations and consumer protection measures. Registry operators must implement additional safeguards beyond standard requirements.`,
      guidebookRef: 'AGB Section 5.5, pp. 219–223',
      recommendation: 'Prepare detailed compliance documentation for your target sector. Review the specific registry operating requirements for this category.',
    });
  }

  // 2. Sector keyword match
  if (!HIGHLY_REGULATED.has(s)) {
    for (const { sector, pattern, note } of REGULATED_SECTOR_KEYWORDS) {
      if (pattern.test(s)) {
        flags.push({
          code: 'REG-002',
          severity: 'MEDIUM',
          title: `".${s}" appears to be in the regulated "${sector}" sector`,
          detail: `${note}. While this string may not be on the explicit highly-regulated list, its association with a regulated sector may trigger additional scrutiny and compliance requirements during evaluation.`,
          guidebookRef: 'AGB Section 5.5, pp. 219–223',
          recommendation: `Demonstrate regulatory awareness and readiness for the ${sector} sector in your application. Consider proactively documenting your compliance framework.`,
        });
        break;
      }
    }
  }

  const highFlags = flags.filter(f => f.severity === 'HIGH');
  const medFlags = flags.filter(f => f.severity === 'MEDIUM');
  const score = highFlags.length > 0 ? 85 : medFlags.length > 0 ? 45 : 0;

  return {
    category: 'REGULATED_SECTORS',
    level: score >= 80 ? 'HIGH' : score >= 40 ? 'MEDIUM' : score > 0 ? 'LOW' : 'CLEAR',
    score,
    flags,
    summary: flags.length === 0
      ? 'No regulated sector concerns identified.'
      : `Regulated sector concern: ${flags[0].title}`,
  };
}
