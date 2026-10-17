import { useState, useEffect } from 'react';
import { Trash2, Plus, X } from 'lucide-react';
import api from '../../api/axios';

export default function AdminNewsletters() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchNews = async () => {
    try { const res = await api.get('/newsletters/all'); setNews(res.data.data); } 
    finally { setLoading(false); }
  };
  useEffect(() => { fetchNews(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('حذف هذا الخبر؟')) return;
    await api.delete(`/newsletters/${id}`);
    fetchNews();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    data.is_published = data.is_published === 'on';
    await api.post('/newsletters', data);
    setShowModal(false);
    fetchNews();
  };

  return (
    <div className="py-12 bg-navy-900 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">إدارة الأخبار</h1>
          <button onClick={() => setShowModal(true)} className="btn-primary flex gap-2"><Plus /> إضافة خبر</button>
        </div>
        {loading ? <div className="text-gray-400">جاري التحميل...</div> : (
          <div className="grid md:grid-cols-2 gap-4">
            {news.map(n => (
              <div key={n.id} className="card p-6 relative">
                <button onClick={() => handleDelete(n.id)} className="absolute top-4 left-4 text-red-400 hover:text-red-300 p-1"><Trash2 size={18} /></button>
                <h3 className="text-white font-bold mb-2">{n.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{n.content}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${n.is_published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {n.is_published ? 'منشور' : 'مسودة'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box p-8 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 left-6 text-gray-400 hover:text-white"><X /></button>
            <h2 className="text-2xl font-bold text-white mb-6">إضافة خبر</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="text-gray-300 block mb-2">العنوان</label><input type="text" name="title" required className="input-field" /></div>
              <div><label className="text-gray-300 block mb-2">المحتوى</label><textarea name="content" required rows="4" className="input-field"></textarea></div>
              <div className="flex items-center gap-2"><input type="checkbox" name="is_published" id="pub" className="w-4 h-4" defaultChecked /><label htmlFor="pub" className="text-gray-300">نشر فوراً</label></div>
              <button type="submit" className="btn-primary w-full">حفظ</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
