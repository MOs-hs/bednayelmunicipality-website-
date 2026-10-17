import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Phone, KeyRound, AlertCircle, CheckCircle, ArrowRight, ArrowLeft, Copy, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ForgotPassword() {
  const { t, i18n } = useTranslation();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null); // { reset_link, token }
  const [copied, setCopied] = useState(false);

  const isRtl = i18n.dir() === 'rtl';
  const BackArrow = isRtl ? ArrowRight : ArrowLeft;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', { phone });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || t('forgotPassword.error'));
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(result.reset_link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-navy-800 p-8 rounded-2xl shadow-2xl border border-white/10">

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-500/20 mb-4 border border-blue-500/30">
            <KeyRound className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">{t('forgotPassword.title')}</h1>
          <p className="mt-2 text-sm text-gray-400">
            {t('forgotPassword.subtitle')}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Success — show reset link (dev mode) */}
        {result ? (
          <div className="space-y-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className="text-emerald-300 text-sm">{result.message}</p>
            </div>

            {result.reset_link && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 space-y-3">
                <p className="text-blue-300 text-xs font-semibold uppercase tracking-wide flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse inline-block" />
                  {t('forgotPassword.devLabel')}
                </p>
                <p className="text-gray-300 text-xs break-all leading-relaxed font-mono bg-navy-900 p-3 rounded-lg border border-white/5">
                  {result.reset_link}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={copyLink}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"
                  >
                    <Copy size={13} />
                    {copied ? t('forgotPassword.copied') : t('forgotPassword.copyLink')}
                  </button>
                  <a
                    href={result.reset_link}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors"
                  >
                    <ExternalLink size={13} />
                    {t('forgotPassword.openLink')}
                  </a>
                </div>
                <p className="text-gray-500 text-xs">{t('forgotPassword.expiresIn')}</p>
              </div>
            )}

            <Link to="/login" className="btn-secondary w-full flex items-center justify-center gap-2">
              <BackArrow size={16} /> {t('forgotPassword.backToLogin')}
            </Link>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('forgotPassword.phoneLabel')}</label>
              <div className="relative">
                <div className={`absolute inset-y-0 ${isRtl ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-gray-400`}>
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`input-field ${isRtl ? 'pr-10' : 'pl-10'}`}
                  dir="ltr"
                  placeholder="03 123 456"
                  autoComplete="tel"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center py-3 disabled:opacity-50">
              {loading ? t('forgotPassword.sending') : t('forgotPassword.sendButton')}
            </button>

            <p className="text-center text-sm text-gray-400">
              {t('forgotPassword.rememberPassword')}{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                {t('forgotPassword.loginLink')}
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
