import { useTranslations } from '@/lib/i18n/client'

type EmptyRoutePageProps = {
  titleKey: string
}

export function EmptyRoutePage({ titleKey }: EmptyRoutePageProps) {
  const { t } = useTranslations()

  return (
    <main className="mx-auto min-h-[50vh] w-full max-w-6xl px-4 py-12">
      <h1 className="m-0 text-3xl font-bold text-foreground">{t(titleKey)}</h1>
    </main>
  )
}
