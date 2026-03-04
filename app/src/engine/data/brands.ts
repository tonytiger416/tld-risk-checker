// Top global brands — strings highly likely to face Legal Rights Objection
// Sources: Interbrand Best Global Brands, Forbes World's Most Valuable Brands,
//          Brand Finance Global 500, major stock exchange listings
export const WELL_KNOWN_BRANDS: Set<string> = new Set([
  // Tech — Tier 1
  'apple', 'google', 'microsoft', 'amazon', 'meta', 'facebook',
  'instagram', 'whatsapp', 'youtube', 'twitter', 'x', 'tiktok',
  'netflix', 'spotify', 'uber', 'airbnb', 'linkedin', 'snapchat',
  'pinterest', 'reddit', 'discord', 'zoom', 'slack', 'salesforce',
  'oracle', 'sap', 'ibm', 'intel', 'amd', 'nvidia', 'qualcomm',
  'cisco', 'adobe', 'paypal', 'ebay', 'shopify', 'stripe',
  'samsung', 'huawei', 'xiaomi', 'sony', 'lg', 'nokia', 'ericsson',
  'dell', 'hp', 'lenovo', 'asus', 'acer', 'panasonic', 'toshiba',
  // Tech — Tier 2
  'dropbox', 'twilio', 'cloudflare', 'github', 'gitlab', 'atlassian',
  'datadog', 'snowflake', 'databricks', 'palantir', 'crowdstrike',
  'servicenow', 'workday', 'zendesk', 'hubspot', 'freshworks',
  'splunk', 'mongodb', 'elastic', 'hashicorp', 'terraform',
  'openai', 'anthropic', 'deepmind',
  'lyft', 'grab', 'doordash', 'instacart', 'deliveroo',
  'coinbase', 'binance', 'kraken', 'robinhood',
  'wechat', 'baidu', 'alibaba', 'alipay', 'bytedance', 'weibo',
  'jd', 'pinduoduo', 'meituan', 'didi',
  'rakuten', 'naver', 'kakao', 'line',
  'infosys', 'tcs', 'wipro', 'hcltech',
  // Automotive
  'toyota', 'volkswagen', 'mercedes', 'bmw', 'ford', 'chevrolet',
  'honda', 'nissan', 'hyundai', 'kia', 'audi', 'porsche', 'ferrari',
  'lamborghini', 'bentley', 'rolls', 'rollsroyce', 'tesla', 'volvo',
  'peugeot', 'renault', 'fiat', 'jeep', 'dodge', 'chrysler', 'subaru',
  'mazda', 'mitsubishi', 'suzuki', 'jaguar', 'landrover', 'rivian',
  'buick', 'cadillac', 'gmc', 'ram',
  'maserati', 'alfa', 'seat', 'skoda', 'cupra',
  'byd', 'geely', 'nio', 'xpeng', 'li',

  // Finance — Banks & Cards
  'visa', 'mastercard', 'amex', 'americanexpress', 'jpmorgan', 'chase',
  'citibank', 'citi', 'barclays', 'hsbc', 'ubs', 'goldman', 'goldmansachs',
  'blackrock', 'fidelity', 'vanguard', 'schwab', 'td', 'rbc', 'bmo',
  'wellsfargo', 'bankofamerica', 'morganstanley', 'deutschebank',
  'creditsuisse', 'bnpparibas', 'societegenerale', 'santander', 'bbva',
  'ing', 'ing', 'abnamro', 'rabobank', 'commerzbank', 'lloyds', 'natwest',
  'standardchartered', 'mizuho', 'mufg', 'smbc', 'nomura',
  'icbc', 'ccb', 'abc', 'bofa',
  'statestreet', 'pnc', 'usbank', 'capitalone', 'discover',
  'suntrust', 'regions', 'fifththird',
  // Finance — Exchanges & Indices (key additions)
  'nasdaq', 'nyse', 'nse', 'bse', 'lse', 'tsx', 'asx', 'sgx', 'hkex',
  'jse', 'moex', 'euronext', 'cboe', 'cme', 'ice',
  'nikkei', 'hangseng', 'sensex', 'nifty', 'kospi', 'ftse',
  'dowjones', 'sandp', 'sp500', 'russell', 'bovespa', 'merval',
  'dax', 'cac', 'stoxx', 'ibex',
  // Finance — Insurance & Investment
  'berkshire', 'allianz', 'axa', 'zurich', 'prudential', 'metlife',
  'manulife', 'sunlife', 'aviva', 'generali', 'munich',
  'bridgewater', 'kkr', 'carlyle', 'apollo', 'bain', 'tpg',
  'sequoia', 'andreessen', 'a16z',

  // Retail / Consumer
  'nike', 'adidas', 'puma', 'reebok', 'newbalance', 'underarmour',
  'gucci', 'louis', 'louisvuitton', 'chanel', 'hermes', 'prada',
  'dior', 'burberry', 'fendi', 'versace', 'armani', 'ralphlauren',
  'calvinklein', 'tommyhilfiger', 'lacoste', 'hugo', 'hugoboss',
  'rolex', 'omega', 'cartier', 'tiffany', 'patek', 'breitling',
  'zara', 'hm', 'uniqlo', 'gap', 'forever21', 'primark', 'shein',
  'ikea', 'walmart', 'costco', 'target', 'kroger', 'tesco', 'carrefour',
  'amazon', 'alibaba', 'rakuten', 'flipkart', 'mercadolibre',
  'mcdonalds', 'starbucks', 'dominos', 'subway', 'burgerking', 'yum',
  'kfc', 'pizzahut', 'chipotle', 'sweetgreen',
  'cocacola', 'pepsi', 'redbull', 'monster', 'gatorade',
  'nestle', 'unilever', 'pg', 'procter', 'proctergamble',
  'pepsico', 'mondelez', 'kraftheinz', 'mars', 'hershey',
  'disney', 'universal', 'warner', 'warnerbrothers', 'nbcuniversal',
  'paramount', 'sony', 'hbo', 'espn', 'hulu',
  'nespresso', 'nescafe', 'gillette', 'pampers', 'tampax', 'tide',

  // Pharma / Healthcare / Biotech
  'pfizer', 'johnson', 'johnsonandjohnson', 'roche', 'novartis', 'abbvie',
  'bayer', 'merck', 'astrazeneca', 'moderna', 'genentech',
  'lilly', 'bristol', 'bristolmyerssquibb', 'abbvie', 'amgen',
  'gilead', 'regeneron', 'biogen', 'vertex', 'illumina',
  'medtronic', 'stryker', 'bectondickinson', 'abbottlabs',
  'unitedhealth', 'anthem', 'cigna', 'cvs', 'walgreens',
  'humana', 'aetna',

  // Airlines / Travel / Hospitality
  'airbus', 'boeing', 'emirates', 'delta', 'united', 'american',
  'lufthansa', 'british', 'britishairways', 'airfrance', 'klm', 'qatar',
  'singapore', 'etihad', 'ryanair', 'easyjet', 'southwest',
  'alaska', 'frontier', 'spirit', 'jetblue',
  'cathay', 'airnewzealand', 'qantas', 'saudia',
  'marriott', 'hilton', 'hyatt', 'accor', 'ihg', 'intercontinental',
  'wyndham', 'bestwestern', 'radisson', 'fourseasons',
  'expedia', 'booking', 'tripadvisor', 'airbnb', 'vrbo',

  // Telecoms / Media / Publishing
  'att', 'verizon', 'tmobile', 'comcast', 'charter', 'spectrum',
  'nbc', 'cbs', 'fox', 'cnn', 'abc', 'msnbc',
  'bbc', 'reuters', 'bloomberg', 'nytimes', 'wsj', 'washingtonpost',
  'theguardian', 'economist', 'financialtimes', 'ft',
  'vodafone', 'softbank', 'ntt', 'docomo', 'kddi',
  'telstra', 'telus', 'bell', 'shaw',
  'telefonica', 'orange', 'telecom', 'swisscom', 'telenet',

  // Energy
  'exxon', 'exxonmobil', 'shell', 'bp', 'chevron', 'totalenergies',
  'aramco', 'equinor', 'conocophillips', 'phillips', 'valero',
  'nextera', 'duke', 'dominion', 'edf', 'eon', 'rwe',
  'siemens', 'ge', 'generalelectric', 'abb',

  // Defence / Aerospace
  'lockheed', 'lockheedmartin', 'raytheon', 'northrop', 'northropgrumman',
  'generaldynamics', 'bae', 'thales', 'leonardo', 'safran',

  // Luxury / Fashion additional
  'swatch', 'lvmh', 'richemont', 'kering',

  // Retail Tech / Payments additional
  'square', 'block', 'affirm', 'klarna', 'afterpay', 'revolut',
  'transferwise', 'wise', 'nubank', 'chime',
]);

