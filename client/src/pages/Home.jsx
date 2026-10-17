import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, CalendarCheck, AlertTriangle, MapPin } from 'lucide-react';
import api from '../api/axios';

export default function Home() {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState(null);
  const [news, setNews] = useState([]);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await api.get('/carousel');
        setSlides(res.data.data);
      } catch (err) {
        console.error('Error fetching slides:', err);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats');
        setStats(res.data.stats);
        setNews(res.data.news);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      {/* Hero Slideshow */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden rounded-b-[3rem] mb-16 bg-navy-900">
        {slides.length > 0 ? slides.map((slide, idx) => {
          // If image path doesn't start with http or / it might be an old hardcoded image in public/
          const imgUrl = (slide.image_path.startsWith('carousel_') || slide.image_path.includes('/')) 
            ? `http://localhost:5000/uploads/gallery/${slide.image_path}` 
            : `/${slide.image_path}`;
            
          return (
            <div
              key={slide.id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-black/40 z-10"></div>
              <img src={imgUrl} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-16 right-16 z-20 bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-white/10 max-w-lg">
                <h2 className="text-4xl font-bold text-white mb-4 shadow-black drop-shadow-lg">{slide.title}</h2>
                {slide.subtitle && <p className="text-xl text-gray-200">{slide.subtitle}</p>}
              </div>
            </div>
          );
        }) : (
          <div className="absolute inset-0 flex items-center justify-center"><span className="text-white">{t('home.loading')}</span></div>
        )}
        
        {/* Navigation Dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  idx === currentSlide ? 'bg-blue-500 border-white scale-125' : 'bg-white/50 border-transparent hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-8 -mt-24 relative z-30 mb-24">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-10 shadow-2xl border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="stat-card bg-white/10 border-white/20">
              <Users className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-4xl font-extrabold text-white mb-2">{stats ? stats.citizens : '-'}</h3>
              <p className="text-gray-200 font-medium">{t('home.stats.citizens')}</p>
            </div>
            <div className="stat-card bg-white/10 border-white/20">
              <CalendarCheck className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-4xl font-extrabold text-white mb-2">{stats ? stats.appointments : '-'}</h3>
              <p className="text-gray-200 font-medium">{t('home.stats.appointments')}</p>
            </div>
            <div className="stat-card bg-white/10 border-white/20">
              <AlertTriangle className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-4xl font-extrabold text-white mb-2">{stats ? stats.complaints : '-'}</h3>
              <p className="text-gray-200 font-medium">{t('home.stats.complaints')}</p>
            </div>
            <div className="stat-card bg-white/10 border-white/20">
              <MapPin className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-4xl font-extrabold text-white mb-2">{stats ? stats.locations : '-'}</h3>
              <p className="text-gray-200 font-medium">{t('home.stats.locations')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-navy-800">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="section-title">{t('home.about.title')}</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-300 leading-relaxed">
            {t('home.about.description')}
          </p>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="section-title">{t('home.services.title')}</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto rounded-full mb-16"></div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-10 text-center hover:-translate-y-2 transition-transform duration-300 group">
              <CalendarCheck className="w-16 h-16 text-blue-400 mx-auto mb-6 group-hover:scale-110 group-hover:text-emerald-400 transition-all" />
              <h3 className="text-2xl font-bold text-white mb-4">{t('home.services.book.title')}</h3>
              <p className="text-gray-400 mb-8">{t('home.services.book.desc')}</p>
              <Link to="/services" className="btn-primary">{t('home.services.book.btn')}</Link>
            </div>
            <div className="card p-10 text-center hover:-translate-y-2 transition-transform duration-300 group">
              <AlertTriangle className="w-16 h-16 text-blue-400 mx-auto mb-6 group-hover:scale-110 group-hover:text-emerald-400 transition-all" />
              <h3 className="text-2xl font-bold text-white mb-4">{t('home.services.complaint.title')}</h3>
              <p className="text-gray-400 mb-8">{t('home.services.complaint.desc')}</p>
              <Link to="/services" className="btn-primary">{t('home.services.complaint.btn')}</Link>
            </div>
            <div className="card p-10 text-center hover:-translate-y-2 transition-transform duration-300 group">
              <MapPin className="w-16 h-16 text-blue-400 mx-auto mb-6 group-hover:scale-110 group-hover:text-emerald-400 transition-all" />
              <h3 className="text-2xl font-bold text-white mb-4">{t('home.services.locations.title')}</h3>
              <p className="text-gray-400 mb-8">{t('home.services.locations.desc')}</p>
              <Link to="/locations" className="btn-primary">{t('home.services.locations.btn')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* News Preview */}
      <section className="py-20 bg-navy-800">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="section-title">{t('home.news.title')}</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto rounded-full mb-16"></div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {news.length > 0 ? news.map((item) => (
              <div key={item.id} className="card p-8 hover:-translate-y-2 transition-transform">
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-400 mb-4 line-clamp-3">{item.content}</p>
                <div className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString('ar-EG')}</div>
              </div>
            )) : (
              <div className="col-span-3 text-center text-gray-400 py-10">{t('home.news.noNews')}</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
