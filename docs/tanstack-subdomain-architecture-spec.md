# TanStack Start 단일 배포 + 모바일/데스크탑 서브도메인 분리 개발 명세

> 목적: Codex가 이 문서를 기준으로 기존 TanStack Start 프로젝트에 모바일/데스크탑 서브도메인 분기 구조를 구현할 수 있도록 한다.
>
> 작성 기준일: 2026-09-06

## 1. 목표

하나의 TanStack Start 애플리케이션과 하나의 Docker 배포를 유지하면서, 요청된 hostname에 따라 서버 사이드에서 모바일/데스크탑 애플리케이션 변형(App Variant)을 결정한다.

- 데스크탑 운영 도메인: `https://example.com` 또는 `https://www.example.com`
- 모바일 운영 도메인: `https://m.example.com`
- 데스크탑 개발 주소: `http://localhost:3000`
- 모바일 개발 주소: `http://m.localhost:3000`
- TanStack Start 컨테이너는 하나만 실행한다.
- Nginx는 모바일/데스크탑을 나타내는 별도 커스텀 헤더(`X-App-Variant`)를 만들지 않는다.
- TanStack Start가 실제 요청 URL의 `hostname`을 읽어 App Variant를 결정한다.
- 모바일과 데스크탑 UI는 단순 반응형이 아니라, 레이아웃·페이지·라우팅 경험이 크게 다를 수 있다는 전제로 설계한다.
- 공유 가능한 것은 API, 타입, 인증, 비즈니스 로직, 데이터 로더 위주로 공유한다.

## 2. 현재 배포 환경

```text
Internet
  |
  v
Cloudflare DNS / Proxy / Rules
  |
  v
ipTIME Router
  |
  v
Mac mini
  |
  v
Docker Network
  |
  +-- nginx
  |     |
  |     v
  +-- tanstack-start:3000
```

Cloudflare Tunnel 도입은 선택 사항이며 현재 구현 범위의 필수 조건이 아니다.

## 3. 최종 아키텍처 원칙

```text
                         Cloudflare
                              |
                +-------------+-------------+
                |                           |
         example.com / www             m.example.com
                |                           |
                +-------------+-------------+
                              |
                            Nginx
                              |
                    original Host 유지
                              |
                              v
                    TanStack Start :3000
                              |
                     request.url.hostname
                              |
                  +-----------+-----------+
                  |                       |
               desktop                  mobile
                  |                       |
          Desktop SSR/UI          Mobile SSR/UI
```

### 핵심 원칙

1. **배포 단위는 하나**다.
2. **도메인은 모바일/데스크탑으로 분리**한다.
3. **App Variant 판별은 서버 요청 hostname을 기준**으로 한다.
4. **클라이언트 최초 렌더에서 `window.innerWidth`로 App Variant를 결정하지 않는다.**
5. SSR과 hydration에서 반드시 동일한 App Variant를 사용한다.
6. 모바일/데스크탑 UI 코드는 강하게 분리하되, 도메인 로직과 데이터 계층은 공유한다.
7. 모바일 전용 페이지와 데스크탑 전용 페이지가 존재할 수 있다.
8. 검색 노출이 필요한 페이지는 모바일/데스크탑 각각의 실제 페이지가 필요한 SEO 정보를 서버 렌더링할 수 있게 한다.

## 4. Host 매핑 규칙

### 운영

| Hostname | App Variant |
|---|---|
| `example.com` | `desktop` |
| `www.example.com` | `desktop` |
| `m.example.com` | `mobile` |

### 개발

| Hostname | App Variant |
|---|---|
| `localhost` | `desktop` |
| `www.localhost` | `desktop` (선택) |
| `m.localhost` | `mobile` |

기본 개발 URL은 아래 두 개만 사용한다.

```text
Desktop: http://localhost:3000
Mobile : http://m.localhost:3000
```

Vite는 기본적으로 `localhost`와 `.localhost` 하위 도메인을 허용하므로 일반적인 환경에서는 `/etc/hosts` 수정이 필요 없다.

