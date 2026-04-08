---
phase: 14-data-test-design
plan: "03"
subsystem: ui
tags: [css, design-tokens, tailwind, color-system]

# Dependency graph
requires:
  - phase: 14-01
    provides: DSN-01 design token audit (222 hardcoded hex colors across 45 files identified)
provides:
  - CSS design token system with 8 core color variables in :root
  - All 214 hardcoded hex values in TSX/TS files replaced with var() references
  - Single-point color control — change :root to retheme entire app
affects: [all UI components, future theming, dark/light mode switching]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CSS custom properties (CSS variables) for design tokens — var(--color-*) pattern throughout Tailwind classes and inline styles"
    - "Centralized :root token declaration in index.css — all color definitions live in one place"

key-files:
  created: []
  modified:
    - src/index.css
    - src/components/recommend/TrademarkModal.tsx
    - src/components/recommend/RationaleExpandedCard.tsx
    - src/components/gallery/GalleryModal.tsx
    - src/pages/Dashboard.tsx
    - src/components/recommend/RecommendCardItem.tsx
    - src/components/gallery/GalleryLeaderboard.tsx
    - src/components/dashboard/StatsSection.tsx
    - src/components/gallery/CommentSection.tsx
    - src/components/ui/KeywordWeightSlider.tsx
    - src/components/gallery/GallerySkeletonCard.tsx
    - 32 additional component/page files

key-decisions:
  - "rgba() variants (4곳) 유지 — hex 토큰과 별개, opacity 변형은 CSS 변수로 표현 불가"
  - "8종 코어 색상만 토큰화 — #C5BFB7, #E8E4DE, #5A5550 중간 빈도 색상은 이번 범위 제외"
  - "sed 배치 교체 방식 채택 — 42개 파일 동시 처리, 수동 편집 불필요"

patterns-established:
  - "Tailwind arbitrary value with CSS var: bg-[var(--color-accent)] 패턴으로 Tailwind JIT + CSS 변수 통합"
  - "인라인 style에서도 CSS 변수 사용: style={{ backgroundColor: 'var(--color-surface)' }}"

requirements-completed: [DSN-01]

# Metrics
duration: 15min
completed: 2026-04-08
---

# Phase 14 Plan 03: CSS 디자인 토큰 시스템 Summary

**8종 CSS 색상 변수를 :root에 선언하고 45개 파일의 하드코딩 hex값 214곳을 var() 참조로 일괄 교체하여 단일 지점 색상 제어 시스템 구축**

## Performance

- **Duration:** 15 min
- **Started:** 2026-04-08T03:00:00Z
- **Completed:** 2026-04-08T03:15:00Z
- **Tasks:** 2
- **Files modified:** 43 (1 CSS + 42 TSX/TS)

## Accomplishments
- `src/index.css`에 8종 CSS 변수 `:root` 블록 추가 (`--color-accent`, `--color-bg`, `--color-surface`, `--color-border`, `--color-border-muted`, `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`)
- 42개 컴포넌트/페이지 파일의 하드코딩 hex값 214곳을 `var(--color-*)` 참조로 교체
- Vite 빌드 성공 확인 — TypeScript 컴파일 에러 0건
- rgba() 변형 4곳은 의도적으로 유지 (토큰 대상 아님)

## Task Commits

Each task was committed atomically:

1. **Task 1: index.css에 :root CSS 변수 선언 + index.css 내 하드코딩 교체** - `741df96` (feat)
2. **Task 2: 45개 컴포넌트 파일의 하드코딩 색상을 CSS 변수로 교체** - `fb4c849` (feat)

**Plan metadata:** _(docs commit — follows)_

## Files Created/Modified

- `src/index.css` - :root 블록에 8종 CSS 변수 추가, html/scrollbar-thumb 하드코딩 교체
- `src/components/recommend/TrademarkModal.tsx` - 23곳 교체 (가장 많음)
- `src/components/gallery/GalleryModal.tsx` - 16곳 교체
- `src/components/recommend/RationaleExpandedCard.tsx` - 14곳 교체
- `src/pages/Dashboard.tsx` - 12곳 교체
- `src/components/recommend/RecommendCardItem.tsx` - 12곳 교체
- `src/components/gallery/GalleryLeaderboard.tsx` - 12곳 교체
- `src/components/dashboard/StatsSection.tsx` - 11곳 교체
- `src/components/gallery/CommentSection.tsx` - 8곳 교체
- `src/components/ui/KeywordWeightSlider.tsx` - 8곳 교체
- `src/components/gallery/GallerySkeletonCard.tsx` - 7곳 교체
- 31개 추가 파일 — 각 1~6곳 교체

## Decisions Made

- rgba() 변형 (예: `rgba(180, 140, 80, 0.3)`) 4곳은 CSS 변수로 표현 불가한 opacity 변형이므로 유지
- `#C5BFB7`, `#E8E4DE`, `#5A5550` 중간 빈도 색상은 이번 토큰화 범위에서 제외 (플랜 기준 준수)
- sed 배치 방식으로 모든 파일을 한 번에 교체 — 일관성 보장

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None — sed 배치 교체가 깔끔하게 동작했으며, index.css는 이미 플랜 시작 전 파티션 작업(다른 플랜)에서 부분 완료 상태였음. Task 1 변경사항이 git diff로 확인되어 그대로 커밋 처리.

## Known Stubs

없음 — 이 플랜은 색상 값 치환만 수행했으며, 기능적 스텁 없음.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- 디자인 토큰 시스템 완성 — :root에서 8종 색상 한 번에 변경하면 전체 앱에 반영
- 다크/라이트 모드 또는 테마 변경 기능 추가 가능한 구조
- Phase 14의 나머지 계획(UI 컴포넌트 개선, 테스트 등)으로 진행 가능

---
*Phase: 14-data-test-design*
*Completed: 2026-04-08*
