import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { CategoryResult } from '../engine/types';
import { CATEGORY_LABELS } from '../engine/types';

const SHORT_LABELS: Record<string, string> = {
  RESERVED_BLOCKED:    'Reserved',
  STRING_SIMILARITY:   'Similarity',
  GEOGRAPHIC_NAMES:    'Geographic',
  DNS_COLLISION:       'DNS Collision',
  TRADEMARK_RIGHTS:    'Trademark',
  OBJECTION_GROUNDS:   'Objection',
  REGULATED_SECTORS:   'Regulated',
  IDN_RISKS:           'IDN',
  STRING_CONTENTION:   'Contention',
  EVALUATION_CRITERIA: 'Readiness',
};

export function RiskRadarChart({ categories }: { categories: CategoryResult[] }) {
  const data = categories.map(c => ({
    subject: SHORT_LABELS[c.category] ?? CATEGORY_LABELS[c.category],
    score: c.score,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }}
        />
        <Radar
          name="Risk Score"
          dataKey="score"
          stroke="#1e3a5f"
          fill="#1e3a5f"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Tooltip
          formatter={(value: number | string | undefined) => [`${value ?? 0}/100`, 'Risk Score']}
          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