## 5. Hostname Resolver

App Variant 결정 로직은 한 곳에만 둔다.

권장 파일:

```text
src/lib/app-variant.ts
```

예시:

```ts
export type AppVariant = 'desktop' | 'mobile'

const MOBILE_HOSTS = new Set([
  'm.example.com',
  'm.localhost',
])

const DESKTOP_HOSTS = new Set([
  'example.com',
  'www.example.com',
  'localhost',
  'www.localhost',
])

export function resolveAppVariant(hostname: string): AppVariant {
  const normalized = hostname.toLowerCase().replace(/\.$/, '')

  if (MOBILE_HOSTS.has(normalized)) {
    return 'mobile'
  }

  if (DESKTOP_HOSTS.has(normalized)) {
    return 'desktop'
  }

  // 알 수 없는 host는 안전하게 desktop으로 처리한다.
  // 필요하면 production에서는 예외 또는 404 정책으로 변경한다.
  return 'desktop'
}
```

실제 도메인이 확정되면 `example.com`을 프로젝트 도메인으로 교체한다.

## 6. TanStack Start 서버 엔트리에서 판별

TanStack Start의 `src/server.ts`는 SSR을 포함한 서버 요청의 진입점이다. 표준 `Request`를 받을 수 있으므로 `new URL(request.url).hostname`을 기준으로 App Variant를 결정한다.

권장 형태:

```ts
// src/server.ts
import handler, {
  createServerEntry,
} from '@tanstack/react-start/server-entry'

import {
  resolveAppVariant,
  type AppVariant,
} from './lib/app-variant'

type RequestContext = {
  appVariant: AppVariant
  hostname: string
}

declare module '@tanstack/react-router' {
  interface Register {
    server: {
      requestContext: RequestContext
    }
  }
}

export default createServerEntry({
  async fetch(request) {
    const url = new URL(request.url)
    const hostname = url.hostname.toLowerCase()
    const appVariant = resolveAppVariant(hostname)

    return handler.fetch(request, {
      context: {
        appVariant,
        hostname,
      },
    })
  },
})
```

### 프록시 환경 주의사항

목표는 **커스텀 App Variant 헤더 없이 hostname 자체를 사용하는 것**이다. 다만 reverse proxy가 원래 Host를 TanStack Start까지 보존해야 한다.

Nginx에서는 다음 정도만 유지한다.

```nginx
location / {
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;

    proxy_pass http://tanstack-start:3000;
}
```

`X-App-Variant: mobile` 같은 애플리케이션 전용 헤더는 사용하지 않는다.

만약 사용하는 Node/Nitro 어댑터에서 `request.url`이 내부 hostname으로 재구성되는 문제가 확인될 경우에만 `X-Forwarded-Host` 또는 `Host`를 fallback으로 사용한다.

```ts
export function getRequestHostname(request: Request) {
  const urlHostname = new URL(request.url).hostname

  if (urlHostname && urlHostname !== 'tanstack-start') {
    return urlHostname.toLowerCase()
  }

  const forwarded = request.headers
    .get('x-forwarded-host')
    ?.split(',')[0]
    ?.trim()

  const host = forwarded ?? request.headers.get('host')

  return (host ?? urlHostname)
    .replace(/:\d+$/, '')
    .toLowerCase()
}
```

우선 구현은 `request.url.hostname`을 사용하고, 실제 Docker/Nginx 환경 통합 테스트에서 문제가 있을 때만 fallback을 추가한다.

## 7. SSR / Hydration 설계

잘못된 방식:

```tsx
const mobile = window.innerWidth < 768
return mobile ? <MobileApp /> : <DesktopApp />
```

이 방식은 서버와 클라이언트의 최초 렌더 결과가 달라져 hydration mismatch를 만들 수 있다.

원하는 흐름:

