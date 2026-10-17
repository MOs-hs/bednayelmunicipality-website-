import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isRtl = i18n.dir() === 'rtl';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginAdmin(username, password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || t('adminLogin.loginError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-navy-900">
      <div className="max-w-md w-full space-y-8 bg-navy-800 p-8 rounded-2xl shadow-2xl border border-red-500/20">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 mb-4">
            <Shield className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">{t('adminLogin.title')}</h2>
          <p className="mt-2 text-sm text-gray-400">{t('adminLogin.subtitle')}</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('adminLogin.username')}</label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-gray-400`}>
                  <Shield size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`input-field ${isRtl ? 'pr-10' : 'pl-10'}`}
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('adminLogin.password')}</label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-gray-400`}>
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`input-field ${isRtl ? 'pr-10' : 'pl-10'}`}
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
          >
            {loading ? t('adminLogin.loggingIn') : t('adminLogin.loginButton')}
          </button>
        </form>
      </div>
    </div>
  );
}
