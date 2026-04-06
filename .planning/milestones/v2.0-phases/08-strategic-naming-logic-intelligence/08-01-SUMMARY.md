---
phase: 08-strategic-naming-logic-intelligence
plan: 01
subsystem: ui
tags: [typescript, zustand, react, tailwind, chipSelector, slider, accordion]

requires: []

provides:
  - "TabId union type (analysis | identity | expression)"
  - "AnalysisState, IdentityState, ExpressionState types"
  - "RationaleData interface for rationale card"
  - "KeywordWeights type"
  - "Extended FormState and AppState with Phase 8 fields"
  - "Extended useFormStore with activeTab, keywordWeights, analysis/identity/expression"
  - "ChipSelector UI primitive with FIFO overflow and keyboard accessibility"
  - "KeywordWeightSlider UI primitive with custom CSS range styling"
  - "AdvancedOptionsToggle UI primitive with grid-template-rows animation"

affects:
  - "08-02 (wizard tab UI will consume ChipSelector, AdvancedOptionsToggle, store actions)"
  - "08-03 (rationale card will use RationaleData type)"
  - "08-04 (prompt engineering will read analysis/identity/expression from store)"

tech-stack:
  added: []
  patterns:
    - "ChipSelector FIFO: selected.slice(1) when maxSelection exceeded"
    - "Range slider custom CSS via <style> block + CSS custom property --fill for track fill"
    - "Accordion via CSS grid-template-rows: 0fr/1fr pattern (consistent with RecommendGroup)"

key-files:
  created:
    - src/components/ui/ChipSelector.tsx
    - src/components/ui/KeywordWeightSlider.tsx
    - src/components/ui/AdvancedOptionsToggle.tsx
  modified:
    - src/types/form.ts
    - src/store/useFormStore.ts

key-decisions:
  - "Persist version bumped to 3 with migration passthrough for v2 (rationale is optional, backward compatible)"
  - "ChipSelector uses inline style for scale transform instead of Tailwind to avoid class conflicts with transition"
  - "KeywordWeightSlider uses <style> block for ::-webkit-slider-thumb custom styling (Tailwind cannot target pseudo-elements)"
  - "AdvancedOptionsToggle uses grid-template-rows pattern consistent with existing RecommendGroup accordion"

patterns-established:
  - "ChipSelector pattern: role=checkbox + aria-checked + keyboard Space support"
  - "Range slider: kw-slider CSS class + --fill CSS custom property for gradient track"
  - "Accordion: grid-template-rows 0fr/1fr with inner overflow:hidden wrapper"

requirements-completed:
  - "단계별 입력 프로세스 (타입 기반)"
  - "신규 데이터 항목 타입"
  - "키워드 가중치 설정"
  - "논리적 타당성 피드백 (RationaleData 타입)"

duration: 15min
completed: 2026-04-03
---

# Phase 8 Plan 01: Strategic Naming Logic Intelligence — Foundation Summary

**확장된 타입 시스템(TabId, RationaleData, AnalysisState 등), Zustand 스토어 v3 마이그레이션, ChipSelector/KeywordWeightSlider/AdvancedOptionsToggle 3종 UI 프리미티브 구축 완료**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-04-03T05:30:00Z
- **Completed:** 2026-04-03T05:45:00Z
- **Tasks:** 3
- **Files modified:** 5 (2 modified, 3 created)

## Accomplishments

- `src/types/form.ts`에 Phase 8 전용 타입 7종 추가 (TabId, AnalysisState, IdentityState, ExpressionState, KeywordWeights, RationaleData, 확장된 FormState/AppState/RecommendBatch)
- `src/store/useFormStore.ts`에 신규 상태 필드 5개 + 액션 8개 추가, persist version 2 → 3 마이그레이션 적용
- `ChipSelector`: 다중 선택 칩 그리드, FIFO 초과 처리, role=checkbox + 키보드 접근성
- `KeywordWeightSlider`: 1~5 범위 슬라이더, 커스텀 CSS 트랙/thumb 스타일링, aria-label 지원
- `AdvancedOptionsToggle`: ChevronDown 회전 + grid-template-rows 슬라이드 애니메이션

## Task Commits

1. **Task 1: 타입 시스템 확장** - `2817831` (feat)
2. **Task 2: Zustand 스토어 확장** - `582838d` (feat)
3. **Task 3: 신규 UI 프리미티브 3종** - `f15aa6d` (feat)

## Files Created/Modified

- `src/types/form.ts` — TabId, AnalysisState, IdentityState, ExpressionState, KeywordWeights, RationaleData 타입 추가; FormState/AppState/RecommendBatch 확장
- `src/store/useFormStore.ts` — 신규 초기값, 액션 8개, persist v3 마이그레이션
- `src/components/ui/ChipSelector.tsx` — 다중 선택 칩 그리드 (FIFO, 접근성)
- `src/components/ui/KeywordWeightSlider.tsx` — 키워드 가중치 슬라이더 (1~5 범위)
- `src/components/ui/AdvancedOptionsToggle.tsx` — 고급 옵션 접기/펼치기 토글

## Decisions Made

- **Persist v3 마이그레이션**: rationale 필드가 optional이므로 v2 → v3 패스스루로 충분. 기존 배치 완전 호환.
- **ChipSelector scale transform**: Tailwind 클래스 충돌을 피하기 위해 inline style 사용. transition은 CSS custom로 처리.
- **KeywordWeightSlider `<style>` 블록**: Tailwind이 `::-webkit-slider-thumb` 등 pseudo-element를 지원하지 않으므로 컴포넌트 내부 `<style>` 블록 사용.
- **AdvancedOptionsToggle grid 패턴**: 기존 RecommendGroup accordion과 동일한 `grid-template-rows: 0fr/1fr` 패턴으로 일관성 유지.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Plan 02 (WizardTabs + 탭별 입력 UI)가 ChipSelector, AdvancedOptionsToggle, store actions를 즉시 사용 가능
- Plan 03 (RationaleExpandedCard)이 RationaleData 타입을 사용 가능
- Plan 04 (프롬프트 엔지니어링)가 analysis/identity/expression 스토어 필드를 읽을 수 있음
- 모든 파일 500줄 이하 유지

---
*Phase: 08-strategic-naming-logic-intelligence*
*Completed: 2026-04-03*

## Self-Check: PASSED

- src/types/form.ts: FOUND
- src/store/useFormStore.ts: FOUND
- src/components/ui/ChipSelector.tsx: FOUND
- src/components/ui/KeywordWeightSlider.tsx: FOUND
- src/components/ui/AdvancedOptionsToggle.tsx: FOUND
- Commit 2817831: FOUND
- Commit 582838d: FOUND
- Commit f15aa6d: FOUND
