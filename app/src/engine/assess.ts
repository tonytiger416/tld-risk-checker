import type { TLDRiskReport, RiskLevel, CategoryResult, RiskFlag, AppType } from './types';
import { BLOCKER_CATEGORIES, APPLICATION_RISK_CATEGORIES, COMPETITIVE_DEMAND_CATEGORIES } from './types';
import { checkReserved } from './checks/reserved';
import { checkSimilarity } from './checks/similarity';
import { checkGeographic } from './checks/geographic';
import { checkCollision } from './checks/collision';
import { checkTrademark } from './checks/trademark';
import { checkObjection } from './checks/objection';
import { checkRegulated } from './checks/regulated';
import { checkIDN } from './checks/idn';
import { checkContention } from './checks/contention';
import { checkEvaluation } from './checks/evaluation';
import { checkIGO } from './checks/igo';


function levelFromScore(score: number): RiskLevel {
  if (score >= 70) return 'HIGH';
  if (score >= 35) return 'MEDIUM';
  if (score >= 10) return 'LOW';
  return 'CLEAR';
}

const LEVEL_ORDER: Record<RiskLevel, number> = { CLEAR: 0, LOW: 1, MEDIUM: 2, HIGH: 3 };

// Ensure category level is never lower than its worst flag severity.
// Prevents cases where a HIGH-severity flag lives inside a LOW-level category
// due to score thresholds not being crossed (e.g. short string premium).
function normalizeCategoryLevel(cat: CategoryResult): CategoryResult {
  const maxFlagLevel = cat.flags.reduce<RiskLevel>(
    (max, flag) => LEVEL_ORDER[flag.severity] > LEVEL_ORDER[max] ? flag.severity : max,
    'CLEAR'
  );
  const effectiveLevel = LEVEL_ORDER[maxFlagLevel] > LEVEL_ORDER[cat.level] ? maxFlagLevel : cat.level;
  return effectiveLevel === cat.level ? cat : { ...cat, level: effectiveLevel };
}

export function normalizeString(raw: string): string {
  return raw.trim().toLowerCase().replace(/^\.+/, '');
}

export function assess(raw: string, appType: AppType = 'open'): TLDRiskReport {
  const normalized = normalizeString(raw);

  const { result: simResult, similarTLDs } = checkSimilarity(normalized);

  const categories: CategoryResult[] = [
    checkReserved(normalized),
    checkIGO(normalized),
    simResult,
    checkGeographic(normalized),
    checkCollision(normalized),
    checkTrademark(normalized, appType),
    checkObjection(normalized, appType),
    checkRegulated(normalized),
    checkIDN(normalized),
    checkContention(normalized),
    checkEvaluation(normalized),
  ].map(normalizeCategoryLevel);

  // Hard blockers — no path forward regardless of resources
  const isHardBlocked = categories.some(
    c => BLOCKER_CATEGORIES.has(c.category) && c.level === 'HIGH'
  );

  // ---- Application Risk score ----
  // Anchored to the single worst category finding, with a small additive bonus
  // (+3 pts) for each additional fired category. This prevents dilution of a
  // real finding by clean categories, and gives meaningful differentiation
  // between strings with one concern vs strings with multiple concerns.
  // A HIGH finding always drives the score to at least that category's raw score.
  const firedAppCats = categories.filter(
    c => APPLICATION_RISK_CATEGORIES.has(c.category) && c.score > 0
  );

  const maxCatScore = firedAppCats.reduce((m, c) => Math.max(m, c.score), 0);
  const maxHighScore = firedAppCats.filter(c => c.level === 'HIGH').reduce((m, c) => Math.max(m, c.score), 0);
  const additionalFired = Math.max(0, firedAppCats.length - 1);

  const applicationRiskScore = isHardBlocked ? 100
    : Math.round(Math.min(99, Math.max(maxCatScore, maxHighScore) + additionalFired * 3));
  const applicationRiskLevel = levelFromScore(applicationRiskScore);

  // ---- Competitive Demand score (STRING_CONTENTION category score, 0–100) ----
  const contentionCat = categories.find(c => COMPETITIVE_DEMAND_CATEGORIES.has(c.category));
  const competitiveDemandScore = isHardBlocked ? 100 : (contentionCat?.score ?? 0);
  const competitiveDemandLevel = isHardBlocked ? 'HIGH' : (contentionCat?.level ?? 'CLEAR');

  // overallScore drives the card border colour — use the same formula as applicationRiskScore
  const overallScore = applicationRiskScore;
  const overallLevel = levelFromScore(overallScore);

  // ---- Flags and recommendations ----
  const allFlags: RiskFlag[] = categories.flatMap(c => c.flags);
  const levelOrder: Record<RiskLevel, number> = { HIGH: 3, MEDIUM: 2, LOW: 1, CLEAR: 0 };
  const topFlags = [...allFlags]
    .filter(f => f.severity !== 'CLEAR')
    .sort((a, b) => levelOrder[b.severity] - levelOrder[a.severity])
    .slice(0, 5);

  const recommendations: { text: string; severity: RiskLevel }[] = [];

  if (isHardBlocked) {
    recommendations.push({ text: '⛔ HARD BLOCKED — no viable path to delegation exists for this string. Do not spend resources on this application.', severity: 'HIGH' });
  }

  const highFlags = allFlags.filter(f => f.severity === 'HIGH');
  const seenRecs = new Set<string>();
  highFlags.forEach(f => {
    const text = `${f.title} — ${f.recommendation}`;
    if (!seenRecs.has(text)) { seenRecs.add(text); recommendations.push({ text, severity: 'HIGH' }); }
  });

  const medFlags = allFlags.filter(f => f.severity === 'MEDIUM');
  if (highFlags.length === 0) {
    medFlags.slice(0, 3).forEach(f => {
      const text = `${f.title} — ${f.recommendation}`;
      if (!seenRecs.has(text)) { seenRecs.add(text); recommendations.push({ text, severity: 'MEDIUM' }); }
    });
  }

  if (highFlags.length === 0 && medFlags.length === 0) {
    recommendations.push({ text: 'Low risk profile. Proceed with professional trademark search and full legal due diligence before filing.', severity: 'LOW' });
    recommendations.push({ text: 'Verify against the ICANN Name Collision Observatory: https://newgtldprogram-nco.icann.org/', severity: 'LOW' });
    recommendations.push({ text: 'Engage a qualified ICANN consultant to review your complete application before submission.', severity: 'LOW' });
  }

  return {
    input: raw.trim(),
    normalized,
    appType,
    assessedAt: new Date().toISOString(),
    overallLevel,
    overallScore,
    applicationRiskScore,
    applicationRiskLevel,
    competitiveDemandScore,
    competitiveDemandLevel,
    isHardBlocked,
    categories,
    similarTLDs,
    topFlags,
    recommendations,
  };
}
