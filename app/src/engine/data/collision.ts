// Strings with known DNS collision risk
// Sources: ICANN NCAP Study Two (2023), DITL data, NCAP observatory, vendor device research
export const DEFERRED_STRINGS: Set<string> = new Set([
  'corp', 'home', 'mail',
]);

export const HIGH_COLLISION_STRINGS: Map<string, { level: 'critical' | 'high' | 'medium' | 'low'; note: string }> = new Map([
  // ICANN-deferred (critical — effectively blocked)
  ['corp',       { level: 'critical', note: 'Indefinitely deferred by ICANN – widespread internal network use' }],
  ['home',       { level: 'critical', note: 'Indefinitely deferred by ICANN – widespread internal network use' }],
  ['mail',       { level: 'critical', note: 'Indefinitely deferred by ICANN – widespread internal network use' }],

  // NCAP Study Two — highest leakage-volume strings (DITL data, 2023)
  ['localdomain',{ level: 'high', note: 'Default DNS search domain on Linux/Unix/RHEL systems; appears in tens of millions of enterprise resolvers' }],
  ['internal',   { level: 'high', note: 'Heavily used in internal corporate networks' }],
  ['intranet',   { level: 'high', note: 'Common internal network label' }],
  ['local',      { level: 'high', note: 'RFC 6762 reserved, used by mDNS/Bonjour' }],
  ['lan',        { level: 'high', note: 'Extremely common local area network suffix' }],
  ['domain',     { level: 'high', note: 'Generic label commonly used in internal DNS' }],
  ['workgroup',  { level: 'high', note: 'Windows workgroup default suffix' }],
  ['private',    { level: 'high', note: 'Common internal network label' }],
  ['router',     { level: 'high', note: 'Default hostname on consumer routers (Netgear, TP-Link, Asus); massive installed base in DITL data' }],

  // Router/CPE brand default namespaces (NCAP Study Two finding)
  ['belkin',     { level: 'high', note: 'Belkin routers use .belkin as default internal TLD during setup; hundreds of millions of devices worldwide' }],
  ['linksys',    { level: 'high', note: 'Linksys (Cisco/Belkin) routers use .linksys in factory configuration flows' }],
  ['fritz',      { level: 'medium', note: 'AVM FritzBox routers (dominant in DACH region) use fritz.box internally; .fritz appears frequently in DITL datasets' }],
  ['eero',       { level: 'medium', note: 'Amazon eero mesh routers use .eero internally during setup; growing installed base' }],
  ['speedport',  { level: 'medium', note: 'Deutsche Telekom Speedport routers use .speedport as internal management domain' }],

  // Enterprise service namespaces (NCAP Study Two)
  ['exchange',   { level: 'medium', note: 'Microsoft Exchange Server installations commonly create internal .exchange DNS zones in Active Directory' }],
  ['sharepoint', { level: 'medium', note: 'SharePoint on-premises deployments frequently create internal .sharepoint DNS zones' }],
  ['portal',     { level: 'medium', note: 'Widely used as an internal hostname for enterprise web portals' }],
  ['extranet',   { level: 'medium', note: 'Commonly used as an internal DNS zone name for partner extranet services' }],
  ['remote',     { level: 'medium', note: 'Very common internal hostname for remote access gateways and VPN landing pages' }],

  // Network infrastructure labels (NCAP research + DITL)
  ['network',    { level: 'medium', note: 'Frequently used in private namespace configurations' }],
  ['gateway',    { level: 'medium', note: 'Used in router/gateway configurations' }],
  ['nas',        { level: 'medium', note: 'Network Attached Storage devices (Synology, QNAP, etc.) commonly register .nas in local DNS' }],
  ['printer',    { level: 'medium', note: 'Common internal hostname for network printer queues and print servers' }],
  ['vpn',        { level: 'medium', note: 'Extremely common internal hostname for VPN concentrators and gateways' }],
  ['broadband',  { level: 'medium', note: 'Some ISPs assign .broadband as a default suffix for subscriber CPE equipment' }],
  ['box',        { level: 'medium', note: 'Used in AVM fritz.box and by several ISPs as a default CPE domain suffix' }],
  ['hub',        { level: 'medium', note: 'Used in network hub and smart home hub management interfaces' }],
  ['wan',        { level: 'medium', note: 'WAN interface identifier in router DNS configurations' }],
  ['mesh',       { level: 'low',    note: 'Increasingly used by mesh network devices (eero, Orbi, etc.) in local DNS' }],
  ['ad',         { level: 'medium', note: 'Common suffix for Active Directory domains in enterprise environments' }],
  ['ds',         { level: 'medium', note: 'Used in directory service configurations' }],
  ['priv',       { level: 'medium', note: 'Short form of "private", used in internal networks' }],

  // Mail/server service labels
  ['smtp',       { level: 'low', note: 'Used in mail server internal DNS configurations' }],
  ['imap',       { level: 'low', note: 'Internal mail server DNS label' }],
  ['ftp',        { level: 'low', note: 'Common internal file server label in enterprise environments' }],
  ['ntp',        { level: 'low', note: 'Network Time Protocol servers often use .ntp as an internal DNS suffix' }],
]);
