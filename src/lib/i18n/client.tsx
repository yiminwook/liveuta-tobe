import { useLocation } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation as useTranslationClient } from 'react-i18next';
import { FALLBACK_LANG, LANGUAGES } from './config';
import { i18next } from './i18next';

const runsOnServerSide = typeof window === 'undefined';

export function useTranslations(options?: Parameters<typeof useTranslationClient>[1]) {
  const locale = useLocale();
  const [activeLng, setActiveLng] = useState(i18next.resolvedLanguage);

  useEffect(() => {
    if (activeLng === i18next.resolvedLanguage) return;
    setActiveLng(() => i18next.resolvedLanguage);
  }, [activeLng]);

  useEffect(() => {
    if (!locale || i18next.resolvedLanguage === locale) return;
    i18next.changeLanguage(locale);
  }, [locale]);

  if (runsOnServerSide && i18next.resolvedLanguage !== locale) {
    i18next.changeLanguage(locale);
  }

  return useTranslationClient(undefined, options);
}

export const useLocale = () => {
  const { pathname } = useLocation();
  const firstSegment = pathname.split('/')[1];

  return LANGUAGES.find((locale) => locale === firstSegment) ?? FALLBACK_LANG;
};

export const usePathname = () => {
  const { pathname } = useLocation();
  const locale = useLocale();
  const localePrefix = `/${locale}`;

  if (pathname === localePrefix) return '';

  return pathname.startsWith(`${localePrefix}/`)
    ? pathname.slice(localePrefix.length)
    : pathname;
};
