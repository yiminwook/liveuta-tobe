# Liveuta Migration Checklist

분석 기준:

- 신규 프로젝트: `C:\Users\grs04\Desktop\project\liveuta`
- 기존 프로젝트: `C:\Users\grs04\Desktop\project\liveuta-asis`
- 기존 프로젝트는 읽기 전용 기능 명세로 사용한다.
- 배포 대상은 Cloudflare Pages가 아니라 기존 로컬 Docker/Node.js 환경이다.

## 분석 요약

| 항목 | 기존 프로젝트 | 신규 프로젝트 |
|---|---:|---:|
| `src` 전체 파일 | 504 | 13 |
| `src/components` TSX | 162 | 운영 컴포넌트 3개 |
| 활성 `page.tsx` | 27 | 사용자 라우트 2개 |
| 활성 API route 파일 | 23 | TanStack 서버 라우트 7개 |
| 활성 HTTP handler | 28 | TanStack handler 7개 |
| custom hook | 14 | 0 |
| client store | 4 | 0 |
| `"use client"` 파일 | 126 | 0 |
| Next 관련 import 파일 | 92 | 0 |
| SCSS | 100개 / 13,490줄 | 0 |
| Mantine 참조 파일 | 88 | 0 |
| Day.js 참조 파일 | 17 | 0 |
| 다국어 리소스 | `ko`, `en`, `ja` | 없음 |

## 전환 원칙

- [x] Next.js App Router를 TanStack Start/Router로 전환한다.
- [x] React Server Component 구조를 제거한다.
- [x] 일반 React 컴포넌트와 명시적인 loader/API/server 경계를 사용한다.
- [x] TanStack Start의 SSR, loader, server route는 RSC가 아니므로 필요한
  곳에서 사용할 수 있다.
- [x] Mantine/SCSS를 Tailwind CSS v4와 shadcn/ui로 전환한다.
- [x] Day.js를 date-fns와 native `Date`로 전환한다.
- [x] OracleDB와 MongoDB를 유지할 수 있도록 Node.js Docker 런타임을 사용한다.
- [x] 기존 `/api/*` URL과 응답 계약은 각 기능을 옮기는 동안 유지한다.
- [x] 기존 `theme1`~`theme5` 및 localStorage key `theme`을 유지한다.
- [x] 기존 프로젝트의 `src/temps`와 비활성/실험 코드는 자동 이관하지 않는다.

## 페이지 및 기능 체크리스트

`{locale}`은 `ko | en | ja`이며 fallback은 `ko`다.

### 공통 셸

- [ ] `/` 접근 시 `/ko`로 이동한다.
- [ ] 유효하지 않은 locale은 locale-aware 404로 처리한다.
- [ ] `<html lang>`이 현재 locale과 일치한다.
- [ ] locale을 바꿔도 현재 pathname과 query가 유지된다.
- [ ] desktop header navigation을 복원한다.
- [ ] mobile bottom navigation을 복원한다.
- [ ] account sidebar와 로그인 상태 표시를 복원한다.
- [ ] route 이동 progress UI를 복원한다.
- [ ] command palette와 `Ctrl/Cmd+K`를 복원한다.
- [ ] toast, modal portal, particle, devtools provider를 필요한 환경에 복원한다.
- [ ] loading, empty, error, not-found 상태를 공통 디자인으로 제공한다.
- [ ] keyboard navigation, visible focus, focus restoration, reduced motion을 검증한다.
- [ ] mobile safe-area와 overlay/scrollbar 동작을 검증한다.

### 홈 `/{locale}`

- [ ] 커버 이미지/메타데이터를 표시한다.
- [ ] 로그인 사용자의 즐겨찾기 일정을 표시한다.
- [ ] 현재 라이브 일정을 표시한다.
- [ ] 일정 검색 입력이 `/{locale}/schedule?q=...&t=all`로 이동한다.
- [ ] 최근 등록 채널을 표시한다.
- [ ] featured 페이지 진입 영역을 표시한다.
- [ ] Twitter timeline을 browser-only 경계에서 표시한다.
- [ ] schedule/channel slider의 loading 상태를 제공한다.
- [ ] 즐겨찾기/차단은 비로그인 사용자에게 안내한다.
- [ ] desktop 카드 클릭은 글로벌 player, mobile은 YouTube 이동으로 동작한다.

