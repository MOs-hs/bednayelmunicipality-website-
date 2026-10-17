import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import api from '../api/axios';
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const data = Object.fromEntries(new FormData(e.target));
    
    try {
      await api.post('/contact', data);
      setMessage({ type: 'success', text: t('contact.form.success') });
      e.target.reset();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || t('contact.form.error') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-20 max-w-7xl mx-auto px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">{t('contact.title')}</h1>
        <p className="text-xl text-gray-400">{t('contact.subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="space-y-8">
          <div className="card p-8 flex items-start gap-6">
            <div className="bg-blue-500/20 p-4 rounded-full text-blue-400"><MapPin size={24} /></div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{t('contact.address.title')}</h3>
              <p className="text-gray-400">{t('contact.address.line1')}<br />{t('contact.address.line2')}</p>
            </div>
          </div>
          <div className="card p-8 flex items-start gap-6">
            <div className="bg-emerald-500/20 p-4 rounded-full text-emerald-400"><Phone size={24} /></div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{t('contact.phone.title')}</h3>
              <p className="text-gray-400" dir="ltr">08/912 300<br />08 912 301</p>
            </div>
          </div>
          <div className="card p-8 flex items-start gap-6">
            <div className="bg-purple-500/20 p-4 rounded-full text-purple-400"><Mail size={24} /></div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{t('contact.email.title')}</h3>
              <p className="text-gray-400">info@bednayelmunicipality.com</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 card p-10">
          <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">{t('contact.form.title')}</h2>
          {message && (
            <div className={`p-4 rounded-xl mb-8 ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50' : 'bg-red-500/20 text-red-300 border border-red-500/50'}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('contact.form.fullName')}</label>
                <input type="text" name="full_name" required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('contact.form.email')}</label>
                <input type="email" name="email" required className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('contact.form.message')}</label>
              <textarea name="message" rows="6" required className="input-field"></textarea>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center items-center gap-2">
              <Send size={18} /> {loading ? t('contact.form.sending') : t('contact.form.sendButton')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
