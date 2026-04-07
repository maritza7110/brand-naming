---
phase: 13-stability
plan: "01"
subsystem: api
tags: [gemini, timeout, retry, error-handling, abort-signal]

# Dependency graph
requires: []
provides:
  - "30초 AbortSignal 타임아웃이 적용된 generateBrandNames (gemini.ts)"
  - "30초 AbortSignal 타임아웃이 적용된 generateForCriterion (geminiCriteria.ts)"
  - "최대 2회 자동 재시도 로직이 포함된 useRecommend hook"
  - "타임아웃/네트워크 에러별 한국어 사용자 메시지"
affects: [future-ai-integration, stability, error-handling]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "AbortSignal.timeout()으로 Gemini API 호출에 네이티브 타임아웃 적용"
    - "withRetry 헬퍼 패턴으로 조용한 재시도 래핑"
    - "isRetryableError로 재시도 가능 에러 분류 (TimeoutError, AbortError, TypeError)"

key-files:
  created: []
  modified:
    - src/services/gemini.ts
    - src/services/geminiCriteria.ts
    - src/hooks/useRecommend.ts

key-decisions:
  - "AbortSignal.timeout()을 @google/genai config.abortSignal에 직접 전달 — Promise.race 없이 깔끔하게 구현"
  - "API_TIMEOUT_MS를 gemini.ts에서 export하여 geminiCriteria.ts가 재사용"
  - "재시도 로직은 hook 레이어(useRecommend)에 배치 — 서비스 레이어를 순수하게 유지"
  - "STB-02/03/04는 사용자 결정 D-05/D-06/D-07에 의해 의도적으로 제외"

patterns-established:
  - "withRetry 패턴: 재시도 가능 에러를 조용히 재시도하고 최종 실패 시만 에러 노출"
  - "타임아웃 상수 export 패턴: API_TIMEOUT_MS를 서비스 파일에서 export하여 공유"

requirements-completed: [STB-01, STB-02, STB-03, STB-04]

# Metrics
duration: 2min
completed: 2026-04-08
---

# Phase 13 Plan 01: Stability Summary

**Gemini API 호출에 30초 AbortSignal 타임아웃과 최대 2회 조용한 자동 재시도를 추가하여 무한 로딩 문제 해결**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-08T04:01:22Z
- **Completed:** 2026-04-08T04:03:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- gemini.ts의 generateBrandNames에 `AbortSignal.timeout(30_000)` 적용 — API가 30초 안에 응답하지 않으면 자동 중단
- geminiCriteria.ts의 generateForCriterion에도 동일한 30초 타임아웃 적용
- useRecommend.ts에 `withRetry` 헬퍼 추가 — 타임아웃/네트워크 오류 시 최대 2회 조용한 재시도
- 재시도 실패 후 에러 유형별 한국어 메시지 분기 (타임아웃/네트워크/기타)

## Task Commits

Each task was committed atomically:

1. **Task 1: gemini.ts와 geminiCriteria.ts에 30초 AbortSignal 타임아웃 추가** - `8b9ee29` (feat)
2. **Task 2: useRecommend.ts에 2회 자동 재시도 로직 추가** - `c495b94` (feat)

**Plan metadata:** (see final commit below)

## Files Created/Modified
- `src/services/gemini.ts` - `export const API_TIMEOUT_MS = 30_000` 추가, generateContent config에 abortSignal 추가
- `src/services/geminiCriteria.ts` - API_TIMEOUT_MS import 추가, generateContent config에 abortSignal 추가
- `src/hooks/useRecommend.ts` - MAX_RETRIES, isRetryableError, withRetry 헬퍼 추가; generateBrandNames 호출을 withRetry로 래핑; 에러 메시지 분기 추가

## Decisions Made
- AbortSignal.timeout()을 @google/genai SDK의 config.abortSignal 필드에 직접 전달 — SDK가 네이티브 지원하므로 Promise.race 불필요
- API_TIMEOUT_MS를 gemini.ts에서 export하여 geminiCriteria.ts가 재사용 — 두 파일의 타임아웃 값이 항상 동기화됨
- 재시도 로직을 서비스 레이어가 아닌 hook 레이어(useRecommend)에 배치 — 서비스 함수는 단순하게 유지
- 재시도 딜레이 1초 — 너무 빠른 연속 재시도 방지, 사용자 경험 영향 최소화

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## Known Stubs
None — 모든 변경은 실제 동작 로직이며 플레이스홀더 없음.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 13 Plan 01 완료 — stability 목표 달성
- Gemini API 호출이 30초 타임아웃과 2회 재시도로 보호됨
- 무한 로딩 문제 해결, 에러 시 사용자 친화적 메시지 표시
- STB-02/03/04는 사용자 결정 D-05/D-06/D-07에 의해 현재 구현으로 충분하다고 판단됨

---
*Phase: 13-stability*
*Completed: 2026-04-08*
