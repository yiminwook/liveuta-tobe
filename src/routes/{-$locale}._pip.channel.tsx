import { createFileRoute } from '@tanstack/react-router'
import { EmptyRoutePage } from '@/features/placeholder/empty-route-page'

export const Route = createFileRoute('/{-$locale}/_pip/channel')({
  component: () => <EmptyRoutePage titleKey="global.header.desktopNav.internalLinks.channel" />,
})
