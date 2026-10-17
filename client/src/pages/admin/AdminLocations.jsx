import { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, X, Upload, MapPin } from 'lucide-react';
import api from '../../api/axios';

const categoryLabels = {
  tourist: 'سياحة',
  restaurant: 'مطعم',
  health: 'صحة',
  education: 'تعليم',
  business: 'تجاري',
  service: 'خدماتي',
  other: 'أخرى',
};

const getLocationImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000';
  if (path.startsWith('/')) return `${base}${path}`;
  if (path.startsWith('locations/')) return `${base}/uploads/${path}`;
  return `${base}/uploads/locations/${path}`;
};

export default function AdminLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const fetchLocs = async () => {
    try {
      const res = await api.get('/locations');
      setLocations(res.data.data);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الموقع؟')) return;
    try {
      await api.delete(`/locations/${id}`);
      setLocations(prev => prev.filter(loc => loc.id !== id));
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً كمسؤول.');
      } else {
        alert(err.response?.data?.message || 'حدث خطأ أثناء محاولة حذف الموقع.');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData(e.target);
      await api.post('/locations', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      handleCloseModal();
      fetchLocs();
    } catch (err) {
      alert(err.response?.data?.message || 'فشل إضافة الموقع');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-navy-900 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">إدارة المواقع</h1>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={20} /> إضافة موقع
          </button>
        </div>

        {loading ? (
          <div className="text-gray-400">جاري التحميل...</div>
        ) : (
          <div className="space-y-4">
            {locations.length > 0 ? (
              locations.map(loc => (
                <div key={loc.id} className="card p-4 flex justify-between items-center gap-4 hover:border-white/20 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-navy-700 overflow-hidden flex-shrink-0 border border-white/10 flex items-center justify-center">
                      {loc.image_path ? (
                        <img
                          src={getLocationImageUrl(loc.image_path)}
                          alt={loc.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <MapPin className="text-gray-500" size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{loc.name}</h3>
                      <span className="inline-block bg-blue-500/20 text-blue-400 text-xs px-2.5 py-0.5 rounded-full mt-1">
                        {categoryLabels[loc.category] || loc.category || 'أخرى'}
                      </span>
                      {loc.address && (
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <MapPin size={12} className="text-gray-500" /> {loc.address}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(loc.id)}
                    className="text-red-400 hover:text-red-300 p-2.5 hover:bg-red-500/10 rounded-xl transition cursor-pointer"
                    title="حذف الموقع"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-12 card">لا توجد مواقع مسجلة حالياً</div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box p-8 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">إضافة موقع جديد</h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white transition p-1.5 hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-gray-300 block mb-2 font-medium">الاسم <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="مثال: مطعم الأصالة، حديقة البلدية..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-2 font-medium">التصنيف</label>
                <select name="category" className="input-field [&>option]:bg-navy-900">
                  <option value="tourist">سياحة</option>
                  <option value="restaurant">مطعم</option>
                  <option value="health">صحة</option>
                  <option value="education">تعليم</option>
                  <option value="business">تجاري</option>
                  <option value="service">خدماتي</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              {/* Photo Section */}
              <div>
                <label className="text-gray-300 block mb-2 font-medium">صورة الموقع</label>
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-white/20 h-44 group bg-navy-900">
                    <img src={imagePreview} alt="معاينة" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-2 left-2 bg-red-600/90 hover:bg-red-600 text-white p-1.5 rounded-full transition shadow-lg cursor-pointer"
                      title="إزالة الصورة"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-white/20 hover:border-blue-400 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition hover:bg-white/5 bg-navy-900/50">
                    <Upload className="text-blue-400 mb-2" size={32} />
                    <span className="text-sm text-gray-300 font-medium">اضغط لاختيار صورة</span>
                    <span className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP (بحد أقصى 10MB)</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      name="image"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="text-gray-300 block mb-2 font-medium">الوصف</label>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="نبذة عن الموقع والخدمات المقدمة..."
                  className="input-field resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 block mb-2 font-medium">العنوان</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="الشارع أو الحي..."
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-gray-300 block mb-2 font-medium">رقم الهاتف</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="مثال: 08/912300"
                    className="input-field"
                    dir="ltr"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
              >
                {submitting ? 'جاري الحفظ...' : 'حفظ الموقع'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
