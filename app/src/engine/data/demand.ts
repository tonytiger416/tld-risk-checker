// Competitive demand signals — used by the contention check to score
// how attractive a string is to registry operators and end users
//
// Sources: ICANN 2012 auction results, industry revenue data,
//          publicly known search keyword volume research

// ---------------------------------------------------------------------------
// Commercial value — how attractive this namespace is to registry operators
// Reflects addressable market size and premium SLD revenue potential
// ---------------------------------------------------------------------------
export const COMMERCIAL_VALUE: Map<string, 'ultra' | 'high' | 'medium'> = new Map([
  // Ultra tier (25 pts) — massive markets, premium registry revenue potential
  ['finance',      'ultra'],
  ['financial',    'ultra'],
  ['bank',         'ultra'],
  ['banking',      'ultra'],
  ['insurance',    'ultra'],
  ['invest',       'ultra'],
  ['investment',   'ultra'],
  ['investments',  'ultra'],
  ['crypto',       'ultra'],
  ['bitcoin',      'ultra'],
  ['blockchain',   'ultra'],
  ['property',     'ultra'],
  ['realty',       'ultra'],
  ['mortgage',     'ultra'],
  ['loans',        'ultra'],
  ['loan',         'ultra'],
  ['credit',       'ultra'],
  ['health',       'ultra'],
  ['healthcare',   'ultra'],
  ['medical',      'ultra'],
  ['pharma',       'ultra'],
  ['pharmacy',     'ultra'],
  ['legal',        'ultra'],
  ['law',          'ultra'],
  ['attorney',     'ultra'],
  ['security',     'ultra'],
  ['cyber',        'ultra'],
  ['cloud',        'ultra'],

  // High tier (15 pts) — large, competitive markets
  ['tech',         'high'],
  ['technology',   'high'],
  ['digital',      'high'],
  ['data',         'high'],
  ['ai',           'high'],
  ['software',     'high'],
  ['app',          'high'],
  ['apps',         'high'],
  ['web',          'high'],
  ['media',        'high'],
  ['marketing',    'high'],
  ['agency',       'high'],
  ['consulting',   'high'],
  ['shop',         'high'],
  ['store',        'high'],
  ['market',       'high'],
  ['trade',        'high'],
  ['hotel',        'high'],
  ['hotels',       'high'],
  ['travel',       'high'],
  ['flights',      'high'],
  ['news',         'high'],
  ['tv',           'high'],
  ['auto',         'high'],
  ['cars',         'high'],
  ['luxury',       'high'],
  ['casino',       'high'],
  ['betting',      'high'],

  // Medium tier (8 pts) — valuable but lower commercial intensity
  ['education',    'medium'],
  ['school',       'medium'],
  ['university',   'medium'],
  ['fashion',      'medium'],
  ['beauty',       'medium'],
  ['food',         'medium'],
  ['sport',        'medium'],
  ['sports',       'medium'],
  ['fitness',      'medium'],
  ['energy',       'medium'],
  ['green',        'medium'],
  ['eco',          'medium'],
  ['social',       'medium'],
  ['chat',         'medium'],
  ['network',      'medium'],
  ['design',       'medium'],
  ['studio',       'medium'],
  ['art',          'medium'],
  ['work',         'medium'],
  ['jobs',         'medium'],
  ['career',       'medium'],
  ['music',        'medium'],
  ['game',         'medium'],
  ['games',        'medium'],
  ['entertainment','medium'],
  ['lifestyle',    'medium'],
  ['wellness',     'medium'],
  ['home',         'medium'],
  ['house',        'medium'],
  ['homes',        'medium'],

  // Additional commercial value entries
  ['dental',       'ultra'],
  ['doctor',       'ultra'],
  ['hospital',     'ultra'],
  ['surgery',      'ultra'],
  ['accountant',   'ultra'],
  ['accounting',   'ultra'],
  ['tax',          'ultra'],
  ['forex',        'ultra'],
  ['trading',      'ultra'],
  ['broker',       'ultra'],
  ['fund',         'ultra'],
  ['vc',           'ultra'],
  ['startup',      'high'],
  ['real',         'high'],
  ['estate',       'high'],
  ['lease',        'high'],
  ['rent',         'high'],
  ['rentals',      'high'],
  ['properties',   'high'],
  ['luxury',       'high'],
  ['hotel',        'high'],
  ['flights',      'high'],
  ['solutions',    'high'],
  ['services',     'high'],
  ['ventures',     'high'],
  ['capital',      'high'],
  ['exchange',     'high'],
  ['legal',        'high'],
  ['pharmacy',     'high'],
  ['dental',       'high'],
  ['management',   'medium'],
  ['systems',      'medium'],
  ['support',      'medium'],
  ['training',     'medium'],
  ['partners',     'medium'],
  ['marketing',    'medium'],
  ['agency',       'medium'],
  ['events',       'medium'],
  ['tours',        'medium'],
  ['photography',  'medium'],
  ['pizza',        'medium'],
  ['beer',         'medium'],
  ['wine',         'medium'],
  ['cafe',         'medium'],
  ['run',          'medium'],
  ['repair',       'medium'],
  ['solar',        'medium'],
  ['zone',         'medium'],
  ['press',        'medium'],
  ['site',         'medium'],
  ['host',         'medium'],
  ['website',      'medium'],
  ['space',        'medium'],
  ['xyz',          'medium'],

  // Tech infrastructure abbreviations — real commercial categories with operator interest
  ['auth',         'high'],   // authentication/identity — security infrastructure vertical
  ['api',          'high'],   // developer APIs — core internet infrastructure market
  ['dev',          'high'],   // developer tooling — large audience, established operator interest
  ['sdk',          'medium'], // software development kit
  ['cdn',          'medium'], // content delivery networks
  ['dns',          'medium'], // DNS infrastructure
  ['ssl',          'medium'], // SSL/TLS security certificates
  ['vpn',          'medium'], // virtual private networks — consumer and enterprise

  // 2026 emerging categories — high-value sectors not prominent in the 2012 round
  ['web3',         'ultra'],
  ['defi',         'ultra'],
  ['fintech',      'ultra'],
  ['ml',           'high'],
  ['saas',         'high'],
  ['creator',      'high'],
  ['stream',       'high'],
  ['streaming',    'high'],
  ['podcast',      'high'],
  ['biotech',      'high'],
  ['carbon',       'medium'],
  ['climate',      'medium'],
  ['sustainable',  'medium'],
  ['sustainability','medium'],
  ['remote',       'medium'],
  ['coworking',    'medium'],
  ['dao',          'medium'],
  ['nft',          'medium'],

  // Finance & investment — high-value registrant verticals
  ['equity',       'ultra'],  // private equity, stock equity — massive financial market
  ['wealth',       'ultra'],  // wealth management — ultra-high-net-worth advisory market
  ['lend',         'ultra'],  // lending — core banking/fintech vertical
  ['yield',        'high'],   // investment yield/returns — finance and DeFi
  ['asset',        'high'],   // asset management — institutional finance
  ['seed',         'high'],   // seed funding/venture capital stage
  ['wire',         'high'],   // wire transfers — banking/payments infrastructure
  ['gate',         'high'],   // payment gateways, access gateways
  ['earn',         'medium'], // earnings, passive income — finance/crypto
  ['spend',        'medium'], // spending, expense management
  ['quote',        'medium'], // price quotes — insurance, finance, B2B services
  ['price',        'medium'], // pricing, comparison shopping
  ['ipo',          'medium'], // initial public offering — niche but high-value finance
  ['esg',          'medium'], // environmental/social/governance investing

  // Insurance & compliance
  ['claim',        'high'],   // insurance claims — core insurance vertical
  ['cover',        'high'],   // insurance coverage, warranties
  ['audit',        'medium'], // financial/security auditing
  ['compliance',   'medium'], // regulatory compliance — growing with global regulation

  // Security & identity
  ['key',          'high'],   // encryption keys, API keys, access management — core security
  ['vault',        'high'],   // password vaults, secure storage — security vertical
  ['lock',         'medium'], // security locks, access control, smart locks
  ['signal',       'medium'], // secure messaging, signals intelligence

  // Crypto & Web3
  ['token',        'high'],   // crypto tokens — core Web3 primitive
  ['swap',         'high'],   // DEX token swaps — DeFi infrastructure
  ['stake',        'high'],   // proof-of-stake, staking — core crypto mechanic
  ['wallet',       'high'],   // crypto wallets, digital wallets — fintech/crypto
  ['chain',        'medium'], // blockchain, supply chain

  // AI & machine learning
  ['agent',        'high'],   // AI agents — 2025/2026 breakout category
  ['model',        'high'],   // AI/ML models — core AI infrastructure
  ['prompt',       'medium'], // AI prompts — emerging AI category
  ['neural',       'medium'], // neural networks — AI/ML vertical
  ['vector',       'medium'], // vector databases — AI infrastructure

  // Developer tooling & infrastructure
  ['code',         'high'],   // coding, source code — massive developer market
  ['node',         'high'],   // Node.js, network nodes — developer + infra
  ['stack',        'high'],   // tech stack, full-stack — developer identity
  ['platform',     'high'],   // platform-as-a-service, platforms — enterprise tech
  ['compute',      'high'],   // cloud compute — core cloud infrastructure
  ['deploy',       'medium'], // deployment, CI/CD — DevOps vertical
  ['sync',         'medium'], // data sync, file sync — collaboration/infra
  ['cache',        'medium'], // caching infrastructure — developer/infra
  ['runtime',      'medium'], // runtime environments — developer tooling
  ['debug',        'medium'], // debugging tools — developer tooling
  ['repo',         'medium'], // code repositories — developer infrastructure
  ['pipe',         'medium'], // data pipelines — DevOps/data engineering
  ['ops',          'medium'], // operations, DevOps — established IT vertical
  ['flow',         'medium'], // workflow, data flow — enterprise/productivity
  ['protocol',     'medium'], // network protocols, DeFi protocols
  ['base',         'medium'], // database, codebase, homebase — multi-market
  ['core',         'medium'], // core infrastructure, processor cores
  ['edge',         'medium'], // edge computing, edge networks
  ['grid',         'medium'], // power grid, compute grid, CSS grid
  ['bridge',       'medium'], // network bridges, cross-chain bridges
  ['mesh',         'medium'], // mesh networks — IoT/networking

  // Location, maps & real estate
  ['maps',         'high'],   // mapping, navigation — Google Maps precedent
  ['address',      'medium'], // postal address, web address — multi-market

  // Healthcare & professional services
  ['nurse',        'high'],   // nursing — regulated healthcare profession
  ['therapy',      'high'],   // mental health, physical therapy — growing healthcare vertical
  ['lab',          'high'],   // laboratories — science, medical, dental
  ['labs',         'medium'], // innovation labs, research labs
  ['notary',       'medium'], // notary services — legal/regulated profession

  // Travel & hospitality
  ['trip',         'high'],   // trip planning — TripAdvisor built $5B on this word
  ['stay',         'medium'], // accommodations, short-term stays
  ['tour',         'medium'], // tourism, guided tours
  ['resort',       'medium'], // resort properties, luxury hospitality

  // Education
  ['learn',        'medium'], // e-learning — $200B+ global market
  ['tutor',        'medium'], // tutoring, online education
  ['course',       'medium'], // online courses, education platforms

  // Media & communications
  ['pod',          'high'],   // podcasting shorthand — growing media vertical
  ['cast',         'medium'], // broadcasting, podcasting, casting
  ['voice',        'medium'], // voice tech, VoIP, voice assistants
  ['inbox',        'medium'], // email, messaging — communications

  // Food & lifestyle
  ['chef',         'medium'], // culinary, food services
  ['recipe',       'medium'], // cooking recipes — high search volume

  // Business & professional
  ['firm',         'medium'], // law firms, consulting firms — professional identity
  ['hire',         'medium'], // hiring, recruitment — HR/staffing
  ['consult',      'medium'], // consulting services
  ['mentor',       'medium'], // mentorship, coaching
  ['pilot',        'medium'], // aviation, pilot programs, beta testing

  // Logistics & transport
  ['cargo',        'medium'], // freight, cargo shipping
  ['freight',      'medium'], // freight logistics
  ['fleet',        'medium'], // fleet management — logistics/transport

  // Multi-market short generics
  ['air',          'high'],   // airlines, air quality, AirBnB — multi-market premium 3-letter
  ['gym',          'high'],   // fitness/gym — high consumer search, clear single-market
  ['gen',          'medium'], // generation, generative AI — multi-market
  ['doc',          'high'],   // documents, doctors — dual-market (tech + healthcare)
  ['hub',          'high'],   // hub/platform — GitHub precedent, multi-market

  // Legal
  ['sign',         'medium'], // e-signatures, signage — DocuSign market
  ['contract',     'medium'], // smart contracts, legal contracts
  ['court',        'medium'], // courts, legal proceedings
  ['judge',        'medium'], // legal, judicial

  // Data & research
  ['survey',       'medium'], // surveys, market research
  ['quantum',      'medium'], // quantum computing — emerging tech

  // Short action verbs — high-intent commercial words
  ['buy',          'high'],   // e-commerce intent — massive search volume
  ['sell',         'high'],   // marketplace, sales — high commercial intent
  ['deal',         'high'],   // deals, coupons — consumer commerce
  ['save',         'high'],   // savings, coupons — finance/consumer
  ['plan',         'high'],   // planning, subscriptions — SaaS/enterprise
  ['help',         'high'],   // help desk, support — universal commercial
  ['link',         'high'],   // links, URL shorteners, LinkedIn-adjacent
  ['send',         'medium'], // payments, messaging, file transfer
  ['move',         'medium'], // moving services, logistics
  ['grow',         'medium'], // growth, marketing, agriculture
  ['lead',         'medium'], // lead generation — B2B marketing
  ['fix',          'medium'], // repair, debugging, problem-solving
  ['fly',          'medium'], // airlines, drones, aviation
  ['make',         'medium'], // maker movement, manufacturing

  // Finance — additional coverage
  ['bond',         'high'],   // bonds market — fixed income, $130T global market
  ['gold',         'high'],   // gold trading, investment — $12T market
  ['stock',        'high'],   // stock market, trading — massive retail interest
  ['shares',       'medium'], // stock shares, file sharing
  ['coin',         'high'],   // cryptocurrency, numismatics
  ['hedge',        'medium'], // hedge funds — niche but ultra-high-value
  ['profit',       'medium'], // business profitability
  ['revenue',      'medium'], // business revenue, SaaS metrics
  ['margin',       'medium'], // profit margins, trading margins
  ['dividend',     'medium'], // dividend investing — growing retail interest

  // Tech/infrastructure — additional coverage
  ['git',          'medium'], // version control — ubiquitous developer tool
  ['sql',          'medium'], // databases — foundational tech
  ['log',          'medium'], // logging, observability — DevOps infrastructure
  ['iot',          'high'],   // Internet of Things — massive connected device market
  ['gpu',          'medium'], // GPUs, AI compute — red-hot market
  ['cpu',          'medium'], // processors, computing
  ['proxy',        'medium'], // proxy servers, privacy tools
  ['query',        'medium'], // database queries, search queries
  ['index',        'medium'], // search index, financial index
  ['schema',       'medium'], // data schema, structured data
  ['cluster',      'medium'], // compute clusters, Kubernetes
  ['backup',       'medium'], // data backup — enterprise/consumer essential
  ['migrate',      'medium'], // cloud migration, data migration
  ['pixel',        'medium'], // Google Pixel, digital art, web design
  ['render',       'medium'], // 3D rendering, server-side rendering
  ['socket',       'medium'], // WebSockets, network programming
  ['patch',        'medium'], // security patches, software updates
  ['driver',       'medium'], // device drivers, ride-sharing drivers

  // Emerging tech categories — 2025/2026 breakout terms
  ['ev',           'high'],   // electric vehicles — $800B+ market
  ['ar',           'high'],   // augmented reality — Apple Vision Pro era
  ['vr',           'high'],   // virtual reality — Meta Quest, gaming
  ['xr',           'medium'], // extended reality — umbrella for AR/VR/MR
  ['llm',          'medium'], // large language models — AI infrastructure
  ['rag',          'medium'], // retrieval-augmented generation — AI pattern
  ['agentic',      'medium'], // agentic AI — 2025/2026 buzzword

  // C-suite & professional roles
  ['cfo',          'medium'], // chief financial officer — executive identity
  ['cto',          'medium'], // chief technology officer — tech leadership
  ['cmo',          'medium'], // chief marketing officer
  ['hr',           'medium'], // human resources — massive enterprise vertical
  ['pr',           'medium'], // public relations
  ['it',           'medium'], // information technology — enterprise umbrella

  // Real estate — additional coverage
  ['condo',        'medium'], // condominiums — real estate vertical
  ['villa',        'medium'], // luxury villas, vacation rentals
  ['loft',         'medium'], // loft apartments, creative spaces
  ['flat',         'medium'], // apartments (UK/global term)

  // Healthcare — additional coverage
  ['cure',         'medium'], // medical cures, health solutions
  ['heal',         'medium'], // healing, healthcare, wellness
  ['drug',         'high'],   // pharmaceuticals — massive regulated market
  ['dose',         'medium'], // medical dosing, health
  ['pill',         'medium'], // pharmaceuticals, supplements

  // Lifestyle & services — additional coverage
  ['pet',          'high'],   // pet care — $300B+ global market
  ['farm',         'medium'], // agriculture, farming — food supply chain
  ['diet',         'medium'], // dieting, nutrition — consumer health
  ['fish',         'medium'], // fishing, seafood, aquaculture
  ['taxi',         'medium'], // taxi services, ride-hailing
  ['ski',          'medium'], // skiing, winter sports, resorts
  ['van',          'medium'], // vanlife, delivery vans, transport
  ['bus',          'medium'], // public transit, business shorthand

  // Identity & branding
  ['logo',         'medium'], // logo design, brand identity
  ['name',         'medium'], // naming, domain names, identity
  ['tag',          'medium'], // tagging, social tags, price tags
  ['trend',        'medium'], // trends, trending topics — consumer/media
  ['viral',        'medium'], // viral content, marketing
  ['brand',        'high'],   // branding, brand identity — marketing vertical
  ['safe',         'medium'], // safety, security, safes
  ['fast',         'medium'], // speed, fast food, performance
  ['risk',         'medium'], // risk management — finance/insurance
]);

