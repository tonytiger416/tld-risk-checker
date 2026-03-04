import type { CategoryResult, RiskFlag } from '../types';

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

// Strings that were applied for in the 2012 round by multiple parties (selected)
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

  if (in2012 && inHighContention) {
    flags.push({
      code: 'CON-001',
      severity: 'HIGH',
      title: `".${s}" attracted multiple applicants in the 2012 round and is high-demand`,
      detail: `".${s}" was applied for by multiple parties in the 2012 round, triggering a string contention set. Given continued demand for generic strings, it is very likely to attract multiple applicants in the 2026 round as well. In the event of contention, resolution proceeds through private agreement or auction.`,
      guidebookRef: 'AGB Section 5, pp. 130–170',
      recommendation: 'Budget for potential string contention resolution, including possible auction costs (which can reach tens of millions of USD for premium strings). Prepare a strong application distinguishing your use case.',
    });
  } else if (inHighContention) {
    flags.push({
      code: 'CON-002',
      severity: 'MEDIUM',
      title: `".${s}" is a high-demand generic string — contention likely`,
      detail: `".${s}" is a generic, widely desirable string. It is likely to attract competing applications from multiple parties in the 2026 round.`,
      guidebookRef: 'AGB Section 5, pp. 130–170',
      recommendation: 'Prepare for string contention. Have a contention resolution strategy ready, including willingness to negotiate or participate in an auction.',
    });
  } else if (in2012) {
    flags.push({
      code: 'CON-003',
      severity: 'MEDIUM',
      title: `".${s}" was applied for in the 2012 round — renewed contention possible`,
      detail: `".${s}" had applicants in the 2012 round. While not guaranteed, there is a meaningful probability of renewed interest from similar applicants or new entrants.`,
      guidebookRef: 'AGB Section 5, pp. 130–170',
      recommendation: 'Research who applied for this string in 2012 and whether they are likely to reapply. Build a differentiated value proposition.',
    });
  }

  // General contention information
  if (flags.length === 0) {
    flags.push({
      code: 'CON-INFO',
      severity: 'LOW',
      title: 'String contention is always possible for any desirable string',
      detail: 'Even strings not on high-demand lists can attract multiple applicants. ICANN resolves contention through a preference process followed by private agreement, then auction if needed.',
      guidebookRef: 'AGB Section 5, pp. 130–170',
      recommendation: 'Monitor the ICANN application portal during the submission window to identify competing applications.',
    });
  }

  const highFlags = flags.filter(f => f.severity === 'HIGH');
  const medFlags = flags.filter(f => f.severity === 'MEDIUM');
  const score = highFlags.length > 0 ? 75 : medFlags.length > 0 ? 45 : 10;

  return {
    category: 'STRING_CONTENTION',
    level: score >= 70 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW',
    score,
    flags: flags.filter(f => f.code !== 'CON-INFO' || score < 30),
    summary: highFlags.length > 0
      ? 'High contention risk — prepare for auction scenario.'
      : medFlags.length > 0
      ? 'Moderate contention risk — competing applications likely.'
      : 'Low contention risk — string appears to be relatively unique.',
  };
}
