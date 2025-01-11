import React from 'react';
import { BookOpen } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';

const TOTAL_TOKENS = 2951764;

export function TokenCounter() {
  return (
    <div className="bg-gradient-to-l from-blue-50 to-indigo-50 py-8 border-b border-blue-100">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 text-white rounded-full mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">إحصائيات المعالجة</h2>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="text-4xl font-bold text-blue-600 flex items-center">
              <span className="text-blue-500 mr-1 animate-pulse">+</span>
              <AnimatedNumber value={TOTAL_TOKENS} />
            </div>
            <span className="text-gray-600">رمز</span>
          </div>
          <p className="text-gray-600 max-w-lg mx-auto">
            تمت معالجته في تحليل النصوص العربية وإعرابها منذ إطلاق سيبويه
          </p>
        </div>
      </div>
    </div>
  );
}
