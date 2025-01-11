import { isQuranVerse, getVerseInfo } from './quranDetection';

export function prepareTextForAnalysis(text: string) {
  const normalizedText = text.trim();
  
  if (isQuranVerse(normalizedText)) {
    const verseInfo = getVerseInfo(normalizedText);
    return {
      type: 'quranic',
      text: normalizedText,
      metadata: verseInfo ? `سورة ${verseInfo.surah}، آية ${verseInfo.ayah}` : undefined
    };
  }

  // Check for classical Arabic markers
  if (/[\u064B-\u0652]/.test(normalizedText)) { // Has diacritics
    return { type: 'classical', text: normalizedText };
  }

  return { type: 'colloquial', text: normalizedText };
}