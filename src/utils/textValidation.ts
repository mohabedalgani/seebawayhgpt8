export function containsNonArabic(text: string): boolean {
  // This regex matches any character that is not Arabic, whitespace, or common punctuation
  const nonArabicRegex = /[^\u0600-\u06FF\s.,!؟،:؛]/;
  return nonArabicRegex.test(text);
}

export function isValidArabicInput(text: string): boolean {
  return !containsNonArabic(text) || text.trim() === '';
}