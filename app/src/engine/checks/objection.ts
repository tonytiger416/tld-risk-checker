import type { CategoryResult, RiskFlag } from '../types';

// Community strings — exact match only (identifiable communities)
const COMMUNITY_STRINGS = new Set([
  'catholic', 'islam', 'muslim', 'christian', 'jewish',
  'hindu', 'buddhist', 'sikh', 'protestant', 'orthodox',
  'anglican', 'evangelical', 'pentecostal', 'sunni', 'shia',
  'lgbt', 'lgbtq', 'lgbtqia', 'gay', 'lesbian', 'trans', 'queer',
  'indigenous', 'aboriginal', 'tribal', 'maori', 'inuit',
  'vegan', 'vegetarian', 'halal', 'kosher',
  'atheist', 'agnostic', 'pagan', 'wicca',
]);

// GAC-sensitive strings — exact match (anchored patterns)
const GAC_SENSITIVE_PATTERNS = [
  { pattern: /^(gov|government|federal|state|parliament|congress|senate|council|ministry|minister|municipal|prefecture)$/, reason: 'Implies governmental authority' },
  { pattern: /^(police|army|military|navy|marines|airforce|airforce|defense|defence|gendarmerie)$/, reason: 'Implies security or defence functions' },
  { pattern: /^(tax|customs|immigration|visa|passport|embassy|consulate|revenue|treasury)$/, reason: 'Implies governmental administrative function' },
  { pattern: /^(ngo|charity|nonprofit|notforprofit|humanitarian|aid|relief)$/, reason: 'May attract scrutiny regarding eligibility requirements' },
  { pattern: /^(nuclear|atomic|radioactive|weapons|arms|ammunition|explosives)$/, reason: 'Sensitive sector likely to attract GAC attention' },
];

// LPI terms — exact match only (not substring, to avoid "bombay", "skilled", etc.)
const LPI_EXACT_TERMS = new Set([
  'kill', 'murder', 'terror', 'terrorism', 'terrorist', 'bomb',
  'hate', 'nazi', 'fascist', 'fascism', 'racist', 'racism',
  'scam', 'fraud', 'phish', 'phishing', 'spam',
  'porn', 'porno', 'sex', 'xxx', 'adult', 'nude', 'erotic', 'fetish',
  'drug', 'drugs', 'cocaine', 'heroin', 'meth', 'fentanyl', 'crack',
  'gun', 'guns', 'weapon', 'weapons', 'pistol', 'rifle',
  'jihad', 'isis', 'alqaeda',
  'rape', 'abuse', 'trafficking',
]);

export function checkObjection(s: string, appType: 'open' | 'brand' = 'open'): CategoryResult {
  const flags: RiskFlag[] = [];

  // 1. Community objection risk — exact match
  if (COMMUNITY_STRINGS.has(s)) {
    flags.push({
      code: 'OBJ-001',
      severity: 'HIGH',
      title: `".${s}" may attract a Community Objection`,
      detail: `This string represents an identifiable community. A Community Objection may be filed by an established institution or association representing that community if they believe the applicant does not legitimately represent or serve the community. The objection panel can recommend rejection.`,
      guidebookRef: 'AGB Section 3.5.4, pp. 120–124',
      recommendation: `${appType === 'brand' ? 'As a .brand applicant, ensure you have documented community ties or endorsement.' : 'Demonstrate clear ties to or endorsement from the named community. Without community support, this objection is very difficult to defend.'}`,
    });
  }

  // 2. GAC Early Warning risk — exact match
  for (const { pattern, reason } of GAC_SENSITIVE_PATTERNS) {
    if (pattern.test(s)) {
      flags.push({
        code: 'OBJ-002',
        severity: 'HIGH',
        title: `".${s}" is very likely to receive a GAC Early Warning`,
        detail: `${reason}. The Government Advisory Committee (GAC) issues Early Warnings for strings that governments believe raise public policy concerns. While a GAC Early Warning does not automatically reject an application, it triggers a mandatory Board consultation. GAC Advice that applications not proceed is exceptionally difficult to overcome.`,
        guidebookRef: 'AGB Section 3.6, pp. 126–129',
        recommendation: 'Proactively engage with relevant governments before the application window. A satisfactory response to a GAC Early Warning requires substantial government support documentation.',
      });
      break;
    }
  }

  // 3. Limited Public Interest objection — exact match only (no false positives)
  if (LPI_EXACT_TERMS.has(s)) {
    flags.push({
      code: 'OBJ-003',
      severity: 'HIGH',
      title: `".${s}" risks a Limited Public Interest (LPI) Objection`,
      detail: `This string is likely to be considered contrary to generally accepted legal norms of morality and public order. An LPI Objection can be filed by any ICANN-accredited dispute resolution provider. The standard is whether the string is "clearly contrary to widely accepted legal norms of morality and public order" — a deliberately broad standard.`,
      guidebookRef: 'AGB Section 3.5.2, pp. 115–120',
      recommendation: 'Do not apply for this string. An LPI objection on public morality grounds is extremely difficult to defend, and ICANN evaluators may reject the application before it reaches the objection stage.',
    });
  }

  // 4. Plurals and derivatives of community/sensitive strings
  if (!COMMUNITY_STRINGS.has(s) && !LPI_EXACT_TERMS.has(s)) {
    for (const term of COMMUNITY_STRINGS) {
      if (s === term + 's' || s === term + 'ity' || s === term + 'ism') {
        flags.push({
          code: 'OBJ-004',
          severity: 'MEDIUM',
          title: `".${s}" is a derivative of the community string ".${term}"`,
          detail: `This string is a close derivative of an identifiable community name. Objection panels may treat derivatives of community strings similarly to the base string.`,
          guidebookRef: 'AGB Section 3.5.4, pp. 120–124',
          recommendation: `Assess community support for this string. The risk of Community Objection is lower than for "${term}" itself, but not negligible.`,
        });
        break;
      }
    }
  }

  const highFlags = flags.filter(f => f.severity === 'HIGH');
  const medFlags = flags.filter(f => f.severity === 'MEDIUM');
  const score = highFlags.length > 0 ? 85 : medFlags.length > 0 ? 45 : 0;

  return {
    category: 'OBJECTION_GROUNDS',
    level: score >= 80 ? 'HIGH' : score >= 40 ? 'MEDIUM' : score > 0 ? 'LOW' : 'CLEAR',
    score,
    flags,
    summary: flags.length === 0
      ? 'No objection risk factors identified.'
      : `${flags.length} objection risk factor(s) identified.`,
  };
}
