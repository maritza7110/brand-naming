---
phase: 09-social-gallery-collaboration
plan: 02
subsystem: dashboard
tags: [publish, bookmark, tabs, social]
dependency_graph:
  requires: ["09-01"]
  provides: ["SOCIAL-PUBLISH", "SOCIAL-BOOKMARK"]
  affects: ["src/pages/Dashboard.tsx", "src/components/dashboard/ProjectCard.tsx"]
tech_stack:
  added: []
  patterns: ["낙관적 업데이트", "탭 기반 레이아웃", "소셜 상태 초기화"]
key_files:
  created: []
  modified:
    - src/services/sessionService.ts
    - src/components/dashboard/ProjectCard.tsx
    - src/pages/Dashboard.tsx
    - src/components/dashboard/ProjectList.tsx
decisions:
  - "publishSession은 sessionService에서 단독 관리 — galleryService 중복 구현 방지"
  - "발행 철회는 confirm 없이 즉시 실행 (D-05 per spec)"
  - "북마크 탭 진입 시 useSocialStore.initSocialState 호출로 bookmarkedIds 동기화"
metrics:
  duration_seconds: 107
  completed_date: "2026-04-06"
  tasks_completed: 2
  files_modified: 4
---

# Phase 09 Plan 02: Dashboard 발행/철회 + 북마크 탭 Summary

**One-liner:** 대시보드에 발행/철회 UI와 내 프로젝트|북마크 탭 시스템을 추가해 갤러리 공유 플로우 완성

## What Was Built

### Task 1: sessionService.publishSession + ProjectCard 발행/철회 UI
- `sessionService.publishSession(id, isPublic)`: Supabase `sessions` 테이블의 `is_public` 필드를 직접 업데이트
- `ProjectCard`에 `onPublishToggle` prop 추가
- 비공개 세션: "갤러리에 발행" 버튼 (골드 테두리 + Globe 아이콘)
- 공개 세션: "공개중" 에메랄드 배지 + "발행 철회" 버튼 (즉시 실행)
- `stopPropagation`으로 카드 클릭 이벤트와 충돌 방지

### Task 2: Dashboard 탭 시스템 + 북마크 탭
- `activeTab` 상태 (`projects` | `bookmarks`) 추가
- 탭 UI: 골드 언더라인 인디케이터 (`border-b-2 border-[#B48C50]`)
- `handlePublishToggle`: `sessionService.publishSession` 호출 + `setSessions` 낙관적 업데이트
- 북마크 탭 진입 시: `useSocialStore.getState().initSocialState(user.id)` + `socialService.getMyBookmarks` 호출
- 북마크 빈 상태: "저장한 프로젝트가 없습니다" + 안내 문구
- 북마크 목록: 제목 + 업종 + 작성자(profiles.full_name) 표시
- `ProjectList`에 `onPublishToggle` prop 전달 체인 완성

## Verification

- TypeScript 컴파일: 에러 없음 (`npx tsc --noEmit`)
- 모든 파일 500줄 이하 (sessionService: 62, ProjectCard: 83, Dashboard: 187, ProjectList: 54)
- 정적 import 사용 (socialService, useSocialStore)
- must_haves.truths 전부 충족

## Deviations from Plan

None - plan executed exactly as written.

## Commits

| Task | Commit | Files |
|------|--------|-------|
| Task 1: publishSession + 발행/철회 UI | `e54d868` | sessionService.ts, ProjectCard.tsx |
| Task 2: 탭 시스템 + 북마크 탭 | `6f49fa7` | Dashboard.tsx, ProjectList.tsx |

## Self-Check: PASSED
