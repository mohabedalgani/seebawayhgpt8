import React from 'react';
import sibawayh from '../assets/sibawayh.png';
import { APP_CONFIG } from '../config/constants';
import { LoadingDots } from './LoadingDots';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';
  
  // Handle user messages
  if (!isAssistant) {
    return (
      <div className="flex gap-4 p-4 flex-row-reverse">
        <div className="flex-1">
          <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex gap-4 p-4 bg-gray-50 flex-row-reverse">
        <div className="flex-shrink-0">
          <img
            src={sibawayh}
            alt="سيبويه"
            className="w-6 h-6 rounded-full"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{APP_CONFIG.BOT_NAME}</p>
          <LoadingDots />
        </div>
      </div>
    );
  }

  // Handle error messages
  if (message.content.includes('عذراً')) {
    return (
      <div className="flex gap-4 p-4 bg-gray-50 flex-row-reverse">
        <div className="flex-shrink-0">
          <img
            src={sibawayh}
            alt="سيبويه"
            className="w-6 h-6 rounded-full"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{APP_CONFIG.BOT_NAME}</p>
          <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  // Handle analysis response with sections
  const sections = message.content.split('\n\n').filter(Boolean);
  const [originalText, tashkeel, irab, istishhad, notes] = sections;

  // Extract language type from original text
  const isClassical = originalText.includes('[فصحى]');
  const textWithoutLabel = originalText.replace(/\[(فصحى|عامي)\]\s*/, '');

  return (
    <div className="flex gap-4 p-4 bg-gray-50 flex-row-reverse">
      <div className="flex-shrink-0">
        <img
          src={sibawayh}
          alt="سيبويه"
          className="w-6 h-6 rounded-full"
        />
      </div>
      <div className="flex-1 space-y-4">
        <p className="text-sm text-gray-600 mb-1">{APP_CONFIG.BOT_NAME}</p>
        
        {/* النص الأصلي */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-800 font-semibold">النص الأصلي</h3>
            <span className={`px-2 py-1 text-sm rounded ${
              isClassical 
                ? 'bg-green-100 text-green-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {isClassical ? 'فصحى' : 'عامي'}
            </span>
          </div>
          <p className="text-gray-800 whitespace-pre-wrap">{textWithoutLabel}</p>
        </div>

        {/* التشكيل */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-semibold mb-2">التشكيل</h3>
          <p className="text-gray-800 whitespace-pre-wrap">{tashkeel}</p>
        </div>

        {/* الإعراب */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-green-800 font-semibold mb-2">الإعراب</h3>
          <div className="text-gray-800 whitespace-pre-wrap">{irab}</div>
        </div>

        {/* الاستشهاد */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-purple-800 font-semibold mb-2">الاستشهاد</h3>
          <div className="text-gray-800 whitespace-pre-wrap">{istishhad}</div>
        </div>

        {/* ملاحظات - only show if present */}
        {notes && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="text-amber-800 font-semibold mb-2">ملاحظات</h3>
            <div className="text-gray-800 whitespace-pre-wrap">{notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}