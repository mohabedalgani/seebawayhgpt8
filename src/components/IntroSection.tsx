import React, { useState } from 'react';
import { BookOpen, ScrollText, GraduationCap } from 'lucide-react';
import { LoadingDots } from './LoadingDots';

interface IntroSectionProps {
  onExampleSelect: (text: string) => Promise<void>;
}

const examples = [
  {
    icon: <GraduationCap className="w-6 h-6" />,
    text: "العلمُ نورٌ",
    description: "إعراب جملة اسمية"
  },
  {
    icon: <ScrollText className="w-6 h-6" />,
    text: "يسعى المؤمنُ إلى الخيرِ",
    description: "إعراب جملة فعلية"
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    text: "إنما الأعمالُ بالنياتِ",
    description: "إعراب حديث شريف"
  }
];

export function IntroSection({ onExampleSelect }: IntroSectionProps) {
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const handleExampleClick = async (text: string, index: number) => {
    setLoadingIndex(index);
    try {
      await onExampleSelect(text);
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="bg-gray-50 py-12 border-b">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            مرحباً بك، ماذا تريد أن أُعرب لك؟
          </h1>
          <p className="text-lg text-gray-600">
            اختر من الأمثلة أدناه أو اكتب نصاً للإعراب
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example.text, index)}
              disabled={loadingIndex !== null}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-right border border-gray-100 disabled:opacity-50"
            >
              <div className="flex items-center justify-end gap-3 mb-3 text-blue-600">
                {example.icon}
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                {example.text}
              </p>
              {loadingIndex === index ? (
                <LoadingDots />
              ) : (
                <p className="text-sm text-gray-500">
                  {example.description}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}