import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  User, Phone, Calendar, MessageSquare, Clock,
  CheckCircle, Loader2, ClipboardList,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [loadingA, setLoadingA] = useState(true);

  const STATUS_CONFIG = {
    pending:      { label: t('dashboard.status.pending'),     color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
    confirmed:    { label: t('dashboard.status.confirmed'),   color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' },
    completed:    { label: t('dashboard.status.completed'),   color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
    cancelled:    { label: t('dashboard.status.cancelled'),   color: 'text-red-400 bg-red-400/10 border-red-400/30' },
    open:         { label: t('dashboard.status.open'),        color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' },
    'in-progress': { label: t('dashboard.status.inProgress'), color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
    resolved:     { label: t('dashboard.status.resolved'),    color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' },
    closed:       { label: t('dashboard.status.closed'),      color: 'text-gray-400 bg-gray-400/10 border-gray-400/30' },
  };

  function StatusBadge({ status }) {
    const s = STATUS_CONFIG[status] || { label: status, color: 'text-gray-400 bg-gray-400/10 border-gray-400/30' };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${s.color}`}>
        {s.label}
      </span>
    );
  }

  function Section({ icon: Icon, title, count, color, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
      <div className="card overflow-hidden">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${color}`}>
              <Icon size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">{title}</span>
            {count !== undefined && (
              <span className="bg-white/10 text-gray-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                {count}
              </span>
            )}
          </div>
          {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </button>
        {open && <div className="border-t border-white/10">{children}</div>}
      </div>
    );
  }

  // Fetch citizen's own appointments
  useEffect(() => {
    api.get('/appointments/my')
      .then(res => { if (res.data.success) setAppointments(res.data.data); })
      .catch(() => {})
      .finally(() => setLoadingA(false));
  }, [user]);

  return (
    <div className="py-12 bg-navy-900 min-h-[80vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-b border-white/10 pb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
            <User size={30} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{t('dashboard.title')}</h1>
            <p className="text-gray-400 mt-1">{t('dashboard.welcome')} <span className="text-blue-400 font-semibold">{user?.name}</span></p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="card p-6">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <User size={18} className="text-blue-400" /> {t('dashboard.accountInfo')}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-navy-900 rounded-xl p-4 border border-white/5">
              <p className="text-xs text-gray-500 mb-1">{t('dashboard.fullName')}</p>
              <p className="text-white font-semibold">{user?.name || '—'}</p>
            </div>
            <div className="bg-navy-900 rounded-xl p-4 border border-white/5">
              <p className="text-xs text-gray-500 mb-1">{t('dashboard.phone')}</p>
              <p className="text-white font-semibold" dir="ltr">{user?.phone || '—'}</p>
            </div>
            <div className="bg-navy-900 rounded-xl p-4 border border-white/5 sm:col-span-2">
              <p className="text-xs text-gray-500 mb-1">{t('dashboard.accountType')}</p>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-sm">
                <CheckCircle size={14} /> {t('dashboard.registeredCitizen')}
              </span>
            </div>
          </div>
        </div>

        {/* Appointments */}
        <Section
          icon={Calendar}
          title={t('dashboard.myAppointments')}
          count={appointments.length}
          color="bg-blue-500/20"
          defaultOpen={true}
        >
          {loadingA ? (
            <div className="flex items-center justify-center gap-3 py-12 text-gray-400">
              <Loader2 size={20} className="animate-spin" /> {t('dashboard.loading')}
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
              <p>{t('dashboard.noAppointments')}</p>
              <p className="text-xs mt-1 text-gray-600">{t('dashboard.bookFromServices')}</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {appointments.map(appt => (
                <div key={appt.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-white/5 transition-colors">
                  <div className="flex-1 space-y-1">
                    <p className="text-white font-semibold">{appt.service_type}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} /> {new Date(appt.appointment_date).toLocaleDateString(i18n.language === 'ar' ? 'ar-LB' : 'en-US')}
                      </span>
                      {appt.appointment_time && (
                        <span className="flex items-center gap-1">
                          <Clock size={13} /> {appt.appointment_time}
                        </span>
                      )}
                    </div>
                    {appt.notes && <p className="text-gray-500 text-xs">{appt.notes}</p>}
                  </div>
                  <StatusBadge status={appt.status || 'pending'} />
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-2 gap-4">
          <a href="/services" className="card p-6 flex items-center gap-4 hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
            <div className="p-3 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
              <Calendar size={22} className="text-blue-400" />
            </div>
            <div>
              <p className="text-white font-semibold">{t('dashboard.bookAppointment')}</p>
              <p className="text-gray-500 text-xs">{t('dashboard.fromServicesPage')}</p>
            </div>
          </a>
          <a href="/contact" className="card p-6 flex items-center gap-4 hover:border-emerald-500/50 hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
            <div className="p-3 rounded-xl bg-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors">
              <MessageSquare size={22} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-semibold">{t('dashboard.contactUs')}</p>
              <p className="text-gray-500 text-xs">{t('dashboard.sendInquiry')}</p>
            </div>
          </a>
        </div>

      </div>
    </div>
  );
}
