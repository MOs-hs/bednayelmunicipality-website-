import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, Tag, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const API_BASE = 'http://localhost:5000';

export default function News() {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(i18n.language === 'ar' ? 'ar-LB' : 'en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  useEffect(() => {
    api.get('/news')
      .then(res => { if (res.data.success) setArticles(res.data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const rawCategories = [...new Set(articles.map(a => a.category).filter(Boolean))];

  const filtered = articles.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      (a.summary || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || a.category === activeCategory;
    return matchSearch && matchCat;
  });

  const [featured, ...rest] = filtered;
  const isRtl = i18n.dir() === 'rtl';
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className="min-h-screen bg-navy-900 py-20">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-navy-900 via-blue-900/40 to-navy-900 border-b border-white/10 mb-16">
        <div className="max-w-7xl mx-auto px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Newspaper size={16} />
            {t('news.badge')}
          </div>
          <h1 className="text-5xl font-black text-white mb-4">{t('news.title')}</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('news.subtitle')}
          </p>

          {/* Search */}
          <div className="mt-8 max-w-lg mx-auto relative">
            <Search size={18} className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isRtl ? 'right-4' : 'left-4'}`} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('news.searchPlaceholder')}
              className={`w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-full py-3 focus:outline-none focus:border-blue-400 transition ${isRtl ? 'pr-11 pl-5' : 'pl-11 pr-5'}`}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {t('news.all')}
          </button>
          {rawCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-navy-700 rounded-t-2xl" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-navy-700 rounded w-3/4" />
                  <div className="h-3 bg-navy-700 rounded w-full" />
                  <div className="h-3 bg-navy-700 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <Newspaper size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-xl">{t('news.noNews')}</p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featured && (
              <Link
                to={`/news/${featured.id}`}
                className="group block mb-10 card overflow-hidden hover:shadow-2xl hover:shadow-blue-900/30 transition-all duration-300"
              >
                <div className="md:flex">
                  <div className="md:w-1/2 relative overflow-hidden">
                    {featured.image_path ? (
                      <img
                        src={`${API_BASE}/uploads/news/${featured.image_path}`}
                        alt={featured.title}
                        className="w-full h-72 md:h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-72 bg-gradient-to-br from-blue-600/30 to-navy-700 flex items-center justify-center">
                        <Newspaper size={64} className="text-blue-400/50" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {t('news.featured')}
                    </div>
                  </div>
                  <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      {featured.category && (
                        <span className="flex items-center gap-1 text-blue-400 text-xs bg-blue-500/20 px-3 py-1 rounded-full">
                          <Tag size={11} /> {featured.category}
                        </span>
                      )}
                      {featured.published_at && (
                        <span className="flex items-center gap-1 text-gray-500 text-xs">
                          <Calendar size={11} /> {formatDate(featured.published_at)}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                      {featured.title}
                    </h2>
                    {featured.summary && (
                      <p className="text-gray-400 leading-relaxed mb-6">{featured.summary}</p>
                    )}
                    <span className="flex items-center gap-2 text-blue-400 font-medium group-hover:gap-3 transition-all">
                      {t('news.readFull')} <ArrowIcon size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Rest of articles */}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map(article => (
                  <Link
                    key={article.id}
                    to={`/news/${article.id}`}
                    className="group card overflow-hidden hover:shadow-xl hover:shadow-blue-900/20 transition-all duration-300 flex flex-col"
                  >
                    <div className="relative overflow-hidden">
                      {article.image_path ? (
                        <img
                          src={`${API_BASE}/uploads/news/${article.image_path}`}
                          alt={article.title}
                          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-52 bg-gradient-to-br from-blue-600/20 to-navy-700 flex items-center justify-center">
                          <Newspaper size={40} className="text-blue-400/40" />
                        </div>
                      )}
                      {article.category && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-blue-600/90 backdrop-blur text-white text-xs font-medium px-3 py-1 rounded-full">
                            {article.category}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      {article.published_at && (
                        <p className="text-gray-500 text-xs flex items-center gap-1 mb-3">
                          <Calendar size={11} /> {formatDate(article.published_at)}
                        </p>
                      )}
                      <h3 className="text-white font-bold text-lg mb-2 leading-snug group-hover:text-blue-300 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      {article.summary && (
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1">
                          {article.summary}
                        </p>
                      )}
                      <span className="mt-4 flex items-center gap-1 text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
                        {t('news.readMore')} <ArrowIcon size={14} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
