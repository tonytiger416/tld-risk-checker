// 2012 ICANN new gTLD round — contention set outcomes
// Sources: ICANN Application Status Portal, ICANN auction results, IRP decisions,
// ICANN new gTLD delegated strings registry, public applicant filings

export interface Outcome2012 {
  /** Total applications filed for this string in 2012 */
  applicantCount: number;
  /** Notable applicants (not exhaustive — sourced from ICANN application list) */
  notable: string[];
  /** How the contention set was resolved */
  outcome: 'auction' | 'private' | 'community';
  /** Winner of the auction or private resolution */
  winner?: string;
  /** Final ICANN auction price in USD millions (only where publicly confirmed) */
  priceMn?: number;
  /** Year contention was resolved */
  year?: number;
  /** Additional context */
  note?: string;
}

// Outcomes for strings that formed contention sets in the 2012 round.
// Used to enrich contention flags with specific historical evidence.
export const OUTCOMES_2012 = new Map<string, Outcome2012>([

  // ── Mega-auctions (price publicly confirmed) ────────────────────────────
  ['web',     {
    applicantCount: 11,
    notable: ['Nu Dot Co (Verisign-backed)', 'Radix', 'Donuts', 'Amazon', 'Minds + Machines'],
    outcome: 'auction', winner: 'Nu Dot Co (Verisign-backed)', priceMn: 135, year: 2016,
    note: 'Highest price ever paid for any new gTLD string; second IRP (Altanovo v. ICANN) was still active in 2025',
  }],
  ['shop',    {
    applicantCount: 9,
    notable: ['GMO Registry', 'Amazon', 'Donuts', 'Radix', 'Minds + Machines'],
    outcome: 'auction', winner: 'GMO Registry', priceMn: 41.5, year: 2016,
    note: 'Second-highest price paid; GMO Registry (Japan) outbid Amazon and Donuts',
  }],
  ['blog',    {
    applicantCount: 7,
    notable: ['Automattic (WordPress parent)', 'Amazon', 'Donuts'],
    outcome: 'auction', winner: 'Automattic', priceMn: 19, year: 2016,
  }],
  ['app',     {
    applicantCount: 13,
    notable: ['Google (Charleston Road Registry)', 'Amazon', 'Donuts', 'Radix'],
    outcome: 'auction', winner: 'Google (Charleston Road Registry)', priceMn: 25, year: 2015,
    note: 'Google also separately acquired .dev and .page at auction',
  }],
  ['art',     {
    applicantCount: 4,
    notable: ['UK Creative Ideas', 'Donuts', 'Minds + Machines'],
    outcome: 'auction', winner: 'UK Creative Ideas Ltd', priceMn: 7.7, year: 2016,
  }],

  // ── Community Priority Evaluation bypasses ──────────────────────────────
  ['music',   {
    applicantCount: 7,
    notable: ['dotMusic (community applicant)', 'Donuts', 'Amazon', 'Radix'],
    outcome: 'community', winner: 'dotMusic / CMUSIC',
    note: 'Community Priority Evaluation invoked; music industry body received priority and bypassed all generic applicants without auction. Direct CPE precedent for 2026.',
  }],
  ['eco',     {
    applicantCount: 3,
    notable: ['Big Room Inc (environmental community)', 'Donuts'],
    outcome: 'community', winner: 'Big Room Inc',
    note: 'Environmental community application won under CPE; generic applicants received nothing',
  }],
  ['sport',   {
    applicantCount: 2,
    notable: ['SportAccord / GAISF (sports governing bodies)', 'Donuts'],
    outcome: 'community', winner: 'SportAccord (Global Assoc. of Intl Sports Federations)',
    note: 'Sports governing body community application won under CPE, bypassing generic applicant',
  }],

  // ── Private agreements ──────────────────────────────────────────────────
  ['hotel',   {
    applicantCount: 5,
    notable: ['Donuts', 'Minds + Machines', 'Booking Holdings'],
    outcome: 'private',
    note: 'Contention set resolved through private agreement among applicants',
  }],
  ['travel',  {
    applicantCount: 4,
    notable: ['Donuts', 'Minds + Machines', 'Tralliance'],
    outcome: 'private',
    note: 'Contention set resolved through private agreement; travel industry interest was significant',
  }],

  // ── Donuts wins (dominant portfolio applicant across generic strings) ────
  ['media',   { applicantCount: 6, notable: ['Donuts', 'Radix', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['news',    { applicantCount: 5, notable: ['Donuts', 'Minds + Machines', 'Radix'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['network', { applicantCount: 4, notable: ['Donuts', 'Radix'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['studio',  { applicantCount: 3, notable: ['Donuts', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['group',   { applicantCount: 4, notable: ['Donuts', 'Minds + Machines', 'Radix'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['live',    { applicantCount: 4, notable: ['Donuts', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['world',   { applicantCount: 5, notable: ['Donuts', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['school',  { applicantCount: 4, notable: ['Donuts', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['games',   { applicantCount: 4, notable: ['Donuts', 'Uniregistry'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['data',    { applicantCount: 3, notable: ['Donuts', 'Afilias'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['sports',  { applicantCount: 3, notable: ['Donuts', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['work',    { applicantCount: 4, notable: ['Donuts', 'Minds + Machines', 'Top Level Domain Holdings'], outcome: 'auction', winner: 'Minds + Machines', year: 2016 }],

  // ── Radix wins (second major portfolio applicant) ───────────────────────
  ['online',  { applicantCount: 6, notable: ['Radix', 'Donuts', 'Minds + Machines'], outcome: 'auction', winner: 'Radix', year: 2016 }],
  ['store',   { applicantCount: 5, notable: ['Radix', 'Donuts', 'Minds + Machines'], outcome: 'auction', winner: 'Radix', year: 2016 }],
  ['tech',    { applicantCount: 5, notable: ['Radix', 'Donuts', 'Minds + Machines'], outcome: 'auction', winner: 'Radix', year: 2016 }],

  // ── Other known outcomes ────────────────────────────────────────────────
  ['book',    { applicantCount: 3, notable: ['Amazon', 'Donuts', 'Uniregistry'], outcome: 'auction', winner: 'Amazon', year: 2016 }],
  ['play',    { applicantCount: 3, notable: ['Google (Charleston Road Registry)', 'Donuts', 'Uniregistry'], outcome: 'auction', winner: 'Google (Charleston Road Registry)', year: 2016 }],
  ['design',  { applicantCount: 4, notable: ['Top Level Design', 'Donuts', 'Minds + Machines'], outcome: 'auction', winner: 'Top Level Design', year: 2016 }],
  ['game',    { applicantCount: 3, notable: ['Uniregistry', 'Donuts'], outcome: 'auction', winner: 'Uniregistry', year: 2016 }],
  ['green',   { applicantCount: 4, notable: ['Afilias', 'Donuts', 'Minds + Machines'], outcome: 'auction', winner: 'Afilias', year: 2016 }],
  ['cloud',   { applicantCount: 4, notable: ['Aruba S.p.A.', 'Donuts', 'TLD Registry Ltd'], outcome: 'auction', winner: 'Aruba S.p.A.', year: 2016 }],
  ['film',    { applicantCount: 3, notable: ['Motion Picture Domain Registry', 'Donuts'], outcome: 'community', winner: 'Motion Picture Domain Registry', note: 'Film industry body application; community designation contested and ultimately upheld' }],

  // ── Additional Donuts wins (systematic portfolio applicant) ─────────────
  // Donuts applied for 307 strings in 2012; it merged with Afilias in 2022 to form Identity Digital (~300 TLD portfolio)
  // All of these strings are currently operated by Identity Digital and will almost certainly be defended in 2026
  ['agency',       { applicantCount: 3, notable: ['Donuts', 'Afilias', 'United TLD Holdco'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['capital',      { applicantCount: 3, notable: ['Donuts', 'Minds + Machines', 'Top Level Domain Holdings'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['careers',      { applicantCount: 3, notable: ['Donuts', 'Afilias', 'United TLD Holdco'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['community',    { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['digital',      { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['events',       { applicantCount: 4, notable: ['Donuts', 'Afilias', 'Minds + Machines', 'United TLD Holdco'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['exchange',     { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['expert',       { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['finance',      { applicantCount: 4, notable: ['Donuts', 'Afilias', 'Minds + Machines', 'United TLD Holdco'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['financial',    { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['flights',      { applicantCount: 4, notable: ['Donuts', 'Afilias', 'Minds + Machines', 'Top Level Domain Holdings'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['gallery',      { applicantCount: 4, notable: ['Donuts', 'Afilias', 'Minds + Machines', 'United TLD Holdco'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['guru',         { applicantCount: 5, notable: ['Donuts', 'Afilias', 'Minds + Machines', 'United TLD Holdco', 'Top Level Domain Holdings'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['holiday',      { applicantCount: 4, notable: ['Donuts', 'Afilias', 'Minds + Machines', 'United TLD Holdco'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['house',        { applicantCount: 4, notable: ['Donuts', 'Afilias', 'Minds + Machines', 'Top Level Domain Holdings'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['international',{ applicantCount: 4, notable: ['Donuts', 'Afilias', 'Minds + Machines', 'United TLD Holdco'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['land',         { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['life',         { applicantCount: 4, notable: ['Donuts', 'Afilias', 'Minds + Machines', 'United TLD Holdco'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['limited',      { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['management',   { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['marketing',    { applicantCount: 4, notable: ['Donuts', 'Afilias', 'Minds + Machines', 'United TLD Holdco'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['money',        { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['partners',     { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['photography',  { applicantCount: 4, notable: ['Donuts', 'Afilias', 'Minds + Machines', 'Top Level Domain Holdings'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['pizza',        { applicantCount: 4, notable: ['Donuts', 'Afilias', 'Minds + Machines', 'United TLD Holdco'], outcome: 'auction', winner: 'Donuts', year: 2016, note: 'Identity Digital retains .pizza as an active registry; food-sector strings attracted strong portfolio interest.' }],
  ['plus',         { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['productions',  { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['properties',   { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['rentals',      { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['repair',       { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['run',          { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['services',     { applicantCount: 4, notable: ['Donuts', 'Afilias', 'Minds + Machines', 'United TLD Holdco'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['shoes',        { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['singles',      { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['solar',        { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['solutions',    { applicantCount: 4, notable: ['Donuts', 'Afilias', 'Minds + Machines', 'United TLD Holdco'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['support',      { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['systems',      { applicantCount: 4, notable: ['Donuts', 'Afilias', 'Minds + Machines', 'United TLD Holdco'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['team',         { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['tips',         { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['today',        { applicantCount: 4, notable: ['Donuts', 'Afilias', 'Minds + Machines', 'Top Level Domain Holdings'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['tools',        { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['tours',        { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['town',         { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['training',     { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['ventures',     { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['vision',       { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['voyage',       { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['watch',        { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['works',        { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['wtf',          { applicantCount: 3, notable: ['Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Donuts', year: 2016 }],
  ['zone',         { applicantCount: 4, notable: ['Donuts', 'Afilias', 'Minds + Machines', 'United TLD Holdco'], outcome: 'auction', winner: 'Donuts', year: 2016 }],

  // ── Google wins (Charleston Road Registry) ──────────────────────────────
  ['dev',      { applicantCount: 5, notable: ['Google (Charleston Road Registry)', 'Donuts', 'Amazon', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Google (Charleston Road Registry)', year: 2016, note: 'Google operates .dev as an active developer-focused namespace; near-certain to re-apply in 2026.' }],
  ['page',     { applicantCount: 3, notable: ['Google (Charleston Road Registry)', 'Donuts', 'Afilias'], outcome: 'auction', winner: 'Google (Charleston Road Registry)', year: 2016 }],

  // ── Radix wins (second-largest portfolio operator) ───────────────────────
  ['site',     { applicantCount: 4, notable: ['Radix', 'Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Radix', year: 2016, note: 'Radix operates .site as a major flagship; will re-apply.' }],
  ['fun',      { applicantCount: 3, notable: ['Radix', 'Donuts', 'Minds + Machines'], outcome: 'auction', winner: 'Radix', year: 2016 }],
  ['press',    { applicantCount: 3, notable: ['Radix', 'Donuts', 'Afilias'], outcome: 'auction', winner: 'Radix', year: 2016 }],
  ['host',     { applicantCount: 3, notable: ['Radix', 'Donuts', 'Afilias'], outcome: 'auction', winner: 'Radix', year: 2016 }],
  ['website',  { applicantCount: 4, notable: ['Radix', 'Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'Radix', year: 2016 }],
  ['space',    { applicantCount: 4, notable: ['DotSpace Registry', 'Donuts', 'Afilias', 'Minds + Machines'], outcome: 'auction', winner: 'DotSpace Registry', year: 2016 }],

  // ── Other operators ──────────────────────────────────────────────────────
  ['xyz',   { applicantCount: 3, notable: ['XYZ.com LLC', 'Donuts', 'Minds + Machines'], outcome: 'auction', winner: 'XYZ.com LLC', year: 2014, note: '.xyz became one of the most-registered new gTLDs globally (10M+ registrations). XYZ.com is a major portfolio operator and will re-apply.' }],
  ['beer',  { applicantCount: 3, notable: ['Minds + Machines', 'Donuts', 'Afilias'], outcome: 'auction', winner: 'Minds + Machines', year: 2014, note: 'Minds + Machines (now part of Identity Digital) won .beer; food/beverage sector strings attracted strong portfolio interest.' }],
  ['black', { applicantCount: 3, notable: ['Uniregistry', 'Donuts', 'Afilias'], outcome: 'auction', winner: 'Uniregistry', year: 2016 }],
  ['pink',  { applicantCount: 3, notable: ['Uniregistry', 'Donuts', 'Afilias'], outcome: 'auction', winner: 'Uniregistry', year: 2016 }],
  ['red',   { applicantCount: 3, notable: ['Uniregistry', 'Donuts', 'Afilias'], outcome: 'auction', winner: 'Uniregistry', year: 2016 }],
  ['blue',  { applicantCount: 3, notable: ['Afilias', 'Donuts', 'Minds + Machines'], outcome: 'auction', winner: 'Afilias', year: 2016 }],
]);

// Strings where 2012 applicants withdrew specifically due to GAC Early Warnings.
// Used to strengthen EVAL-GAC flag detail with real historical examples.
export const GAC_WITHDRAWALS_2012 = new Set([
  'army', 'navy', 'airforce', 'military', 'police',
]);
