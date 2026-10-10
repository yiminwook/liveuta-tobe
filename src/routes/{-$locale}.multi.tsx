import { createFileRoute } from '@tanstack/react-router'
import { EmptyRoutePage } from '@/features/placeholder/empty-route-page'

export const Route = createFileRoute('/{-$locale}/multi')({
  component: () => <EmptyRoutePage titleKey="global.header.desktopNav.internalLinks.multiView" />,
})
