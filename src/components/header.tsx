import { Link } from '@tanstack/react-router'
import { Menu, Search } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu'
import ThemeToggle from './theme-toggle'

const internalLinks = [
  { label: '홈', href: '/' },
  { label: '지원', href: '/support' },
  { label: '설정', href: '/setting' },
  { label: '스케줄', href: '/schedule' },
  { label: '채널', href: '/channel' },
  { label: '추천 채널', href: '/featured' },
  { label: '멀티뷰', href: '/multi' },
  { label: '세트리스트', href: '/setlist' },
  { label: '유틸리티', href: '/utils' },
  { label: '개발', href: '/dev' },
]

const externalLinks = [
  { label: '키즈나 아이 갤러리', href: 'https://gall.dcinside.com/mgallery/board/lists?id=kizunaai' },
  { label: '버튜버 갤러리', href: 'https://gall.dcinside.com/mini/board/lists?id=vuta' },
  { label: 'UTA Tools', href: 'https://uta-tools.vercel.app' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-[calc(3.5rem+env(safe-area-inset-top))] border-b border-border/50 bg-background/55 pt-[env(safe-area-inset-top)] shadow-[0_1px_2px_rgba(56,52,52,0.4)] backdrop-blur-[8px] transition-colors duration-500">
      <nav aria-label="메인 내비게이션" className="mx-auto flex h-14 max-w-[1440px] items-center gap-4 px-4 sm:px-6 xl:w-4/5">
        <Link to="/" className="flex shrink-0 items-center gap-2 text-foreground no-underline">
          <span className="grid size-8 place-items-center rounded-xl bg-primary text-sm font-black text-primary-foreground">♪</span>
          <span className="text-lg font-black tracking-tight">LiveUta</span>
        </Link>
        <div className="ml-4 hidden min-w-0 flex-1 items-center gap-3 md:flex">
          <NavigationMenu className="flex-none">
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 px-3 text-xs font-semibold text-muted-foreground">내부 링크</NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-48">
                  <ul className="m-0 grid list-none gap-1 p-1">
                    {internalLinks.map((item) => <li key={item.href}><NavigationMenuLink href={item.href} className="text-xs font-medium text-foreground no-underline">{item.label}</NavigationMenuLink></li>)}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 px-3 text-xs font-semibold text-muted-foreground">외부 링크</NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-48">
                  <ul className="m-0 grid list-none gap-1 p-1">
                    {externalLinks.map((item) => <li key={item.href}><NavigationMenuLink href={item.href} target="_blank" rel="noreferrer" className="text-xs font-medium text-foreground no-underline">{item.label}</NavigationMenuLink></li>)}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <button type="button" aria-label="검색 (⌘+K)" className="ml-auto flex h-9 min-w-40 items-center gap-2 rounded-control border border-border/70 bg-background/55 px-3 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <Search className="size-4 shrink-0" />
            <span>검색</span>
            <span className="ml-auto rounded-sm bg-muted px-1.5 py-0.5 text-[10px] leading-none">⌘+K</span>
          </button>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <button aria-label="언어 선택" className="hidden h-9 items-center gap-1 rounded-full px-2 text-xs font-semibold text-muted-foreground hover:bg-muted sm:flex">◎ <span>KO</span></button>
          <ThemeToggle />
          <a href="/about" className="ml-1 hidden rounded-control bg-primary px-4 py-2 text-xs font-bold text-primary-foreground no-underline sm:inline-flex">로그인</a>
          <button aria-label="메뉴 열기" className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted lg:hidden"><Menu className="size-5" /></button>
        </div>
      </nav>
    </header>
  )
}
