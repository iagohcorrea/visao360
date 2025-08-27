'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  type: 'user' | 'ai';
  text: string;
}

export default function ChatPage() {
  const [message, setMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { type: 'ai', text: 'Olá, como posso ajudar? Pergunte sobre NPS, avaliações de produtos, feedback de vendedores, etc.' }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = { type: 'user', text: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Erro ao obter resposta do AI.';
        setChatHistory((prev) => [...prev, { type: 'ai', text: `Erro: ${errorMessage}` }]);
        // TODO: Implementar toast para erro
      } else {
        const data = await response.json();
        setChatHistory((prev) => [...prev, { type: 'ai', text: data.reply }]);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setChatHistory((prev) => [...prev, { type: 'ai', text: 'Erro de rede ao conectar com o AI.' }]);
      // TODO: Implementar toast para erro de rede
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <h1 className="text-center font-caveat text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-10 mt-8">
        Visão 360
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl flex flex-col h-[calc(100vh-160px)] md:h-[70vh]">
        <h2 className="text-2xl font-lora font-bold text-gray-800 mb-4">Falar com IA</h2>

        {/* Output Box */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50 space-y-4">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] sm:max-w-[70%] p-3 rounded-lg ${msg.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
                }`}
              >
                <pre className="font-inter whitespace-pre-wrap text-sm sm:text-base">{msg.text}</pre>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] sm:max-w-[70%] p-3 rounded-lg bg-gray-200 text-gray-800">
                <p className="font-inter animate-pulse text-sm sm:text-base">Digitando...</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Field and Send Button */}
        <div className="flex items-center space-x-4">
          <textarea
            className="flex-1 p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Olá, como posso ajudar?"
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            aria-label="Campo de entrada de mensagem para o AI"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !message.trim()}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Enviar mensagem"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3 10l-3 3 6 3 3-6-3-3 3-6z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
