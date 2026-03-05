// Strings awarded in the ICANN 2012 new gTLD round that have NOT yet been delegated
// These strings are effectively locked — they remain under ICANN contract or active legal
// proceedings from the prior round and would not be eligible for new 2026 applications.
//
// Sources: ICANN registry agreements database, IRP decisions, ICANN correspondence

export interface PriorRoundInfo {
  winner: string;
  auctionPrice?: string;
  status: string;
  detail: string;
}

export const AWARDED_NOT_DELEGATED: Map<string, PriorRoundInfo> = new Map([

  ['web', {
    winner: 'Nu Dot Co LLC',
    auctionPrice: '$135,000,000 USD',
    status: 'Under ICANN IRP and litigation — not delegated as of 2026',
    detail: '.web was awarded to Nu Dot Co LLC at ICANN auction in July 2016 — the highest price ever paid for a new gTLD ($135M). Verisign and Afilias challenged the auction process via ICANN\'s Independent Review Panel. The string has remained trapped in proceedings for nearly a decade and has not been delegated. A new 2026 application for this string would almost certainly be rejected by ICANN as it remains under contract from the prior round.',
  }],

  ['dot', {
    winner: 'Establishment of Dot Registry LLC / various',
    status: 'Multi-applicant contention from 2012 — proceedings ongoing',
    detail: '.dot was applied for by multiple parties in 2012 and entered string contention. The contention set was never fully resolved. A 2026 application would likely face objections from prior-round applicants who retain interests in this string.',
  }],

]);
