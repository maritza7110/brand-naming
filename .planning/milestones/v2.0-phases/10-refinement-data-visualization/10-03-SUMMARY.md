---
phase: 10
plan: 03
subsystem: gallery-comments
tags: [comment-section, gallery-modal, social, crud]
dependency_graph:
  requires: ["10-01"]
  provides: ["COMMENT-UI"]
  affects: ["GalleryModal", "useSocialStore"]
tech_stack:
  added: ["date-fns/locale/ko"]
  patterns: ["낙관적 업데이트", "Zustand store 구독", "formatDistanceToNow 상대시간"]
key_files:
  created:
    - src/components/gallery/CommentSection.tsx
  modified:
    - src/components/gallery/GalleryModal.tsx
decisions:
  - "CommentSection에 max-h-[240px] overflow-y-auto 댓글 목록 스크롤 적용 (UI-SPEC 준수)"
  - "CommentItem을 내부 함수 컴포넌트로 분리 — 가독성 향상, 파일 단일 책임 유지"
  - "댓글 삭제는 confirm 없이 즉시 deleteComment 호출 (D-08, UI-SPEC destructive action 규칙)"
metrics:
  duration: "1분"
  completed: "2026-04-06"
  tasks: 2
  files: 2
---

# Phase 10 Plan 03: CommentSection — 갤러리 모달 댓글 섹션 Summary

CommentSection 신규 생성 및 GalleryModal 하단 마운트 — useSocialStore 댓글 CRUD 연동, 낙관적 업데이트, 미인증 안내 포함.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | CommentSection 컴포넌트 생성 | 9b993c6 | src/components/gallery/CommentSection.tsx |
| 2 | GalleryModal에 CommentSection 마운트 | cd3be71 | src/components/gallery/GalleryModal.tsx |

## What Was Built

### Task 1: CommentSection 컴포넌트 생성

`src/components/gallery/CommentSection.tsx` (117줄) 신규 생성:

- **댓글 목록:** `useSocialStore`에서 `comments`, `isCommentsLoading`, `fetchComments`, `addComment`, `deleteComment` 구독
- **마운트 fetch:** `useEffect`에서 `fetchComments(sessionId)` 호출
- **CommentItem 내부 컴포넌트:** 작성자명 (`profiles.full_name || '익명'`), 상대 시간 (`formatDistanceToNow` + `date-fns/locale/ko`), 본문 (`whitespace-pre-wrap`), 삭제 버튼 (본인만 — `Trash2` 아이콘)
- **댓글 입력 폼:** `textarea` (maxLength=500, min-h-[80px]), "댓글 작성" 버튼 — 인증 사용자에게만 표시
- **미인증 안내:** "댓글을 작성하려면 로그인하세요" (textarea 대신 표시)
- **빈 상태:** "아직 댓글이 없습니다" / 로딩 중: "댓글을 불러오는 중..."
- **댓글 삭제:** confirm 없이 즉시 `deleteComment(comment.id)` 호출 (D-08 spec 준수)

### Task 2: GalleryModal 수정

`src/components/gallery/GalleryModal.tsx` (127줄):

- `import CommentSection from './CommentSection'` 추가
- 모달 컨테이너 `max-h-[80vh]` → `max-h-[90vh]` 확장 (댓글 섹션 수용)
- 피드백 영역 다음에 `<hr className="border-[#4A4440] my-4" />` + `<CommentSection sessionId={session.id} />` 마운트

## Deviations from Plan

None — 계획대로 정확히 실행됨.

## Known Stubs

없음. CommentSection은 useSocialStore를 통해 실제 Supabase DB에 연결됨.

## Self-Check

### Files exist
- `src/components/gallery/CommentSection.tsx` — FOUND
- `src/components/gallery/GalleryModal.tsx` — FOUND (수정됨)

### Commits exist
- `9b993c6` — feat(10-03): create CommentSection component
- `cd3be71` — feat(10-03): mount CommentSection in GalleryModal

## Self-Check: PASSED