```text
m.example.com 요청
   |
   v
server.ts
   |
hostname = m.example.com
   |
appVariant = mobile
   |
Mobile SSR
   |
HTML + serialized route data
   |
Client hydration
   |
mobile 상태 그대로 사용
```

App Variant는 SSR 요청에서 결정하고, 클라이언트 hydration에도 동일한 값을 전달해야 한다.

## 8. UI 코드 구조

모바일과 데스크탑 UI가 크게 다르므로 UI 계층은 억지로 공유하지 않는다.

권장 예시:

```text
src/
├─ features/
│  ├─ desktop/
│  │  ├─ layouts/
│  │  │  └─ DesktopLayout.tsx
│  │  ├─ pages/
│  │  │  ├─ HomePage.tsx
│  │  │  ├─ ArticlePage.tsx
│  │  │  └─ SearchPage.tsx
│  │  └─ components/
│  │
│  ├─ mobile/
│  │  ├─ layouts/
│  │  │  └─ MobileLayout.tsx
│  │  ├─ navigation/
│  │  │  └─ BottomTabs.tsx
│  │  ├─ pages/
│  │  │  ├─ HomePage.tsx
│  │  │  ├─ FeedPage.tsx
│  │  │  ├─ ArticlePage.tsx
│  │  │  └─ ProfilePage.tsx
│  │  └─ components/
│  │
│  └─ shared/
│     ├─ api/
│     ├─ auth/
│     ├─ domain/
│     ├─ types/
│     └─ utils/
│
├─ routes/
├─ lib/
│  └─ app-variant.ts
├─ router.tsx
└─ server.ts
```

### 공유 우선순위

공유 권장:

- API client
- DTO / TypeScript types
- 인증/권한 로직
- validation
- query key
- 데이터 변환
- 비즈니스 규칙
- SEO 데이터 생성 유틸리티

분리 권장:

- Layout
- Navigation
- Page component
- 화면 상태 관리
- Bottom tab / sidebar
- 모바일 전용 modal, sheet, gesture
- 데스크탑 전용 dashboard / multi-column UI

## 9. 라우트 설계

하나의 TanStack Router route tree를 유지하되, 모바일/데스크탑 route의 합집합으로 생각한다.

예:

```text
Desktop
/
/articles/$id
/categories/$slug
/search
/ranking

Mobile
/
/articles/$id
/feed
/search
/notifications
/profile
```

공통 URL인 `/articles/$id`는 데이터는 공유하고 UI를 분기할 수 있다.

개념 예시:

```tsx
function ArticleRoute() {
  const article = Route.useLoaderData()
  const appVariant = useAppVariant()

  return appVariant === 'mobile'
    ? <MobileArticlePage article={article} />
    : <DesktopArticlePage article={article} />
}
```

모바일 전용 URL은 데스크탑 hostname에서 404 또는 의도한 URL로 redirect한다.

```tsx
// 개념 예시
if (appVariant !== 'mobile') {
  throw notFound()
}
```

주의: App Variant를 route/component에서 꺼내는 실제 helper 구현은 현재 프로젝트의 router context 구성에 맞춰 하나의 공통 `useAppVariant()` / `getAppVariant()` API로 캡슐화한다. 여러 컴포넌트에서 hostname을 직접 다시 파싱하지 않는다.

## 10. Bundle / Code Splitting

모바일과 데스크탑 코드가 크게 다르므로 한 사용자가 양쪽 UI 번들을 모두 받지 않도록 주의한다.

피해야 할 구조:

```tsx
import { DesktopPage } from '@/features/desktop/pages/Page'
import { MobilePage } from '@/features/mobile/pages/Page'

return appVariant === 'mobile'
  ? <MobilePage />
  : <DesktopPage />
```

번들러 설정에 따라 양쪽 코드가 같은 초기 번들에 포함될 가능성이 있다.

TanStack Router의 automatic code splitting을 우선 사용한다.

```ts
// vite.config.ts 개념 예시
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
    }),
    react(),
  ],
})
```

구현 후 빌드 결과를 분석해서 다음을 확인한다.

