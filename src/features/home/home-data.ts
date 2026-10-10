export type LiveStream = {
  id: string
  title: string
  channel: string
  avatar: string
  thumbnail: string
  viewers: string
  duration: string
  category: string
}

export type ScheduleItem = {
  id: string
  time: string
  title: string
  channel: string
  avatar: string
}

export type FeaturedStory = {
  id: string
  title: string
  subtitle: string
  image: string
}

export type Channel = {
  id: string
  name: string
  group: string
  avatar: string
}

const photo = (id: string, width = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

export const heroData = {
  eyebrow: 'LIVEUTA MUSIC PORTAL',
  title: ['좋아하는 목소리가', '오늘도 여기에서.'],
  description: '라이브와 스케줄, 세트리스트를 한곳에서 만나보세요.',
  image: photo('photo-1516280440614-37939bbacd81', 1800),
  stats: [
    { label: '지금 방송 중', value: '124', icon: 'radio' },
    { label: '오늘 예정', value: '357', icon: 'calendar' },
    { label: '등록 채널', value: '1,842', icon: 'users' },
  ],
}

export const liveCategories = ['전체', '한국', '일본', '영어권', '노래', '게임', '잡담']

export const liveStreams: LiveStream[] = [
  { id: 'live-1', title: '밤을 물들이는 노래들', channel: '하늘 유리', avatar: photo('photo-1534528741775-53994a69daeb', 160), thumbnail: photo('photo-1516280440614-37939bbacd81'), viewers: '8.4천', duration: '02:12:34', category: '노래' },
  { id: 'live-2', title: '오늘도 같이 놀자!', channel: '모모 하루', avatar: photo('photo-1524504388940-b1c1722653e1', 160), thumbnail: photo('photo-1493225457124-a3eb161ffa5f'), viewers: '6.1천', duration: '01:45:20', category: '한국' },
  { id: 'live-3', title: '시티팝 플레이리스트', channel: '나츠 키라', avatar: photo('photo-1529139574466-a303027c1d8b', 160), thumbnail: photo('photo-1516281717304-181e285c6e9b'), viewers: '4.3천', duration: '01:18:03', category: '일본' },
  { id: 'live-4', title: '새벽 감성 노래방', channel: '루나 별', avatar: photo('photo-1531123897727-8f129e1688ce', 160), thumbnail: photo('photo-1511379938547-c1f69419868d'), viewers: '3.9천', duration: '03:04:12', category: '영어권' },
  { id: 'live-5', title: '편안하게 듣는 신청곡', channel: '세라 온', avatar: photo('photo-1529626455594-4ff0802cf7e0', 160), thumbnail: photo('photo-1506157786151-b8491531f063'), viewers: '2.1천', duration: '55:10', category: '노래' },
  { id: 'live-6', title: '주말 밤 같이 게임해요', channel: '리리 아오', avatar: photo('photo-1517841905240-472988babdf9', 160), thumbnail: photo('photo-1492684223066-81342ee5ff30'), viewers: '1.8천', duration: '02:33:18', category: '게임' },
]

export const featuredStories: FeaturedStory[] = [
  { id: 'feature-1', title: '가을에 듣기 좋은 우타와꾸', subtitle: '계절의 온도를 담은 목소리', image: photo('photo-1470225620780-dba8ba36b745', 1200) },
  { id: 'feature-2', title: '주목할 신인', subtitle: '새로운 목소리를 만나보세요', image: photo('photo-1516280440614-37939bbacd81', 700) },
  { id: 'feature-3', title: '함께하는 특별한 밤', subtitle: '이번 주 콜라보 라이브', image: photo('photo-1506157786151-b8491531f063', 700) },
  { id: 'feature-4', title: '다시 듣는 명곡', subtitle: '마음에 남는 라이브', image: photo('photo-1493225457124-a3eb161ffa5f', 700) },
  { id: 'feature-5', title: '새벽 감성', subtitle: '잠들기 전 플레이리스트', image: photo('photo-1511379938547-c1f69419868d', 700) },
]

export const scheduleItems: ScheduleItem[] = [
  { id: 'schedule-1', time: '20:00', title: '밤의 신청곡 같이 들어요', channel: '하늘 유리', avatar: liveStreams[0].avatar },
  { id: 'schedule-2', time: '20:30', title: '처음 만나는 시티팝', channel: '나츠 키라', avatar: liveStreams[2].avatar },
  { id: 'schedule-3', time: '21:00', title: '오늘도 즐거운 노래방', channel: '모모 하루', avatar: liveStreams[1].avatar },
  { id: 'schedule-4', time: '22:00', title: '새벽까지 편안한 잡담', channel: '루나 별', avatar: liveStreams[3].avatar },
  { id: 'schedule-5', time: '23:30', title: '잠들기 전 한 곡', channel: '세라 온', avatar: liveStreams[4].avatar },
]

export const newChannels: Channel[] = [
  { id: 'channel-1', name: '유키 미루', group: 'VSinger', avatar: photo('photo-1534528741775-53994a69daeb', 200) },
  { id: 'channel-2', name: '아오이', group: 'VSinger', avatar: photo('photo-1524504388940-b1c1722653e1', 200) },
  { id: 'channel-3', name: '하나 나나', group: 'JP', avatar: photo('photo-1529139574466-a303027c1d8b', 200) },
  { id: 'channel-4', name: '하루', group: 'JP', avatar: photo('photo-1531123897727-8f129e1688ce', 200) },
  { id: 'channel-5', name: '리리 아오', group: 'EN', avatar: photo('photo-1529626455594-4ff0802cf7e0', 200) },
  { id: 'channel-6', name: '카엘라', group: 'EN', avatar: photo('photo-1517841905240-472988babdf9', 200) },
  { id: 'channel-7', name: '시온 노벨라', group: 'EN', avatar: photo('photo-1508214751196-bcfd4ca60f91', 200) },
  { id: 'channel-8', name: '모모 하루', group: 'VSinger', avatar: photo('photo-1544005313-94ddf0286df2', 200) },
]
