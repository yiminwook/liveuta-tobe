import { createFileRoute, Outlet } from '@tanstack/react-router'
import { InternalServerErrorPage } from '@/components/error-pages/internal-server-error-page'
import { NotFoundPage } from '@/components/error-pages/not-found-page'
import { FALLBACK_LANG, LANGUAGES } from '@/lib/i18n/config'
import type { TLocaleCode } from '@/lib/i18n/type'

export const Route = createFileRoute('/{-$locale}')({
  component: LocaleLayout,
  notFoundComponent: LocaleNotFoundPage,
  errorComponent: LocaleInternalServerErrorPage,
})

function LocaleLayout() {
  return <Outlet />
}

function LocaleNotFoundPage() {
  return <NotFoundPage locale={useRouteLocale()} />
}

function LocaleInternalServerErrorPage({
  reset,
}: {
  reset: () => void
}) {
  return (
    <InternalServerErrorPage
      locale={useRouteLocale()}
      onRetry={reset}
    />
  )
}

function useRouteLocale(): TLocaleCode {
  const { locale: routeLocale } = Route.useParams()
  return LANGUAGES.find((language) => language === routeLocale) ?? FALLBACK_LANG
}
