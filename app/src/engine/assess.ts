import type { TLDRiskReport, RiskLevel, CategoryResult, RiskFlag } from './types';
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

// Category weights — higher = greater impact on overall score
const WEIGHTS: Record<string, number> = {
  RESERVED_BLOCKED:    1.0,
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

// Normalize input: strip leading dots, lowercase, trim
export function normalizeString(raw: string): string {
  return raw.trim().toLowerCase().replace(/^\.+/, '');
}

export function assess(raw: string): TLDRiskReport {
  const normalized = normalizeString(raw);

  // Run all checks
  const { result: simResult, similarTLDs } = checkSimilarity(normalized);

  const categories: CategoryResult[] = [
    checkReserved(normalized),
    simResult,
    checkGeographic(normalized),
    checkCollision(normalized),
    checkTrademark(normalized),
    checkObjection(normalized),
    checkRegulated(normalized),
    checkIDN(normalized),
    checkContention(normalized),
    checkEvaluation(normalized),
  ];

  // Compute weighted overall score
  let weightedSum = 0;
  let totalWeight = 0;
  let maxBlockerScore = 0;

  for (const cat of categories) {
    const w = WEIGHTS[cat.category] ?? 0.5;
    weightedSum += cat.score * w;
    totalWeight += w;
    // Critical blockers (weight >= 0.8) with HIGH rating force overall HIGH
    if (w >= 0.8 && cat.level === 'HIGH') {
      maxBlockerScore = Math.max(maxBlockerScore, cat.score);
    }
  }

  const weightedAvg = totalWeight > 0 ? weightedSum / totalWeight : 0;
  const overallScore = Math.round(Math.max(weightedAvg, maxBlockerScore * 0.9));
  const overallLevel = levelFromScore(overallScore);

  // Collect and rank all flags
  const allFlags: RiskFlag[] = categories.flatMap(c => c.flags);
  const levelOrder: Record<RiskLevel, number> = { HIGH: 3, MEDIUM: 2, LOW: 1, CLEAR: 0 };
  const topFlags = [...allFlags]
    .filter(f => f.severity !== 'CLEAR')
    .sort((a, b) => levelOrder[b.severity] - levelOrder[a.severity])
    .slice(0, 5);

  // Build recommendations
  const recommendations: string[] = [];
  const highFlags = allFlags.filter(f => f.severity === 'HIGH');
  if (highFlags.length > 0) {
    recommendations.push(`Address ${highFlags.length} HIGH severity issue(s) before considering an application.`);
    highFlags.forEach(f => recommendations.push(f.recommendation));
  }
  const medFlags = allFlags.filter(f => f.severity === 'MEDIUM');
  if (medFlags.length > 0 && highFlags.length === 0) {
    recommendations.push(`Review ${medFlags.length} MEDIUM severity concern(s) with legal/technical counsel.`);
    medFlags.slice(0, 3).forEach(f => recommendations.push(f.recommendation));
  }
  if (recommendations.length === 0) {
    recommendations.push('This string appears to have low risk. Proceed with a professional trademark search and full due diligence before applying.');
    recommendations.push('Verify against the ICANN Name Collision Observatory: https://newgtldprogram-nco.icann.org/');
  }

  // Deduplicate recommendations
  const uniqueRecs = [...new Set(recommendations)];

  return {
    input: raw.trim(),
    normalized,
    assessedAt: new Date().toISOString(),
    overallLevel,
    overallScore,
    categories,
    similarTLDs,
    topFlags,
    recommendations: uniqueRecs,
  };
}
