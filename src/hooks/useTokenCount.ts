import { useState, useEffect } from 'react';

const STORAGE_KEY = 'sibawayh-token-count';
const INITIAL_COUNT = 1699551;

export function useTokenCount() {
  const [tokenCount, setTokenCount] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : INITIAL_COUNT;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, tokenCount.toString());
  }, [tokenCount]);

  const addTokens = (text: string) => {
    const newTokens = Math.ceil(text.length / 3);
    setTokenCount(prev => prev + newTokens);
  };

  return { tokenCount, addTokens };
}