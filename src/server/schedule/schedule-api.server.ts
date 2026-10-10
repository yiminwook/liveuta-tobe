import '@tanstack/react-start/server-only'
import { serverAxios } from '@/lib/api/axios-server.server'
import type { TEndpointVideo } from '@/lib/endpoint/type'

export async function requestScheduleApi(): Promise<Response> {
  try {
    const { data: responseData } = await serverAxios.get<TEndpointVideo[]>('videos/all')

    const data = responseData.map((item) => ({
      videoId: item.VideoId,
      title: item.Title,
      channelName: item.ChannelName,
      channelId: item.ChannelId,
      isVideo: item.isVideo === 'TRUE',
      scheduledTime: item.ScheduledTime,
      thumbnailUrl: item.thumbnail_url,
      broadcastStatus: item.broadcastStatus,
      isHide: item.Hide === 'TRUE',
      viewer: item.concurrentViewers,
    }))
    return Response.json({ message: 'Schedule loaded', data }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[schedule-api] Schedule request failed', error instanceof Error ? { message: error.message } : {})
    return Response.json({ message: 'Schedule service is unavailable', data: null }, { status: 502 })
  }
}
