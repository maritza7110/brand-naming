# Phase 6: 모바일 반응형 - Research

**Researched:** 2026-04-02
**Domain:** CSS responsive layout, Tailwind CSS 4 breakpoints, touch UX optimization
**Confidence:** HIGH

## Summary

Phase 6은 기존 데스크톱 전용 레이아웃(70/30 좌우 분할, min-w-[1024px] 강제)을 모바일 반응형으로 전환하는 작업이다. 새로운 라이브러리 도입 없이 Tailwind CSS 4.x의 `lg:` 브레이크포인트 유틸리티만으로 구현한다. 핵심은 mobile-first 접근: 기본 스타일이 모바일이고, `lg:` 접두사로 데스크톱 스타일을 오버라이드한다.

수정 대상은 8개 기존 파일의 className 변경 + App.tsx에 자동 스크롤 로직 추가이다. 새 컴포넌트나 npm 패키지는 필요 없다. UI-SPEC에 모든 Tailwind 클래스 변환이 명시되어 있으므로, 계획은 이 사양을 충실히 따르면 된다.

**Primary recommendation:** mobile-first className 교체를 레이아웃 계층(AppLayout > InputPanel/RecommendPanel > Section > UI)순으로 진행하고, 각 단계에서 데스크톱 레이아웃이 깨지지 않았는지 확인한다.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** 모바일에서 입력 폼 아래에 추천 패널이 고정 스택으로 배치 (탭/FAB 전환 아님)
- **D-02:** 모바일에서 추천 버튼 클릭 후 추천 결과 영역으로 부드럽게 자동 스크롤 (scrollIntoView smooth)
- **D-03:** 모바일에서 업종 4개 드롭다운(대/중/소분류 + 비고)을 2x2 grid -> 1열 세로 스택으로 변경
- **D-04:** 모바일에서 모든 2열 grid 필드를 1열로 변경 (업종뿐 아니라 위치+규모, 가격대+타겟 등 전부)
- **D-05:** 모바일에서 히어로 영역 축소 -- 제목/설명 컴팩트하게
- **D-06:** API설정/네이밍 초기화 버튼을 히어로 아래로 재배치 (데스크톱의 우측 배치 -> 모바일에서 하단 배치)

### Claude's Discretion
- 구체적인 Tailwind 브레이크포인트 전환 전략 (lg: 기준)
- 터치 타겟 크기, 패딩, 폰트 크기 조정 범위 (MOBILE-03)
- 자동 스크롤 타이밍 및 오프셋
- 히어로 축소 시 구체적인 폰트/패딩 값

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MOBILE-01 | 모바일에서 입력(위) + 추천(아래) 세로 스택 레이아웃이 표시된다 | AppLayout `flex flex-col` + `lg:grid lg:grid-cols-[7fr_3fr]` 전환, InputPanel/RecommendPanel 반응형 속성 |
| MOBILE-02 | AppLayout의 하드코딩 min-w가 제거되고 lg: 브레이크포인트 반응형으로 전환된다 | `min-w-[1024px]` 제거, Tailwind 4 `lg:` = 1024px 기본값 확인 |
| MOBILE-03 | 모바일에서 터치 타겟, 패딩, 폰트 크기 등 터치 UX가 최적화된다 | 버튼 py-3 확대(44px), 패딩 축소, 히어로 폰트 반응형, grid-cols-1 전환 |
</phase_requirements>

## Standard Stack

### Core (이미 설치됨 -- 변경 없음)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 4.2.2 | 반응형 유틸리티 (`lg:` 접두사) | 프로젝트 전체 스타일링 도구, 이미 사용 중 |
| @tailwindcss/vite | 4.2.2 | Vite 빌드 통합 | 이미 설치됨 |
| React | 19.2.4 | UI 프레임워크 | 이미 사용 중 |

