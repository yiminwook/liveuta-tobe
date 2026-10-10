# Liveuta 디자인 시스템

Liveuta의 색상, 라운드, 반응형 breakpoint는 Tailwind CSS v4와 shadcn/ui를
기준으로 관리한다. 전역 토큰의 단일 기준 파일은 [`src/styles.css`](../src/styles.css)다.
이전 프로젝트의 다섯 색상 테마는 유지하되, Mantine 및 Sass 변수 체계는 사용하지 않는다.
관리자 페이지의 셸, 데이터 그리드, 리치 텍스트 편집 기준은
[관리자 디자인 시스템](./admin-design-system.md)을 따른다.

## 사용 원칙

- 기본 스타일은 JSX의 Tailwind 유틸리티로 표현한다.
- shadcn 컴포넌트와 공통 UI는 `background`, `foreground`, `primary`, `muted`,
  `border`, `ring` 같은 의미 토큰을 사용한다.
- 제품 고유의 팔레트나 상태색은 `liveuta-*` 토큰을 사용한다.
- 현재 테마에 따라 바뀌는 색은 CSS 변수를 `:root[color="themeN"]`에서 정의한다.
  `@theme inline`에는 해당 변수를 Tailwind 유틸리티에 연결한다.
- JSX에서 색상 hex 값이나 기존 프로젝트의 변수명을 직접 반복하지 않는다.
- 반응형 레이아웃은 Tailwind 기본 breakpoint와 mobile-first 유틸리티를 사용한다.
- 전역 CSS는 토큰, 브라우저 기본 스타일, 필요한 외부 DOM 스타일에 한정한다.

## 5개 테마

루트 HTML의 `color` 속성이 테마 선택의 기준이다. `theme1`~`theme3`은 라이트,
`theme4`~`theme5`는 다크 테마다. 운영체제 설정을 따르는 `auto` 모드는 없다.

| 속성 | 유형 | 주요 팔레트 | 배경 / 기본 텍스트 |
| --- | --- | --- | --- |
| `color="theme1"` | 라이트 | 핑크 `#ffc1cc`, 코랄 `#fa8072`, 로즈 `#e45c75` | 흰색 / 검정 |
| `color="theme2"` | 라이트 | 그린 `#c8e9ca`, 골드 `#ffd700`, 그린 `#64aa2b` | 흰색 / 검정 |
| `color="theme3"` | 라이트 | 스카이 `#ace7ff`, 오렌지 `#ff6e2b`, 레드오렌지 `#ff3e29` | 흰색 / 검정 |
| `color="theme4"` | 다크 | 네이비 `#0d1524`, 블루 `#466db6`, 골드 `#ffd700` | 검정 / 흰색 |
| `color="theme5"` | 다크 | 브라운 `#251c1c`, 다크 브라운 `#341809`, 레드 `#f00` | 검정 / 흰색 |

테마는 `localStorage`의 `theme` 키에 `theme1`~`theme5` 값으로 저장한다.
테마 변경 코드는 [`src/components/ThemeToggle.tsx`](../src/components/ThemeToggle.tsx)에,
첫 화면 깜빡임을 막는 초기 적용 코드는 [`src/routes/__root.tsx`](../src/routes/__root.tsx)에 있다.
새 테마를 추가하거나 테마 ID를 바꿀 때는 CSS 팔레트, 선택 UI, 초기화 코드의 허용값을
함께 변경해야 한다. 저장된 값이 없거나 유효하지 않으면 `theme1`을 사용한다.

theme4와 theme5에서는 `dark` 클래스를 함께 설정하므로 Tailwind의 `dark:` 변형도 동작한다.
테마 색 자체는 클래스가 아니라 `color` 속성으로 결정한다.

## 스케줄 화면 레이아웃

스케줄은 Liveuta의 핵심 화면이다. 새 `/{locale}/schedule` 구현은 카드만 그리드로
나열하는 페이지가 아니라, **전역 헤더 → 필터/도구 모음 → 필요 시 라이브 플레이어 →
일정 카드 목록** 순서를 유지한다. 화면은 뷰포트 전체 너비를 사용하며, 다른 데모 페이지의
`max-w-6xl` 같은 좁은 콘텐츠 폭을 스케줄 전체에 적용하지 않는다.

레거시 화면 참고 자료는 `liveuta-asis/doc/schedule-page.png`와
`liveuta-asis/doc/schedule-live.png`다. 기존 페이지는 스케줄 탐색 도구를 상단에 두고,
라이브 필터에서는 데스크톱 플레이어와 채팅을 카드 목록보다 위에 배치했다.

### 페이지 순서와 도구 모음