### 일정 `/{locale}/schedule`

- [x] `q` 검색어를 URL 상태로 사용한다. `/schedule`에서 검색어를 제출하면 URL 검색 조건으로 저장한다.
- [x] `t=scheduled|live|daily|all`을 검증하고 기본값을 `scheduled`로 한다. 허용되지 않은 값은 `scheduled`로 보정한다.
- [ ] `isFavorite=true` 필터를 복원한다.
- [x] `select=all|stream|video` 선택 상태를 URL 검색 조건으로 보존한다.
- [ ] 전체/방송/영상별 개수를 정확히 표시한다.
- [ ] blacklist 채널을 기본 목록에서 제외한다.
- [ ] favorite 필터와 blacklist 조합을 검증한다.
- [ ] 자동 동기화 on/off와 선택 간격을 반영한다.
- [x] Virtuoso 기반 가상 목록/추가 로딩 동작을 보존한다. 기존 전체 목록 응답에서 24개씩 표시하고 목록 끝에서 추가한다.
- [x] 카드를 새 창으로 열고 방송 링크를 복사한다.
- [ ] 카드의 즐겨찾기, 차단, 알림 기능을 보존한다.
- [x] 검색 결과가 없을 때 channel 검색 링크를 제공한다.
- [ ] live 탭의 inline player와 YouTube chat을 복원한다.
- [ ] inline player가 viewport를 벗어날 때 PiP와 중복되지 않게 처리한다.

### 채널 `/{locale}/channel`

- [ ] `page>=1`, `q`, `query-type=name|handle|channelId`,
  `sort=name_kor|createdAt`을 검증한다.
- [ ] 잘못된 search param은 명확한 not-found/error 상태로 처리한다.
- [ ] 24개 단위 pagination을 보존한다.
- [ ] 이름/handle/channel ID 검색을 보존한다.
- [ ] 이름순/등록순 정렬을 보존한다.
- [ ] 채널 상세 modal/dialog를 보존한다.
- [ ] YouTube 외부 링크의 desktop/mobile 동작을 검증한다.
- [ ] 즐겨찾기 상태와 mutation을 연결한다.
- [ ] 채널 등록 요청 페이지 링크를 제공한다.

### 채널 요청 `/{locale}/request`

- [ ] 여러 YouTube URL 입력을 정규화한다.
- [ ] 중복 채널과 신규 채널을 분리한다.
- [ ] 채널별 한국어 이름을 검증한다.
- [ ] 여러 채널의 일괄 등록 요청을 지원한다.
- [ ] 등록 대기 목록을 표시한다.
- [ ] 등록된 전체 채널 수를 표시한다.
- [ ] mutation 성공 후 waiting/count query를 갱신한다.
- [ ] 기존 Next rewrite를 Node server adapter 또는 명시적인 API route로 대체한다.

### Featured `/{locale}/featured`

- [ ] 상위 평가 채널 목록을 표시한다.
- [ ] 유망 채널 목록을 표시한다.
- [ ] 두 목록 사이 Swiper navigation/pagination을 보존한다.
- [ ] 업데이트 시각을 locale-aware date-fns 형식으로 표시한다.
- [ ] 채널 YouTube 링크를 제공한다.
- [ ] 기존에 UI가 주석 처리된 favorite/block 동작의 유지 여부를 결정한다.
- [ ] featured cache TTL을 한 곳에서 정의한다.

### 멀티뷰 `/{locale}/multi`

- [ ] 최대 12개 YouTube 영상을 지원한다.
- [ ] URL로 영상을 추가한다.
- [ ] 일정 목록에서 영상을 추가한다.
- [ ] grid drag와 resize를 지원한다.
- [ ] breakpoint별 layout을 보존한다.
- [ ] 개별 삭제와 전체 초기화를 지원한다.
- [ ] video map/layout을 localStorage에 저장하고 복구한다.
- [ ] 손상된 storage 데이터는 안전하게 초기화한다.
- [ ] browser-only 의존성이 SSR 중 평가되지 않는다.
- [ ] mobile navigation에서 제외되는 기존 정책을 확인한다.

