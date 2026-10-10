---
name: tailwind-v4-styler
description: >
  Tailwind CSS v4 + Next.js App Router 전용 글로벌 스타일링 스킬.
  사용자가 "테마", "글로벌 스타일", "디자인 토큰", "색상 변수", "다크모드", "shadcn 커스텀",
  "@theme", "@layer", "CSS 변수", "base-ui", "로고 URL", "에셋 변수", "폰트 설정",
  "컴포넌트 스타일", "반응형", "min-width", "최소 너비" 등을 언급하거나
  globals.css / layout.tsx / document.tsx 수정을 요청할 때 반드시 이 스킬을 사용하라.
  스타일 변경 전 반드시 레이아웃 계층을 분석하여 부모→자식 영향도를 파악한 뒤 수정한다.
---

# Tailwind v4 글로벌 스타일링 스킬

## 0. 핵심 원칙

스타일을 **수정하기 전에** 반드시 레이아웃 계층을 분석한다.
어떤 부모가 어떤 자식에게 어떤 CSS 변수/클래스를 흘려보내는지 파악하지 않으면
의도치 않은 side effect가 발생한다.

---

## 1단계: 레이아웃 계층 분석 (수정 전 필수)

### 1-1. 레이아웃 파일 탐색

아래 순서로 파일을 읽어 계층 구조를 파악한다.

```
app/layout.tsx                    ← 루트 (html, body)
app/[locale]/layout.tsx           ← 로케일 (Document, ThemeProvider)
app/[locale]/[group]/layout.tsx   ← 그룹 (헤더, 네비게이션)
app/[locale]/[group]/[page]/page.tsx
```

각 레이아웃에서 확인할 항목:
- `body`에 붙은 className (min-w, overflow, font, 배경 등)
- `ThemeProvider` 설정 (attribute, defaultTheme, storageKey)
- CSS import 순서 (`globals.css` 위치)
- 고정(fixed/sticky) 요소가 차지하는 공간 (헤더 높이 → 자식 padding-top)
- `children`을 감싸는 래퍼 div의 클래스

### 1-2. globals.css 현황 파악

```
@theme inline { ... }   ← 디자인 토큰 → Tailwind 유틸리티 자동 생성
:root { ... }           ← CSS 변수 (라이트 테마)
.dark { ... }           ← CSS 변수 (다크 테마)
@layer base { ... }     ← 요소 기본 스타일
@layer utilities { ... }← 커스텀 유틸리티
@layer components { ... }← 재사용 컴포넌트 패턴
```

### 1-3. 영향도 맵 작성

분석 후 반드시 아래 형식으로 영향도를 정리하고 사용자에게 보여준다:

```
[영향도 맵]
body (document.tsx)
  ├── className: antialiased min-w-app overflow-x-auto
  ├── CSS vars 적용: --background, --foreground (via :root)
  └── ThemeProvider → .dark 클래스 토글
      └── [locale]/layout.tsx
          └── G4/layout.tsx
              ├── G4Header (fixed, height: --header-height)
              └── {children} → 헤더 높이만큼 padding-top 필요
```

---

## 2단계: globals.css 설계 원칙

### 2-1. 파일 구조 (순서 중요)

```css
/* 1. 패키지 import */
@import "tailwindcss";
@import "tw-animate-css";

/* 2. 커스텀 variant */
@custom-variant dark (&:is(.dark *));

/* 3. @theme inline — Tailwind 유틸리티 토큰 */
@theme inline {
  /* 이 블록의 값은 정적(static)이어야 Tailwind가 유틸리티를 생성함 */
  /* var() 참조 불가 — 정적 값만 */
}

/* 4. :root / .dark — CSS 변수 (런타임 동적값) */
:root { }
.dark { }

/* 5. @layer base — HTML 요소 기본 스타일 */
@layer base { }

/* 6. @layer utilities — 커스텀 유틸리티 */
@layer utilities { }

/* 7. @layer components — 재사용 패턴 */
@layer components { }
```

> **중요**: `@theme inline`은 빌드 타임에 파싱된다.
> `var(--something)` 같은 동적 참조를 넣으면 유틸리티 클래스가 생성되지 않는다.
> 동적값은 반드시 `:root` / `.dark`에 CSS 변수로 정의한다.

### 2-2. @theme inline — 유틸리티 토큰 네임스페이스

