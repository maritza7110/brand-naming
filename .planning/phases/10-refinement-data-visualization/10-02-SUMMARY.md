---
phase: 10-refinement-data-visualization
plan: "02"
subsystem: gallery-ui
tags: [gallery, filter, leaderboard, chips, debounce, zustand]
dependency_graph:
  requires:
    - GalleryFilters 타입 (10-01 제공)
    - LeaderboardEntry/LeaderboardPeriod 타입 (10-01 제공)
    - useGalleryStore.setFilters/resetFilters/fetchLeaderboard (10-01 제공)
    - ChipSelector (기존)
    - TextField (기존)
    - LikeButton (기존)
  provides:
    - GalleryFilterBar 컴포넌트 (업종/스타일 칩 + 키워드 검색)
    - GalleryLeaderboard 컴포넌트 (주간/전체 TOP 5 랭킹)
    - GalleryPage 업종/스타일/키워드 필터링 + 리더보드 마운트
  affects:
    - src/pages/GalleryPage.tsx (레이아웃 변경)
tech_stack:
  added: []
  patterns:
    - "300ms debounce: useState localKeyword + useEffect setTimeout 패턴"
    - "GallerySortTabs 동일 탭 패턴: border-b-2 border-[#B48C50] 활성 / text-[#A09890] 비활성"
    - "필터 초기화: 활성 필터 존재 시 조건부 렌더링 (hasActiveFilters)"
key_files:
  created:
    - src/components/gallery/GalleryFilterBar.tsx
    - src/components/gallery/GalleryLeaderboard.tsx
  modified:
    - src/pages/GalleryPage.tsx
decisions:
  - "필터 초기화 버튼 위치: 업종 칩 행 우측에 배치 (공간 최소화, 스크롤 없이 접근 가능)"
  - "GalleryLeaderboard useEffect fetchLeaderboard(): GalleryPage에서도 초기 로드로 이중 호출되나 중복 무해 (isLeaderboardLoading guard)"
metrics:
  duration: "2분"
  completed_date: "2026-04-06"
  tasks_completed: 2
  tasks_total: 2
  files_modified: 1
  files_created: 2
---

# Phase 10 Plan 02: FilterBar + Leaderboard UI Summary

**One-liner:** GalleryFilterBar(업종/스타일 ChipSelector + 300ms debounce 키워드 TextField) + GalleryLeaderboard(이번 주/역대 탭 + TOP 5 카드) 신규 생성 및 GalleryPage 마운트

## What Was Built

갤러리 페이지에 두 신규 컴포넌트를 생성하고 마운트했다. 사용자는 이제 업종 대분류, 네이밍 스타일, 키워드로 갤러리를 즉시 필터링할 수 있으며, 상단 리더보드에서 주간/전체 인기 TOP 5 프로젝트를 한눈에 확인할 수 있다.

### Task 1: GalleryFilterBar + GalleryLeaderboard 컴포넌트 생성

**GalleryFilterBar.tsx:**
- 업종 대분류 칩 (`MAJOR_CATEGORIES`): `[...new Set(INDUSTRY_DATA.map(d => d.major))]` — ChipSelector maxSelection=1
- 네이밍 스타일 칩 (`NAMING_STYLE_OPTIONS`): 8개 옵션 — ChipSelector maxSelection=1
- 키워드 검색: TextField 컴포넌트(raw input 없음) + 300ms debounce
- 필터 초기화 버튼: `hasActiveFilters` 조건부 렌더링, 클릭 시 `resetFilters()` + `setLocalKeyword('')`

**GalleryLeaderboard.tsx:**
- 기간 탭: GallerySortTabs 동일 패턴 (`border-b-2 border-[#B48C50]` 활성)
- TOP 5 카드: 순위 배지(24×24 원형) + 브랜드명(#B48C50) + 업종 배지 + LikeButton(showCount)
- 스켈레톤 로딩 3개 + 빈 상태 메시지

**Commit:** `b30e8ce`

### Task 2: GalleryPage에 FilterBar + Leaderboard 마운트

- 레이아웃 순서: `GalleryLeaderboard` > `GallerySortTabs` > `GalleryFilterBar` > Grid (per UI-SPEC)
- `filters` destructuring 추가 + `hasActiveFilters` 계산
- `useEffect` 초기화에 `fetchLeaderboard()` 추가
- 에러 상태: "데이터를 불러오지 못했습니다. 다시 시도해 주세요" + 재시도 버튼
- 빈 상태: 필터 활성 시 "조건에 맞는 프로젝트가 없습니다" / 비활성 시 기존 메시지 유지

**Commit:** `c24591f`

## Decisions Made

1. **필터 초기화 버튼 위치** — 업종 ChipSelector 행 우측에 flex justify-between으로 배치. 별도 행 추가 없이 공간 최소화.
2. **GalleryLeaderboard 이중 fetch** — 컴포넌트 자체 useEffect + GalleryPage useEffect 모두 `fetchLeaderboard()` 호출. `isLeaderboardLoading` guard가 있어 중복 요청 무해.

## Deviations from Plan

None — 플랜 그대로 실행.

## Known Stubs

None — ChipSelector 선택 즉시 `setFilters()` 스토어 호출 → `fetchNextPage()` 재실행 → 실제 데이터 반영. 리더보드도 실제 `galleryService.fetchLeaderboard()` 호출.

## Self-Check: PASSED

Files created:
- FOUND: src/components/gallery/GalleryFilterBar.tsx
- FOUND: src/components/gallery/GalleryLeaderboard.tsx

Files modified:
- FOUND: src/pages/GalleryPage.tsx

Commits:
- FOUND: b30e8ce (feat(10-02): GalleryFilterBar + GalleryLeaderboard 컴포넌트 생성)
- FOUND: c24591f (feat(10-02): GalleryPage에 FilterBar + Leaderboard 마운트)

TypeScript: `npx tsc --noEmit` — 0 errors
