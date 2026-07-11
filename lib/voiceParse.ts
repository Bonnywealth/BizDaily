// Turns a spoken transcript like "sales twenty five thousand expenses fifteen
// thousand" or "I made 25000 naira and spent 15000" into numeric values.

const wordNums: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60,
  seventy: 70, eighty: 80, ninety: 90,
};
const scales: Record<string, number> = { hundred: 100, thousand: 1000, million: 1000000, k: 1000 };

function wordsToNumber(text: string): number | null {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  let total = 0;
  let current = 0;
  let found = false;

  for (const tok of tokens) {
    if (/^\d+$/.test(tok)) {
      current += parseInt(tok, 10);
      found = true;
    } else if (tok in wordNums) {
      current += wordNums[tok];
      found = true;
    } else if (tok in scales) {
      current = current === 0 ? scales[tok] : current * scales[tok];
      if (scales[tok] >= 1000) {
        total += current;
        current = 0;
      }
      found = true;
    }
  }
  if (!found) return null;
  return total + current;
}

export interface VoiceParseResult {
  sales: number | null;
  expenses: number | null;
}

export function parseVoiceTranscript(transcript: string): VoiceParseResult {
  const lower = transcript.toLowerCase();

  const salesMatch = lower.match(/sales?[^.]*?([\d,]+(?:\.\d+)?|(?:[a-z\s]+?))(?=\s+expenses?|\s+and\s+spent|\s+spent|$)/);
  const expenseMatch = lower.match(/(?:expenses?|spent|spend)[^.]*?([\d,]+(?:\.\d+)?|(?:[a-z\s]+?))(?=\s+sales?|$)/);

  const parseChunk = (chunk: string | undefined): number | null => {
    if (!chunk) return null;
    const cleaned = chunk.replace(/,/g, "").trim();
    if (/^\d+(\.\d+)?$/.test(cleaned)) return parseFloat(cleaned);
    return wordsToNumber(cleaned);
  };

  let sales = parseChunk(salesMatch?.[1]);
  let expenses = parseChunk(expenseMatch?.[1]);

  // Fallback: no keywords found — take the first two numbers mentioned as sales, expenses
  if (sales === null && expenses === null) {
    const allNumbers = lower.match(/\d+[\d,]*(?:\.\d+)?|[a-z]+(?:\s+[a-z]+)*/g) || [];
    const numeric: number[] = [];
    // Try straightforward digit matches first
    const digitMatches = lower.match(/\d+[\d,]*(?:\.\d+)?/g);
    if (digitMatches && digitMatches.length >= 2) {
      numeric.push(...digitMatches.slice(0, 2).map((n) => parseFloat(n.replace(/,/g, ""))));
    } else {
      const asNumber = wordsToNumber(lower);
      if (asNumber !== null) numeric.push(asNumber);
    }
    sales = numeric[0] ?? null;
    expenses = numeric[1] ?? null;
  }

  return { sales, expenses };
}
