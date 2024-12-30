import React, { useState } from 'react';
import { Brain, Globe } from 'lucide-react';
import { Alert } from './Alert';
import { CharacterCounter } from './CharacterCounter';
import { isValidArabicInput } from '../utils/textValidation';
import { isWithinWordLimit } from '../utils/textLimits';
import { generateIrab, generateTashkeel } from '../services/arabicNLP';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function ChatInput({ value, onChange, onSubmit, isLoading }: ChatInputProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    if (!isValidArabicInput(newValue)) {
      setShowAlert(true);
      return;
    }
    
    if (!isWithinWordLimit(newValue)) {
      setShowLimitAlert(true);
      return;
    }
    
    onChange(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidArabicInput(value)) {
      setShowAlert(true);
      return;
    }
    
    if (!isWithinWordLimit(value)) {
      setShowLimitAlert(true);
      return;
    }
    
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mt-auto">
      <div className="relative bg-gray-50 rounded-lg p-2">
        <div className="flex items-end gap-2 flex-row-reverse">
          <button 
            type="submit"
            disabled={isLoading || processing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            نازعني
          </button>
          <textarea
            value={value}
            onChange={handleChange}
            placeholder="أعرب ما يلي..."
            className="flex-1 bg-transparent border-0 focus:ring-0 resize-none p-2 h-[40px] max-h-[200px] overflow-y-auto text-right"
            style={{ height: 'auto' }}
          />
        </div>
        <CharacterCounter text={value} />
      </div>
      <p className="text-xs text-gray-400 text-center mt-2">
        سيبويه يتحدث العربية فقط
      </p>

      {showAlert && (
        <Alert
          message="عذراً، سيبويه يتحدث العربية فقط"
          onClose={() => setShowAlert(false)}
        />
      )}
      
      {showLimitAlert && (
        <Alert
          message="عذراً، لا يمكن تجاوز ٦٢ كلمة"
          onClose={() => setShowLimitAlert(false)}
        />
      )}
    </form>
  );
}