1. 전역 헤더 아래에 스케줄 도구 모음을 둔다.
2. 로그인 상태에서는 즐겨찾기 필터를 표시한다.
3. `예정`, `라이브`, `24시`, `전체` 필터는 데스크톱에서 세그먼트 탭으로 보여준다.
   선택 상태는 URL의 `t=scheduled|live|daily|all`이 결정하며 기본값은 `scheduled`다.
4. 검색어와 검색 초기화 동작을 제공한다. 검색어는 `q`에 저장한다.
5. 모바일에서는 좁은 탭과 컨트롤을 한 줄에 모두 넣지 않는다. 현재 필터, 영상 유형,
   결과 개수를 요약한 버튼을 제공하고, 눌렀을 때 필터·검색·유형 선택을 한 패널에 모은다.
6. 전체/방송/영상 개수는 유형 선택과 함께 확인할 수 있게 한다. 사용자가 필터를 바꿔도
   검색어, 즐겨찾기 조건 등 다른 URL 검색 상태는 유지한다.

모바일 도구 모음은 전역 헤더 바로 아래에서 고정하고, 상단 safe area를 반영한다.
데스크톱에서는 문서 흐름 안에서 전체 너비의 가로 도구 모음으로 표시한다. 고정 영역이
카드 첫 행을 가리지 않도록 헤더 높이와 safe area만큼 콘텐츠 시작 위치를 확보한다.

### 라이브 레이아웃

`t=live`에서는 데스크톱에서 라이브 플레이어를 카드 그리드 위에 표시한다. 플레이어와
YouTube 채팅은 한 패널 안의 좌우 열로 배치하고, 영상 영역이 주 공간을 차지하게 한다.
좁은 화면에서는 이 인라인 플레이어/채팅 패널을 숨기고 일정 카드 목록을 우선한다.
플레이어가 뷰포트 밖으로 이동할 때는 PiP 동작과 중복 재생되지 않도록 조정한다.

### 일정 카드 그리드

카드는 화면 너비에 따라 열 수를 늘린다. Tailwind 기본 breakpoint를 적용한 기본 배열은
다음과 같다.

| 화면 너비 | 그리드 |
| --- | --- |
| 기본 (`sm` 미만) | 1열, 카드 내부는 썸네일과 정보가 가로 배치 |
| `sm` (`40rem`) | 2열, 카드 내부 세로 배치 |
| `md` (`48rem`) | 3열 |
| `lg` (`64rem`) | 4열 |
| `xl` (`80rem`) | 4열 유지 |
| `2xl` (`96rem`) | 5열 |

```tsx
<ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
  {/* ScheduleCard */}
</ul>
```

기본 화면에서는 썸네일을 왼쪽에 두고 채널/제목/시간을 오른쪽에 배치한다. `sm`부터는
썸네일 위, 텍스트 아래의 세로형 카드로 전환하고 썸네일 비율은 `16 / 9`로 유지한다.
카드 정보는 채널명 한 줄, 제목 두 줄, 시간 한 줄을 기준으로 잘라내어 같은 행의 높이를
안정적으로 맞춘다. 카드 메뉴, 즐겨찾기, 차단, 알림 동작은 썸네일이나 제목을 가리지 않게
배치하고 키보드 포커스와 터치 조작 영역을 보장한다.

예정된 일정에는 `bg-liveuta-schedule-closed`, 라이브 중인 일정에는
`bg-liveuta-schedule-stream`을 사용한다. 라이브 채널명/제목은 일정 상태 텍스트 토큰을
사용한다. 차단 상태는 카드 뒤집기 같은 시각 효과만으로 전달하지 말고, 텍스트와 접근 가능한
상태 표현도 제공한다.

### 목록 상태

- 로딩 중에는 최종 그리드와 같은 열·카드 구조의 skeleton을 보여 레이아웃 이동을 줄인다.
- 결과가 없으면 빈 상태를 표시한다. 검색 결과가 없는 경우 채널 검색으로 이어지는 동작도
  제공한다.
- 무한 스크롤은 다음 페이지를 불러오는 동안 목록 끝에 진행 상태를 표시한다.
- 오류와 빈 결과는 서로 구별한다. 고정 도구 모음, 라이브 패널, 기존 카드 목록은 오류
  안내로 가려지지 않게 한다.

## 색상 토큰

### shadcn 의미 토큰

컴포넌트 목적에 맞는 토큰을 선택한다. 각 값은 다섯 테마에서 교체된다.

