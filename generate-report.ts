/**
 * ICANN 2026 Expert TLD Portfolio — Report Generator
 * Run: npx tsx generate-report.ts
 * Output: recommendations.html
 */

import { assess } from './app/src/engine/assess.ts';
import { writeFileSync } from 'fs';

// ─── Expert Picks ────────────────────────────────────────────────────────────

interface ExpertPick {
  s: string;
  tier: 1 | 2 | 3;
  category: string;
  rationale: string;
}

const EXPERT_PICKS: ExpertPick[] = [
  // ── Tier 1: Ultra Premium ──────────────────────────────────────────────────
  { s: 'pay',    tier: 1, category: 'Finance',     rationale: 'Pure transaction intent. Every fintech, payment processor, and e-commerce platform needs this. Registry ARPU ceiling is among the highest of any open generic TLD. Highly defensible business model.' },
  { s: 'web',    tier: 1, category: 'Internet',    rationale: 'The most contested ICANN string ever. Multiple 2012 applications, never resolved due to GAC gridlock. Every web agency, SaaS product, and internet business wants a .web domain. Main street digital real estate.' },
  { s: 'inc',    tier: 1, category: 'Business',    rationale: 'The cleanest corporate identity TLD available. Every incorporated company could use companyname.inc — the logical 21st-century corporate suffix with millions of potential registrants.' },
  { s: 'api',    tier: 1, category: 'Technology',  rationale: 'Connective tissue of the modern internet. Every SaaS company, developer tool, and integration platform has an API. product.api replaces api.product.com for millions of developer-facing businesses.' },
  { s: 'run',    tier: 1, category: 'Multi',       rationale: 'Fitness, DevOps pipelines, execution environments, marathons. The word "run" is universal across sports, tech, and consumer categories — rare breadth for a 3-letter string.' },
  { s: 'hub',    tier: 1, category: 'Platform',    rationale: 'Platform identity. GitHub, HubSpot, and hundreds of platforms built their brand around "hub" — they all want hub.companyname. Community centers, distribution hubs, knowledge hubs.' },
  { s: 'doc',    tier: 1, category: 'Multi',       rationale: 'Document management, medical professionals, legal documentation, technical docs. Dual-market appeal across tech and healthcare — two of the highest-spending verticals.' },
  { s: 'lab',    tier: 1, category: 'Innovation',  rationale: 'Innovation labs, R&D divisions, biotech, startup identity. The premium single-word version of .labs — cleaner, shorter, more valuable as a registry brand.' },
  { s: 'bio',    tier: 1, category: 'Multi',       rationale: 'Biotech, organic food brands, biology research, creator bios. Growing fast across both science and consumer sectors — a rare dual-market 3-letter string.' },
  { s: 'geo',    tier: 1, category: 'Location',    rationale: 'Geolocation services, mapping tools, geographic data companies, environmental science. Core infrastructure for the location economy powering autonomous vehicles and logistics.' },
  { s: 'vet',    tier: 1, category: 'Multi',       rationale: 'Dual market: veterinary clinics (huge fragmented industry, 100k+ US practices) and veterans services. Two large registrant pools in one TLD — rare and structurally valuable.' },
  { s: 'ceo',    tier: 1, category: 'Identity',    rationale: 'Executive identity. Every CEO, founder, and business leader would want name.ceo. Premium personal and corporate branding at the highest level of any organization.' },
  { s: 'cpa',    tier: 1, category: 'Finance',     rationale: 'Certified Public Accountants. A locked, defensible vertical — every CPA firm in the US would want firm.cpa. Regulated profession means premium registrants who pay for authority.' },
  { s: 'med',    tier: 1, category: 'Health',      rationale: 'Medical practices, healthcare providers, pharmaceuticals. Healthcare industry spends aggressively on identity. A 3-letter premium in the highest-value sector in the global economy.' },
  { s: 'bot',    tier: 1, category: 'AI/Tech',     rationale: '"Bot" is already a tech product category — a TLD formalizes it at the perfect cultural moment. AI chatbots, automation tools, RPA — the fastest-growing software subcategory.' },
  { s: 'bid',    tier: 1, category: 'Commerce',    rationale: 'Real-time bidding (ad tech), online auctions, procurement platforms. The $600B+ ad tech industry alone is built on bidding infrastructure — enormous embedded demand.' },
  { s: 'fit',    tier: 1, category: 'Fitness',     rationale: 'Fitness brands, gyms, personal trainers, health apps. Shorter than .fitness and far more valuable as a premium 3-letter string. The global fitness market is $100B+.' },
  { s: 'eat',    tier: 1, category: 'Food',        rationale: 'Food delivery, restaurant discovery, nutrition tracking. Single-word universal appeal — food is the world\'s most universal commercial activity.' },
  { s: 'pod',    tier: 1, category: 'Media',       rationale: 'Podcasts, modular hardware, product pods, co-working pods. The podcast industry alone has 4M+ shows and is growing rapidly across all demographics.' },
  { s: 'fan',    tier: 1, category: 'Media',       rationale: 'Fan communities, sports fans, creator economy, fandom platforms. The creator economy is worth $100B+ and fans are the monetizable asset at the center of it.' },
  { s: 'now',    tier: 1, category: 'Brand',       rationale: 'Urgency, real-time services, instant delivery, present-tense brands. Clean brand identity for the "now" economy — delivery, streaming, on-demand services.' },
  { s: 'key',    tier: 1, category: 'Security',    rationale: 'Cryptographic keys, authentication, password management. Security is the fastest-growing enterprise software category. Every security product has a "key" concept.' },
  { s: 'dao',    tier: 1, category: 'Crypto',      rationale: 'Decentralized autonomous organizations. The canonical identity for crypto-native governance. As DAOs mature, authoritative identity becomes essential for legitimacy.' },
  { s: 'rx',     tier: 1, category: 'Health',      rationale: 'Prescriptions, pharmacy, pharmaceutical companies. Universally understood as the pharmaceutical symbol. Premium 2-letter pick in the world\'s most regulated high-value industry.' },
  { s: 'home',   tier: 1, category: 'Consumer',    rationale: 'Heavily contested in 2012 (Donuts, Rightside), never delegated. Universal consumer appeal — homeowners, smart home brands, real estate, interior design. One of the broadest registrant bases of any TLD.' },
  { s: 'data',   tier: 1, category: 'Technology',  rationale: 'Data is the new oil. Every analytics firm, data broker, database provider, and data science company will want this. Increasingly regulated means increasingly valuable identity.' },
  { s: 'mail',   tier: 1, category: 'Internet',    rationale: 'Email is the bedrock of internet identity. Sought by every business wanting professional email identity, every email service provider, and communications platform. Near-universal commercial relevance.' },
  { s: 'maps',   tier: 1, category: 'Location',    rationale: 'Navigation, logistics, real estate, local business directories all need mapping identity. With autonomous vehicles and geolocation APIs booming, .maps is a generational registry business.' },
  { s: 'agent',  tier: 1, category: 'AI',          rationale: 'Perfectly timed for the AI revolution. AI agents are the defining technology category of 2025–2030. Dual-market: real estate agents (traditional) + AI agent ecosystem (exploding). Rare compound demand.' },
  { s: 'search', tier: 1, category: 'Internet',    rationale: 'The defining action of the internet. Every SEO agency, vertical search engine, discovery platform, and AI-powered search product needs this identity. Google built a trillion-dollar company on this word.' },

  // ── Tier 2: Strong Commercial ──────────────────────────────────────────────
  { s: 'gym',      tier: 2, category: 'Fitness',     rationale: 'Every gym, fitness center, and CrossFit box. 100,000+ gyms in the US alone. Clean, memorable, specific vertical with reliable registrant demand.' },
  { s: 'spa',      tier: 2, category: 'Wellness',    rationale: 'Spas, wellness centers, luxury hospitality. Premium registrant base that pays for authoritative identity.' },
  { s: 'tax',      tier: 2, category: 'Finance',     rationale: 'Tax preparation, accounting, filing services. H&R Block competitors, TurboTax challengers, every local accountant. Universal annual-use case.' },
  { s: 'eco',      tier: 2, category: 'Green',       rationale: 'Sustainability movement, eco brands, environmental tech, clean energy. A fast-growing market with premium-paying registrants who value identity alignment.' },
  { s: 'gen',      tier: 2, category: 'AI/Brand',    rationale: 'Generative AI platforms, Generation-Z brands, genetics companies. Perfect for the AI generation economy — "gen" is the shorthand for generative AI.' },
  { s: 'ngo',      tier: 2, category: 'Non-Profit',  rationale: 'Non-governmental organizations. Clear, defensible, globally recognized abbreviation for the non-profit sector. Millions of NGOs worldwide need authoritative identity.' },
  { s: 'pub',      tier: 2, category: 'Multi',       rationale: 'Publishing companies, blogs, media brands, public houses (UK/Ireland). Dual-market between digital media and hospitality.' },
  { s: 'bet',      tier: 2, category: 'Gaming',      rationale: 'Online gambling, prediction markets, sports betting. Legal US sports betting has created a massive new commercial market in just the last 5 years.' },
  { s: 'win',      tier: 2, category: 'Gaming',      rationale: 'E-sports, gaming, achievement platforms, competitions. Universal positive word with strong brand appeal across sports and tech.' },
  { s: 'sky',      tier: 2, category: 'Brand',       rationale: 'Technology companies, aviation, space exploration, outdoor brands. Premium 3-letter brand identity with universal positive associations.' },
  { s: 'air',      tier: 2, category: 'Multi',       rationale: 'Aviation, air quality monitoring, HVAC, AirBnB-style platforms, wireless tech. Extremely broad registrant base across multiple large industries.' },
  { s: 'wed',      tier: 2, category: 'Events',      rationale: 'Wedding industry — venues, planners, photographers, caterers, registries. The $70B+ annual US wedding market is highly fragmented and domain-purchase-motivated.' },
  { s: 'mba',      tier: 2, category: 'Education',   rationale: 'Business school graduates, MBA programs, executive education. 200,000+ MBAs graduate annually in the US alone — strong credentialing identity demand.' },
  { s: 'fund',     tier: 2, category: 'Finance',     rationale: 'Investment funds, venture capital, private equity, crowdfunding, ETFs. The $100T+ global asset management industry needs authoritative identity beyond .com.' },
  { s: 'invest',   tier: 2, category: 'Finance',     rationale: 'Robo-advisors, brokerages, trading platforms, personal finance apps. Growing retail investor base means enormous registrant demand in this vertical.' },
  { s: 'trade',    tier: 2, category: 'Commerce',    rationale: 'Trading platforms, forex, import/export, supply chain. The word "trade" is universal across languages and industries — rare for a single generic.' },
  { s: 'wallet',   tier: 2, category: 'Fintech',     rationale: 'Digital wallets are replacing bank accounts. Every crypto wallet, mobile payment app, and fintech product will want this identity.' },
  { s: 'price',    tier: 2, category: 'Commerce',    rationale: 'Price comparison is a massive internet vertical. Insurance, travel, e-commerce all need .price identity to signal their core value proposition.' },
  { s: 'cash',     tier: 2, category: 'Finance',     rationale: 'Consumer finance, peer-to-peer payments, money transfer. Simpler and more universally understood than .wallet across global markets.' },
  { s: 'quote',    tier: 2, category: 'Finance',     rationale: 'Insurance quotes, financial services, B2B procurement, contractor estimates. High-value registrants in heavily regulated industries who pay for authority.' },
  { s: 'deal',     tier: 2, category: 'Commerce',    rationale: 'Deal aggregators, loyalty programs, procurement platforms, daily deals. Universal commercial term with high consumer recognition.' },
  { s: 'code',     tier: 2, category: 'Developer',   rationale: 'Programming, development tools, code repositories. Every developer platform wants a clean .code identity — and there are 30M+ developers globally.' },
  { s: 'stack',    tier: 2, category: 'Developer',   rationale: 'Tech stack identity — engineering teams, developer tool companies, platform businesses. "Stack" is endemic to how developers talk about their tools.' },
  { s: 'node',     tier: 2, category: 'Developer',   rationale: 'Computing nodes, blockchain nodes, network infrastructure. Growing with decentralized systems and cloud-native architectures.' },
  { s: 'sync',     tier: 2, category: 'Developer',   rationale: 'Data synchronization, cloud storage, real-time collaboration tools. "Sync" is one of the most common product verbs in the modern software stack.' },
  { s: 'deploy',   tier: 2, category: 'DevOps',      rationale: 'CI/CD pipelines, deployment automation, release engineering. One of the fastest-growing engineering categories — every company deploys software.' },
  { s: 'compute',  tier: 2, category: 'Cloud',       rationale: 'Cloud compute, serverless functions, GPU infrastructure. Critical for the AI economy — every AI workload runs on compute.' },
  { s: 'corp',     tier: 2, category: 'Business',    rationale: 'Corporate identity TLD. Fortune 500 companies and multinationals seeking an authoritative corporate domain beyond .com.' },
  { s: 'llc',      tier: 2, category: 'Business',    rationale: 'The most common US business entity type. Millions of LLCs exist and form annually — clean identity that signals legitimacy to consumers.' },
  { s: 'firm',     tier: 2, category: 'Business',    rationale: 'Law firms, consulting firms, accounting firms. "Firm" carries authority and prestige — the word professionals use when they mean business.' },
  { s: 'consult',  tier: 2, category: 'Services',    rationale: 'Consulting firms, management advisory, strategy. Shorter and more premium than .consulting — the kind of brevity that signals expertise.' },
  { s: 'hire',     tier: 2, category: 'Recruiting',  rationale: 'Recruitment, staffing agencies, talent acquisition platforms. The global labor market is enormous and highly fragmented — identity matters.' },
  { s: 'audit',    tier: 2, category: 'Compliance',  rationale: 'Financial auditing, compliance, cybersecurity auditing. Regulated and high-value registrants in industries where authority signals are everything.' },
  { s: 'dental',   tier: 2, category: 'Health',      rationale: 'Dental practices, orthodontics, dental products. A predictable registry business — 150,000+ dental practices in the US alone, nearly all independent.' },
  { s: 'therapy',  tier: 2, category: 'Health',      rationale: 'Mental health therapy, physical therapy, online counseling. The fastest-growing healthcare category, driven by telehealth expansion.' },
  { s: 'clinic',   tier: 2, category: 'Health',      rationale: 'Medical clinics, specialty clinics, telehealth platforms. Universal healthcare term understood globally across every language and culture.' },
  { s: 'vision',   tier: 2, category: 'Health',      rationale: 'Eyecare practices, vision insurance, optical retail. Clear vertical with defensible registrant base and natural authority association.' },
  { s: 'rent',     tier: 2, category: 'Real Estate', rationale: 'Rental properties, equipment rental, car rental, vacation rentals. The sharing economy made "rent" a mainstream commerce term with enormous registrant breadth.' },
  { s: 'lease',    tier: 2, category: 'Real Estate', rationale: 'Commercial real estate, equipment leasing, auto leasing, software licensing. High-value B2B registrants with long renewal cycles.' },
  { s: 'address',  tier: 2, category: 'Real Estate', rationale: 'Location services, address verification, identity platforms, real estate. Broad utility across multiple industries — more than just property.' },
  { s: 'land',     tier: 2, category: 'Real Estate', rationale: 'Property, metaverse land, geographic identity. Growing with virtual real estate markets while maintaining traditional real estate demand.' },
  { s: 'mortgage', tier: 2, category: 'Finance',     rationale: 'The single largest financial transaction most people ever make. Mortgage brokers and lenders pay premium for identity that signals authority.' },

  // ── Tier 3: Emerging Opportunity ──────────────────────────────────────────
  { s: 'ops',        tier: 3, category: 'DevOps',      rationale: 'DevOps, operations, MLOps, GitOps. The "-ops" suffix is endemic to modern tech practice — ops.companyname is a natural convention.' },
  { s: 'ssl',        tier: 3, category: 'Security',    rationale: 'Security certificates. Niche but defensible — every web host and security vendor uses SSL. Technical authority in the infrastructure space.' },
  { s: 'dns',        tier: 3, category: 'Infra',       rationale: 'DNS services, network management. Core internet infrastructure identity. Technical but highly authoritative in its vertical.' },
  { s: 'vpn',        tier: 3, category: 'Security',    rationale: 'Virtual private networks, privacy tech. Growing consumer market with mainstream adoption accelerating globally.' },
  { s: 'ipo',        tier: 3, category: 'Finance',     rationale: 'Initial public offerings, financial milestones, corporate events. Every company going public would want this identity for investor communications.' },
  { s: 'esg',        tier: 3, category: 'Finance',     rationale: 'Environmental, social, governance investing. The fastest-growing institutional investment category — every asset manager has an ESG product now.' },
  { s: 'prompt',     tier: 3, category: 'AI',          rationale: 'AI prompt engineering, prompt marketplaces, prompt sharing communities. The 2026 AI economy will have entire businesses built around prompt design and distribution.' },
  { s: 'model',      tier: 3, category: 'AI',          rationale: 'AI models, fashion models, scientific models, business models. Broad applicability across fast-growing verticals — rare for an emerging term.' },
  { s: 'neural',     tier: 3, category: 'AI',          rationale: 'AI/ML infrastructure companies, neural network research, neurotech startups. The word at the center of the most important technology transition since the internet.' },
  { s: 'vector',     tier: 3, category: 'AI',          rationale: 'Vector databases, AI embeddings, mathematical tools, scientific computing. Pinecone, Weaviate, and every AI-native database company would want this.' },
  { s: 'quantum',    tier: 3, category: 'Technology',  rationale: 'Quantum computing companies, quantum cryptography, quantum security. The next wave of computing infrastructure — early but high-value registrants.' },
  { s: 'labs',       tier: 3, category: 'Innovation',  rationale: 'Innovation labs, R&D divisions, biotech, science startups. A clean identity for research-driven organizations with premium brand associations.' },
  { s: 'cast',       tier: 3, category: 'Media',       rationale: 'Podcasting, broadcasting, video content, sports fantasy drafts. The content creator economy is $100B+ and podcasting alone has 4M+ shows.' },
  { s: 'forum',      tier: 3, category: 'Community',   rationale: 'Community forums, discussion boards, niche communities. The internet was built on forums — and community platforms are experiencing a renaissance.' },
  { s: 'talk',       tier: 3, category: 'Community',   rationale: 'Discussion platforms, voice apps, podcasts, conference talks. "Talk" is the human action at the center of every communication product.' },
  { s: 'voice',      tier: 3, category: 'Comms',       rationale: 'Voice technology, VoIP services, voice AI, podcasting. Voice is becoming the primary interface for AI interaction — enormous growth ahead.' },
  { s: 'chef',       tier: 3, category: 'Food',        rationale: 'Culinary professionals, cooking platforms, restaurant identity. The food content creator economy is massive and growing across every platform.' },
  { s: 'wine',       tier: 3, category: 'Food',        rationale: 'Wineries, wine subscription services, sommeliers, wine education. A premium lifestyle vertical with affluent registrants who pay for brand identity.' },
  { s: 'recipe',     tier: 3, category: 'Food',        rationale: 'Food blogs, recipe apps, cooking platforms. The recipe content vertical drives billions of monthly searches — enormous registrant demand.' },
  { s: 'yoga',       tier: 3, category: 'Wellness',    rationale: 'Yoga studios, wellness practitioners, yoga instruction. 36M+ yoga practitioners in the US alone — clear, defensible vertical identity.' },
  { s: 'sign',       tier: 3, category: 'Legal',       rationale: 'Digital signatures, e-signature platforms, signage companies. DocuSign competitors and the broader legal tech category all need this identity.' },
  { s: 'contract',   tier: 3, category: 'Legal',       rationale: 'Legal tech, smart contracts, procurement, document management. Contracts are the foundation of every business relationship — universal demand.' },
  { s: 'notary',     tier: 3, category: 'Legal',       rationale: 'Notary services, legal documentation, remote notarization. Growing fast with the shift to digital-first legal processes and remote work.' },
  { s: 'compliance', tier: 3, category: 'Legal',       rationale: 'Regulatory compliance technology. Growing with global regulation across fintech, healthcare, and data privacy — high-value enterprise registrants.' },
  { s: 'learn',      tier: 3, category: 'Education',   rationale: 'E-learning platforms, education technology, corporate training. The global e-learning market is $200B+ and accelerating post-pandemic.' },
  { s: 'tutor',      tier: 3, category: 'Education',   rationale: 'Online tutoring, personalized education, test prep. The tutoring market exploded with AI — every student and platform needs clean identity.' },
  { s: 'course',     tier: 3, category: 'Education',   rationale: 'Online courses, certification programs, continuing education. Coursera, Udemy, and thousands of creators all need clean course identity.' },
  { s: 'school',     tier: 3, category: 'Education',   rationale: 'K-12 schools, alternative education, professional education. Every educational institution worldwide understands and needs this word.' },
  { s: 'stay',       tier: 3, category: 'Travel',      rationale: 'Vacation rentals, hotel booking, short-term accommodations. "Stay" is the universal hospitality verb — cleaner and more premium than .hotel.' },
  { s: 'trip',       tier: 3, category: 'Travel',      rationale: 'Travel planning, trip booking, travel blogs. TripAdvisor built a $5B company on this word — a registry TLD captures the entire travel planning vertical.' },
  { s: 'tour',       tier: 3, category: 'Travel',      rationale: 'Tourism, guided tours, virtual tours, cycling tours. Universal travel term with strong registrant demand in the $9T global tourism industry.' },
  { s: 'resort',     tier: 3, category: 'Travel',      rationale: 'Resort properties, luxury hospitality, destination identity. Premium registrant base with high willingness to pay for authoritative identity.' },
  { s: 'meet',       tier: 3, category: 'Comms',       rationale: 'Video conferencing, in-person meetups, professional networking. Post-pandemic, "meet" is now the verb of professional and social life.' },
  { s: 'call',       tier: 3, category: 'Comms',       rationale: 'VoIP, business communications, call centers, customer service. Every business takes calls — this is the universal communication identity.' },
  { s: 'inbox',      tier: 3, category: 'Comms',       rationale: 'Email clients, help desks, customer service platforms. The inbox is still the most-checked interface in professional life.' },
  { s: 'token',      tier: 3, category: 'Crypto',      rationale: 'Tokenization platforms, loyalty programs, crypto tokens. "Token" has crossed from crypto into mainstream loyalty and identity programs.' },
  { s: 'swap',       tier: 3, category: 'Crypto',      rationale: 'Crypto exchanges, car trade-ins, any exchange mechanism. "Swap" is the foundational DeFi verb — Uniswap alone processes $1T+ annually.' },
  { s: 'stake',      tier: 3, category: 'Crypto',      rationale: 'Crypto staking, stakeholder identity, equity programs. As proof-of-stake dominates crypto, every staking platform needs authoritative identity.' },
  { s: 'vault',      tier: 3, category: 'Security',    rationale: 'Secure storage, cold wallets, enterprise secrets management. HashiCorp Vault, cold storage providers — high-value security registrants.' },
  { s: 'lock',       tier: 3, category: 'Security',    rationale: 'Security products, 2FA, privacy tools. The universal symbol for security — every consumer and enterprise security brand would want this.' },
  { s: 'safe',       tier: 3, category: 'Security',    rationale: 'Security products, child safety, content moderation, financial safety. Broad safety category with strong institutional and consumer demand.' },
  { s: 'zero',       tier: 3, category: 'Brand',       rationale: 'Zero-emission brands, zero-waste movement, zero-trust security (fastest-growing cybersecurity architecture). Triple-market appeal.' },
  { s: 'next',       tier: 3, category: 'Brand',       rationale: 'Next-generation products, next-in-queue services, future-oriented brands. Clean aspirational identity used across tech, fashion, and retail.' },
  { s: 'open',       tier: 3, category: 'Brand',       rationale: 'Open source, open data, open banking, open APIs. The "open" movement powers the modern tech economy — enormous developer and enterprise appeal.' },
  { s: 'local',      tier: 3, category: 'Brand',       rationale: 'Local businesses, local government, hyper-local services. The local commerce market is $5T+ in the US — every local business needs identity.' },
  { s: 'spend',      tier: 3, category: 'Finance',     rationale: 'Fintech, expense management, financial planning. Corporate spend management is a $10B+ SaaS category — every CFO tool uses this verb.' },
  { s: 'cache',      tier: 3, category: 'Infra',       rationale: 'CDN and caching infrastructure. Tech companies love clean infrastructure identity — cache.companyname is a natural developer convention.' },
  { s: 'runtime',    tier: 3, category: 'Developer',   rationale: 'Application runtimes, developer tools, execution environments. Deno, Node, Bun — every runtime company needs this identity.' },
  { s: 'debug',      tier: 3, category: 'Developer',   rationale: 'Error monitoring, observability platforms, developer tooling. Every developer uses debuggers — clean identity for the growing observability market.' },
  { s: 'platform',   tier: 3, category: 'Technology',  rationale: 'SaaS platforms, marketplaces, two-sided businesses. Every tech company calls itself a platform — enormous registrant breadth.' },
  { s: 'wellness',   tier: 3, category: 'Health',      rationale: 'Health and wellness brands, spas, holistic health, corporate wellness programs. A $4.5T global industry that is increasingly identity-conscious.' },
  { s: 'defi',       tier: 3, category: 'Crypto',      rationale: 'Decentralized finance protocols. The DeFi ecosystem manages $50B+ in assets — authoritative TLD identity is essential for protocol legitimacy.' },

  // ── Additional Tier 2 picks ────────────────────────────────────────────────
  { s: 'build',    tier: 2, category: 'Multi',       rationale: 'Development, construction, and product creation — the universal verb for making things. Appeals to software teams, construction firms, and product companies equally.' },
  { s: 'flow',     tier: 2, category: 'Technology',  rationale: 'Data flows, workflow automation, cash flow, creative flow states. One of the most versatile product verbs in tech — used by Figma, GitHub Actions, and hundreds of SaaS tools.' },
  { s: 'wire',     tier: 2, category: 'Finance',     rationale: 'Wire transfers, wiring money, electrical/infrastructure. The word "wire" is the foundational verb of international finance — billions move by wire daily.' },
  { s: 'chain',    tier: 2, category: 'Technology',  rationale: 'Blockchain, supply chain, tool chaining, podcast networks. "Chain" is the defining metaphor of the most transformative technology since the internet.' },
  { s: 'seed',     tier: 2, category: 'Finance',     rationale: 'Seed funding, seed investors, agriculture, cannabis. The first stage of the entire venture capital ecosystem — every seed fund and accelerator needs this identity.' },
  { s: 'edge',     tier: 2, category: 'Technology',  rationale: 'Edge computing, CDN edge nodes, competitive edge. Cloudflare, Fastly, and every CDN company has an "edge" product — enormous embedded demand.' },
  { s: 'core',     tier: 2, category: 'Technology',  rationale: 'Core systems, processor cores, core banking, core values. "Core" is used universally across tech and business to mean the essential foundation.' },
  { s: 'base',     tier: 2, category: 'Technology',  rationale: 'Databases, military bases, home bases, knowledge bases. Coinbase built a $60B+ company starting with this word — the TLD has enormous residual demand.' },
  { s: 'root',     tier: 2, category: 'Technology',  rationale: 'Root access, root cause analysis, root DNS servers, botanical roots. Technical authority with broad metaphorical appeal across industries.' },
  { s: 'gate',     tier: 2, category: 'Finance',     rationale: 'Payment gateways, access gates, entry points. Every fintech payment processor has a gateway product — and "gate" is shorter and cleaner than .gateway.' },
  { s: 'mint',     tier: 2, category: 'Finance',     rationale: 'NFT minting, currency minting, Intuit Mint (personal finance). Perfect for the emerging digital asset economy and the $2T+ US government mint association.' },
  { s: 'yield',    tier: 2, category: 'Finance',     rationale: 'Investment yield, DeFi yield farming, crop yield, productivity. The single most important number in fixed-income investing — enormous financial sector demand.' },
  { s: 'asset',    tier: 2, category: 'Finance',     rationale: 'Asset management, digital assets, real assets. Every wealth management firm, digital asset platform, and institutional investor needs clean asset identity.' },
  { s: 'equity',   tier: 2, category: 'Finance',     rationale: 'Private equity, home equity, stock equity, DEI equity. A foundational finance term used by every investment bank, PE firm, and startup during fundraising.' },
  { s: 'bond',     tier: 2, category: 'Finance',     rationale: 'Bonds, fixed-income securities, bail bonds, chemical bonds. Government and corporate bond markets dwarf equities — enormous institutional registrant base.' },
  { s: 'lend',     tier: 2, category: 'Finance',     rationale: 'Digital lending platforms, P2P lending, mortgage lending. The fintech lending market is $500B+ and growing — every lender needs authoritative identity.' },
  { s: 'insure',   tier: 2, category: 'Insurance',   rationale: 'Insurance platforms, insuretech, embedded insurance. The $7T global insurance industry is undergoing digital transformation — clean identity matters.' },
  { s: 'cover',    tier: 2, category: 'Insurance',   rationale: 'Insurance coverage, news coverage, software covers. "Cover" is the consumer-facing verb for insurance — used by every direct-to-consumer insurer.' },
  { s: 'claim',    tier: 2, category: 'Insurance',   rationale: 'Insurance claims, content claims, legal claims. The highest-friction moment in insurance — every claims management platform needs this identity.' },
  { s: 'nurse',    tier: 2, category: 'Health',      rationale: '5M+ nurses in the US alone — among the largest professional identity markets. Nurse practitioners, staffing agencies, and nursing education all need this.' },
  { s: 'rehab',    tier: 2, category: 'Health',      rationale: 'Rehabilitation centers, addiction treatment, physical rehabilitation. A massive $42B US market that is highly fragmented and identity-motivated.' },
  { s: 'coach',    tier: 2, category: 'Services',    rationale: 'Life coaching, executive coaching, sports coaching, AI coaching. The coaching industry is $15B+ and entirely composed of individuals who need identity.' },
  { s: 'mentor',   tier: 2, category: 'Services',    rationale: 'Mentorship platforms, educational mentors, startup mentors. With remote work normalizing virtual mentorship, this market is expanding rapidly.' },
  { s: 'broker',   tier: 2, category: 'Finance',     rationale: 'Stockbrokers, mortgage brokers, insurance brokers, freight brokers. Every brokerage firm in every industry needs authoritative identity.' },
  { s: 'pilot',    tier: 2, category: 'Multi',       rationale: 'Aviation pilots, product pilots, software pilots, pilot programs. Dual-market: aviation licensing identity + tech product launch identity.' },
  { s: 'cargo',    tier: 2, category: 'Logistics',   rationale: 'Air cargo, maritime cargo, freight logistics. The $10T global logistics industry needs authoritative TLD identity as it digitizes rapidly.' },
  { s: 'freight',  tier: 2, category: 'Logistics',   rationale: 'Freight logistics, trucking, supply chain. The fragmented $1T+ US freight market is ripe for digital identity — every carrier and broker needs this.' },
  { s: 'fleet',    tier: 2, category: 'Logistics',   rationale: 'Fleet management, vehicle fleets, shipping fleets. Fleet software is a $25B+ market with enormous embedded demand for authoritative identity.' },
  { s: 'energy',   tier: 2, category: 'Energy',      rationale: 'Energy companies, renewable energy, energy trading. As energy transitions globally, every utility, solar installer, and grid operator needs clean identity.' },
  { s: 'solar',    tier: 2, category: 'Energy',      rationale: 'Solar energy companies, solar installers, solar technology. The fastest-growing energy sector — 3M+ US installations and growing exponentially.' },
  { s: 'grid',     tier: 2, category: 'Technology',  rationale: 'Power grids, CSS Grid, data grids, smart grid technology. Universal infrastructure metaphor across both energy and web development.' },

  // ── Additional Tier 3 picks ────────────────────────────────────────────────
  { s: 'protocol', tier: 3, category: 'Technology',  rationale: 'Blockchain protocols, network protocols, medical protocols. "Protocol" is the word at the foundation of both internet infrastructure and crypto.' },
  { s: 'mesh',     tier: 3, category: 'Technology',  rationale: 'Network mesh, mesh Wi-Fi, blockchain mesh networks. The future of distributed computing and networking.' },
  { s: 'pipe',     tier: 3, category: 'Developer',   rationale: 'Unix pipes, data pipelines, CI/CD pipelines. Every data engineer and DevOps professional uses pipes — endemic to the modern software stack.' },
  { s: 'repo',     tier: 3, category: 'Developer',   rationale: 'Code repositories, GitHub repos, package repos. Every developer has repos — a clean identity for the $10B+ developer tools market.' },
  { s: 'bridge',   tier: 3, category: 'Technology',  rationale: 'Blockchain bridges, network bridges, financial bridges. Cross-chain interoperability is one of the biggest challenges in crypto — enormous demand.' },
  { s: 'signal',   tier: 3, category: 'Technology',  rationale: 'Market signals, Signal messaging app, trading signals, RF signals. The word "signal" is embedded across finance, tech, and communications.' },
  { s: 'stream',   tier: 3, category: 'Media',       rationale: 'Streaming services, data streams, live streaming. With streaming now the default media consumption model, clean identity in this vertical is essential.' },
  { s: 'sport',    tier: 3, category: 'Sports',      rationale: 'Sports brands, sports media, athletic identity. The $500B global sports industry needs authoritative TLD identity beyond fragmented country extensions.' },
  { s: 'music',    tier: 3, category: 'Media',       rationale: 'Music streaming, independent artists, music labels, music education. The $26B+ global recorded music industry is finally embracing digital-first identity.' },
  { s: 'wealth',   tier: 3, category: 'Finance',     rationale: 'Wealth management, family offices, financial wellness. Every private bank and wealth manager needs an identity that signals success and trust.' },
  { s: 'earn',     tier: 3, category: 'Finance',     rationale: 'Crypto earning platforms, employee earnings, financial returns. "Earn" is the universal positive financial verb — enormous breadth of registrant demand.' },
  { s: 'save',     tier: 3, category: 'Finance',     rationale: 'Savings accounts, coupon saving, data backup. "Save" is the second-most-common financial action after spending — universal consumer appeal.' },
  { s: 'loan',     tier: 3, category: 'Finance',     rationale: 'Personal loans, student loans, mortgage loans. The consumer lending market is $4T+ — every lender and comparison platform needs this identity.' },
  { s: 'surgery',  tier: 3, category: 'Health',      rationale: 'Surgical practices, robotic surgery, medical procedures. Surgeons are among the highest-earning professionals — strong premium identity demand.' },
  { s: 'court',    tier: 3, category: 'Legal',       rationale: 'Courts, legal proceedings, sports courts, food courts. Dual-market: legal authority and sports identity.' },
  { s: 'judge',    tier: 3, category: 'Legal',       rationale: 'Judicial identity, competition judges, product review platforms. Unique authority association that no other TLD can replicate.' },
  { s: 'team',     tier: 3, category: 'Business',    rationale: 'Team collaboration tools, sports teams, team identity. Microsoft Teams built a $20B+ business on this word — every team needs this identity.' },
  { s: 'group',    tier: 3, category: 'Business',    rationale: 'Business groups, holding companies, community groups. Every major corporation has a "group" entity — enormous corporate identity demand.' },
  { s: 'studio',   tier: 3, category: 'Creative',    rationale: 'Design studios, recording studios, photo studios, game studios. Every creative professional and agency needs clean studio identity.' },
  { s: 'design',   tier: 3, category: 'Creative',    rationale: 'Design agencies, product design, interior design. Design is now a core business function — every agency and in-house team needs clean identity.' },
  { s: 'media',    tier: 3, category: 'Media',       rationale: 'Media companies, social media brands, media agencies. Every content company, publisher, and agency will want a cleaner identity than .media alternatives.' },
  { s: 'press',    tier: 3, category: 'Media',       rationale: 'News organizations, PR agencies, publishing. "Press" is the traditional authority word for journalism — enormous legacy media demand.' },
  { s: 'photo',    tier: 3, category: 'Media',       rationale: 'Photography businesses, photo sharing platforms, visual media. 2B+ photos are taken daily — the photography industry is massive and fragmented.' },
  { s: 'video',    tier: 3, category: 'Media',       rationale: 'Video production companies, video platforms, video streaming. Video is 80%+ of all internet traffic — the identity demand in this space is enormous.' },
  { s: 'podcast',  tier: 3, category: 'Media',       rationale: 'Podcast hosting, podcast networks, podcast agencies. 4M+ podcasts exist — every podcast and network needs clean identity beyond .com.' },
  { s: 'review',   tier: 3, category: 'Commerce',    rationale: 'Review platforms, peer review, product reviews. Reviews drive $2.6T in annual e-commerce revenue — the most trusted commerce signal.' },
  { s: 'compare',  tier: 3, category: 'Commerce',    rationale: 'Price comparison, product comparison platforms. The entire insurance aggregator industry (worth $10B+) is built on comparison.' },
  { s: 'guide',    tier: 3, category: 'Publishing',  rationale: 'Travel guides, how-to guides, product guides, educational guides. "Guide" is the universal word for trusted expert content across every vertical.' },
  { s: 'report',   tier: 3, category: 'Publishing',  rationale: 'Research reports, financial reports, news reporting. Every financial institution, news outlet, and research firm publishes reports.' },
  { s: 'survey',   tier: 3, category: 'Data',        rationale: 'Survey platforms, market research, polling. SurveyMonkey was acquired for $1.5B on this concept — the market research identity is highly valuable.' },
  { s: 'analytics',tier: 3, category: 'Data',        rationale: 'Analytics platforms, business intelligence, data analysis. Every company now has an analytics stack — the universal term for data-driven decision making.' },
];

