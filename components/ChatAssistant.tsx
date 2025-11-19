import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2, Bot, User } from 'lucide-react';
import { createChatSession, sendMessageStream } from '../services/gemini';
import { ChatMessage } from '../types';
import { GenerateContentResponse } from '@google/genai';
import katex from 'katex';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm your PyTorch tutor. Ask me anything about the code or concepts!" }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef(createChatSession());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsStreaming(true);

    try {
      // Add placeholder for model response
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      const result = await sendMessageStream(chatSessionRef.current, userMsg);
      
      let fullText = '';
      
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || '';
        fullText += text;
        
        // Update the last message with the accumulating text
        setMessages(prev => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = { role: 'model', text: fullText };
          return newMsgs;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageText = (text: string) => {
    const parts = [];
    // Regex for:
    // 1. Inline Math: $...$ (non-greedy)
    // 2. Bold: **...**
    // 3. Inline Code: `...`
    const regex = /(\$[^$]+?\$|\*\*.*?\*\*|`.*?`)/g;
    let lastIndex = 0;
    let match;
  
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      const content = match[0];
      if (content.startsWith('**')) {
        parts.push(<strong key={match.index}>{content.slice(2, -2)}</strong>);
      } else if (content.startsWith('`')) {
        parts.push(<code key={match.index} className="bg-black/30 px-1 rounded font-mono text-xs">{content.slice(1, -1)}</code>);
      } else if (content.startsWith('$')) {
        const latex = content.slice(1, -1);
        try {
          const html = katex.renderToString(latex, { displayMode: false, throwOnError: false });
          parts.push(<span key={match.index} dangerouslySetInnerHTML={{ __html: html }} />);
        } catch {
          parts.push(content);
        }
      }
      
      lastIndex = regex.lastIndex;
    }
    
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-torch-600 hover:bg-torch-500 text-white p-4 rounded-full shadow-2xl shadow-orange-900/50 transition-all hover:scale-110 z-50"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-[#1e1e1e] rounded-xl shadow-2xl border border-gray-700 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-torch-800 to-torch-600 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="text-white" size={20} />
              <span className="font-bold text-white">PyTorch Assistant</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#121212]">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-torch-600 text-white rounded-br-none' 
                      : 'bg-[#2d2d2d] text-gray-200 rounded-bl-none border border-gray-700'
                  }`}
                >
                  {msg.role === 'model' && !msg.text ? (
                    <Loader2 size={16} className="animate-spin text-torch-400" /> 
                  ) : (
                    <div className="whitespace-pre-wrap leading-relaxed break-words">
                        {renderMessageText(msg.text)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-[#1e1e1e] border-t border-gray-700">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                className="w-full bg-[#2d2d2d] text-white pl-4 pr-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-torch-500 resize-none h-12 text-sm"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className="absolute right-2 top-2 p-1.5 text-torch-500 hover:text-white disabled:opacity-50 transition-colors"
              >
                {isStreaming ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;