import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Phone, Mail, LogOut, Menu, X, Newspaper, ChevronLeft, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

export default function Navbar() {
  const { user, logout, isAdmin, isCitizen } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [newsletters, setNewsletters] = useState([]);

  useEffect(() => {
    api.get('/newsletters')
      .then(res => { if (res.data.success) setNewsletters(res.data.data); })
      .catch(() => {});
  }, []);

  const links = [
    { name: t('navbar.home'), path: '/' },
    { name: t('navbar.services'), path: '/services' },
    { name: t('navbar.contact'), path: '/contact' },
    { name: t('navbar.locations'), path: '/locations' },
    { name: t('navbar.gallery'), path: '/gallery' },
  ];

  const tickerText = newsletters.length > 0
    ? newsletters.map(n => n.title).join('   ◆   ')
    : null;

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Bar */}
      <div className="bg-black/35 backdrop-blur px-8 py-2 text-sm flex flex-wrap justify-between items-center gap-2">
        <div className="flex gap-6 items-center">
          <span className="flex items-center gap-2 text-gray-200"><Phone size={14} className="text-blue-400" /> 08/912 300</span>
          <span className="flex items-center gap-2 text-gray-200"><Mail size={14} className="text-blue-400" /> info@bednayelmunicipality.com</span>
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar')} 
            className="flex items-center gap-1 text-gray-300 hover:text-white transition text-xs border border-gray-600 px-2 py-1 rounded-full hover:bg-white/10"
          >
            <Globe size={14} /> {i18n.language === 'ar' ? t('navbar.english') : t('navbar.arabic')}
          </button>
          {user ? (
            <>
              <span className="text-gray-300">{t('navbar.welcome', { name: user.name })}</span>
              {isAdmin && <Link to="/admin" className="text-blue-400 hover:text-blue-300">{t('navbar.adminPanel')}</Link>}
              {isCitizen && <Link to="/dashboard" className="text-emerald-400 hover:text-emerald-300">{t('navbar.dashboard')}</Link>}
              <button onClick={logout} className="flex items-center gap-1 text-red-400 hover:text-red-300"><LogOut size={14} /> {t('navbar.logout')}</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-blue-400 border border-blue-400 px-4 py-1 rounded-full hover:bg-blue-400 hover:text-white transition">{t('navbar.login')}</Link>
              <Link to="/register" className="bg-blue-500 text-white border border-blue-500 px-4 py-1 rounded-full hover:bg-blue-600 transition">{t('navbar.register')}</Link>
            </>
          )}
        </div>
      </div>

      {/* News Ticker */}
      {tickerText && (
        <div className="news-ticker-bar flex items-stretch overflow-hidden" dir={i18n.dir()}>
          {/* Label */}
          <div className="news-ticker-label flex items-center gap-2 px-4 flex-shrink-0 z-10">
            <Newspaper size={15} />
            <span>{t('navbar.news')}</span>
            <ChevronLeft size={14} className="opacity-70" />
          </div>
          {/* Scrolling Text */}
          <div className="news-ticker-track flex-1 overflow-hidden relative">
            <div className="news-ticker-scroll whitespace-nowrap">
              <span>{tickerText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{tickerText}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-600 to-navy-900 shadow-2xl px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-navy-800 border-2 border-blue-400 overflow-hidden">
              <img src="/kasr.jpeg" alt="شعار البلدية" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">{t('navbar.municipalityName')}</h1>
              <h2 className="text-sm text-gray-400">{t('navbar.officialSite')}</h2>
            </div>
          </div>

          <nav className="hidden md:flex gap-1 bg-black/30 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'nav-link-active' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-2 bg-navy-800 p-4 rounded-xl border border-white/10">
             {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`p-3 rounded-lg ${location.pathname === link.path ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-navy-700'}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