// ─── Scoring Logic ────────────────────────────────────────────────────────────

function demandCalibration(demandScore: number): number {
  if (demandScore < 15)  return 40 + demandScore * 2;
  if (demandScore < 50)  return 70 + (demandScore - 15) * 0.86;
  if (demandScore < 75)  return 100 - (demandScore - 50) * 0.8;
  return 80 - (demandScore - 75) * 1.2;
}

interface ScoredResult extends ExpertPick {
  opportunityScore: number;
  survivalScore: number;
  demandScore: number;
  competitionLevel: string;
  riskLevel: string;
  isHardBlocked: boolean;
  topFlags: string[];
  estApplicants: string;
  estBudget: string;
}

function extractContention(report: ReturnType<typeof assess>): { applicants: string; budget: string } {
  const cat = report.categories.find(c => c.category === 'STRING_CONTENTION');
  if (!cat) return { applicants: '1', budget: '<$227K' };
  for (const flag of cat.flags) {
    const m1 = flag.detail.match(/(\d+)\s+applicants?/i);
    const m2 = flag.detail.match(/\$([\d,.]+[MK]?)/i);
    if (m1 || m2) {
      return {
        applicants: m1 ? m1[1] : '1',
        budget: m2 ? '$' + m2[1] : '<$227K',
      };
    }
  }
  return { applicants: '1', budget: '<$227K' };
}

