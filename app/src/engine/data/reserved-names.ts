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
  // Internet protocol / service labels — would cause immediate widespread DNS breakage
  'smtp', 'imap', 'pop', 'pop3', 'ftp', 'ntp', 'http', 'https',
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
  ['corp',  'Indefinitely deferred by ICANN due to DNS collision risk'],
  ['home',  'Indefinitely deferred by ICANN due to DNS collision risk'],
  ['mail',  'Indefinitely deferred by ICANN due to DNS collision risk'],
  ['smtp',  'Internet protocol label — delegating this TLD would break email delivery globally (RFC 5321)'],
  ['imap',  'Internet protocol label — delegating this TLD would break IMAP mail access globally (RFC 3501)'],
  ['pop',   'Internet protocol label — delegating this TLD would break POP3 mail access globally (RFC 1939)'],
  ['pop3',  'Internet protocol label — delegating this TLD would break POP3 mail access globally (RFC 1939)'],
  ['ftp',   'Internet protocol label — delegating this TLD would break FTP clients globally (RFC 959)'],
  ['ntp',   'Internet protocol label — delegating this TLD would break network time synchronisation globally (RFC 5905)'],
  ['http',  'Internet protocol label — delegating this TLD would cause catastrophic DNS breakage for web traffic (RFC 9110)'],
  ['https', 'Internet protocol label — delegating this TLD would cause catastrophic DNS breakage for secure web traffic (RFC 9110)'],
]);
