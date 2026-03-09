// ---------------------------------------------------------------------------
// gTLD price database — 2012 new gTLD round outcomes
// Used to provide string-specific comparable price anchors to AI analysis
// ---------------------------------------------------------------------------

import type { SemanticClass } from './string-context';

export type ResolutionMechanism = 'auction' | 'private' | 'community' | 'deferred' | 'single';

export interface PriceRecord {
  tld: string;
  semanticClass: SemanticClass;
  mechanism: ResolutionMechanism;
  priceMn?: number;    // auction/private price in millions USD (if known)
  approx?: boolean;    // true if price is approximate / sourced indirectly
  buyer?: string;
  year?: number;
  applicants: number;
  notes?: string;
  era?: '2012' | '2026_outlook';  // omitted = 2012 actual; 2026_outlook = forward estimate
}

// ---------------------------------------------------------------------------
// Comprehensive 2012 round price records
// Sources: ICANN auction results public data, industry reports, news coverage
// ---------------------------------------------------------------------------
export const PRICE_RECORDS: PriceRecord[] = [
  // ---- TECH GENERICS -------------------------------------------------------
  {
    tld: 'web', semanticClass: 'tech_generic', mechanism: 'auction',
    priceMn: 135, buyer: 'Nu Dot Co (Verisign-backed)', year: 2016, applicants: 11,
    notes: 'highest price ever paid for a new gTLD string; second IRP (Altanovo v. ICANN) ongoing 2026',
  },
  {
    tld: 'app', semanticClass: 'tech_generic', mechanism: 'auction',
    priceMn: 25, buyer: 'Google (Charleston Road Registry)', year: 2015, applicants: 13,
    notes: 'Google outbid Amazon and others; .app now one of the fastest-growing new gTLDs',
  },
  {
    tld: 'blog', semanticClass: 'tech_generic', mechanism: 'auction',
    priceMn: 19, buyer: 'Automattic (WordPress)', year: 2017, applicants: 12,
    notes: 'Automattic acquired to protect WordPress ecosystem',
  },
  {
    tld: 'online', semanticClass: 'tech_generic', mechanism: 'auction',
    priceMn: 8.05, approx: true, buyer: 'Radix', year: 2016, applicants: 11,
    notes: 'one of Radix\'s flagship generics; large registration volume post-delegation',
  },
  {
    tld: 'site', semanticClass: 'tech_generic', mechanism: 'auction',
    priceMn: 7.4, approx: true, buyer: 'Radix', year: 2016, applicants: 10,
    notes: 'contested by multiple portfolio operators; Radix won at auction',
  },
  {
    tld: 'cloud', semanticClass: 'tech_generic', mechanism: 'auction',
    priceMn: 4.79, approx: true, buyer: 'Aruba S.p.A.', year: 2016, applicants: 8,
    notes: 'Aruba beat Donuts, Radix and others; cloud demand has only grown since 2012',
  },
  {
    tld: 'data', semanticClass: 'tech_generic', mechanism: 'private',
    buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 5,
    notes: 'resolved via private agreement before auction',
  },
  {
    tld: 'tech', semanticClass: 'tech_generic', mechanism: 'auction',
    priceMn: 6.76, buyer: 'Radix (Dot Tech LLC)', year: 2014, applicants: 6,
    notes: 'confirmed ICANN auction Sep 2014; strong post-delegation performance; Radix portfolio anchor',
  },
  {
    tld: 'digital', semanticClass: 'tech_generic', mechanism: 'auction',
    priceMn: 1.9, approx: true, buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 7,
    notes: 'Donuts systematically acquired a large portfolio of digital-sector strings',
  },
  {
    tld: 'software', semanticClass: 'tech_generic', mechanism: 'single',
    buyer: 'Donuts (now Identity Digital)', year: 2014, applicants: 1,
    notes: 'no contention; delegated to Donuts as part of portfolio application',
  },
  {
    tld: 'network', semanticClass: 'tech_generic', mechanism: 'private',
    buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 4,
    notes: 'Donuts resolved contention privately',
  },
  {
    tld: 'hosting', semanticClass: 'tech_generic', mechanism: 'single',
    buyer: 'Donuts (now Identity Digital)', year: 2014, applicants: 1,
    notes: 'uncontested',
  },
  {
    tld: 'dev', semanticClass: 'tech_generic', mechanism: 'auction',
    priceMn: 1.73, approx: true, buyer: 'Google (Charleston Road Registry)', year: 2015, applicants: 5,
    notes: '.dev opened to public 2019; Google enforces HTTPS-only policy',
  },
  {
    tld: 'media', semanticClass: 'tech_generic', mechanism: 'private',
    buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 6,
    notes: 'Donuts resolved contention privately with other applicants',
  },

  // ---- DICTIONARY WORD PREMIUM ---------------------------------------------
  {
    tld: 'shop', semanticClass: 'dictionary_word_premium', mechanism: 'auction',
    priceMn: 41.5, buyer: 'GMO Registry', year: 2016, applicants: 9,
    notes: 'second-highest new gTLD auction price; GMO now markets .shop globally',
  },
  {
    tld: 'music', semanticClass: 'dictionary_word_premium', mechanism: 'auction',
    priceMn: 21.5, approx: true, buyer: 'Far Further (Amazon-backed)', year: 2017, applicants: 13,
    notes: 'highly contested; community applicants (Minds + Machines) also competed; eventual auction winner Far Further linked to Amazon',
  },
  {
    tld: 'news', semanticClass: 'dictionary_word_premium', mechanism: 'auction',
    priceMn: 8.5, approx: true, buyer: 'Afilias (now Identity Digital)', year: 2016, applicants: 8,
    notes: 'Afilias beat Donuts and GMO; Afilias merged into Identity Digital 2022',
  },
  {
    tld: 'art', semanticClass: 'dictionary_word_premium', mechanism: 'auction',
    priceMn: 7.77, buyer: 'UK Creative Ideas Foundation', year: 2016, applicants: 10,
    notes: 'specialist cultural operator won over portfolio registries; cultural community angle was decisive',
  },
  {
    tld: 'store', semanticClass: 'dictionary_word_premium', mechanism: 'auction',
    priceMn: 2.43, approx: true, buyer: 'Radix', year: 2015, applicants: 9,
    notes: 'Radix core portfolio; .store has strong e-commerce registration volumes',
  },
  {
    tld: 'design', semanticClass: 'dictionary_word_premium', mechanism: 'auction',
    priceMn: 3.49, approx: true, buyer: 'Top Level Design', year: 2015, applicants: 7,
    notes: 'specialist design-community operator; relatively lower price reflects niche appeal',
  },
  {
    tld: 'book', semanticClass: 'dictionary_word_premium', mechanism: 'private',
    buyer: 'Amazon', year: 2015, applicants: 5,
    notes: 'Amazon resolved contention privately; .book reserved for Amazon use',
  },
  {
    tld: 'movie', semanticClass: 'dictionary_word_premium', mechanism: 'private',
    buyer: 'Amazon', year: 2015, applicants: 5,
    notes: 'Amazon private resolution; reserved for Amazon streaming services',
  },
  {
    tld: 'game', semanticClass: 'dictionary_word_premium', mechanism: 'private',
    buyer: 'Google (Charleston Road Registry)', year: 2015, applicants: 5,
    notes: 'Google private resolution; .game reserved for internal use',
  },
  {
    tld: 'play', semanticClass: 'dictionary_word_premium', mechanism: 'private',
    buyer: 'Google (Charleston Road Registry)', year: 2015, applicants: 4,
    notes: 'Google private resolution; .play tied to Google Play brand',
  },
  {
    tld: 'health', semanticClass: 'dictionary_word_premium', mechanism: 'auction',
    priceMn: 3.1, approx: true, buyer: 'Donuts (now Identity Digital)', year: 2016, applicants: 6,
    notes: 'health strings attract LPI scrutiny; ICANN required enhanced registry safeguards',
  },
  {
    tld: 'food', semanticClass: 'dictionary_word_premium', mechanism: 'private',
    buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 5,
    notes: 'Donuts private resolution',
  },
  {
    tld: 'sport', semanticClass: 'dictionary_word_premium', mechanism: 'private',
    buyer: 'SportAccord / Global Association of International Sports Federations', year: 2014, applicants: 2,
    notes: 'SportAccord community application; received community priority',
  },
  {
    tld: 'hotel', semanticClass: 'dictionary_word_premium', mechanism: 'private',
    buyer: 'Booking Holdings / NH Hotel Group consortium', year: 2015, applicants: 9,
    notes: 'largest 2012 contention set by number of applicants that resolved via private agreement',
  },
  {
    tld: 'hotels', semanticClass: 'dictionary_word_premium', mechanism: 'auction',
    priceMn: 2.2, buyer: 'Booking.com B.V.', year: 2015, applicants: 3,
    notes: 'confirmed ICANN auction Nov 2015; Booking.com secured plural travel vertical string',
  },
  {
    tld: 'realty', semanticClass: 'dictionary_word_premium', mechanism: 'auction',
    priceMn: 5.59, buyer: 'Fegistry LLC', year: 2014, applicants: 3,
    notes: 'confirmed ICANN auction Oct 2014; real estate professional vertical',
  },
  {
    tld: 'buy', semanticClass: 'dictionary_word_premium', mechanism: 'auction',
    priceMn: 4.59, buyer: 'Amazon EU S.à r.l.', year: 2014, applicants: 5,
    notes: 'confirmed ICANN auction Sep 2014 at $4,588,888; Amazon e-commerce namespace acquisition',
  },
  {
    tld: 'baby', semanticClass: 'lifestyle_social', mechanism: 'auction',
    priceMn: 3.09, buyer: 'Johnson & Johnson Services Inc.', year: 2014, applicants: 3,
    notes: 'confirmed ICANN auction Dec 2014 at $3,088,888; brand operator won over portfolio registries',
  },
  {
    tld: 'spot', semanticClass: 'short_premium_generic', mechanism: 'auction',
    priceMn: 2.2, buyer: 'Amazon EU S.à r.l.', year: 2014, applicants: 3,
    notes: 'confirmed ICANN auction Oct 2014; Amazon strategic acquisition of 4-char generic',
  },
  {
    tld: 'salon', semanticClass: 'lifestyle_social', mechanism: 'auction',
    priceMn: 5.1, buyer: 'Outer Orchard LLC', year: 2014, applicants: 4,
    notes: 'confirmed ICANN auction Oct 2014 at $5,100,575; beauty/lifestyle vertical; specialist operator won',
  },
  {
    tld: 'travel', semanticClass: 'dictionary_word_premium', mechanism: 'private',
    buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 6,
    notes: 'Donuts private resolution; existing .travel operator also competed',
  },
  {
    tld: 'beauty', semanticClass: 'dictionary_word_premium', mechanism: 'auction',
    priceMn: 1.35, approx: true, buyer: 'L\'Oréal', year: 2016, applicants: 5,
    notes: 'major brand operator won against portfolio registries; brand TLD strategy',
  },
  {
    tld: 'fashion', semanticClass: 'dictionary_word_premium', mechanism: 'auction',
    priceMn: 2.0, approx: true, buyer: 'Donuts (now Identity Digital)', year: 2016, applicants: 5,
    notes: 'Donuts won contested fashion-sector string',
  },
  {
    tld: 'home', semanticClass: 'dictionary_word_premium', mechanism: 'deferred',
    applicants: 9,
    notes: 'deferred by ICANN Board Res. 2018.02.08.05 — potential for name collision with home.arpa. Status in 2026 round TBD.',
  },
  {
    tld: 'live', semanticClass: 'dictionary_word_premium', mechanism: 'auction',
    priceMn: 1.1, approx: true, buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 5,
    notes: 'Donuts portfolio acquisition',
  },
  {
    tld: 'press', semanticClass: 'dictionary_word_premium', mechanism: 'auction',
    priceMn: 0.85, approx: true, buyer: 'Radix', year: 2015, applicants: 4,
    notes: 'Radix portfolio',
  },
  {
    tld: 'photo', semanticClass: 'dictionary_word_premium', mechanism: 'auction',
    priceMn: 0.75, approx: true, buyer: 'Uniregistry', year: 2015, applicants: 4,
    notes: 'Uniregistry (now GoDaddy) portfolio string',
  },
  {
    tld: 'studio', semanticClass: 'dictionary_word_premium', mechanism: 'auction',
    priceMn: 0.6, approx: true, buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 5,
    notes: 'Donuts creative-sector portfolio',
  },
  {
    tld: 'world', semanticClass: 'dictionary_word_premium', mechanism: 'auction',
    priceMn: 0.8, approx: true, buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 6,
    notes: 'Donuts portfolio',
  },
  {
    tld: 'life', semanticClass: 'dictionary_word_premium', mechanism: 'auction',
    priceMn: 0.7, approx: true, buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 5,
    notes: 'Donuts lifestyle portfolio',
  },
  {
    tld: 'community', semanticClass: 'dictionary_word_premium', mechanism: 'single',
    buyer: 'Donuts (now Identity Digital)', year: 2014, applicants: 1,
    notes: 'uncontested Donuts application',
  },
  {
    tld: 'global', semanticClass: 'dictionary_word_premium', mechanism: 'auction',
    priceMn: 1.3, approx: true, buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 5,
    notes: 'Donuts beat Radix and others',
  },
  {
    tld: 'social', semanticClass: 'dictionary_word_premium', mechanism: 'single',
    buyer: 'Donuts (now Identity Digital)', year: 2014, applicants: 1,
    notes: 'uncontested',
  },
  {
    tld: 'space', semanticClass: 'dictionary_word_premium', mechanism: 'auction',
    priceMn: 0.5, approx: true, buyer: 'Radix', year: 2015, applicants: 4,
    notes: 'Radix portfolio string',
  },
  {
    tld: 'eco', semanticClass: 'dictionary_word_premium', mechanism: 'community',
    buyer: 'Big Room Inc. (sustainability community)', year: 2017, applicants: 5,
    notes: 'community applicant Big Room Inc. won CPE over portfolio registries; strong sustainability mandate',
  },
  {
    tld: 'radio', semanticClass: 'dictionary_word_premium', mechanism: 'community',
    buyer: 'European Broadcasting Union', year: 2017, applicants: 4,
    notes: 'EBU won CPE; community priority eliminated all commercial applicants without auction',
  },

  // ---- FINANCIAL GENERICS --------------------------------------------------
  {
    tld: 'bank', semanticClass: 'financial_generic', mechanism: 'single',
    buyer: 'fTLD Registry Services (banking industry consortium)', year: 2014, applicants: 1,
    notes: 'industry-controlled registry with strict verification requirements for SLD registrants',
  },
  {
    tld: 'pay', semanticClass: 'financial_generic', mechanism: 'auction',
    priceMn: 2.2, approx: true, buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 5,
    notes: 'fintech interest from PayPal and others; Donuts won at auction',
  },
  {
    tld: 'money', semanticClass: 'financial_generic', mechanism: 'auction',
    priceMn: 1.5, approx: true, buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 4,
    notes: 'Donuts financial-sector portfolio',
  },
  {
    tld: 'fund', semanticClass: 'financial_generic', mechanism: 'auction',
    priceMn: 0.9, approx: true, buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 3,
    notes: 'financial-sector string; Donuts portfolio',
  },
  {
    tld: 'trade', semanticClass: 'financial_generic', mechanism: 'auction',
    priceMn: 1.8, approx: true, buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 4,
    notes: 'finance/commerce crossover string',
  },
  {
    tld: 'market', semanticClass: 'financial_generic', mechanism: 'auction',
    priceMn: 1.1, approx: true, buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 4,
    notes: 'Donuts portfolio; .markets separately won by Donuts',
  },
  {
    tld: 'exchange', semanticClass: 'financial_generic', mechanism: 'auction',
    priceMn: 0.8, approx: true, buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 3,
    notes: 'Donuts financial-sector portfolio',
  },
  {
    tld: 'credit', semanticClass: 'financial_generic', mechanism: 'auction',
    priceMn: 1.05, approx: true, buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 3,
    notes: 'financial-sector string with consumer credit connotations',
  },
  {
    tld: 'capital', semanticClass: 'financial_generic', mechanism: 'auction',
    priceMn: 0.95, approx: true, buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 4,
    notes: 'Donuts investment/finance portfolio',
  },
  {
    tld: 'finance', semanticClass: 'financial_generic', mechanism: 'auction',
    priceMn: 1.2, approx: true, buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 4,
    notes: 'Donuts financial-sector portfolio; ICANN applied enhanced safeguards',
  },
  {
    tld: 'financial', semanticClass: 'financial_generic', mechanism: 'single',
    buyer: 'Donuts (now Identity Digital)', year: 2014, applicants: 1,
    notes: 'uncontested application',
  },
  {
    tld: 'invest', semanticClass: 'financial_generic', mechanism: 'single',
    buyer: 'Donuts (now Identity Digital)', year: 2014, applicants: 1,
    notes: 'uncontested; financial-sector string',
  },
  {
    tld: 'cash', semanticClass: 'financial_generic', mechanism: 'single',
    buyer: 'Donuts (now Identity Digital)', year: 2014, applicants: 1,
    notes: 'uncontested Donuts application',
  },

  // ---- PROFESSIONAL VERTICALS ----------------------------------------------
  {
    tld: 'law', semanticClass: 'professional_vertical', mechanism: 'private',
    buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 3,
    notes: 'Donuts private resolution; legal-sector strings attract bar association commentary',
  },
  {
    tld: 'legal', semanticClass: 'professional_vertical', mechanism: 'single',
    buyer: 'Donuts (now Identity Digital)', year: 2014, applicants: 1,
    notes: 'uncontested; ICANN applied enhanced safeguards for legal professional strings',
  },
  {
    tld: 'dental', semanticClass: 'professional_vertical', mechanism: 'single',
    buyer: 'Donuts (now Identity Digital)', year: 2014, applicants: 1,
    notes: 'professional health-sector string; ICANN enhanced safeguards applied',
  },
  {
    tld: 'tax', semanticClass: 'professional_vertical', mechanism: 'single',
    buyer: 'Donuts (now Identity Digital)', year: 2014, applicants: 1,
    notes: 'uncontested; financial professional string',
  },
  {
    tld: 'insurance', semanticClass: 'professional_vertical', mechanism: 'auction',
    priceMn: 2.5, approx: true, buyer: 'Donuts (now Identity Digital)', year: 2015, applicants: 4,
    notes: 'high-value professional vertical; insurance industry consortium also applied',
  },
  {
    tld: 'engineer', semanticClass: 'professional_vertical', mechanism: 'single',
    buyer: 'Donuts (now Identity Digital)', year: 2014, applicants: 1,
    notes: 'uncontested',
  },
  {
    tld: 'pharmacy', semanticClass: 'professional_vertical', mechanism: 'single',
    buyer: 'PHARMACIST.COM LLC (NAP)', year: 2014, applicants: 1,
    notes: 'strict registry-level verification of licensed pharmacists; ICANN model policy',
  },

  // ---- LIFESTYLE / SOCIAL --------------------------------------------------
  {
    tld: 'club', semanticClass: 'lifestyle_social', mechanism: 'auction',
    priceMn: 0.8, approx: true, buyer: '.CLUB Domains LLC', year: 2015, applicants: 4,
    notes: 'niche operator won over portfolio registries; built dedicated .club registry',
  },
  {
    tld: 'fun', semanticClass: 'lifestyle_social', mechanism: 'auction',
    priceMn: 0.65, approx: true, buyer: 'Radix', year: 2015, applicants: 4,
    notes: 'Radix lifestyle portfolio',
  },
  {
    tld: 'love', semanticClass: 'lifestyle_social', mechanism: 'single',
    buyer: 'Merchant Law Group LLP', year: 2014, applicants: 1,
    notes: 'uncontested niche application',
  },
  {
    tld: 'vip', semanticClass: 'lifestyle_social', mechanism: 'auction',
    priceMn: 3.0, buyer: 'Minds + Machines Group Limited', year: 2014, applicants: 2,
    notes: 'confirmed ICANN auction Sep 2014 at $3,000,888; Minds + Machines beat one other applicant',
  },
  {
    tld: 'yoga', semanticClass: 'lifestyle_social', mechanism: 'single',
    buyer: 'Donuts (now Identity Digital)', year: 2014, applicants: 1,
    notes: 'uncontested wellness-lifestyle string',
  },
  {
    tld: 'style', semanticClass: 'lifestyle_social', mechanism: 'single',
    buyer: 'Donuts (now Identity Digital)', year: 2014, applicants: 1,
    notes: 'uncontested lifestyle string',
  },
  {
    tld: 'fit', semanticClass: 'lifestyle_social', mechanism: 'single',
    buyer: 'Donuts (now Identity Digital)', year: 2014, applicants: 1,
    notes: 'uncontested health/lifestyle string',
  },
  {
    tld: 'cool', semanticClass: 'lifestyle_social', mechanism: 'single',
    buyer: 'Donuts (now Identity Digital)', year: 2014, applicants: 1,
    notes: 'uncontested lifestyle/slang string',
  },

  // ---- INSTITUTIONAL ABBREVIATIONS -----------------------------------------
  {
    tld: 'corp', semanticClass: 'institutional_abbr', mechanism: 'deferred',
    applicants: 4,
    notes: 'deferred by ICANN Board Res. 2018.02.08.05 — name collision risk with corporate intranets. Status in 2026 TBD.',
  },
  {
    tld: 'mail', semanticClass: 'institutional_abbr', mechanism: 'deferred',
    applicants: 6,
    notes: 'deferred by ICANN Board Res. 2018.02.08.05 — name collision with legacy mail servers. Status in 2026 TBD.',
  },
  {
    tld: 'inc', semanticClass: 'institutional_abbr', mechanism: 'deferred',
    applicants: 3,
    notes: 'deferred by ICANN Board — corporate entity suffix. Currently held in reserve. Status in 2026 TBD.',
  },
  {
    tld: 'llc', semanticClass: 'institutional_abbr', mechanism: 'deferred',
    applicants: 2,
    notes: 'deferred by ICANN Board — corporate entity suffix. GAC advised against in 2012. Status in 2026 TBD.',
  },
  {
    tld: 'ltd', semanticClass: 'institutional_abbr', mechanism: 'deferred',
    applicants: 2,
    notes: 'deferred by ICANN Board — corporate entity suffix. GAC advised against in 2012. Status in 2026 TBD.',
  },
  {
    tld: 'org', semanticClass: 'institutional_abbr', mechanism: 'single',
    buyer: 'PIR (Public Interest Registry)', year: 2000, applicants: 1,
    notes: 'pre-existing gTLD not applicable as 2012 comparables — but illustrates stable institutional demand',
  },

  // ---- SHORT PREMIUM GENERICS (≤3 chars) -----------------------------------
  {
    tld: 'xyz', semanticClass: 'short_premium_generic', mechanism: 'auction',
    priceMn: 0.39, approx: true, buyer: 'XYZ.com LLC', year: 2014, applicants: 3,
    notes: 'XYZ.com launched .xyz at scale; now one of the largest new gTLDs by volume',
  },
  {
    tld: 'pro', semanticClass: 'short_premium_generic', mechanism: 'auction',
    priceMn: 0.5, approx: true, buyer: 'Afilias (now Identity Digital)', year: 2015, applicants: 4,
    notes: 'Afilias operated legacy .pro; re-applied and won contention',
  },
  {
    tld: 'one', semanticClass: 'short_premium_generic', mechanism: 'auction',
    priceMn: 0.7, approx: true, buyer: 'One.com', year: 2015, applicants: 4,
    notes: 'hosting company One.com won to protect brand; 3-char premium demand',
  },
  {
    tld: 'top', semanticClass: 'short_premium_generic', mechanism: 'auction',
    priceMn: 0.45, approx: true, buyer: 'Jiangsu Bangning Science & Technology', year: 2014, applicants: 3,
    notes: 'Chinese registry operator; .top became one of the highest-volume new gTLDs',
  },
  {
    tld: 'red', semanticClass: 'short_premium_generic', mechanism: 'auction',
    priceMn: 0.6, approx: true, buyer: 'Afilias (now Identity Digital)', year: 2015, applicants: 5,
    notes: '3-char color string; Afilias beat Donuts and others',
  },
  {
    tld: 'bid', semanticClass: 'short_premium_generic', mechanism: 'single',
    buyer: 'dot Bid Limited', year: 2014, applicants: 1,
    notes: 'uncontested 3-char auction/marketplace string',
  },
  {
    tld: 'ink', semanticClass: 'short_premium_generic', mechanism: 'single',
    buyer: 'Top Level Design', year: 2014, applicants: 1,
    notes: 'uncontested creative-sector 3-char string',
  },
  {
    tld: 'win', semanticClass: 'short_premium_generic', mechanism: 'single',
    buyer: 'First Registry Limited', year: 2014, applicants: 1,
    notes: 'uncontested 3-char generic',
  },
  {
    tld: 'run', semanticClass: 'short_premium_generic', mechanism: 'single',
    buyer: 'Donuts (now Identity Digital)', year: 2014, applicants: 1,
    notes: 'uncontested 3-char lifestyle/sports string',
  },
  {
    tld: 'now', semanticClass: 'short_premium_generic', mechanism: 'auction',
    priceMn: 0.55, approx: true, buyer: 'Amazon', year: 2015, applicants: 3,
    notes: 'Amazon acquired 3-char generic for strategic use',
  },
  {
    tld: 'new', semanticClass: 'short_premium_generic', mechanism: 'private',
    buyer: 'Charleston Road Registry (Google)', year: 2015, applicants: 3,
    notes: 'Google private resolution; acquired for internal ecosystem use',
  },
  {
    tld: 'map', semanticClass: 'short_premium_generic', mechanism: 'private',
    buyer: 'Google (Charleston Road Registry)', year: 2015, applicants: 2,
    notes: 'Google private resolution; .map tied to Google Maps brand',
  },
  {
    tld: 'fly', semanticClass: 'short_premium_generic', mechanism: 'single',
    buyer: 'Google (Charleston Road Registry)', year: 2014, applicants: 1,
    notes: 'Google 3-char acquisition; currently unused',
  },
  {
    tld: 'eat', semanticClass: 'short_premium_generic', mechanism: 'single',
    buyer: 'Google (Charleston Road Registry)', year: 2014, applicants: 1,
    notes: 'Google 3-char acquisition for food/restaurant vertical',
  },
  {
    tld: 'mov', semanticClass: 'short_premium_generic', mechanism: 'single',
    buyer: 'Google (Charleston Road Registry)', year: 2014, applicants: 1,
    notes: 'Google 3-char file-extension acquisition',
  },
  {
    tld: 'zip', semanticClass: 'short_premium_generic', mechanism: 'single',
    buyer: 'Google (Charleston Road Registry)', year: 2014, applicants: 1,
    notes: 'Google 3-char file-extension acquisition; controversy over phishing potential',
  },
  {
    tld: 'day', semanticClass: 'short_premium_generic', mechanism: 'single',
    buyer: 'Google (Charleston Road Registry)', year: 2014, applicants: 1,
    notes: 'Google 3-char calendar/lifestyle acquisition',
  },
  {
    tld: 'hot', semanticClass: 'short_premium_generic', mechanism: 'auction',
    priceMn: 0.42, approx: true, buyer: 'Uniregistry (now GoDaddy)', year: 2015, applicants: 3,
    notes: 'Frank Schilling\'s Uniregistry portfolio string',
  },

  // ---- 2026 MARKET OUTLOOK — AI / LLM VERTICAL ----------------------------
  // Forward estimates based on 2024–2025 market signals, .ai ccTLD premium
  // data, and applicant intelligence. All approx: true.
  {
    tld: 'agent', semanticClass: 'tech_generic', mechanism: 'auction',
    priceMn: 8, approx: true, year: 2026, applicants: 6, era: '2026_outlook',
    notes: '2026 outlook — AI agent/automation sector; hyperscalers, AI-native operators, and portfolio registries all likely bidders; .ai ccTLD secondary market premiums signal strong buyer appetite for AI namespace; est. $5–12M range',
  },
  {
    tld: 'bot', semanticClass: 'tech_generic', mechanism: 'auction',
    priceMn: 4, approx: true, year: 2026, applicants: 5, era: '2026_outlook',
    notes: '2026 outlook — AI chatbot / automation sector; 3-char premium amplified by LLM wave; chatbot platforms, AI infrastructure operators likely; est. $3–6M range',
  },
  {
    tld: 'model', semanticClass: 'tech_generic', mechanism: 'auction',
    priceMn: 3, approx: true, year: 2026, applicants: 4, era: '2026_outlook',
    notes: '2026 outlook — AI model/LLM naming vertical; ambiguous across AI, fashion, data modelling; Identity Digital, Radix, AI-sector operators likely; est. $2–5M range',
  },
  {
    tld: 'llm', semanticClass: 'short_premium_generic', mechanism: 'auction',
    priceMn: 3, approx: true, year: 2026, applicants: 4, era: '2026_outlook',
    notes: '2026 outlook — Large Language Model abbreviation; niche but high-value; 3-char premium; AI infrastructure operators the primary buyer pool; est. $2–5M range',
  },
  {
    tld: 'api', semanticClass: 'tech_generic', mechanism: 'auction',
    priceMn: 4, approx: true, year: 2026, applicants: 5, era: '2026_outlook',
    notes: '2026 outlook — developer/API economy string; 3-char premium; Stripe/Twilio-class operators, Google, Radix likely; developer buyer pool commands significant SLD premium; est. $3–6M range',
  },
  {
    tld: 'auth', semanticClass: 'tech_generic', mechanism: 'auction',
    priceMn: 2.5, approx: true, year: 2026, applicants: 3, era: '2026_outlook',
    notes: '2026 outlook — authentication/identity infrastructure; strategic for SSO, OAuth, and identity platform operators; Okta, Cloudflare, security-focused registries likely; est. $1.5–4M range',
  },
  {
    tld: 'secure', semanticClass: 'tech_generic', mechanism: 'auction',
    priceMn: 2, approx: true, year: 2026, applicants: 3, era: '2026_outlook',
    notes: '2026 outlook — cybersecurity vertical; enterprise security buyer pool; moderate contention; est. $1–3M range',
  },

  // ---- 2026 MARKET OUTLOOK — WEB3 / CRYPTO ---------------------------------
  {
    tld: 'crypto', semanticClass: 'financial_generic', mechanism: 'auction',
    priceMn: 8, approx: true, year: 2026, applicants: 6, era: '2026_outlook',
    notes: '2026 outlook — high GAC sensitivity (FATF, SEC, EU MiCA); web3 operators, exchanges, blockchain infrastructure firms likely; Unstoppable Domains holds blockchain .crypto but has no ICANN standing; est. $5–15M depending on regulatory climate at filing',
  },
  {
    tld: 'wallet', semanticClass: 'financial_generic', mechanism: 'auction',
    priceMn: 3, approx: true, year: 2026, applicants: 4, era: '2026_outlook',
    notes: '2026 outlook — digital wallet sector; fintech + web3 buyer pool; GAC may flag financial consumer protection; est. $2–5M range',
  },
  {
    tld: 'token', semanticClass: 'financial_generic', mechanism: 'auction',
    priceMn: 2.5, approx: true, year: 2026, applicants: 4, era: '2026_outlook',
    notes: '2026 outlook — crypto token / authentication dual meaning; web3 and enterprise identity operators; GAC sensitivity possible; est. $1.5–4M range',
  },
  {
    tld: 'defi', semanticClass: 'financial_generic', mechanism: 'auction',
    priceMn: 2, approx: true, year: 2026, applicants: 3, era: '2026_outlook',
    notes: '2026 outlook — decentralised finance sector; niche but committed buyer pool; high GAC sensitivity from financial regulators; est. $1–3M range',
  },
  {
    tld: 'chain', semanticClass: 'tech_generic', mechanism: 'auction',
    priceMn: 3, approx: true, year: 2026, applicants: 4, era: '2026_outlook',
    notes: '2026 outlook — blockchain/supply chain dual appeal; broad buyer pool beyond web3; Identity Digital, Radix, and web3-native operators likely; est. $2–5M range',
  },
];

