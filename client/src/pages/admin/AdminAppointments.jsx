import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck, Clock, Mail, User, Phone, CheckCircle,
  XCircle, AlertCircle, Trash2, ArrowLeft, ArrowRight,
  Search, Filter, ChevronDown, RefreshCw
} from 'lucide-react';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';

export default function AdminAppointments() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [message, setMessage] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/appointments');
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'فشل تحميل المواعيد. يرجى المحاولة مجدداً.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await api.put(`/appointments/${id}`, { status: newStatus });
      if (res.data.success) {
        setAppointments(prev =>
          prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
        );
        setMessage({ type: 'success', text: 'تم تحديث حالة الموعد بنجاح' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء تحديث الحالة' });
    } finally {
      setUpdatingId(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(isRtl ? 'هل أنت متأكد من حذف هذا الموعد؟' : 'Are you sure you want to delete this appointment?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      setAppointments(prev => prev.filter(a => a.id !== id));
      setMessage({ type: 'success', text: 'تم حذف الموعد بنجاح' });
    } catch (err) {
      setMessage({ type: 'error', text: 'فشل حذف الموعد' });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const STATUS_DETAILS = {
    pending: {
      label: isRtl ? 'قيد الانتظار' : 'Pending',
      badge: 'text-amber-400 bg-amber-400/10 border-amber-400/30'
    },
    confirmed: {
      label: isRtl ? 'مؤكد' : 'Confirmed',
      badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
    },
    completed: {
      label: isRtl ? 'مكتمل' : 'Completed',
      badge: 'text-blue-400 bg-blue-400/10 border-blue-400/30'
    },
    cancelled: {
      label: isRtl ? 'ملغى' : 'Cancelled',
      badge: 'text-rose-400 bg-rose-400/10 border-rose-400/30'
    }
  };

  const filtered = appointments.filter(a => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const query = search.toLowerCase();
    const matchesSearch =
      (a.full_name || '').toLowerCase().includes(query) ||
      (a.email || '').toLowerCase().includes(query) ||
      (a.service_type || '').toLowerCase().includes(query) ||
      (a.notes || '').toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const countByStatus = (status) =>
    appointments.filter(a => a.status === status).length;

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
                <CalendarCheck className="text-rose-400" />
                {isRtl ? 'إدارة المواعيد والطلبات' : 'Appointments & Requests'}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {isRtl ? 'متابعة وتحديث مواعيد وطلبات المواطنين' : 'Review and manage citizen appointments and requests'}
              </p>
            </div>
          </div>

          <button
            onClick={fetchAppointments}
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
            <p className="text-xs">{isRtl ? 'إجمالي المواعيد' : 'Total'}</p>
            <p className="text-2xl font-bold mt-1 text-white">{appointments.length}</p>
          </button>

          <button
            onClick={() => setStatusFilter('pending')}
            className={`p-4 rounded-2xl border transition-all text-right ${
              statusFilter === 'pending'
                ? 'bg-amber-500/20 border-amber-500/50 text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <p className="text-xs text-amber-400">{isRtl ? 'قيد الانتظار' : 'Pending'}</p>
            <p className="text-2xl font-bold mt-1 text-amber-300">{countByStatus('pending')}</p>
          </button>

          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`p-4 rounded-2xl border transition-all text-right ${
              statusFilter === 'confirmed'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <p className="text-xs text-emerald-400">{isRtl ? 'مؤكدة' : 'Confirmed'}</p>
            <p className="text-2xl font-bold mt-1 text-emerald-300">{countByStatus('confirmed')}</p>
          </button>

          <button
            onClick={() => setStatusFilter('completed')}
            className={`p-4 rounded-2xl border transition-all text-right ${
              statusFilter === 'completed'
                ? 'bg-blue-500/20 border-blue-500/50 text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <p className="text-xs text-blue-400">{isRtl ? 'مكتملة' : 'Completed'}</p>
            <p className="text-2xl font-bold mt-1 text-blue-300">{countByStatus('completed')}</p>
          </button>

          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`p-4 rounded-2xl border transition-all text-right ${
              statusFilter === 'cancelled'
                ? 'bg-rose-500/20 border-rose-500/50 text-white'
                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <p className="text-xs text-rose-400">{isRtl ? 'ملغاة' : 'Cancelled'}</p>
            <p className="text-2xl font-bold mt-1 text-rose-300">{countByStatus('cancelled')}</p>
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
              placeholder={isRtl ? 'بحث بالاسم، الخدمة أو البريد...' : 'Search by name, service or email...'}
              className={`w-full bg-white/5 border border-white/15 text-white placeholder-gray-500 rounded-xl py-2.5 text-sm focus:outline-none focus:border-rose-400 transition ${isRtl ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-sm text-gray-400">
            <span>{isRtl ? `النتائج المعروضة: ${filtered.length}` : `Showing: ${filtered.length}`}</span>
          </div>
        </div>

        {/* Appointments List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="card p-6 animate-pulse space-y-4">
                <div className="h-5 bg-navy-700 rounded w-1/4" />
                <div className="h-4 bg-navy-700 rounded w-1/2" />
                <div className="h-4 bg-navy-700 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center text-gray-400 space-y-3">
            <CalendarCheck size={48} className="mx-auto text-gray-600" />
            <h3 className="text-lg font-semibold text-white">
              {isRtl ? 'لا توجد مواعيد مطابقة' : 'No appointments found'}
            </h3>
            <p className="text-sm">
              {isRtl ? 'جرّب تغيير حالة الفلتر أو كلمة البحث' : 'Try adjusting your filters or search keywords'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(appt => {
              const statusCfg = STATUS_DETAILS[appt.status] || STATUS_DETAILS.pending;
              const formattedDate = appt.appointment_date
                ? new Date(appt.appointment_date).toLocaleDateString(isRtl ? 'ar-LB' : 'en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                : '—';

              return (
                <div
                  key={appt.id}
                  className="card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  {/* Left Column: Citizen & Service details */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-purple-500/20 flex items-center justify-center text-rose-400 font-bold border border-rose-500/30">
                        {appt.full_name ? appt.full_name.charAt(0) : <User size={18} />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          {appt.full_name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-0.5">
                          {appt.email && (
                            <span className="flex items-center gap-1">
                              <Mail size={12} className="text-rose-400" /> {appt.email}
                            </span>
                          )}
                          {appt.phone && (
                            <span className="flex items-center gap-1" dir="ltr">
                              <Phone size={12} className="text-rose-400" /> {appt.phone}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="mr-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {appt.service_type || 'طلب عام'}
                      </span>
                    </div>

                    {/* Date, Time & Notes */}
                    <div className="grid sm:grid-cols-2 gap-2 text-sm pt-2 border-t border-white/5">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock size={15} className="text-blue-400" />
                        <span>{formattedDate}</span>
                        {appt.appointment_time && (
                          <span className="text-xs bg-navy-900 border border-white/10 px-2 py-0.5 rounded text-gray-300 font-mono">
                            {appt.appointment_time.slice(0, 5)}
                          </span>
                        )}
                      </div>
                      {appt.notes && (
                        <div className="text-gray-400 text-xs italic bg-navy-900/60 p-2 rounded-lg border border-white/5">
                          <span className="font-semibold text-gray-300 not-italic">{isRtl ? 'ملاحظات: ' : 'Notes: '}</span>
                          {appt.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Status & Actions */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/5">
                    {/* Status Badge */}
                    <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold border ${statusCfg.badge}`}>
                      {statusCfg.label}
                    </span>

                    {/* Change Status Dropdown */}
                    <select
                      value={appt.status}
                      disabled={updatingId === appt.id}
                      onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                      className="bg-navy-800 border border-white/20 text-gray-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-rose-400 cursor-pointer disabled:opacity-50"
                    >
                      <option value="pending" className="bg-navy-900 text-amber-400">{isRtl ? 'قيد الانتظار' : 'Pending'}</option>
                      <option value="confirmed" className="bg-navy-900 text-emerald-400">{isRtl ? 'تأكيد الموعد' : 'Confirm'}</option>
                      <option value="completed" className="bg-navy-900 text-blue-400">{isRtl ? 'إكمال الموعد' : 'Complete'}</option>
                      <option value="cancelled" className="bg-navy-900 text-rose-400">{isRtl ? 'إلغاء الموعد' : 'Cancel'}</option>
                    </select>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(appt.id)}
                      className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition border border-transparent hover:border-rose-500/30"
                      title={isRtl ? 'حذف السجل' : 'Delete record'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
