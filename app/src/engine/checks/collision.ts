import type { CategoryResult, RiskFlag } from '../types';
import { DEFERRED_STRINGS, HIGH_COLLISION_STRINGS } from '../data/collision';

export function checkCollision(s: string): CategoryResult {
  const flags: RiskFlag[] = [];

  // 1. ICANN-deferred strings
  if (DEFERRED_STRINGS.has(s)) {
    flags.push({
      code: 'COL-001',
      severity: 'HIGH',
      title: `".${s}" is indefinitely deferred by ICANN due to DNS collision risk`,
      detail: `ICANN has identified ".${s}" as a string with such high potential for name collision with existing private namespaces that it has been indefinitely deferred from delegation. Applications for this string would not be approved.`,
      guidebookRef: 'AGB Section 5.8, pp. 211–216; ICANN Name Collision Framework',
      recommendation: 'Do not apply for this string. It is effectively blocked by ICANN\'s name collision policy.',
    });
  }

  // 2. High-collision strings
  const collisionInfo = HIGH_COLLISION_STRINGS.get(s);
  if (collisionInfo && !DEFERRED_STRINGS.has(s)) {
    const sev = collisionInfo.level === 'high' ? 'HIGH'
      : collisionInfo.level === 'medium' ? 'MEDIUM'
      : 'LOW';
    flags.push({
      code: 'COL-002',
      severity: sev,
      title: `".${s}" has DNS collision risk — common in private namespaces`,
      detail: collisionInfo.note + ` ICANN's Day-in-the-Life (DITL) data and NCAP Study Two research show this string appears in root zone queries from private/internal networks, creating collision risk when the TLD is delegated.`,
      guidebookRef: 'AGB Section 5.8, pp. 211–216; ICANN NCAP Study Two (2023)',
      recommendation: 'Check the ICANN Name Collision Observatory (https://newgtldprogram-nco.icann.org/) for query volume. A Collision Occurrence Assessment (COA) may be required before delegation.',
    });
  }

  // 3. Common internal network patterns (heuristic)
  const internalPatterns = [
    { pattern: /^(internal|intranet|local|lan|private|domain|workgroup|gateway)$/i, note: 'Matches a common internal network label pattern' },
    { pattern: /^(ad|ds|dc|srv|ntp|smtp|pop|imap|ftp|vpn)$/i, note: 'Matches a common network service abbreviation frequently used in private DNS' },
  ];

  for (const { pattern, note } of internalPatterns) {
    if (pattern.test(s) && !HIGH_COLLISION_STRINGS.has(s)) {
      flags.push({
        code: 'COL-003',
        severity: 'MEDIUM',
        title: `".${s}" matches a common internal network naming pattern`,
        detail: `${note}. Strings like this frequently appear in enterprise and ISP internal DNS configurations, creating collision risk when the TLD is delegated in the public DNS.`,
        guidebookRef: 'AGB Section 5.8, pp. 211–216',
        recommendation: 'Check the ICANN Name Collision Observatory (https://newgtldprogram-nco.icann.org/) for query volume data on this string.',
      });
      break;
    }
  }

  // 4. General reminder about Controlled Interruption
  if (flags.length === 0) {
    flags.push({
      code: 'COL-004',
      severity: 'CLEAR',
      title: 'No known DNS collision risk detected',
      detail: 'This string does not appear in ICANN\'s list of high-collision or deferred strings. However, all new TLDs must implement ICANN\'s Controlled Interruption mechanism (resolving to 127.0.53.53) during the transition period.',
      guidebookRef: 'AGB Section 5.8, pp. 211–216',
      recommendation: 'Verify against the Name Collision Observatory (https://newgtldprogram-nco.icann.org/) as a final check.',
    });
  }

  const highFlags = flags.filter(f => f.severity === 'HIGH');
  const medFlags = flags.filter(f => f.severity === 'MEDIUM');
  const lowFlags = flags.filter(f => f.severity === 'LOW');

  // Score by worst flag severity. HIGH = near-blocker (deferred/critical),
  // MEDIUM = manageable with COA (enterprise DNS leakage), LOW = minor.
  // Medium collision is a real concern but not an application risk comparable
  // to trademark or regulation issues — it requires a COA, not a rejection.
  const score = highFlags.length > 0 ? 95
    : medFlags.length > 0 ? 35
    : lowFlags.length > 0 ? 15
    : 0;

  return {
    category: 'DNS_COLLISION',
    level: score >= 80 ? 'HIGH' : score >= 30 ? 'MEDIUM' : score > 0 ? 'LOW' : 'CLEAR',
    score,
    flags: flags.filter(f => f.severity !== 'CLEAR'),
    summary: score === 0
      ? 'No DNS name collision risks detected for this string.'
      : flags[0].title,
  };
}