- `m.example.com` 첫 진입에서 불필요한 desktop chunk가 다운로드되지 않는지
- desktop 첫 진입에서 불필요한 mobile chunk가 다운로드되지 않는지
- 공통 코드만 shared chunk로 묶이는지

필요하면 `.lazy.tsx`, `createLazyFileRoute`, 동적 import 등으로 더 강하게 분리한다.

## 11. 개발 환경

### 실행

TanStack Start dev server는 한 번만 실행한다.

```bash
pnpm dev
```

동시에 아래 두 브라우저 주소를 연다.

```text
Desktop: http://localhost:3000
Mobile : http://m.localhost:3000
```

Chrome DevTools의 모바일 viewport는 `m.localhost:3000`에서 사용한다.

중요: viewport는 UI 확인용일 뿐 App Variant 판별 기준이 아니다. App Variant는 hostname이다.

### Vite 설정

일반적으로 추가 `allowedHosts` 설정이 필요 없다. Vite 최신 문서상 `localhost`와 `.localhost` 하위 도메인은 기본 허용된다.

만약 프로젝트의 다른 설정 때문에 막히면 전체 허용(`allowedHosts: true`) 대신 필요한 host만 명시한다.

## 12. Nginx 운영 설정

Nginx는 두 host 모두 같은 TanStack Start 컨테이너로 전달한다.

```nginx
upstream tanstack_start {
    server tanstack-start:3000;
}

server {
    listen 80;
    server_name example.com www.example.com m.example.com;

    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;

        proxy_pass http://tanstack_start;
    }
}
```

TLS가 Cloudflare에서 종료되는지, origin까지 HTTPS를 사용할지는 실제 인프라 설정에 맞춰 별도로 적용한다.

## 13. Cloudflare Redirect Rules

Cloudflare의 역할은 **잘못된 디바이스/호스트로 들어온 최초 요청을 적절한 서브도메인으로 보내는 것**이다.

TanStack Start의 역할은 **도착한 hostname을 기준으로 올바른 애플리케이션을 SSR하는 것**이다.

### 모바일 사용자: 메인 → m

예시 조건:

```text
http.host in {"example.com" "www.example.com"}
and
(
  http.user_agent contains "mobi"
  or http.user_agent contains "Mobi"
)
```

Dynamic Redirect target:

```text
concat("https://m.example.com", http.request.uri.path)
```

설정:

- 테스트/초기 운영: `302` 권장
- 정책이 완전히 고정된 뒤: `301` 또는 `308` 검토
- Preserve query string: ON

예:

```text
https://example.com/articles/123?from=share
→
https://m.example.com/articles/123?from=share
```

### 데스크탑 사용자: m → 메인

반대 Rule도 만들 수 있다. 단, 사용자에게 “데스크탑 사이트 보기” 기능을 제공할 계획이라면 무조건적인 양방향 User-Agent redirect는 피한다.

향후 override 정책 예:

```text
?view=desktop
?view=mobile
```

또는 preference cookie를 사용해 사용자의 명시적 선택이 Cloudflare 자동 redirect보다 우선하도록 설계할 수 있다.

### Redirect loop 방지

각 Rule은 target hostname 자체를 다시 redirect 대상으로 잡지 않아야 한다.

Cloudflare 공식 모바일 redirect 예제도 `m.example.com`을 조건에서 제외해 루프를 방지한다.

## 14. SEO 정책

모바일과 데스크탑은 UI와 페이지 구조가 크게 다르더라도, 동일한 콘텐츠를 표현하는 URL 쌍은 SEO 관계를 명확하게 해야 한다.

예:

```text
Desktop: https://example.com/articles/123
Mobile : https://m.example.com/articles/123
```

동일 콘텐츠라면 canonical/alternate 정책을 프로젝트 SEO 전략에 맞춰 설정한다.

중요한 원칙:

