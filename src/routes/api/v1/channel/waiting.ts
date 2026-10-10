import '@tanstack/react-start'
import { createFileRoute } from '@tanstack/react-router'
import { requestChannelApi } from '@/server/channel/channel-api.server'

export const Route = createFileRoute('/api/v1/channel/waiting')({
  server: { handlers: { GET: () => requestChannelApi('channels/waiting') } },
})
