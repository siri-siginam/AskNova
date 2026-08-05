import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { 
  Bot, User, Sparkles, CheckCircle2, ThumbsUp, ThumbsDown, 
  Copy, Check, Volume2, VolumeX, ShieldCheck, HelpCircle, ArrowRight 
} from 'lucide-react';
import { motion } from 'motion/react';

interface ChatMessageItemProps {
  message: ChatMessage;
  onFeedback: (messageId: string, feedback: 'helpful' | 'unhelpful') => void;
  onSelectAlternativeQuestion?: (question: string) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({
  message,
  onFeedback,
  onSelectAlternativeQuestion,
}) => {
  const isBot = message.sender === 'bot';
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(message.text);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const match = message.matchResult;
  const isHighConfidenceFaq = match && !match.isAiFallback && match.matchedFaq;
  const isAiAnswer = match && match.isAiFallback;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex space-x-3 mb-6 ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      {/* Bot Avatar */}
      {isBot && (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md flex-shrink-0 mt-1">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
      )}

      {/* Message Box */}
      <div className={`max-w-2xl w-full sm:w-auto ${isBot ? '' : 'flex flex-col items-end'}`}>
        <div
          className={`p-4 rounded-2xl text-sm leading-relaxed ${
            isBot
              ? 'bg-slate-800/90 text-slate-100 border border-slate-700/80 shadow-lg'
              : 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
          }`}
        >
          {/* Bot Source Badge Header */}
          {isBot && match && (
            <div className="mb-3 pb-2 border-b border-slate-700/60 flex items-center justify-between flex-wrap gap-2 text-xs">
              {isHighConfidenceFaq ? (
                <div className="flex items-center space-x-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {Math.round(match.confidenceScore * 100)}% FAQ Match • {match.matchedFaq?.category} → {match.matchedFaq?.subcategory}
                  </span>
                </div>
              ) : isAiAnswer ? (
                <div className="flex items-center space-x-1.5 text-indigo-300 font-medium">
                  <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
                  <span>Ask Nova AI Grounded Answer</span>
                </div>
              ) : null}

              <div className="text-slate-400 text-[11px] font-mono">
                {message.timestamp}
              </div>
            </div>
          )}

          {/* Typing Indicator */}
          {message.isTyping ? (
            <div className="flex items-center space-x-2 py-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="text-xs text-slate-400 ml-2">Nova is thinking & searching dataset...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap font-sans text-[14.5px] text-slate-100">
              {message.text}
            </div>
          )}

          {/* Tags */}
          {isBot && match?.matchedFaq?.tags && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {match.matchedFaq.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/60 text-indigo-300 border border-slate-700/50"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Alternative Close Recommendations (if any) */}
          {isBot && match?.alternativeMatches && match.alternativeMatches.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-700/60 text-xs">
              <div className="flex items-center space-x-1 text-slate-400 font-medium mb-2">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                <span>Related questions in FAQ dataset:</span>
              </div>
              <div className="space-y-1.5">
                {match.alternativeMatches.map((alt) => (
                  <button
                    key={alt.faq.id}
                    onClick={() => onSelectAlternativeQuestion && onSelectAlternativeQuestion(alt.faq.question)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-900/50 hover:bg-slate-900 text-indigo-300 hover:text-indigo-200 border border-slate-700/40 transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">• {alt.faq.question}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls for Bot Message */}
        {isBot && !message.isTyping && (
          <div className="flex items-center space-x-3 mt-1.5 px-2 text-slate-400 text-xs">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 hover:text-slate-200 transition-colors"
              title="Copy answer text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {/* Read Aloud Text-to-Speech */}
            <button
              onClick={handleSpeak}
              className={`flex items-center space-x-1 transition-colors ${
                speaking ? 'text-indigo-400 font-medium' : 'hover:text-slate-200'
              }`}
              title="Listen to answer"
            >
              {speaking ? <VolumeX className="w-3.5 h-3.5 animate-pulse text-indigo-400" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{speaking ? 'Stop' : 'Listen'}</span>
            </button>

            {/* Helpfulness Feedback Buttons */}
            <div className="flex items-center space-x-1 border-l border-slate-700 pl-3">
              <span className="text-[11px] text-slate-500 mr-1 hidden sm:inline">Helpful?</span>
              <button
                onClick={() => onFeedback(message.id, 'helpful')}
                className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                  message.feedback === 'helpful' ? 'text-emerald-400 font-bold bg-emerald-950/40' : 'hover:text-slate-200'
                }`}
                title="Mark as helpful"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onFeedback(message.id, 'unhelpful')}
                className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                  message.feedback === 'unhelpful' ? 'text-rose-400 font-bold bg-rose-950/40' : 'hover:text-slate-200'
                }`}
                title="Mark as unhelpful"
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isBot && (
        <div className="w-9 h-9 rounded-xl bg-slate-700 p-0.5 shadow-md flex-shrink-0 mt-1">
          <div className="w-full h-full bg-slate-800 rounded-[10px] flex items-center justify-center">
            <User className="w-5 h-5 text-indigo-300" />
          </div>
        </div>
      )}
    </motion.div>
  );
};
