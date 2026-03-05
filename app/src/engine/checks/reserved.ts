import type { CategoryResult, RiskFlag } from '../types';
import { BLOCKED_NAMES, RESTRICTED_NAMES } from '../data/reserved-names';
import { EXISTING_TLDS } from '../data/existing-tlds';
import { AWARDED_NOT_DELEGATED } from '../data/prior-round';

export function checkReserved(s: string): CategoryResult {
  const flags: RiskFlag[] = [];

  // 1. Already an existing TLD
  if (EXISTING_TLDS.has(s)) {
    flags.push({
      code: 'RES-001',
      severity: 'HIGH',
      title: `".${s}" already exists in the root zone`,
      detail: `This string is currently a delegated TLD. Identical string applications are not permitted.`,
      guidebookRef: 'AGB Section 4.1, p. 192',
      recommendation: 'Choose a different string. This application would be rejected.',
    });
  }

  // 2. ICANN/IANA blocked
  if (BLOCKED_NAMES.has(s)) {
    const note = RESTRICTED_NAMES.get(s) ?? 'Reserved by ICANN/IANA policy';
    flags.push({
      code: 'RES-002',
      severity: 'HIGH',
      title: `".${s}" is a reserved or blocked string`,
      detail: note,
      guidebookRef: 'AGB Section 4.1.2, pp. 192–196',
      recommendation: 'This string cannot be applied for. It is reserved by ICANN, IANA, or an RFC standard.',
    });
  }

  // 3. Awarded in 2012 round but not yet delegated — effectively locked
  const priorRound = AWARDED_NOT_DELEGATED.get(s);
  if (priorRound) {
    flags.push({
      code: 'RES-009',
      severity: 'HIGH',
      title: `".${s}" was awarded in the 2012 ICANN round and has not been delegated`,
      detail: priorRound.detail + (priorRound.auctionPrice ? ` Auction price: ${priorRound.auctionPrice}.` : '') + ` Current status: ${priorRound.status}.`,
      guidebookRef: 'AGB Section 4.1.2, pp. 192–196; ICANN Registry Agreement database',
      recommendation: `Do not apply for ".${s}" in the 2026 round. This string remains under ICANN contract or proceedings from the 2012 round. ICANN would not accept a new application while the prior-round award is unresolved. Remove it from your candidate list.`,
    });
  }

  // 4. Too short (< 2 characters after normalization)
  if (s.length < 2) {
    flags.push({
      code: 'RES-003',
      severity: 'HIGH',
      title: 'String is too short (minimum 2 characters)',
      detail: 'Single-character ASCII strings are not permitted as new gTLDs.',
      guidebookRef: 'AGB Section 4.1.1, p. 191',
      recommendation: 'Use a string of at least 2 characters.',
    });
  }

  // 5. Exactly 2 characters (ccTLD space, very high risk)
  if (s.length === 2 && /^[a-z]{2}$/.test(s)) {
    flags.push({
      code: 'RES-004',
      severity: 'HIGH',
      title: 'Two-letter ASCII strings are reserved for country codes (ccTLDs)',
      detail: 'Two-character ASCII labels are reserved for ISO 3166-1 country code TLDs and are not available for new gTLD applications.',
      guidebookRef: 'AGB Section 4.1.1, p. 191',
      recommendation: 'Choose a string with 3 or more characters.',
    });
  }

  // 5. Starts or ends with hyphen
  if (s.startsWith('-') || s.endsWith('-')) {
    flags.push({
      code: 'RES-005',
      severity: 'HIGH',
      title: 'String begins or ends with a hyphen',
      detail: 'TLD strings may not begin or end with a hyphen character.',
      guidebookRef: 'AGB Section 4.1.1, p. 191',
      recommendation: 'Remove leading/trailing hyphens.',
    });
  }

  // 6. Hyphens in positions 3 and 4 (ACE prefix xn--)
  if (s.length >= 4 && s[2] === '-' && s[3] === '-' && !s.startsWith('xn--')) {
    flags.push({
      code: 'RES-006',
      severity: 'HIGH',
      title: 'Reserved label format (hyphens at positions 3–4)',
      detail: 'Labels with hyphens in positions 3 and 4 are reserved for special use (e.g., Punycode "xn--" prefix). This string matches that pattern.',
      guidebookRef: 'AGB Section 4.1.1, p. 191',
      recommendation: 'Avoid strings with "--" at character positions 3 and 4.',
    });
  }

  // 7. Purely numeric
  if (/^\d+$/.test(s)) {
    flags.push({
      code: 'RES-007',
      severity: 'HIGH',
      title: 'Purely numeric strings are not permitted',
      detail: 'TLD strings consisting entirely of digits are not eligible for application.',
      guidebookRef: 'AGB Section 4.1.1, p. 191',
      recommendation: 'Include at least one letter in the string.',
    });
  }

  // 8. Invalid characters
  if (!/^[a-z0-9-]+$/.test(s) && !s.startsWith('xn--')) {
    flags.push({
      code: 'RES-008',
      severity: 'HIGH',
      title: 'String contains invalid characters',
      detail: 'ASCII TLD strings may only contain letters (a-z), digits (0-9), and hyphens. Non-ASCII strings must be valid Punycode (xn-- prefixed IDN labels).',
      guidebookRef: 'AGB Section 4.1.1, p. 191',
      recommendation: 'Use only letters, digits, and internal hyphens. For non-Latin scripts, use the IDN/Punycode form.',
    });
  }

  const score = flags.some(f => f.severity === 'HIGH') ? 100
    : flags.some(f => f.severity === 'MEDIUM') ? 60
    : flags.length > 0 ? 30 : 0;

  return {
    category: 'RESERVED_BLOCKED',
    level: score >= 80 ? 'HIGH' : score >= 40 ? 'MEDIUM' : score > 0 ? 'LOW' : 'CLEAR',
    score,
    flags,
    summary: score === 0
      ? 'String passes all format and reservation checks.'
      : `${flags.length} issue(s) found with this string's format or reserved status.`,
  };
}