### Supporting
추가 라이브러리 없음. `scrollIntoView`는 브라우저 네이티브 API.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Tailwind `lg:` | CSS @media query | Tailwind이 이미 프로젝트 표준. 직접 미디어 쿼리 작성은 일관성 파괴 |
| scrollIntoView | scroll-behavior: smooth + anchor | scrollIntoView가 더 정밀한 제어 가능 (block, inline, behavior) |
| mobile-first | desktop-first (max-width) | Tailwind 기본이 mobile-first. 역행하면 코드 복잡도 증가 |

**Installation:** 없음 (기존 패키지만 사용)

## Architecture Patterns

### 수정 대상 파일 구조
```
src/
├── App.tsx                          # 자동 스크롤 로직 추가
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx            # 최우선: min-w 제거 + flex/grid 반응형
│   │   ├── InputPanel.tsx           # h-screen/overflow/패딩 반응형 + 히어로 재배치
│   │   └── RecommendPanel.tsx       # sticky/h-screen 반응형 + border 방향
│   ├── sections/
│   │   └── StoreBasicSection.tsx    # grid-cols-2 -> grid-cols-1 lg:grid-cols-2
│   ├── recommend/
│   │   ├── EmptyState.tsx           # "왼쪽" -> 반응형 카피
│   │   └── RecommendGroup.tsx       # 그룹 헤더 터치 타겟 확대
│   └── ui/
│       └── RecommendButton.tsx      # 모바일 py 확대
└── index.html                       # viewport 메타 태그 확인 (이미 있음)
```

### Pattern 1: Mobile-First Responsive Classes
**What:** 기본 className이 모바일 스타일이고, `lg:` 접두사로 데스크톱 스타일을 추가하는 패턴
**When to use:** 이 Phase의 모든 반응형 변환에 적용
**Example:**
```typescript
// Source: Tailwind CSS 4 docs - Responsive Design
// BEFORE (desktop only):
className="grid grid-cols-[7fr_3fr] min-h-screen min-w-[1024px]"

// AFTER (mobile-first):
className="flex flex-col lg:grid lg:grid-cols-[7fr_3fr] min-h-screen"
```

### Pattern 2: Conditional Text by Breakpoint
**What:** `hidden`/`lg:hidden`/`lg:inline` 조합으로 브레이크포인트별 텍스트 표시
**When to use:** EmptyState의 "왼쪽"/"위의" 카피 전환
**Example:**
```tsx
// Source: UI-SPEC Copywriting Contract
<p className="text-[11px] text-[#A09890] leading-relaxed">
  <span className="lg:hidden">위의</span>
  <span className="hidden lg:inline">왼쪽</span>
  {' '}항목을 입력하고<br />추천 받기를 눌러보세요
</p>
```

### Pattern 3: Auto-Scroll on Mobile
**What:** API 응답 완료 후 추천 패널로 smooth scroll (모바일 전용)
**When to use:** App.tsx에서 추천 로직 완료 시점
**Example:**
```tsx
// Source: CONTEXT.md D-02 + UI-SPEC Interaction Contract
const recommendPanelRef = useRef<HTMLDivElement>(null);

// useRecommend 훅의 recommend 함수 완료 후
// 또는 isLoading이 true->false로 전환될 때
useEffect(() => {
  if (!isLoading && batches.length > 0) {
    // 모바일에서만 스크롤
    if (window.innerWidth < 1024 && recommendPanelRef.current) {
      setTimeout(() => {
        recommendPanelRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100); // DOM 렌더링 대기
    }
  }
}, [isLoading]);

// RecommendPanel에 ref 전달
<div ref={recommendPanelRef} className="scroll-mt-4">
  <RecommendPanel>...</RecommendPanel>
</div>
```

