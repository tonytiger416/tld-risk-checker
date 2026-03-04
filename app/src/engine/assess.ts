import type { TLDRiskReport, RiskLevel, CategoryResult, RiskFlag, AppType } from './types';
import { BLOCKER_CATEGORIES } from './types';
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

const WEIGHTS: Record<string, number> = {
  RESERVED_BLOCKED:    1.0,
  IGO_PROTECTED:       1.0,
  STRING_SIMILARITY:   0.9,
  GEOGRAPHIC_NAMES:    0.85,
  DNS_COLLISION:       0.8,
  TRADEMARK_RIGHTS:    0.7,
  OBJECTION_GROUNDS:   0.7,
  REGULATED_SECTORS:   0.6,
  IDN_RISKS:           0.6,
  STRING_CONTENTION:   0.5,
  EVALUATION_CRITERIA: 0.3,
};

function levelFromScore(score: number): RiskLevel {
  if (score >= 70) return 'HIGH';
  if (score >= 35) return 'MEDIUM';
  if (score >= 10) return 'LOW';
  return 'CLEAR';
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
  ];

  // Hard blockers — no path forward regardless of resources
  const isHardBlocked = categories.some(
    c => BLOCKER_CATEGORIES.has(c.category) && c.level === 'HIGH'
  );

  // Compute weighted overall score
  let weightedSum = 0;
  let totalWeight = 0;
  let maxBlockerScore = 0;

  for (const cat of categories) {
    const w = WEIGHTS[cat.category] ?? 0.5;
    weightedSum += cat.score * w;
    totalWeight += w;
    if (w >= 0.8 && cat.level === 'HIGH') {
      maxBlockerScore = Math.max(maxBlockerScore, cat.score);
    }
  }

  const weightedAvg = totalWeight > 0 ? weightedSum / totalWeight : 0;
  const overallScore = Math.round(Math.max(weightedAvg, maxBlockerScore * 0.9));
  const overallLevel = levelFromScore(overallScore);

  const allFlags: RiskFlag[] = categories.flatMap(c => c.flags);
  const levelOrder: Record<RiskLevel, number> = { HIGH: 3, MEDIUM: 2, LOW: 1, CLEAR: 0 };
  const topFlags = [...allFlags]
    .filter(f => f.severity !== 'CLEAR')
    .sort((a, b) => levelOrder[b.severity] - levelOrder[a.severity])
    .slice(0, 5);

  const recommendations: string[] = [];

  if (isHardBlocked) {
    recommendations.push('⛔ HARD BLOCKED — no viable path to delegation exists for this string. Do not spend resources on this application.');
  }

  const highFlags = allFlags.filter(f => f.severity === 'HIGH');
  if (highFlags.length > 0 && !isHardBlocked) {
    recommendations.push(`Resolve ${highFlags.length} HIGH severity issue(s) before considering an application.`);
  }
  highFlags.forEach(f => {
    if (!recommendations.includes(f.recommendation)) recommendations.push(f.recommendation);
  });

  const medFlags = allFlags.filter(f => f.severity === 'MEDIUM');
  if (medFlags.length > 0 && highFlags.length === 0) {
    recommendations.push(`Review ${medFlags.length} MEDIUM risk concern(s) with qualified ICANN legal/technical counsel.`);
    medFlags.slice(0, 3).forEach(f => {
      if (!recommendations.includes(f.recommendation)) recommendations.push(f.recommendation);
    });
  }

  if (highFlags.length === 0 && medFlags.length === 0) {
    recommendations.push('Low risk profile. Proceed with professional trademark search and full legal due diligence before filing.');
    recommendations.push('Verify against the ICANN Name Collision Observatory: https://newgtldprogram-nco.icann.org/');
    recommendations.push('Engage a qualified ICANN consultant to review your complete application before submission.');
  }

  return {
    input: raw.trim(),
    normalized,
    appType,
    assessedAt: new Date().toISOString(),
    overallLevel,
    overallScore,
    isHardBlocked,
    categories,
    similarTLDs,
    topFlags,
    recommendations: [...new Set(recommendations)],
  };
}