| 목적 | Tailwind 예시 |
| --- | --- |
| 기본 화면과 텍스트 | `bg-background`, `text-foreground` |
| 카드 | `bg-card`, `text-card-foreground` |
| 팝오버 | `bg-popover`, `text-popover-foreground` |
| 주요 동작 | `bg-primary text-primary-foreground` |
| 보조 요소 | `bg-secondary text-secondary-foreground` |
| 약한 배경과 설명 텍스트 | `bg-muted text-muted-foreground` |
| 선택·강조 상태 | `bg-accent text-accent-foreground` |
| 경계선과 포커스 | `border-border`, `ring-ring` |
| 파괴적 동작 | `bg-destructive` |

### Liveuta 팔레트

`first`, `second`, `third`, `fourth`는 기존 테마 팔레트의 네 색상 그룹이다.
각 그룹은 기본값 외에 `light`, `lighter`, `dark`, `darken` 단계가 있다.
기본 색은 아래와 같이 쓴다.

```tsx
<div className="bg-liveuta-first text-liveuta-text">
  <button className="rounded-control bg-primary text-primary-foreground">
    저장
  </button>
</div>
```

예를 들어 `bg-liveuta-third`, `text-liveuta-second-light`,
`border-liveuta-first-dark`, `bg-liveuta-fourth/50`처럼 Tailwind 색상 유틸리티와
불투명도 modifier를 조합한다. 텍스트, 제목, 활성 상태는 각각
`text-liveuta-text`, `text-liveuta-title`, `text-liveuta-text-active`를 사용한다.

일정의 예약/방송 상태에는 `liveuta-schedule-closed`,
`liveuta-schedule-stream`, `liveuta-schedule-stream-text` 토큰을 쓴다.
다섯 테마에 이미 정의된 상태 의미를 컴포넌트별 임의 색으로 대체하지 않는다.

## 라운드

Tailwind의 `rounded-*` 유틸리티를 사용한다. 자주 쓰는 값은 다음과 같다.

| 토큰 | 크기 | 권장 용도 |
| --- | --- | --- |
| `rounded-xs` | `0.25rem` | 작은 배지, 미세한 모서리 |
| `rounded-sm` | `0.375rem` | 작은 인라인 요소 |
| `rounded-md` | `0.5rem` | 입력, 버튼 등 기본 컨트롤 |
| `rounded-lg` | `0.625rem` | 기본 shadcn 표면 |
| `rounded-xl` | `0.875rem` | 강조 카드 |
| `rounded-2xl` | `1rem` | 큰 카드 |
| `rounded-3xl` | `1.5rem` | 넓은 패널 |
| `rounded-4xl` | `2rem` | 큰 장식 표면 |
| `rounded-control` | `0.5rem` | 버튼, 입력, 선택 UI |
| `rounded-card` | `0.75rem` | 카드 |
| `rounded-panel` | `1rem` | 큰 콘텐츠 패널 |

공통 역할이 명확하면 `control`, `card`, `panel` 토큰을 우선한다. 원형 아바타나
칩은 `rounded-full`을 사용한다. 새 반경이 필요할 때는 먼저 기존 스케일을 조합하고,
여러 컴포넌트에서 반복될 때만 `@theme inline`에 토큰을 추가한다.

## Breakpoint와 반응형 레이아웃

Tailwind CSS v4 기본값을 사용하며 프로젝트 전용 breakpoint를 선언하지 않는다.
기본 유틸리티는 작은 화면부터 적용하고, 더 넓은 화면의 변경만 접두사로 덧붙인다.

| 접두사 | 최소 너비 |
| --- | ---: |
| `sm:` | `40rem` (640px) |
| `md:` | `48rem` (768px) |
| `lg:` | `64rem` (1024px) |
| `xl:` | `80rem` (1280px) |
| `2xl:` | `96rem` (1536px) |

```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {/* 콘텐츠 */}
</div>
```

`@theme`에 `--breakpoint-*`를 추가하거나 별도 media query로 같은 breakpoint를
재정의하지 않는다. 컴포넌트별로 꼭 필요한 동작 차이가 있을 때만 일반 CSS media query를
사용하고, 일반적인 폭·간격·배치는 반응형 Tailwind 클래스에 둔다.

## 새 토큰 추가

1. 토큰이 컴포넌트의 역할을 나타내는지, Liveuta 제품 고유 색상인지 판단한다.
2. 테마에 따라 달라지는 값이면 다섯 `:root[color="themeN"]` 모두에 값을 정의한다.
3. `@theme inline`에서 CSS 변수를 Tailwind 네임스페이스에 연결한다.
4. UI에서는 새 변수명을 직접 쓰기보다 생성된 유틸리티를 사용한다.
5. 테마별 색 대비와 라이트/다크 표면에서의 적용을 확인한다.

전역 토큰을 변경했다면 이 문서도 함께 갱신한다.
