import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CalendarCheck, AlertTriangle, Image, MapPin, Bell, LayoutTemplate } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  const menu = [
    {
      name: isRtl ? 'المواعيد والطلبات' : 'Appointments & Requests',
      desc: isRtl ? 'إدارة وعرض السجلات' : 'Manage and update records',
      path: '/admin/appointments',
      icon: CalendarCheck,
      color: 'text-rose-400',
      bg: 'bg-rose-500/20'
    },
    {
      name: isRtl ? 'الشكاوى' : 'Citizen Complaints',
      desc: isRtl ? 'إدارة وعرض السجلات' : 'Review and resolve complaints',
      path: '/admin/complaints',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/20'
    },
    {
      name: isRtl ? 'الصور المتحركة (Carousel)' : 'Carousel Slides',
      desc: isRtl ? 'إدارة شرائح الصفحة الرئيسية' : 'Manage homepage banners',
      path: '/admin/carousel',
      icon: LayoutTemplate,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/20'
    },
    {
      name: isRtl ? 'إدارة المعرض' : 'Photo Gallery',
      desc: isRtl ? 'إدارة صور البلدة' : 'Manage gallery photos',
      path: '/admin/gallery',
      icon: Image,
      color: 'text-blue-400',
      bg: 'bg-blue-500/20'
    },
    {
      name: isRtl ? 'إدارة المواقع' : 'Locations Directory',
      desc: isRtl ? 'أماكن ومعالم البلدة' : 'Local guide & landmarks',
      path: '/admin/locations',
      icon: MapPin,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20'
    },
    {
      name: isRtl ? 'الأخبار والنشرات' : 'News & Announcements',
      desc: isRtl ? 'نشر وتعديل الأخبار' : 'Publish and manage news',
      path: '/admin/newsletters',
      icon: Bell,
      color: 'text-purple-400',
      bg: 'bg-purple-500/20'
    },
  ];

  return (
    <div className="py-12 bg-navy-900 min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-12 border-b border-white/10 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {isRtl ? 'لوحة تحكم الإدارة' : 'Admin Control Panel'}
            </h1>
            <p className="text-gray-400">
              {isRtl ? `مرحباً بك مجدداً، ${user?.name}` : `Welcome back, ${user?.name}`}
            </p>
          </div>
          <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded-full font-semibold border border-red-500/30 self-start sm:self-auto text-sm">
            {isRtl ? `صلاحيات: ${user?.role === 'admin' ? 'مدير نظام' : 'موظف'}` : `Role: ${user?.role === 'admin' ? 'Administrator' : 'Staff'}`}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menu.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                to={item.path}
                className="card p-6 flex items-center gap-6 hover:bg-navy-700 hover:-translate-y-1 transition-all duration-300 group border border-white/5 hover:border-white/20"
              >
                <div className={`${item.bg} ${item.color} p-4 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0`}>
                  <Icon size={26} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1 group-hover:text-gray-300">
                    {item.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
