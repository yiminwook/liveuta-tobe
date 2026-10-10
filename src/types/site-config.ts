import { type TLocaleCode } from '@/lib/i18n/type';

export type Locale = {
  code: TLocaleCode;
  name: string;
};

export type SiteConfig = {
  defaultLocale: TLocaleCode;
  locales: Locale[];
  defaultUseAutoSync: boolean;
  defaultRefreshInterval: number;
  refreshIntervalOptions: number[];
};
