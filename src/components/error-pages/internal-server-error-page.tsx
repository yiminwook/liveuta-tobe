import { useTranslation } from 'react-i18next'
import type { TLocaleCode } from '@/lib/i18n/type'

type InternalServerErrorPageProps = {
  locale: TLocaleCode
  onRetry: () => void
}

export function InternalServerErrorPage({
  locale,
  onRetry,
}: InternalServerErrorPageProps) {
  const { t } = useTranslation(undefined, { lng: locale })

  return (
    <main
      role="alert"
      className="mx-auto flex min-h-[50vh] w-full max-w-6xl flex-col items-center justify-center px-4 py-16 text-center"
    >
      <p className="mb-2 text-sm font-semibold tracking-wide text-primary uppercase">
        500
      </p>
      <h1 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
        {t('error.internalServerError.title')}
      </h1>
      <p className="mb-2 max-w-lg text-muted-foreground">
        {t('error.internalServerError.message1')}
      </p>
      <p className="mb-6 max-w-lg text-sm text-muted-foreground">
        {t('error.internalServerError.message2')}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-md bg-primary px-5 py-2.5 font-semibold text-primary-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {t('error.internalServerError.retry')}
      </button>
    </main>
  )
}