// ─── Run Assessments ──────────────────────────────────────────────────────────

console.log(`\n🔍 Assessing ${EXPERT_PICKS.length} expert picks...\n`);

const results: ScoredResult[] = [];
const filtered: { s: string; reason: string }[] = [];

for (const pick of EXPERT_PICKS) {
  const report = assess(pick.s, 'open');
  const { applicants, budget } = extractContention(report);

  if (report.isHardBlocked) {
    filtered.push({ s: pick.s, reason: 'Hard blocked (reserved/existing TLD)' });
    console.log(`  ✗ .${pick.s.padEnd(12)} BLOCKED`);
    continue;
  }

  const survivalScore = 100 - report.applicationRiskScore;
  const demandScore   = report.competitiveDemandScore;
  const calibrated    = demandCalibration(demandScore);
  const opportunityScore = Math.round(survivalScore * 0.60 + calibrated * 0.40);

  const topFlags = report.topFlags
    .filter(f => f.severity === 'HIGH' || f.severity === 'MEDIUM')
    .slice(0, 2)
    .map(f => f.title);

  results.push({
    ...pick,
    opportunityScore,
    survivalScore: Math.round(survivalScore),
    demandScore:   Math.round(demandScore),
    competitionLevel: report.competitiveDemandLevel,
    riskLevel:    report.applicationRiskLevel,
    isHardBlocked: false,
    topFlags,
    estApplicants: applicants,
    estBudget:     budget,
  });

  const score = opportunityScore.toString().padStart(3);
  console.log(`  ✓ .${pick.s.padEnd(12)} score: ${score}  risk: ${report.applicationRiskLevel.padEnd(6)}  demand: ${report.competitiveDemandLevel}`);
}

