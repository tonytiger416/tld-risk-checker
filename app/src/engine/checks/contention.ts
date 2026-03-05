import type { CategoryResult, RiskFlag } from '../types';
import { COMMERCIAL_VALUE, SEARCH_POPULARITY } from '../data/demand';

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
]);

// Strings applied for in 2012 by multiple parties — strongest historical contention signal
const CONTENTION_2012 = new Set([
  'app', 'art', 'book', 'cloud', 'data', 'design', 'eco', 'film',
  'game', 'games', 'green', 'group', 'hotel', 'live', 'media', 'music',
  'network', 'news', 'online', 'play', 'school', 'shop', 'sport', 'sports',
  'store', 'studio', 'tech', 'travel', 'web', 'work', 'world',
]);

export function checkContention(s: string): CategoryResult {
  const flags: RiskFlag[] = [];

  const inHighContention = HIGH_CONTENTION_STRINGS.has(s);
  const in2012 = CONTENTION_2012.has(s);
  const commercialTier = COMMERCIAL_VALUE.get(s);
  const searchTier = SEARCH_POPULARITY.get(s);

  // ---- Base score from contention history --------------------------------
  let score = 0;

  if (in2012 && inHighContention) {
    score = 60;
    flags.push({
      code: 'CON-001',
      severity: 'HIGH',
      title: `".${s}" attracted multiple applicants in 2012 and is high-demand`,
      detail: `".${s}" was applied for by multiple parties in the 2012 round, triggering a string contention set and auction. Given continued strong demand for generic strings, it is very likely to attract multiple applicants in the 2026 round. Resolution proceeds through private agreement or ICANN auction.`,
      guidebookRef: 'AGB Section 5, pp. 130–170',
      recommendation: 'Budget for potential auction costs (which reached tens of millions of USD for premium strings in 2012). Prepare a strong use-case narrative to differentiate your application.',
    });
  } else if (inHighContention) {
    score = 35;
    flags.push({
      code: 'CON-002',
      severity: 'MEDIUM',
      title: `".${s}" is a high-demand generic string — contention likely`,
      detail: `".${s}" is a widely desirable generic string likely to attract competing applications from multiple parties in the 2026 round.`,
      guidebookRef: 'AGB Section 5, pp. 130–170',
      recommendation: 'Prepare for string contention. Have a resolution strategy ready, including willingness to negotiate or participate in an auction.',
    });
  } else if (in2012) {
    score = 30;
    flags.push({
      code: 'CON-003',
      severity: 'MEDIUM',
      title: `".${s}" was applied for in the 2012 round — renewed contention possible`,
      detail: `".${s}" had applicants in the 2012 round. There is a meaningful probability of renewed interest from similar applicants or new entrants in 2026.`,
      guidebookRef: 'AGB Section 5, pp. 130–170',
      recommendation: 'Research who applied for this string in 2012 and whether they are likely to reapply. Build a differentiated value proposition.',
    });
  }

  // ---- Commercial keyword value bonus ------------------------------------
  const commercialPoints = commercialTier === 'ultra' ? 25
    : commercialTier === 'high'   ? 15
    : commercialTier === 'medium' ? 8
    : 0;

  if (commercialPoints > 0) {
    score += commercialPoints;
    flags.push({
      code: 'CON-004',
      severity: commercialTier === 'ultra' ? 'HIGH' : 'MEDIUM',
      title: `".${s}" is a high commercial-value keyword`,
      detail: `".${s}" corresponds to a high-revenue commercial sector. Strings in lucrative markets (finance, health, legal, cloud, etc.) attract competing registry operators because premium SLD registrations command higher prices and volumes — making them worth contesting at auction.`,
      guidebookRef: 'AGB Section 5, pp. 130–170',
      recommendation: 'Prepare a strong economic case for your use of this namespace. Competing applicants from larger, better-resourced operators are more likely for commercial-value strings.',
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
  // Shorter strings command higher demand — 3-char generics are the shortest
  // available as new gTLDs and historically attract the most applicants
  const len = s.length;
  const lengthPoints = len === 3 ? 20 : len === 4 ? 12 : len === 5 ? 5 : 0;
  if (lengthPoints > 0) {
    score += lengthPoints;
    flags.push({
      code: 'CON-006',
      severity: len === 3 ? 'HIGH' : len === 4 ? 'MEDIUM' : 'LOW',
      title: `".${s}" is a short premium string (${len} characters)`,
      detail: `Three- and four-character TLD strings are the shortest generics available as new gTLDs. Short strings command significant premium demand because they are memorable, versatile, and scarce — professional registry operators actively target them as long-term portfolio assets. Historically, the shortest strings attracted the most competing applicants and the highest auction prices.`,
      guidebookRef: 'AGB Section 4.1, pp. 191–192; ICANN 2012 auction history',
      recommendation: `Budget for elevated auction costs. Short strings like ".${s}" disproportionately attract well-capitalised registry operators — factor a higher contention reserve into your business plan.`,
    });
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
