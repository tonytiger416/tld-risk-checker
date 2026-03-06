// ---------------------------------------------------------------------------
// Semantic string classification for gTLD applicant strings
// Provides context-aware buyer profiles and comparable anchors to AI
// ---------------------------------------------------------------------------

export type SemanticClass =
  | 'currency_code'            // USD, EUR, GBP — sovereign/institutional buyer pool
  | 'country_iso3'             // USA, GBR, FRA — geographic/sovereign sensitivity
  | 'geo_city_abbr'            // NYC, LON, PAR — city abbreviations
  | 'geo_region'               // ASIA, EMEA — regional identifiers
  | 'lifestyle_social'         // FUN, LOVE, CLUB, VIP — consumer-facing lifestyle
  | 'professional_vertical'    // LAW, MED, TAX — regulated professions
  | 'tech_generic'             // APP, CLOUD, DEV, DATA — tech ecosystem
  | 'financial_generic'        // PAY, BANK, FUND, TRADE — finance sector
  | 'institutional_abbr'       // INC, LLC, CORP, ORG — entity/org suffixes
  | 'dictionary_word_premium'  // SHOP, NEWS, MUSIC — high-value contested words
  | 'dictionary_word_generic'  // ZONE, WORKS, TIPS — general dictionary
  | 'short_premium_generic'    // Any ≤3-char not otherwise classified
  | 'unknown';

export interface StringContext {
  semanticClass: SemanticClass;
  description: string;
  buyerProfile: string;
  regulatoryNote?: string;
}

// ---------------------------------------------------------------------------
// ISO 4217 currency codes + major crypto tickers
// ---------------------------------------------------------------------------
const CURRENCY_CODES = new Set([
  'usd', 'eur', 'gbp', 'jpy', 'cad', 'aud', 'chf', 'cny', 'cnh',
  'inr', 'krw', 'brl', 'mxn', 'sgd', 'hkd', 'nok', 'sek', 'dkk',
  'nzd', 'zar', 'thb', 'idr', 'myr', 'php', 'pln', 'czk', 'huf',
  'ils', 'clp', 'cop', 'aed', 'sar', 'qar', 'kwd', 'bhd', 'omr',
  'jod', 'lkr', 'pkr', 'bdt', 'vnd', 'egp', 'ngn', 'ghs', 'kes',
  'tsh', 'mad', 'dzd', 'tnd', 'etb', 'ugx', 'tzs', 'rwf', 'xof',
  'xaf', 'zmw', 'isk', 'hrk', 'rsd', 'bam', 'mkd', 'all', 'gel',
  'azn', 'amd', 'kzt', 'uzs', 'tmt', 'tjs', 'kgs', 'mnt', 'mmk',
  'lak', 'khr', 'bnd', 'pgk', 'fjd', 'wst', 'top', 'vut', 'sbd',
  'ron', 'bgn', 'xdr', 'xag', 'xau', 'xpt', 'xpd',
  // Crypto
  'btc', 'eth', 'bnb', 'sol', 'ada', 'dot', 'matic', 'avax', 'atom',
  'ltc', 'xrp', 'xlm', 'eos', 'trx', 'xmr', 'doge', 'shib', 'link',
]);

// ---------------------------------------------------------------------------
// ISO 3166-1 alpha-3 country codes
// ---------------------------------------------------------------------------
const COUNTRY_ISO3 = new Set([
  'afg', 'alb', 'dza', 'and', 'ago', 'arg', 'arm', 'aus', 'aut', 'aze',
  'bhs', 'bhr', 'bgd', 'blr', 'bel', 'blz', 'ben', 'btn', 'bol', 'bih',
  'bwa', 'bra', 'brn', 'bgr', 'bfa', 'bdi', 'khm', 'cmr', 'can', 'cpv',
  'caf', 'tcd', 'chl', 'chn', 'col', 'com', 'cog', 'cri', 'hrv', 'cub',
  'cyp', 'cze', 'dnk', 'dji', 'dom', 'ecu', 'egy', 'slv', 'gnq', 'eri',
  'est', 'eth', 'fji', 'fin', 'fra', 'gab', 'gmb', 'geo', 'deu', 'gha',
  'grc', 'gtm', 'gin', 'gnb', 'guy', 'hti', 'hnd', 'hun', 'isl', 'ind',
  'idn', 'irn', 'irq', 'irl', 'isr', 'ita', 'jam', 'jpn', 'jor', 'kaz',
  'ken', 'kir', 'prk', 'kor', 'kwt', 'kgz', 'lao', 'lva', 'lbn', 'lso',
  'lbr', 'lby', 'lie', 'ltu', 'lux', 'mkd', 'mdg', 'mwi', 'mys', 'mdv',
  'mli', 'mlt', 'mhl', 'mrt', 'mus', 'mex', 'fsm', 'mda', 'mco', 'mng',
  'mne', 'mar', 'moz', 'mmr', 'nam', 'nru', 'npl', 'nld', 'nzl', 'nic',
  'ner', 'nga', 'nor', 'omn', 'pak', 'plw', 'pan', 'png', 'pry', 'per',
  'phl', 'pol', 'prt', 'qat', 'rou', 'rus', 'rwa', 'kna', 'lca', 'vct',
  'wsm', 'smr', 'stp', 'sau', 'sen', 'srb', 'sle', 'sgp', 'svk', 'svn',
  'slb', 'som', 'zaf', 'ssd', 'esp', 'lka', 'sdn', 'sur', 'swz', 'swe',
  'che', 'syr', 'twn', 'tjk', 'tza', 'tha', 'tls', 'tgo', 'ton', 'tto',
  'tun', 'tur', 'tkm', 'tuv', 'uga', 'ukr', 'are', 'gbr', 'usa', 'ury',
  'uzb', 'vut', 'ven', 'vnm', 'yem', 'zmb', 'zwe',
]);

