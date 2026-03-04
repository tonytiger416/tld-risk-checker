export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'CLEAR';

export interface RiskFlag {
  code: string;
  severity: RiskLevel;
  title: string;
  detail: string;
  guidebookRef: string;
  recommendation: string;
}

export type RiskCategory =
  | 'RESERVED_BLOCKED'
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
  RESERVED_BLOCKED: 'Reserved / Blocked',
  STRING_SIMILARITY: 'String Similarity',
  GEOGRAPHIC_NAMES: 'Geographic Names',
  DNS_COLLISION: 'DNS Collision',
  TRADEMARK_RIGHTS: 'Trademark & Rights',
  OBJECTION_GROUNDS: 'Objection Risk',
  REGULATED_SECTORS: 'Regulated Sectors',
  IDN_RISKS: 'IDN / Script',
  STRING_CONTENTION: 'String Contention',
  EVALUATION_CRITERIA: 'Application Readiness',
};

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
  assessedAt: string;
  overallLevel: RiskLevel;
  overallScore: number;
  categories: CategoryResult[];
  similarTLDs: SimilarTLD[];
  topFlags: RiskFlag[];
  recommendations: string[];
}
