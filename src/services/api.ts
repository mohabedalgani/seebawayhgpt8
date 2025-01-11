import { API_CONFIG } from '../config/api';
import { WORKFLOW_CONFIG } from '../config/workflow';
import { formatResponse } from '../utils/responseFormatter';
import type { ChatMessage, ChatCompletionResponse, APIError } from '../types/api';

export class APIRequestError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'APIRequestError';
  }
}

export async function callAPI(messages: ChatMessage[]): Promise<string> {
  if (!messages?.length) {
    throw new APIRequestError('لا توجد رسائل للإرسال');
  }

  if (!API_CONFIG.key) {
    throw new APIRequestError('مفتاح API غير متوفر');
  }

  try {
    const enhancedMessages = [
      { role: 'system', content: WORKFLOW_CONFIG.system_prompt },
      ...messages
    ];

    const response = await fetch(API_CONFIG.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.key}`,
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: enhancedMessages,
        temperature: WORKFLOW_CONFIG.temperature,
        max_tokens: WORKFLOW_CONFIG.max_tokens,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error?.message || `خطأ في الاتصال: ${response.status}`;
      throw new APIRequestError(errorMessage, response.status);
    }

    if (!data?.choices?.[0]?.message?.content) {
      throw new APIRequestError('استجابة غير صالحة من الخادم');
    }

    return formatResponse(data.choices[0].message.content);
  } catch (error) {
    if (error instanceof APIRequestError) {
      throw error;
    }
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'حدث خطأ غير متوقع';
      
    throw new APIRequestError(errorMessage);
  }
}