- 모바일 페이지가 단순 빈 CSR shell이 되지 않게 한다.
- 검색 노출이 필요한 title, 본문, meta, canonical 등의 핵심 정보는 초기 서버 응답에서 제공하는 것을 목표로 한다.
- 모바일 전용 앱형 페이지(`/notifications`, `/profile` 등)는 SEO 대상이 아닐 수 있으므로 CSR 비중을 높여도 된다.
- 모바일/데스크탑 콘텐츠가 실제로 다르다면 무조건 같은 canonical 관계를 적용하지 말고 페이지별 의도를 정의한다.

## 15. 인증 / Cookie 주의사항

운영 환경에서 `example.com`과 `m.example.com` 간 로그인을 공유해야 한다면 Cookie Domain 전략을 별도로 결정해야 한다.

예:

```text
Domain=.example.com
Secure
HttpOnly
SameSite=Lax (서비스 요구사항에 따라 조정)
```

개발 환경의 `localhost` / `m.localhost` 쿠키 동작은 실제 운영 도메인과 완전히 같지 않을 수 있다.

인증 통합 테스트가 중요해지는 시점에는 필요하면 별도 로컬 테스트 도메인(예: `desktop.myapp.test`, `m.myapp.test`)을 `/etc/hosts`에 등록해 운영과 유사한 cookie scope를 검증한다.

## 16. 구현 우선순위

### Phase 1 - Host 기반 App Variant

1. `src/lib/app-variant.ts` 생성
2. `localhost`, `m.localhost`, 운영 도메인 매핑 작성
3. `src/server.ts`에서 `request.url.hostname` 판별
4. request context에 `appVariant`, `hostname` 저장
5. 공통 `useAppVariant()` 또는 equivalent API 작성
6. root/layout에서 Desktop/Mobile 분기가 SSR 시점에 동작하는지 확인

### Phase 2 - UI 구조 분리

1. `features/desktop` 생성
2. `features/mobile` 생성
3. Desktop layout 분리
4. Mobile layout + Bottom Tabs 구현
5. shared API/types/domain 로직 추출

### Phase 3 - Route 차이 적용

1. 공통 route에서 Desktop/Mobile page 분기
2. Mobile-only route 정책 적용
3. Desktop-only route 정책 적용
4. 404/redirect 정책 정의

### Phase 4 - Code Splitting

1. automatic code splitting 활성화 여부 확인
2. production build 생성
3. desktop/mobile initial chunk 분석
4. 불필요한 반대 variant 코드가 포함되면 lazy split 적용

### Phase 5 - Infra

1. Nginx에서 세 hostname을 동일 upstream으로 proxy
2. Host 보존 확인
3. Cloudflare DNS 설정
4. Cloudflare Redirect Rules 설정
5. path/query preservation 확인

### Phase 6 - SEO / Auth

1. 모바일/데스크탑 page title/meta 검증
2. canonical/alternate 전략 확정
3. crawler에서 모바일 SSR HTML 확인
4. cross-subdomain cookie 정책 검증

## 17. Acceptance Criteria

Codex 구현 완료 조건:

- [ ] `pnpm dev` 한 번으로 서버가 실행된다.
- [ ] `http://localhost:3000`은 desktop SSR을 반환한다.
- [ ] `http://m.localhost:3000`은 mobile SSR을 반환한다.
- [ ] 브라우저 viewport 크기를 바꿔도 hostname이 같으면 App Variant가 바뀌지 않는다.
- [ ] 새로고침 시 hydration mismatch 경고가 없다.
- [ ] 운영에서 `example.com`, `www.example.com`, `m.example.com`이 같은 TanStack Start 컨테이너로 연결된다.
- [ ] Nginx는 원래 Host를 upstream에 전달한다.
- [ ] 모바일과 데스크탑이 서로 다른 layout/page를 렌더링할 수 있다.
- [ ] 모바일 전용 Bottom Tab은 mobile variant에서만 렌더링된다.
- [ ] 동일 route의 loader/business logic은 가능한 한 공유된다.
- [ ] production bundle에서 불필요한 반대 variant UI chunk 로딩 여부를 확인했다.
- [ ] Cloudflare redirect가 path와 query string을 보존한다.
- [ ] redirect loop가 발생하지 않는다.
- [ ] SEO 대상 페이지의 초기 HTML에 핵심 콘텐츠/meta가 존재한다.

