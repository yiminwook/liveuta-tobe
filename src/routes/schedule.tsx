import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { clientAxios } from '@/lib/api/axios-client'
import type { TEndpointChannel } from '@/lib/endpoint/type'
import type { ScheduleResponse } from '@/features/schedule/schedule-types'
import { SchedulePage } from '@/features/schedule/schedule-page'

const scheduleSearchSchema = z.object({
  q: z.string().catch(''),
  t: z.enum(['scheduled', 'live', 'daily', 'all']).catch('scheduled'),
  select: z.enum(['all', 'stream', 'video']).catch('all'),
})

export const Route = createFileRoute('/schedule')({
  validateSearch: scheduleSearchSchema,
  loader: async () => {
    const apiUrl = (path: string) =>
      typeof window === 'undefined'
        ? new URL(path, import.meta.env.VITE_SITE_URL).toString()
        : path
    const [scheduleResponse, channelResponse] = await Promise.all([
      clientAxios.get<ScheduleResponse>(apiUrl('/api/v1/schedule')),
      clientAxios.get<TEndpointChannel[]>(apiUrl('/api/v1/channel')),
    ])
    return { items: scheduleResponse.data.data, channels: channelResponse.data }
  },
  component: ScheduleRoute,
  errorComponent: ScheduleError,
})

function ScheduleRoute() {
  const { items, channels } = Route.useLoaderData()
  const { q, t, select } = Route.useSearch()
  return <SchedulePage items={items} channels={channels} query={q} filter={t} videoType={select} />
}

function ScheduleError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto grid min-h-[55vh] max-w-xl content-center justify-items-center px-4 text-center">
      <h1 className="mb-2 text-2xl font-black text-foreground">?§Ï?Ï§ÑÏùÑ Î∂àÎü¨?§Ï? Î™ªÌñà?µÎãà??/h1>
      <p className="mb-5 text-sm text-muted-foreground">{error.message}</p>
      <button type="button" onClick={reset} className="min-h-11 rounded-control bg-primary px-5 font-bold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">?§Ïãú ?úÎèÑ</button>
    </main>
  )
}