// Sort by opportunity score descending, tier as tiebreaker
results.sort((a, b) =>
  b.opportunityScore - a.opportunityScore || a.tier - b.tier
);

const top100 = results.slice(0, 100);

console.log(`\n✅ ${results.length} strings passed engine  |  ${filtered.length} filtered out  |  Showing top ${top100.length}\n`);

// ─── HTML Generation ──────────────────────────────────────────────────────────

const tierColors: Record<number, { bg: string; text: string; border: string; label: string }> = {
  1: { bg: '#2a1f00', text: '#f5c842', border: '#f5c842', label: 'T1 Ultra Premium' },
  2: { bg: '#001a2e', text: '#4da6ff', border: '#4da6ff', label: 'T2 Strong Commercial' },
  3: { bg: '#1a0030', text: '#bf5af2', border: '#bf5af2', label: 'T3 Emerging' },
};

const riskColors: Record<string, string> = {
  HIGH:   '#ff453a',
  MEDIUM: '#ff9f0a',
  LOW:    '#0a84ff',
  CLEAR:  '#32d74b',
};

const competitionColors: Record<string, string> = {
  HIGH:   '#ff453a',
  MEDIUM: '#ff9f0a',
  LOW:    '#32d74b',
  CLEAR:  '#32d74b',
};

