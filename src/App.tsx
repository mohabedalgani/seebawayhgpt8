import React, { useState, useRef, useEffect } from 'react';
import { Logo } from './components/Logo';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { ShareButtons } from './components/ShareButtons';
import { IntroSection } from './components/IntroSection';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SEOContent } from './components/SEOContent';
import { sendMessage as sendMessageToAPI } from './services/deepseek';
import { APP_CONFIG } from './config/constants';
import type { Message } from './types';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await sendMessageToAPI([...messages, userMessage]);
      setMessages(prev => [...prev.slice(0, -1), {
        role: 'assistant',
        content: response,
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev.slice(0, -1), {
        role: 'assistant',
        content: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleMessage(input);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-3xl mx-auto p-4">
          <Logo />
          <Header />
        </div>
      </header>

      <SEOContent />

      {messages.length === 0 && (
        <IntroSection onExampleSelect={handleMessage} />
      )}

      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto">
          {messages.map((message, index) => (
            <ChatMessage 
              key={index} 
              message={message}
              isLoading={isLoading && index === messages.length - 1 && message.role === 'assistant'}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="border-t">
        <div className="max-w-3xl mx-auto p-4">
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
          <div className="mt-4 flex justify-center">
            <ShareButtons />
          </div>
          <Footer />
        </div>
      </footer>
    </div>
  );
}