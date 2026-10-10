export interface ScheduleItem {
  videoId: string
  title: string
  channelName: string
  channelId: string
  isVideo: boolean
  scheduledTime: string
  thumbnailUrl: string
  broadcastStatus: 'TRUE' | 'FALSE' | 'NULL'
  isHide: boolean
  viewer: number
}

export interface ScheduleResponse {
  message: string
  data: ScheduleItem[]
}