### 세트리스트 목록 `/{locale}/setlist`

- [ ] `query`, `page`, `sort=broadcast|create`를 canonical contract로 사용한다.
- [ ] 남아 있는 `order` 타입 불일치를 제거한다.
- [ ] 15개 단위 pagination을 보존한다.
- [ ] 방송일/작성일 정렬을 보존한다.
- [ ] 새 검색 시 page 상태를 초기화한다.
- [ ] 상세 drawer를 제공한다.
- [ ] 로그인 사용자에게 업로드 UI를 제공한다.
- [ ] favorite/blacklist 사용자 문맥을 목록에 반영한다.

### 세트리스트 생성 `/{locale}/setlist/create`

- [ ] YouTube URL 입력과 debounce를 보존한다.
- [ ] 영상을 재생하고 현재 timestamp를 곡 항목에 추가한다.
- [ ] 곡명/timestamp 편집을 지원한다.
- [ ] 단일/전체 선택을 지원한다.
- [ ] 자동/수동 정렬을 지원한다.
- [ ] 선택 삭제, 전체 초기화, 복사를 지원한다.
- [ ] reorder와 player ref 상호작용을 검증한다.

### 세트리스트 상세 `/{locale}/setlist/{id}`

- [ ] route/component에서 DB를 직접 조회하지 않고 server service/API를 사용한다.
- [ ] 존재하지 않는 video ID는 404로 처리한다.
- [ ] `t=<seconds>` 시작 시각을 지원한다.
- [ ] timestamp 클릭 시 해당 시점으로 재생한다.
- [ ] desktop inline player/PiP 전환을 보존한다.
- [ ] mobile은 기존 외부 YouTube 이동 동작을 보존한다.
- [ ] 로그인 사용자의 설명 수정을 지원한다.
- [ ] 작성자 또는 허용된 role만 수정할 수 있다.
- [ ] `userLv>=3` 삭제 권한을 서버에서 검증한다.
- [ ] mutation 후 목록/상세 query를 갱신한다.

### 내 목록 `/{locale}/my`

- [ ] 비로그인 사용자를 `/{locale}/sign-in`으로 이동한다.
- [ ] whitelist 목록을 조회하고 정렬한다.
- [ ] blacklist 목록을 조회하고 정렬한다.
- [ ] whitelist/blacklist 해제를 지원한다.
- [ ] 각각의 loading, empty, error 상태를 제공한다.
- [ ] 만료된 session을 제거하고 로그인 화면으로 이동한다.

### 로그인/로그아웃

- [ ] `/{locale}/sign-in`에서 이미 로그인한 사용자를 홈으로 이동한다.
- [ ] 이메일 입력을 Zod로 검증한다.
- [ ] 인증 코드 발송과 재발송을 지원한다.
- [ ] 8자리 OTP 입력과 paste/focus 이동을 지원한다.
- [ ] 만료 countdown과 만료 UI를 보존한다.
- [ ] 인증 성공 시 session을 영속화한다.
- [ ] `/sign-out`에서 session과 protected query cache를 제거한다.
- [ ] 로그아웃 후 `/ko/sign-in`으로 이동한다.

### 설정 `/{locale}/setting`

- [ ] `theme1`~`theme5` 선택을 보존한다.
- [ ] 기존 localStorage `theme` 값을 그대로 인식한다.
- [ ] theme4/5에서 shadcn dark variant가 동작한다.
- [ ] first paint 이전에 theme를 적용해 flash를 막는다.
- [ ] `ko/en/ja` 언어 변경을 지원한다.
- [ ] 언어 변경 시 현재 path/query를 보존한다.
- [ ] 일정 자동 동기화 on/off를 지원한다.
- [ ] 3/5/10/15/30/60분 간격을 지원한다.

### 지원 및 유틸리티

