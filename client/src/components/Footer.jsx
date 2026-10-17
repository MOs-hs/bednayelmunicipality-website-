import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-br from-navy-600 to-navy-900 text-white pt-16 pb-8 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-12 mb-12 relative z-10">
        <div>
          <h3 className="text-2xl font-bold text-blue-400 mb-6">{t('footer.municipalityName')}</h3>
          <p className="text-gray-400 leading-relaxed">{t('footer.description')}</p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-blue-400 mb-6">{t('footer.quickLinks')}</h3>
          <ul className="space-y-3">
            <li>
              <Link to="/services" className="text-gray-400 hover:text-blue-400 transition flex items-center gap-2">
                <span className="text-blue-400 rtl:rotate-180">→</span> {t('footer.services')}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-400 hover:text-blue-400 transition flex items-center gap-2">
                <span className="text-blue-400 rtl:rotate-180">→</span> {t('footer.contactUs')}
              </Link>
            </li>
            <li>
              <Link to="/locations" className="text-gray-400 hover:text-blue-400 transition flex items-center gap-2">
                <span className="text-blue-400 rtl:rotate-180">→</span> {t('footer.locations')}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold text-blue-400 mb-6">{t('footer.contactInfo')}</h3>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-center gap-3"><Phone className="text-blue-400" size={18} /> 08/912 300</li>
            <li className="flex items-center gap-3"><Mail className="text-blue-400" size={18} /> info@bednayelmunicipality.com</li>
            <li className="flex items-center gap-3"><MapPin className="text-blue-400" size={18} /> Bednayel, Lebanon</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm relative z-10">
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
