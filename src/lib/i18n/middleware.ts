import { createMiddleware } from '@tanstack/react-start';
import { setResponseHeader } from '@tanstack/react-start/server';
import acceptLanguage from 'accept-language';
import { FALLBACK_LANG, LANGUAGES, LANG_COOKIE_NAME, LANG_HEADER_NAME } from './config';

acceptLanguage.languages([...LANGUAGES]);

const getCookieValue = (cookieHeader: string | null, name: string) => {
  const cookie = cookieHeader
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  if (!cookie) return undefined;

  try {
    return decodeURIComponent(cookie.slice(name.length + 1));
  } catch {
    return undefined;
  }
};

const getPathLanguage = (pathname: string) => {
  const firstSegment = pathname.split('/')[1];
  return LANGUAGES.find((locale) => locale === firstSegment);
};

const shouldSkipLocaleMiddleware = (pathname: string, handlerType: 'serverFn' | 'router') => {
  if (handlerType === 'serverFn') return true;

  return (
    pathname.includes('icon') ||
    pathname.includes('chrome') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/_tanstack/') ||
    pathname.startsWith('/assets/') ||
    pathname === '/favicon.ico' ||
    pathname === '/sw.js' ||
    pathname === '/site.webmanifest'
  );
};

export const i18nMiddleware = createMiddleware().server(
  async ({ next, request, pathname, handlerType }) => {
    if (shouldSkipLocaleMiddleware(pathname, handlerType)) {
      return next();
    }

    const url = new URL(request.url);
    const pathLanguage = getPathLanguage(url.pathname);
    const cookieLanguage = acceptLanguage.get(getCookieValue(request.headers.get('cookie'), LANG_COOKIE_NAME));
    const headerLanguage = acceptLanguage.get(request.headers.get('accept-language'));
    const language = pathLanguage ?? cookieLanguage ?? headerLanguage ?? FALLBACK_LANG;

    if (!pathLanguage) {
      url.pathname = `/${language}${url.pathname}`;
      return Response.redirect(url, 307);
    }

    setResponseHeader(LANG_HEADER_NAME, language);

    const referer = request.headers.get('referer');
    if (referer) {
      try {
        const refererLanguage = getPathLanguage(new URL(referer).pathname);
        if (refererLanguage) {
          setResponseHeader(
            'set-cookie',
            `${LANG_COOKIE_NAME}=${encodeURIComponent(refererLanguage)}; Path=/; SameSite=Lax`,
          );
        }
      } catch {
        // Ignore malformed Referer values.
      }
    }

    return next();
  },
);