| 네임스페이스 | 생성되는 유틸리티 | 예시 |
|---|---|---|
| `--color-*` | text-*, bg-*, border-* 등 | `--color-primary: #01C9FC` → `text-primary` |
| `--width-*` | w-*, min-w-*, max-w-* | `--width-app: 1024px` → `min-w-app` |
| `--height-*` | h-*, min-h-*, max-h-* | `--height-header: 48px` → `h-header` |
| `--spacing-*` | p-*, m-*, gap-* 등 | `--spacing-page: 1.5rem` → `p-page` |
| `--radius-*` | rounded-* | `--radius-card: 12px` → `rounded-card` |
| `--font-size-*` | text-* | `--font-size-display: 2rem` → `text-display` |
| `--font-family-*` | font-* | `--font-family-sans: ...` → `font-sans` |
| `--shadow-*` | shadow-* | `--shadow-card: ...` → `shadow-card` |

**패턴: 정적 토큰 → @theme, 동적 테마값 → :root**

```css
/* 정적 — @theme inline */
@theme inline {
  --width-app: 1024px;          /* min-w-app 유틸리티 생성 */
  --height-header: 48px;        /* h-header 유틸리티 생성 */
  --color-brand: #01C9FC;       /* text-brand, bg-brand 등 생성 */
}

/* 동적 (테마 전환) — :root / .dark */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
}
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}
```

### 2-3. @layer utilities — 커스텀 유틸리티

`@theme inline`으로 생성이 안 되는 경우(var() 참조, 복잡한 값)에 사용:

```css
@layer utilities {
  .min-w-app {
    min-width: 1024px;   /* @theme의 var() 참조 버그 우회 시 여기에 직접 정의 */
  }

  .scrollbar-hide {
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }

  .glass {
    background: color-mix(in oklch, var(--background) 70%, transparent);
    backdrop-filter: blur(12px);
    border: 1px solid color-mix(in oklch, var(--border) 60%, transparent);
  }
}
```

---

## 3단계: 에셋 URL 변수화

로고, 파비콘, 배경 이미지 등 에셋을 CSS 변수로 관리하면 테마/환경별로 교체가 쉽다.

### 3-1. CSS 변수 방식 (권장)

```css
:root {
  --logo-url: url('/images/logo.png');
  --logo-dark-url: url('/images/logo-dark.png');
  --favicon-url: url('/images/favicon.ico');
  --og-image-url: url('/images/og.png');
}
.dark {
  --logo-url: var(--logo-dark-url);
}
```

```tsx
// 컴포넌트에서 사용
<div style={{ backgroundImage: 'var(--logo-url)' }} />

// 또는 Tailwind arbitrary value
<div className="bg-[image:var(--logo-url)]" />
```

### 3-2. 환경변수 방식 (Next.js)

`NEXT_PUBLIC_*` 환경 변수로 에셋 베이스 URL을 외부에서 주입:

```ts
// lib/assets.ts
export const ASSET_BASE = process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? '';
export const LOGO_URL = `${ASSET_BASE}/images/logo.png`;
export const LOGO_DARK_URL = `${ASSET_BASE}/images/logo-dark.png`;
```

```tsx
// document.tsx에서 CSS 변수로 주입
<body style={{
  '--logo-url': `url(${LOGO_URL})`,
  '--logo-dark-url': `url(${LOGO_DARK_URL})`,
} as React.CSSProperties}>
```

---

## 4단계: shadcn/ui + base-ui 토큰 체계

이 프로젝트는 Radix 대신 **@base-ui/react**를 사용한다.

### 4-1. shadcn/ui CSS 변수 (컴포넌트 토큰)

shadcn/ui 컴포넌트들은 아래 CSS 변수를 참조한다. `:root` / `.dark`에서 오버라이드:

```css
:root {
  /* 컴포넌트 토큰 */
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --radius: 0.625rem;

  /* 브랜드 */
  --brand: #01C9FC;
}
```

### 4-2. base-ui 컴포넌트 스타일링 패턴

base-ui는 headless UI이므로 Tailwind로 직접 스타일링한다:

```tsx
// Dialog 예시 (base-ui)
import * as Dialog from '@base-ui/react/dialog';

<Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
<Dialog.Popup className="
  fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
  bg-background border border-border rounded-lg shadow-lg
  w-full max-w-md p-6
">
```