// ---------------------------------------------------------------------------
// Semantic class groupings for fallback matching
// ---------------------------------------------------------------------------
const SEMANTIC_SIBLINGS: Record<SemanticClass, SemanticClass[]> = {
  currency_code:            ['financial_generic', 'institutional_abbr', 'short_premium_generic'],
  country_iso3:             ['geo_city_abbr', 'geo_region', 'institutional_abbr'],
  geo_city_abbr:            ['country_iso3', 'geo_region', 'short_premium_generic'],
  geo_region:               ['geo_city_abbr', 'country_iso3', 'dictionary_word_generic'],
  lifestyle_social:         ['dictionary_word_premium', 'short_premium_generic'],
  professional_vertical:    ['dictionary_word_premium', 'financial_generic'],
  tech_generic:             ['dictionary_word_premium', 'short_premium_generic'],
  financial_generic:        ['tech_generic', 'currency_code', 'dictionary_word_premium'],
  institutional_abbr:       ['currency_code', 'financial_generic'],
  dictionary_word_premium:  ['tech_generic', 'lifestyle_social', 'financial_generic'],
  dictionary_word_generic:  ['dictionary_word_premium', 'lifestyle_social'],
  short_premium_generic:    ['tech_generic', 'dictionary_word_premium', 'lifestyle_social'],
  unknown:                  ['dictionary_word_generic', 'short_premium_generic'],
};

