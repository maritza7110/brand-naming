---
phase: 05-card-grouping
plan: 02
subsystem: ui
tags: [react, zustand, useMemo, useRef, useEffect, grouping, collapse, reset]

requires:
  - phase: 05-card-grouping
    plan: 01
    provides: RecommendGroup 컴포넌트, groupBatches/splitByReset 유틸, resetNaming 액션, resetTimestamp, industry 캡처
provides:
  - App.tsx 그룹 기반 렌더링 (flat -> grouped)
  - 업종 변경 시 이전 그룹 자동 접힘 (collapsedGroups + prevMinorRef)
  - 네이밍 초기화 버튼 (InputPanel onResetClick -> handleResetNaming)
  - 아카이브 '이전 추천' 접힌 그룹 (splitByReset + __archived__ 키)
affects: []

tech-stack:
  added: []
  patterns:
    - "useRef + useEffect로 이전 값 추적 후 자동 접힘 (prevMinorRef 패턴)"
    - "React state Set<string>으로 접힘 상태 관리 (collapsedGroups)"
    - "useMemo로 그룹 계산 캐싱 (groupBatches, splitByReset)"

key-files:
  created: []
  modified:
    - src/App.tsx
    - src/components/layout/InputPanel.tsx

key-decisions:
  - "collapsedGroups를 Zustand 대신 React state로 관리 -- 세션 UI 상태이므로 persist 불필요"
  - "업종 변경 감지를 Zustand subscribe 대신 useRef + useEffect 패턴으로 구현 -- collapsedGroups가 React state이므로 더 자연스러움"
  - "아카이브 그룹 키를 __archived__로 고정 -- 일반 업종명과 충돌 방지"

patterns-established:
  - "prevRef + useEffect 패턴: 이전 값과 현재 값을 비교하여 상태 변경 감지"
  - "handleResetNaming 래핑 패턴: Zustand 액션 호출 후 로컬 UI 상태도 함께 업데이트"

requirements-completed: [GROUP-01, GROUP-02, GROUP-03, RESET-01]

duration: 2min
completed: 2026-04-02
---

# Phase 5 Plan 02: App.tsx 그룹 렌더링 통합 + 업종 변경 자동 접힘 + 네이밍 초기화 Summary

**App.tsx를 flat 배치에서 업종별 그룹 렌더링으로 전환, prevMinorRef로 업종 변경 자동 접힘, InputPanel에 네이밍 초기화 버튼 통합**

## Performance

- **Duration:** 2min
- **Started:** 2026-04-01T23:22:28Z
- **Completed:** 2026-04-01T23:24:39Z
- **Tasks:** 2 (1 auto + 1 checkpoint auto-approved)
- **Files modified:** 2

## Accomplishments
- App.tsx의 flat batches.map 렌더링을 groupBatches + RecommendGroup 기반 그룹 렌더링으로 전환
- prevMinorRef + useEffect로 업종(소분류) 변경 시 이전 업종 그룹 자동 접힘 구현
- resetTimestamp 기반 current/archived 분리 + '이전 추천' 아카이브 그룹 렌더링
- InputPanel에 onResetClick prop + RotateCcw '네이밍 초기화' 버튼 추가
- handleResetNaming 래핑: resetNaming() 호출 후 __archived__ 그룹도 접힘 처리

## Task Commits

Each task was committed atomically:

1. **Task 1: App.tsx 그룹 렌더링 통합 + 업종 변경 자동 접힘 + InputPanel 초기화 버튼** - `df5bab8` (feat)
2. **Task 2: 추천 카드 그루핑 + 접기/펼치기 + 초기화 시각 검증** - Auto-approved (checkpoint)

## Files Created/Modified
- `src/App.tsx` - flat 렌더링을 그룹 기반으로 전환, collapsedGroups/toggleGroup, prevMinorRef 업종 변경 감지, handleResetNaming
- `src/components/layout/InputPanel.tsx` - onResetClick prop, RotateCcw '네이밍 초기화' 버튼 추가

## Decisions Made
- collapsedGroups를 Zustand 대신 React useState(Set)로 관리 -- 새로고침 시 초기화되는 세션 UI 상태이므로 persist 불필요
- 업종 변경 감지를 useRef + useEffect 패턴으로 구현 -- Zustand subscribe보다 collapsedGroups(React state)와 자연스러운 통합
- 아카이브 그룹 키를 '__archived__'로 고정 -- 실제 업종명과 충돌 없도록

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- 워크트리가 master의 Plan 01 커밋을 포함하지 않아 fast-forward merge로 해결 (Plan 01 의존성 해소)

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 5의 4개 요구사항(GROUP-01/02/03, RESET-01) 모두 완성
- 그룹 렌더링, 접기/펼치기 애니메이션, 업종 변경 자동 접힘, 네이밍 초기화 모두 동작
- TypeScript 컴파일 + Vite 빌드 모두 성공

## Self-Check: PASSED

- All 3 files FOUND (src/App.tsx, src/components/layout/InputPanel.tsx, 05-02-SUMMARY.md)
- Commit df5bab8 FOUND

---
*Phase: 05-card-grouping*
*Completed: 2026-04-02*
