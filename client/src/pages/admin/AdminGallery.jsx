import { useState, useEffect } from 'react';
import { Trash2, Plus, X } from 'lucide-react';
import api from '../../api/axios';

export default function AdminGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchPhotos = async () => {
    try {
      const res = await api.get('/gallery');
      setPhotos(res.data.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPhotos(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;
    try {
      await api.delete(`/gallery/${id}`);
      fetchPhotos();
    } catch (err) { alert('خطأ في الحذف'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);
    try {
      await api.post('/gallery', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      setShowModal(false);
      fetchPhotos();
    } catch (err) { alert(err.response?.data?.message || 'خطأ في الرفع'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="py-12 bg-navy-900 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">إدارة المعرض</h1>
          <button onClick={() => setShowModal(true)} className="btn-primary flex gap-2"><Plus /> إضافة صورة</button>
        </div>

        {loading ? <div className="text-gray-400">جاري التحميل...</div> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {photos.map(photo => (
              <div key={photo.id} className="card overflow-hidden group relative">
                <img src={`http://localhost:5000/uploads/gallery/${photo.image_path}`} alt={photo.title} className="w-full h-48 object-cover" />
                <button onClick={() => handleDelete(photo.id)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"><Trash2 size={16} /></button>
                <div className="p-4"><h3 className="text-white font-bold">{photo.title}</h3></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box p-8 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 left-6 text-gray-400 hover:text-white"><X /></button>
            <h2 className="text-2xl font-bold text-white mb-6">إضافة صورة جديدة</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="text-gray-300 block mb-2">العنوان</label><input type="text" name="title" required className="input-field" /></div>
              <div><label className="text-gray-300 block mb-2">الصورة</label><input type="file" name="image" required accept="image/*" className="input-field" /></div>
              <button type="submit" disabled={submitting} className="btn-primary w-full">{submitting ? 'جاري الرفع...' : 'حفظ'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
