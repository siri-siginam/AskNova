import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { ChatWindow } from './components/ChatWindow';
import { FAQExplorer } from './components/FAQExplorer';
import { AdminManager } from './components/AdminManager';
import { SoftAurora } from './components/SoftAurora';
import { ChatMessage, FAQItem, FAQStats, CategoryName } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'explorer' | 'admin'>('chat');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [stats, setStats] = useState<FAQStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial FAQs and Stats
  const fetchFaqs = async () => {
    try {
      const res = await fetch('/api/faqs');
      if (res.ok) {
        const data = await res.json();
        setFaqs(data.faqs || []);
      }
    } catch (err) {
      console.error('Failed to fetch FAQs:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchFaqs(), fetchStats()]);
      setLoading(false);
    };
    init();
  }, []);

  // Handle Send Message
  const handleSendMessage = async (userQuery: string, forceAiMode: boolean) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = `usr-${Date.now()}`;

    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: userQuery,
      timestamp
    };

    const botTypingId = `bot-${Date.now()}`;
    const botTypingMessage: ChatMessage = {
      id: botTypingId,
      sender: 'bot',
      text: '',
      timestamp,
      isTyping: true
    };

    setMessages(prev => [...prev, userMessage, botTypingMessage]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery, forceAiMode })
      });

      if (!res.ok) throw new Error('API server returned error');

      const data = await res.json();
      const matchResult = data.matchResult;

      let responseText = '';
      if (matchResult.isAiFallback && matchResult.aiGroundedAnswer) {
        responseText = matchResult.aiGroundedAnswer;
      } else if (matchResult.matchedFaq) {
        responseText = matchResult.matchedFaq.answer;
      } else {
        responseText = "I couldn't locate a direct match in our FAQ database. Please select from the suggested topics below or rephrase your question.";
      }

      const botResponseMessage: ChatMessage = {
        id: botTypingId,
        sender: 'bot',
        text: responseText,
        timestamp,
        matchResult,
        isTyping: false
      };

      setMessages(prev => prev.map(m => (m.id === botTypingId ? botResponseMessage : m)));
      fetchStats();
    } catch (err) {
      console.error('Failed to send query:', err);
      const errorMessage: ChatMessage = {
        id: botTypingId,
        sender: 'bot',
        text: 'Sorry, I encountered an error connecting to the Ask Nova server. Please try again.',
        timestamp,
        isTyping: false
      };
      setMessages(prev => prev.map(m => (m.id === botTypingId ? errorMessage : m)));
    }
  };

  // Handle Feedback
  const handleFeedback = async (messageId: string, feedback: 'helpful' | 'unhelpful') => {
    setMessages(prev =>
      prev.map(m => (m.id === messageId ? { ...m, feedback } : m))
    );

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback })
      });
      fetchStats();
    } catch (err) {
      console.error('Failed to log feedback:', err);
    }
  };

  // Handle Add FAQ
  const handleAddFaq = async (faqData: {
    category: CategoryName;
    subcategory: string;
    question: string;
    answer: string;
    tags: string[];
  }) => {
    const res = await fetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(faqData)
    });
    if (res.ok) {
      await Promise.all([fetchFaqs(), fetchStats()]);
    }
  };

  // Handle Update FAQ
  const handleUpdateFaq = async (id: string, updatedData: Partial<FAQItem>) => {
    const res = await fetch(`/api/faqs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    if (res.ok) {
      await Promise.all([fetchFaqs(), fetchStats()]);
    }
  };

  // Handle Delete FAQ
  const handleDeleteFaq = async (id: string) => {
    const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await Promise.all([fetchFaqs(), fetchStats()]);
    }
  };

  // Ask in Chat helper
  const handleAskInChat = (question: string) => {
    setActiveTab('chat');
    handleSendMessage(question, false);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white overflow-hidden">
      {/* Background SoftAurora */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-80">
        <SoftAurora
          speed={0.6}
          scale={1.5}
          brightness={1.0}
          color1="#6366f1"
          color2="#e100ff"
          noiseFrequency={2.5}
          noiseAmplitude={1.0}
          bandHeight={0.5}
          bandSpread={1.0}
          octaveDecay={0.1}
          layerOffset={0}
          colorSpeed={1.0}
          enableMouseInteraction={true}
          mouseInfluence={0.25}
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          totalFaqsCount={faqs.length}
        />

      {/* Main Tab Content */}
      <main className="flex-1 py-4">
        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-400">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <span className="text-sm font-medium">Initializing Ask Nova Knowledge Engine...</span>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'chat' && (
              <ChatWindow
                messages={messages}
                onSendMessage={handleSendMessage}
                onClearChat={() => setMessages([])}
                onFeedback={handleFeedback}
                selectedCategory={selectedCategory}
              />
            )}

            {activeTab === 'explorer' && (
              <FAQExplorer
                faqs={faqs}
                onAskInChat={handleAskInChat}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            )}

            {activeTab === 'admin' && (
              <AdminManager
                faqs={faqs}
                stats={stats}
                onAddFaq={handleAddFaq}
                onUpdateFaq={handleUpdateFaq}
                onDeleteFaq={handleDeleteFaq}
                onRefreshFaqs={() => {
                  fetchFaqs();
                  fetchStats();
                }}
              />
            )}
          </>
        )}
      </main>
      </div>
    </div>
  );
}
