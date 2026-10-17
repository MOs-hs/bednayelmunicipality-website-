import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Mail, MapPin, Lock, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Register() {
  const [formData, setFormData] = useState({ full_name: '', phone: '', email: '', address: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError(t('register.passwordMismatch'));
    }
    
    setLoading(true);
    try {
      const res = await register({
        full_name: formData.full_name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        password: formData.password
      });
      if (res.auto_verified) {
        // Dev mode: account auto-verified, go straight to login
        navigate('/login');
      } else {
        // Production: redirect to verify page with phone and code
        navigate('/verify', { state: { phone: res.phone, verification_code: res.verification_code } });
      }
    } catch (err) {
      setError(err.response?.data?.message || t('register.registerError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-navy-800 p-8 sm:p-10 rounded-2xl shadow-2xl border border-white/10">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white mb-2">{t('register.title')}</h2>
          <p className="text-sm text-gray-400">
            {t('register.hasAccount')} <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">{t('register.loginHere')}</Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('register.fullName')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400"><User size={18} /></div>
                <input type="text" name="full_name" required value={formData.full_name} onChange={handleChange} className="input-field pr-10" autoComplete="name" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('register.phone')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400"><Phone size={18} /></div>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="input-field pr-10" dir="ltr" autoComplete="tel" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('register.email')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400"><Mail size={18} /></div>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field pr-10" dir="ltr" autoComplete="email" />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('register.address')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400"><MapPin size={18} /></div>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="input-field pr-10" autoComplete="street-address" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('register.password')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400"><Lock size={18} /></div>
                <input type="password" name="password" required value={formData.password} onChange={handleChange} className="input-field pr-10" dir="ltr" autoComplete="new-password" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('register.confirmPassword')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400"><Lock size={18} /></div>
                <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="input-field pr-10" dir="ltr" autoComplete="new-password" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center py-3">
            {loading ? t('register.creating') : t('register.createButton')}
          </button>
        </form>
      </div>
    </div>
  );
}
