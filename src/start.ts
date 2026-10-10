import { createStart } from '@tanstack/react-start';
import { i18nMiddleware } from './lib/i18n/middleware';

export const startInstance = createStart(() => ({
  requestMiddleware: [i18nMiddleware],
}));
