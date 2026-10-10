import '@tanstack/react-start'
import { createFileRoute } from '@tanstack/react-router'
import { parseJsonBody, requestChannelApi } from '@/server/channel/channel-api.server'

export const Route = createFileRoute('/api/v1/channel/requests')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = await parseJsonBody(request)
        if (parsed.error) return parsed.error
        const body = parsed.value
        if (
          !body ||
          typeof body !== 'object' ||
          Array.isArray(body) ||
          !Array.isArray((body as Record<string, unknown>).channels) ||
          !(body as { channels: unknown[] }).channels.every((channel) => {
            if (!channel || typeof channel !== 'object' || Array.isArray(channel)) return false
            const item = channel as Record<string, unknown>
            return ['nameKor', 'channelId', 'handle'].every(
              (key) => typeof item[key] === 'string' && (item[key] as string).length <= 256,
            )
          })
        ) {
          return Response.json({ message: 'Invalid request payload' }, { status: 400 })
        }
        return requestChannelApi('channels/requests', { method: 'POST', body })
      },
    },
  },
})
