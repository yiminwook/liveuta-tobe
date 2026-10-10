import { clientAxios } from '@/lib/api/axios-client'
import type { TEndpointChannel } from '@/lib/contracts/channel'

const CHANNEL_TTL_MS = 30 * 60 * 1000
let cachedChannels: { value: string[]; expiresAt: number } | undefined
let pendingChannels: Promise<string[]> | undefined
let cacheGeneration = 0

export function clearChannelCache(): void {
  cacheGeneration += 1
  cachedChannels = undefined
  pendingChannels = undefined
}

export async function loadChannelNames(): Promise<string[]> {
  if (cachedChannels && cachedChannels.expiresAt > Date.now()) return cachedChannels.value
  if (pendingChannels) return pendingChannels

  const generation = cacheGeneration
  const request = (async () => {
    try {
      const endpointUrl =
        typeof window === 'undefined'
          ? new URL('/api/v1/channel', import.meta.env.VITE_SITE_URL).toString()
          : '/api/v1/channel'
      const { data } = await clientAxios.get<TEndpointChannel[]>(endpointUrl)
      if (!Array.isArray(data)) throw new Error('Channel API returned an invalid channel list')

      const value = data.map((channel) => channel.names.join(', '))

      if (generation === cacheGeneration) {
        cachedChannels = { value, expiresAt: Date.now() + CHANNEL_TTL_MS }
      }
      return value
    } catch {
      return []
    }
  })()
  pendingChannels = request

  try {
    return await request
  } finally {
    if (pendingChannels === request) pendingChannels = undefined
  }
}
