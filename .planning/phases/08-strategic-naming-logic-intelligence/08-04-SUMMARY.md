---
phase: 08-strategic-naming-logic-intelligence
plan: 04
subsystem: ui
tags: [react, typescript, lucide-react, tailwind, rationale-card, expand-collapse]

# Dependency graph
requires:
  - phase: 08-01
    provides: RationaleData type in form.ts
  - phase: 08-02
    provides: 3-tab wizard UI (RecommendCardItem in tab containers)
  - phase: 08-03
    provides: Gemini structured response with rationale field populated

provides:
  - RationaleExpandedCard component (타당성 점수, 네이밍 기법, 의미 분석, 반영된 입력 표시)
  - RecommendCardItem with per-name expand/collapse toggle
  - EmptyState with wizard-aligned copy

affects:
  - RecommendPanel (카드 렌더링 변경)
  - Phase 09 (갤러리에서 rationale 표시 시 재사용 가능)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "grid-rows-[0fr]/[1fr] 패턴으로 콘텐츠 접기/펼치기 (RecommendGroup과 동일)"
    - "Set<number> state로 다중 카드 개별 확장 관리"
    - "progress bar width animation: style={{ width: isOpen ? 'N%' : '0%' }}"

key-files:
  created:
    - src/components/recommend/RationaleExpandedCard.tsx
  modified:
    - src/components/recommend/RecommendCardItem.tsx
    - src/components/recommend/EmptyState.tsx

key-decisions:
  - "다중 확장 지원: Set<number>으로 각 name 카드 독립 확장 (단일 확장 아님)"
  - "rationale 없는 name은 ChevronDown 아이콘 숨김 + 클릭 비활성 (하위 호환)"
  - "progress bar: isOpen 상태로 0% → N% 애니메이션 트리거"

patterns-established:
  - "RationaleExpandedCard: isOpen prop으로 외부에서 제어, 내부 상태 없음"
  - "EmptyState: 단일 문구 (모바일/데스크톱 분기 제거)"

requirements-completed:
  - "Rationale UI (네이밍 근거)"
  - "논리적 타당성 점수 표시"
  - "카드 확장 방식"

# Metrics
duration: 10min
completed: 2026-04-03
---

# Phase 08 Plan 04: Rationale Expanded Card UI Summary

**클릭 확장형 RationaleExpandedCard로 타당성 점수(%), 네이밍 기법 칩, 의미 분석, 반영된 입력 칩을 시각화하고 EmptyState를 위저드 맞춤 문구로 업데이트**

## Performance

- **Duration:** 10 min
- **Started:** 2026-04-03T05:40:00Z
- **Completed:** 2026-04-03T05:50:00Z
- **Tasks:** 2 (Task 3 is checkpoint:human-verify, awaiting user)
- **Files modified:** 3

## Accomplishments

- RationaleExpandedCard.tsx 신규 생성: grid 0fr/1fr 애니메이션, 타당성 점수 progress bar (600ms), 네이밍 기법 칩, 의미 분석, 반영된 입력 칩 (황금 tint)
- RecommendCardItem.tsx 수정: 각 name 항목 독립 확장, ChevronDown rotate-180, aria-expanded 접근성, rationale 없는 배치 하위 호환
- EmptyState.tsx 업데이트: 위저드 컨셉 안내 문구 (단계 진행 시 더 정교한 이름 안내)

## Task Commits

1. **Task 1: RationaleExpandedCard 생성 + RecommendCardItem 수정** - `513a309` (feat)
2. **Task 2: EmptyState 업데이트** - `3849ca8` (feat)
3. **Task 3: Phase 8 전체 기능 검증** - CHECKPOINT (awaiting user verification)

## Files Created/Modified

- `src/components/recommend/RationaleExpandedCard.tsx` - 확장형 근거 카드 컴포넌트 (66줄)
- `src/components/recommend/RecommendCardItem.tsx` - 클릭 확장 가능 카드 (68줄)
- `src/components/recommend/EmptyState.tsx` - 위저드 맞춤 빈 상태 컴포넌트

## Decisions Made

- 다중 확장 지원: `Set<number>` state로 각 name 카드가 독립적으로 확장/축소 (한 번에 하나만 열리도록 강제하지 않음)
- rationale 없는 name은 ChevronDown 아이콘 숨기고 클릭 비활성 처리 — 기존 배치 하위 호환 보장
- progress bar 애니메이션: `style={{ width: isOpen ? '${validityScore}%' : '0%' }}`로 마운트 후 isOpen 시 0→N% 트리거

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None — TypeScript passes cleanly on first attempt for both tasks.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None — RationaleExpandedCard는 실제 Gemini 응답의 rationale 데이터를 그대로 렌더링. 스텁 없음.

## Next Phase Readiness

- Phase 8 전체 구현 완료 (Plans 01~04), Task 3 사용자 브라우저 검증 대기 중
- 검증 완료 후 Phase 09 소셜 갤러리 진행 가능
- RationaleExpandedCard는 Phase 09 갤러리에서 재사용 가능

---
*Phase: 08-strategic-naming-logic-intelligence*
*Completed: 2026-04-03*
