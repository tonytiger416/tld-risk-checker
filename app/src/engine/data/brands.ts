// Top global brands - strings that are highly likely to face Legal Rights Objection
// Sources: Interbrand Best Global Brands, Forbes World's Most Valuable Brands
export const WELL_KNOWN_BRANDS: Set<string> = new Set([
  // Tech
  'apple', 'google', 'microsoft', 'amazon', 'meta', 'facebook',
  'instagram', 'whatsapp', 'youtube', 'twitter', 'x', 'tiktok',
  'netflix', 'spotify', 'uber', 'airbnb', 'linkedin', 'snapchat',
  'pinterest', 'reddit', 'discord', 'zoom', 'slack', 'salesforce',
  'oracle', 'sap', 'ibm', 'intel', 'amd', 'nvidia', 'qualcomm',
  'cisco', 'adobe', 'paypal', 'ebay', 'shopify', 'stripe',
  'samsung', 'huawei', 'xiaomi', 'sony', 'lg', 'nokia', 'ericsson',
  'dell', 'hp', 'lenovo', 'asus', 'acer', 'panasonic', 'toshiba',
  // Automotive
  'toyota', 'volkswagen', 'mercedes', 'bmw', 'ford', 'chevrolet',
  'honda', 'nissan', 'hyundai', 'kia', 'audi', 'porsche', 'ferrari',
  'lamborghini', 'bentley', 'rolls', 'rollsroyce', 'tesla', 'volvo',
  'peugeot', 'renault', 'fiat', 'jeep', 'dodge', 'chrysler', 'subaru',
  'mazda', 'mitsubishi', 'suzuki',
  // Finance
  'visa', 'mastercard', 'amex', 'americanexpress', 'jpmorgan', 'chase',
  'citibank', 'citi', 'barclays', 'hsbc', 'ubs', 'goldman', 'goldmansachs',
  'blackrock', 'fidelity', 'vanguard',
  // Retail / Consumer
  'nike', 'adidas', 'gucci', 'louis', 'louisvuitton', 'chanel', 'hermes',
  'prada', 'rolex', 'zara', 'hm', 'ikea', 'walmart', 'costco', 'target',
  'mcdonalds', 'starbucks', 'cocacola', 'pepsi', 'nestle', 'unilever',
  'pepsico', 'disney', 'universal', 'warner', 'warnerbrothers',
  'visa', 'nespresso', 'nescafe', 'gillette', 'pampers',
  // Pharma / Healthcare
  'pfizer', 'johnson', 'johnsonandjohnson', 'roche', 'novartis', 'abbvie',
  'bayer', 'merck', 'astrazeneca', 'moderna', 'genentech', 'abbvie',
  // Airlines / Travel
  'airbus', 'boeing', 'emirates', 'delta', 'united', 'american',
  'lufthansa', 'british', 'britishairways', 'airfrance', 'klm', 'qatar',
  'marriott', 'hilton', 'hyatt', 'accor',
  // Telecoms / Media
  'att', 'verizon', 'tmobile', 'comcast', 'nbc', 'cbs', 'fox', 'cnn',
  'bbc', 'reuters', 'bloomberg', 'nytimes',
]);

// Offensive/sensitive strings that may trigger Limited Public Interest Objection
export const SENSITIVE_STRINGS: string[] = [
  'sex', 'porn', 'adult', 'xxx', 'nude', 'erotic',
  'drug', 'cocaine', 'heroin', 'meth', 'cannabis',
  'gun', 'weapon', 'bomb', 'kill', 'terror', 'jihad',
  'hate', 'nazi', 'fascist', 'racist',
  'scam', 'fraud', 'hack', 'phish', 'spam',
];