// ---------------------------------------------------------------------------
// City abbreviations
// ---------------------------------------------------------------------------
const GEO_CITY_ABBRS = new Set([
  'nyc', 'lon', 'par', 'ber', 'tok', 'syd', 'mel', 'bne', 'dub', 'sin',
  'hkg', 'bkk', 'mum', 'del', 'bjg', 'sha', 'ams', 'bru', 'vie', 'zur',
  'gen', 'mia', 'lax', 'sfo', 'chi', 'hou', 'bos', 'sea', 'atl', 'dfw',
  'phx', 'den', 'mex', 'bog', 'bue', 'sao', 'rio', 'lag', 'nai', 'ank',
  'ist', 'war', 'pra', 'bud', 'rom', 'mil', 'mad', 'bcn', 'lis', 'osl',
]);

// ---------------------------------------------------------------------------
// Geographic regions / blocs
// ---------------------------------------------------------------------------
const GEO_REGIONS = new Set([
  'asia', 'emea', 'mena', 'apac', 'lac', 'eur', 'afr', 'pacific',
  'nordic', 'baltic', 'gulf', 'mea', 'latam', 'cis', 'asean', 'saarc',
  'atlantic', 'oceania',
]);

// ---------------------------------------------------------------------------
// Regulated professional verticals
// ---------------------------------------------------------------------------
const PROFESSIONAL_VERTICALS = new Set([
  'law', 'legal', 'lawyer', 'attorney', 'barrister', 'solicitor',
  'med', 'medical', 'doctor', 'physician', 'surgeon', 'vet', 'dental',
  'dentist', 'pharmacy', 'pharma', 'nurse', 'nursing',
  'tax', 'cpa', 'accountant', 'audit', 'auditor',
  'engineer', 'engineering', 'arch', 'architect',
  'insure', 'insurance', 'reinsurance',
  'financial', 'advisor', 'planner',
  'realtor', 'estate',
]);

// ---------------------------------------------------------------------------
// Tech generic strings
// ---------------------------------------------------------------------------
const TECH_GENERICS = new Set([
  'app', 'apps', 'web', 'website', 'cloud', 'host', 'hosting',
  'dev', 'developer', 'code', 'data', 'ai', 'ml', 'api', 'iot', 'vr', 'ar',
  'tech', 'technology', 'software', 'digital', 'cyber', 'security',
  'network', 'server', 'storage', 'database', 'analytics', 'platform',
  'solutions', 'systems', 'saas', 'paas', 'devops', 'io', 'byte', 'stream',
  'blog', 'site', 'online', 'net',
]);

// ---------------------------------------------------------------------------
// Financial generic strings
// ---------------------------------------------------------------------------
const FINANCIAL_GENERICS = new Set([
  'pay', 'payment', 'payments', 'bank', 'banking', 'finance',
  'invest', 'investment', 'capital', 'fund', 'funds',
  'trade', 'trading', 'market', 'markets', 'exchange', 'stock',
  'equity', 'bond', 'forex', 'crypto', 'defi', 'wallet',
  'cash', 'money', 'wealth', 'asset', 'assets', 'loan', 'loans',
  'mortgage', 'credit', 'debit', 'fintech',
]);

// ---------------------------------------------------------------------------
// Institutional abbreviations (corporate / intergovernmental)
// ---------------------------------------------------------------------------
const INSTITUTIONAL_ABBRS = new Set([
  'inc', 'llc', 'ltd', 'corp', 'plc', 'ag', 'sa', 'bv', 'gmbh',
  'org', 'ngo', 'npo', 'gov', 'mil', 'edu', 'int', 'igo',
  'nato', 'who', 'imf', 'wto', 'ioc', 'icc', 'icj', 'un',
]);

