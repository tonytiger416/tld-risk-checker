// Visually similar character substitutions (NIST-inspired)
// Used to weight Levenshtein distance for visual confusability scoring
// Key: "a|b", Value: similarity score 0-1 (1 = identical appearance)
export const CHAR_SIMILARITY: Map<string, number> = new Map([
  // Digit / letter lookalikes
  ['0|o', 0.85], ['0|O', 0.85],
  ['1|l', 0.90], ['1|I', 0.88], ['1|i', 0.80],
  ['l|I', 0.88], ['l|i', 0.80],
  ['2|z', 0.65], ['2|Z', 0.65],
  ['5|s', 0.60], ['5|S', 0.60],
  ['6|b', 0.55], ['6|G', 0.50],
  ['8|B', 0.60],
  ['9|g', 0.55], ['9|q', 0.50],
  // Common letter confusables
  ['c|e', 0.45], ['c|o', 0.40],
  ['d|b', 0.45], ['d|cl', 0.60],
  ['g|q', 0.55], ['g|9', 0.55],
  ['h|n', 0.65], ['h|li', 0.55],
  ['m|rn', 0.80], ['m|nn', 0.60],
  ['n|ri', 0.60], ['n|m', 0.45],
  ['p|q', 0.55], ['p|b', 0.50],
  ['u|v', 0.55], ['u|n', 0.50],
  ['v|y', 0.45], ['v|u', 0.55],
  ['w|vv', 0.80], ['w|uu', 0.65],
  ['W|VV', 0.80],
  ['rn|m', 0.80],
  ['cl|d', 0.60],
  // Case-based
  ['I|l', 0.88],
]);

// Get similarity score between two characters (or character sequences)
export function getCharSimilarity(a: string, b: string): number {
  const key1 = `${a}|${b}`;
  const key2 = `${b}|${a}`;
  return CHAR_SIMILARITY.get(key1) ?? CHAR_SIMILARITY.get(key2) ?? 0;
}
