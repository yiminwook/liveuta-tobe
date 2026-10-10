import '@tanstack/react-start'
import { createFileRoute } from '@tanstack/react-router'
import { requestScheduleApi } from '@/server/schedule/schedule-api.server'

export const Route = createFileRoute('/api/v1/schedule')({
  server: { handlers: { GET: () => requestScheduleApi() } },
})