- [ ] `/{locale}/support`의 Disqus shortname/identifier를 보존한다.
- [ ] Disqus가 SSR, CSP, theme 전환을 방해하지 않는다.
- [ ] `/{locale}/utils`의 desktop sidebar/mobile drawer/breadcrumb를 보존한다.
- [ ] Base64 encode/decode, 반복, swap, copy, paste, invalid input을 지원한다.
- [ ] YouTube URL/video ID를 파싱해 지원 해상도 썸네일을 표시한다.
- [ ] 존재하지 않는 썸네일 해상도는 숨긴다.

### 관리자

- [ ] `/admin/*`는 로그인과 `userLv>=3`를 beforeLoad와 API 양쪽에서 검증한다.
- [ ] 관리자 shell의 responsive header/sidebar를 복원한다.
- [ ] `/admin`에서 이메일과 level을 표시한다.
- [ ] `/admin/metadata`에서 공개 metadata를 조회한다.
- [ ] 허용된 metadata key만 수정한다.
- [ ] metadata 수정 후 server cache와 client query를 갱신한다.
- [ ] `/admin/revalidate` 기능을 인증된 POST cache 관리 기능으로 대체한다.
- [ ] `/admin/member`는 기존 placeholder 유지 또는 별도 기능 명세를 결정한다.

### 개발/오류 페이지

- [ ] `/{locale}/dev`의 production 포함 여부를 결정한다.
- [ ] `/{locale}/icons`의 production 포함 여부를 결정한다.
- [ ] `/{locale}/sentry-test`를 production에서 제거하거나 관리자 보호한다.
- [ ] `/{locale}/error`의 로그아웃 링크를 실제 `/sign-out`으로 수정한다.
- [ ] catch-all 404와 invalid locale을 구분해 처리한다.

## API 체크리스트

### 공통 API 계약

- [ ] 기존 성공 status와 JSON shape를 계약 테스트로 고정한다.
- [ ] 오류 응답을 `{ message, data: null, code? }` 형태로 통일한다.
- [ ] request body, path param, search param, header를 Zod로 검증한다.
- [ ] route handler 타입이 아니라 독립된 contract 타입을 공유한다.
- [ ] raw Oracle row/Mongo document를 응답하지 않는다.
- [ ] stack, secret, verification code, refresh token, private metadata를 응답하지 않는다.
- [ ] DB not-found/conflict/unavailable과 외부 API timeout/quota 오류를 검증한다.
- [ ] protected API는 만료/변조/disabled/disconnected session을 거부한다.
- [ ] role과 object ownership을 server service에서 검증한다.

### 활성 API route 23개

