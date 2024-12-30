export interface APIError {
  error: {
    message: string;
    type: string;
    code: string;
  };
}

export interface ArabicNLPRequest {
  text: string;
  task: 'إعراب' | 'تشكيل';
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionResponse {
  id: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}