// ---------------------------------------------------------------------------
// Search popularity proxy — static approximation of end-user search interest
// Reflects how many people are searching for this concept globally
// (Live Google Trends integration requires a backend API — this is a curated
//  static dataset based on publicly known high-volume keyword categories)
// ---------------------------------------------------------------------------
export const SEARCH_POPULARITY: Map<string, 'ultra' | 'high' | 'medium'> = new Map([
  // Ultra tier (15 pts) — billions of monthly searches globally
  ['weather',     'ultra'],
  ['news',        'ultra'],
  ['jobs',        'ultra'],
  ['cars',        'ultra'],
  ['homes',       'ultra'],
  ['flights',     'ultra'],
  ['hotels',      'ultra'],
  ['shopping',    'ultra'],
  ['insurance',   'ultra'],
  ['loans',       'ultra'],
  ['health',      'ultra'],
  ['recipes',     'ultra'],
  ['sports',      'ultra'],
  ['sport',       'ultra'],

  // High tier (10 pts) — hundreds of millions of monthly searches
  ['travel',      'high'],
  ['music',       'high'],
  ['games',       'high'],
  ['game',        'high'],
  ['finance',     'high'],
  ['tech',        'high'],
  ['education',   'high'],
  ['fashion',     'high'],
  ['beauty',      'high'],
  ['food',        'high'],
  ['media',       'high'],
  ['movie',       'high'],
  ['movies',      'high'],
  ['film',        'high'],
  ['crypto',      'high'],
  ['ai',          'high'],
  ['fitness',     'high'],
  ['cars',        'high'],
  ['bank',        'high'],
  ['legal',       'high'],
  ['law',         'high'],

  // Medium tier (5 pts) — tens of millions of monthly searches
  ['design',      'medium'],
  ['marketing',   'medium'],
  ['business',    'medium'],
  ['social',      'medium'],
  ['work',        'medium'],
  ['career',      'medium'],
  ['wellness',    'medium'],
  ['energy',      'medium'],
  ['green',       'medium'],
  ['eco',         'medium'],
  ['sustainable', 'medium'],
  ['art',         'medium'],
  ['studio',      'medium'],
  ['cloud',       'medium'],
  ['software',    'medium'],
  ['app',         'medium'],
  ['apps',        'medium'],
  ['data',        'medium'],
  ['security',    'medium'],
  ['shop',        'medium'],
  ['store',       'medium'],

  // Additional search popularity entries
  ['dental',      'ultra'],
  ['doctor',      'ultra'],
  ['hospital',    'ultra'],
  ['pharmacy',    'ultra'],
  ['mortgage',    'ultra'],
  ['tax',         'ultra'],
  ['flights',     'high'],
  ['hotel',       'high'],
  ['hotels',      'high'],
  ['travel',      'high'],
  ['rent',        'high'],
  ['rentals',     'high'],
  ['estate',      'high'],
  ['real',        'high'],
  ['luxury',      'high'],
  ['run',         'high'],
  ['beer',        'high'],
  ['wine',        'high'],
  ['pizza',       'high'],
  ['cafe',        'high'],
  ['events',      'high'],
  ['tours',       'high'],
  ['photo',       'medium'],
  ['photos',      'medium'],
  ['photography', 'medium'],
  ['site',        'medium'],
  ['website',     'medium'],
  ['host',        'medium'],
  ['press',       'medium'],
  ['space',       'medium'],
  ['zone',        'medium'],
  ['repair',      'medium'],
  ['solar',       'medium'],
  ['solutions',   'medium'],
  ['services',    'medium'],
  ['ventures',    'medium'],
  ['partners',    'medium'],
  ['exchange',    'medium'],
  ['capital',     'medium'],
  ['management',  'medium'],
  ['training',    'medium'],
  ['support',     'medium'],
  ['systems',     'medium'],
  ['agency',      'medium'],
  ['marketing',   'medium'],

  // 2026 emerging search categories
  ['web3',        'high'],
  ['creator',     'high'],
  ['stream',      'high'],
  ['podcast',     'high'],
  ['remote',      'high'],
  ['fintech',     'high'],
  ['ml',          'medium'],
  ['carbon',      'medium'],
  ['climate',     'medium'],
  ['sustainability','medium'],
  ['dao',         'medium'],
  ['nft',         'medium'],
  ['biotech',     'medium'],
  ['saas',        'medium'],
  ['coworking',   'medium'],

  // Finance & investment
  ['equity',      'high'],
  ['wealth',      'high'],
  ['lend',        'medium'],
  ['yield',       'medium'],
  ['asset',       'medium'],
  ['seed',        'medium'],
  ['wire',        'medium'],
  ['earn',        'medium'],
  ['spend',       'medium'],
  ['quote',       'medium'],
  ['price',       'high'],
  ['ipo',         'medium'],
  ['esg',         'medium'],
  ['gate',        'medium'],

  // Insurance & compliance
  ['claim',       'high'],
  ['cover',       'medium'],
  ['audit',       'medium'],
  ['compliance',  'medium'],

  // Security & identity
  ['key',         'high'],
  ['vault',       'medium'],
  ['lock',        'high'],
  ['signal',      'medium'],

  // Crypto & Web3
  ['token',       'high'],
  ['swap',        'medium'],
  ['stake',       'medium'],
  ['wallet',      'high'],
  ['chain',       'medium'],

  // AI & machine learning
  ['agent',       'high'],
  ['model',       'high'],
  ['prompt',      'high'],
  ['neural',      'medium'],
  ['vector',      'medium'],

  // Developer tooling & infrastructure
  ['code',        'high'],
  ['node',        'high'],
  ['stack',       'high'],
  ['platform',    'high'],
  ['compute',     'medium'],
  ['deploy',      'medium'],
  ['sync',        'medium'],
  ['cache',       'medium'],
  ['runtime',     'medium'],
  ['debug',       'medium'],
  ['repo',        'medium'],
  ['pipe',        'medium'],
  ['ops',         'medium'],
  ['flow',        'medium'],
  ['protocol',    'medium'],
  ['base',        'medium'],
  ['core',        'medium'],
  ['edge',        'medium'],
  ['grid',        'medium'],
  ['bridge',      'medium'],
  ['mesh',        'medium'],

  // Location, maps & real estate
  ['maps',        'ultra'],  // "maps" is a top-10 global search term
  ['address',     'medium'],

  // Healthcare & professional services
  ['nurse',       'high'],
  ['therapy',     'high'],
  ['lab',         'medium'],
  ['labs',        'medium'],
  ['notary',      'medium'],

  // Travel & hospitality
  ['trip',        'high'],
  ['stay',        'medium'],
  ['tour',        'high'],
  ['resort',      'high'],

  // Education
  ['learn',       'high'],
  ['tutor',       'medium'],
  ['course',      'high'],

  // Media & communications
  ['pod',         'medium'],
  ['cast',        'medium'],
  ['voice',       'high'],
  ['inbox',       'medium'],

  // Food & lifestyle
  ['chef',        'high'],
  ['recipe',      'high'],
  ['gym',         'ultra'],  // "gym" is a massively searched consumer term

  // Business & professional
  ['firm',        'medium'],
  ['hire',        'high'],
  ['consult',     'medium'],
  ['mentor',      'medium'],
  ['pilot',       'medium'],

  // Logistics & transport
  ['cargo',       'medium'],
  ['freight',     'medium'],
  ['fleet',       'medium'],

  // Multi-market short generics
  ['air',         'high'],
  ['gen',         'medium'],
  ['doc',         'high'],
  ['hub',         'high'],

  // Legal
  ['sign',        'medium'],
  ['contract',    'high'],
  ['court',       'high'],
  ['judge',       'high'],

  // Data & research
  ['survey',      'medium'],
  ['quantum',     'medium'],

  // Short action verbs — high consumer search volume
  ['buy',         'ultra'],   // "buy" is a top purchase-intent search term
  ['sell',        'high'],
  ['deal',        'high'],
  ['save',        'high'],
  ['plan',        'high'],
  ['help',        'high'],
  ['link',        'medium'],
  ['send',        'medium'],
  ['move',        'high'],
  ['grow',        'medium'],
  ['lead',        'medium'],
  ['fix',         'medium'],
  ['fly',         'medium'],
  ['make',        'high'],

  // Finance — additional
  ['bond',        'medium'],
  ['gold',        'high'],
  ['stock',       'ultra'],  // "stock" is a top-searched finance term
  ['shares',      'medium'],
  ['coin',        'high'],
  ['hedge',       'medium'],
  ['profit',      'medium'],
  ['revenue',     'medium'],
  ['dividend',    'medium'],

  // Tech/infrastructure
  ['git',         'medium'],
  ['sql',         'medium'],
  ['iot',         'high'],
  ['gpu',         'high'],
  ['proxy',       'medium'],
  ['backup',      'medium'],
  ['pixel',       'high'],
  ['render',      'medium'],
  ['driver',      'high'],
  ['patch',       'medium'],

  // Emerging tech
  ['ev',          'high'],
  ['ar',          'high'],
  ['vr',          'high'],
  ['xr',          'medium'],
  ['llm',         'medium'],

  // Professional roles
  ['hr',          'high'],
  ['it',          'high'],
  ['cto',         'medium'],
  ['cfo',         'medium'],

  // Real estate
  ['condo',       'medium'],
  ['villa',       'high'],
  ['loft',        'medium'],
  ['flat',        'high'],

  // Healthcare
  ['drug',        'high'],
  ['cure',        'medium'],
  ['heal',        'medium'],
  ['dose',        'medium'],
  ['pill',        'medium'],

  // Lifestyle & services
  ['pet',         'ultra'],  // "pet" is a massively searched consumer term
  ['farm',        'high'],
  ['diet',        'high'],
  ['fish',        'high'],
  ['taxi',        'high'],
  ['ski',         'high'],
  ['van',         'medium'],
  ['bus',         'medium'],

  // Identity & branding
  ['logo',        'high'],
  ['name',        'high'],
  ['tag',         'medium'],
  ['trend',       'high'],
  ['brand',       'high'],
  ['safe',        'medium'],
  ['fast',        'medium'],
  ['risk',        'medium'],
]);
