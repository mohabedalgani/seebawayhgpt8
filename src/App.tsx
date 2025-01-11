import React, { useState, useRef, useEffect } from 'react';
import { Logo } from './components/Logo';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { ShareButtons } from './components/ShareButtons';
import { IntroSection } from './components/IntroSection';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SEOContent } from './components/SEOContent';
import { TokenCounter } from './components/TokenCounter';
import { ReviewersPage } from './components/ReviewersPage';
import { sendMessageToAPI } from './services/deepseek';
import { APIRequestError } from './services/api';
import { supabase } from './lib/supabase';
import type { Message } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'chat' | 'reviewers'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if URL has /reviewers
    const path = window.location.pathname;
    if (path === '/reviewers') {
      setCurrentPage('reviewers');
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const storeMessage = async (message: Message) => {
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          id: message.id,
          content: message.content,
          role: message.role
        }]);

      if (error) {
        console.error('Error storing message:', error);
      }
    } catch (error) {
      console.error('Error storing message:', error);
    }
  };

  const handleMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { 
      id: crypto.randomUUID(),
      role: 'user', 
      content: text 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    await storeMessage(userMessage);

    const tempMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: ''
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const response = await sendMessageToAPI([...messages, userMessage]);
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
      };
      setMessages(prev => [...prev.slice(0, -1), assistantMessage]);
      
      await storeMessage(assistantMessage);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof APIRequestError 
        ? error.message 
        : 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.';
        
      const errorResponseMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: errorMessage,
      };
      setMessages(prev => [...prev.slice(0, -1), errorResponseMessage]);
      
      await storeMessage(errorResponseMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleMessage(input);
  };

  if (currentPage === 'reviewers') {
    return <ReviewersPage />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-3xl mx-auto p-4">
          <Logo onReviewersClick={() => setCurrentPage('reviewers')} />
          <Header />
        </div>
      </header>

      <SEOContent />
      
      <TokenCounter />

      {messages.length === 0 && (
        <IntroSection onExampleSelect={handleMessage} />
      )}

      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id}
              message={message}
              isLoading={isLoading && message === messages[messages.length - 1] && message.role === 'assistant'}
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