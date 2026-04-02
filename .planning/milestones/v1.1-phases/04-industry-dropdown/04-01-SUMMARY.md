---
phase: 04-industry-dropdown
plan: 01
subsystem: data, store
tags: [zustand, typescript, industry-classification, persist-migration]

requires:
  - phase: 01-foundation-input-ui
    provides: StoreBasicState 타입, useFormStore Zustand 스토어, persist middleware
provides:
  - IndustrySelection 타입 (major/medium/minor/note 4개 필드)
  - 237개 산업분류 정적 데이터 + 3개 헬퍼 함수
  - 14개 기존 flat 카테고리 매핑 테이블
  - updateIndustry Zustand 액션
  - persist version 1 마이그레이션
affects: [04-02-plan, StoreBasicSection, gemini-service]

tech-stack:
  added: []
  patterns: [IndustrySelection 구조체로 계층형 데이터 저장, Exclude<> 유틸리티 타입으로 액션 시그니처 제한, persist version+migrate 패턴]

key-files:
  created:
    - src/data/industryData.ts
    - src/data/industryMigration.ts
  modified:
    - src/types/form.ts
    - src/store/useFormStore.ts

key-decisions:
  - "category: string -> industry: IndustrySelection 필드명 변경 (의미론적 명확성)"
  - "updateStoreBasic field 타입을 Exclude<keyof StoreBasicState, 'industry'>로 좁혀 타입 안전성 확보"
  - "상권업종분류 기반 237개 소분류 데이터 (대분류 10개, 중분류 ~60개)"
  - "persist version 1로 올리되 batches만 persist되므로 실질적 변환 없이 통과"

patterns-established:
  - "IndustrySelection: 계층형 선택 상태를 4개 string 필드 구조체로 관리"
  - "Exclude<> 타입: 객체 필드를 가진 상태에서 string-only 업데이터 시그니처 보호"
  - "flat 배열 + Set 연산: 트리 데이터를 flat 배열로 저장하고 유니크 추출로 계층 탐색"

requirements-completed: [INDUSTRY-02, INDUSTRY-03]

duration: 5min
completed: 2026-04-02
---

# Phase 4 Plan 01: Data Foundation Summary

**IndustrySelection 타입 + 237개 산업분류 정적 데이터 + Zustand updateIndustry 액션 및 persist v1 마이그레이션**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-01T22:25:41Z
- **Completed:** 2026-04-01T22:30:44Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments
- IndustrySelection 타입 정의 및 StoreBasicState.category -> industry 교체
- 237개 소분류 산업분류 데이터 (대분류 10개) + getMajorCategories/getMediumCategories/getMinorCategories 헬퍼 함수
- 14개 기존 flat 카테고리 -> IndustrySelection 매핑 테이블 (향후 form persist 시 안전장치)
- Zustand updateIndustry 액션 + persist version 0->1 마이그레이션

## Task Commits

Each task was committed atomically:

1. **Task 1: IndustrySelection 타입 정의 + StoreBasicState 변경** - `76e514c` (feat)
2. **Task 2: 산업분류 정적 데이터 + 헬퍼 함수 + 마이그레이션 매핑** - `a57e392` (feat)
3. **Task 3: Zustand 스토어 updateIndustry 액션 + persist 마이그레이션** - `a8c1b16` (feat)

## Files Created/Modified
- `src/types/form.ts` - IndustrySelection 인터페이스 추가, StoreBasicState.category -> industry 교체
- `src/data/industryData.ts` - 237개 산업분류 정적 데이터 + 3개 헬퍼 함수 (284줄)
- `src/data/industryMigration.ts` - 14개 기존 flat 카테고리 -> IndustrySelection 매핑 (24줄)
- `src/store/useFormStore.ts` - updateIndustry 액션, Exclude<> 타입 제한, persist v1 migrate (127줄)

## Decisions Made
- **category -> industry 필드명 변경:** IndustrySelection 객체를 담으므로 의미론적으로 명확 (per D-01)
- **updateStoreBasic Exclude 타입:** industry 필드를 updateStoreBasic으로 실수로 업데이트하는 것을 컴파일 타임에 방지
- **237개 vs 247개 데이터:** 상권업종분류 기반으로 실용적인 237개 소분류를 작성. 목표 ~247개에 가까우며 acceptance criteria (>= 230) 충족
- **persist migrate 패스스루:** 현재 form 필드가 persist되지 않으므로 batches만 그대로 통과

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## Known Stubs
None - 모든 데이터와 함수가 완전히 구현됨.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Plan 02에서 StoreBasicSection.tsx 계층형 UI 교체 + gemini.ts 업종 경로 포맷 구현 예정
- 예상 TypeScript 에러: StoreBasicSection.tsx (category 참조 2건) -- Plan 02에서 해소
- IndustrySelection 타입, industryData 헬퍼 함수, updateIndustry 액션 모두 준비 완료

## Self-Check: PASSED

- All 5 files verified present
- All 3 task commits verified in git log
- TypeScript: 0 errors in plan scope files (expected 2 errors in StoreBasicSection.tsx for Plan 02)
- All files under 500-line limit (max: 284 lines)
- INDUSTRY_DATA: 237 items (>= 230 acceptance criteria)

---
*Phase: 04-industry-dropdown*
*Completed: 2026-04-02*
