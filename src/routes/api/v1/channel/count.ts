import '@tanstack/react-start'
import { createFileRoute } from '@tanstack/react-router'
import { requestChannelApi } from '@/server/channel/channel-api.server'

export const Route = createFileRoute('/api/v1/channel/count')({
  server: { handlers: { GET: () => requestChannelApi('channels/count') } },
})
