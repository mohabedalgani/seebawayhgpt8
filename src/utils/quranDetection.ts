// Quranic verses database (partial)
const QURANIC_VERSES = new Map([
  ['إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ', {
    surah: 'فاطر',
    ayah: 28,
    fullText: 'إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ ۗ إِنَّ اللَّهَ عَزِيزٌ غَفُورٌ'
  }]
]);

export function isQuranVerse(text: string): boolean {
  const normalizedText = text.trim().replace(/\s+/g, ' ');
  return QURANIC_VERSES.has(normalizedText) || 
         Array.from(QURANIC_VERSES.values()).some(verse => 
           verse.fullText.includes(normalizedText)
         );
}

export function getVerseInfo(text: string) {
  const normalizedText = text.trim().replace(/\s+/g, ' ');
  return QURANIC_VERSES.get(normalizedText) || 
         Array.from(QURANIC_VERSES.entries()).find(([_, verse]) => 
           verse.fullText.includes(normalizedText)
         )?.[1];
}