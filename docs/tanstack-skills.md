# TanStack Start 공식 스킬 목록

이 문서는 프로젝트 루트에서 아래 명령을 실행해 확인한 TanStack 스킬을 정리한다.

```powershell
npx @tanstack/intent@latest list
```

- 조회일: 2026-09-06
- 발견된 패키지: 9개
- 발견된 스킬: 31개
- 소스: 현재 프로젝트에 설치된 `@tanstack/*` 패키지의 Intent 메타데이터

## 우선 추천

TanStack Start 프로젝트를 구성하고 개발할 때는 다음 스킬부터 사용한다.

1. `@tanstack/react-start#react-start`
   - React용 TanStack Start 바인딩과 전체 프로젝트 구성을 다룬다.
2. `@tanstack/start-client-core#start-core`
   - Vite 플러그인, Router 팩토리, 루트 문서, 엔트리 포인트와 생성된 라우트 트리를 다룬다.
3. `@tanstack/router-core#router-core`
   - 라우트 트리, 파일 이름 규칙, 라우트 매칭과 타입 등록 등 Router 핵심 개념을 다룬다.

기능별 하위 스킬은 실제 작업에 필요한 경우에만 추가로 로드한다.

## 패키지 현황

| 패키지 | 버전 | 스킬 수 |
| --- | ---: | ---: |
| `@tanstack/devtools` | `0.14.2` | 4 |
| `@tanstack/devtools-event-client` | `0.5.0` | 3 |
| `@tanstack/devtools-vite` | `0.8.5` | 1 |
| `@tanstack/react-start` | `1.168.49` | 3 |
| `@tanstack/router-core` | `1.171.27` | 10 |
| `@tanstack/router-plugin` | `1.168.35` | 1 |
| `@tanstack/start-client-core` | `1.170.27` | 7 |
| `@tanstack/start-server-core` | `1.169.31` | 1 |
| `@tanstack/virtual-file-routes` | `1.162.0` | 1 |

## TanStack Start

### `@tanstack/react-start`

- `@tanstack/react-start#react-start` `[framework]`
  - `createStart`, `StartClient`, `StartServer`, React 전용 import와 `useServerFn` 등 React 통합을 다룬다.
- `@tanstack/react-start#react-start/server-components` `[sub-skill]`
  - React 19 Server Components, Flight 스트림, 선택적 SSR과 RSC 캐싱을 다룬다.
- `@tanstack/react-start#lifecycle/migrate-from-nextjs` `[lifecycle]`
  - Next.js App Router의 라우트, Server Actions, 미들웨어와 데이터 로딩을 TanStack Start로 이전한다.

### `@tanstack/start-client-core`

- `@tanstack/start-client-core#start-core` `[core]`
  - `tanstackStart()` 플러그인, `getRouter()`, 루트 문서, 클라이언트·서버 엔트리와 `routeTree.gen.ts`를 다룬다.
- `@tanstack/start-client-core#start-core/auth-server-primitives` `[sub-skill]`
  - 안전한 세션 쿠키, OAuth PKCE, CSRF, 비밀번호 재설정과 인증 요청 제한을 다룬다.
- `@tanstack/start-client-core#start-core/deployment` `[sub-skill]`
  - Cloudflare Workers, Netlify, Vercel, Node.js/Docker, Bun과 Railway 배포를 다룬다.
- `@tanstack/start-client-core#start-core/execution-model` `[sub-skill]`
  - 서버·클라이언트 실행 경계, 환경 전용 함수, hydration과 환경 변수 보안을 다룬다.
- `@tanstack/start-client-core#start-core/middleware` `[sub-skill]`
  - 요청 및 서버 함수 미들웨어, context 전달과 전역 미들웨어 구성을 다룬다.
- `@tanstack/start-client-core#start-core/server-functions` `[sub-skill]`
  - `createServerFn`, 입력 검증, 요청·응답 유틸리티, 오류 처리와 스트리밍을 다룬다.
- `@tanstack/start-client-core#start-core/server-routes` `[sub-skill]`
  - 파일 라우트의 `server` 속성을 이용한 HTTP API 엔드포인트를 다룬다.

### `@tanstack/start-server-core`

- `@tanstack/start-server-core#start-server-core` `[core]`
  - 서버 런타임, 요청 처리, 응답 헤더, 쿠키, 세션과 `AsyncLocalStorage` context를 다룬다.

## TanStack Router

### `@tanstack/router-core`

- `@tanstack/router-core#router-core` `[core]`
  - 라우트 트리, 루트 라우트, 라우트 매칭, 정렬, 파일 이름 규칙과 타입 등록을 다룬다.
- `@tanstack/router-core#router-core/auth-and-guards` `[sub-skill]`
  - `beforeLoad`, redirect, 인증 레이아웃, 역할 및 권한 기반 라우트 보호를 다룬다.
- `@tanstack/router-core#router-core/code-splitting` `[sub-skill]`
  - 자동 코드 분할, lazy 라우트와 라우트별 코드 분할 설정을 다룬다.