// Offensive/sensitive strings that may trigger Limited Public Interest Objection
export const SENSITIVE_STRINGS: string[] = [
  'sex', 'porn', 'adult', 'xxx', 'nude', 'erotic', 'explicit',
  'drug', 'cocaine', 'heroin', 'meth', 'methamphetamine', 'fentanyl',
  'cannabis', 'marijuana', 'crack', 'ecstasy', 'mdma', 'lsd',
  'gun', 'weapon', 'bomb', 'explosive', 'grenade',
  'kill', 'murder', 'rape', 'assault', 'torture',
  'terror', 'terrorist', 'terrorism', 'jihad', 'extremist',
  'hate', 'nazi', 'fascist', 'racist', 'supremacist',
  'scam', 'fraud', 'phishing', 'phish', 'spam', 'malware',
  'abuse', 'trafficking', 'slavery',
];

// Stock exchanges and financial market identifiers
// These strings warrant specific trademark scrutiny when used as TLDs
export const STOCK_EXCHANGES: Set<string> = new Set([
  // US exchanges
  'nasdaq', 'nyse', 'amex', 'cboe', 'otc', 'otcbb',
  // European exchanges
  'lse', 'euronext', 'xetra', 'swx', 'oslobors',
  // Asian exchanges
  'hkex', 'nse', 'bse', 'tsx', 'asx', 'sgx', 'krx', 'tse', 'jse', 'nzx',
  // Other significant exchanges
  'moex', 'b3', 'bmv', 'idx', 'pse',
  // Clearing / settlement
  'dtcc', 'cme', 'ice', 'lch',
]);
