export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}