import { useState } from 'react';
import { CalendarCheck, AlertTriangle, FileText, Phone, X, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useTranslation } from 'react-i18next';

export default function Services() {
  const { user, isCitizen } = useAuth();
  const [modal, setModal] = useState(null); // 'appointment' | 'complaint' | 'document' | 'login-required'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { t } = useTranslation();

  // Guard: only signed-in citizens can open service modals
  const openModal = (type) => {
    if (!user || !isCitizen) {
      setModal('login-required');
    } else {
      setMessage(null);
      setModal(type);
    }
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const formData = new FormData(e.target);

    try {
      if (type === 'appointment') {
        const data = Object.fromEntries(formData.entries());
        await api.post('/appointments', data);
        setMessage({ type: 'success', text: t('services.success.appointment') });
      } else if (type === 'complaint') {
        await api.post('/complaints', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage({ type: 'success', text: t('services.success.complaint') });
      } else if (type === 'document') {
        const data = Object.fromEntries(formData.entries());
        data.service_type = 'document';
        data.description = `Document request: ${data.document_type}\nPurpose: ${data.purpose}`;
        data.appointment_date = new Date().toISOString().split('T')[0];
        data.appointment_time = '09:00';
        await api.post('/appointments', data);
        setMessage({ type: 'success', text: t('services.success.document') });
      }
      setTimeout(() => { setModal(null); setMessage(null); }, 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || t('services.connectionError') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">{t('services.title')}</h1>
          <p className="text-xl text-gray-400">{t('services.subtitle')}</p>
          {!isCitizen && (
            <div className="mt-6 inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm px-5 py-2.5 rounded-full">
              <Lock size={14} />
              {t('services.loginRequired')}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Appointment */}
          <div className="card p-8 text-center hover:-translate-y-2 transition-transform">
            <CalendarCheck className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">{t('services.appointment.title')}</h3>
            <p className="text-gray-400 mb-8 text-sm">{t('services.appointment.desc')}</p>
            <button onClick={() => openModal('appointment')} className="btn-primary w-full">
              {isCitizen ? t('services.appointment.btn') : <span className="flex items-center justify-center gap-2"><Lock size={14} /> {t('services.loginRequiredBtn')}</span>}
            </button>
          </div>

          {/* Complaint */}
          <div className="card p-8 text-center hover:-translate-y-2 transition-transform">
            <AlertTriangle className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">{t('services.complaint.title')}</h3>
            <p className="text-gray-400 mb-8 text-sm">{t('services.complaint.desc')}</p>
            <button onClick={() => openModal('complaint')} className="btn-primary w-full from-emerald-500 to-teal-500">
              {isCitizen ? t('services.complaint.btn') : <span className="flex items-center justify-center gap-2"><Lock size={14} /> {t('services.loginRequiredBtn')}</span>}
            </button>
          </div>

          {/* Document */}
          <div className="card p-8 text-center hover:-translate-y-2 transition-transform">
            <FileText className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">{t('services.document.title')}</h3>
            <p className="text-gray-400 mb-8 text-sm">{t('services.document.desc')}</p>
            <button onClick={() => openModal('document')} className="btn-primary w-full from-purple-500 to-indigo-500">
              {isCitizen ? t('services.document.btn') : <span className="flex items-center justify-center gap-2"><Lock size={14} /> {t('services.loginRequiredBtn')}</span>}
            </button>
          </div>

          {/* Contact — public, no lock */}
          <div className="card p-8 text-center hover:-translate-y-2 transition-transform">
            <Phone className="w-16 h-16 text-rose-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">{t('services.customerService.title')}</h3>
            <p className="text-gray-400 mb-8 text-sm">{t('services.customerService.desc')}</p>
            <a href="/contact" className="btn-primary w-full block from-rose-500 to-red-500">{t('services.customerService.btn')}</a>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal-box p-8 relative">
            <button onClick={() => setModal(null)} className="absolute top-6 left-6 text-gray-400 hover:text-white">
              <X />
            </button>

            {/* Login-required gate */}
            {modal === 'login-required' && (
              <div className="text-center py-6">
                <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
                  <Lock size={36} className="text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">{t('services.loginRequiredTitle')}</h2>
                <p className="text-gray-400 mb-8">{t('services.loginRequiredDesc')}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/login" className="btn-primary flex items-center justify-center gap-2">
                    <LogIn size={16} /> {t('services.loginBtn')}
                  </Link>
                  <Link to="/register" className="btn-secondary flex items-center justify-center gap-2">
                    {t('services.createAccountBtn')}
                  </Link>
                </div>
              </div>
            )}

            {/* Service forms */}
            {modal !== 'login-required' && (
              <>
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                  {modal === 'appointment' && t('services.appointment.modalTitle')}
                  {modal === 'complaint' && t('services.complaint.modalTitle')}
                  {modal === 'document' && t('services.document.modalTitle')}
                </h2>

                {message && (
                  <div className={`p-4 rounded-xl mb-6 ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50' : 'bg-red-500/20 text-red-300 border border-red-500/50'}`}>
                    {message.text}
                  </div>
                )}

                <form onSubmit={(e) => handleSubmit(e, modal)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Pre-filled & locked from JWT */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{t('services.form.fullName')}</label>
                      <input type="text" name="full_name" value={user?.name || ''} readOnly className="input-field opacity-70 cursor-not-allowed" />
                    </div>
                    {modal !== 'document' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">{t('services.form.email')}</label>
                        <input type="email" name="email" required className="input-field" />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{t('services.form.phone')}</label>
                      <input type="tel" name="phone" value={user?.phone || ''} readOnly className="input-field opacity-70 cursor-not-allowed" dir="ltr" />
                    </div>

                    {modal === 'appointment' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">{t('services.form.appointmentDate')}</label>
                          <input type="date" name="appointment_date" required className="input-field" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">{t('services.form.appointmentTime')}</label>
                          <select name="appointment_time" required className="input-field [&>option]:bg-navy-900">
                            <option value="">{t('services.form.selectTime')}</option>
                            <option value="08:00">{t('services.form.morning8')}</option>
                            <option value="10:00">{t('services.form.morning10')}</option>
                            <option value="12:00">{t('services.form.noon12')}</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">{t('services.form.serviceType')}</label>
                          <select name="service_type" required className="input-field [&>option]:bg-navy-900">
                            <option value="">{t('services.form.selectServiceType')}</option>
                            <option value="inquiry">{t('services.form.inquiry')}</option>
                            <option value="permit">{t('services.form.permit')}</option>
                            <option value="other">{t('services.form.other')}</option>
                          </select>
                        </div>
                      </>
                    )}

                    {modal === 'complaint' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">{t('services.form.complaintType')}</label>
                          <select name="complaint_type" required className="input-field [&>option]:bg-navy-900">
                            <option value="">{t('services.form.selectComplaintType')}</option>
                            <option value="infrastructure">{t('services.form.infrastructure')}</option>
                            <option value="sanitation">{t('services.form.sanitation')}</option>
                            <option value="other">{t('services.form.other')}</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-300 mb-2">{t('services.form.problemLocation')}</label>
                          <input type="text" name="location" className="input-field" />
                        </div>
                      </>
                    )}

                    {modal === 'document' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">{t('services.form.documentType')}</label>
                          <select name="document_type" required className="input-field [&>option]:bg-navy-900">
                            <option value="">{t('services.form.selectDocumentType')}</option>
                            <option value="birth_certificate">{t('services.form.birthCertificate')}</option>
                            <option value="residence_certificate">{t('services.form.residenceCertificate')}</option>
                            <option value="other">{t('services.form.other')}</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-300 mb-2">{t('services.form.documentPurpose')}</label>
                          <textarea name="purpose" rows="3" className="input-field" required></textarea>
                        </div>
                      </>
                    )}
                  </div>

                  {(modal === 'appointment' || modal === 'complaint') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{t('services.form.description')}</label>
                      <textarea name="description" rows="4" required className="input-field"></textarea>
                    </div>
                  )}

                  {modal === 'complaint' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{t('services.form.photo')}</label>
                      <input type="file" name="photo" accept="image/*" className="text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer" />
                    </div>
                  )}

                  <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                    {loading ? t('services.form.submitting') : t('services.form.submitButton')}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
