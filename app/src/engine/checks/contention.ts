import type { CategoryResult, RiskFlag } from '../types';
import { COMMERCIAL_VALUE, SEARCH_POPULARITY } from '../data/demand';
import { OUTCOMES_2012 } from '../data/contention2012';

function build2012Detail(s: string): { detail: string; recommendation: string } {
  const out = OUTCOMES_2012.get(s);

  if (!out) {
    // No specific data — generic text
    return {
      detail: `".${s}" was applied for by multiple parties in the 2012 round, triggering a string contention set. Given continued strong demand for generic strings, it is very likely to attract multiple applicants in the 2026 round. Resolution proceeds through private agreement or ICANN auction.`,
      recommendation: 'Budget for potential auction costs (which reached tens of millions of USD for premium strings in 2012). Prepare a strong use-case narrative to differentiate your application.',
    };
  }

  const { applicantCount, notable, outcome, winner, priceMn, year, note } = out;
  const notableStr = notable.slice(0, 3).join(', ');

  if (outcome === 'community') {
    return {
      detail: `In the 2012 round, ${applicantCount} applications were filed for ".${s}" — including ${notableStr}. ${winner ? `The community application by ${winner} invoked Community Priority Evaluation (CPE) and received priority delegation, bypassing every generic applicant without an auction.` : ''} ${note ?? ''} This is a direct precedent: an organised community body has already demonstrated it can win ".${s}" through CPE in a prior round.`,
      recommendation: `Before applying, confirm whether the same or a successor community body intends to file a CPE application in 2026. A repeat CPE outcome would eliminate your application entirely regardless of financial resources or use-case strength.`,
    };
  }

  if (outcome === 'private') {
    return {
      detail: `In the 2012 round, ${applicantCount} applications were filed for ".${s}" — including ${notableStr}. The contention set was resolved through private agreement among applicants rather than proceeding to ICANN auction. ${note ?? ''} In 2026, the same operators or successors (including Identity Digital, the result of the Donuts-Afilias merger) are highly likely to re-enter.`,
      recommendation: `Research current ownership and renewal intentions of 2012 applicants. Private resolution is possible but requires negotiating leverage; budget for auction as a fallback.`,
    };
  }

  // Auction outcome
  const priceStr = priceMn ? ` at $${priceMn}M` : '';
  const yearStr = year ? ` in ${year}` : '';
  const winnerStr = winner ? `${winner} won the ICANN auction${yearStr}${priceStr}.` : `The contention set proceeded to ICANN auction${yearStr}.`;
  const priceContext = priceMn && priceMn >= 100
    ? ' This was the highest price ever paid for a new gTLD string.'
    : priceMn && priceMn >= 30
    ? ' This was among the highest prices paid for any new gTLD string.'
    : '';

  return {
    detail: `In the 2012 round, ${applicantCount} applications were filed for ".${s}" — including ${notableStr}. ${winnerStr}${priceContext} ${note ? note + '.' : ''} The operators behind these bids (Verisign, Google, Amazon, Identity Digital/Donuts, Radix) are highly likely to compete again in 2026.`,
    recommendation: priceMn
      ? `Hold a minimum auction reserve of $${Math.round(priceMn * 0.5)}M–$${priceMn}M in your business plan — 2026 prices are unlikely to be lower than 2012 given increased operator sophistication. Prepare a differentiated use-case narrative to strengthen your position in any private resolution.`
      : `Prepare for auction. Research current ownership of ".${s}" and whether the 2012 winner intends to defend the namespace — incumbent operators sometimes participate as a defensive measure.`,
  };
}