## 18. 테스트 케이스

### 로컬

```text
GET http://localhost:3000/
Expected: desktop

GET http://m.localhost:3000/
Expected: mobile

GET http://localhost:3000/articles/123
Expected: DesktopArticlePage

GET http://m.localhost:3000/articles/123
Expected: MobileArticlePage
```

### 운영

```text
GET https://example.com/articles/123
Expected: Desktop SSR

GET https://m.example.com/articles/123
Expected: Mobile SSR
```

### Cloudflare

```text
Mobile UA
https://example.com/articles/123?a=1
→ https://m.example.com/articles/123?a=1

Desktop UA
https://example.com/articles/123?a=1
→ redirect 없음
```

양방향 redirect를 활성화한다면 별도의 desktop-UA-on-m 테스트도 추가한다.

## 19. Codex 구현 지침

Codex는 다음 원칙을 지켜 작업한다.

1. 기존 프로젝트 구조와 package version을 먼저 확인한다.
2. 현재 설치된 TanStack Start / Router API에 맞춰 코드를 작성한다.
3. 이 문서의 예시 코드가 현재 버전 API와 다르면 **현재 공식 API를 우선**한다.
4. App Variant를 여러 곳에서 중복 판별하지 않는다.
5. `window.innerWidth`, `navigator.userAgent`를 App Variant의 source of truth로 사용하지 않는다.
6. Nginx의 커스텀 `X-App-Variant` 헤더에 의존하지 않는다.
7. 모바일과 데스크탑 UI를 억지로 공통화하지 않는다.
8. 비즈니스 로직과 데이터 계층은 가능한 범위에서 공유한다.
9. 구현 후 SSR HTML, hydration, route navigation, HMR, production bundle을 확인한다.
10. 변경 파일과 설계상 선택 사항을 마지막에 요약한다.

## 20. 공식 참고 문서

- TanStack Start - Server Entry Point  
  https://tanstack.com/start/latest/docs/framework/react/guide/server-entry-point
- TanStack Start - Middleware  
  https://tanstack.com/start/latest/docs/framework/react/guide/middleware
- TanStack Start - Server Functions  
  https://tanstack.com/start/latest/docs/framework/react/guide/server-functions
- TanStack Start - Execution Model  
  https://tanstack.com/start/latest/docs/framework/react/guide/execution-model
- TanStack Router - Router Context  
  https://tanstack.com/router/latest/docs/guide/router-context
- TanStack Router - Code Splitting  
  https://tanstack.com/router/latest/docs/guide/code-splitting
- Vite - Server Options  
  https://vite.dev/config/server-options
- Cloudflare - Perform mobile redirects  
  https://developers.cloudflare.com/rules/url-forwarding/examples/perform-mobile-redirects/
- Cloudflare - Redirects  
  https://developers.cloudflare.com/rules/url-forwarding/

## 21. 최종 결정 요약

```text
[Deployment]
TanStack Start: 1 app / 1 build / 1 Docker container

[Production]
example.com / www.example.com -> desktop
m.example.com                 -> mobile

[Development]
localhost:3000                -> desktop
m.localhost:3000              -> mobile

[Variant Source of Truth]
request hostname

[Cloudflare]
device 기반 최초 hostname redirect

[Nginx]
동일 upstream proxy + original Host 유지

[TanStack Start]
hostname을 SSR 단계에서 판별

[UI]
Desktop / Mobile 강한 분리 허용

[Shared]
API / auth / types / domain / loaders 중심

[Important]
SSR과 hydration에서 동일 variant 사용
mobile/desktop bundle 분리 확인
SEO 대상 페이지는 서버 렌더링 유지
```
