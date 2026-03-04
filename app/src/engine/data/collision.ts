// Strings with known DNS collision risk (from ICANN NCAP/DITL studies)
export const DEFERRED_STRINGS: Set<string> = new Set([
  'corp', 'home', 'mail',
]);

export const HIGH_COLLISION_STRINGS: Map<string, { level: 'critical' | 'high' | 'medium'; note: string }> = new Map([
  ['corp', { level: 'critical', note: 'Indefinitely deferred by ICANN – widespread internal network use' }],
  ['home', { level: 'critical', note: 'Indefinitely deferred by ICANN – widespread internal network use' }],
  ['mail', { level: 'critical', note: 'Indefinitely deferred by ICANN – widespread internal network use' }],
  ['internal', { level: 'high', note: 'Heavily used in internal corporate networks' }],
  ['intranet', { level: 'high', note: 'Common internal network label' }],
  ['local', { level: 'high', note: 'RFC 6762 reserved, used by mDNS/Bonjour' }],
  ['lan', { level: 'high', note: 'Extremely common local area network suffix' }],
  ['domain', { level: 'high', note: 'Generic label commonly used in internal DNS' }],
  ['workgroup', { level: 'high', note: 'Windows workgroup default suffix' }],
  ['private', { level: 'high', note: 'Common internal network label' }],
  ['network', { level: 'medium', note: 'Frequently used in private namespace configurations' }],
  ['gateway', { level: 'medium', note: 'Used in router/gateway configurations' }],
  ['ad', { level: 'medium', note: 'Common suffix for Active Directory domains' }],
  ['ds', { level: 'medium', note: 'Used in directory service configurations' }],
  ['priv', { level: 'medium', note: 'Short form of "private", used in internal networks' }],
]);
