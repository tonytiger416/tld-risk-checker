// Geographic names beyond countries (continents, regions, sub-regions)
// Countries/capitals/codes are in countries.ts (auto-generated from ISO data)

export const CONTINENT_NAMES: Set<string> = new Set([
  'africa', 'antarctica', 'asia', 'europe', 'oceania',
  'northamerica', 'southamerica', 'americas', 'australasia',
  'arctic', 'eurasian', 'eurasia',
]);

export const GEOGRAPHIC_REGIONS: Set<string> = new Set([
  // UNESCO/UN macro-regions
  'caribbean', 'melanesia', 'micronesia', 'polynesia',
  'scandinavia', 'nordic', 'balkans', 'caucasus',
  'sahel', 'maghreb', 'levant', 'mesopotamia',
  'siberia', 'patagonia', 'amazonia',
  // ICANN regions
  'afrinic', 'apnic', 'arin', 'lacnic', 'ripe',
  // Other well-known geographic descriptors
  'mideast', 'middleeast', 'fareast', 'neareast',
  'southasia', 'eastasia', 'southeast', 'southeastasia',
  'centralamerica', 'centralasia', 'centraleurope',
  'centralafrica', 'westafrica', 'eastafrica', 'southafrica',
  'latinamerica', 'latam',
]);

// Sub-national names that commonly appear (not exhaustive - main ones)
export const NOTABLE_SUBNATIONAL: Set<string> = new Set([
  // US States
  'alaska', 'alabama', 'arizona', 'arkansas', 'california', 'colorado',
  'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho',
  'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana',
  'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota',
  'mississippi', 'missouri', 'montana', 'nebraska', 'nevada',
  'newhampshire', 'newjersey', 'newmexico', 'newyork', 'northcarolina',
  'northdakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania',
  'rhodeisland', 'southcarolina', 'southdakota', 'tennessee', 'texas',
  'utah', 'vermont', 'virginia', 'washington', 'westvirginia',
  'wisconsin', 'wyoming',
  // Canadian Provinces
  'ontario', 'quebec', 'britishcolumbia', 'alberta', 'saskatchewan',
  'manitoba', 'novascotia', 'newbrunswick', 'newfoundland',
  // Major world regions/provinces
  'catalonia', 'catalunia', 'wales', 'scotland', 'england', 'flanders',
  'bavarian', 'bavaria', 'sicily', 'sardinia', 'tibet', 'xinjiang',
]);
