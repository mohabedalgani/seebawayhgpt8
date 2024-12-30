import { API_CONFIG } from '../config/api';
import { WORKFLOW_CONFIG } from '../config/workflow';
import { formatResponse } from '../utils/responseFormatter';
import type { ChatMessage, ChatCompletionResponse, APIError } from '../types/api';

export async function callAPI(messages: ChatMessage[]): Promise<string> {
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

    if (!response.ok) {
      const errorData = await response.json() as APIError;
      throw new Error(errorData.error.message || 'حدث خطأ في الاتصال بالخادم');
    }

    const data = await response.json() as ChatCompletionResponse;
    return formatResponse(data.choices[0].message.content);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}