### Anti-Patterns to Avoid
- **데스크톱 스타일을 먼저 쓰고 모바일 오버라이드:** Tailwind은 mobile-first. `lg:` 없는 값이 모바일, `lg:` 있는 값이 데스크톱. 반대로 하면 코드가 복잡해짐
- **window.innerWidth 대신 CSS matchMedia:** 자동 스크롤 한 곳에서만 JS로 뷰포트 체크하므로 `window.innerWidth < 1024`가 충분. matchMedia 리스너까지 필요 없음
- **새 컴포넌트 생성:** 이 Phase는 기존 컴포넌트의 className 수정만 함. 새 `MobileLayout` 같은 컴포넌트 생성 불필요
- **overflow-hidden 실수:** InputPanel의 `overflow-y-auto`를 모바일에서 `overflow-visible`로 바꿀 때, 자식 요소가 넘치지 않는지 확인

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 브레이크포인트 감지 | JS resize 리스너 + state | Tailwind `lg:` CSS-only | CSS가 더 성능적이고, JS 상태 동기화 불필요 |
| Smooth scroll | CSS scroll-behavior + JS 조합 | `scrollIntoView({ behavior: 'smooth' })` | 네이티브 API가 모든 브라우저 지원 |
| 터치 타겟 크기 | 커스텀 래퍼 컴포넌트 | 직접 padding 조정 (`py-3 lg:py-2`) | 단순 패딩 변경으로 충분 |
| 조건부 텍스트 | JS 조건문 + state | Tailwind `hidden`/`lg:inline` | CSS-only가 더 깔끔, hydration mismatch 없음 |

**Key insight:** 이 Phase는 순수 CSS 반응형 작업이다. JS 로직은 자동 스크롤 하나뿐이고, 나머지는 전부 Tailwind className 교체다.

## Common Pitfalls

### Pitfall 1: 데스크톱 레이아웃 회귀
**What goes wrong:** 모바일 스타일을 기본으로 바꾸면서 데스크톱의 기존 레이아웃이 깨짐
**Why it happens:** mobile-first로 전환할 때 `lg:` 접두사를 빠뜨리거나, 기존 값을 제거만 하고 `lg:` 버전을 추가하지 않음
**How to avoid:** 변경 전후로 1024px 이상 뷰포트에서 반드시 비교 확인. 각 컴포넌트 변환 후 즉시 데스크톱 테스트
**Warning signs:** grid가 세로로 쌓이거나, 패딩이 과도하게 작아지거나, sticky가 풀림

### Pitfall 2: InputPanel h-screen이 모바일에서 콘텐츠 잘림
**What goes wrong:** 모바일에서 `h-screen`이 남아있으면 긴 폼이 뷰포트에 갇힘
**Why it happens:** `h-auto lg:h-screen` 전환을 놓침
**How to avoid:** 모바일에서 `h-auto` + `overflow-visible` 조합 확인
**Warning signs:** 모바일에서 스크롤이 안 되거나, 하단 섹션이 잘림

### Pitfall 3: RecommendPanel sticky가 모바일에서 오동작
**What goes wrong:** 모바일 세로 스택에서 `sticky top-0`이 남아있으면 추천 패널이 화면 상단에 붙음
**Why it happens:** `static lg:sticky` 전환을 놓침
**How to avoid:** 모바일에서 `static` + `h-auto` + `overflow-visible` 확인
**Warning signs:** 스크롤 시 추천 패널이 뷰포트 상단에 고정됨

### Pitfall 4: 자동 스크롤 타이밍 문제
**What goes wrong:** API 응답 후 DOM이 아직 렌더링되지 않은 상태에서 scrollIntoView 호출
**Why it happens:** React 상태 업데이트 -> DOM 반영 사이의 비동기 갭
**How to avoid:** setTimeout 100ms 지연 (UI-SPEC 명시). 또는 requestAnimationFrame 사용
**Warning signs:** 스크롤이 잘못된 위치로 이동하거나 아예 안 됨

### Pitfall 5: 섹션 카드 p-7 -> p-5 반응형 누락
**What goes wrong:** 3개 섹션(StoreBasic, BrandVision, Persona) 모두에 일관되게 적용해야 하는데 일부만 변경
**Why it happens:** 반복 작업에서 일부 파일 누락
**How to avoid:** 수정 대상 파일 목록을 체크리스트로 관리
**Warning signs:** 섹션 간 패딩이 불일치

