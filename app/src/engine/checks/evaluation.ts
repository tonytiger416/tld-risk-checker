import type { CategoryResult, RiskFlag } from '../types';

export function checkEvaluation(_s: string): CategoryResult {
  const flags: RiskFlag[] = [];

  // Informational flags about application requirements
  const infoFlags: RiskFlag[] = [
    {
      code: 'EVAL-001',
      severity: 'LOW',
      title: 'Application fee: ~$227,000 USD per string',
      detail: 'The base evaluation fee for a new gTLD application in the 2026 Round is approximately $227,000 USD. Additional fees apply for string contention resolution, extended evaluation, and other processes.',
      guidebookRef: 'AGB Section 1.5, pp. 21–22',
      recommendation: 'Confirm fee structure in the latest AGB version before the application window opens.',
    },
    {
      code: 'EVAL-002',
      severity: 'LOW',
      title: 'Technical capability evaluation required',
      detail: 'Applicants must demonstrate technical capability to operate a registry, including DNS infrastructure, RDDS/WHOIS, EPP system, and compliance with ICANN\'s Registry System Testing (RST) requirements.',
      guidebookRef: 'AGB Section 5.4, pp. 171–182',
      recommendation: 'Engage a registry services provider (RSP) if you do not have in-house technical capability. ICANN maintains a list of evaluated RSPs.',
    },
    {
      code: 'EVAL-003',
      severity: 'LOW',
      title: 'Financial capability documentation required',
      detail: 'Applicants must demonstrate sufficient financial resources to fund registry operations for a minimum of three years, including working capital and contingency reserves.',
      guidebookRef: 'AGB Section 5.4.2, pp. 175–178',
      recommendation: 'Prepare audited financial statements and a 3-year financial projection for your application.',
    },
    {
      code: 'EVAL-004',
      severity: 'LOW',
      title: 'Registry Agreement execution required post-approval',
      detail: 'Successful applicants must execute a Registry Agreement with ICANN before delegation. This agreement includes ongoing compliance obligations, fee payments, and operational requirements.',
      guidebookRef: 'AGB Section 6, pp. 182–192',
      recommendation: 'Review the base Registry Agreement template in the AGB before applying.',
    },
  ];

  flags.push(...infoFlags);

  return {
    category: 'EVALUATION_CRITERIA',
    level: 'LOW',
    score: 15,
    flags,
    summary: 'Standard application requirements apply. Review the guidebook checklist before submitting.',
  };
}
