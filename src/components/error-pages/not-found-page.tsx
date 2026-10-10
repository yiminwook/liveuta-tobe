import { useTranslation } from 'react-i18next'
import { Link } from '@/lib/i18n'
import type { TLocaleCode } from '@/lib/i18n/type'

type NotFoundPageProps = {
  locale: TLocaleCode
}

export function NotFoundPage({ locale }: NotFoundPageProps) {
  const { t } = useTranslation(undefined, { lng: locale })

  return (
    <main className="mx-auto flex min-h-[50vh] w-full max-w-6xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="mb-2 text-sm font-semibold tracking-wide text-primary uppercase">
        404
      </p>
      <h1 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
        {t('error.notFound.title')}
      </h1>
      <button
        type="button"
        onClick={() => window.history.back()}
        className="rounded-md bg-primary px-5 py-2.5 font-semibold text-primary-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {t('error.notFound.goBack')}
      </button>
      <Link locale={locale} to="/" className="mt-4 text-sm text-muted-foreground underline">
        {t('home.title')}
      </Link>
    </main>
  )
}