- [ ] `GET /api/auth/google`: Gmail OAuth redirect, 관리자 인증, state/PKCE.
- [ ] `GET /api/auth/callback/google`: state/code 검증, Oracle META credential 갱신.
- [x] `GET /api/hello`: TanStack Start 서버 라우트로 이전; `pnpm build` 통과 확인.
- [ ] `GET /api/test`: signed external endpoint 진단용으로 보호하거나 제거.
- [x] `GET /api/v1/channel`: 전체 channel map 조회를 signed external API adapter로 이전; legacy handler는 query를 사용하지 않음.
- [x] `GET /api/v1/channel/count`: 등록 채널 수 handler 이전; signed external API adapter 사용.
- [x] `GET /api/v1/channel/waiting`: 등록 대기 목록 handler 이전; signed external API adapter 사용.
- [x] `POST /api/v1/channel/check-duplicates`: payload 구조와 URL 길이를 검사한 뒤 signed external API로 전달.
- [x] `POST /api/v1/channel/requests`: 요청 항목 구조와 길이를 검사한 뒤 signed external API로 전달.
- [ ] `GET /api/v1/youtube-channel`: page/size/sort/query/query-type와 YouTube 결합.
- [ ] `GET /api/v1/schedule`: 시간/채널 정렬과 normalized schedule.
- [ ] `GET /api/v1/featured`: top/promising 및 일관된 cache TTL.
- [ ] `GET /api/v1/metadata`: refresh token을 제외한 공개 metadata.
- [ ] `PATCH /api/v1/metadata`: level-3 권한과 key allowlist.
- [ ] `GET /api/v1/member`: 안전한 member DTO와 session renewal.
- [ ] `POST /api/v1/send-verification-code`: email validation, CSPRNG, expiry, rate limit.
- [ ] `POST /api/v1/sign-in`: email/8-digit code, attempt limit, expiry, account state.
- [ ] `GET /api/v1/whitelist`: 인증 사용자의 favorite IDs.
- [ ] `POST /api/v1/whitelist/{channelId}`: 검증된 idempotent 등록.
- [ ] `DELETE /api/v1/whitelist/{channelId}`: 검증된 idempotent 해제.
- [ ] `GET /api/v1/blacklist`: 인증 사용자의 blocked IDs.
- [ ] `POST /api/v1/blacklist/{channelId}`: 검증된 idempotent 등록.
- [ ] `DELETE /api/v1/blacklist/{channelId}`: 검증된 idempotent 해제.
- [ ] `GET /api/v1/setlist`: query/start/sort/isFavorite와 15개 pagination.
- [ ] `POST /api/v1/setlist/{videoId}`: 인증, YouTube 조회, owner 기록, transaction.
- [ ] `PUT /api/v1/setlist/{videoId}`: owner/role 검증과 strict description schema.
- [ ] `DELETE /api/v1/setlist/{videoId}`: level-3 권한과 transaction.
- [ ] `POST /api/v1/reserve/push`: strict payload, token ownership, reserve/cancel 명시.
- [ ] 기존 `GET /api/v1/revalidate`를 인증된 `POST` cache operation으로 교체한다.
- [x] `POST /api/v1/log/error`: 8 KiB 제한, process-local rate limit, message 정제 적용; stack/digest는 응답이나 로그에 포함하지 않음.

### 비활성/잠복 API

- [ ] `src/app/api/_push/route.ts`는 Next private folder라 활성 route가 아님을 기록한다.
- [ ] `src/components/dev/PostBox.tsx`의 잘못된 `/api/api/push` 호출을 제거한다.
- [ ] `src/libraries/error/Fire.tsx`의 존재하지 않는 `/api/v1/test` 호출을 제거한다.
- [ ] `src/temps`는 별도 승인 없이 이관하지 않는다.
- [ ] `src/temps/push/http/route.ts`에 노출된 credential을 폐기/회전한다.
- [ ] 알림 예약은 MongoDB에 저장만 하며 활성 발송 scheduler가 없음을 문서화한다.
- [ ] scheduled delivery를 기능으로 주장하려면 consumer/scheduler와 E2E 검증을 추가한다.

## 데이터 및 서버 체크리스트

### MongoDB

- [ ] `ManagementDB.channel_id_names` 접근을 server-only service로 분리한다.
- [ ] `ManagementDB.featured_channels` 접근을 server-only service로 분리한다.
- [ ] `ScheduleDB.upcoming_streams` 접근을 server-only service로 분리한다.
- [ ] `ScheduleDB.notifications` 접근을 server-only service로 분리한다.
- [ ] singleton/client pool이 Docker 재시작과 반복 요청에서 안전한지 검증한다.
- [ ] graceful shutdown 때 connection을 정리한다.

### OracleDB

- [ ] MEMBER service를 server-only module로 분리한다.
- [ ] SETLIST service와 transaction을 server-only module로 분리한다.
- [ ] WHITELIST/BLACKLIST service를 server-only module로 분리한다.
- [ ] META service에서 public/private key를 분리한다.
- [ ] component/route UI가 OracleDB를 직접 import하지 않는다.
- [ ] connection close와 rollback을 실패 경로까지 테스트한다.
- [ ] Docker image에서 `oracledb` 실행 방식을 검증한다.

### Google/Firebase/외부 서비스

- [ ] YouTube API key를 server runtime env로만 읽는다.
- [ ] Gmail OAuth client secret과 refresh token을 로그/응답/client bundle에서 제외한다.
- [ ] Firebase private key의 줄바꿈과 runtime 주입을 검증한다.
- [ ] foreground notification과 service worker background 동작을 분리해 테스트한다.
- [ ] 외부 채널 등록 API의 URL, 인증, timeout, retry, error schema를 고정한다.
- [ ] signed external endpoint HMAC secret을 server-only로 유지한다.

