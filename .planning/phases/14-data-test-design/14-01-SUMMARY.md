---
phase: 14-data-test-design
plan: "01"
subsystem: database
tags: [zustand, supabase, session, leaderboard]

# Dependency graph
requires:
  - phase: 13-stability
    provides: withRetry 훅 레이어, sessionService create/update 인터페이스
provides:
  - useRecommend createOrUpdate 세션 로직 (같은 위저드 내 누적)
  - useFormStore resetNaming 시 currentSessionId null 리셋
  - NamingPage 세션 복원 시 currentSessionId 세팅
  - galleryService 리더보드 likes 쿼리 1000건 limit
affects: [15-security, 16-testing]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "createOrUpdate 패턴: currentSessionId 존재 여부로 create/update 분기"
    - "addBatch 이후 getState() 재호출로 최신 배치 목록 취득 (stale closure 방지)"
    - "상수 명명 LEADERBOARD_LIKES_LIMIT — PAGE_SIZE 패턴 계승"

key-files:
  created: []
  modified:
    - src/hooks/useRecommend.ts
    - src/store/useFormStore.ts
    - src/pages/NamingPage.tsx
    - src/services/galleryService.ts

key-decisions:
  - "LEADERBOARD_LIKES_LIMIT = 1000: 100인 사내 앱에서 likes 1000건 초과 가능성 낮음, TOP 5 집계에 통계적으로 충분"
  - "latestState = useFormStore.getState() 를 addBatch 이후에 호출 — addBatch가 batches를 업데이트하므로 최신 누적 배치 전달 가능"

patterns-established:
  - "세션 createOrUpdate: hook 레이어에서 currentSessionId 분기 처리"
  - "복원 후 sessionId 세팅: restoreSession 직후 setCurrentSessionId 호출"

requirements-completed: [DATA-01, DATA-02]

# Metrics
duration: 15min
completed: 2026-04-08
---

# Phase 14 Plan 01: 세션 오염 수정 Summary

**매 추천마다 새 세션이 생성되던 버그를 createOrUpdate 분기로 수정, 리더보드 likes 풀스캔을 1000건 limit으로 제한**

## Performance

- **Duration:** 15 min
- **Started:** 2026-04-08T03:10:00Z
- **Completed:** 2026-04-08T03:25:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- useRecommend: `currentSessionId` 존재 시 `updateSession`, 없을 때만 `createSession` 분기 구현
- useFormStore: `resetNaming` 시 `currentSessionId: null` 리셋 추가 — 위저드 초기화 후 다음 추천이 새 세션으로 생성
- NamingPage: 대시보드 세션 복원 후 `setCurrentSessionId(sessionId)` 호출 — 이후 추천이 기존 세션에 누적
- galleryService: `LEADERBOARD_LIKES_LIMIT = 1000` 상수로 likes 쿼리 limit 적용 — 전체 테이블 풀스캔 방지

## Task Commits

각 태스크를 개별 커밋으로 완료:

1. **Task 1: useRecommend.ts 세션 createOrUpdate 로직 + useFormStore resetNaming 수정** - `33a0bda` (fix)
2. **Task 2: NamingPage 세션 복원 시 sessionId 세팅 + galleryService 리더보드 limit** - `eb21c2c` (fix)

## Files Created/Modified

- `src/hooks/useRecommend.ts` — createOrUpdate 분기, latestState.batches 누적 전달, setCurrentSessionId 호출
- `src/store/useFormStore.ts` — resetNaming에 `currentSessionId: null` 추가
- `src/pages/NamingPage.tsx` — restoreSession 직후 setCurrentSessionId(sessionId) 추가
- `src/services/galleryService.ts` — LEADERBOARD_LIKES_LIMIT 상수 + .limit() 적용

## Decisions Made

- **LEADERBOARD_LIKES_LIMIT = 1000**: 사내 100인 앱에서 likes 1000건 초과 가능성 낮음. TOP 5 뽑는 데 통계적으로 충분. 과도한 방어 코드 지양 (Phase 13 원칙 계승).
- **latestState 재취득 위치**: `addBatch(batch)` 이후에 `useFormStore.getState()` 재호출하여 최신 누적 batches 취득 — addBatch 전 취득 시 직전 배치 누락되는 stale closure 방지.

## Deviations from Plan

없음 — 플랜 그대로 실행.

단, 실행 시점에 `useRecommend.ts`와 `useFormStore.ts`는 이미 수정된 상태(unstaged)로 발견되어 Task 1을 검증 후 즉시 커밋했습니다. `NamingPage.tsx`와 `galleryService.ts`는 미수정 상태로 Task 2에서 정상 적용했습니다.

## Issues Encountered

없음 — TypeScript 컴파일 두 단계 모두 즉시 통과 (EXIT:0).

## User Setup Required

없음 — 외부 서비스 설정 변경 없음.

## Next Phase Readiness

- 세션 오염 수정 완료 — 동일 위저드 내 추천을 여러 번 받아도 세션 하나만 존재하고 업데이트됨
- 대시보드 복원 세션에 추가 추천 누적 동작
- 리더보드 likes 쿼리 부하 감소
- Phase 14-02 (Vitest 테스트 인프라) 진행 가능

---
*Phase: 14-data-test-design*
*Completed: 2026-04-08*