// High-demand generic strings that attracted multiple applicants in 2012 and will again
const HIGH_CONTENTION_STRINGS = new Set([
  'app', 'web', 'cloud', 'tech', 'digital', 'online', 'shop', 'store',
  'market', 'media', 'studio', 'group', 'global', 'world', 'life',
  'network', 'blog', 'news', 'game', 'games', 'play', 'sport', 'sports',
  'music', 'art', 'design', 'green', 'eco', 'smart', 'live', 'show',
  'tv', 'movie', 'film', 'food', 'eat', 'travel', 'hotel', 'book',
  'pay', 'money', 'finance', 'invest', 'trade', 'work', 'jobs', 'career',
  'health', 'fit', 'care', 'home', 'house', 'land', 'city', 'local',
  'social', 'chat', 'mail', 'email', 'data', 'ai', 'crypto', 'nft',
  'brand', 'agency', 'company', 'pro', 'plus', 'now', 'new', 'best',
  'top', 'free', 'open', 'direct', 'express', 'one', 'first', 'next',
  // Additional high-demand generics confirmed by 2012 data and market analysis
  'site', 'fun', 'press', 'host', 'website', 'space', 'dev', 'xyz',
  'legal', 'law', 'insurance', 'dental', 'events', 'luxury', 'fashion',
  'beauty', 'solutions', 'services', 'ventures', 'software', 'marketing',
  'beer', 'photos', 'photography', 'tours', 'flights', 'zone', 'run',
  'today', 'properties', 'rentals', 'financial', 'community', 'exchange',
  'support', 'systems', 'training', 'tools', 'partners', 'team', 'vision',
  'management', 'international', 'capital', 'gallery', 'watch', 'pizza',
  'singles', 'solar', 'repair', 'shoes', 'holiday', 'guru', 'expert',
  'careers', 'productions', 'limited', 'tips', 'town', 'voyage', 'wtf',
  'works', 'black', 'red', 'blue', 'pink', 'page',
]);

// Strings applied for in 2012 by multiple parties — strongest historical contention signal
const CONTENTION_2012 = new Set([
  'app', 'art', 'book', 'cloud', 'data', 'design', 'eco', 'film',
  'game', 'games', 'green', 'group', 'hotel', 'live', 'media', 'music',
  'network', 'news', 'online', 'play', 'school', 'shop', 'sport', 'sports',
  'store', 'studio', 'tech', 'travel', 'web', 'work', 'world',
  // Additional 2012 contention sets sourced from ICANN application data
  'agency', 'beer', 'black', 'blue', 'capital', 'careers', 'community',
  'dev', 'digital', 'events', 'exchange', 'expert', 'finance', 'financial',
  'flights', 'fun', 'gallery', 'guru', 'holiday', 'host', 'house',
  'international', 'land', 'life', 'limited', 'management', 'marketing',
  'money', 'page', 'partners', 'photography', 'pink', 'pizza', 'plus',
  'press', 'productions', 'properties', 'red', 'rentals', 'repair', 'run',
  'services', 'shoes', 'singles', 'site', 'solar', 'solutions', 'space',
  'support', 'systems', 'team', 'tips', 'today', 'tools', 'tours', 'town',
  'training', 'ventures', 'vision', 'voyage', 'watch', 'website', 'works',
  'wtf', 'xyz', 'zone',
]);

// Map winner names to canonical incumbent operator names for 2026
function getIncumbentName(winner: string): string {
  if (winner.includes('Donuts') || winner.includes('Afilias')) return 'Identity Digital (Donuts + Afilias merger)';
  if (winner.includes('Google') || winner.includes('Charleston Road')) return 'Google (Charleston Road Registry)';
  if (winner.includes('Radix')) return 'Radix';
  if (winner.includes('GMO')) return 'GMO Registry';
  if (winner.includes('Verisign') || winner.includes('Nu Dot Co')) return 'Verisign (via Nu Dot Co)';
  if (winner.includes('Amazon')) return 'Amazon';
  if (winner.includes('XYZ')) return 'XYZ.com LLC';
  if (winner.includes('Automattic') || winner.includes('WordPress')) return 'Automattic (WordPress)';
  return winner;
}

