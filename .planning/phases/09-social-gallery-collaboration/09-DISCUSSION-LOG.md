# Phase 9: Social Gallery & Collaboration - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-06
**Phase:** 09-social-gallery-collaboration
**Areas discussed:** 갤러리 레이아웃, 발행(Publish) 흐름, 피드백 시스템, 갤러리 탐색/정렬

---

## 갤러리 레이아웃

### Q1: 갤러리에서 공유된 프로젝트를 어떻게 보여줄까요?

| Option | Description | Selected |
|--------|-------------|----------|
| 카드 그리드 | Pinterest/Dribbble 스타일. 2~3칸 그리드로 시각적 탐색. 기존 추천카드 UI 패턴 재사용 가능. | ✓ |
| 리스트 피드 | Twitter/Linear 스타일. 세로 스크롤 1칸 리스트. 더 많은 정보 한 눈에 표시. | |
| 하이브리드 | 바둑판 스타일. 상단 피처드 카드 + 하단 그리드. 인기 프로젝트 강조. | |

**User's choice:** 카드 그리드
**Notes:** 기존 추천카드 UI 패턴 재사용 가능한 점이 장점

### Q2: 갤러리 카드에 표시할 정보는 어떻게 구성할까요?

| Option | Description | Selected |
|--------|-------------|----------|
| 요약형 | 업종 + 대표 브랜드명 2~3개 + 좋아요/댓글 카운트 + 작성자. 간결하게 훑어보고 클릭하면 상세. | ✓ |
| 상세형 | 업종 + 브랜드명 전부 + 타당성 점수 + 사용된 키워드 + 피드백 카운트. 카드에서 대부분 확인 가능. | |
| Claude 재량 | 카드 정보 밀도는 Claude가 적절하게 판단 | |

**User's choice:** 요약형

### Q3: 갤러리 카드 클릭 시 어떻게 상세 보기를 제공할까요?

| Option | Description | Selected |
|--------|-------------|----------|
| 모달 팝업 | 카드 클릭 시 모달로 전체 데이터 표시. 입력 데이터, 브랜드명 전체, rationale, 댓글 등. | ✓ |
| 별도 페이지 | /gallery/:id 경로로 상세 페이지 이동. URL 공유 가능. | |
| 카드 확장 | 기존 추천카드의 클릭→펼쳐짐 패턴 재사용. 그리드 내에서 확장. | |

**User's choice:** 모달 팝업

---

## 발행(Publish) 흐름

### Q1: 네이밍 세션을 갤러리에 발행하는 흐름은 어떻게 할까요?

| Option | Description | Selected |
|--------|-------------|----------|
| 대시보드에서 발행 | 내 대시보드 세션 목록에서 '발행' 버튼 클릭 → 발행 확인 → 갤러리 공개. 기존 is_public 필드 활용. | ✓ |
| 완료 시 자동 제안 | 네이밍 세션 완료 시 '갤러리에 발행할까요?' 토스트 자동 표시 | |
| 둘 다 | 대시보드에서 수동 발행 + 완료 시 자동 제안 모두 지원 | |

**User's choice:** 대시보드에서 발행

### Q2: 발행 전에 공개할 내용을 선택/편집할 수 있어야 할까요?

| Option | Description | Selected |
|--------|-------------|----------|
| 그대로 발행 | 세션 데이터 전체를 그대로 공개. 단순하고 빠름. | ✓ |
| 선택 발행 | 발행 전 공개할 브랜드명만 선택하거나 설명 추가 가능 | |
| 편집 후 발행 | 제목/설명/태그 편집 화면을 거쳐서 발행 | |

**User's choice:** 그대로 발행

---

## 피드백 시스템

### Q1: 피드백 기능 중 어떤 것을 Phase 9에 포함할까요?

| Option | Description | Selected |
|--------|-------------|----------|
| 좋아요 + 북마크 | 좋아요(하트)로 반응 + 북마크로 내 보관함 저장. 댓글은 Phase 10으로 보류하여 복잡도 조절. | ✓ |
| 전부 포함 | 좋아요 + 댓글 + 북마크 모두 Phase 9에서 구현 | |
| 좋아요만 | 최소한의 피드백. 북마크/댓글은 나중에. | |

**User's choice:** 좋아요 + 북마크

### Q2: 좋아요 UI는 어떤 방식이 좋을까요?

| Option | Description | Selected |
|--------|-------------|----------|
| 단순 하트 토글 | 하트 아이콘 클릭 → 채워짐/비워짐 + 카운트. Instagram/Twitter 스타일. | ✓ |
| 리액션 선택 | Slack/Facebook 스타일. 여러 리액션 중 선택. | |
| Claude 재량 | UI 디테일은 Claude가 판단 | |

**User's choice:** 단순 하트 토글

---

## 갤러리 탐색/정렬

### Q1: 갤러리 정렬 방식은 어떻게 할까요?

| Option | Description | Selected |
|--------|-------------|----------|
| 최신순 + 인기순 | 기본 최신순, 탭으로 인기순(좋아요 많은 순) 전환 가능 | ✓ |
| 최신순만 | 단순하게 최신 발행 순서만 | |
| 다양한 정렬 | 최신순/인기순/업종별/트렌드 등 다양한 정렬 옵션 | |

**User's choice:** 최신순 + 인기순

### Q2: 갤러리 로딩 방식은 어떻게 할까요?

| Option | Description | Selected |
|--------|-------------|----------|
| 무한 스크롤 | 스크롤 내리면 자동 로드. Supabase pagination 활용. | ✓ |
| 페이지네이션 | 페이지 번호로 이동 | |
| Claude 재량 | 로딩 패턴은 Claude가 판단 | |

**User's choice:** 무한 스크롤

---

## Claude's Discretion

- 갤러리 카드의 구체적 시각 디자인 (색상, 간격, 그림자)
- 모달 팝업의 레이아웃 및 트랜지션
- 무한 스크롤의 배치 크기 및 로딩 스켈레톤
- Supabase 테이블 스키마 (likes, bookmarks 테이블 설계)
- 갤러리 빈 상태(Empty State) 디자인
- 모바일 반응형 그리드 (1~2칸)

## Deferred Ideas

- 댓글 기능 → Phase 10
- 인기 랭킹/리더보드 → Phase 10
- 업종별 필터링 → Phase 10
