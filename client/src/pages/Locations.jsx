import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import api from '../api/axios';
import { useTranslation } from 'react-i18next';

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get(`/locations?category=${category}`);
        setLocations(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, [category]);

  const categories = [
    { id: 'all', nameKey: 'locations.categories.all' },
    { id: 'tourist', nameKey: 'locations.categories.tourist' },
    { id: 'restaurant', nameKey: 'locations.categories.restaurant' },
    { id: 'health', nameKey: 'locations.categories.health' },
    { id: 'education', nameKey: 'locations.categories.education' },
    { id: 'business', nameKey: 'locations.categories.business' },
  ];

  const getLocationImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const base = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000';
    if (path.startsWith('/')) return `${base}${path}`;
    if (path.startsWith('locations/')) return `${base}/uploads/${path}`;
    return `${base}/uploads/locations/${path}`;
  };

  return (
    <div className="py-20 bg-navy-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">{t('locations.title')}</h1>
          <p className="text-xl text-gray-400">{t('locations.subtitle')}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-6 py-2 rounded-full transition-all font-semibold ${
                category === cat.id ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-navy-800 text-gray-400 hover:bg-navy-700 hover:text-white border border-white/10'
              }`}
            >
              {t(cat.nameKey)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">{t('locations.loading')}</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {locations.length > 0 ? locations.map(loc => (
              <div key={loc.id} className="card overflow-hidden group">
                <div className="h-48 bg-navy-700 relative overflow-hidden">
                  {loc.image_path ? (
                    <img src={getLocationImageUrl(loc.image_path)} alt={loc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500"><MapPin size={48} /></div>
                  )}
                  <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                    {categories.find(c => c.id === loc.category) ? t(categories.find(c => c.id === loc.category).nameKey) : t('locations.categories.other')}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{loc.name}</h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2">{loc.description}</p>
                  
                  <div className="space-y-3 text-sm">
                    {loc.address && <div className="flex items-start gap-3 text-gray-300"><MapPin size={16} className="text-blue-400 mt-1 flex-shrink-0" /> <span>{loc.address}</span></div>}
                    {loc.phone && <div className="flex items-center gap-3 text-gray-300"><Phone size={16} className="text-emerald-400 flex-shrink-0" /> <span dir="ltr">{loc.phone}</span></div>}
                    {loc.email && <div className="flex items-center gap-3 text-gray-300"><Mail size={16} className="text-purple-400 flex-shrink-0" /> <span>{loc.email}</span></div>}
                    {loc.website && <div className="flex items-center gap-3 text-gray-300"><Globe size={16} className="text-rose-400 flex-shrink-0" /> <a href={loc.website} target="_blank" rel="noreferrer" className="hover:text-blue-400">{t('locations.visitWebsite')}</a></div>}
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center text-gray-400 py-20 bg-navy-800 rounded-2xl border border-white/10">{t('locations.noLocations')}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
