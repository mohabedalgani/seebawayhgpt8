export const MAX_WORDS = 62;

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function isWithinWordLimit(text: string): boolean {
  return countWords(text) <= MAX_WORDS;
}