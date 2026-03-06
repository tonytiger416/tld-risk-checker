import type { CategoryResult, RiskFlag } from '../types';

// Strings where an organized, established community body exists and a
// competing applicant could pursue Community Priority Evaluation (CPE)
// under AGB §7.2. A CPE score ≥14/16 grants priority over ALL generic
// applicants — bypassing auction entirely regardless of your resources.
const CPE_HIGH_RISK = new Set([
  // Established industry/trade associations with global presence
  'music', 'hotel', 'hotels', 'travel', 'sport', 'sports', 'film',
  'radio', 'press', 'news', 'photo', 'photography', 'book', 'books',
  // Environmental organisations
  'eco', 'green', 'organic', 'bio',
  // LGBTQ+ community
  'gay', 'lgbt', 'lgbtq',
  // Arts & culture with organised bodies
  'art', 'arts', 'design', 'fashion', 'yoga',
  // Hospitality & food trade associations
  'wine', 'beer', 'food', 'restaurant', 'restaurants',
  // Education sector bodies
  'school', 'education', 'university', 'college', 'academy',
  // Religious community applications
  'church', 'catholic', 'islam', 'jewish', 'christian', 'hindu', 'buddhist',
  // Financial sector associations (when applied by trade bodies)
  'bank', 'insurance',
]);

// Strings that attracted specific GAC Early Warnings in 2012 or are
// in categories that GAC communiqués have identified as sensitive.
// GAC advice to the ICANN Board is extremely difficult to overcome.
// NOTE: strings already covered by regulated.ts are excluded here.
const GAC_EARLY_WARNING_RISK = new Set([
  // Electoral / governmental
  'vote', 'voting', 'election', 'elections', 'parliament', 'government',
  'gov', 'democracy', 'republican', 'democrat',
  // Defence & security
  'military', 'army', 'navy', 'airforce', 'police', 'security',
  'intelligence', 'nuclear', 'weapons', 'arms', 'gun', 'guns', 'ammo',
  // Controlled substances
  'drug', 'drugs', 'cannabis', 'marijuana', 'weed', 'cocaine', 'heroin',
  // Gambling (regulated separately in most jurisdictions)
  'gambling', 'casino', 'casino', 'bet', 'betting', 'poker', 'lottery',
  // Adult content (not already a registered TLD)
  'porn', 'sex', 'adult', 'escort', 'dating',
  // Terrorism / extremism
  'terror', 'terrorist', 'jihad',
]);

export function checkEvaluation(s: string): CategoryResult {
  const flags: RiskFlag[] = [];

  // ---- Community Priority Evaluation (CPE) risk -------------------------
  if (CPE_HIGH_RISK.has(s)) {
    flags.push({
      code: 'EVAL-CPE',
      severity: 'HIGH',
      title: `A community applicant could claim priority over ".${s}" via CPE`,
      detail: `An organised community body (trade association, NGO, or industry group) could apply for ".${s}" as a community applicant under AGB §7.2 and invoke Community Priority Evaluation (CPE). If they score ≥14/16 on the CPE criteria, they receive priority delegation over all generic applicants — eliminating auction and bypassing your financial advantage entirely. This has happened: in the 2012 round, community applications like .organic and .gay advanced under CPE processes. For ".${s}", established international organisations exist that could credibly claim community designation.`,
      guidebookRef: 'AGB §7.2, pp. 229–236 — Community Priority Evaluation',
      recommendation: `Research whether any international body (trade association, NGO, or standards organisation) is planning a community application for ".${s}". If so, either differentiate your application strategy significantly or consider whether you could partner with or qualify as the community applicant yourself.`,
    });
  }

  // ---- GAC Early Warning risk -------------------------------------------
  if (GAC_EARLY_WARNING_RISK.has(s)) {
    flags.push({
      code: 'EVAL-GAC',
      severity: 'HIGH',
      title: `".${s}" is likely to attract a GAC Early Warning`,
      detail: `The Governmental Advisory Committee (GAC) has historically issued Early Warnings and formal advice against strings in this category. A GAC Early Warning does not automatically block your application but triggers a consultation process. However, formal GAC advice to the ICANN Board recommending rejection is extremely difficult to overcome — the Board must provide clear rationale to depart from GAC consensus advice (AGB §3.1). Several 2012 applicants withdrew after GAC Early Warnings rather than contest the process.`,
      guidebookRef: 'AGB §3.1, pp. 34–40 — GAC advice mechanism; GAC communiqués 2011–2013',
      recommendation: `Before applying for ".${s}", conduct a formal GAC risk assessment with experienced ICANN policy counsel. Prepare a detailed public interest justification and consider proactive engagement with relevant government bodies before the application window opens.`,
    });
  }

  // ---- Universal application requirement flags (informational) ----------
  const infoFlags: RiskFlag[] = [
    {
      code: 'EVAL-001',
      severity: 'LOW',
      title: 'Application fee: ~$227,000 USD per string',
      detail: 'The base evaluation fee for a new gTLD application in the 2026 round is approximately $227,000 USD. Additional fees apply for string contention resolution, extended evaluation, and other processes.',
      guidebookRef: 'AGB Section 1.5, pp. 21–22',
      recommendation: 'Confirm fee structure in the latest AGB version before the application window opens.',
    },
    {
      code: 'EVAL-002',
      severity: 'LOW',
      title: 'Technical capability evaluation required',
      detail: 'Applicants must demonstrate technical capability to operate a registry, including DNS infrastructure, RDDS/WHOIS, EPP system, and compliance with ICANN\'s Registry System Testing (RST) requirements.',
      guidebookRef: 'AGB Section 5.4, pp. 171–182',
      recommendation: 'Engage a registry services provider (RSP) if you do not have in-house technical capability. ICANN maintains a list of evaluated RSPs.',
    },
    {
      code: 'EVAL-003',
      severity: 'LOW',
      title: 'Financial capability documentation required',
      detail: 'Applicants must demonstrate sufficient financial resources to fund registry operations for a minimum of three years, including working capital and contingency reserves.',
      guidebookRef: 'AGB Section 5.4.2, pp. 175–178',
      recommendation: 'Prepare audited financial statements and a 3-year financial projection for your application.',
    },
    {
      code: 'EVAL-004',
      severity: 'LOW',
      title: 'Registry Agreement execution required post-approval',
      detail: 'Successful applicants must execute a Registry Agreement with ICANN before delegation. This agreement includes ongoing compliance obligations, fee payments, and operational requirements.',
      guidebookRef: 'AGB Section 6, pp. 182–192',
      recommendation: 'Review the base Registry Agreement template in the AGB before applying.',
    },
  ];

  flags.push(...infoFlags);

  const highFlags = flags.filter(f => f.severity === 'HIGH');
  const score = highFlags.length >= 2 ? 85
    : highFlags.length === 1 ? 70
    : 0;

  return {
    category: 'EVALUATION_CRITERIA',
    level: score >= 70 ? 'HIGH' : 'CLEAR',
    score,
    flags,
    summary: highFlags.length > 0
      ? `${highFlags.length} evaluation pathway risk(s): ${highFlags.map(f => f.code).join(', ')}`
      : 'Standard application requirements apply. Review the guidebook checklist before submitting.',
  };
}
