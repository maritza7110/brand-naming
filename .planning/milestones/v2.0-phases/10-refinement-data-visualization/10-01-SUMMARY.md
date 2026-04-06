---
phase: 10-refinement-data-visualization
plan: "01"
subsystem: data-layer
tags: [gallery, filters, leaderboard, comments, zustand, supabase, types]
dependency_graph:
  requires: []
  provides:
    - GalleryFilters 타입 (src/types/gallery.ts)
    - LeaderboardEntry/LeaderboardPeriod 타입 (src/types/gallery.ts)
    - CommentData 타입 (src/types/gallery.ts)
    - galleryService.fetchPage filters 파라미터
    - galleryService.fetchLeaderboard 메서드
    - socialService 댓글 CRUD (getComments/addComment/deleteComment)
    - useGalleryStore 필터+리더보드 상태
    - useSocialStore 댓글 상태+낙관적 업데이트
    - comments 테이블 DDL + RLS
  affects:
    - src/components (갤러리 UI 컴포넌트 — Plan 02/03에서 소비)
tech_stack:
  added: []
  patterns:
    - "Zustand set+get 낙관적 업데이트 (toggleLike 패턴 댓글에 동일 적용)"
    - "필터 변경 시 sessions/page/hasMore 리셋 후 fetchNextPage 재실행"
    - "namingStyle은 서버 쿼리 불가 → 클라이언트 배열 필터링"
    - "리더보드: likes 전체 조회 → 클라이언트 집계 → TOP N 세션 fetchPage 동일 select로 조회"
key_files:
  created:
    - supabase/migrations/20260406_comments.sql
  modified:
    - src/types/gallery.ts
    - src/services/galleryService.ts
    - src/services/socialService.ts
    - src/store/useGalleryStore.ts
    - src/store/useSocialStore.ts
decisions:
  - "namingStyle 필터: sessions 테이블 JSONB 직접 서버 쿼리 불가 → fetchPage 결과 후 클라이언트 필터링"
  - "리더보드 집계: 클라이언트 reduce 패턴 (100인 앱 소규모 데이터로 충분)"
  - "댓글 addComment: 낙관적 업데이트 후 re-fetch로 실제 DB ID 동기화 (tempId 충돌 방지)"
metrics:
  duration: "3분"
  completed_date: "2026-04-06"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 5
  files_created: 1
---

# Phase 10 Plan 01: 데이터 레이어 구축 Summary

**One-liner:** GalleryFilters/LeaderboardEntry/CommentData 타입 정의 + galleryService 필터·리더보드 쿼리 + socialService 댓글 CRUD + Zustand 스토어 확장 + comments 테이블 RLS 마이그레이션

## What Was Built

Phase 10 데이터 레이어 전체를 구축했다. 후속 UI 플랜(02: 필터+리더보드, 03: 댓글, 04: 통계)이 의존하는 모든 타입·서비스·스토어·DB 마이그레이션을 제공한다.

### Task 1: 타입 정의 + DB 마이그레이션 + 서비스 확장

- `src/types/gallery.ts`에 `GalleryFilters`, `LeaderboardPeriod`, `LeaderboardEntry`, `CommentData` 타입 추가
- `supabase/migrations/20260406_comments.sql`: comments 테이블 DDL + RLS 3개 정책 + likes.created_at 조건부 추가
- `galleryService.fetchPage`: `filters?: GalleryFilters` 파라미터 추가. industry ilike + keyword ilike 서버 쿼리 적용
- `galleryService.fetchLeaderboard`: period별 TOP 5 세션 반환. likes 전체 조회 → 클라이언트 집계 → 세션 상세 조회
- `socialService`: `getComments`, `addComment`, `deleteComment` 3개 메서드 추가

**Commit:** `3f33cf5`

### Task 2: Zustand 스토어 확장

- `useGalleryStore`: `filters: GalleryFilters` 상태 + `setFilters`/`resetFilters` 액션 (필터 변경 시 sessions/page/hasMore 리셋 후 refetch)
- `useGalleryStore`: `leaderboard`/`leaderboardPeriod`/`isLeaderboardLoading` 상태 + `fetchLeaderboard`/`setLeaderboardPeriod` 액션
- `useGalleryStore.fetchNextPage`: `filters` 파라미터 전달 + namingStyle 클라이언트 필터링
- `useSocialStore`: `comments: CommentData[]`/`isCommentsLoading` 상태 + `fetchComments`/`addComment`/`deleteComment` 낙관적 업데이트 액션

**Commit:** `fdd583e`

## Decisions Made

1. **namingStyle 서버 쿼리 불가** — sessions.input_data JSONB에서 `.ilike` 불가. fetchPage 반환 후 클라이언트에서 `input_data.expression.namingStyle` 배열로 필터링.
2. **리더보드 클라이언트 집계** — 100인 앱 소규모 데이터. GROUP BY RPC 없이 likes 전체 조회 후 reduce로 집계.
3. **댓글 tempId 동기화** — `addComment` 낙관적 업데이트 후 `getComments` re-fetch로 실제 DB UUID 반영.

## Deviations from Plan

None — 플랜 그대로 실행.

## Known Stubs

None — 데이터 레이어 전용 플랜. UI 연결은 Plan 02/03에서 수행.

## Self-Check: PASSED

Files created/modified:
- FOUND: src/types/gallery.ts
- FOUND: src/services/galleryService.ts
- FOUND: src/services/socialService.ts
- FOUND: src/store/useGalleryStore.ts
- FOUND: src/store/useSocialStore.ts
- FOUND: supabase/migrations/20260406_comments.sql

Commits:
- FOUND: 3f33cf5 (feat(10-01): 타입 정의 + DB 마이그레이션 + 서비스 확장)
- FOUND: fdd583e (feat(10-01): Zustand 스토어 확장)

TypeScript: `npx tsc --noEmit` — 0 errors
