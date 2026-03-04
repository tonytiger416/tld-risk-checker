// Geographic names beyond countries (continents, regions, sub-regions, cities)
// Countries/capitals/ISO codes are in countries.ts (auto-generated from ISO data)

export const CONTINENT_NAMES: Set<string> = new Set([
  'africa', 'antarctica', 'asia', 'europe', 'oceania',
  'northamerica', 'southamerica', 'americas', 'australasia',
  'arctic', 'eurasian', 'eurasia',
]);

// ---------------------------------------------------------------------------
// Official UN M.49 geographic sub-regions
// AGB §7.5.2 — these require broad governmental or intergovernmental support
// Includes common variant spellings/compounds used as TLD candidates
// ---------------------------------------------------------------------------
export const UN_M49_SUBREGIONS: Set<string> = new Set([
  // Africa sub-regions
  'northernafrica', 'northafrica',
  'easternafrica', 'eastafrica',
  'middleafrica', 'centralafrica',
  'southernafrica', 'southafrica',
  'westernafrica', 'westafrica',
  'subsaharanafrica', 'subsahara', 'subsaharan',

  // Americas sub-regions
  'caribbean',
  'centralamerica',
  'southamerica', 'southernamerica', 'latinamerica', 'latam',
  'northernamerica', 'northamerica',

  // Asia sub-regions
  'centralasia',
  'easternasia', 'eastasia',
  'southeasternasia', 'southeastasia', 'southeastasia',
  'southernasia', 'southasia',
  'westernasia', 'westasia',

  // Europe sub-regions
  'easterneurope', 'easteurope',
  'northerneurope', 'northeurope', 'scandinavia', 'nordic',
  'southerneurope', 'southeurope',
  'westerneurope', 'westeurope',
  'centraleurope',

  // Oceania sub-regions
  'melanesia', 'micronesia', 'polynesia',
  'australiaandnewzealand', 'australianewzealand',
]);

// ---------------------------------------------------------------------------
// Other well-known geographic region descriptors (non-UN M.49)
// ---------------------------------------------------------------------------
export const GEOGRAPHIC_REGIONS: Set<string> = new Set([
  // Cultural / historical geographic regions
  'balkans', 'caucasus', 'sahel', 'maghreb', 'levant', 'mesopotamia',
  'siberia', 'patagonia', 'amazonia',
  // Colloquial directional descriptors
  'mideast', 'middleeast', 'fareast', 'neareast', 'southeast',
  // ICANN RIR regions (could attract objections from ICANN community)
  'afrinic', 'apnic', 'arin', 'lacnic', 'ripe',
  // Other regional terms
  'tropics', 'equatorial', 'arctic', 'subarctic', 'transatlantic',
  'mediterranean', 'pacific', 'atlantic', 'indian',
  'antilles', 'westindies',
]);

// ---------------------------------------------------------------------------
// Sub-national names that commonly appear (not exhaustive)
// ---------------------------------------------------------------------------
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
  // Major world regions/provinces with strong geographic identity
  'catalonia', 'catalunia', 'wales', 'scotland', 'england', 'flanders',
  'bavarian', 'bavaria', 'sicily', 'sardinia', 'tibet', 'xinjiang',
  'kashmir', 'punjab', 'sindh', 'balochistan',
  'manchuria', 'mongolia', 'taiwan',
  'crimea', 'donbas', 'chechnya',
  'kurdistan', 'palestine', 'westbank', 'gaza',
  'alsace', 'lorraine', 'normandy', 'brittany',
  'queensland', 'newsouthwales', 'victoria', 'southaustralia', 'westernaustralia',
]);