base-ui data attribute 기반 상태 스타일:
```css
/* data-state 활용 */
@layer utilities {
  .data-open\:animate-in[data-state='open'] {
    animation: fadeIn 150ms ease;
  }
  .data-closed\:animate-out[data-state='closed'] {
    animation: fadeOut 150ms ease;
  }
}
```

---

## 5단계: 다크/라이트 테마 시스템

### 5-1. next-themes 설정 확인

```tsx
// document.tsx
<ThemeProvider
  attribute="class"          // .dark 클래스 방식
  defaultTheme="light"
  storageKey={THEME_STORAGE_NAME}
  enableSystem={false}       // 시스템 테마 연동 여부
>
```

### 5-2. @custom-variant 선언

```css
/* globals.css 최상단 */
@custom-variant dark (&:is(.dark *));
```

이 선언으로 Tailwind v4에서 `dark:` prefix가 `.dark` 클래스 기반으로 동작한다.

### 5-3. OKLCH 색상 권장

OKLCH는 색상 스케일 생성 시 지각적으로 균일하다:

```css
/* color-mix로 스케일 자동 생성 */
:root {
  --brand: oklch(0.7 0.2 200);
}

@theme inline {
  --color-brand-50:  color-mix(in oklch, var(--brand) 10%, white);
  --color-brand-500: var(--brand);
  --color-brand-950: color-mix(in oklch, var(--brand) 25%, black);
}
```

---

## 6단계: 수정 가이드라인

### 어디에 무엇을 넣을지 결정 트리

```
수정하려는 값이...

정적 값이고 Tailwind 클래스로 쓰고 싶다?
  → @theme inline에 적절한 네임스페이스로 추가
  → 단, var() 참조가 필요하면 @layer utilities에 직접 정의

런타임에 다크/라이트로 바뀌는 색상?
  → :root와 .dark에 CSS 변수로 정의
  → @theme inline에는 그 변수를 참조하는 color 토큰 추가
    (단, @theme에서 var() 참조는 유틸리티 생성이 안 됨 — 색상은 예외적으로 가능)

특정 레이아웃/그룹에서만 적용?
  → 해당 layout.tsx의 래퍼 div className에 추가
  → 또는 .dark 대신 data attribute로 범위 한정

전체 앱에 적용?
  → document.tsx의 body className 또는 :root CSS 변수
```

### 수정 전 체크리스트

- [ ] 수정 대상 파일이 어떤 레이아웃 트리에 속하는지 확인
- [ ] 부모 레이아웃에서 내려오는 CSS 변수 목록 확인
- [ ] 변경이 다른 자식 페이지에 의도치 않은 영향을 주는지 검토
- [ ] @theme inline에 넣을 값은 정적값인지 확인 (var() 참조 → @layer utilities 대신 사용)
- [ ] 다크모드에서도 의도한 대로 동작하는지 확인

---

## 빠른 참조: 자주 쓰는 패턴

### 헤더 높이를 자식이 offset으로 사용하는 패턴

```css
/* globals.css */
@theme inline {
  --height-header: 48px;     /* h-header 유틸리티 생성 */
}
@layer utilities {
  .pt-header {
    padding-top: 48px;       /* 헤더 높이만큼 오프셋 */
  }
}
```

```tsx
// layout.tsx
<header className="fixed top-0 left-0 right-0 h-header z-50">...</header>
<main className="pt-header">...</main>
```

### 글로벌 폰트 설정

```css
@theme inline {
  --font-family-sans: 'Pretendard', 'Geist', system-ui, sans-serif;
  --font-family-mono: 'Geist Mono', monospace;
}
@layer base {
  html {
    font-family: var(--font-family-sans);
    -webkit-font-smoothing: antialiased;
  }
}
```

### 커스텀 매수/매도 색상 스케일 (거래소 어드민 패턴)

```css
:root {
  --positive: oklch(0.398 0.12 145);   /* 매수 */
  --negative: oklch(0.577 0.245 27.325); /* 매도 */
}
@theme inline {
  --color-positive-50:  color-mix(in oklch, var(--positive) 10%, white);
  --color-positive-500: var(--positive);
  --color-positive-950: color-mix(in oklch, var(--positive) 25%, black);
  /* negative도 동일 패턴 */
}
```
