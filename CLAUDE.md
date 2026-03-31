# TLD Risk Checker — Claude Instructions

## Project Overview
Web app for an internet registry applying for 30–40 new TLDs in the ICANN 2026 round.
Assesses risk of candidate TLD strings against the ICANN 2026 Round Applicant Guidebook (AGB V1-2025.12.16).

The user is a non-developer. Keep explanations simple and jargon-free.

## Tech Stack
- Vite + React + TypeScript + Tailwind CSS v4 (`@tailwindcss/vite` plugin — no `tailwind.config.js`)
- Recharts for radar chart
- Anthropic SDK for streaming AI analysis (client-side, `dangerouslyAllowBrowser: true`)
- No backend — all logic runs client-side

## Project Structure
```
/                          ← git root
├── CLAUDE.md
├── app/                   ← all source code
│   ├── package.json
│   ├── vite.config.ts     ← server: { host: '0.0.0.0', port: 5173 }
│   └── src/
│       ├── engine/
│       │   ├── types.ts               ← RiskFlag, CategoryResult, TLDRiskReport
│       │   │                             recommendations: { text, severity }[]
│       │   ├── index.ts               ← main assessTLD() entry point
│       │   ├── checks/                ← 10 check modules
│       │   │   ├── reserved.ts
│       │   │   ├── similarity.ts
│       │   │   ├── geographic.ts
│       │   │   ├── collision.ts
│       │   │   ├── trademark.ts       ← exact + prefix + near-miss (Levenshtein) + sensitive + stock exchange
│       │   │   ├── objection.ts
│       │   │   ├── regulated.ts
│       │   │   ├── idn.ts
│       │   │   ├── contention.ts      ← contention scoring; length premium gated on semantic signals
│       │   │   └── evaluation.ts
│       │   └── data/
│       │       ├── existing-tlds.ts   ← 1,436 IANA TLDs
│       │       ├── countries.ts       ← 8,514 country names, 250 alpha2, 247 capitals
│       │       ├── string-context.ts  ← semantic classification (12 classes)
│       │       ├── gtld-prices.ts     ← 80+ price records; era field ('2012'|'2026_outlook'); getComparables()
│       │       ├── contention2012.ts  ← 2012 contention outcomes map
│       │       ├── demand.ts          ← commercial value + search popularity maps
│       │       │                         includes tech abbreviations: auth, api, dev, sdk, cdn, dns, ssl, vpn
│       │       │                         includes 2026 outlook: web3, defi, fintech, ml, saas, etc.
│       │       ├── brands.ts          ← WELL_KNOWN_BRANDS + NEAR_MISS_BRANDS + SENSITIVE_STRINGS + STOCK_EXCHANGES
│       │       ├── collision.ts
│       │       ├── confusables.ts
│       │       ├── geographic.ts
│       │       ├── igo.ts
│       │       ├── objections2012.ts
│       │       ├── prior-round.ts
│       │       ├── regulated.ts
│       │       └── reserved-names.ts
│       ├── lib/
│       │   └── claude.ts              ← AI prompt builder + streaming + verdict logic
│       │                                 buildPrompt() filters to HIGH/MEDIUM flags only (materialFlags)
│       └── components/
│           ├── AIAnalysisPanel.tsx    ← progressive streaming render; parses AI output in real-time
│           ├── RiskCategoryCard.tsx   ← expandable flag cards
│           └── ...
```

## Dev Server
Run from project root (not from `app/`):
```
npm run dev --prefix app
```
The `.claude/launch.json` is configured with `--prefix app`.

## Deployment
- **GitHub:** `tonytiger416/tld-risk-checker` (`main` branch)
- **Vercel:** auto-deploys on push to `main`
- Build command: `npm run build --prefix app`
- Output directory: `app/dist`

## Key Architectural Decisions

### Two-Score System
Every assessment produces two independent scores:
- **Application Risk Score** (0–100) — can the string survive ICANN evaluation?
- **Competitive Demand Score** (0–100) — how contested will it be at auction?

### AI Verdict
The verdict (`STRONG APPLY` / `APPLY WITH STRATEGY` / `HIGH RISK – PROCEED WITH CAUTION` / `DO NOT APPLY`) is computed deterministically by `computeVerdict()` in `claude.ts` from engine scores. The AI is given this verdict and must use it exactly — it only explains the reasoning, never chooses the verdict.

### AI Output — Real-Time Streaming
`AIAnalysisPanel.tsx` parses the AI output progressively on every streamed chunk. The structured UI renders in real-time as Claude writes it — no buffering, no snap from raw text to formatted view. The verdict badge shows immediately (engine-derived). A blinking cursor tracks the active section.

### Stat Chips (👥 💰 🏢)
Emoji stat chips appear **only** in the AI-generated Competitive Landscape section (`AIAnalysisPanel.tsx`).

Chip value priority chain:
1. AI-parsed values from `## COMPETITIVE STATS` structured output section
2. Engine flag `stats` arrays (fallback during streaming)
3. Score-based generic fallback

