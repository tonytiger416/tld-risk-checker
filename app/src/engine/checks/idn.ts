import type { CategoryResult, RiskFlag } from '../types';

// Unicode script detection helper
function detectScripts(s: string): string[] {
  const scripts = new Set<string>();
  for (const char of s) {
    const cp = char.codePointAt(0) ?? 0;
    if (cp <= 0x7F) { scripts.add('Latin/ASCII'); continue; }
    if (cp >= 0x0080 && cp <= 0x024F) scripts.add('Latin Extended');
    else if (cp >= 0x0400 && cp <= 0x04FF) scripts.add('Cyrillic');
    else if (cp >= 0x0600 && cp <= 0x06FF) scripts.add('Arabic');
    else if (cp >= 0x0900 && cp <= 0x097F) scripts.add('Devanagari');
    else if (cp >= 0x4E00 && cp <= 0x9FFF) scripts.add('CJK Unified');
    else if (cp >= 0x3040 && cp <= 0x309F) scripts.add('Hiragana');
    else if (cp >= 0x30A0 && cp <= 0x30FF) scripts.add('Katakana');
    else if (cp >= 0x0370 && cp <= 0x03FF) scripts.add('Greek');
    else if (cp >= 0xAC00 && cp <= 0xD7AF) scripts.add('Korean/Hangul');
    else if (cp >= 0x0590 && cp <= 0x05FF) scripts.add('Hebrew');
    else if (cp >= 0x0E00 && cp <= 0x0E7F) scripts.add('Thai');
    else scripts.add('Other');
  }
  return Array.from(scripts);
}

export function checkIDN(s: string): CategoryResult {
  const flags: RiskFlag[] = [];

  // Detect if this is an ASCII-only string
  const isASCII = /^[a-z0-9-]+$/.test(s);
  const isPunycode = s.startsWith('xn--');

  if (isASCII && !isPunycode) {
    // Pure ASCII — no IDN risks
    return {
      category: 'IDN_RISKS',
      level: 'CLEAR',
      score: 0,
      flags: [],
      summary: 'ASCII string — no IDN-specific risks apply.',
    };
  }

  // For Punycode or non-ASCII strings
  if (isPunycode) {
    flags.push({
      code: 'IDN-001',
      severity: 'MEDIUM',
      title: 'Punycode (ACE) IDN string detected',
      detail: 'This string uses the "xn--" Punycode prefix, indicating it represents a non-ASCII IDN label. IDN TLDs must comply with ICANN\'s IDN Implementation Guidelines and the applicable Label Generation Ruleset (LGR) for the script.',
      guidebookRef: 'AGB Section 4.5, pp. 209–211',
      recommendation: 'Ensure the Unicode form of the label is valid under the relevant LGR. Submit both the ACE form and the Unicode form in your application.',
    });
  }

  // Check for mixed scripts in non-ASCII portion
  const nonASCIIPart = s.replace(/[a-z0-9-]/g, '');
  if (nonASCIIPart.length > 0) {
    const scripts = detectScripts(nonASCIIPart);
    if (scripts.length > 1) {
      flags.push({
        code: 'IDN-002',
        severity: 'HIGH',
        title: `Mixed-script IDN label detected (${scripts.join(', ')})`,
        detail: 'IDN TLD labels must use a single script. Mixed-script labels are not permitted and would be rejected by ICANN\'s IDN evaluation.',
        guidebookRef: 'AGB Section 4.5, pp. 209–211; ICANN IDN Implementation Guidelines',
        recommendation: 'Use only one script in your IDN label.',
      });
    }
  }

  // Variant management warning
  flags.push({
    code: 'IDN-003',
    severity: 'LOW',
    title: 'IDN variant management obligations apply',
    detail: 'IDN TLDs must implement variant label management as defined in the applicable Root Zone Label Generation Ruleset. Some scripts have mandatory variant TLDs that must be co-delegated or withheld.',
    guidebookRef: 'AGB Section 4.5.3, pp. 210–211',
    recommendation: 'Consult the Root Zone LGR for your script to understand variant obligations. Budget for variant label co-delegation costs.',
  });

  const highFlags = flags.filter(f => f.severity === 'HIGH');
  const medFlags = flags.filter(f => f.severity === 'MEDIUM');
  const score = highFlags.length > 0 ? 85 : medFlags.length > 0 ? 50 : 15;

  return {
    category: 'IDN_RISKS',
    level: score >= 80 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW',
    score,
    flags,
    summary: isPunycode || !isASCII
      ? 'IDN string — additional compliance requirements apply.'
      : 'ASCII string — IDN checks not applicable.',
  };
}
