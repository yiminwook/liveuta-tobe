---
name: lexical-editor
description: >
  Lexical 리치텍스트 에디터 컴포넌트 개발 스킬. 사용자가 "에디터", "편집기", "리치텍스트", "lexical", "WYSIWYG", "툴바", "글쓰기", "공지사항 작성/조회", "텍스트 입력 컴포넌트" 등을 언급하면 반드시 이 스킬을 사용하라. 어드민·고객 양쪽 페이지에서 쓰이는 에디터 구현, HTML 직렬화/역직렬화, XSS 방어 sanitizer, 이미지·링크 등 커스텀 플러그인, 읽기전용 뷰어 작업 시 반드시 활성화하라.

  Next.js App Router + React 19 + Lexical v0.42.0 + Tailwind CSS v4 + shadcn/ui(new-york) 기준. 프로젝트에 이미 존재하는 editor-theme.ts, content-editable.tsx, blocks/editor-00/ 패턴을 기반으로 확장한다. SerializedEditorState(JSON)가 1차 직렬화 포맷. HTML 변환 시 isomorphic-dompurify로 XSS sanitize 필수.
---

# Lexical 에디터 개발 스킬

## 핵심 원칙

1. **기존 코드 최대 재활용**: `editor-theme.ts`, `content-editable.tsx`, `blocks/editor-00/` 패턴을 먼저 파악하고 확장
2. **XSS 방어 최우선**: HTML로 직렬화/역직렬화 시 항상 `isomorphic-dompurify`로 sanitize
3. **`"use client"` 필수**: Lexical은 브라우저 API에 의존 — 에디터 컴포넌트는 모두 클라이언트
4. **직렬화 포맷**: JSON(`SerializedEditorState`)이 1차 포맷, HTML은 뷰어 렌더링·서버 저장용

---

## 프로젝트 기존 파일 구조

```
src/components/
├── editor/                          # 공유 UI 기본 요소
│   ├── editor-ui/
│   │   └── content-editable.tsx     # ✅ ContentEditable 래퍼 (이미 존재)
│   └── themes/
│       ├── editor-theme.ts          # ✅ EditorThemeClasses (완성된 테마)
│       └── editor-theme.css         # ✅ 코드 하이라이트 CSS
└── blocks/
    └── editor-00/                   # ✅ 기본 에디터 블록 (이미 존재)
        ├── editor.tsx               # LexicalComposer 래퍼
        ├── nodes.ts                 # 노드 목록
        └── plugins.tsx              # RichTextPlugin + 플로팅 앵커
```

### 새 에디터 변형 추가 패턴

새 기능이 필요하면 `blocks/editor-00/`을 복사하지 말고, **기존 블록을 확장하거나** 새 블록 디렉터리를 만든다:

```
blocks/
├── editor-00/      # 기본 (현재)
├── editor-notice/  # 공지사항 에디터 (이미지·링크 포함)
└── editor-viewer/  # 읽기전용 뷰어 블록
```

---

## 설치 요구사항

### 현재 설치된 패키지 (v0.42.0)

```
lexical, @lexical/react, @lexical/rich-text, @lexical/list
@lexical/link, @lexical/html, @lexical/history
@lexical/selection, @lexical/utils
```

### 추가 설치 필요

```bash
# XSS 방어 (항상 필요 — 아직 미설치 확인 후 추가)
pnpm add isomorphic-dompurify @types/dompurify

# 기능별 선택 추가
pnpm add @lexical/code      # 코드 블록
pnpm add @lexical/markdown  # 마크다운 변환
pnpm add @lexical/table     # 테이블 지원
```

---

## 핵심 패턴

### 1. 에디터 블록 구조 (editor-00 패턴)

**editor.tsx** — LexicalComposer 설정 + OnChangePlugin

```typescript
"use client"

import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { EditorState, SerializedEditorState } from "lexical"
import { editorTheme } from "@/components/editor/themes/editor-theme"
import { TooltipProvider } from "@/components/ui/tooltip"
import { nodes } from "./nodes"
import { Plugins } from "./plugins"

const editorConfig: InitialConfigType = {
  namespace: "NoticeEditor",
  theme: editorTheme,        // 기존 themes/editor-theme.ts 재사용
  nodes,
  onError: (error) => console.error(error),
}

interface Props {
  editorState?: EditorState
  editorSerializedState?: SerializedEditorState
  onChange?: (editorState: EditorState) => void
  onSerializedChange?: (state: SerializedEditorState) => void
}

export function NoticeEditor({ editorState, editorSerializedState, onChange, onSerializedChange }: Props) {
  return (
    <div className="bg-background overflow-hidden rounded-lg border shadow">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState ? { editorState: JSON.stringify(editorSerializedState) } : {}),
        }}
      >
        <TooltipProvider>
          <Plugins />
          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(state) => {
              onChange?.(state)
              onSerializedChange?.(state.toJSON())
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  )
}
```

