// Intergovernmental Organization (IGO) names and acronyms protected under ICANN policy
// Source: ICANN IGO-INGO Protections (AGB Section 4.1.2) + UN system organizations
// These strings are protected and applications for them would face strong objection

export const IGO_ACRONYMS: Set<string> = new Set([
  // United Nations system
  'un', 'unu', 'unep', 'undp', 'unicef', 'unhcr', 'wfp', 'unfpa',
  'unodc', 'unops', 'unido', 'unwto', 'unctad', 'unhabitat',
  'ohchr', 'ocha',
  // UN Specialized Agencies
  'fao', 'iaea', 'icao', 'ifad', 'ilo', 'imo', 'itm', 'itu',
  'unesco', 'unido', 'wipo', 'wmo', 'who', 'worldbank', 'imf',
  'ifc', 'miga', 'icsid',
  // Security / Justice
  'interpol', 'icc', 'icj', 'ictr', 'icty',
  // Major IGOs
  'nato', 'wto', 'oecd', 'opec', 'g20', 'g7', 'g8',
  'asean', 'apec', 'saarc', 'ecowas', 'sadc', 'comesa',
  'caricom', 'mercosur', 'celac', 'unasur',
  // Regional bodies
  'eu', 'coe', 'osce', 'efta', 'eea', 'ecb',
  'au', 'auc', 'oas', 'oau',
  'gcc', 'arab', 'oic', 'loa',
  // Humanitarian / Red Cross
  'icrc', 'ifrc',
  // Sports
  'ioc', 'itu', 'fifa', 'wada',
  // Finance / Development
  'adb', 'afdb', 'idb', 'ebrd', 'eib', 'ndb', 'aiib',
  // Other key IGOs
  'csto', 'sco', 'brics', 'commonwealth',
]);

export const IGO_FULL_NAMES: Set<string> = new Set([
  // United Nations
  'unitednations', 'uniteднации',
  // Key organizations
  'unicef', 'unesco', 'interpol', 'nato', 'opec', 'asean', 'apec',
  'worldbank', 'worldtrade', 'worldhealth', 'worldfood',
  'africanunion', 'europeanunion', 'arabicleague',
  // Humanitarian
  'redcross', 'redcrescent',
  // Sports bodies
  'olympics', 'paralympics', 'olympic', 'paralympic',
  // Financial
  'worldbank', 'imf', 'monetaryfund',
  // Other
  'commonwealth', 'francophonie',
]);

// Combined lookup
export const ALL_IGO_STRINGS: Set<string> = new Set([
  ...IGO_ACRONYMS,
  ...IGO_FULL_NAMES,
]);
