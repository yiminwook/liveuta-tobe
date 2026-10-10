import { VirtuosoGrid, type VirtuosoGridProps } from 'react-virtuoso'
import { format } from 'date-fns'
import { CalendarDays, Check, ClipboardCopy, Radio, Search } from 'lucide-react'
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { ScheduleItem } from './schedule-types'
import type { TEndpointChannel } from '@/lib/endpoint/type'

type ScheduleFilter = 'scheduled' | 'live' | 'daily' | 'all'
type VideoType = 'all' | 'stream' | 'video'

const scheduleGridComponents: VirtuosoGridProps<ScheduleItem, { isLoadingMore: boolean; hasMore: boolean }>['components'] = {
  List: forwardRef(({ style, children, ...props }, ref) => (
    <div ref={ref} {...props} style={{ ...style, display: 'grid' }}>{children}</div>
  )),
  Item: ({ style, children, ...props }) => (
    <div {...props} style={{ ...style, display: 'flex', minWidth: 0, width: '100%', boxSizing: 'border-box' }}>{children}</div>
  ),
  Footer: ({ context }) => <div className="col-span-full grid min-h-12 place-items-center text-sm text-muted-foreground" aria-live="polite">{context?.isLoadingMore ? '일정을 더 불러오는 중…' : context?.hasMore ? '' : '모든 일정을 불러왔습니다'}</div>,
}

