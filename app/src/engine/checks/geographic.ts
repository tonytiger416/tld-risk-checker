import type { CategoryResult, RiskFlag } from '../types';
import { COUNTRY_NAMES, COUNTRY_ALPHA2, COUNTRY_ALPHA3, CAPITAL_CITIES } from '../data/countries';
import { CONTINENT_NAMES, GEOGRAPHIC_REGIONS, NOTABLE_SUBNATIONAL } from '../data/geographic';

export function checkGeographic(s: string): CategoryResult {
  const flags: RiskFlag[] = [];

  // 1. Two-letter country code (alpha-2)
  if (COUNTRY_ALPHA2.has(s)) {
    flags.push({
      code: 'GEO-001',
      severity: 'HIGH',
      title: `".${s}" is an ISO 3166-1 alpha-2 country code`,
      detail: 'Two-letter country codes are reserved for ccTLDs and are not available for new gTLD applications.',
      guidebookRef: 'AGB Section 4.3.1, p. 202',
      recommendation: 'Country codes are blocked. Choose a different string.',
    });
  }

  // 2. Three-letter country code (alpha-3)
  if (COUNTRY_ALPHA3.has(s) && s.length === 3) {
    flags.push({
      code: 'GEO-002',
      severity: 'HIGH',
      title: `".${s}" is an ISO 3166-1 alpha-3 country code`,
      detail: 'Three-letter ISO country codes are treated as geographic names and require government support letters.',
      guidebookRef: 'AGB Section 4.3.1, p. 202',
      recommendation: 'You will need a letter of support or non-objection from the relevant government.',
    });
  }

  // 3. Full country name (any language)
  if (COUNTRY_NAMES.has(s)) {
    flags.push({
      code: 'GEO-003',
      severity: 'HIGH',
      title: `".${s}" is a country or territory name`,
      detail: 'Country names in any language are classified as geographic names. These require a letter of non-objection from the relevant national government.',
      guidebookRef: 'AGB Section 4.3.1, pp. 202–209',
      recommendation: 'Obtain a letter of non-objection from the relevant government, or choose a different string.',
    });
  }

  // 4. Capital city
  if (CAPITAL_CITIES.has(s)) {
    flags.push({
      code: 'GEO-004',
      severity: 'HIGH',
      title: `".${s}" is a national capital city`,
      detail: 'Capital city names are treated as geographic names under ICANN policy and typically require government support.',
      guidebookRef: 'AGB Section 4.3.2, pp. 205–209',
      recommendation: 'Seek a letter of non-objection from the relevant government.',
    });
  }

  // 5. Continent
  if (CONTINENT_NAMES.has(s)) {
    flags.push({
      code: 'GEO-005',
      severity: 'HIGH',
      title: `".${s}" is a continent or major geographic region name`,
      detail: 'Continent names and major geographic region names require broad governmental or inter-governmental support under ICANN policy.',
      guidebookRef: 'AGB Section 4.3.3, pp. 207–209',
      recommendation: 'Continent names face very high barriers. Consult an ICANN expert before applying.',
    });
  }

  // 6. Geographic region
  if (GEOGRAPHIC_REGIONS.has(s)) {
    flags.push({
      code: 'GEO-006',
      severity: 'MEDIUM',
      title: `".${s}" is a recognised geographic region or sub-region name`,
      detail: 'Geographic region names can attract objections from governments or communities who consider these names to represent a geographic identifier.',
      guidebookRef: 'AGB Section 4.3.3, pp. 207–209',
      recommendation: 'Assess whether the relevant governments would support or object to your application.',
    });
  }

  // 7. Notable sub-national name
  if (NOTABLE_SUBNATIONAL.has(s)) {
    flags.push({
      code: 'GEO-007',
      severity: 'MEDIUM',
      title: `".${s}" is a well-known sub-national geographic name (state, province, region)`,
      detail: 'Sub-national geographic names may attract GAC Early Warnings or government objections, particularly for names that are strongly associated with a specific jurisdiction.',
      guidebookRef: 'AGB Section 4.3.4, pp. 207–209',
      recommendation: 'Consider whether you can obtain support from the relevant regional government.',
    });
  }

  const highCount = flags.filter(f => f.severity === 'HIGH').length;
  const medCount = flags.filter(f => f.severity === 'MEDIUM').length;
  const score = highCount > 0 ? 95 : medCount > 0 ? 55 : 0;

  return {
    category: 'GEOGRAPHIC_NAMES',
    level: score >= 80 ? 'HIGH' : score >= 40 ? 'MEDIUM' : score > 0 ? 'LOW' : 'CLEAR',
    score,
    flags,
    summary: flags.length === 0
      ? 'No geographic name conflicts detected.'
      : `Geographic name conflict detected: ${flags.map(f => f.title).join('; ')}`,
  };
}
