import { createFileRoute } from '@tanstack/react-router'
import {
  featuredStories,
  heroData,
  liveCategories,
  liveStreams,
  newChannels,
  scheduleItems,
} from '@/features/home/home-data'
import {
  ChannelsSection,
  FeaturedSection,
  Hero,
  LiveSection,
  ScheduleSection,
} from '@/features/home/home-sections'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <main className="w-full">
      <Hero data={heroData} />
      <div className="mx-auto max-w-[1440px] space-y-9 px-5 py-7 sm:px-8 sm:py-9 xl:px-10">
        <LiveSection streams={liveStreams} categories={liveCategories} />
        <div className="grid gap-9 lg:grid-cols-[minmax(0,1.75fr)_minmax(290px,0.85fr)] lg:gap-8">
          <FeaturedSection stories={featuredStories} />
          <ScheduleSection items={scheduleItems} />
        </div>
        <ChannelsSection channels={newChannels} />
      </div>
    </main>
  )
}
