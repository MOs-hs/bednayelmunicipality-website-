import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Phone, Lock, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginCitizen } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginCitizen(phone, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.not_verified) {
        // Redirect to verify if not verified
        navigate('/verify', { state: { phone: err.response.data.phone } });
      } else {
        setError(err.response?.data?.message || t('login.loginError'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-navy-800 p-8 rounded-2xl shadow-2xl border border-white/10">
        <div>
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-blue-500">
            <img src="/kasr.jpeg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">{t('login.title')}</h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            {t('login.or')} <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300">{t('login.createAccount')}</Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('login.phoneLabel')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400"><Phone size={18} /></div>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field pr-10" dir="ltr" placeholder="03 123 456" autoComplete="username" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">{t('login.passwordLabel')}</label>
                <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  {t('login.forgotPassword')}
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400"><Lock size={18} /></div>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pr-10" dir="ltr" autoComplete="current-password" />
              </div>
            </div>

          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center py-3">
            {loading ? t('login.loggingIn') : t('login.loginButton')}
          </button>
        </form>
      </div>
    </div>
  );
}
