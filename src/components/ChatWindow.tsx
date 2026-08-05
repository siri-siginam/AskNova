import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { ChatMessageItem } from './ChatMessageItem';
import { Send, Mic, MicOff, ChevronDown, Bot, MessageSquare } from 'lucide-react';

interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (query: string, forceAiMode: boolean) => void;
  onClearChat: () => void;
  onFeedback: (messageId: string, feedback: 'helpful' | 'unhelpful') => void;
  selectedCategory: string;
}

const SUGGESTED_QUESTIONS = [
  'How do I reset my password?',
  'What are your support hours?',
  'How can I update my billing info?',
  'Where can I find user documentation?',
];

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  onClearChat,
  onFeedback,
  selectedCategory,
}) => {
  const [inputText, setInputText] = useState('');
  const [forceAiMode, setForceAiMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScrollToInput = () => {
    inputRef.current?.focus();
    inputRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), forceAiMode);
    setInputText('');
  };

  const handleVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice dictation is not supported in this browser window. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setInputText(transcript);
      }
    };

    recognition.start();
  };

  return (
    <div id="ask-nova-chat-window" className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto w-full px-2 sm:px-4">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 flex flex-col">
        {messages.length === 0 ? (
          <div className="my-auto flex flex-col items-center justify-center text-center px-4 py-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-xl shadow-indigo-500/20 mb-4 animate-fade-in">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Bot className="w-6 h-6 text-indigo-400 animate-pulse" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-slate-100 via-indigo-100 to-purple-200 bg-clip-text text-transparent mb-2">
              How can I assist you?
            </h2>
            <p className="text-sm text-slate-400 max-w-md mb-6">
              Ask any question or choose from one of the suggestions below to get started.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg w-full">
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(q, forceAiMode)}
                  className="flex items-center space-x-2 text-left p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-xs text-slate-300 transition-all group shadow-sm cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400 group-hover:text-pink-400 flex-shrink-0 transition-colors" />
                  <span className="line-clamp-1">{q}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessageItem
              key={msg.id}
              message={msg}
              onFeedback={onFeedback}
              onSelectAlternativeQuestion={(q) => onSendMessage(q, forceAiMode)}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Footer */}
      <div className="p-3 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl my-2">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          {/* Voice Dictation Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
            }`}
            title={isListening ? 'Stop Listening' : 'Voice Dictation Input'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 bg-slate-950 text-slate-100 placeholder-slate-500 px-4 py-2.5 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-sm transition-all"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 disabled:opacity-50 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2 text-sm flex-shrink-0"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
