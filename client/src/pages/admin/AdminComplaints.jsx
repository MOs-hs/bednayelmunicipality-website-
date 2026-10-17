import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, MapPin, Calendar, CheckCircle, Clock,
  XCircle, Trash2, ArrowLeft, ArrowRight, Search,
  Filter, Eye, X, MessageSquare, RefreshCw, AlertCircle, FileEdit
} from 'lucide-react';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';

const API_BASE = 'http://localhost:5000';

export default function AdminComplaints() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [message, setMessage] = useState(null);
  const [activePhoto, setActivePhoto] = useState(null);

  // Edit / Resolve Modal state
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState('resolved');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [savingResolution, setSavingResolution] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/complaints');
      if (res.data.success) {
        setComplaints(res.data.data);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'فشل تحميل الشكاوى' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const openResolveModal = (comp) => {
    setEditingComplaint(comp);
    setNewStatus(comp.status === 'new' ? 'in_progress' : comp.status);
    setResolutionNotes(comp.resolution_notes || '');
  };

  const handleSaveResolution = async (e) => {
    e.preventDefault();
    if (!editingComplaint) return;
    setSavingResolution(true);
    try {
      const res = await api.put(`/complaints/${editingComplaint.id}`, {
        status: newStatus,
        resolution_notes: resolutionNotes
      });
      if (res.data.success) {
        setComplaints(prev =>
          prev.map(c =>
            c.id === editingComplaint.id
              ? { ...c, status: newStatus, resolution_notes: resolutionNotes }
              : c
          )
        );
        setMessage({ type: 'success', text: 'تم تحديث الشكوى بنجاح' });
        setEditingComplaint(null);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء حفظ التحديث' });
    } finally {
      setSavingResolution(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleQuickStatus = async (id, status) => {
    try {
      const res = await api.put(`/complaints/${id}`, { status });
      if (res.data.success) {
        setComplaints(prev =>
          prev.map(c => c.id === id ? { ...c, status } : c)
        );
        setMessage({ type: 'success', text: 'تم تحديث حالة الشكوى' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'فشل تحديث الحالة' });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(isRtl ? 'هل أنت متأكد من حذف هذه الشكوى؟' : 'Are you sure you want to delete this complaint?')) return;
    try {
      await api.delete(`/complaints/${id}`);
      setComplaints(prev => prev.filter(c => c.id !== id));
      setMessage({ type: 'success', text: 'تم حذف الشكوى بنجاح' });
    } catch (err) {
      setMessage({ type: 'error', text: 'فشل حذف الشكوى' });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const STATUS_DETAILS = {
    new: {
      label: isRtl ? 'جديدة' : 'New',
      badge: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
      dot: 'bg-amber-400'
    },
    in_progress: {
      label: isRtl ? 'جاري المعالجة' : 'In Progress',
      badge: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
      dot: 'bg-blue-400'
    },
    resolved: {
      label: isRtl ? 'تم الحل' : 'Resolved',
      badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
      dot: 'bg-emerald-400'
    },
    closed: {
      label: isRtl ? 'مغلقة' : 'Closed',
      badge: 'text-gray-400 bg-gray-400/10 border-gray-400/30',
      dot: 'bg-gray-400'
    }
  };

  const filtered = complaints.filter(c => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const query = search.toLowerCase();
    const matchesSearch =
      (c.description || '').toLowerCase().includes(query) ||
      (c.location || '').toLowerCase().includes(query) ||
      (c.resolution_notes || '').toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const countByStatus = (status) =>
    complaints.filter(c => c.status === status).length;

  return (
    <div className="py-12 bg-navy-900 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition border border-white/10"
              title={isRtl ? 'العودة للوحة التحكم' : 'Back to Dashboard'}
            >
              <BackArrow size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
                <AlertTriangle className="text-amber-400" />
                {isRtl ? 'إدارة الشكاوى' : 'Complaints Management'}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {isRtl ? 'متابعة شكاوى المواطنين وحلها وتوثيق الإجراءات' : 'Review, resolve and document citizen complaints'}
              </p>
            </div>
          </div>

          <button
            onClick={fetchComplaints}
            className="flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-sm transition"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            {isRtl ? 'تحديث البيانات' : 'Refresh'}
          </button>
        </div>

        {/* Notifications / Toast */}
        {message && (
          <div
            className={`p-4 rounded-xl flex items-center gap-3 text-sm border ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        )}

        {/* Quick Stats Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            onClick={() => setStatusFilter('all')}
            className={`p-4 rounded-2xl border transition-all text-right ${
              statusFilter === 'all'
                ? 'bg-blue-600/20 border-blue-500/50 text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <p className="text-xs">{isRtl ? 'إجمالي الشكاوى' : 'Total'}</p>
            <p className="text-2xl font-bold mt-1 text-white">{complaints.length}</p>
          </button>

          <button
            onClick={() => setStatusFilter('new')}
            className={`p-4 rounded-2xl border transition-all text-right ${
              statusFilter === 'new'
                ? 'bg-amber-500/20 border-amber-500/50 text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <p className="text-xs text-amber-400">{isRtl ? 'جديدة' : 'New'}</p>
            <p className="text-2xl font-bold mt-1 text-amber-300">{countByStatus('new')}</p>
          </button>

          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`p-4 rounded-2xl border transition-all text-right ${
              statusFilter === 'in_progress'
                ? 'bg-blue-500/20 border-blue-500/50 text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <p className="text-xs text-blue-400">{isRtl ? 'قيد المعالجة' : 'In Progress'}</p>
            <p className="text-2xl font-bold mt-1 text-blue-300">{countByStatus('in_progress')}</p>
          </button>

          <button
            onClick={() => setStatusFilter('resolved')}
            className={`p-4 rounded-2xl border transition-all text-right ${
              statusFilter === 'resolved'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <p className="text-xs text-emerald-400">{isRtl ? 'تم الحل' : 'Resolved'}</p>
            <p className="text-2xl font-bold mt-1 text-emerald-300">{countByStatus('resolved')}</p>
          </button>

          <button
            onClick={() => setStatusFilter('closed')}
            className={`p-4 rounded-2xl border transition-all text-right ${
              statusFilter === 'closed'
                ? 'bg-gray-500/20 border-gray-500/50 text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <p className="text-xs text-gray-400">{isRtl ? 'مغلقة' : 'Closed'}</p>
            <p className="text-2xl font-bold mt-1 text-gray-300">{countByStatus('closed')}</p>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search size={18} className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRtl ? 'right-4' : 'left-4'}`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isRtl ? 'بحث في الشكاوى أو الموقع...' : 'Search complaints or location...'}
              className={`w-full bg-white/5 border border-white/15 text-white placeholder-gray-500 rounded-xl py-2.5 text-sm focus:outline-none focus:border-amber-400 transition ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-sm text-gray-400">
            <span>{isRtl ? `النتائج المعروضة: ${filtered.length}` : `Showing: ${filtered.length}`}</span>
          </div>
        </div>

        {/* Complaints Cards */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="card p-6 animate-pulse space-y-4">
                <div className="h-5 bg-navy-700 rounded w-1/4" />
                <div className="h-4 bg-navy-700 rounded w-3/4" />
                <div className="h-4 bg-navy-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center text-gray-400 space-y-3">
            <AlertTriangle size={48} className="mx-auto text-gray-600" />
            <h3 className="text-lg font-semibold text-white">
              {isRtl ? 'لا توجد شكاوى مطابقة' : 'No complaints found'}
            </h3>
            <p className="text-sm">
              {isRtl ? 'لم يتم تسجيل أي شكوى في هذا التصنيف' : 'No complaints found in this category'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(comp => {
              const statusCfg = STATUS_DETAILS[comp.status] || STATUS_DETAILS.new;
              const formattedDate = comp.created_at
                ? new Date(comp.created_at).toLocaleDateString(isRtl ? 'ar-LB' : 'en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                : '—';

              return (
                <div
                  key={comp.id}
                  className="card p-6 border border-white/10 hover:border-white/20 transition-all duration-300 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Header: ID, Date, Location */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300">
                          #{comp.id}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar size={13} className="text-amber-400" /> {formattedDate}
                        </span>
                        {comp.location && (
                          <span className="flex items-center gap-1 text-xs text-gray-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                            <MapPin size={12} className="text-emerald-400" /> {comp.location}
                          </span>
                        )}
                      </div>
                      
                      {/* Description */}
                      <p className="text-white text-base font-medium leading-relaxed pt-2">
                        {comp.description}
                      </p>
                    </div>

                    {/* Status badge */}
                    <div className="flex items-center gap-2 self-start">
                      <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${statusCfg.badge}`}>
                        <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
                        {statusCfg.label}
                      </span>
                    </div>
                  </div>

                  {/* Photo & Resolution Notes Row */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/5">
                    {/* Attached Photo */}
                    {comp.photo_path ? (
                      <button
                        onClick={() => setActivePhoto(`${API_BASE}/uploads/complaints/${comp.photo_path}`)}
                        className="flex items-center gap-2 text-xs bg-navy-800 hover:bg-navy-700 text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded-xl transition"
                      >
                        <Eye size={14} />
                        {isRtl ? 'عرض الصورة المرفقة' : 'View attached photo'}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500 italic">
                        {isRtl ? 'لا توجد صورة مرفقة' : 'No photo attached'}
                      </span>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 mr-auto sm:mr-0">
                      {/* Quick Resolve / Update Modal Button */}
                      <button
                        onClick={() => openResolveModal(comp)}
                        className="btn-primary flex items-center gap-1.5 text-xs py-1.5 px-4 from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
                      >
                        <FileEdit size={14} />
                        {isRtl ? 'تحديث / حل الشكوى' : 'Update / Resolve'}
                      </button>

                      {/* Quick Status Select */}
                      <select
                        value={comp.status}
                        onChange={(e) => handleQuickStatus(comp.id, e.target.value)}
                        className="bg-navy-800 border border-white/20 text-gray-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="new" className="bg-navy-900 text-amber-400">{isRtl ? 'جديدة' : 'New'}</option>
                        <option value="in_progress" className="bg-navy-900 text-blue-400">{isRtl ? 'قيد المعالجة' : 'In Progress'}</option>
                        <option value="resolved" className="bg-navy-900 text-emerald-400">{isRtl ? 'تم الحل' : 'Resolved'}</option>
                        <option value="closed" className="bg-navy-900 text-gray-400">{isRtl ? 'إغلاق' : 'Closed'}</option>
                      </select>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(comp.id)}
                        className="p-1.5 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition border border-transparent hover:border-rose-500/30"
                        title={isRtl ? 'حذف الشكوى' : 'Delete complaint'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Resolution Notes Display if exists */}
                  {comp.resolution_notes && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-200">
                      <span className="font-bold block mb-1">
                        {isRtl ? '✓ ملاحظات المعالجة والحل:' : '✓ Resolution notes:'}
                      </span>
                      {comp.resolution_notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Modal: View Photo Fullsize */}
        {activePhoto && (
          <div
            className="modal-overlay"
            onClick={() => setActivePhoto(null)}
          >
            <div className="modal-box p-4 max-w-2xl relative" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 left-4 p-2 rounded-full bg-black/60 text-white hover:bg-black transition z-10"
              >
                <X size={18} />
              </button>
              <img
                src={activePhoto}
                alt="Complaint attachment"
                className="w-full max-h-[75vh] object-contain rounded-xl"
              />
            </div>
          </div>
        )}

        {/* Modal: Update / Resolve Complaint */}
        {editingComplaint && (
          <div
            className="modal-overlay"
            onClick={() => setEditingComplaint(null)}
          >
            <div className="modal-box p-6 max-w-lg relative" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setEditingComplaint(null)}
                className="absolute top-4 left-4 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <FileEdit className="text-emerald-400" />
                {isRtl ? `تحديث الشكوى #${editingComplaint.id}` : `Update Complaint #${editingComplaint.id}`}
              </h2>
              <p className="text-xs text-gray-400 mb-6 line-clamp-2">
                {editingComplaint.description}
              </p>

              <form onSubmit={handleSaveResolution} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    {isRtl ? 'حالة الشكوى' : 'Complaint Status'}
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="input-field [&>option]:bg-navy-900"
                  >
                    <option value="new">{isRtl ? 'جديدة (New)' : 'New'}</option>
                    <option value="in_progress">{isRtl ? 'قيد المعالجة (In Progress)' : 'In Progress'}</option>
                    <option value="resolved">{isRtl ? 'تم الحل ومعالجة المشكلة (Resolved)' : 'Resolved'}</option>
                    <option value="closed">{isRtl ? 'إغلاق الشكوى (Closed)' : 'Closed'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    {isRtl ? 'ملاحظات الإجراء والحل (Resolution Notes)' : 'Resolution Notes / Actions taken'}
                  </label>
                  <textarea
                    rows={4}
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder={isRtl ? 'اكتب ما تم إنجازه أو الرد على المواطن...' : 'Document what was done to solve this issue...'}
                    className="input-field resize-none text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingComplaint(null)}
                    className="btn-secondary text-xs px-4 py-2"
                  >
                    {isRtl ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={savingResolution}
                    className="btn-primary text-xs px-5 py-2 disabled:opacity-50"
                  >
                    {savingResolution ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'حفظ التحديث' : 'Save Update')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