**nodes.ts** — 필요한 노드 등록

```typescript
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { ListNode, ListItemNode } from "@lexical/list"
import { LinkNode, AutoLinkNode } from "@lexical/link"
import { Klass, LexicalNode, LexicalNodeReplacement, ParagraphNode, TextNode } from "lexical"

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> = [
  HeadingNode,
  ParagraphNode,
  TextNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
  AutoLinkNode,
  // 커스텀 노드 추가 시 여기에 등록
]
```

**plugins.tsx** — 플러그인 조합 (RichText + 툴바 + 기타)

```typescript
"use client"

import { useState } from "react"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ContentEditable } from "@/components/editor/editor-ui/content-editable"
import { EditorToolbar } from "@/components/editor/editor-ui/editor-toolbar"  // 구현 필요

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null)

  return (
    <div className="relative">
      {/* 툴바 */}
      <EditorToolbar />

      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div>
              <div ref={(el) => el && setFloatingAnchorElem(el)}>
                <ContentEditable placeholder="내용을 입력하세요..." />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        {/* 플로팅 플러그인 (floatingAnchorElem 사용) */}
      </div>

      <HistoryPlugin />
      <ListPlugin />
      <LinkPlugin />
    </div>
  )
}
```

---

## XSS Sanitization (필수)

`$generateHtmlFromNodes`는 raw HTML을 반환하므로 **반드시 sanitize** 후 저장·렌더링.
`dangerouslySetInnerHTML`은 sanitize 완료 후에만 허용.

### utils/sanitize.ts

```typescript
// src/components/editor/utils/sanitize.ts — 에디터 전용 sanitize 유틸

import DOMPurify from "isomorphic-dompurify"

/** 에디터 저장용 — 쓰기 허용 태그 */
const EDITOR_CONFIG = {
  ALLOWED_TAGS: [
    "p", "br", "strong", "em", "u", "s",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li", "blockquote",
    "a", "img", "span", "div", "pre", "code",
  ],
  ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "width", "height", "class"],
  FORBID_SCRIPTS: true,
}

/** 뷰어 렌더링용 — form 요소 추가 차단 */
const VIEWER_CONFIG = {
  ...EDITOR_CONFIG,
  FORBID_TAGS: ["form", "input", "button", "select", "textarea", "iframe", "script"],
}

/** 에디터 HTML 저장 전 sanitize */
export function sanitizeEditorHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, EDITOR_CONFIG)
}

/** 뷰어 렌더링 전 sanitize (더 엄격) */
export function sanitizeViewerHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, VIEWER_CONFIG)
}
```

### HTML 직렬화 패턴

```typescript
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html"
import { $getRoot, $insertNodes } from "lexical"
import { sanitizeEditorHtml } from "@/components/editor/utils/sanitize"

// 에디터 → HTML (저장 전)
function exportHtml(editor: LexicalEditor): string {
  let html = ""
  editor.read(() => {
    const raw = $generateHtmlFromNodes(editor, null)
    html = sanitizeEditorHtml(raw)  // 저장 전 항상 sanitize
  })
  return html
}

// HTML → 에디터 초기값 (불러오기)
function importHtml(editor: LexicalEditor, html: string): void {
  const sanitized = sanitizeEditorHtml(html)  // 입력도 항상 sanitize
  editor.update(() => {
    const parser = new DOMParser()
    const dom = parser.parseFromString(sanitized, "text/html")
    const nodes = $generateNodesFromDOM(editor, dom)
    $getRoot().clear()
    $getRoot().select()
    $insertNodes(nodes)
  })
}
```

---

## 읽기전용 뷰어

서버/클라이언트 양쪽에서 쓸 수 있도록 두 가지 접근:

### A. HTML 뷰어 (sanitize 후 dangerouslySetInnerHTML)

```typescript
// src/components/editor/lexical-viewer.tsx
"use client"

import { sanitizeViewerHtml } from "./utils/sanitize"
import { cn } from "@/lib/utils"

interface Props {
  html: string          // 서버에서 가져온 raw HTML
  className?: string
}

export function LexicalViewer({ html, className }: Props) {
  const safe = sanitizeViewerHtml(html)

  return (
    <div
      className={cn("prose prose-sm dark:prose-invert max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: safe }}  // sanitize 완료 후 사용
    />
  )
}
```

### B. Lexical 읽기전용 에디터 (JSON 상태 기반)

