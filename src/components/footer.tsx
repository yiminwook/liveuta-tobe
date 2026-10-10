export default function Footer() {
  return (
    <footer className="border-t border-border/70 px-5 py-8 text-muted-foreground">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p className="m-0 text-xs">© {new Date().getFullYear()} LiveUta. 좋아하는 목소리를 만나는 곳.</p>
        <p className="m-0 text-[11px]">화면에 표시된 방송과 수치는 데모 콘텐츠입니다.</p>
      </div>
    </footer>
  )
}
