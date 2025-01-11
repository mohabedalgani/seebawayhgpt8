import React from 'react';
import { countWords, MAX_WORDS } from '../utils/textLimits';

interface CharacterCounterProps {
  text: string;
}

export function CharacterCounter({ text }: CharacterCounterProps) {
  const wordCount = countWords(text);
  const charCount = text.length;
  
  return (
    <div className="text-sm text-gray-500 flex justify-between mt-1 px-2">
      <span>
        الكلمات: {wordCount}/{MAX_WORDS}
      </span>
      <span>
        الأحرف: {charCount}
      </span>
    </div>
  );
}