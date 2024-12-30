import { callAPI } from './api';
import type { ArabicNLPRequest } from '../types/api';

export async function processArabicText(request: ArabicNLPRequest): Promise<string> {
  try {
    return await callAPI([
      {
        role: 'system',
        content: `أنت خبير في اللغة العربية. المطلوب ${request.task} للنص التالي مع الشرح المفصل.`
      },
      {
        role: 'user',
        content: request.text
      }
    ]);
  } catch (error) {
    console.error(`Error in ${request.task}:`, error);
    return `عذراً، حدث خطأ أثناء ${request.task} النص.`;
  }
}

export const generateIrab = (text: string) => processArabicText({ text, task: 'إعراب' });
export const generateTashkeel = (text: string) => processArabicText({ text, task: 'تشكيل' });