// import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="space-x-4">
        <button onClick={() => changeLanguage('en')} className="hover:underline">
          en
        </button>
        <button onClick={() => changeLanguage('fi')} className="hover:underline">
          fi
        </button>
      </div>
      <div className="text-xl font-bold">
        {t('header')}
      </div>
      <nav className="space-x-4">
        <RouterLink to="/" className="hover:underline">
        {t('home')}
        </RouterLink>
        <RouterLink to="/board" className="hover:underline">
        {t('board')}
        </RouterLink>
        <RouterLink to="/logout" className="hover:underline">
        {t('logout')}
        </RouterLink>
      </nav>
    </header>
  );
}
