
import { useContext } from 'react';
import { I18nContext } from '@/contexts/i18nContext.jsx';

export const useLanguage = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
