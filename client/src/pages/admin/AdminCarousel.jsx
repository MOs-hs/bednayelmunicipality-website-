import { useState, useEffect } from 'react';
import { Trash2, Plus, X, Image as ImageIcon } from 'lucide-react';
import api from '../../api/axios';

export default function AdminCarousel() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchSlides = async () => {
    try {
      const res = await api.get('/carousel');
      setSlides(res.data.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSlides(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشريحة؟')) return;
    try {
      await api.delete(`/carousel/${id}`);
      fetchSlides();
    } catch (err) { alert('خطأ في الحذف'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);
    try {
      await api.post('/carousel', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      setShowModal(false);
      fetchSlides();
    } catch (err) { alert(err.response?.data?.message || 'خطأ في الرفع'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="py-12 bg-navy-900 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">إدارة الصور المتحركة (Carousel)</h1>
          <button onClick={() => setShowModal(true)} className="btn-primary flex gap-2"><Plus /> إضافة شريحة</button>
        </div>

        {loading ? <div className="text-gray-400">جاري التحميل...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map(slide => {
              const imgUrl = (slide.image_path.startsWith('carousel_') || slide.image_path.includes('/')) 
                ? `http://localhost:5000/uploads/gallery/${slide.image_path}` 
                : `/${slide.image_path}`;

              return (
                <div key={slide.id} className="card overflow-hidden group relative">
                  <img src={imgUrl} alt={slide.title} className="w-full h-48 object-cover" />
                  <button onClick={() => handleDelete(slide.id)} className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition"><Trash2 size={16} /></button>
                  <div className="p-4">
                    <h3 className="text-white font-bold">{slide.title}</h3>
                    {slide.subtitle && <p className="text-gray-400 text-sm mt-1">{slide.subtitle}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box p-8 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 left-6 text-gray-400 hover:text-white"><X /></button>
            <h2 className="text-2xl font-bold text-white mb-6">إضافة شريحة جديدة</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="text-gray-300 block mb-2">العنوان الرئيسي</label><input type="text" name="title" required className="input-field" /></div>
              <div><label className="text-gray-300 block mb-2">العنوان الفرعي (اختياري)</label><input type="text" name="subtitle" className="input-field" /></div>
              <div><label className="text-gray-300 block mb-2">صورة الشريحة</label><input type="file" name="image" required accept="image/*" className="input-field bg-navy-800" /></div>
              <button type="submit" disabled={submitting} className="btn-primary w-full mt-4">{submitting ? 'جاري الرفع...' : 'حفظ'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
