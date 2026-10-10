import '@tanstack/react-start'
import { createFileRoute } from '@tanstack/react-router'
import { parseJsonBody, requestChannelApi } from '@/server/channel/channel-api.server'

export const Route = createFileRoute('/api/v1/channel/check-duplicates')({
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
          !Array.isArray((body as Record<string, unknown>).urls) ||
          !(body as { urls: unknown[] }).urls.every((url) => typeof url === 'string' && url.length <= 2048)
        ) {
          return Response.json({ message: 'Invalid request payload' }, { status: 400 })
        }
        return requestChannelApi('channels/check-duplicates', { method: 'POST', body })
      },
    },
  },
})