// ---------------------------------------------------------------------------
// High-value dictionary words with known 2012 contention history
// ---------------------------------------------------------------------------
const DICT_PREMIUM = new Set([
  'shop', 'store', 'news', 'art', 'music', 'game', 'games',
  'book', 'books', 'film', 'movie', 'movies', 'video', 'sport', 'sports',
  'travel', 'hotel', 'hotels', 'food', 'health', 'beauty', 'fashion',
  'design', 'photo', 'photos', 'photography', 'home', 'house', 'city',
  'life', 'live', 'love', 'fun', 'play', 'show', 'tv', 'radio',
  'club', 'group', 'team', 'world', 'global', 'international',
  'social', 'community', 'green', 'eco', 'solar', 'space', 'science',
  'business', 'company', 'agency', 'studio', 'brand', 'press', 'media',
  'school', 'work', 'jobs', 'career', 'careers', 'training', 'education',
]);

// ---------------------------------------------------------------------------
// Lifestyle / social strings (consumer-facing, not dictionary premium)
// ---------------------------------------------------------------------------
const LIFESTYLE_SOCIAL = new Set([
  'lik', 'vip', 'joy', 'zen', 'wow', 'yay', 'bff', 'fam', 'pals',
  'cool', 'chill', 'vibe', 'vibes', 'mood', 'tribe', 'crew', 'squad',
  'mates', 'buds', 'fans', 'star', 'glam', 'luxe', 'chic', 'elite',
  'prime', 'ace', 'gem', 'gems', 'spark', 'glow', 'bloom', 'thrive',
  'bold', 'brave', 'free', 'wild', 'dream', 'dreams', 'bliss',
  'wellness', 'yoga', 'spa', 'retreat', 'recharge', 'relax',
  'fest', 'fiesta', 'party', 'bash', 'hang', 'chill',
]);