### Pitfall 6: viewport 메타 태그 누락
**What goes wrong:** 모바일 브라우저가 데스크톱 뷰포트로 렌더링
**Why it happens:** index.html에 메타 태그가 없음
**How to avoid:** 확인 완료 -- `index.html`에 이미 `<meta name="viewport" content="width=device-width, initial-scale=1.0">` 존재
**Warning signs:** 해당 없음 (이미 해결됨)

## Code Examples

### AppLayout 전환 (최우선 -- MOBILE-02)
```tsx
// Source: 06-UI-SPEC.md Layout Transformation Contract
// BEFORE:
<div className="grid grid-cols-[7fr_3fr] min-h-screen min-w-[1024px]">

// AFTER:
<div className="flex flex-col lg:grid lg:grid-cols-[7fr_3fr] min-h-screen">
```

### InputPanel 전환 (MOBILE-01 + MOBILE-03)
```tsx
// Source: 06-UI-SPEC.md InputPanel section
// BEFORE:
<main className="overflow-y-auto h-screen scroll-smooth bg-[#2C2825]">
  <div className="max-w-[640px] mx-auto px-8 pt-12 pb-20">

// AFTER:
<main className="overflow-visible lg:overflow-y-auto h-auto lg:h-screen scroll-smooth bg-[#2C2825]">
  <div className="max-w-none lg:max-w-[640px] mx-auto px-5 lg:px-8 pt-6 lg:pt-12 pb-8 lg:pb-20">
```

### 히어로 영역 전환 (D-05, D-06)
```tsx
// Source: 06-UI-SPEC.md Hero Area section
// 히어로 컨테이너 BEFORE:
<div className="relative rounded-2xl bg-[#363230] px-8 py-9 mb-10">

// AFTER:
<div className="relative rounded-2xl bg-[#363230] px-5 lg:px-8 py-6 lg:py-9 mb-10">

// 히어로 내부 flex BEFORE:
<div className="relative flex items-start justify-between">

// AFTER:
<div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

// 제목 BEFORE:
<h1 className="text-[26px] font-bold ...">

// AFTER:
<h1 className="text-[22px] lg:text-[26px] font-semibold ...">

// 버튼 그룹 BEFORE:
<div className="flex flex-col items-end gap-2">

// AFTER:
<div className="flex flex-row gap-2 lg:flex-col lg:items-end lg:gap-2">
```

### RecommendPanel 전환
```tsx
// Source: 06-UI-SPEC.md RecommendPanel section
// BEFORE:
<aside className="sticky top-0 h-screen overflow-y-auto bg-[#252220] border-l border-[#4A4440]">

// AFTER:
<aside className="static lg:sticky lg:top-0 h-auto lg:h-screen overflow-visible lg:overflow-y-auto bg-[#252220] border-t lg:border-t-0 lg:border-l border-[#4A4440]">
```

### StoreBasicSection grid 전환 (D-03, D-04)
```tsx
// Source: 06-UI-SPEC.md Grid Fields section
// BEFORE (3곳 모두):
<div className="grid grid-cols-2 gap-4">

// AFTER (3곳 모두):
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
```

### 섹션 카드 패딩 전환 (MOBILE-03)
```tsx
// Source: 06-UI-SPEC.md Spacing Scale
// BEFORE (StoreBasicSection, BrandVisionSection, PersonaSection):
<section className="rounded-2xl bg-[#E8E4DE] p-7 border border-[#C5BFB7]">

// AFTER:
<section className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
```

### 터치 타겟 확대 (MOBILE-03)
```tsx
// Source: 06-UI-SPEC.md Touch Target Contract
// RecommendButton BEFORE:
className="... px-5 py-2.5 ..."

// AFTER:
className="... px-5 py-3 lg:py-2.5 ..."

// API설정/초기화 버튼 BEFORE:
className="... px-3 py-2 ..."

// AFTER:
className="... px-3 py-3 lg:py-2 ..."

// RecommendGroup 헤더 BEFORE:
className="... px-4 py-3 ..."

// AFTER:
className="... px-4 py-3.5 lg:py-3 ..."
```

