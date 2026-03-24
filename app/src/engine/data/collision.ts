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

  // Developer/infrastructure namespaces — common in enterprise and cloud environments
  ['node',       { level: 'medium', note: 'Used in Kubernetes clusters (node.internal), Hadoop, and distributed systems as internal DNS labels for compute nodes' }],
  ['cache',      { level: 'medium', note: 'Redis, Memcached, and CDN cache nodes commonly use .cache as an internal DNS label in enterprise service meshes' }],
  ['sync',       { level: 'low', note: 'Sync services (file sync, database replication) sometimes use .sync as an internal hostname' }],
  ['deploy',     { level: 'low', note: 'CI/CD pipelines and deployment services occasionally use .deploy as an internal DNS label' }],
  ['core',       { level: 'low', note: 'Some network architectures label backbone/core routers as .core in internal DNS' }],
  ['key',        { level: 'medium', note: 'SSH key servers, certificate authorities, and key management services use .key in internal infrastructure DNS (e.g., key.internal, vault.key)' }],
  ['lock',       { level: 'low', note: 'Distributed lock services and access control systems sometimes use .lock as an internal label' }],
  ['vault',      { level: 'low', note: 'HashiCorp Vault and secret management services commonly use vault.internal or .vault in service discovery' }],
  ['api',        { level: 'medium', note: 'API gateways are commonly reachable at api.internal or .api in enterprise service meshes and Kubernetes clusters' }],
  ['auth',       { level: 'medium', note: 'Authentication/SSO services commonly use auth.internal or .auth as an internal DNS label in enterprise environments' }],
  ['maps',       { level: 'low', note: 'Internal mapping/GIS services occasionally use .maps in enterprise DNS' }],
  ['code',       { level: 'low', note: 'Code servers and IDE backends (code-server, VS Code Remote) sometimes use .code in internal DNS' }],
  ['agent',      { level: 'low', note: 'Monitoring agents (Datadog, New Relic) and CI runners sometimes register as .agent in internal DNS' }],
  ['base',       { level: 'low', note: 'Database services sometimes use .base in internal service discovery' }],
  ['grid',       { level: 'low', note: 'Compute grid and Selenium Grid services occasionally use .grid as an internal DNS label' }],
  ['pipe',       { level: 'low', note: 'Data pipeline services sometimes use .pipe in internal DNS' }],
  ['bridge',     { level: 'low', note: 'Network bridge devices and bridge services in containerised environments' }],
  ['edge',       { level: 'low', note: 'Edge computing nodes and CDN edge servers in internal DNS' }],
  ['runtime',    { level: 'low', note: 'Container runtimes and serverless runtime environments in internal service discovery' }],
  ['flow',       { level: 'low', note: 'Workflow engines (Airflow, Prefect) sometimes use .flow in internal DNS' }],
  ['debug',      { level: 'low', note: 'Debug endpoints and profiling services in development environments' }],
  ['repo',       { level: 'low', note: 'Internal package/artifact repositories (Nexus, Artifactory) sometimes use .repo in DNS' }],
  ['stack',      { level: 'low', note: 'OpenStack and infrastructure-as-code environments sometimes use .stack as a DNS label' }],
  ['signal',     { level: 'low', note: 'Service signaling and event bus systems in microservice architectures' }],
  ['inbox',      { level: 'low', note: 'Mail server inbox services and message queue endpoints in enterprise environments' }],
]);
