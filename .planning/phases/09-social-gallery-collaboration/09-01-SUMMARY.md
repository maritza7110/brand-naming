---
phase: 09-social-gallery-collaboration
plan: 01
subsystem: gallery-data-layer
tags: [gallery, social, zustand, supabase, rls, infinite-scroll]
dependency_graph:
  requires: [Phase 07 Supabase auth/DB 인프라]
  provides: [GallerySession 타입, galleryService, socialService, useGalleryStore, useSocialStore, useInfiniteScroll]
  affects: [Phase 09 Plan 02, 03, 04 — UI 컴포넌트 및 발행 로직]
tech_stack:
  added: []
  patterns: [Supabase .range() 페이지네이션, IntersectionObserver 커스텀 훅, 낙관적 업데이트 + 롤백, Zustand Set<string> 불변 업데이트]
key_files:
  created:
    - src/types/gallery.ts
    - supabase/migrations/09_social_gallery.sql
    - src/services/galleryService.ts
    - src/services/socialService.ts
    - src/store/useGalleryStore.ts
    - src/store/useSocialStore.ts
    - src/hooks/useInfiniteScroll.ts
  modified: []
decisions:
  - galleryService에 publishSession 미포함 — sessionService에서 단독 관리하여 중복 구현 방지 (Plan 02)
  - useSocialStore의 Set<string> 상태는 new Set(prev) 복사 후 add/delete — React 리렌더링 트리거 보장
  - fetchLikeCounts를 Promise.all 배치로 구현 — N+1 쿼리 방지
  - sortBy 변경 시 sessions/page/hasMore 전체 리셋 후 fetchNextPage 호출 — 정렬 전환 시 중복 데이터 방지
metrics:
  duration: ~8m
  completed_date: "2026-04-06"
  tasks: 2
  files_created: 7
  files_modified: 0
---

# Phase 9 Plan 01: 갤러리 데이터 레이어 Summary

**One-liner:** Supabase RLS likes/bookmarks 스키마 + galleryService/.range() 페이지네이션 + useSocialStore 낙관적 업데이트 패턴으로 갤러리 데이터 계층 완성

## What Was Built

Phase 9 갤러리 UI가 의존하는 데이터 계약과 서비스 인터페이스 전체를 구축했다. DB 마이그레이션 SQL 1개, 타입 정의 1개, 서비스 2개, Zustand 스토어 2개, 커스텀 훅 1개 — 총 7개 파일.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | 타입 정의 + DB 마이그레이션 SQL + 서비스 레이어 | ecc2250 | gallery.ts, 09_social_gallery.sql, galleryService.ts, socialService.ts |
| 2 | Zustand 스토어 2개 + useInfiniteScroll 훅 | 7dff4d3 | useGalleryStore.ts, useSocialStore.ts, useInfiniteScroll.ts |

## Key Implementations

### galleryService
- `fetchPage(page, sortBy)`: `.eq('is_public', true)` + `.order()` + `.range()` 조합으로 공개 세션 페이지네이션
- `fetchLikeCounts(sessionIds)`: `Promise.all`로 배치 처리, 빈 배열 early return

### socialService
- `toggleLike/toggleBookmark`: `isLiked/isBookmarked` 파라미터로 INSERT/DELETE 분기
- `getMyLikedIds/getMyBookmarkedIds`: `Set<string>` 반환
- `getMyBookmarks`: 북마크된 세션 전체 데이터 조인 조회 (D-09)

### useGalleryStore
- `fetchNextPage`: isLoading guard + fetchPage + fetchLikeCounts 배치 + sessions append
- `setSortBy`: 정렬 변경 시 sessions/page/hasMore/error 리셋 후 즉시 fetchNextPage 호출
- `updateLikeCount`: 낙관적 업데이트 delta 적용

### useSocialStore
- `initSocialState`: likedIds + bookmarkedIds `Promise.all` 병렬 초기화
- `toggleLike`: 즉시 Set 토글 + updateLikeCount → 실패 시 Set 롤백 + 반대 delta
- `toggleBookmark`: 동일 낙관적 패턴 (카운트 업데이트 없음)

### useInfiniteScroll
- `sentinelRef` 콜백 ref: isLoading 변경 시 observer 재연결, hasMore + isIntersecting 조건 충족 시 onLoadMore 호출

## Verification

- `npx tsc --noEmit`: 전체 프로젝트 컴파일 성공 (에러 0)
- 모든 파일 500줄 이하 (최대 84줄)
- galleryService에 publishSession 없음 (sessionService 단독 관리)
- `.eq('is_public', true)` + `.order()` + `.range()` 패턴 확인
- 낙관적 업데이트 + 롤백 패턴 구현 확인

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- src/types/gallery.ts: FOUND
- supabase/migrations/09_social_gallery.sql: FOUND
- src/services/galleryService.ts: FOUND
- src/services/socialService.ts: FOUND
- src/store/useGalleryStore.ts: FOUND
- src/store/useSocialStore.ts: FOUND
- src/hooks/useInfiniteScroll.ts: FOUND
- Task 1 commit ecc2250: FOUND
- Task 2 commit 7dff4d3: FOUND