### EmptyState 카피 전환
```tsx
// Source: 06-UI-SPEC.md Copywriting Contract
// BEFORE:
<p className="text-[11px] text-[#A09890] leading-relaxed">
  왼쪽 항목을 입력하고<br />추천 받기를 눌러보세요
</p>

// AFTER:
<p className="text-[11px] text-[#A09890] leading-relaxed">
  <span className="lg:hidden">위의</span>
  <span className="hidden lg:inline">왼쪽</span>
  {' '}항목을 입력하고<br />추천 받기를 눌러보세요
</p>
```

### 자동 스크롤 (D-02)
```tsx
// Source: 06-UI-SPEC.md Interaction Contract
// App.tsx에 추가:
const recommendPanelRef = useRef<HTMLDivElement>(null);
const prevBatchCountRef = useRef(batches.length);

useEffect(() => {
  const prevCount = prevBatchCountRef.current;
  prevBatchCountRef.current = batches.length;
  
  // 새 배치가 추가되었을 때 (로딩 완료 후)
  if (!isLoading && batches.length > prevCount && prevCount > 0) {
    if (window.innerWidth < 1024 && recommendPanelRef.current) {
      setTimeout(() => {
        recommendPanelRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }
}, [isLoading, batches.length]);
```

## Tailwind CSS 4 Breakpoint Reference

| Breakpoint | Min-width | CSS Variable | Usage |
|------------|-----------|--------------|-------|
| sm | 640px (40rem) | `--breakpoint-sm` | 사용 안 함 |
| md | 768px (48rem) | `--breakpoint-md` | 사용 안 함 |
| **lg** | **1024px (64rem)** | `--breakpoint-lg` | **이 Phase의 전환점** |
| xl | 1280px (80rem) | `--breakpoint-xl` | 사용 안 함 |

Tailwind CSS 4에서 `lg:` 브레이크포인트는 `@media (width >= 64rem)` (= 1024px)로 컴파일된다. 이는 Phase 요구사항의 "1024px 미만/이상" 분기와 정확히 일치한다.

**중요:** 현재 프로젝트에서 `lg:` 접두사를 사용하는 곳이 없다. 이 Phase가 첫 번째 반응형 도입이다.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind 3 `@apply` | Tailwind 4 `@theme` directive | 2024.12 | CSS variable 기반 테마, 이 Phase에서는 해당 없음 |
| `@screen lg {}` | `lg:` 접두사 (동일) | Tailwind 3+ | 변화 없음, 동일 패턴 사용 |
| `tailwind.config.js` | `@theme` in CSS | Tailwind 4 | 프로젝트가 이미 4.x 사용 중 |

## Project Constraints (from CLAUDE.md)

- **Tech Stack**: React 웹앱, Tailwind CSS 4.x -- 새 라이브러리 추가 없음
- **파일 제한**: 모든 소스 파일 500줄 이하 -- 현재 모든 대상 파일이 100줄 미만이므로 위험 없음
- **디자인**: 심플 + 고급스러움 -- 모바일에서도 동일 미감 유지
- **언어**: 한국어 UI -- EmptyState 카피 변경 시 한국어 자연스러움 확인
- **v1.1 결정**: 새 npm 패키지 추가 없음 -- 기존 스택만으로 구현

## Open Questions

1. **SettingsModal 모바일 대응**
   - What we know: SettingsModal은 `max-w-lg` (512px) 고정 너비, 모바일에서 화면을 넘길 수 있음
   - What's unclear: UI-SPEC에 SettingsModal 모바일 대응이 명시되지 않음
   - Recommendation: `max-w-lg` 앞에 `w-full mx-4` 추가로 모바일 대응 (간단). 또는 Phase scope 밖으로 판단

2. **자동 스크롤 트리거 정확한 시점**
   - What we know: isLoading false 전환 + batches.length 증가 시 트리거
   - What's unclear: 에러 응답 시에도 스크롤해야 하는지 (에러 메시지가 RecommendPanel에 표시됨)
   - Recommendation: 에러 시에는 스크롤하지 않음 (사용자가 에러를 인지하려면 입력 영역 근처에 있는 게 자연스러움). batches.length 증가 조건으로 충분

