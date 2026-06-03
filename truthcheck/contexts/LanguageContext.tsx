'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Lang = 'fr' | 'en';

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const Ctx = createContext<LangCtx>({ lang: 'fr', setLang: () => {} });

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  return document.cookie
    .split('; ')
    .find(r => r.startsWith(name + '='))
    ?.split('=')[1];
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value};max-age=${60 * 60 * 24 * 365};path=/;samesite=lax`;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('fr');

  useEffect(() => {
    const saved = getCookie('urs_lang') as Lang | undefined;
    if (saved === 'en' || saved === 'fr') setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    setCookie('urs_lang', l);
  };

  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
