import React, { useState } from 'react';
import { FAQItem, CategoryName, FAQStats } from '../types';
import { 
  PlusCircle, Download, Upload, Trash2, Edit3, Save, X, Database, 
  BarChart3, ThumbsUp, HelpCircle, CheckCircle2, FileJson, FileSpreadsheet 
} from 'lucide-react';

interface AdminManagerProps {
  faqs: FAQItem[];
  stats: FAQStats | null;
  onAddFaq: (faqData: { category: CategoryName; subcategory: string; question: string; answer: string; tags: string[] }) => Promise<void>;
  onUpdateFaq: (id: string, updatedData: Partial<FAQItem>) => Promise<void>;
  onDeleteFaq: (id: string) => Promise<void>;
  onRefreshFaqs: () => void;
}

const CATEGORY_OPTIONS: CategoryName[] = [
  'Geography', 'Education', 'Programming & Coding', 'Universities & Schools', 'Technology',
  'Products & Shopping', 'Health & Fitness', 'Banking & Finance', 'Stock Market & Investments',
  'Astrology', 'Agriculture', 'Government Services', 'Transportation', 'Tourism', 'Food',
  'History', 'Culture', 'Sports', 'Business', 'Science', 'General Knowledge'
];

export const AdminManager: React.FC<AdminManagerProps> = ({
  faqs,
  stats,
  onAddFaq,
  onUpdateFaq,
  onDeleteFaq,
  onRefreshFaqs,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);

  // Form State
  const [category, setCategory] = useState<CategoryName>('Geography');
  const [subcategory, setSubcategory] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit State
  const [editCategory, setEditCategory] = useState<CategoryName>('Geography');
  const [editSubcategory, setEditSubcategory] = useState('');
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [editTagsInput, setEditTagsInput] = useState('');

  const [filterQuery, setFilterQuery] = useState('');

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    setIsSubmitting(true);
    try {
      const tags = tagsInput.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
      await onAddFaq({
        category,
        subcategory: subcategory.trim() || 'General',
        question: question.trim(),
        answer: answer.trim(),
        tags: tags.length > 0 ? tags : [category.toLowerCase()]
      });

      // Reset
      setQuestion('');
      setAnswer('');
      setSubcategory('');
      setTagsInput('');
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to add FAQ', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (faq: FAQItem) => {
    setEditingFaqId(faq.id);
    setEditCategory(faq.category);
    setEditSubcategory(faq.subcategory);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
    setEditTagsInput(faq.tags.join(', '));
  };

  const handleSaveEdit = async (id: string) => {
    if (!editQuestion.trim() || !editAnswer.trim()) return;
    try {
      const tags = editTagsInput.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
      await onUpdateFaq(id, {
        category: editCategory,
        subcategory: editSubcategory.trim() || 'General',
        question: editQuestion.trim(),
        answer: editAnswer.trim(),
        tags
      });
      setEditingFaqId(null);
    } catch (err) {
      console.error('Failed to update FAQ', err);
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(faqs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ask-nova-faqs-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCsv = () => {
    let csv = "ID,Category,Subcategory,Question,Answer,Tags\n";
    faqs.forEach(f => {
      const q = `"${f.question.replace(/"/g, '""')}"`;
      const a = `"${f.answer.replace(/"/g, '""')}"`;
      const tags = `"${f.tags.join(';')}"`;
      csv += `${f.id},"${f.category}","${f.subcategory}",${q},${a},${tags}\n`;
    });

    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ask-nova-faqs-${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredFaqs = faqs.filter(
    f =>
      f.question.toLowerCase().includes(filterQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(filterQuery.toLowerCase()) ||
      f.subcategory.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div id="ask-nova-admin-manager" className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Indexed FAQs</p>
            <p className="text-2xl font-bold text-slate-100">{stats?.totalFaqs || faqs.length}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-purple-950 border border-purple-800 text-purple-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Categories</p>
            <p className="text-2xl font-bold text-slate-100">{Object.keys(stats?.categoryCounts || {}).length || 21}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Queries Handled</p>
            <p className="text-2xl font-bold text-slate-100">{stats?.totalQueriesAnswered || 0}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-pink-950 border border-pink-800 text-pink-400">
            <ThumbsUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Helpful Ratings</p>
            <p className="text-2xl font-bold text-slate-100">{stats?.helpfulCount || 0}</p>
          </div>
        </div>
      </div>

      {/* Admin Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter dataset entries..."
            className="bg-slate-950 text-slate-200 placeholder-slate-500 px-3.5 py-2 rounded-xl border border-slate-800 focus:border-indigo-500 focus:outline-none text-sm w-full sm:w-64"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm flex items-center space-x-2 transition-all shadow-md shadow-indigo-600/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New FAQ</span>
          </button>

          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium flex items-center space-x-1.5 border border-slate-700 transition-colors"
            title="Export JSON Dataset"
          >
            <FileJson className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">JSON</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium flex items-center space-x-1.5 border border-slate-700 transition-colors"
            title="Export CSV Dataset"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* Add New FAQ Form Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-indigo-400" />
              <span>Add New FAQ Entry</span>
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryName)}
                    className="w-full bg-slate-950 text-slate-200 py-2 px-3 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    {CATEGORY_OPTIONS.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="e.g., Capitals, Mutual Funds"
                    className="w-full bg-slate-950 text-slate-200 py-2 px-3 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., What is the capital of Spain?"
                  className="w-full bg-slate-950 text-slate-200 py-2 px-3 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Answer</label>
                <textarea
                  required
                  rows={4}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Detailed answer text..."
                  className="w-full bg-slate-950 text-slate-200 p-3 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g., spain, madrid, europe, capital"
                  className="w-full bg-slate-950 text-slate-200 py-2 px-3 rounded-xl border border-slate-800 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg"
                >
                  {isSubmitting ? 'Saving...' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ Dataset Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Category / Sub</th>
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Answer</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredFaqs.map((faq) => {
                const isEditing = editingFaqId === faq.id;

                if (isEditing) {
                  return (
                    <tr key={faq.id} className="bg-slate-950/80">
                      <td className="px-4 py-3 align-top space-y-2">
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value as CategoryName)}
                          className="w-full bg-slate-900 text-slate-200 p-1.5 rounded border border-slate-700 text-xs"
                        >
                          {CATEGORY_OPTIONS.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={editSubcategory}
                          onChange={(e) => setEditSubcategory(e.target.value)}
                          className="w-full bg-slate-900 text-slate-200 p-1.5 rounded border border-slate-700 text-xs"
                        />
                      </td>
                      <td className="px-4 py-3 align-top">
                        <input
                          type="text"
                          value={editQuestion}
                          onChange={(e) => setEditQuestion(e.target.value)}
                          className="w-full bg-slate-900 text-slate-200 p-2 rounded border border-slate-700 text-xs"
                        />
                      </td>
                      <td className="px-4 py-3 align-top">
                        <textarea
                          rows={3}
                          value={editAnswer}
                          onChange={(e) => setEditAnswer(e.target.value)}
                          className="w-full bg-slate-900 text-slate-200 p-2 rounded border border-slate-700 text-xs"
                        />
                      </td>
                      <td className="px-4 py-3 text-right align-top space-x-1">
                        <button
                          onClick={() => handleSaveEdit(faq.id)}
                          className="p-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-500"
                          title="Save Changes"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingFaqId(null)}
                          className="p-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={faq.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5 align-top">
                      <span className="inline-block px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 text-xs font-medium mb-1">
                        {faq.category}
                      </span>
                      <p className="text-xs text-slate-400">{faq.subcategory}</p>
                    </td>

                    <td className="px-4 py-3.5 align-top font-semibold text-slate-100 max-w-xs">
                      {faq.question}
                    </td>

                    <td className="px-4 py-3.5 align-top text-slate-300 max-w-md">
                      <p className="line-clamp-2">{faq.answer}</p>
                    </td>

                    <td className="px-4 py-3.5 align-top text-right space-x-1">
                      <button
                        onClick={() => startEdit(faq)}
                        className="p-1.5 rounded text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                        title="Edit FAQ"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteFaq(faq.id)}
                        className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
