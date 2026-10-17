import { useState, useEffect } from 'react';
import api from '../api/axios';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const res = await api.get('/gallery');
        setPhotos(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  return (
    <div className="py-20 bg-navy-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">{t('gallery.title')}</h1>
          <p className="text-xl text-gray-400">{t('gallery.subtitle')}</p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-20">{t('gallery.loading')}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.length > 0 ? photos.map(photo => (
              <div 
                key={photo.id} 
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img src={`http://localhost:5000/uploads/gallery/${photo.image_path}`} alt={photo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white font-bold text-lg">{photo.title}</h3>
                  {photo.category && <span className="text-blue-400 text-sm">{photo.category}</span>}
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center text-gray-400 py-20 bg-navy-800 rounded-2xl border border-white/10">{t('gallery.noPhotos')}</div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
          <button className="absolute top-6 right-6 text-white/50 hover:text-white p-2" onClick={() => setSelectedPhoto(null)}><X size={32} /></button>
          <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <img src={`http://localhost:5000/uploads/gallery/${selectedPhoto.image_path}`} alt={selectedPhoto.title} className="w-full max-h-[80vh] object-contain rounded-lg" />
            <div className="mt-6 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">{selectedPhoto.title}</h3>
              {selectedPhoto.description && <p className="text-gray-400">{selectedPhoto.description}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
