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
    winner: 'Nu Dot Co LLC (covertly backed by Verisign)',
    auctionPrice: '$135,000,000 USD',
    status: 'Under active ICANN IRP (second panel) — not delegated as of 2026',
    detail: '.web was awarded to Nu Dot Co LLC at ICANN auction on 27 July 2016 — the highest price ever paid for a new gTLD ($135M). Nu Dot Co was subsequently revealed to be covertly backed by Verisign, which had separately opposed the auction process. Afilias (now Altanovo) filed a first IRP challenging the auction; the IRP panel ruled in May 2021 that ICANN must make a formal decision. The ICANN Board decided in April 2023 that Nu Dot Co had not violated the rules. Altanovo filed a second IRP against ICANN in October 2023. That second IRP is actively ongoing as of early 2026, in pre-hearing phase with merits briefs due in mid-2025. The string has not been delegated and cannot be applied for in the 2026 round while the prior-round award and IRP remain unresolved.',
  }],

]);
