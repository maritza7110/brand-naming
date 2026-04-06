# Phase 9: Social Gallery & Collaboration - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

네이밍 프로젝트의 공개 발행(Publish) 로직을 구현하고, 타 사용자의 공유 데이터를 탐색할 수 있는 Public Gallery UI를 구축하며, 좋아요/북마크 피드백 기능을 추가한다. 댓글 기능은 Phase 10으로 보류.

</domain>

<decisions>
## Implementation Decisions

### 갤러리 레이아웃
- **D-01:** 카드 그리드 레이아웃 채택. Pinterest/Dribbble 스타일 2~3칸 그리드로 시각적 탐색. 기존 추천카드 UI 패턴 재사용.
- **D-02:** 카드 요약형 표시: 업종 + 대표 브랜드명 2~3개 + 좋아요/댓글 카운트 + 작성자. 간결하게 훑어보고 클릭하면 상세.
- **D-03:** 카드 클릭 시 모달 팝업으로 상세 보기. 입력 데이터, 브랜드명 전체, rationale, 피드백 등 모달 내에서 확인.

### 발행(Publish) 흐름
- **D-04:** 대시보드에서 발행. 내 대시보드 세션 목록에서 '발행' 버튼 클릭 → 발행 확인 → 갤러리 공개. 기존 `is_public` 필드 활용.
- **D-05:** 공개 중인 세션은 '철회' 버튼으로 비공개 전환 가능.
- **D-06:** 발행 시 세션 데이터 전체를 그대로 공개. 별도 편집/선택 단계 없이 단순하고 빠르게.

### 피드백 시스템
- **D-07:** Phase 9 범위: 좋아요(하트) + 북마크. 댓글은 Phase 10으로 보류하여 복잡도 조절.
- **D-08:** 좋아요 UI: 단순 하트 토글. 하트 아이콘 클릭 → 채워짐/비워짐 + 카운트. Instagram/Twitter 스타일.
- **D-09:** 북마크: 타인의 공개 프로젝트를 내 보관함에 저장. 대시보드에서 북마크 목록 확인 가능.

### 갤러리 탐색/정렬
- **D-10:** 기본 최신순 정렬 + 탭으로 인기순(좋아요 많은 순) 전환 가능.
- **D-11:** 무한 스크롤 로딩. Supabase pagination 활용하여 스크롤 시 자동 로드.

### Claude's Discretion
- 갤러리 카드의 구체적 시각 디자인 (색상, 간격, 그림자)
- 모달 팝업의 레이아웃 및 트랜지션
- 무한 스크롤의 배치 크기 및 로딩 스켈레톤
- Supabase 테이블 스키마 (likes, bookmarks 테이블 설계)
- 갤러리 빈 상태(Empty State) 디자인
- 모바일 반응형 그리드 (1~2칸)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 프로젝트 요구사항
- `.planning/REQUIREMENTS.md` — v2.0 소셜 및 협업 요구사항 (섹션 3)
- `.planning/PROJECT.md` — Core Value: Social Inspiration, 보안 제약사항

### 기존 인프라 (Phase 7)
- `src/services/supabase.ts` — Supabase 클라이언트 설정
- `src/services/sessionService.ts` — 세션 CRUD + `is_public` 필드 기반 발행 로직의 출발점
- `src/store/useAuthStore.ts` — 인증 상태 관리 (로그인 사용자 정보)

### 기존 UI 패턴
- `src/components/recommend/RecommendCardItem.tsx` — 추천 카드 UI 패턴 (갤러리 카드 재사용 참조)
- `src/components/dashboard/ProjectList.tsx` — 대시보드 세션 목록 (발행 버튼 추가 대상)
- `src/pages/Dashboard.tsx` — 대시보드 페이지 (발행/철회 기능 연동)

### 이전 Phase 컨텍스트
- `.planning/phases/08-strategic-naming-logic-intelligence/08-CONTEXT.md` — Rationale UI, 추천카드 확장 패턴
- `.planning/phases/11-ux/11-CONTEXT.md` — 4탭 위저드 구조, 섹션 컨테이너 스타일

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/recommend/RecommendCardItem.tsx` — 카드 확장 패턴. 갤러리 카드 디자인 참조 가능
- `src/components/ui/SectionHeader.tsx` — 섹션 헤더 컴포넌트 (갤러리 섹션 구분에 재사용)
- `src/components/recommend/EmptyState.tsx` — 빈 상태 컴포넌트 (갤러리 빈 상태에 재사용)
- `src/services/sessionService.ts` — `SessionData` 인터페이스에 `is_public` 이미 존재. 발행 로직 확장 가능
- `src/store/useAuthStore.ts` — 현재 로그인 사용자 정보 (좋아요/북마크 시 user_id 필요)

### Established Patterns
- Supabase 기반 CRUD (sessionService 패턴)
- Zustand 상태 관리 (useFormStore, useAuthStore, useSettingsStore)
- Tailwind CSS 4 유틸리티 스타일링
- 다크 테마: `bg-[#363230]`, `border-[#4A4440]`, `rounded-2xl`
- React Router v7 기반 라우팅

### Integration Points
- `src/App.tsx` — 갤러리 라우트 추가 (/gallery)
- `src/pages/Dashboard.tsx` — 발행/철회 버튼 추가
- `src/components/dashboard/ProjectList.tsx` — 세션 카드에 발행 상태 표시
- `src/services/supabase.ts` — Supabase 쿼리 (공개 세션 조회, 좋아요/북마크)

</code_context>

<specifics>
## Specific Ideas

- 기존 `is_public` 필드를 활용하여 발행/철회를 단순 boolean 토글로 구현
- 카드 그리드는 2칸(모바일) → 3칸(데스크톱) 반응형
- 모달 팝업에서 해당 프로젝트의 입력 데이터 + 생성된 브랜드명 + rationale을 한 눈에 확인
- 인기순 정렬은 좋아요 수 기반 (단순 count)
- 100인 사내 앱이므로 대규모 최적화보다는 기능 완성도 우선

</specifics>

<deferred>
## Deferred Ideas

- **댓글 기능** — Phase 10으로 보류. 좋아요/북마크만 Phase 9에서 구현.
- **인기 랭킹/리더보드** — Phase 10 (Refinement & Data Visualization)에서 구현.
- **업종별 필터링** — Phase 10 (분류 필터링)에서 구현.

</deferred>

---

*Phase: 09-social-gallery-collaboration*
*Context gathered: 2026-04-06*
