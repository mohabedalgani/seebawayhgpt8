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
    
    if (line.includes('النص مع التشكيل') || line.includes('تشكيل')) {
      currentSection = 'tashkeel';
      continue;
    } else if (line.includes('الإعراب') || line.includes('اعراب')) {
      currentSection = 'irab';
      continue;
    } else if (line.includes('الاستشهاد')) {
      currentSection = 'istishhad';
      continue;
    } else if (line.includes('ملاحظات')) {
      currentSection = 'notes';
      continue;
    }
    
    if (line) {
      switch (currentSection) {
        case '':
          originalText = line; // First non-empty line before any section is the original text
          break;
        case 'tashkeel':
          tashkeel = line;
          break;
        case 'irab':
          irab += (irab ? '\n' : '') + (line.startsWith('•') ? line : `• ${line}`);
          break;
        case 'istishhad':
          istishhad += (istishhad ? '\n' : '') + line;
          break;
        case 'notes':
          notes += (notes ? '\n' : '') + (line.startsWith('•') ? line : `• ${line}`);
          break;
      }
    }
  }

  const formattedResponse = [originalText, tashkeel, irab, istishhad]
    .filter(Boolean)
    .join('\n\n');

  return notes ? `${formattedResponse}\n\n${notes}` : formattedResponse;
}