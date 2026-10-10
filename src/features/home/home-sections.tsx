import { useState } from 'react'
import {
  Bell,
  CalendarDays,
  ChevronRight,
  CirclePlay,
  Headphones,
  Radio,
  UsersRound,
} from 'lucide-react'
import { A11y, Keyboard, Scrollbar } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/scrollbar'
import type {
  Channel,
  FeaturedStory,
  LiveStream,
  ScheduleItem,
} from './home-data'

type HeroContent = typeof import('./home-data').heroData

export function Hero({ data }: { data: HeroContent }) {
  return (
    <section className="relative isolate min-h-[650px] overflow-hidden bg-liveuta-first/20 sm:min-h-[430px] xl:min-h-[470px]">
      <picture className="absolute inset-0 -z-20 block size-full">
        <source media="(max-width: 767px)" srcSet="/landing/hero-mobile.webp" />
        <source media="(max-width: 1279px)" srcSet="/landing/hero-tablet.webp" />
        <img src="/landing/hero-desktop.webp" alt="" fetchPriority="high" className="size-full object-cover object-[62%_42%] max-[767px]:object-top" />
      </picture>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/90 to-background/10 sm:via-background/75" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background/95 via-background/10 to-transparent sm:from-background/80 sm:via-transparent" />
      <div className="mx-auto flex min-h-[650px] max-w-[1440px] flex-col justify-end px-5 py-8 sm:min-h-[430px] sm:justify-center sm:px-10 sm:py-10 xl:min-h-[470px] xl:px-12">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-bold tracking-[0.22em] text-primary sm:text-sm">{data.eyebrow}</p>
          <h1 className="text-4xl leading-[1.18] font-black tracking-[-0.06em] text-foreground sm:text-5xl xl:text-[3.8rem]">
            {data.title[0]}<br />
            <span className="text-primary">{data.title[1]}</span>
          </h1>
          <p className="mt-4 text-sm font-medium text-foreground/80 sm:text-base">{data.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href="#live" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground no-underline shadow-md shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-lg">
              <CirclePlay className="size-4" /> 지금 라이브 보기 <span aria-hidden="true">→</span>
            </a>
            <a href="#schedule" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-background/85 px-5 text-sm font-bold text-foreground no-underline backdrop-blur transition hover:bg-background">
              <CalendarDays className="size-4 text-primary" /> 오늘의 스케줄 보기
            </a>
          </div>
        </div>
        <div className="mt-8 flex max-w-xl items-center divide-x divide-border/70">
          {data.stats.map((stat) => {
            const Icon = stat.icon === 'radio' ? Radio : stat.icon === 'calendar' ? CalendarDays : UsersRound
            return <div className="flex flex-1 items-center gap-2 px-3 first:pl-0" key={stat.label}>
              <Icon className="size-5 shrink-0 text-primary" />
              <div><p className="m-0 text-[11px] text-muted-foreground">{stat.label}</p><p className="m-0 text-base font-extrabold tabular-nums">{stat.value}</p></div>
            </div>
          })}
        </div>
        <span className="absolute right-4 bottom-3 rounded-full bg-background/70 px-2 py-1 text-[10px] font-medium text-muted-foreground backdrop-blur">데모 콘텐츠</span>
      </div>
    </section>
  )
}

export function SectionHeading({ icon, title, href }: { icon: 'radio' | 'feature' | 'schedule' | 'channels'; title: string; href?: string }) {
  const Icon = icon === 'radio' ? Radio : icon === 'schedule' ? CalendarDays : icon === 'channels' ? UsersRound : Headphones
  return <div className="mb-4 flex min-h-8 items-center gap-2">
    <Icon className="size-5 text-primary" strokeWidth={2.5} />
    <h2 className="m-0 text-lg font-extrabold tracking-tight sm:text-xl">{title}</h2>
    {icon === 'feature' && <span aria-hidden="true" className="h-6 w-12 bg-primary [mask:url('/landing/decoration-sparkles.svg')_center/contain_no-repeat]" />}
    {href && <a href={href} className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground no-underline hover:text-primary">전체 보기 <ChevronRight className="size-4" /></a>}
  </div>
}

export function LiveSection({ streams, categories }: { streams: LiveStream[]; categories: string[] }) {
  const [selected, setSelected] = useState('전체')
  const filtered = selected === '전체' ? streams : streams.filter((stream) => stream.category === selected)
  return <section id="live" className="scroll-mt-24">
    <span aria-hidden="true" className="mb-2 block h-5 w-24 bg-primary/70 [mask:url('/landing/decoration-equalizer.svg')_center/contain_no-repeat]" />
    <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
      <SectionHeading icon="radio" title="지금 라이브 중" href="#live-list" />
      <div className="-mt-3 flex max-w-full gap-1 overflow-x-auto pb-1 sm:ml-auto sm:-mt-3" aria-label="방송 카테고리">
        {categories.map((category) => <button key={category} type="button" onClick={() => setSelected(category)} aria-pressed={selected === category} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${selected === category ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}>{category}</button>)}
      </div>
    </div>
    {filtered.length ? <div id="live-list" role="region" aria-label="라이브 방송 목록" className="-mx-5 px-5 sm:mx-0 sm:px-0">
      <Swiper
        modules={[A11y, Keyboard, Scrollbar]}
        className="home-swiper"
        slidesPerView={1.35}
        spaceBetween={12}
        grabCursor
        watchOverflow
        scrollbar={{ draggable: true, hide: false }}
        keyboard={{ enabled: true, onlyInViewport: true }}
        a11y={{ enabled: true, containerMessage: '라이브 방송 목록', slideLabelMessage: '{{index}} / {{slidesLength}}' }}
        breakpoints={{
          480: { slidesPerView: 2.15, spaceBetween: 12 },
          640: { slidesPerView: 3.15, spaceBetween: 14 },
          1024: { slidesPerView: 3.2, spaceBetween: 16 },
          1280: { slidesPerView: 5.25, spaceBetween: 14 },
        }}
      >
        {filtered.map((stream) => <SwiperSlide key={stream.id} className="h-auto"><LiveStreamItem stream={stream} /></SwiperSlide>)}
      </Swiper>
    </div> : <p className="py-8 text-center text-sm text-muted-foreground">현재 이 카테고리의 방송이 없습니다.</p>}
  </section>
}

function LiveStreamItem({ stream }: { stream: LiveStream }) {
  return <article className="h-full min-w-0">
    <a href="#schedule" className="group block text-foreground no-underline">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
        <img src={stream.thumbnail} alt={`${stream.channel} 방송 썸네일`} loading="lazy" className="size-full object-cover transition duration-300 group-hover:scale-[1.03]" />
        <span className="absolute top-2 left-2 rounded bg-primary px-2 py-1 text-[10px] leading-none font-extrabold text-primary-foreground">LIVE</span>
        <span className="absolute right-2 bottom-2 rounded bg-black/75 px-1.5 py-1 text-[10px] font-semibold text-white">{stream.duration}</span>
        <span className="absolute bottom-2 left-2 rounded bg-black/65 px-1.5 py-1 text-[10px] font-semibold text-white">◉ {stream.viewers}</span>
      </div>
      <div className="mt-2 flex gap-2">
        <img src={stream.avatar} alt="" loading="lazy" className="size-8 shrink-0 rounded-full object-cover" />
        <div className="min-w-0"><h3 className="m-0 truncate text-xs font-bold group-hover:text-primary">{stream.title}</h3><p className="mt-1 mb-0 truncate text-[11px] text-muted-foreground">{stream.channel}</p></div>
      </div>
    </a>
  </article>
}

export function FeaturedSection({ stories }: { stories: FeaturedStory[] }) {
  if (!stories.length) return null
  return <section>
    <SectionHeading icon="feature" title="이번 주 특집" href="#featured" />
    <div id="featured" className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:grid-rows-2">
      {stories.slice(0, 5).map((story, index) => <a key={story.id} href="#live" className={`group relative isolate min-h-28 overflow-hidden bg-muted text-white no-underline sm:min-h-32 ${index === 0 ? 'col-span-2 row-span-2 min-h-56 sm:min-h-[17rem]' : ''}`}>
        <img src={story.image} alt="" loading="lazy" className="absolute inset-0 -z-20 size-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4"><p className="m-0 text-sm font-extrabold leading-tight sm:text-base">{story.title}</p><p className="mt-1 mb-0 text-[10px] text-white/75 sm:text-xs">{story.subtitle}</p></div>
      </a>)}
    </div>
  </section>
}

export function ScheduleSection({ items }: { items: ScheduleItem[] }) {
  const [filter, setFilter] = useState('전체')
  const visible = filter === '30분 이내' ? items.slice(0, 2) : items
  return <section id="schedule" className="scroll-mt-24">
    <SectionHeading icon="schedule" title="곧 시작하는 방송" href="#schedule-list" />
    <div className="mb-2 flex gap-1" role="group" aria-label="스케줄 범위">
      {['전체', '30분 이내', '오늘', '내일'].map((option) => <button key={option} onClick={() => setFilter(option)} aria-pressed={filter === option} className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${filter === option ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{option}</button>)}
    </div>
    <div id="schedule-list" className="divide-y divide-border/70 border-y border-border/70">
      {visible.map((item) => <ScheduleRow key={item.id} item={item} />)}
    </div>
  </section>
}

function ScheduleRow({ item }: { item: ScheduleItem }) {
  const [reminded, setReminded] = useState(false)
  return <div className="flex min-h-[62px] items-center gap-2 py-2 sm:gap-3">
    <time className="w-11 shrink-0 text-xs font-bold tabular-nums">{item.time}</time>
    <img src={item.avatar} alt="" className="size-9 shrink-0 rounded-full object-cover" loading="lazy" />
    <div className="min-w-0 flex-1"><p className="m-0 truncate text-xs font-bold">{item.channel}</p><p className="m-0 truncate text-[11px] text-muted-foreground">{item.title}</p></div>
    <button type="button" onClick={() => setReminded(!reminded)} aria-label={`${item.channel} 알림 ${reminded ? '해제' : '설정'}`} aria-pressed={reminded} className={`grid size-8 shrink-0 place-items-center rounded-full transition ${reminded ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-primary'}`}><Bell className="size-4" /></button>
  </div>
}

export function ChannelsSection({ channels }: { channels: Channel[] }) {
  return <section>
    <SectionHeading icon="channels" title="새로 추가된 채널" href="#channels" />
    <div id="channels" role="region" aria-label="새로 추가된 채널 목록" className="-mx-5 px-5 sm:mx-0 sm:px-0">
      <Swiper
        modules={[A11y, Keyboard, Scrollbar]}
        className="home-swiper"
        slidesPerView={4.4}
        spaceBetween={12}
        grabCursor
        watchOverflow
        scrollbar={{ draggable: true, hide: false }}
        keyboard={{ enabled: true, onlyInViewport: true }}
        a11y={{ enabled: true, containerMessage: '새로 추가된 채널 목록', slideLabelMessage: '{{index}} / {{slidesLength}}' }}
        breakpoints={{
          480: { slidesPerView: 5.15, spaceBetween: 14 },
          640: { slidesPerView: 6.2, spaceBetween: 16 },
          1024: { slidesPerView: 6.25, spaceBetween: 20 },
          1280: { slidesPerView: 7.2, spaceBetween: 24 },
        }}
      >
      {channels.map((channel) => <SwiperSlide key={channel.id} className="h-auto"><a href="#channels" className="block text-center text-foreground no-underline">
        <img src={channel.avatar} alt="" loading="lazy" className="mx-auto size-14 rounded-full object-cover ring-2 ring-background outline outline-1 outline-border transition hover:outline-primary" />
        <p className="mt-2 mb-0 truncate text-[11px] font-bold">{channel.name}</p><p className="mt-0.5 mb-0 text-[10px] text-muted-foreground">{channel.group}</p>
      </a></SwiperSlide>)}
      </Swiper>
    </div>
  </section>
}