// ---------------------------------------------------------------------------
// Main classification function
// ---------------------------------------------------------------------------
export function classifyString(s: string): StringContext {
  const l = s.toLowerCase();

  if (CURRENCY_CODES.has(l)) {
    return {
      semanticClass: 'currency_code',
      description: `".${s}" is an ISO 4217 currency code or crypto ticker. It carries institutional connotations — financial regulators, central banks, forex platforms, and fintech companies constitute the natural buyer pool, not portfolio registry operators.`,
      buyerProfile: 'Sovereign institutions, central banks, forex/payments platforms, regulated fintech operators. Not a typical portfolio-registry string — requires institutional sponsorship or compelling sector-specific use case to survive GAC scrutiny.',
      regulatoryNote: 'GAC may issue an Early Warning citing monetary sovereignty. Formal GAC advice against currency-code TLDs is precedented — the GAC has treated currency codes as analogous to country identifiers under AGB §2.2. Some governments view their currency code as a national identifier requiring government consent.',
    };
  }

  if (COUNTRY_ISO3.has(l)) {
    return {
      semanticClass: 'country_iso3',
      description: `".${s}" is an ISO 3166-1 alpha-3 country code. Geographic strings of this type raise strong GAC sensitivity flags and are treated as potential proxies for national identity under AGB §2.2.`,
      buyerProfile: 'National governments, country promotion bodies, sovereign-backed registries. Commercial portfolio operators face very high GAC objection risk and near-certain formal GAC advice.',
      regulatoryNote: 'AGB §2.2 explicitly addresses geographic sensitivity. GAC routinely objects to country-code-adjacent strings. Formal GAC advice is the likely outcome if the relevant government perceives this string as their national identifier.',
    };
  }

  if (GEO_CITY_ABBRS.has(l)) {
    return {
      semanticClass: 'geo_city_abbr',
      description: `".${s}" is a recognised abbreviation for a major global city. City-branded TLDs can attract municipal government interest alongside commercial operators — .nyc and .london set precedents for government-endorsed delegations.`,
      buyerProfile: 'Municipal governments, city tourism and economic development bodies, commercial operators with local-market focus. ICANN has established precedent for city-branded TLDs.',
      regulatoryNote: 'GAC or LPI objection possible if the relevant municipal government opposes commercial delegation. Some cities assert rights over their abbreviations as civic identifiers.',
    };
  }

  if (GEO_REGIONS.has(l)) {
    return {
      semanticClass: 'geo_region',
      description: `".${s}" is a recognised geographic region or trade-bloc identifier. Regional strings attract both commercial operators and intergovernmental organisation interest.`,
      buyerProfile: 'Regional trade organisations, commercial operators serving regional markets, and intergovernmental bodies. Moderate GAC sensitivity.',
      regulatoryNote: 'Regional identifiers can attract GAC commentary if a trade bloc or regional organisation views the string as representing their constituency.',
    };
  }

  if (INSTITUTIONAL_ABBRS.has(l)) {
    return {
      semanticClass: 'institutional_abbr',
      description: `".${s}" is an institutional abbreviation — a corporate entity suffix or intergovernmental organisation identifier. These strings carry high regulatory sensitivity and ICANN has an established deferral precedent.`,
      buyerProfile: 'Very limited commercial operator interest. Primarily institutional or governmental applicants. ICANN Board deferred .corp, .home, .mail in 2018 (Res. 2018.02.08.05). Some strings in this class may still be deferred.',
      regulatoryNote: 'GAC formally advised against .corp, .inc, .llc, .ltd in the 2012 round. Several institutional abbreviations remain on ICANN\'s deferred string list. Verify current AGB deferred string annex before applying.',
    };
  }

  if (PROFESSIONAL_VERTICALS.has(l)) {
    return {
      semanticClass: 'professional_vertical',
      description: `".${s}" corresponds to a regulated professional sector. ICANN applies heightened scrutiny to strings with strong association to licensed professions under AGB §2.1.`,
      buyerProfile: 'Professional associations, regulatory bodies, and sector-specific registries are preferred applicants. ICANN may require registry-level policies restricting registrations to licensed practitioners (as it did for .pharmacy and .bank).',
      regulatoryNote: 'LPI objection risk is elevated — public health/safety bodies and professional licensing organisations have standing under AGB §3.5.2. Consumer protection grounds are the primary LPI basis for professional-vertical strings.',
    };
  }

  if (TECH_GENERICS.has(l)) {
    return {
      semanticClass: 'tech_generic',
      description: `".${s}" is a technology-sector generic string. These attract the broadest applicant pool — Google, Amazon, and portfolio registries (Identity Digital, Radix, GMO) systematically target tech generics.`,
      buyerProfile: 'Big Tech (Google, Amazon, Microsoft), portfolio registry operators (Identity Digital/Donuts, Radix, GMO Registry), and sector-focused operators. Auction is almost certain for any tech generic with meaningful search volume.',
    };
  }

  if (FINANCIAL_GENERICS.has(l)) {
    return {
      semanticClass: 'financial_generic',
      description: `".${s}" is a finance-sector generic string. Financial generics attract bank/fintech applicants alongside portfolio registry operators and command elevated auction prices.`,
      buyerProfile: 'Financial institutions, fintech operators, and portfolio registries. The buyer pool is institutionally heavy — banks and payment networks may apply for defensive or strategic reasons alongside commercial registries.',
      regulatoryNote: 'Financial regulators (SEC, FCA, ECB) have commented on financial-sector TLD applications. LPI objection by consumer finance protection bodies or national financial regulators is possible under AGB §3.5.2.',
    };
  }

  if (LIFESTYLE_SOCIAL.has(l)) {
    return {
      semanticClass: 'lifestyle_social',
      description: `".${s}" is a lifestyle or social-identity string — consumer-facing, aspirational, and broad in appeal. These strings attract portfolio registry operators targeting the consumer internet market.`,
      buyerProfile: 'Portfolio registry operators (Identity Digital, Radix, GMO, Uniregistry successors) and consumer internet companies. Lifestyle strings typically see 2–6 applicants with moderate auction prices.',
    };
  }

  if (DICT_PREMIUM.has(l)) {
    return {
      semanticClass: 'dictionary_word_premium',
      description: `".${s}" is a high-value generic dictionary word with broad consumer appeal and strong search intent. These strings attracted the most applicants and highest auction prices in the 2012 round.`,
      buyerProfile: 'Portfolio registry operators (Identity Digital, Radix, GMO), Big Tech (Google, Amazon), and sector-specialist operators. Auction is highly likely for any premium dictionary word.',
    };
  }

  if (s.length <= 3) {
    return {
      semanticClass: 'short_premium_generic',
      description: `".${s}" is a short 3-character string. Short strings command premium demand regardless of meaning — they are scarce, versatile, and highly memorable as namespace assets.`,
      buyerProfile: 'Portfolio registry operators and strategic investors. Any 3-character generic string is inherently valuable. Buyer pool is broad — operators that might not contest a longer string will compete for a 3-char.',
    };
  }

  return {
    semanticClass: 'unknown',
    description: `".${s}" is a general string without a dominant semantic class. Assessment is based on engine signals and comparable market data.`,
    buyerProfile: 'Buyer pool depends on the specific use case and industry vertical. Consult engine flags and category scores for guidance.',
  };
}