export function checkContention(s: string): CategoryResult {
  const flags: RiskFlag[] = [];

  const inHighContention = HIGH_CONTENTION_STRINGS.has(s);
  const in2012 = CONTENTION_2012.has(s);
  const commercialTier = COMMERCIAL_VALUE.get(s);
  const searchTier = SEARCH_POPULARITY.get(s);
  const outcome2012 = OUTCOMES_2012.get(s);

  // ---- Base score from contention history --------------------------------
  let score = 0;

  if (in2012 && inHighContention) {
    score = 60;
    const { detail, recommendation } = build2012Detail(s);
    const applicantCount = outcome2012?.applicantCount ?? 'multiple';
    const stats = [
      { emoji: '👥', label: 'Applicants in 2012', value: String(applicantCount) },
      outcome2012?.priceMn
        ? { emoji: '💰', label: 'Auction reserve', value: `$${Math.round(outcome2012.priceMn * 0.5)}M – $${outcome2012.priceMn}M` }
        : { emoji: '💰', label: 'Auction reserve', value: 'Budget required' },
      outcome2012?.winner
        ? { emoji: '🏢', label: 'Incumbent operator', value: getIncumbentName(outcome2012.winner) }
        : { emoji: '🏢', label: 'Operator activity', value: 'Portfolio operators active' },
    ];
    flags.push({
      code: 'CON-001',
      severity: 'HIGH',
      title: `".${s}" attracted ${applicantCount} applicants in 2012 and is high-demand`,
      detail,
      guidebookRef: 'AGB Section 5, pp. 130–170; ICANN 2012 new gTLD application data',
      recommendation,
      stats,
    });
  } else if (inHighContention) {
    score = 35;
    const budgetEst = commercialTier === 'ultra' ? '$5M – $20M est.'
      : commercialTier === 'high' ? '$1M – $5M est.'
      : '$500K – $2M est.';
    const stats = [
      { emoji: '👥', label: 'Expected applicants', value: '2–5 est.' },
      { emoji: '💰', label: 'Auction reserve', value: budgetEst },
      { emoji: '🏢', label: 'Likely operators', value: 'Identity Digital, Radix' },
    ];
    flags.push({
      code: 'CON-002',
      severity: 'MEDIUM',
      title: `".${s}" is a high-demand generic string — contention likely`,
      detail: `".${s}" is a widely desirable generic string likely to attract competing applications from multiple parties in the 2026 round. Established portfolio operators (Identity Digital, Radix, GMO Registry) systematically target strings in this category.`,
      guidebookRef: 'AGB Section 5, pp. 130–170',
      recommendation: 'Prepare for string contention. Have a resolution strategy ready, including willingness to negotiate or participate in an auction.',
      stats,
    });
  } else if (in2012) {
    score = 30;
    const { detail, recommendation } = build2012Detail(s);
    const applicantCount = outcome2012?.applicantCount ?? 'multiple';
    const stats = [
      { emoji: '👥', label: 'Applicants in 2012', value: String(applicantCount) },
      outcome2012?.priceMn
        ? { emoji: '💰', label: 'Auction reserve', value: `$${Math.round(outcome2012.priceMn * 0.5)}M – $${outcome2012.priceMn}M` }
        : { emoji: '💰', label: 'Auction reserve', value: 'Monitor for bids' },
      outcome2012?.winner
        ? { emoji: '🏢', label: 'Incumbent operator', value: getIncumbentName(outcome2012.winner) }
        : { emoji: '🏢', label: 'Operator activity', value: 'Niche interest possible' },
    ];
    flags.push({
      code: 'CON-003',
      severity: 'MEDIUM',
      title: `".${s}" attracted ${applicantCount} applicant(s) in the 2012 round`,
      detail,
      guidebookRef: 'AGB Section 5, pp. 130–170; ICANN 2012 new gTLD application data',
      recommendation,
      stats,
    });
  }

  // ---- Incumbent operator re-application signal --------------------------
  // If this string was won in 2012 by a known operator who still holds the TLD,
  // that operator has strong financial incentive to defend their namespace in 2026.
  if (outcome2012?.winner) {
    const incumbentName = getIncumbentName(outcome2012.winner);
    const isIdentityDigital = incumbentName.includes('Identity Digital');
    score += 15;
    flags.push({
      code: 'CON-007',
      severity: 'HIGH',
      title: `Incumbent operator likely to re-apply: ${incumbentName}`,
      detail: isIdentityDigital
        ? `${incumbentName} — the result of the 2022 Donuts-Afilias merger — operates this TLD as part of a ~300-string portfolio. Identity Digital has the resources, infrastructure, and strategic incentive to systematically re-apply for every string they currently operate. Their auction war chest in 2012 was among the largest of any registry operator.`
        : `${incumbentName} currently operates ".${s}" and has a direct financial incentive to defend this namespace. They have already demonstrated willingness to invest significantly at auction (the 2012 bid establishes a price floor), and retaining the string avoids ceding a strategic asset to a competitor.`,
      guidebookRef: 'AGB Section 5, pp. 130–170; ICANN delegated TLD registry',
      recommendation: `Factor ${incumbentName}'s re-application as near-certain. In any private resolution negotiation, their leverage is high — they know the registry's economics better than any new entrant. Your differentiation strategy needs to be compelling enough to justify auction participation against a well-capitalised incumbent.`,
    });
  }

  // ---- Commercial keyword value bonus ------------------------------------
  const commercialPoints = commercialTier === 'ultra' ? 25
    : commercialTier === 'high'   ? 15
    : commercialTier === 'medium' ? 8
    : 0;

  if (commercialPoints > 0) {
    score += commercialPoints;
    const commApplicants = commercialTier === 'ultra' ? '5–10 est.' : commercialTier === 'high' ? '3–6 est.' : '2–4 est.';
    const commBudget = commercialTier === 'ultra' ? '$5M – $20M est.' : commercialTier === 'high' ? '$1M – $5M est.' : '$500K – $2M est.';
    flags.push({
      code: 'CON-004',
      severity: commercialTier === 'ultra' ? 'HIGH' : 'MEDIUM',
      title: `".${s}" is a high commercial-value keyword`,
      detail: `".${s}" corresponds to a high-revenue commercial sector. Strings in lucrative markets (finance, health, legal, cloud, etc.) attract competing registry operators because premium SLD registrations command higher prices and volumes — making them worth contesting at auction.`,
      guidebookRef: 'AGB Section 5, pp. 130–170',
      recommendation: 'Prepare a strong economic case for your use of this namespace. Competing applicants from larger, better-resourced operators are more likely for commercial-value strings.',
      stats: [
        { emoji: '👥', label: 'Expected applicants', value: commApplicants },
        { emoji: '💰', label: 'Auction reserve', value: commBudget },
        { emoji: '🏢', label: 'Likely operators', value: 'Identity Digital, Radix, GMO' },
      ],
    });
  }

  // ---- Search popularity bonus -------------------------------------------
  const searchPoints = searchTier === 'ultra' ? 15
    : searchTier === 'high'   ? 10
    : searchTier === 'medium' ? 5
    : 0;

  if (searchPoints > 0) {
    score += searchPoints;
    flags.push({
      code: 'CON-005',
      severity: searchTier === 'ultra' ? 'MEDIUM' : 'LOW',
      title: `".${s}" is a high search-interest concept`,
      detail: `".${s}" corresponds to a concept with very high consumer search volume globally. High end-user search interest increases the commercial attractiveness of the TLD namespace, drawing more registry applicants and driving up auction prices for contested strings.`,
      guidebookRef: 'AGB Section 5, pp. 130–170',
      recommendation: 'High search volumes confirm strong end-user demand. Factor likely auction costs and marketing budget into your business plan.',
    });
  }

  // ---- String length premium -------------------------------------------
  // Short strings command higher demand — BUT only when the string also has
  // real semantic/market signals. A 4-char opaque acronym like ".hsgs" attracts
  // far less interest than a 4-char semantic string like ".auth" or ".auth".
  // Without any other signal, length alone only adds a small scarcity note at LOW.
  const len = s.length;
  const hasSemanticSignal = in2012 || inHighContention || commercialPoints > 0 || searchPoints > 0;

  if (len <= 5) {
    if (hasSemanticSignal) {
      // Short string with real demand signals — full premium, meaningful severity
      const lengthPoints = len === 3 ? 20 : len === 4 ? 12 : 5;
      score += lengthPoints;
      const lenApplicants = len === 3 ? '6–12 est.' : len === 4 ? '3–6 est.' : '2–4 est.';
      const lenBudget = len === 3 ? '$5M – $30M est.' : len === 4 ? '$1M – $10M est.' : '$500K – $3M est.';
      flags.push({
        code: 'CON-006',
        severity: len === 3 ? 'HIGH' : len === 4 ? 'MEDIUM' : 'LOW',
        title: `".${s}" is a short premium string (${len} characters)`,
        detail: `Three- and four-character TLD strings are the shortest generics available as new gTLDs. Short strings with recognisable semantic value command significant premium demand — professional registry operators actively target them as long-term portfolio assets. Historically, the shortest strings with real market meaning attracted the most competing applicants and the highest auction prices.`,
        guidebookRef: 'AGB Section 4.1, pp. 191–192; ICANN 2012 auction history',
        recommendation: `Budget for elevated auction costs. Short strings like ".${s}" with clear market relevance disproportionately attract well-capitalised registry operators — factor a higher contention reserve into your business plan.`,
        stats: [
          { emoji: '👥', label: 'Expected applicants', value: lenApplicants },
          { emoji: '💰', label: 'Auction reserve', value: lenBudget },
          { emoji: '🏢', label: 'Likely operators', value: 'Identity Digital, Radix, GMO' },
        ],
      });
    } else if (len <= 4) {
      // Short but semantically opaque — scarcity interest only, no real market demand
      score += len === 3 ? 8 : 5;
      flags.push({
        code: 'CON-006',
        severity: 'LOW',
        title: `".${s}" is a short string — limited scarcity-driven interest possible`,
        detail: `Short strings (3–4 characters) can attract opportunistic portfolio operators who bid on scarce generics regardless of meaning. However, without recognisable commercial, semantic, or contention history signals, competitive interest is driven by scarcity alone — not the market demand that drives real auction competition. Opaque acronyms without an established meaning consistently attract fewer applicants and lower auction prices than semantically clear short strings.`,
        guidebookRef: 'AGB Section 4.1, pp. 191–192; ICANN 2012 auction history',
        recommendation: `Monitor for competing applications during the submission window. A contested auction is unlikely without stronger semantic demand, but a portfolio operator may bid opportunistically on the scarcity value alone.`,
        stats: [
          { emoji: '👥', label: 'Expected applicants', value: len === 3 ? '1–3 est.' : '1–2 est.' },
          { emoji: '💰', label: 'Auction reserve', value: len === 3 ? '$100K – $500K est.' : '$50K – $200K est.' },
          { emoji: '🏢', label: 'Likely operators', value: 'Opportunistic portfolio interest only' },
        ],
      });
    }
  }

  // Cap at 100
  score = Math.min(100, score);

  // ---- Fallback when no signals present ----------------------------------
  if (flags.length === 0) {
    flags.push({
      code: 'CON-INFO',
      severity: 'LOW',
      title: 'Low contention signals detected',
      detail: 'This string does not appear on high-demand generic lists, in 2012 round records, or in high-commercial-value categories. Contention is less likely but not impossible.',
      guidebookRef: 'AGB Section 5, pp. 130–170',
      recommendation: 'Monitor the ICANN application portal during the submission window to identify any competing applications.',
    });
    score = 5;
  }

  const level = score >= 70 ? 'HIGH'
    : score >= 40 ? 'MEDIUM'
    : score >= 15 ? 'LOW'
    : 'CLEAR';

  return {
    category: 'STRING_CONTENTION',
    level,
    score,
    flags: flags.filter(f => f.code !== 'CON-INFO' || score < 15),
    summary: score >= 70
      ? 'Auction almost certain — very high competitive demand.'
      : score >= 40
      ? 'Competition expected — prepare for contention scenario.'
      : score >= 15
      ? 'Some competitive interest — monitor for competing applications.'
      : 'Low competitive demand — string appears relatively unique.',
  };
}
