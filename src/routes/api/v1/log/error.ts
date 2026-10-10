import '@tanstack/react-start'
import { createFileRoute } from '@tanstack/react-router'
import { apiError, getClientAddress, isRateLimited, jsonResponse } from '@/server/http/api-response.server'

const MAX_BODY_BYTES = 8 * 1024
const MESSAGE_LIMIT = 2_000
const STACK_LIMIT = 6_000

export const Route = createFileRoute('/api/v1/log/error')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (isRateLimited(`error-log:${getClientAddress(request)}`, 120, 60_000)) {
          return apiError('Too many requests', 429)
        }

        const declaredLength = Number(request.headers.get('content-length') ?? 0)
        if (declaredLength > MAX_BODY_BYTES) return apiError('Request body is too large', 413)

        let text: string
        try {
          text = await request.text()
        } catch {
          return apiError('Invalid request body', 400)
        }
        if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
          return apiError('Request body is too large', 413)
        }

        let body: unknown
        try {
          body = JSON.parse(text)
        } catch {
          return apiError('Invalid JSON body', 400)
        }

        if (!body || typeof body !== 'object' || Array.isArray(body)) {
          return apiError('Invalid error payload', 400)
        }

        const payload = body as Record<string, unknown>
        if (
          typeof payload.message !== 'string' ||
          payload.message.length === 0 ||
          payload.message.length > MESSAGE_LIMIT ||
          (payload.stack !== undefined &&
            (typeof payload.stack !== 'string' || payload.stack.length > STACK_LIMIT)) ||
          (payload.digest !== undefined &&
            (typeof payload.digest !== 'string' || payload.digest.length > 256))
        ) {
          return apiError('Invalid error payload', 400)
        }

        // Do not store or emit client stack traces, which may contain private data.
        console.error('Front 500 Error', payload.message.replace(/[\r\n\t]/g, ' ').slice(0, MESSAGE_LIMIT))
        return jsonResponse({ message: 'ok', data: null })
      },
    },
  },
})
