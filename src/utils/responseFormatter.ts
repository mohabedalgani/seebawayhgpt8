export function formatResponse(response: string): string {
  const sections = response.split('\n').filter(line => line.trim().length > 0);
  
  let originalText = '';
  let tashkeel = '';
  let irab = '';
  let istishhad = '';
  let notes = '';
  
  let currentSection = '';
  
  for (let i = 0; i < sections.length; i++) {
    const line = sections[i].trim();
    
    // Remove asterisks and bullet points
    const cleanLine = line
      .replace(/[*•]/g, '')
      .trim();
    
    if (cleanLine.includes('النص مع التشكيل') || cleanLine.includes('تشكيل')) {
      currentSection = 'tashkeel';
      continue;
    } else if (cleanLine.includes('الإعراب') || cleanLine.includes('اعراب')) {
      currentSection = 'irab';
      continue;
    } else if (cleanLine.includes('الاستشهاد')) {
      currentSection = 'istishhad';
      continue;
    } else if (cleanLine.includes('ملاحظات')) {
      currentSection = 'notes';
      continue;
    }
    
    if (cleanLine) {
      switch (currentSection) {
        case '':
          originalText = cleanLine; // First non-empty line before any section is the original text
          break;
        case 'tashkeel':
          tashkeel = cleanLine;
          break;
        case 'irab':
          // For irab section, add each line without bullet points
          irab += (irab ? '\n' : '') + cleanLine;
          break;
        case 'istishhad':
          istishhad += (istishhad ? '\n' : '') + cleanLine;
          break;
        case 'notes':
          notes += (notes ? '\n' : '') + cleanLine;
          break;
      }
    }
  }

  const formattedResponse = [originalText, tashkeel, irab, istishhad]
    .filter(Boolean)
    .join('\n\n');

  return notes ? `${formattedResponse}\n\n${notes}` : formattedResponse;
}