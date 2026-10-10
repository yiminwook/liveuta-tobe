import { type MetaDescriptor } from '@tanstack/react-router';

export const DEFAULT_SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:3000';
export const DEFAULT_TITLE = 'Live Uta';
export const DEFAULT_DESC = 'Show V-Tuber Utawaku schedule';
export const DEFAULT_ICON = `${DEFAULT_SITE_URL}/assets/icon-192-192.png`;
export const DEFAULT_IMAGE = {
  url: `${DEFAULT_SITE_URL}/assets/meta-image.png`,
  width: 1200,
  height: 627,
  alt: 'v-singer 일정조회 사이트 LiveUta입니다.',
  type: 'image/png',
};

export const DEFAULT_METADATA = {
  meta: [
    { title: DEFAULT_TITLE },
    { name: 'description', content: DEFAULT_DESC },
    { name: 'application-name', content: 'Live Uta' },
    { name: 'apple-mobile-web-app-title', content: DEFAULT_TITLE },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { property: 'og:title', content: DEFAULT_TITLE },
    { property: 'og:description', content: DEFAULT_DESC },
    { property: 'og:url', content: DEFAULT_SITE_URL },
    { property: 'og:site_name', content: DEFAULT_DESC },
    { property: 'og:locale', content: 'ko_KR' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: DEFAULT_IMAGE.url },
    { property: 'og:image:width', content: String(DEFAULT_IMAGE.width) },
    { property: 'og:image:height', content: String(DEFAULT_IMAGE.height) },
    { property: 'og:image:alt', content: DEFAULT_IMAGE.alt },
    { property: 'og:image:type', content: DEFAULT_IMAGE.type },
    { name: 'twitter:title', content: DEFAULT_TITLE },
    { name: 'twitter:description', content: DEFAULT_DESC },
    { name: 'twitter:image', content: DEFAULT_IMAGE.url },
    { name: 'twitter:image:alt', content: DEFAULT_IMAGE.alt },
    { name: 'twitter:card', content: 'summary' },
  ] satisfies MetaDescriptor[],
  links: [
    { rel: 'canonical', href: DEFAULT_SITE_URL },
    { rel: 'manifest', href: `${DEFAULT_SITE_URL}/manifest.json` },
  ],
};
