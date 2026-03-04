import type { CategoryResult, RiskFlag } from '../types';
import { REGULATED_SECTOR_KEYWORDS } from '../data/regulated';

// Community strings — strings that represent identifiable communities
const COMMUNITY_STRINGS = new Set([
  'catholic', 'islam', 'muslim', 'christian', 'jewish', 'jewish',
  'hindu', 'buddhist', 'sikh', 'protestant', 'orthodox',
  'lgbt', 'lgbtq', 'gay', 'lesbian', 'trans',
  'indigenous', 'aboriginal', 'tribal',
  'vegan', 'vegetarian',
  'halal', 'kosher',
]);

// GAC-sensitive strings (attract Government Advisory Committee attention)
const GAC_SENSITIVE_PATTERNS = [
  { pattern: /^(gov|government|federal|state|parliament|congress|senate|council|ministry|minister)$/i, reason: 'Implies governmental authority' },
  { pattern: /^(police|army|military|navy|airforce|defense|defence)$/i, reason: 'Implies security or defence functions' },
  { pattern: /^(tax|customs|immigration|visa|passport|embassy|consulate)$/i, reason: 'Implies governmental administrative function' },
  { pattern: /^(ngo|charity|nonprofit|foundation|humanitarian|aid)$/i, reason: 'May attract scrutiny regarding eligibility' },
];

export function checkObjection(s: string): CategoryResult {
  const flags: RiskFlag[] = [];

  // 1. Community objection risk
  if (COMMUNITY_STRINGS.has(s)) {
    flags.push({
      code: 'OBJ-001',
      severity: 'HIGH',
      title: `".${s}" may attract a Community Objection`,
      detail: `This string represents an identifiable community. Under ICANN's objection process, a community or organization representing that community may file a Community Objection if they believe the applicant does not represent or serve the community's interests.`,
      guidebookRef: 'AGB Section 3.5.4, pp. 120–124',
      recommendation: 'Demonstrate clear ties to or endorsement from the named community. Consider whether your registry can genuinely serve this community.',
    });
  }

  // 2. GAC Early Warning risk
  for (const { pattern, reason } of GAC_SENSITIVE_PATTERNS) {
    if (pattern.test(s)) {
      flags.push({
        code: 'OBJ-002',
        severity: 'HIGH',
        title: `".${s}" is likely to receive a GAC Early Warning`,
        detail: `${reason}. The Government Advisory Committee (GAC) issues Early Warnings for strings that governments believe may have public policy implications. GAC Early Warnings do not automatically block an application but significantly complicate the process.`,
        guidebookRef: 'AGB Section 3.6, pp. 126–129',
        recommendation: 'Engage with relevant governments early. A GAC Early Warning without a satisfactory response may lead to GAC Advice that the ICANN Board must consider.',
      });
      break;
    }
  }

  // 3. Regulated sector — objection/compliance risk
  for (const { sector, pattern, note } of REGULATED_SECTOR_KEYWORDS) {
    if (pattern.test(s)) {
      flags.push({
        code: 'OBJ-003',
        severity: 'MEDIUM',
        title: `".${s}" is in a regulated sector (${sector}) — potential objection risk`,
        detail: `${note}. Strings in regulated sectors may attract objections from industry bodies, governments, or consumer groups.`,
        guidebookRef: 'AGB Section 5.5, pp. 219–223',
        recommendation: `Prepare documentation showing compliance with ${sector} sector regulations in your operating jurisdictions.`,
      });
      break;
    }
  }

  // 4. Limited Public Interest objection (morality/public order)
  const lpiTerms = ['kill', 'murder', 'terror', 'bomb', 'hate', 'nazi', 'racist', 'fascist', 'scam', 'fraud'];
  for (const term of lpiTerms) {
    if (s.includes(term)) {
      flags.push({
        code: 'OBJ-004',
        severity: 'HIGH',
        title: `".${s}" risks a Limited Public Interest (LPI) Objection`,
        detail: `This string may be considered contrary to generally accepted legal norms of morality and public order under international law. An LPI objection can be filed by any ICANN-accredited body.`,
        guidebookRef: 'AGB Section 3.5.2, pp. 115–120',
        recommendation: 'Reconsider this string. An LPI objection on public morality grounds is very difficult to successfully defend.',
      });
      break;
    }
  }

  const highFlags = flags.filter(f => f.severity === 'HIGH');
  const medFlags = flags.filter(f => f.severity === 'MEDIUM');
  const score = highFlags.length > 0 ? 85 : medFlags.length > 0 ? 50 : 0;

  return {
    category: 'OBJECTION_GROUNDS',
    level: score >= 80 ? 'HIGH' : score >= 40 ? 'MEDIUM' : score > 0 ? 'LOW' : 'CLEAR',
    score,
    flags,
    summary: flags.length === 0
      ? 'No specific objection risk factors identified.'
      : `${flags.length} objection risk factor(s) identified.`,
  };
}
