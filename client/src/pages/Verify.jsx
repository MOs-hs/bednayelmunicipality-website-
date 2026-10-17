import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Verify() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || '';
  const initialCode = location.state?.verification_code || ''; // We show this just for the demo

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify', { phone, code });
      setSuccess(t('verify.success'));
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || t('verify.invalidCode'));
    } finally {
      setLoading(false);
    }
  };

  if (!phone) {
    return <div className="text-center py-20 text-white">{t('verify.noPhone')}</div>;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-navy-800 p-8 rounded-2xl shadow-2xl border border-white/10">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-500/20 mb-4">
            <CheckCircle className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">{t('verify.title')}</h2>
          <p className="mt-2 text-sm text-gray-400">
            {t('verify.subtitle')} <br/> <span className="font-bold text-white dir-ltr inline-block mt-2">{phone}</span>
          </p>
          {initialCode && (
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 text-sm">
              <strong>{t('verify.devNote')}</strong> {t('verify.devCode')} <span className="font-bold text-white text-lg ml-2">{initialCode}</span>
            </div>
          )}
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg flex items-center gap-2 text-sm">
              <CheckCircle size={16} /> {success}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('verify.codeLabel')}</label>
            <input 
              type="text" 
              required 
              maxLength="6"
              value={code} 
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))} 
              className="input-field text-center text-2xl tracking-[0.5em] font-bold" 
              dir="ltr" 
              placeholder="------" 
            />
          </div>

          <button type="submit" disabled={loading || success} className="btn-primary w-full flex justify-center py-3">
            {loading ? t('verify.verifying') : t('verify.verifyButton')}
          </button>
        </form>
      </div>
    </div>
  );
}