// ---------------------------------------------------------------------------
// Major world cities (non-capital; capitals are in countries.ts)
// These are significant enough that TLD applications would raise geographic concerns
// Includes concatenated forms for multi-word city names (e.g. "losangeles")
// ---------------------------------------------------------------------------
export const MAJOR_CITIES: Set<string> = new Set([
  // North America — major non-capital cities
  'chicago', 'houston', 'miami', 'seattle', 'boston', 'atlanta',
  'phoenix', 'dallas', 'denver', 'detroit', 'minneapolis', 'portland',
  'baltimore', 'nashville', 'charlotte', 'lasvegas', 'losangeles',
  'sanfrancisco', 'sandiego', 'sanantonio', 'neworleans', 'memphis',
  'louisville', 'oklahomacity', 'fortworth', 'columbus', 'indianapolis',
  'jacksonville', 'sacramento', 'saltlakecity', 'reno', 'milwaukee',
  'pittsburgh', 'cleveland', 'cincinnati', 'stlouis', 'kansascity',
  'toronto', 'vancouver', 'montreal', 'calgary', 'edmonton', 'winnipeg',
  // Latin America — major non-capital cities
  'guadalajara', 'monterrey',
  'medellin', 'cali', 'barranquilla',
  'fortaleza', 'salvador', 'manaus', 'recife', 'curitiba',
  'portoalegre', 'belem', 'goiania',
  'saopaulo', 'riodejaneiro',           // capitals of their states, not Brazil
  'buenosaires',                         // capital of Argentina — also flag as capital
  'cordoba', 'rosario', 'mendoza',
  'guayaquil', 'manta',
  'callao', 'arequipa', 'trujillo',
  'maracaibo', 'valencia',
  'concepcion', 'valparaiso',
  // Europe — major non-capital cities
  'milan', 'naples', 'turin', 'palermo', 'genoa', 'venice', 'florence',
  'barcelona', 'seville', 'bilbao', 'valencia', 'zaragoza', 'malaga',
  'frankfurt', 'munich', 'hamburg', 'cologne', 'dortmund', 'essen',
  'dusseldorf', 'stuttgart', 'bremen', 'hannover', 'nuremberg', 'leipzig',
  'dresden', 'duisburg',
  'rotterdam', 'amsterdam', 'antwerp', 'ghent',
  'glasgow', 'manchester', 'birmingham', 'leeds', 'liverpool', 'sheffield',
  'bristol', 'edinburgh',
  'lyon', 'marseille', 'toulouse', 'bordeaux', 'nantes', 'strasbourg', 'lille',
  'krakow', 'gdansk', 'wroclaw', 'lodz', 'poznan',
  'brno', 'ostrava',
  'gothenburg', 'malmo',
  'valencia', 'porto',
  // Africa — major non-capital cities
  'johannesburg', 'capetown', 'durban', 'pretoria',
  'casablanca', 'marrakech', 'fez', 'oran',
  'lagos', 'ibadan', 'kano', 'kaduna', 'enugu',
  'mombasa', 'kisumu',
  'alexandria', 'luxor', 'suez',
  'beira', 'matola',
  'kumasi', 'tamale',
  'dakar',
  // Middle East — major non-capital cities
  'jeddah', 'mecca', 'medina', 'riyadh',     // Riyadh is capital but jeddah/mecca are not
  'mosul', 'basra', 'erbil',
  'mashhad', 'isfahan', 'tabriz', 'shiraz', 'ahvaz',
  'aleppo', 'homs', 'latakia',
  'izmir', 'bursa', 'antalya', 'gaziantep',
  // South Asia — major non-capital cities (Delhi/Islamabad/Dhaka are capitals)
  'mumbai', 'kolkata', 'chennai', 'bangalore', 'hyderabad',
  'ahmedabad', 'pune', 'surat', 'jaipur', 'lucknow', 'kanpur',
  'nagpur', 'indore', 'bhopal', 'agra', 'nashik', 'vadodara',
  'visakhapatnam', 'patna', 'meerut', 'rajkot', 'ludhiana', 'coimbatore',
  'karachi', 'lahore', 'faisalabad', 'rawalpindi', 'peshawar', 'multan',
  'quetta', 'gujranwala',
  'chittagong', 'khulna', 'rajshahi', 'sylhet',
  // East Asia — major non-capital cities (Beijing/Tokyo/Seoul are capitals)
  'shanghai', 'guangzhou', 'shenzhen', 'chengdu', 'chongqing',
  'wuhan', 'tianjin', 'nanjing', 'hangzhou', 'dongguan', 'foshan',
  'shenyang', 'harbin', 'xian', 'zhengzhou', 'changsha', 'dalian',
  'kunming', 'hefei', 'changchun',
  'osaka', 'yokohama', 'nagoya', 'sapporo', 'kyoto', 'fukuoka',
  'kobe', 'kawasaki', 'hiroshima', 'sendai',
  'busan', 'incheon', 'daegu', 'daejeon', 'gwangju', 'ulsan',
  'hongkong', 'macau',
  // Southeast Asia — major non-capital cities
  'surabaya', 'bandung', 'medan', 'semarang', 'makassar', 'palembang',
  'cebu', 'davao', 'quezon',
  'chiangmai', 'phuket', 'pattaya',
  'hochiminhcity', 'saigon', 'danang', 'haiphong',
  'johorbahru', 'penang', 'ipoh',
  // Central Asia
  'almaty', 'shymkent',    // Nur-Sultan/Astana is capital
]);