```typescript
// editable: false 설정으로 읽기전용 Lexical 인스턴스
const viewerConfig: InitialConfigType = {
  namespace: "Viewer",
  theme: editorTheme,
  nodes,
  editable: false,       // 핵심: 읽기전용
  editorState: JSON.stringify(serializedState),
  onError: console.error,
}
```

---

## 커스텀 플러그인 패턴 (이미지 예시)

커스텀 기능은 세 파일이 세트:

```
nodes/image-node.tsx          # 에디터 내부 표현
plugins/image-plugin.tsx      # 명령어 등록 + 처리
```

```typescript
// 1. 명령어 정의
import { createCommand, LexicalCommand } from "lexical"

export interface TImagePayload {
  src: string
  alt: string
  width?: number
  height?: number
}

export const INSERT_IMAGE_COMMAND: LexicalCommand<TImagePayload> =
  createCommand("INSERT_IMAGE_COMMAND")

// 2. 플러그인에서 명령어 등록
import { COMMAND_PRIORITY_EDITOR } from "lexical"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

export function ImagePlugin(): null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        editor.update(() => {
          const node = $createImageNode(payload)
          $insertNodes([node])
        })
        return true
      },
      COMMAND_PRIORITY_EDITOR
    )
  }, [editor])

  return null
}

// 3. nodes.ts에 등록
import { ImageNode } from "./nodes/image-node"
export const nodes = [...baseNodes, ImageNode]
```

---

## 툴바 구현 패턴

```typescript
"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { FORMAT_TEXT_COMMAND } from "lexical"
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list"
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered } from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"

export function EditorToolbar() {
  const [editor] = useLexicalComposerContext()

  return (
    <div className="flex items-center gap-0.5 border-b p-1 flex-wrap">
      <Toggle size="sm" onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}>
        <Bold className="size-4" />
      </Toggle>
      <Toggle size="sm" onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}>
        <Italic className="size-4" />
      </Toggle>
      <Toggle size="sm" onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}>
        <Underline className="size-4" />
      </Toggle>
      <Toggle size="sm" onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")}>
        <Strikethrough className="size-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Toggle size="sm" onPressedChange={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}>
        <List className="size-4" />
      </Toggle>
      <Toggle size="sm" onPressedChange={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}>
        <ListOrdered className="size-4" />
      </Toggle>
    </div>
  )
}
```

---

## react-hook-form 통합

```typescript
"use client"

import { Controller, useFormContext } from "react-hook-form"
import { NoticeEditor } from "@/components/blocks/editor-notice"
import type { SerializedEditorState } from "lexical"

// SerializedEditorState를 form 필드로 관리
function EditorField({ name }: { name: string }) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <NoticeEditor
          editorSerializedState={field.value}
          onSerializedChange={field.onChange}
        />
      )}
    />
  )
}
```

---

## 타입 정의 (T-prefix 컨벤션)

```typescript
export type TEditorFormat = "html" | "json"

export interface TImagePayload {
  src: string
  alt: string
  width?: number
  height?: number
}

export interface TEditorProps {
  editorSerializedState?: SerializedEditorState
  onChange?: (state: SerializedEditorState) => void
  placeholder?: string
  readOnly?: boolean
}
```

---

## 자주 실수하는 패턴

### ❌ sanitize 없이 HTML 렌더링

```typescript
<div dangerouslySetInnerHTML={{ __html: rawHtml }} />  // XSS 위험
```

### ✓ 항상 sanitize 후 렌더링

```typescript
const safe = sanitizeViewerHtml(rawHtml)
<div dangerouslySetInnerHTML={{ __html: safe }} />
```

### ❌ 서버 컴포넌트에서 Lexical 사용

```typescript
// page.tsx — 서버 컴포넌트에서 직접 LexicalComposer 사용 불가
export default function Page() {
  return <LexicalComposer>...</LexicalComposer>  // 에러
}
```

### ✓ "use client" + page → home 분리 패턴

```typescript
// home.tsx
"use client"
export function NoticeHome() {
  return <NoticeEditor />
}

// page.tsx — 서버 컴포넌트
export default function Page() {
  return <Suspense fallback={<Spinner />}><NoticeHome /></Suspense>
}
```

### ❌ editorTheme을 새로 작성

이미 `@/components/editor/themes/editor-theme.ts`에 완성된 테마 존재. 재사용할 것.

---

## 리서치 우선순위 (모르는 API가 있을 때)

1. 해당 `@lexical/*` 패키지 TypeScript 타입 정의 및 JSDoc 주석
2. https://shadcn-editor.vercel.app/docs — shadcn/ui 스타일 에디터 레퍼런스
3. https://lexical.dev/docs/intro — 공식 문서
4. GitHub Issues/Discussions (facebook/lexical)
5. Stack Overflow → Reddit (r/reactjs)