const t1count = top100.filter(r => r.tier === 1).length;
const t2count = top100.filter(r => r.tier === 2).length;
const t3count = top100.filter(r => r.tier === 3).length;
const threeLetterCount = top100.filter(r => r.s.length === 3).length;

function scoreBar(score: number): string {
  const pct = Math.min(100, score);
  let color = '#32d74b';
  if (pct < 40) color = '#ff453a';
  else if (pct < 60) color = '#ff9f0a';
  else if (pct < 75) color = '#0a84ff';
  return `<div style="display:flex;align-items:center;gap:6px">
    <div style="flex:1;height:6px;background:#1e2a3a;border-radius:3px;overflow:hidden">
      <div style="width:${pct}%;height:100%;background:${color};border-radius:3px"></div>
    </div>
    <span style="font-size:11px;color:#8899aa;min-width:24px;text-align:right">${score}</span>
  </div>`;
}

const rows = top100.map((r, i) => {
  const tc = tierColors[r.tier];
  const is3letter = r.s.length === 3 || r.s.length === 2;
  const flagHtml = r.topFlags.length
    ? r.topFlags.map(f => `<span style="font-size:10px;color:#ff9f0a;background:#2a1a00;border:1px solid #ff9f0a33;padding:1px 5px;border-radius:3px;display:inline-block;margin:1px">${f}</span>`).join(' ')
    : '<span style="font-size:10px;color:#32d74b">No major flags</span>';

  return `<tr style="border-bottom:1px solid #1e2a3a">
    <td style="padding:10px 8px;text-align:center;color:#556677;font-size:12px;font-weight:600">${i + 1}</td>
    <td style="padding:10px 8px;text-align:center">
      <span style="font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;border:1px solid ${tc.border};color:${tc.text};background:${tc.bg};white-space:nowrap">T${r.tier}</span>
    </td>
    <td style="padding:10px 8px">
      <div style="display:flex;align-items:center;gap:6px">
        <span style="font-family:monospace;font-size:15px;font-weight:700;color:#e8f0ff">.${r.s}</span>
        ${is3letter ? '<span style="font-size:11px;color:#f5c842" title="3-letter premium">★</span>' : ''}
      </div>
      <div style="font-size:11px;color:#556677;margin-top:2px">${r.category}</div>
    </td>
    <td style="padding:10px 8px;min-width:120px">${scoreBar(r.opportunityScore)}</td>
    <td style="padding:10px 8px;text-align:center">
      <span style="font-size:11px;font-weight:600;color:${riskColors[r.riskLevel] || '#8899aa'}">${r.riskLevel}</span>
    </td>
    <td style="padding:10px 8px;text-align:center">
      <span style="font-size:11px;font-weight:600;color:${competitionColors[r.competitionLevel] || '#8899aa'}">${r.competitionLevel}</span>
    </td>
    <td style="padding:10px 8px;text-align:center;font-size:11px;color:#8899aa">${r.estApplicants}</td>
    <td style="padding:10px 8px;max-width:360px">
      <div style="font-size:12px;color:#aab8cc;line-height:1.5">${r.rationale}</div>
      <div style="margin-top:5px">${flagHtml}</div>
    </td>
  </tr>`;
}).join('\n');

