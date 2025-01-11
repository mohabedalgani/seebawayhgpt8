import { useState } from 'react';
import { translateToArabic } from '../services/transformers';

export function useTranslator() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = async (text: string): Promise<string | null> => {
    setIsTranslating(true);
    setError(null);
    
    try {
      const translation = await translateToArabic(text);
      return translation;
    } catch (err) {
      setError('حدث خطأ في الترجمة');
      return null;
    } finally {
      setIsTranslating(false);
    }
  };

  return {
    translate,
    isTranslating,
    error
  };
}