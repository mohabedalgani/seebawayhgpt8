import { callAPI } from './api';
import type { Message } from '../types/api';

export async function sendMessage(messages: Message[]): Promise<string> {
  try {
    // Format the last message to explicitly request إعراب
    const lastMessage = messages[messages.length - 1];
    const enhancedLastMessage = {
      ...lastMessage,
      content: `قم بإعراب النص التالي: ${lastMessage.content}`
    };

    return await callAPI([
      ...messages.slice(0, -1),
      enhancedLastMessage
    ]);
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw new Error('فشل في إرسال الرسالة');
  }
}