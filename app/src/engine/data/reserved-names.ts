// RFC 6761 special-use names + ICANN blocked/reserved strings
export const BLOCKED_NAMES: Set<string> = new Set([
  // RFC 6761 special-use
  'example', 'invalid', 'localhost', 'test',
  // RFC 6762 mDNS
  'local',
  // RFC 7686 Tor
  'onion',
  // RFC 8375
  'home', 'arpa',
  // RFC 9476
  'alt',
  // IANA / ICANN organizational
  'icann', 'iana', 'pti', 'ietf', 'internic',
  // DNS infrastructure
  'root', 'www', 'whois', 'dns', 'ns',
  // Historically problematic / deferred by ICANN
  'corp', 'mail', 'domain', 'intranet', 'internal',
  'workgroup', 'lan', 'private', 'network', 'gateway',
  // Numeric-only (prohibited)
  // (handled by format check, listed here for reference)
]);

// Names that are reserved but may be eligible under specific circumstances
export const RESTRICTED_NAMES: Map<string, string> = new Map([
  ['icann', 'Reserved for ICANN organizational use'],
  ['iana', 'Reserved for IANA/PTI use'],
  ['example', 'RFC 6761 reserved for documentation and examples'],
  ['test', 'RFC 6761 reserved for testing'],
  ['localhost', 'RFC 6761 reserved for loopback'],
  ['invalid', 'RFC 6761 reserved for invalid names'],
  ['local', 'RFC 6762 reserved for multicast DNS'],
  ['onion', 'RFC 7686 reserved for Tor hidden services'],
  ['alt', 'RFC 9476 reserved for non-DNS resolution'],
  ['corp', 'Indefinitely deferred by ICANN due to DNS collision risk'],
  ['home', 'Indefinitely deferred by ICANN due to DNS collision risk'],
  ['mail', 'Indefinitely deferred by ICANN due to DNS collision risk'],
]);
