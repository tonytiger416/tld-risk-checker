// 2012 ICANN new gTLD round — objection outcomes
// Sources: ICANN Objection Filings Database, WIPO LRO panel decisions,
// ICDR community objection decisions, ICANN new gTLD program documentation

// ── Community Objection outcomes ──────────────────────────────────────────
// Strings where established community institutions filed formal Community
// Objections under AGB §3.5.4 in the 2012 round.

export interface CommunityObj2012 {
  filer: string;
  outcome: 'upheld' | 'dismissed' | 'negotiated' | 'withdrawn';
  note: string;
}

export const COMMUNITY_OBJ_2012 = new Map<string, CommunityObj2012>([
  ['catholic', {
    filer: 'Pontifical Council for Social Communications (Vatican)',
    outcome: 'negotiated',
    note: 'Vatican engaged directly with applicants. Non-Catholic applicants ultimately withdrew; the string was delegated to a Vatican-endorsed operator under community-protective conditions. The same institution will almost certainly repeat this in 2026.',
  }],
  ['islam', {
    filer: 'Organisation of Islamic Cooperation (OIC) and Islamic bodies',
    outcome: 'negotiated',
    note: 'OIC and the Islamic Foundation filed community objections. Resolution required the delegated operator to implement community-endorsed policies. Major Islamic institutions have formalised their position on this namespace.',
  }],
  ['muslim', {
    filer: 'Organisation of Islamic Cooperation (OIC)',
    outcome: 'negotiated',
    note: 'Community objections filed alongside .islam. OIC regard both strings as requiring community governance; any non-endorsed applicant faces near-certain objection.',
  }],
  ['gay', {
    filer: 'GLAAD and multiple LGBTQ+ advocacy organisations',
    outcome: 'negotiated',
    note: 'Community objections required applicants to adopt community-protective registration policies. Top Level Design ultimately won .gay after committing to strong community safeguards including a dedicated registry liaison.',
  }],
  ['lgbt', {
    filer: 'Multiple LGBTQ+ advocacy organisations',
    outcome: 'negotiated',
    note: 'Community sensitivity process triggered. Applicant required to implement community-protective eligibility and content policies. LGBTQ+ organisations treated this namespace as a community asset.',
  }],
]);

// ── Legal Rights Objection (LRO) outcomes ─────────────────────────────────
// Strings where trademark holders filed LROs under AGB §3.5.1 in 2012.
// An LRO is filed by a mark holder claiming the applied-for string is
// confusingly similar to their mark and the applicant has no legitimate rights.

export interface LROOutcome2012 {
  filer: string;
  outcome: 'upheld' | 'dismissed' | 'withdrawn' | 'deferred';
  note: string;
}

export const LRO_2012 = new Map<string, LROOutcome2012>([
  ['amazon', {
    filer: 'Amazon.com, Inc.',
    outcome: 'deferred',
    note: 'Amazon.com filed LRO; simultaneously, Brazil and Peru filed GAC/geographic objections claiming .amazon as a geographic identifier for the Amazon region. ICANN Board deferred the string (Res. 2013.04.11.08). String remains contested and unresolved as of 2025 — this is the most complex objection precedent in ICANN history.',
  }],
  ['patagonia', {
    filer: 'Patagonia, Inc. (outdoor clothing brand)',
    outcome: 'withdrawn',
    note: 'Patagonia Inc. filed LRO against Nic.Patagonia LLC. The applicant ultimately withdrew. This is also a geographic name (Argentine/Chilean region), adding a second objection vector.',
  }],
  ['pioneer', {
    filer: 'Pioneer Corporation (Japan)',
    outcome: 'dismissed',
    note: 'Pioneer Corp filed LRO claiming trademark rights. WIPO panel dismissed — found that "pioneer" is a generic English word with broad commercial usage beyond Pioneer\'s brand; LRO standard (confusing similarity + bad faith) not met. Demonstrates that generic words with brand homonyms can survive LRO.',
  }],
  ['shell', {
    filer: 'Royal Dutch Shell Plc',
    outcome: 'upheld',
    note: 'Shell successfully filed LRO; the non-Shell applicant\'s application did not proceed. Shell then applied as the legitimate brand holder. Demonstrates that when a dominant global brand owns the primary trademark for a short word, LRO is an effective block.',
  }],
  ['polo', {
    filer: 'Ralph Lauren Corporation and United States Polo Association',
    outcome: 'upheld',
    note: 'Competing trademark claims from both Ralph Lauren and USPA created a complex multi-party LRO situation. Generic applicants were blocked; the string was not delegated to any generic registry in the 2012 round.',
  }],
  ['sky', {
    filer: 'Sky UK Ltd (BSkyB)',
    outcome: 'upheld',
    note: 'Sky UK (BSkyB) filed LRO against non-Sky applicants. Sky ultimately won delegation of .sky as the brand-owning entity. Short generic words that are also major brand names carry high LRO exposure.',
  }],
  ['hermes', {
    filer: 'Hermès International (luxury fashion)',
    outcome: 'dismissed',
    note: 'Hermès filed LRO against .hermes applicants. WIPO panel dismissed — "hermes" is the name of a Greek god, a common word in multiple languages, and not exclusively identified with the Hermès brand. LRO dismissed; demonstrates that classical/generic words can survive even against famous mark holders.',
  }],
]);
