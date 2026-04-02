---
phase: 05-card-grouping
plan: 01
subsystem: ui
tags: [react, zustand, tailwind, css-grid, typescript, grouping]

requires:
  - phase: 04-industry-dropdown
    provides: IndustrySelection 타입, StoreBasicState.industry 필드, persist v1
provides:
  - RecommendBatch.industry 옵셔널 필드 (배치 생성 시 업종 스냅샷)
  - AppState.resetTimestamp (네이밍 초기화 시점)
  - persist v2 마이그레이션 (기존 배치 보존)
  - resetNaming Zustand 액션
  - groupBatches/splitByReset/getGroupKey 유틸 함수
  - RecommendGroup CSS Grid 접기/펼치기 컴포넌트
  - gemini.ts industry 캡처 로직
affects: [05-02-PLAN]

tech-stack:
  added: []
  patterns:
    - "CSS Grid 0fr/1fr 접기/펼치기 (transition-[grid-template-rows])"
    - "Zustand persist version 마이그레이션 패턴 (v1 -> v2)"
    - "배치 생성 시 현재 컨텍스트(업종) 스냅샷 캡처 패턴"

key-files:
  created:
    - src/utils/groupBatches.ts
    - src/components/recommend/RecommendGroup.tsx
  modified:
    - src/types/form.ts
    - src/store/useFormStore.ts
    - src/services/gemini.ts

key-decisions:
  - "getGroupKey는 소분류 > 중분류 > 대분류 > 미분류 우선순위로 그룹 키를 결정"
  - "업종 미선택 시 industry=undefined로 저장하여 미분류 그룹으로 분류"
  - "resetNaming은 resetAll과 별개 액션으로, resetTimestamp를 기록하여 아카이브 분리 지원"

patterns-established:
  - "CSS Grid 0fr/1fr: overflow-hidden div가 Grid 컨테이너 바로 안에, padding은 그 안쪽 별도 div에 배치"
  - "persist 마이그레이션: version 번호 비교 + 새 필드 기본값 추가 패턴"
  - "배치 컨텍스트 캡처: 스프레드 연산자로 스냅샷 복사 (참조가 아닌 값)"

requirements-completed: [GROUP-01, GROUP-02, RESET-01]

duration: 4min
completed: 2026-04-02
---

# Phase 5 Plan 01: 추천 카드 그루핑 데이터/UI 빌딩 블록 Summary

**RecommendBatch에 업종 스냅샷 캡처, persist v2 마이그레이션, groupBatches 유틸, CSS Grid 0fr/1fr RecommendGroup 컴포넌트 구축**

## Performance

- **Duration:** 4min
- **Started:** 2026-04-01T23:15:39Z
- **Completed:** 2026-04-01T23:19:10Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- RecommendBatch 타입에 industry 옵셔널 필드 추가 + AppState에 resetTimestamp 추가
- Zustand persist v1 -> v2 마이그레이션 (기존 배치 데이터 보존, resetTimestamp 추가)
- groupBatches/splitByReset/getGroupKey 유틸 함수로 배치를 업종별 그룹으로 변환
- RecommendGroup 컴포넌트: CSS Grid 0fr/1fr 접기/펼치기 + ChevronDown 회전 애니메이션
- gemini.ts 배치 생성 시 현재 업종 스냅샷 캡처 (미선택 시 undefined)

## Task Commits

Each task was committed atomically:

1. **Task 1: 타입 확장 + 스토어 v2 마이그레이션 + 그룹핑 유틸** - `cb297ec` (feat)
2. **Task 2: RecommendGroup 컴포넌트 + gemini.ts industry 캡처** - `e6ab389` (feat)

## Files Created/Modified
- `src/types/form.ts` - RecommendBatch.industry 옵셔널 필드, AppState.resetTimestamp 추가
- `src/store/useFormStore.ts` - persist v2, resetNaming 액션, resetTimestamp 초기값/partialize/merge
- `src/utils/groupBatches.ts` - BatchGroup 타입, groupBatches, splitByReset, getGroupKey 유틸
- `src/components/recommend/RecommendGroup.tsx` - CSS Grid 0fr/1fr 접기/펼치기 그룹 래퍼
- `src/services/gemini.ts` - 배치 반환 시 industry 스냅샷 캡처

## Decisions Made
- getGroupKey는 소분류 > 중분류 > 대분류 > '미분류' 우선순위로 가장 구체적인 업종명을 그룹 키로 사용
- 업종이 하나도 선택되지 않은 경우 industry를 undefined로 설정하여 '미분류' 그룹으로 분류
- resetNaming은 기존 resetAll과 별도 액션으로, resetTimestamp를 Date로 기록하여 아카이브 분리 지원
- persist v2 마이그레이션에서 기존 v1 배치는 industry=undefined 상태로 보존 (하위 호환)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- 워크트리가 Phase 4 커밋을 포함하지 않아 IndustrySelection 타입이 없었음 - master에서 fast-forward merge로 해결

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Plan 02에서 App.tsx 통합에 필요한 모든 빌딩 블록 준비 완료
- RecommendGroup 컴포넌트, groupBatches 유틸, industry 캡처 로직 모두 사용 가능
- TypeScript 컴파일 + Vite 빌드 모두 성공 확인

## Self-Check: PASSED

- All 6 files FOUND
- Commit cb297ec FOUND
- Commit e6ab389 FOUND

---
*Phase: 05-card-grouping*
*Completed: 2026-04-02*
