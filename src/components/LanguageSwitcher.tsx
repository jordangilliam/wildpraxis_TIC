// Language Switcher Component
// Toggle between English and Spanish

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
      aria-label={`Switch to ${i18n.language === 'en' ? 'Spanish' : 'English'}`}
    >
      <Globe className="w-4 h-4" />
      <span>{i18n.language === 'en' ? 'ES' : 'EN'}</span>
    </Button>
  );
}

