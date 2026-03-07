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
│       │   ├── index.ts               ← main assessTLD() entry point
│       │   ├── checks/                ← 10 check modules
│       │   │   ├── reserved.ts
│       │   │   ├── similarity.ts
│       │   │   ├── geographic.ts
│       │   │   ├── collision.ts
│       │   │   ├── trademark.ts
│       │   │   ├── objection.ts
│       │   │   ├── regulated.ts
│       │   │   ├── idn.ts
│       │   │   ├── contention.ts      ← string contention scoring + stat chips
│       │   │   └── evaluation.ts
│       │   └── data/
│       │       ├── existing-tlds.ts   ← 1,436 IANA TLDs
│       │       ├── countries.ts       ← 8,514 country names, 250 alpha2, 247 capitals
│       │       ├── string-context.ts  ← semantic classification (12 classes)
│       │       ├── gtld-prices.ts     ← 80+ 2012-round price records + getComparables()
│       │       ├── contention2012.ts  ← 2012 contention outcomes map
│       │       ├── demand.ts          ← commercial value + search popularity maps
│       │       ├── brands.ts
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
│       └── components/
│           ├── AIAnalysisPanel.tsx    ← AI output parser + chip rendering
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

### Stat Chips (👥 💰 🏢)
Emoji stat chips appear **only** in the AI-generated Competitive Landscape section (`AIAnalysisPanel.tsx`). They are **not** rendered inside the expandable contention flag cards (`RiskCategoryCard.tsx`).

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

Citations section removed — AGB/precedent refs are cited inline in the RECOMMENDATION text instead.

### AI Persona & Tone
The expert is a trusted strategic advisor, not a risk auditor. The RECOMMENDATION must:
- Lead with the commercial/strategic opportunity of the string
- Cover objections proportionally (one sentence if low, more only if genuinely serious)
- Cite AGB sections and 2012 precedents only where they add weight — not on every sentence
- Use plain, confident language; explain any ICANN jargon in context
- Give one concrete tactical action as the closing advice

`parseAnalysis()` in `AIAnalysisPanel.tsx` splits on these headings:
```
/##\s*COMPETITIVE LANDSCAPE\s*([\s\S]*?)(?=##\s*COMPETITIVE STATS|$)/i
/##\s*COMPETITIVE STATS\s*([\s\S]*?)(?=##\s*OBJECTION SIGNALS|$)/i
```

### Semantic Classification System (Phase 1–3)
Implemented in `string-context.ts` + `gtld-prices.ts`:
- `classifyString(s)` → 12 semantic classes with description, buyerProfile, regulatoryNote
- `getComparables(s, class)` → top 5 price records scored by semantic match + length affinity
- `buildPrompt()` injects `STRING CONTEXT` and `STRING COMPARABLES` blocks into every AI prompt
- AI is instructed to use comparables as calibration anchors, not generic length tiers

This ensures `.usd` (currency_code) gets financial/sovereign comparables, while `.lik` (lifestyle_social) gets lifestyle/consumer comparables — different buyer profiles, different auction estimates.

### Objection Coverage
Every AI recommendation must explicitly cover all four objection mechanisms:
- (a) GAC Early Warning / formal advice — name specific governments
- (b) LPI objection under AGB §3.5.2
- (c) Community Objection under AGB §3.5.4
- (d) LRO from trademark holders

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
Edit `app/src/engine/data/gtld-prices.ts` — add new `PriceRecord` entries to `PRICE_RECORDS`. The `getComparables()` scoring weights are at the bottom of that file.

## Style Conventions
- Deep navy dark palette — no light mode
- No emoji in UI text (except the stat chips: 👥 💰 🏢)
- Tailwind CSS v4 only — no `@apply`, no `tailwind.config.js`
- TypeScript strict mode — no `any`
- Keep components focused; avoid over-engineering
- `max_tokens: 1300` for Claude API calls (citations removed, 4 sections only)
- Model: `claude-sonnet-4-6`
