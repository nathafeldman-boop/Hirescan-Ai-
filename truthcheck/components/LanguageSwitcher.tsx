'use client';

import { useLang } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
      className="text-xs font-bold text-zinc-500 hover:text-white transition-colors px-2 py-1 rounded-lg border border-white/10 hover:border-white/20"
      aria-label="Change language"
    >
      {lang === 'fr' ? 'EN' : 'FR'}
    </button>
  );
}
