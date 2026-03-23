// Strings in regulated or highly sensitive sectors (AGB Section 5, pp. 219-223)
export const HIGHLY_REGULATED: Set<string> = new Set([
  // Financial services
  'bank', 'creditcard', 'creditunion', 'forex', 'insurance', 'invest',
  'investments', 'lifeinsurance', 'loans', 'mortgage', 'mutuelle',
  'spreadbetting', 'trading', 'fund', 'capital',
  // Health & medical
  'clinic', 'dds', 'dentist', 'doc', 'docs', 'doctor', 'health', 'hospital',
  'lab', 'labs', 'med', 'meds', 'medical', 'pharmacy', 'pharm', 'rx',
  'surgery', 'healthcare', 'vet', 'vets',
  // Legal
  'abogado', 'attorney', 'avocats', 'cpa', 'jurist', 'law',
  'lawyer', 'legal', 'notary', 'rechtsanwalt',
  // Education
  'academy', 'college', 'education', 'mba', 'school', 'university',
  // Gambling
  'bet', 'bingo', 'casino', 'poker', 'lottery', 'gambling',
  // Government-adjacent
  'gov', 'government', 'parliament', 'federal', 'customs', 'tax',
  'visa', 'passport', 'military', 'police',
  // Corporate legal forms (may imply eligibility restrictions)
  'corp', 'gmbh', 'inc', 'llc', 'llp', 'ltd', 'ltda', 'sarl', 'srl',
  // Other regulated
  'charity', 'foundation', 'ngo', 'vermogensberater', 'versicherung',
]);

// Anchored patterns — match whole string or clear prefix/suffix only (avoids false positives)
// e.g. "banking" matches financial but "embarking" does not
export const REGULATED_SECTOR_KEYWORDS: Array<{ sector: string; pattern: RegExp; note: string }> = [
  {
    sector: 'Financial Services',
    // Anchored: string IS or STARTS WITH these roots (not buried inside unrelated words)
    pattern: /^(bank|banking|banque|finance|financial|invest|investment|investments|investing|credit|creditcard|creditunion|loan|loans|lending|mortgage|insurance|insure|insurer|fund|funds|forex|trading|wealth|capital|broker|brokerage|securities|equity|bonds|pension|annuity|leasing|factoring|fintech|neobank)$/,
    note: 'Requires enhanced consumer protection measures and regulatory compliance per AGB Section 5.5',
  },
  {
    sector: 'Healthcare',
    pattern: /^(health|healthcare|medical|medicine|medic|med|meds|pharmacy|pharma|pharmaceutical|pharm|rx|doctor|doctors|doc|docs|hospital|hospitals|clinic|clinics|dental|dentist|dentistry|surgery|surgical|therapy|therapist|nursing|nurse|physiotherapy|radiology|oncology|cardiology|pediatric|dermatology|psychiatry|rehab|rehabilitation|lab|labs|vet|vets)$/,
    note: 'Requires compliance with healthcare regulations and consumer protection policies',
  },
  {
    sector: 'Legal Services',
    pattern: /^(law|legal|attorney|attorneys|lawyer|lawyers|barrister|solicitor|advocate|notary|paralegal|litigation|arbitration|judiciary|justice|court|courts|lawfirm|legalaid)$/,
    note: 'Must comply with applicable legal professional regulations',
  },
  {
    sector: 'Education',
    pattern: /^(university|universities|college|school|schools|academy|academies|education|educational|learning|elearning|training|tutoring|curriculum|scholarship|seminary|institute|polytechnic)$/,
    note: 'May require accreditation or institutional eligibility verification',
  },
  {
    sector: 'Gambling',
    pattern: /^(casino|casinos|poker|betting|bet|bingo|gambling|gamble|lottery|lotteries|sportsbook|sweepstakes|jackpot|wagering|wager)$/,
    note: 'Heavily regulated sector requiring geo-restrictions and age verification policies',
  },
  {
    sector: 'Government Functions',
    pattern: /^(gov|government|parliament|federal|congress|senate|customs|tax|taxation|visa|passport|military|police|municipal|official|ministry|department|agency|bureau|authority|regulator|regulatory)$/,
    note: 'Strings implying governmental authority may face GAC Early Warning or Advice',
  },
];