- `@tanstack/router-core#router-core/data-loading` `[sub-skill]`
  - loader, 캐시 키, SWR 캐싱, pending·error UI와 지연 데이터 로딩을 다룬다.
- `@tanstack/router-core#router-core/navigation` `[sub-skill]`
  - `Link`, `useNavigate`, preload, navigation blocking과 스크롤 복원을 다룬다.
- `@tanstack/router-core#router-core/not-found-and-errors` `[sub-skill]`
  - not-found 처리, error boundary와 route masking을 다룬다.
- `@tanstack/router-core#router-core/path-params` `[sub-skill]`
  - 동적 경로, splat, 선택적 파라미터와 파라미터 parse·stringify를 다룬다.
- `@tanstack/router-core#router-core/search-params` `[sub-skill]`
  - 검색 파라미터 검증, 직렬화, middleware와 loader 캐시 키 연동을 다룬다.
- `@tanstack/router-core#router-core/ssr` `[sub-skill]`
  - 스트리밍·비스트리밍 SSR, hydration, 문서 head와 서버용 history를 다룬다.
- `@tanstack/router-core#router-core/type-safety` `[sub-skill]`
  - 타입 추론, `Register`, `getRouteApi`, 타입 안전한 Link와 TypeScript 성능 패턴을 다룬다.

### `@tanstack/router-plugin`

- `@tanstack/router-plugin#router-plugin` `[core]`
  - Vite, Webpack, Rspack, esbuild에서 라우트 생성과 자동 코드 분할을 설정한다.

### `@tanstack/virtual-file-routes`

- `@tanstack/virtual-file-routes#virtual-file-routes` `[core]`
  - 파일 시스템 규칙 대신 프로그래밍 방식으로 가상 라우트 트리를 구성한다.

## TanStack Devtools

### `@tanstack/devtools`

- `@tanstack/devtools#devtools-app-setup` `[core]`
  - 프레임워크 어댑터, 플러그인 등록, 위치, 단축키와 테마 등 Devtools 앱을 설정한다.
- `@tanstack/devtools#devtools-marketplace` `[lifecycle]`
  - Devtools 플러그인을 npm에 배포하고 Marketplace에 등록하는 과정을 다룬다.
- `@tanstack/devtools#devtools-plugin-panel` `[core]`
  - 이벤트 데이터를 표시하는 Devtools 패널과 패널 생명주기를 구현한다.
- `@tanstack/devtools#devtools-production` `[lifecycle]`
  - production build에서 Devtools 제거, 조건부 import와 tree-shaking을 다룬다.

### `@tanstack/devtools-event-client`

- `@tanstack/devtools-event-client#devtools-bidirectional` `[core]`
  - 애플리케이션과 Devtools 사이의 양방향 이벤트 및 time-travel 패턴을 다룬다.
- `@tanstack/devtools-event-client#devtools-event-client` `[core]`
  - 타입이 지정된 이벤트 맵, 이벤트 namespace, 연결 생명주기와 singleton 패턴을 다룬다.
- `@tanstack/devtools-event-client#devtools-instrumentation` `[core]`
  - 중요한 상태 전환과 생명주기에 진단 이벤트를 추가하는 방법을 다룬다.

### `@tanstack/devtools-vite`

- `@tanstack/devtools-vite#devtools-vite-plugin` `[core]`
  - 소스 검사, console 전달, 서버 이벤트 버스, editor 연동과 production 제거를 설정한다.
  - 스킬 메타데이터에는 Vite `^6 || ^7` 지원으로 명시되어 있다.
  - 현재 프로젝트는 Vite `^8.0.0`을 사용하므로 적용 전에 실제 호환성을 확인해야 한다.

## 로드 명령

프로젝트 루트에서 필요한 스킬만 로드한다.

```powershell
npx @tanstack/intent@latest load @tanstack/react-start#react-start
npx @tanstack/intent@latest load @tanstack/start-client-core#start-core
npx @tanstack/intent@latest load @tanstack/router-core#router-core
```

기능별 스킬 예시:

```powershell
npx @tanstack/intent@latest load @tanstack/start-client-core#start-core/server-functions
npx @tanstack/intent@latest load @tanstack/router-core#router-core/data-loading
npx @tanstack/intent@latest load @tanstack/router-core#router-core/type-safety
```

## 프로젝트 로컬 관리 원칙

- 모든 스킬 조회와 로드 명령은 프로젝트 루트에서 실행한다.
- 스킬을 설치·생성·복사·다운로드하는 경우 프로젝트 내부에만 저장한다.
- 사용자 홈이나 `$CODEX_HOME/skills`에는 프로젝트 스킬을 저장하지 않는다.
- `--global`, `--global-only` 같은 전역 스킬 옵션을 사용하지 않는다.
- 스킬 저장 위치가 프로젝트 내부인지 확인할 수 없다면 실행하지 않는다.

## 참고 사항

현재 `intent.skills` allowlist가 설정되어 있지 않아 발견된 모든 스킬 소스가 표시된다. Intent 안내에 따르면 향후 버전에서는 명시적인 allowlist가 필요할 수 있다.