### Cache

- [ ] Next `revalidateTag`와 `revalidatePath`를 제거한다.
- [ ] schedule은 polling/동적 데이터로 취급한다.
- [ ] channels 기본 TTL 30분을 한 곳에서 관리한다.
- [ ] metadata 기본 TTL 1시간을 한 곳에서 관리한다.
- [ ] featured의 legacy 60초/24시간 충돌을 하나의 정책으로 결정한다.
- [ ] mutation 후 server cache와 TanStack Query cache를 함께 갱신한다.
- [ ] cache 관리 endpoint는 관리자만 호출할 수 있다.

## Tailwind 및 shadcn 체크리스트

- [ ] `components.json`을 프로젝트 alias와 `src/styles.css`에 맞게 설정한다.
- [ ] `src/components/ui/`에 필요한 shadcn source component만 추가한다.
- [ ] `src/lib/utils.ts`에 `clsx` + `tailwind-merge` 기반 `cn`을 둔다.
- [ ] semantic HTML로 대체 가능한 Mantine layout component를 제거한다.
- [ ] Button/ActionIcon 계열을 shadcn Button variant로 통합한다.
- [ ] Input/Textarea/Checkbox/Radio/Switch/Select/OTP를 shadcn으로 교체한다.
- [ ] Modal/Menu/Popover/Tooltip/Drawer를 shadcn primitive로 교체한다.
- [ ] Avatar/Badge/Card/Skeleton/Table/Pagination/Breadcrumb를 교체한다.
- [ ] promise-returning modal stack과 최상단 Escape 동작을 보존한다.
- [ ] portal z-index, focus trap, outside click, scroll lock을 검증한다.
- [ ] layout/spacing/typography/simple state는 Tailwind class로 이동한다.
- [x] Tailwind CSS v4 기본 breakpoint를 사용한다: sm 40rem, md 48rem,
  lg 64rem, xl 80rem, 2xl 96rem. (2026-10-10 사용자 요청으로 기존 xs 및
  커스텀 breakpoint 보존 결정을 변경. `src/styles.css`에 커스텀 breakpoint 없음.)
- [x] 기존 theme-v2 색상 팔레트를 shadcn 의미 토큰과 Tailwind `liveuta-*`
  색상 유틸리티로 연결하고 `theme1`~`theme5`를 `color` 속성으로 적용한다.
  라운드 토큰은 Tailwind CSS v4 스케일과 `rounded-control/card/panel`을 제공한다.
- [ ] theme, safe-area, z-index, schedule 상태색을 semantic token으로 옮긴다.
- [ ] loader keyframe, PiP transform, react-grid-layout, Swiper/OverlayScrollbars
  내부 selector만 최소 global CSS로 남긴다.
- [ ] `.blind`를 `sr-only`로 교체한다.
- [ ] 빈 SCSS module과 stale import를 함께 제거한다.

## Day.js to date-fns 체크리스트

- [ ] `dayjs()`를 `new Date()`로 교체한다.
- [ ] ISO 문자열은 `parseISO`로 파싱한다.
- [ ] `dayjs.Dayjs` 타입을 `Date`로 교체한다.
- [ ] `.subtract(1, 'day')`를 `subDays`로 교체한다.
- [ ] `.add(n, 'second')`를 `addSeconds`로 교체한다.
- [ ] minute diff를 `differenceInMinutes`로 교체한다.
- [ ] millisecond diff를 `differenceInMilliseconds`로 교체한다.
- [ ] `.isBefore/.isAfter`를 `isBefore/isAfter`로 교체한다.
- [ ] `.valueOf()`를 `date.getTime()`으로 교체한다.
- [ ] wire/storage timestamp를 ISO string 또는 명시적인 epoch 단위로 유지한다.
- [ ] `ko -> ko`, `en -> enUS`, `ja -> ja` locale map을 사용한다.
- [ ] global locale mutation을 제거하고 format 호출마다 locale을 전달한다.
- [ ] `YYYY -> yyyy`, `DD -> dd`, `ddd -> EEE`, `A -> a`로 변환한다.
- [ ] 기존 local timezone 표시를 보존한다.
- [ ] invalid ISO, 날짜 경계, 0/59/60분, expiry equality를 테스트한다.
- [ ] shadcn Calendar가 필요한 기능에서만 `react-day-picker`를 추가한다.