### AI Output Structure
Claude outputs exactly four sections in order:
1. `## RECOMMENDATION` — verdict on first line, then 5–7 sentences balanced between opportunity and risk
2. `## COMPETITIVE LANDSCAPE` — 3–4 sentences
3. `## COMPETITIVE STATS` — exactly three lines: `APPLICANTS:`, `BUDGET:`, `OPERATORS:`
4. `## OBJECTION SIGNALS` — exactly four lines: `GAC:`, `LPI:`, `COMMUNITY:`, `LRO:`

### AI Persona & Tone
The expert is a trusted strategic advisor, not a risk auditor. The RECOMMENDATION must:
- Lead with the commercial/strategic opportunity of the string
- Cover objections proportionally (one sentence if low, more only if genuinely serious)
- Cite AGB sections and 2012 precedents only where they add weight — not on every sentence
- Use plain, confident language; explain any ICANN jargon in context
- Give one concrete tactical action as the closing advice
- **Never reference internal engine scores, signal levels, or the scoring system** — speak as an expert, not as a wrapper around a system

`parseAnalysis()` in `AIAnalysisPanel.tsx` splits on these headings:
```
/##\s*COMPETITIVE LANDSCAPE\s*([\s\S]*?)(?=##\s*COMPETITIVE STATS|$)/i
/##\s*COMPETITIVE STATS\s*([\s\S]*?)(?=##\s*OBJECTION SIGNALS|$)/i
```

### Competitive Demand Scoring — Length Premium Gating
The length premium in `contention.ts` (CON-006) is **gated on semantic signals**. A short string only gets a full MEDIUM/HIGH severity length bonus if at least one other signal also fires (commercial value, search popularity, or 2012 contention history). An opaque 4-char string like `.hsgs` with no other signals gets a LOW-severity scarcity note with low estimates ($50K–$200K, 1–2 applicants) — not the same treatment as a semantically meaningful string like `.auth`.

### Trademark Check — Near-Miss Detection
`trademark.ts` now has four layers:
1. **Exact match** against `WELL_KNOWN_BRANDS` → HIGH severity (TM-001)
2. **Prefix match** — string starts with a known brand → MEDIUM (TM-002)
3. **Near-miss / typosquat** — Levenshtein edit distance == 1 from `NEAR_MISS_BRANDS` (coined terms only) → MEDIUM (TM-NEAR). Catches `.nke` (nike), `.googl` (google), `.amazn` (amazon). Generic English word brands excluded to avoid false positives.
4. **Sensitive strings + stock exchanges** → HIGH (TM-003, TM-004)

### Semantic Classification System
Implemented in `string-context.ts` + `gtld-prices.ts`:
- `classifyString(s)` → 12 semantic classes with description, buyerProfile, regulatoryNote
- `getComparables(s, class)` → top 5 price records scored by semantic match + length affinity
- `buildPrompt()` injects `STRING CONTEXT` and `STRING COMPARABLES` blocks into every AI prompt
- `2026_outlook` price records get +30 scoring bonus to surface above 2012 actuals
- AI is instructed to use comparables as calibration anchors, not generic length tiers

### Objection Coverage
Every AI recommendation must explicitly cover all four objection mechanisms:
- (a) GAC Early Warning / formal advice — name specific governments
- (b) LPI objection under AGB §3.5.2
- (c) Community Objection under AGB §3.5.4
- (d) LRO from trademark holders

### AI Prompt Flag Filtering
`buildPrompt()` sends only `materialFlags` (HIGH and MEDIUM severity) to the AI. LOW and CLEAR flags are suppressed with a count note. This prevents noise from drowning the actionable signals.

## Common Tasks

### Adding a new check module
1. Create `app/src/engine/checks/yourcheck.ts` returning `CategoryResult`
2. Add the category key to `types.ts`
3. Import and call in `app/src/engine/index.ts`

### Updating the IANA TLD list
Re-run the Python fetch commands used during the original build against `https://data.iana.org/TLD/tlds-alpha-by-domain.txt`.

### Updating countries data
Fetch from `https://raw.githubusercontent.com/mledoze/countries/master/countries.json` and regenerate `countries.ts`.

### Updating gTLD price records
Edit `app/src/engine/data/gtld-prices.ts` — add new `PriceRecord` entries to `PRICE_RECORDS`. Use `era: '2026_outlook'` for forward estimates. The `getComparables()` scoring weights are at the bottom of that file.

### Adding brands to near-miss detection
Add coined-term brand names to `NEAR_MISS_BRANDS` in `app/src/engine/data/brands.ts`. Only include non-dictionary coined terms — avoid common English words that would cause false positives.

### Adding commercial value signals
Edit `COMMERCIAL_VALUE` or `SEARCH_POPULARITY` maps in `app/src/engine/data/demand.ts`. Higher tier = more points = higher competitive demand score.

## Style Conventions
- Deep navy dark palette — no light mode
- No emoji in UI text (except the stat chips: 👥 💰 🏢)
- Tailwind CSS v4 only — no `@apply`, no `tailwind.config.js`
- TypeScript strict mode — no `any`
- Keep components focused; avoid over-engineering
- `max_tokens: 1300` for Claude API calls (4 sections only)
- Model: `claude-sonnet-4-6`

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
