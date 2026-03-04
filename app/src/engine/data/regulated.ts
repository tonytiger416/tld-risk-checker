// Strings in regulated or highly sensitive sectors (AGB Section 5, pp. 219-223)
export const HIGHLY_REGULATED: Set<string> = new Set([
  // Financial services
  'bank', 'creditcard', 'creditunion', 'forex', 'insurance', 'invest',
  'investments', 'lifeinsurance', 'loans', 'mortgage', 'mutuelle',
  'spreadbetting', 'trading', 'fund', 'capital',
  // Health & medical
  'clinic', 'dds', 'dentist', 'doctor', 'health', 'hospital',
  'medical', 'pharmacy', 'surgery', 'healthcare',
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

export const REGULATED_SECTOR_KEYWORDS: Array<{ sector: string; pattern: RegExp; note: string }> = [
  { sector: 'Financial Services', pattern: /bank|financ|invest|credit|loan|mortgage|insur|fund|capital|trading|forex|wealth/i, note: 'Requires enhanced consumer protection measures and regulatory compliance' },
  { sector: 'Healthcare', pattern: /health|medic|pharmac|doctor|hospital|clinic|dental|dent|surgery|care/i, note: 'Requires compliance with healthcare regulations and consumer protection policies' },
  { sector: 'Legal Services', pattern: /law|legal|attorney|lawyer|advocat|notar|court|justice/i, note: 'Must comply with applicable legal professional regulations' },
  { sector: 'Education', pattern: /university|college|school|academy|education|learning|cours/i, note: 'May require accreditation or institutional eligibility verification' },
  { sector: 'Gambling', pattern: /casino|poker|bet|gambling|lottery|bingo|gaming/i, note: 'Heavily regulated sector requiring geo-restrictions and age verification policies' },
  { sector: 'Government Functions', pattern: /gov|government|federal|parliament|customs|tax|visa|passport|military|police|official/i, note: 'Strings implying governmental authority may face GAC objection' },
];
