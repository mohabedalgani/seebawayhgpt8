import { callAPI, APIRequestError } from './api';
import { prepareTextForAnalysis } from '../utils/arabicAnalysis';
import type { Message } from '../types/api';

export async function sendMessageToAPI(messages: Message[]): Promise<string> {
  if (!messages?.length) {
    throw new APIRequestError('لا توجد رسائل للإرسال');
  }

  try {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.content) {
      throw new APIRequestError('محتوى الرسالة غير صالح');
    }

    const analysis = prepareTextForAnalysis(lastMessage.content);
    
    const enhancedLastMessage = {
      ...lastMessage,
      content: `${analysis.type === 'quranic' ? '[قرآني] ' : ''}${analysis.text}${
        analysis.metadata ? `\n${analysis.metadata}` : ''
      }`
    };

    return await callAPI([
      ...messages.slice(0, -1),
      enhancedLastMessage
    ]);
  } catch (error) {
    if (error instanceof APIRequestError) {
      throw error;
    }
    throw new APIRequestError('فشل في إرسال الرسالة');
  }
}