export type TextType = 'quranic' | 'classical' | 'colloquial';

// Common Quranic phrases and patterns
const QURANIC_PATTERNS = [
  'قال تعالى',
  'سورة',
  'آية',
  '[قرآني]',
  // Add more Quranic indicators here
];

export function detectTextType(text: string): TextType {
  // Clean the text and normalize Arabic characters
  const normalizedText = text.trim().replace(/\s+/g, ' ');
  
  // First priority: Check if it's Quranic
  if (
    QURANIC_PATTERNS.some(pattern => normalizedText.includes(pattern)) ||
    normalizedText.includes('[قرآني]')
  ) {
    return 'quranic';
  }
  
  // Second priority: Check if it's classical Arabic
  if (normalizedText.includes('[فصحى]')) {
    return 'classical';
  }
  
  // Third priority: Default to colloquial
  return 'colloquial';
}

export function getTextTypeLabel(type: TextType): string {
  switch (type) {
    case 'quranic':
      return 'قرآن كريم';
    case 'classical':
      return 'فصحى';
    case 'colloquial':
      return 'عامي';
  }
}

export function getTextTypeBadgeClasses(type: TextType): string {
  switch (type) {
    case 'quranic':
      return 'bg-emerald-100 text-emerald-800';
    case 'classical':
      return 'bg-green-100 text-green-800';
    case 'colloquial':
      return 'bg-amber-100 text-amber-800';
  }
}