const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ICANN 2026 — Expert TLD Portfolio</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #070d18; color: #c8d8e8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; min-height: 100vh; }
    .container { max-width: 1400px; margin: 0 auto; padding: 40px 24px; }
    .header { margin-bottom: 40px; }
    .header-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    .badge { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; color: #4da6ff; background: #001a2e; border: 1px solid #1e4060; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; }
    h1 { font-size: 32px; font-weight: 800; color: #e8f0ff; margin: 12px 0 8px; letter-spacing: -0.02em; }
    .subtitle { font-size: 15px; color: #6677aa; margin-bottom: 24px; }
    .stats { display: flex; gap: 16px; flex-wrap: wrap; }
    .stat { background: #0d1a2e; border: 1px solid #1e2a3a; border-radius: 8px; padding: 14px 20px; min-width: 120px; }
    .stat-value { font-size: 24px; font-weight: 800; color: #e8f0ff; }
    .stat-label { font-size: 11px; color: #556677; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.05em; }
    .stat.gold .stat-value { color: #f5c842; }
    .stat.blue .stat-value { color: #4da6ff; }
    .stat.purple .stat-value { color: #bf5af2; }
    .stat.star .stat-value { color: #f5c842; }
    .table-wrap { background: #0a1220; border: 1px solid #1e2a3a; border-radius: 10px; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #0d1a2e; }
    thead th { padding: 10px 8px; text-align: left; font-size: 11px; font-weight: 700; color: #4da6ff; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 2px solid #1e2a3a; }
    thead th:first-child { text-align: center; }
    tbody tr:hover { background: #0d1a2e; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #1e2a3a; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #334455; }
    .legend { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 24px; }
    .legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #556677; }
    .legend-dot { width: 8px; height: 8px; border-radius: 50%; }
    @media print {
      body { background: white; color: black; }
      .container { max-width: none; padding: 20px; }
      table { font-size: 11px; }
      .table-wrap { border: 1px solid #ccc; }
      thead tr { background: #f0f0f0 !important; }
    }
  </style>
</head>
<body>
<div class="container">

  <div class="header">
    <div class="header-top">
      <span class="badge">ICANN 2026 New gTLD Round</span>
      <span style="font-size:12px;color:#334455">${now}</span>
    </div>
    <h1>Expert TLD Portfolio</h1>
    <p class="subtitle">Top 100 strings ranked by application survivability and competitive demand — evaluated against the ICANN risk engine.</p>

    <div class="stats">
      <div class="stat">
        <div class="stat-value">${EXPERT_PICKS.length}</div>
        <div class="stat-label">Strings Analyzed</div>
      </div>
      <div class="stat">
        <div class="stat-value">${results.length}</div>
        <div class="stat-label">Passed Engine</div>
      </div>
      <div class="stat gold">
        <div class="stat-value">${t1count}</div>
        <div class="stat-label">T1 Ultra Premium</div>
      </div>
      <div class="stat blue">
        <div class="stat-value">${t2count}</div>
        <div class="stat-label">T2 Strong Commercial</div>
      </div>
      <div class="stat purple">
        <div class="stat-value">${t3count}</div>
        <div class="stat-label">T3 Emerging</div>
      </div>
      <div class="stat star">
        <div class="stat-value">${threeLetterCount} ★</div>
        <div class="stat-label">3-Letter Premium</div>
      </div>
    </div>
  </div>

  <div class="legend">
    <div class="legend-item"><div class="legend-dot" style="background:#32d74b"></div>CLEAR / LOW risk or competition</div>
    <div class="legend-item"><div class="legend-dot" style="background:#ff9f0a"></div>MEDIUM risk or competition</div>
    <div class="legend-item"><div class="legend-dot" style="background:#ff453a"></div>HIGH risk or competition</div>
    <div class="legend-item"><span style="color:#f5c842;font-size:12px">★</span>&nbsp;3-letter premium string</div>
  </div>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th style="width:36px">#</th>
          <th style="width:80px">Tier</th>
          <th>String</th>
          <th style="width:150px">Opportunity</th>
          <th style="width:80px;text-align:center">App Risk</th>
          <th style="width:90px;text-align:center">Competition</th>
          <th style="width:70px;text-align:center">Est. Apps</th>
          <th>Expert Rationale</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  </div>


  <div class="footer">
    <span>Generated by the ICANN Risk Engine · Expert picks curated for the ICANN 2026 new gTLD round</span>
    <span>Not legal advice · For strategic planning purposes only</span>
  </div>

</div>
</body>
</html>`;

writeFileSync('recommendations.html', html, 'utf8');
console.log('📄 recommendations.html written successfully.\n');
