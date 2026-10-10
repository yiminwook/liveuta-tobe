import '@tanstack/react-start'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: async () => Response.json({ message: 'Hello' }),
    },
  },
})