3. **RecommendPanel 모바일 최소 높이**
   - What we know: UI-SPEC에 `min-h-[300px]` 명시
   - What's unclear: 빈 상태일 때 300px이 적절한지
   - Recommendation: UI-SPEC 그대로 적용. EmptyState가 py-24 (96px * 2 = 192px) + 콘텐츠 높이 감안하면 300px이 합리적

## Codebase Audit Results

### 수정 대상 파일 전수 조사

| File | Lines | Key Changes | Risk |
|------|-------|-------------|------|
| `AppLayout.tsx` | 13줄 | min-w 제거, flex/grid 전환 | LOW -- 단순 className 교체 |
| `InputPanel.tsx` | 54줄 | h-screen/overflow/패딩/히어로 | MEDIUM -- 변경점 많음 |
| `RecommendPanel.tsx` | 16줄 | sticky/h-screen/border 전환 | LOW -- 단순 className 교체 |
| `StoreBasicSection.tsx` | 82줄 | grid-cols-2 x3 -> 반응형 | LOW -- 동일 패턴 3회 반복 |
| `BrandVisionSection.tsx` | 39줄 | 섹션 카드 p-7 -> p-5 lg:p-7 | LOW -- 패딩만 |
| `PersonaSection.tsx` | 53줄 | 섹션 카드 p-7 -> p-5 lg:p-7 | LOW -- 패딩만 |
| `EmptyState.tsx` | 13줄 | 카피 전환 | LOW -- 단순 |
| `RecommendGroup.tsx` | 56줄 | 헤더 터치 타겟 확대 | LOW -- py만 변경 |
| `RecommendButton.tsx` | 12줄 | py-2.5 -> py-3 lg:py-2.5 | LOW -- 단순 |
| `App.tsx` | 137줄 | ref + useEffect 스크롤 로직 | MEDIUM -- 새 로직 추가 |

**총 수정 파일:** 10개 (App.tsx + 9개 컴포넌트)
**새 파일:** 0개
**삭제 파일:** 0개

### grid-cols-2 사용처 (전수)
- `StoreBasicSection.tsx` line 50, 57, 67 -- 3곳 모두 `grid-cols-1 lg:grid-cols-2`로 전환
- `BrandVisionSection.tsx` -- 없음 (확인 완료)
- `PersonaSection.tsx` -- 없음 (확인 완료)

### viewport 메타 태그
- `index.html` line 6: `<meta name="viewport" content="width=device-width, initial-scale=1.0">` -- 이미 존재, 추가 작업 불필요

## Sources

### Primary (HIGH confidence)
- Tailwind CSS 4.2.2 installed in project -- `npm list` 확인
- 프로젝트 소스 코드 전수 조사 -- 10개 대상 파일 직접 확인
- `06-UI-SPEC.md` -- 모든 className 변환 사양 명시
- `06-CONTEXT.md` -- 사용자 결정 D-01~D-06 명시
- [Tailwind CSS 4 Responsive Design docs](https://tailwindcss.com/docs/responsive-design) -- `lg:` = 1024px (64rem) 확인

### Secondary (MEDIUM confidence)
- [Tailwind CSS Screens docs](https://tailwindcss.com/docs/screens) -- 브레이크포인트 커스터마이징 참조
- [MDN scrollIntoView](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) -- `behavior: 'smooth'` 브라우저 지원 (모든 모던 브라우저)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- 기존 Tailwind CSS 4.2.2만 사용, 버전 확인 완료
- Architecture: HIGH -- 모든 대상 파일 직접 읽고 분석, UI-SPEC에 정확한 className 명시
- Pitfalls: HIGH -- 실제 코드 기반 분석, desktop regression이 유일한 실질적 위험

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (Tailwind CSS 4.x는 안정 릴리스, 30일 유효)