## PWA, SEO, 분석 및 오류 처리 체크리스트

- [ ] manifest와 앱 아이콘을 복원한다.
- [ ] robots 정책을 복원한다.
- [ ] sitemap에 locale prefix와 올바른 선행 slash를 적용한다.
- [ ] canonical, Open Graph, theme-color metadata를 복원한다.
- [ ] service worker 등록과 update 전략을 검증한다.
- [ ] Notification permission을 mount 즉시가 아니라 사용자 gesture에서 요청한다.
- [ ] notification click이 올바른 앱 URL을 연다.
- [ ] GA/GTM page view가 SPA navigation마다 발생한다.
- [ ] click event의 target/content/detail 계약을 보존한다.
- [ ] Sentry client/server 초기화를 TanStack/Nitro에 맞게 분리한다.
- [ ] production log와 Sentry event에서 token/email/private data를 redact한다.

## Docker 체크리스트

- [ ] Vite + Nitro Node 빌드가 `.output/server/index.mjs`를 생성한다.
- [ ] `package.json`에 production `start` script가 있다.
- [ ] multi-stage Dockerfile을 사용한다.
- [ ] runtime image는 non-root user로 실행한다.
- [ ] `.env`와 secret 파일을 image에 COPY하지 않는다.
- [ ] 필요한 `public`/Nitro output만 runtime stage에 포함한다.
- [ ] `HOST=0.0.0.0`, `PORT=3000`으로 실행한다.
- [ ] Compose가 host 3010을 container 3000에 연결한다.
- [ ] health endpoint는 DB 연결 없이 process health를 응답한다.
- [ ] readiness 검사가 필요한 경우 MongoDB/OracleDB를 제한 시간 안에 확인한다.
- [ ] container stop에서 server와 DB connection이 정상 종료된다.
- [ ] production image에서 document route, nested route, static asset, public API,
  protected API를 smoke test한다.

## 테스트 및 완료 조건

- [ ] behavior 변경은 failing Vitest test를 먼저 작성한다.
- [ ] 추출한 React component와 custom hook을 jsdom에서 테스트한다.
- [ ] 외부 API/DB만 mock하고 내부 module은 실제로 사용한다.
- [ ] 각 API의 success/validation/auth/not-found/failure 계약을 테스트한다.
- [ ] 각 product route에 Playwright happy path를 둔다.
- [ ] desktop/mobile viewport를 모두 검증한다.
- [ ] 직접 nested URL refresh를 검증한다.
- [ ] 중요 흐름인 로그인, favorite/block, schedule filter, setlist CRUD,
  PiP continuity, multi layout persistence를 E2E로 검증한다.
- [ ] `rg "next/|@mantine/|dayjs|server-only|use client|use server|\.module\.scss" src`
  결과가 0건이다.
- [ ] `package.json`에서 Next, Mantine, Day.js, Sass 및 사용하지 않는 Tiptap
  의존성이 제거됐다.
- [ ] `pnpm test`가 통과한다.
- [ ] `pnpm exec tsc --noEmit`가 통과한다.
- [ ] `pnpm build`가 통과한다.
- [ ] `pnpm exec playwright test`가 통과한다.
- [ ] `docker compose build`가 통과한다.
- [ ] 새 Compose service의 실제 smoke test가 통과한다.
- [ ] 기존 `liveuta-asis/doc/` 이미지와 mobile/desktop 화면을 비교했다.
- [ ] 모든 완료 항목에는 test명, 명령 출력, screenshot 또는 API contract와
  같은 확인 근거가 있다.
- [ ] 새 Docker 배포가 검증되기 전까지 기존 배포를 제거하지 않는다.
