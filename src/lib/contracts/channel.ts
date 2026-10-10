/** Public channel object returned by `/api/v1/channel`. */
export interface TEndpointChannel {
  channel_id: string
  name_kor: string
  channel_addr: string
  handle_name: string
  createdAt: string
  waiting: boolean
  alive: boolean
  names: string[]
  profile_picture_url: string
}
