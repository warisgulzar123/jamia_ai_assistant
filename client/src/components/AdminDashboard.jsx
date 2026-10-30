import React, { useState, useEffect } from 'react';
import {
  Layers,
  Tag,
  Activity,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  X,
  FileSpreadsheet,
  Database,
  Eye,
  Check,
} from 'lucide-react';

export default function AdminDashboard({ onLogoutAdmin }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null); // null for Add, record object for Edit
  const [formData, setFormData] = useState({
    category: '',
    question: '',
    answer: '',
    keywords: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Delete Confirmation Modal State
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch all knowledge items from backend
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/data');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setRecords(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch records:', err);
      showNotification('Failed to load knowledge records from server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const showNotification = (msg, type = 'success') => {
    if (type === 'error') {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingRecord(null);
    setFormData({
      category: '',
      question: '',
      answer: '',
      keywords: '',
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (record) => {
    setEditingRecord(record);
    setFormData({
      category: record.category || '',
      question: record.question || '',
      answer: record.answer || '',
      keywords: Array.isArray(record.keywords) ? record.keywords.join(', ') : '',
    });
    setIsModalOpen(true);
  };

  // Submit Add or Edit Form
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingRecord
        ? `/api/admin/data/${editingRecord._id}`
        : '/api/admin/data';
      const method = editingRecord ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: formData.category.trim(),
          question: formData.question.trim(),
          answer: formData.answer.trim(),
          keywords: formData.keywords,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Operation failed');
      }

      showNotification(
        editingRecord
          ? 'Knowledge item updated successfully!'
          : 'New knowledge item added successfully!'
      );
      setIsModalOpen(false);
      fetchRecords(); // Refresh table in real-time
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Record
  const confirmDelete = async () => {
    if (!deletingId) return;

    try {
      const res = await fetch(`/api/admin/data/${deletingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete record');
      }

      showNotification('Record removed from knowledge base.');
      setIsDeleteModalOpen(false);
      setDeletingId(null);
      fetchRecords(); // Real-time refresh
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Seed / Reset Database
  const handleSeedDatabase = async () => {
    if (
      !window.confirm(
        'Are you sure you want to re-seed the database? This will reset records to the official 50 Jamiatul Madina Q&A entries.'
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force: true }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Seeding failed');
      }

      showNotification(`Database re-seeded successfully with ${data.count} records!`);
      fetchRecords();
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filtered Records
  const filteredRecords = records.filter((rec) => {
    const matchesSearch =
      rec.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(rec.keywords) &&
        rec.keywords.some((kw) =>
          kw.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    const matchesCategory =
      selectedCategory === 'All' || rec.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate live categories
  const categoriesList = [
    'All',
    ...new Set(records.map((r) => r.category).filter(Boolean)),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Notifications Alert Banner */}
      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 text-sm flex items-center justify-between shadow-lg shadow-emerald-950 animate-slide-up">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)}>
            <X className="w-4 h-4 text-emerald-400 hover:text-white" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-600/60 text-rose-300 text-sm flex items-center justify-between shadow-lg shadow-rose-950 animate-slide-up">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)}>
            <X className="w-4 h-4 text-rose-400 hover:text-white" />
          </button>
        </div>
      )}

      {/* STATS HEADER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        
        {/* Total Knowledge Items */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-900/50 shadow-xl flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {records.length}
            </div>
            <div className="text-xs text-slate-400 font-medium">Total Q&A Records</div>
          </div>
        </div>

        {/* Categories Count */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-900/50 shadow-xl flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <Tag className="w-7 h-7" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {categoriesList.length > 1 ? categoriesList.length - 1 : 0}
            </div>
            <div className="text-xs text-slate-400 font-medium">Active Categories</div>
          </div>
        </div>

        {/* Database Status & Seed Action */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-900/50 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Database className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-sm font-bold text-white">Atlas Active</span>
              </div>
              <div className="text-xs text-slate-400">Production Mongoose</div>
            </div>
          </div>

          <button
            onClick={handleSeedDatabase}
            title="Reset / Seed official 50 records"
            className="p-2.5 rounded-xl bg-slate-950 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 border border-slate-800 transition"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* CONTROLS BAR: SEARCH, CATEGORY FILTER & ADD BUTTON */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 mb-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions or keywords..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Category Filter Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-48 py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 transition"
          >
            {categoriesList.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons: Add Record & Re-seed */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={handleOpenAddModal}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-950 active:scale-[0.98] transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Knowledge Item</span>
          </button>
        </div>

      </div>

      {/* DATA MANAGEMENT TABLE */}
      <div className="bg-slate-900 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <div className="w-8 h-8 mx-auto border-2 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin mb-3"></div>
            <p className="text-sm">Fetching Knowledge Base Records from Atlas...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <FileSpreadsheet className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <p className="text-base font-semibold text-slate-300">No records found matching filters</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing search terms or adding new knowledge items.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-4 px-4 w-12 text-center">#</th>
                  <th className="py-4 px-4 w-32">Category</th>
                  <th className="py-4 px-4 w-1/3">Question</th>
                  <th className="py-4 px-4">Answer Preview</th>
                  <th className="py-4 px-4 w-44">Keywords</th>
                  <th className="py-4 px-4 w-28 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredRecords.map((item, index) => (
                  <tr
                    key={item._id || index}
                    className="hover:bg-slate-850/60 hover:bg-slate-800/40 transition duration-150"
                  >
                    <td className="py-3.5 px-4 text-center font-mono text-slate-500 text-xs">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/50">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white max-w-xs">
                      <div className="line-clamp-2">{item.question}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 text-xs max-w-sm">
                      <div className="line-clamp-2">{item.answer}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[170px]">
                        {Array.isArray(item.keywords) &&
                          item.keywords.slice(0, 3).map((kw, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-800 text-slate-400"
                            >
                              {kw}
                            </span>
                          ))}
                        {Array.isArray(item.keywords) && item.keywords.length > 3 && (
                          <span className="text-[10px] text-slate-500">
                            +{item.keywords.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          title="Edit Record"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setDeletingId(item._id);
                            setIsDeleteModalOpen(true);
                          }}
                          title="Delete Record"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer with counter */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Showing {filteredRecords.length} of {records.length} total entries</span>
          <span className="text-emerald-400 font-mono">Sync: MongoDB Atlas</span>
        </div>
      </div>

      {/* ADD / EDIT MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-emerald-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">
              {editingRecord ? 'Edit Knowledge Item' : 'Add New Knowledge Item'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Official Q&A records will be stored directly in MongoDB Atlas and used for AI search grounding.
            </p>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Category / شعبہ یا عنوان
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Admissions, Academics, Stats, Facilities, Contact"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              {/* Question */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Question (Bilingual English / Urdu) / سوال
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. What are the admission requirements? / جامعۃ المدینہ میں داخلہ کی شرائط کیا ہیں؟"
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                ></textarea>
              </div>

              {/* Answer */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Official Answer / مستند جواب
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter the official, verified response that Gemini AI will use as source of truth..."
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                ></textarea>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Keywords (Comma-separated) / کلیدی الفاظ
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. admission, matric, age limit, test, داخلہ, شرائط"
                  value={formData.keywords}
                  onChange={(e) =>
                    setFormData({ ...formData, keywords: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                />
                
                {/* Live Keywords Preview */}
                {formData.keywords && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {formData.keywords
                      .split(',')
                      .map((k) => k.trim())
                      .filter(Boolean)
                      .map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono"
                        >
                          #{kw}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] transition shadow-lg shadow-emerald-950 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingRecord ? 'Save Changes' : 'Create Record'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-rose-900/60 rounded-3xl p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-700/50 flex items-center justify-center text-rose-400 mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Delete Knowledge Item?</h4>
            <p className="text-xs text-slate-400 mb-6">
              This action will permanently delete this question and answer from the official knowledge base in MongoDB Atlas.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingId(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition shadow-lg shadow-rose-950"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
