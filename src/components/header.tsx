import { Link } from '@tanstack/react-router'
import { Menu, Search } from 'lucide-react'
import ThemeToggle from './theme-toggle'

const navigation = [
  { label: '라이브', href: '#live' },
  { label: '스케줄', href: '#schedule' },
  { label: '채널', href: '#channels' },
  { label: '멀티뷰', href: '/about' },
  { label: '세트리스트', href: '/about' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 px-4 backdrop-blur-md">
      <nav aria-label="메인 내비게이션" className="mx-auto flex h-[62px] max-w-[1440px] items-center gap-4 sm:px-3">
        <Link to="/" className="flex shrink-0 items-center gap-2 text-foreground no-underline">
          <span className="grid size-8 place-items-center rounded-xl bg-primary text-sm font-black text-primary-foreground">♪</span>
          <span className="text-lg font-black tracking-tight">LiveUta</span>
        </Link>
        <div className="ml-4 hidden items-center gap-1 lg:flex">
          {navigation.map((item) => <a key={item.label} href={item.href} className="rounded-control px-3 py-2 text-xs font-semibold text-muted-foreground no-underline transition hover:bg-muted hover:text-foreground">{item.label}</a>)}
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <button aria-label="검색" className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"><Search className="size-4" /></button>
          <button aria-label="언어 선택" className="hidden h-9 items-center gap-1 rounded-full px-2 text-xs font-semibold text-muted-foreground hover:bg-muted sm:flex">◎ <span>KO</span></button>
          <ThemeToggle />
          <a href="/about" className="ml-1 hidden rounded-control bg-primary px-4 py-2 text-xs font-bold text-primary-foreground no-underline sm:inline-flex">로그인</a>
          <button aria-label="메뉴 열기" className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-muted lg:hidden"><Menu className="size-5" /></button>
        </div>
      </nav>
    </header>
  )
}
