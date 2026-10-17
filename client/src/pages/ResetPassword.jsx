import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ResetPassword() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';
  const phone = searchParams.get('phone') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isRtl = i18n.dir() === 'rtl';

  // Validate token presence
  const isValidLink = token && phone;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) return setError(t('resetPassword.minLength'));
    if (password !== confirmPassword) return setError(t('resetPassword.passwordMismatch'));

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { phone, token, password });
      setSuccess(res.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || t('resetPassword.error'));
    } finally {
      setLoading(false);
    }
  };

  // Password strength
  const strength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 ? 2
    : 3;
  const strengthLabel = ['', t('resetPassword.weak'), t('resetPassword.medium'), t('resetPassword.strong')];
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-emerald-500'];

  if (!isValidLink) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-navy-800 p-8 rounded-2xl shadow-2xl border border-white/10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{t('resetPassword.invalidLink')}</h1>
          <p className="text-gray-400 mb-6">{t('resetPassword.invalidLinkDesc')}</p>
          <Link to="/forgot-password" className="btn-primary inline-flex items-center gap-2">
            {t('resetPassword.requestNewLink')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-navy-800 p-8 rounded-2xl shadow-2xl border border-white/10">

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-500/20 mb-4 border border-emerald-500/30">
            <ShieldCheck className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">{t('resetPassword.title')}</h1>
          <p className="mt-2 text-sm text-gray-400">
            {t('resetPassword.subtitle')}{' '}
            <span className="text-white font-semibold" dir="ltr">{phone}</span>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Success */}
        {success ? (
          <div className="space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-5 flex items-start gap-3">
              <CheckCircle size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-emerald-300 font-semibold">{success}</p>
                <p className="text-gray-400 text-sm mt-1">{t('resetPassword.redirecting')}</p>
              </div>
            </div>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('resetPassword.newPassword')}</label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-gray-400`}>
                  <Lock size={18} />
                </div>
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`input-field ${isRtl ? 'pr-10 pl-10' : 'pl-10 pr-10'}`}
                  dir="ltr"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className={`absolute inset-y-0 ${isRtl ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-gray-400 hover:text-gray-200`}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= strength ? strengthColor[strength] : 'bg-white/10'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    {t('resetPassword.passwordStrength')}{' '}
                    <span className={`font-semibold ${strength === 1 ? 'text-red-400' : strength === 2 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                      {strengthLabel[strength]}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('resetPassword.confirmPassword')}</label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-gray-400`}>
                  <Lock size={18} />
                </div>
                <input
                  type={showCpw ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`input-field ${isRtl ? 'pr-10 pl-10' : 'pl-10 pr-10'} ${confirmPassword && confirmPassword !== password ? 'border-red-500/50' : confirmPassword && confirmPassword === password ? 'border-emerald-500/50' : ''}`}
                  dir="ltr"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCpw(!showCpw)}
                  className={`absolute inset-y-0 ${isRtl ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-gray-400 hover:text-gray-200`}
                >
                  {showCpw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="text-red-400 text-xs mt-1">{t('resetPassword.passwordMismatch')}</p>
              )}
              {confirmPassword && confirmPassword === password && (
                <p className="text-emerald-400 text-xs mt-1 flex items-center gap-1">
                  <CheckCircle size={12} /> {t('resetPassword.passwordMatch')}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className="btn-primary w-full flex justify-center py-3 disabled:opacity-50"
            >
              {loading ? t('resetPassword.saving') : t('resetPassword.setPassword')}
            </button>

            <p className="text-center text-sm text-gray-400">
              <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300">
                {t('resetPassword.requestNewLink')}
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