// ---------------------------------------------------------------------------
// Get comparable price records for a given string and semantic class
// Returns up to 5 records: prioritises exact class match, then siblings
// Deprioritises deferred and uncontested (single) records for contested strings
// ---------------------------------------------------------------------------
export function getComparables(tld: string, semanticClass: SemanticClass): PriceRecord[] {
  const t = tld.toLowerCase();

  // Exclude the string itself if it appears in the database
  const pool = PRICE_RECORDS.filter(r => r.tld !== t);

  // Score each record by relevance
  type Scored = { record: PriceRecord; score: number };
  const scored: Scored[] = pool.map(r => {
    let score = 0;

    // Exact semantic class match is the primary signal
    if (r.semanticClass === semanticClass) score += 100;
    else {
      const siblings = SEMANTIC_SIBLINGS[semanticClass] ?? [];
      const siblingIdx = siblings.indexOf(r.semanticClass);
      if (siblingIdx === 0) score += 60;
      else if (siblingIdx === 1) score += 40;
      else if (siblingIdx === 2) score += 25;
    }

    // Prefer 2026 outlook records — more current than 2012 actuals
    if (r.era === '2026_outlook') score += 30;

    // Prefer records with known prices — they provide better calibration
    if (r.priceMn !== undefined) score += 20;
    if (!r.approx) score += 5;

    // Prefer auction mechanism (most informative for price discovery)
    if (r.mechanism === 'auction') score += 15;
    else if (r.mechanism === 'private') score += 8;
    else if (r.mechanism === 'community') score += 5;
    else if (r.mechanism === 'deferred') score -= 10;

    // String length affinity (short strings are more comparable to other short strings)
    if (t.length <= 3 && r.tld.length <= 3) score += 20;
    else if (t.length === 4 && r.tld.length === 4) score += 10;
    else if (Math.abs(t.length - r.tld.length) <= 1) score += 5;

    // Prefer records with higher applicant counts — more instructive for competition
    score += Math.min(r.applicants, 10);

    return { record: r, score };
  });

  // Sort by score descending, return top 5
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.record);
}
