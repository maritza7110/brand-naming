---
phase: 09
plan: 04
subsystem: gallery-interactions
tags: [gallery, like, bookmark, modal, social]
dependency_graph:
  requires: [09-03, useSocialStore, useGalleryStore, sessionService]
  provides: [LikeButton, BookmarkButton, GalleryModal]
  affects: [GalleryPage, GalleryCard]
tech_stack:
  added: []
  patterns:
    - 낙관적 업데이트 토글 (useSocialStore.toggleLike/toggleBookmark)
    - ESC + 배경 클릭 모달 닫기 패턴
    - stopPropagation으로 카드 클릭 이벤트 버블링 차단
    - 44px 최소 터치 타겟 (WCAG AA 준수)
key_files:
  created:
    - src/components/gallery/LikeButton.tsx
    - src/components/gallery/BookmarkButton.tsx
    - src/components/gallery/GalleryModal.tsx
  modified:
    - src/pages/GalleryPage.tsx
    - src/components/gallery/GalleryCard.tsx
decisions:
  - LikeButton은 showCount prop으로 카드/모달 양쪽에서 재사용 가능하도록 설계
  - GalleryModal 배경 클릭 닫기: backdrop div onClick + container stopPropagation 패턴
  - GalleryCard의 정적 Heart import 제거 — LikeButton이 내부적으로 Heart 포함
metrics:
  duration: 8m
  completed_date: "2026-04-06"
  tasks: 2
  files: 5
---

# Phase 09 Plan 04: 좋아요/북마크 인터랙션 + 갤러리 상세 모달 Summary

갤러리 카드의 인터랙션 레이어 완성 — LikeButton/BookmarkButton 낙관적 토글과 GalleryModal 상세 보기(ESC/배경 닫기, 입력 요약, 브랜드명 전체, 피드백 버튼) 구현.

## Tasks Completed

| # | Name | Commit | Files |
|---|------|--------|-------|
| 1 | LikeButton + BookmarkButton 컴포넌트 | 9e13a5c | LikeButton.tsx, BookmarkButton.tsx |
| 2 | GalleryModal + GalleryPage/GalleryCard 연결 | 941a901 | GalleryModal.tsx, GalleryPage.tsx, GalleryCard.tsx |

## What Was Built

### LikeButton (src/components/gallery/LikeButton.tsx)
- Heart 아이콘 토글 버튼: 채워짐(`fill-[#B48C50]`) / 비워짐(`text-[#A09890]`)
- useSocialStore.toggleLike 낙관적 업데이트 연결
- 44px 최소 터치 타겟, scale 150ms 애니메이션
- e.stopPropagation() — 카드 클릭 이벤트 차단
- aria-label="좋아요", showCount prop으로 카드/모달 겸용

### BookmarkButton (src/components/gallery/BookmarkButton.tsx)
- Bookmark 아이콘 토글 버튼: 채워짐(`fill-[#B48C50]`) / 비워짐(`text-[#A09890]`)
- useSocialStore.toggleBookmark 낙관적 업데이트 연결
- 44px 최소 터치 타겟, scale 150ms 애니메이션
- e.stopPropagation(), aria-label="북마크"

### GalleryModal (src/components/gallery/GalleryModal.tsx)
- 배경 클릭 + ESC 키 닫기 (Escape keydown 이벤트)
- body scroll 방지 (overflow: hidden)
- 입력 요약 섹션: competitors, marketTrend, usp, brandPersonality, longTermGoal/ceoVision, targetCustomer/customerDefinition 옵셔널 체이닝 처리
- 추천 브랜드명 전체 표시 + reasoning
- 피드백 푸터: LikeButton + BookmarkButton + 작성자/날짜
- max-w-[720px], animate-fadeIn, aria-label="닫기"

### 연결 작업
- GalleryPage: GalleryModal import 활성화, selectedSession 상태 연결
- GalleryCard: 정적 Heart + count 제거 → LikeButton + BookmarkButton으로 교체

## Decisions Made

- **showCount 분리:** LikeButton의 count 표시를 showCount prop으로 선택적 처리 — 카드(true)와 모달(true) 모두 표시
- **배경 닫기 패턴:** backdrop div에 onClick(onClose) + modal container에 stopPropagation — 단순하고 검증된 패턴
- **Heart import 제거:** GalleryCard에서 Heart 직접 import 제거, LikeButton 컴포넌트로 위임 (중복 제거)

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None - 모든 데이터 소스 연결 완료. input_data 필드는 optionally rendered (filter by truthy value).

## Verification Results

- `npx tsc --noEmit`: 오류 없음
- GalleryModal: fixed inset-0 bg-black/60, max-w-[720px], animate-fadeIn, Escape, aria-label="닫기", stopPropagation, sessionService.formatDate 모두 포함
- GalleryPage: GalleryModal import + selectedSession 연결 확인
- GalleryCard: LikeButton + BookmarkButton 연결, Heart import 제거 확인
- 모든 파일 500줄 이하

## Self-Check: PASSED

| Item | Status |
|------|--------|
| src/components/gallery/LikeButton.tsx | FOUND |
| src/components/gallery/BookmarkButton.tsx | FOUND |
| src/components/gallery/GalleryModal.tsx | FOUND |
| Commit 9e13a5c | FOUND |
| Commit 941a901 | FOUND |