export function SchedulePage({
  items,
  channels,
  filter,
  query,
  videoType,
}: {
  items: ScheduleItem[]
  channels: TEndpointChannel[]
  filter: ScheduleFilter
  query: string
  videoType: VideoType
}) {
  const navigate = useNavigate({ from: '/{-$locale}/schedule' })
  const [search, setSearch] = useState(query)
  const [shownCount, setShownCount] = useState(24)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [now] = useState(() => Date.now())
  const loadTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const channelNames = useMemo(
    () => new Map(channels.map((channel) => [channel.channel_id, channel.names.join(' ')])),
    [channels],
  )
  const filtered = useMemo(() => {
    const matcher = query.trim().toLocaleLowerCase()
    return items.filter((item) => {
      let status = item.broadcastStatus
      if (item.isHide && status === 'NULL') status = 'FALSE'
      if (filter === 'scheduled' && status !== 'TRUE' && status !== 'NULL') return false
      if (filter === 'live' && status !== 'TRUE') return false
      if (filter === 'daily' && new Date(item.scheduledTime).getTime() < now - 86_400_000) return false
      if (videoType === 'stream' && item.isVideo) return false
      if (videoType === 'video' && !item.isVideo) return false
      if (matcher && !`${channelNames.get(item.channelId) ?? item.channelName} ${item.title}`.toLocaleLowerCase().includes(matcher)) return false
      return true
    })
  }, [channelNames, filter, items, now, query, videoType])

  useEffect(() => {
    setShownCount(24)
    setIsLoadingMore(false)
  }, [filtered])

  useEffect(() => setSearch(query), [query])

  useEffect(() => () => clearTimeout(loadTimer.current), [])

  const loadMore = () => {
    if (isLoadingMore || shownCount >= filtered.length) return
    setIsLoadingMore(true)
    loadTimer.current = setTimeout(() => {
      setShownCount((count) => Math.min(count + 24, filtered.length))
      setIsLoadingMore(false)
    }, 500)
  }

  const updateSearch = (patch: Partial<{ t: ScheduleFilter; q: string; select: VideoType }>) => {
    void navigate({
      search: (previous) => ({
        ...previous,
        ...(patch.t ? { t: patch.t === 'scheduled' ? undefined : patch.t } : {}),
        ...(patch.q !== undefined ? { q: patch.q || undefined } : {}),
        ...(patch.select ? { select: patch.select === 'all' ? undefined : patch.select } : {}),
      }),
    })
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 pb-16 pt-6 sm:px-6 lg:px-10">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-primary"><CalendarDays className="size-4" /> LIVEUTA SCHEDULE</p>
          <h1 className="m-0 text-2xl font-black tracking-tight text-foreground sm:text-3xl">방송 스케줄</h1>
          <p className="mb-0 mt-2 text-sm text-muted-foreground">방송 예정과 진행 중인 라이브를 확인하세요.</p>
        </div>
        <p className="m-0 text-sm font-semibold text-muted-foreground" aria-live="polite">{filtered.length.toLocaleString()}개 일정</p>
      </header>

      <section aria-label="스케줄 필터" className="mb-5 flex flex-col gap-3 rounded-xl border border-border/70 bg-card/70 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1" role="group" aria-label="방송 범위">
          {([
            ['scheduled', '예정'], ['live', '라이브'], ['daily', '24시간'], ['all', '전체'],
          ] as const).map(([value, label]) => (
            <button key={value} type="button" aria-pressed={filter === value} onClick={() => updateSearch({ t: value })} className={`min-h-10 rounded-control px-4 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${filter === value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <form className="flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-control border border-border bg-background px-3 sm:min-w-56" onSubmit={(event) => { event.preventDefault(); updateSearch({ q: search.trim() }) }}>
            <Search aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
            <input aria-label="채널 또는 방송 검색" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="채널 또는 방송 검색" className="h-10 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground" />
            <button type="submit" className="rounded px-2 py-1 text-xs font-bold text-primary hover:bg-muted">검색</button>
          </form>
          <label className="flex min-h-10 items-center gap-2 rounded-control border border-border bg-background px-3 text-sm text-foreground">
            <span className="sr-only">영상 종류</span>
            <select aria-label="영상 종류" value={videoType} onChange={(event) => updateSearch({ select: event.target.value as VideoType })} className="h-10 bg-transparent text-sm outline-none">
              <option value="all">전체 종류</option><option value="stream">방송</option><option value="video">영상</option>
            </select>
          </label>
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="grid min-h-64 place-items-center rounded-xl border border-dashed border-border p-8 text-center">
          <div><p className="mb-2 text-lg font-bold text-foreground">일정이 없습니다</p><p className="mb-4 text-sm text-muted-foreground">검색 조건을 바꾸거나 채널 목록에서 채널을 찾아보세요.</p><a href="/channel" className="inline-flex min-h-10 items-center rounded-control bg-primary px-4 text-sm font-bold text-primary-foreground no-underline">채널 검색</a></div>
        </div>
      ) : (
        <VirtuosoGrid
          useWindowScroll
          data={filtered.slice(0, shownCount)}
          initialItemCount={Math.min(filtered.length, 12)}
          context={{ isLoadingMore, hasMore: shownCount < filtered.length }}
          endReached={loadMore}
          components={scheduleGridComponents}
          listClassName="grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5"
          itemClassName="min-w-0"
          itemContent={(_index, item) => <ScheduleCard item={item} channelName={channelNames.get(item.channelId) ?? item.channelName} />}
        />
      )}
    </main>
  )
}

function ScheduleCard({ item, channelName }: { item: ScheduleItem; channelName: string }) {
  const [copied, setCopied] = useState(false)
  const live = item.broadcastStatus === 'TRUE'
  const image = item.thumbnailUrl || `https://i.ytimg.com/vi/${encodeURIComponent(item.videoId)}/mqdefault.jpg`
  const href = `https://www.youtube.com/watch?v=${encodeURIComponent(item.videoId)}`
  const scheduled = new Date(item.scheduledTime)
  const time = Number.isNaN(scheduled.getTime()) ? item.scheduledTime : format(scheduled, 'MM/dd HH:mm')
  return (
    <article className={`h-full overflow-hidden rounded-xl border border-border/70 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${live ? 'bg-liveuta-schedule-stream' : 'bg-card'}`}>
      <a href={href} target="_blank" rel="noreferrer" className="group block text-foreground no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img src={image} alt="" loading="lazy" className="size-full object-cover transition duration-300 group-hover:scale-[1.03]" />
          <span className={`absolute left-2 top-2 rounded px-2 py-1 text-xs font-bold ${live ? 'bg-liveuta-schedule-stream-text text-white' : 'bg-background/90 text-foreground'}`}>{live ? 'LIVE' : item.isVideo ? '영상' : '예정'}</span>
          {live && <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-black/75 px-2 py-1 text-xs font-semibold text-white"><Radio className="size-3" />{item.viewer.toLocaleString()}</span>}
        </div>
        <div className="p-3">
          <p className="mb-1 truncate text-xs font-bold text-primary">{channelName || item.channelName || '채널 정보 없음'}</p>
          <h2 className="mb-3 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-foreground">{item.title}</h2>
          <p className="m-0 text-xs font-semibold text-muted-foreground">{time}</p>
        </div>
      </a>
      <div className="flex justify-end px-3 pb-3">
        <button
          type="button"
          aria-label="방송 링크 복사"
          title="방송 링크 복사"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(href)
              setCopied(true)
              window.setTimeout(() => setCopied(false), 1500)
            } catch {
              setCopied(false)
            }
          }}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-control px-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {copied ? <Check className="size-3.5" /> : <ClipboardCopy className="size-3.5" />}
          {copied ? '복사됨' : '링크 복사'}
        </button>
      </div>
    </article>
  )
}
