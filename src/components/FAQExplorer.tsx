import React, { useState, useMemo } from 'react';
import { FAQItem, CategoryName } from '../types';
import { Search, BookOpen, Copy, Check, MessageSquare, Tag, Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQExplorerProps {
  faqs: FAQItem[];
  onAskInChat: (question: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const FAQExplorer: React.FC<FAQExplorerProps> = ({
  faqs,
  onAskInChat,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract all unique subcategories for current category
  const availableSubcategories = useMemo(() => {
    let list = faqs;
    if (selectedCategory !== 'All') {
      list = list.filter(f => f.category === selectedCategory);
    }
    const subs = Array.from(new Set(list.map(f => f.subcategory)));
    return ['All', ...subs];
  }, [faqs, selectedCategory]);

  // Filter FAQs based on inputs
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchCat = selectedCategory === 'All' || faq.category === selectedCategory;
      const matchSub = selectedSubcategory === 'All' || faq.subcategory === selectedSubcategory;
      
      if (!searchTerm.trim()) return matchCat && matchSub;

      const term = searchTerm.toLowerCase().trim();
      const matchQuery =
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term) ||
        faq.tags.some(t => t.toLowerCase().includes(term)) ||
        faq.subcategory.toLowerCase().includes(term);

      return matchCat && matchSub && matchQuery;
    });
  }, [faqs, selectedCategory, selectedSubcategory, searchTerm]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedFaqId(prev => (prev === id ? null : id));
  };

  return (
    <div id="ask-nova-faq-explorer" className="max-w-6xl mx-auto px-4 py-6">
      {/* Search and Filters Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          <div>
            <h2 className="text-xl font-bold text-slate-100">FAQ Dataset Knowledge Repository</h2>
            <p className="text-xs text-slate-400">Search and explore verified Q&A entries across all domain categories</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search Field */}
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search dataset by question, answer, tag..."
              className="w-full bg-slate-950 text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none text-sm"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory('All');
              }}
              className="w-full bg-slate-950 text-slate-200 py-2 px-3 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none text-sm appearance-none cursor-pointer"
            >
              <option value="All">All Categories ({faqs.length})</option>
              {Array.from(new Set(faqs.map(f => f.category))).map(cat => (
                <option key={cat} value={cat}>
                  {cat} ({faqs.filter(f => f.category === cat).length})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>

          {/* Subcategory Dropdown */}
          <div className="relative">
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 py-2 px-3 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none text-sm appearance-none cursor-pointer"
            >
              <option value="All">All Subcategories</option>
              {availableSubcategories.filter(s => s !== 'All').map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4 px-1 text-xs text-slate-400 font-medium">
        <span>Showing {filteredFaqs.length} of {faqs.length} FAQs</span>
        {searchTerm && <span>Filtering by "{searchTerm}"</span>}
      </div>

      {/* FAQ Accordion List */}
      {filteredFaqs.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-base font-semibold text-slate-300">No matching FAQs found</p>
          <p className="text-xs mt-1">Try clearing your search filters or ask Nova directly in Chat mode!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-slate-900 border border-slate-800/90 rounded-xl overflow-hidden hover:border-slate-700 transition-all shadow-md"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full p-4 text-left flex items-start justify-between space-x-3 bg-slate-900/80 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400 mb-1">
                      <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800/60 font-sans">
                        {faq.category}
                      </span>
                      <span>•</span>
                      <span className="text-slate-400 font-sans">{faq.subcategory}</span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-100 pr-2">
                      {faq.question}
                    </h3>
                  </div>

                  <div className="p-1 text-slate-400 hover:text-slate-200 flex-shrink-0 mt-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Accordion Answer Body */}
                {isExpanded && (
                  <div className="p-4 bg-slate-950/80 border-t border-slate-800 text-sm leading-relaxed text-slate-200">
                    <div className="whitespace-pre-wrap text-slate-100 mb-4">
                      {faq.answer}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                      <Tag className="w-3.5 h-3.5 text-slate-500 mr-1" />
                      {faq.tags.map(t => (
                        <span key={t} className="text-[11px] font-mono px-2 py-0.5 bg-slate-900 text-slate-400 rounded border border-slate-800">
                          #{t}
                        </span>
                      ))}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center space-x-3 pt-3 border-t border-slate-800/80 text-xs">
                      <button
                        onClick={() => handleCopy(faq.id, faq.answer)}
                        className="flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 transition-colors px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
                      >
                        {copiedId === faq.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === faq.id ? 'Copied' : 'Copy Answer'}</span>
                      </button>

                      <button
                        onClick={() => onAskInChat(faq.question)}
                        className="flex items-center space-x-1.5 text-indigo-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-indigo-950 border border-indigo-800 hover:bg-indigo-900"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Ask in Chat</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
