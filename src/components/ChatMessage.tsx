import React from 'react';
import { APP_CONFIG } from '../config/constants';
import { LoadingDots } from './LoadingDots';
import { VoteButtons } from './VoteButtons';
import { detectTextType, getTextTypeLabel, getTextTypeBadgeClasses } from '../utils/textTypeDetection';
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
            src="/seebawayh.png"
            alt="سيبويه"
            className="w-6 h-6 rounded-full"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{APP_CONFIG.BOT_NAME}</p>
          <div className="flex justify-end">
            <LoadingDots />
          </div>
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
            src="/seebawayh.png"
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

  // Extract sections from the message
  const sections = message.content.split('\n\n').filter(Boolean);
  const [originalText, tashkeel, irab, istishhad, notes] = sections;

  // Detect text type from original text
  const textType = detectTextType(originalText || '');
  const isQuran = textType === 'quranic';

  return (
    <div className="flex gap-4 p-4 bg-gray-50 flex-row-reverse">
      <div className="flex-shrink-0">
        <img
          src="/seebawayh.png"
          alt="سيبويه"
          className="w-6 h-6 rounded-full"
        />
      </div>
      <div className="flex-1 space-y-4">
        <p className="text-sm text-gray-600 mb-1">{APP_CONFIG.BOT_NAME}</p>

        {/* التشكيل */}
        {tashkeel && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-blue-800 font-semibold">التشكيل</h3>
              <span className={`px-2 py-1 text-sm rounded ${getTextTypeBadgeClasses(textType)}`}>
                {getTextTypeLabel(textType)}
              </span>
            </div>
            <p className={`text-gray-800 whitespace-pre-wrap ${isQuran ? 'text-lg font-arabic' : ''}`}>
              {tashkeel}
            </p>
          </div>
        )}

        {/* الإعراب */}
        {irab && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-green-800 font-semibold mb-2">الإعراب</h3>
            <div className="text-gray-800 whitespace-pre-wrap">{irab}</div>
          </div>
        )}

        {/* الاستشهاد */}
        {istishhad && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="text-purple-800 font-semibold mb-2">الاستشهاد</h3>
            <div className="text-gray-800 whitespace-pre-wrap">{istishhad}</div>
          </div>
        )}

        {/* ملاحظات */}
        {notes && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="text-amber-800 font-semibold mb-2">ملاحظات</h3>
            <div className="text-gray-800 whitespace-pre-wrap">{notes}</div>
          </div>
        )}

        {/* Add voting buttons */}
        <VoteButtons messageId={message.id} />
      </div>
    </div>
  );
}