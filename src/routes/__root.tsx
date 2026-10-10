import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '../components/footer'
import Header from '../components/header'
import { loadChannelNames } from '@/lib/api/channel'

import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var theme=/^theme[1-5]$/.test(stored||'')?stored:'theme1';var dark=theme==='theme4'||theme==='theme5';var root=document.documentElement;root.setAttribute('color',theme);root.classList.toggle('dark',dark);root.classList.toggle('light',!dark);root.style.colorScheme=dark?'dark':'light';}catch(e){}})();`

export const Route = createRootRoute({
  loader: () => loadChannelNames(),
  notFoundComponent: NotFoundPage,
  head: ({ loaderData }) => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'keywords',
        content: loaderData?.slice(0, 100).join(', ') ?? '',
      },
      {
        title: 'LiveUta — 좋아하는 목소리가 오늘도 여기에서',
      },
      {
        name: 'description',
        content: '라이브 방송과 스케줄, 세트리스트를 한곳에서 만나는 LiveUta 음악 포털입니다.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[50vh] w-full max-w-6xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="mb-2 text-sm font-semibold tracking-wide text-primary uppercase">
        404
      </p>
      <h1 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mb-6 max-w-lg text-muted-foreground">
        요청하신 페이지가 이동되었거나 주소가 올바르지 않습니다.
      </p>
      <Link
        to="/"
        className="rounded-md bg-primary px-5 py-2.5 font-semibold text-primary-foreground no-underline hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        홈으로 이동
      </Link>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <Header />
        {children}
        <Footer />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
