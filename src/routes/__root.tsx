import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Footer from '../components/footer'
import Header from '../components/header'
import { InternalServerErrorPage } from '@/components/error-pages/internal-server-error-page'
import { NotFoundPage } from '@/components/error-pages/not-found-page'
import { loadChannelNames } from '@/lib/api/channel'
import { useLocale } from '@/lib/i18n/client'

import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var theme=/^theme[1-5]$/.test(stored||'')?stored:'theme1';var dark=theme==='theme4'||theme==='theme5';var root=document.documentElement;root.setAttribute('color',theme);root.classList.toggle('dark',dark);root.classList.toggle('light',!dark);root.style.colorScheme=dark?'dark':'light';}catch(e){}})();`

export const Route = createRootRoute({
  loader: () => loadChannelNames(),
  notFoundComponent: () => <NotFoundPage locale="ko" />,
  errorComponent: ({ reset }) => (
    <InternalServerErrorPage locale="ko" onRetry={reset} />
  ),
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
        href: 'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const locale = useLocale()

  return (
    <html lang={locale} suppressHydrationWarning>
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
