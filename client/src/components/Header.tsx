import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export default function Header() {
  const { i18n, t } = useTranslation();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        setHasToken(true);
    } else {
        setHasToken(false);
    }
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setHasToken(false);
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="flex space-x-4">
          <button
            className="text-white hover:text-gray-300"
            onClick={() => changeLanguage('en')}
          >
            EN
          </button>
          <button
            className="text-white hover:text-gray-300"
            onClick={() => changeLanguage('fi')}
          >
            FI
          </button>
        </div>
        <h1 className="text-xl font-bold">{t('header')}</h1>
        <nav className="flex space-x-4">
          <RouterLink to="/" className="text-white hover:text-gray-300">
            {t('home')}
          </RouterLink>
          <RouterLink to="/board" className="text-white hover:text-gray-300">
            {t('board')}
          </RouterLink>
          {hasToken ? (
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-300"
            >
              {t('logout')}
            </button>
          ) : (
            <RouterLink to="/login" className="text-white hover:text-gray-300">
              {t('login')}
            </RouterLink>
          )}
        </nav>
      </div>
    </header>
  );
}