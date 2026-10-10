import { createFileRoute } from '@tanstack/react-router'
import { EmptyRoutePage } from '@/features/placeholder/empty-route-page'

export const Route = createFileRoute('/{-$locale}/_pip/utils')({
  component: () => <EmptyRoutePage titleKey="global.header.desktopNav.internalLinks.utils" />,
})
