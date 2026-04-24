import React, { createContext, useState, useEffect } from 'react';
import { translations } from '@/lib/translations.js';

export const I18nContext = createContext();

const isSupportedLanguage = (value) => value === 'es' || value === 'en';

export const I18nProvider = ({ children, initialLanguage }) => {
  const [language, setLanguage] = useState(() => {
    if (isSupportedLanguage(initialLanguage)) {
      return initialLanguage;
    }

    const savedLang = localStorage.getItem('language');
    return isSupportedLanguage(savedLang) ? savedLang : 'es';
  });

  useEffect(() => {
    if (isSupportedLanguage(initialLanguage)) {
      setLanguage(initialLanguage);
    }
  }, [initialLanguage]);

  const updateLanguage = (nextLanguage) => {
    if (isSupportedLanguage(nextLanguage)) {
      setLanguage(nextLanguage);
    }
  };

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language === 'es' ? 'es' : 'en';
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key;
      }
    }
    return value;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: updateLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};
