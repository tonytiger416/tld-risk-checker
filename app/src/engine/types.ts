export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'CLEAR';
export type AppType = 'open' | 'brand';

export interface RiskFlagStat {
  emoji: string;
  label: string;
  value: string;
}

export interface RiskFlag {
  code: string;
  severity: RiskLevel;
  title: string;
  detail: string;
  guidebookRef: string;
  recommendation: string;
  stats?: RiskFlagStat[];
}

export type RiskCategory =
  | 'RESERVED_BLOCKED'
  | 'IGO_PROTECTED'
  | 'STRING_SIMILARITY'
  | 'GEOGRAPHIC_NAMES'
  | 'DNS_COLLISION'
  | 'TRADEMARK_RIGHTS'
  | 'OBJECTION_GROUNDS'
  | 'REGULATED_SECTORS'
  | 'IDN_RISKS'
  | 'STRING_CONTENTION'
  | 'EVALUATION_CRITERIA';

export const CATEGORY_LABELS: Record<RiskCategory, string> = {
  RESERVED_BLOCKED:    'Reserved / Blocked',
  IGO_PROTECTED:       'IGO / INGO Protected',
  STRING_SIMILARITY:   'String Similarity',
  GEOGRAPHIC_NAMES:    'Geographic Names',
  DNS_COLLISION:       'DNS Collision',
  TRADEMARK_RIGHTS:    'Trademark & Rights',
  OBJECTION_GROUNDS:   'Objection Risk',
  REGULATED_SECTORS:   'Regulated Sectors',
  IDN_RISKS:           'IDN / Script',
  STRING_CONTENTION:   'String Contention',
  EVALUATION_CRITERIA: 'Application Readiness',
};

// Categories that are HARD BLOCKERS — no path forward regardless of other factors
export const BLOCKER_CATEGORIES = new Set<RiskCategory>([
  'RESERVED_BLOCKED',
  'IGO_PROTECTED',
]);

// ---------------------------------------------------------------------------
// Category groupings — used by UI and scoring engine to separate the two
// distinct dimensions of assessment
// ---------------------------------------------------------------------------

/** Categories that determine whether an application can succeed through ICANN */
export const APPLICATION_RISK_CATEGORIES = new Set<RiskCategory>([
  'RESERVED_BLOCKED',
  'IGO_PROTECTED',
  'STRING_SIMILARITY',
  'GEOGRAPHIC_NAMES',
  'DNS_COLLISION',
  'TRADEMARK_RIGHTS',
  'OBJECTION_GROUNDS',
  'REGULATED_SECTORS',
  'IDN_RISKS',
  'EVALUATION_CRITERIA',
]);

/** Categories that determine how contested/expensive the application will be */
export const COMPETITIVE_DEMAND_CATEGORIES = new Set<RiskCategory>([
  'STRING_CONTENTION',
]);

export interface CategoryResult {
  category: RiskCategory;
  level: RiskLevel;
  score: number; // 0–100
  flags: RiskFlag[];
  summary: string;
}

export interface SimilarTLD {
  tld: string;
  visualScore: number; // 0–100
  type: 'visual' | 'phonetic' | 'plural';
}

export interface TLDRiskReport {
  input: string;
  normalized: string;
  appType: AppType;
  assessedAt: string;

  // Legacy combined score (kept for backward compat)
  overallLevel: RiskLevel;
  overallScore: number;

  // Split scores — the two key dimensions
  applicationRiskScore: number;   // 0–100 — can we get it through ICANN?
  applicationRiskLevel: RiskLevel;
  competitiveDemandScore: number; // 0–100 — how contested will it be?
  competitiveDemandLevel: RiskLevel;

  isHardBlocked: boolean;
  categories: CategoryResult[];
  similarTLDs: SimilarTLD[];
  topFlags: RiskFlag[];
  recommendations: { text: string; severity: RiskLevel }[];
}
