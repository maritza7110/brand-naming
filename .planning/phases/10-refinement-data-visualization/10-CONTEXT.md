# Phase 10: Refinement & Data Visualization - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

갤러리의 고도화된 검색/필터 시스템(업종·스타일·태그·키워드), 댓글 피드백 기능, 개인 대시보드의 네이밍 데이터 시각화(인기 키워드·업종 분포·네이밍 스타일), 갤러리 인기 랭킹/리더보드를 구현하고 v2.0 최종 QA 및 배포를 수행한다.

</domain>

<decisions>
## Implementation Decisions

### 갤러리 필터링
- **D-01:** 상단 필터바 방식 채택. 기존 GallerySortTabs 아래에 업종/스타일/태그 칩 필터 줄 + 키워드 검색 필드를 배치.
- **D-02:** 업종 필터는 대분류 단위(음식/소매/서비스 등) 칩으로 제공. 238개 소분류 전체 노출 아님.
- **D-03:** 네이밍 스타일 필터 — Phase 8에서 구현한 네이밍 기법(합성어/추상어/은유/두문자 등)으로 필터링.
- **D-04:** 키워드 검색 — 브랜드명/입력 데이터 텍스트 검색. 기존 TextField 컴포넌트 재사용.
- **D-05:** 자동 태그만 구현. AI가 네이밍 결과에서 스타일/업종/특징을 자동 추출하여 태그 부여. 사용자 수동 태그 없음.

### 댓글 시스템
- **D-06:** GalleryModal 내 인라인 배치. 모달 하단에 댓글 목록 + 입력 폼 섹션 추가.
- **D-07:** 1단계 플랫 댓글만 지원. 대댓글/스레드 없음 — 100인 사내 앱에 충분한 수준.
- **D-08:** 댓글 작성자 프로필명 + 작성일 표시. 삭제는 본인 댓글만 가능.

### 데이터 시각화
- **D-09:** 대시보드 하단 섹션에 통계 차트 배치. 기존 프로젝트/북마크 탭 아래에 통계 영역 추가.
- **D-10:** 시각화 항목 3가지:
  1. 내 인기 키워드 — 내 프로젝트에서 자주 사용한 키워드/업종 빈도 차트
  2. 업종별 프로젝트 분포 — 내 프로젝트의 업종 분포 파이/도넛 차트
  3. 네이밍 스타일 통계 — AI가 생성한 브랜드명의 네이밍 기법 분포
- **D-11:** 차트 라이브러리 및 구체적 차트 유형은 Claude 재량.

### 인기 랭킹/리더보드
- **D-12:** 갤러리 상단 통합. 갤러리 페이지 상단에 '이번 주 인기 TOP' 섹션 추가 — 갤러리 진입 시 바로 노출.
- **D-13:** 랭킹 기준은 좋아요 수 단순 정렬. 복합 점수 없음.
- **D-14:** 기간 탭: 주간 + 전체 두 가지. 이번 주 인기 / 역대 인기 전환 가능.

### Claude's Discretion
- 필터바의 구체적 UI 디자인 (칩 색상, 간격, 반응형 배치)
- 자동 태그 추출 로직 (Gemini 기반 or 규칙 기반)
- 댓글 DB 스키마 설계 (comments 테이블)
- 차트 라이브러리 선택 (recharts, chart.js 등)
- 차트 색상/스타일링
- 리더보드 카드 디자인 및 표시 개수
- 모바일 반응형 처리 (필터바 축소, 차트 리사이즈)
- v2.0 최종 QA 범위 및 배포 체크리스트

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 프로젝트 요구사항
- `.planning/REQUIREMENTS.md` — v2.0 전체 요구사항 (분류 필터, 데이터 대시보드, 소셜 협업)
- `.planning/PROJECT.md` — Core Value, 제약사항, Key Decisions

### Phase 9 컨텍스트 (갤러리 기반)
- `.planning/phases/09-social-gallery-collaboration/09-CONTEXT.md` — 갤러리 레이아웃, 발행 흐름, 좋아요/북마크 결정사항
- `src/pages/GalleryPage.tsx` — 갤러리 페이지 (필터바/리더보드 추가 대상)
- `src/components/gallery/GalleryGrid.tsx` — 갤러리 그리드 (필터링 연동 대상)
- `src/components/gallery/GallerySortTabs.tsx` — 정렬 탭 (필터바 인접 배치)
- `src/components/gallery/GalleryModal.tsx` — 갤러리 모달 (댓글 섹션 추가 대상)
- `src/services/galleryService.ts` — 갤러리 서비스 (필터 쿼리 확장 대상)
- `src/store/useGalleryStore.ts` — 갤러리 스토어 (필터 상태 확장 대상)

### Phase 8 컨텍스트 (네이밍 로직)
- `.planning/phases/08-strategic-naming-logic-intelligence/08-CONTEXT.md` — 네이밍 스타일/기법 결정사항, Rationale 구조

### 기존 UI 컴포넌트 (재사용 대상)
- `src/components/ui/ChipSelector.tsx` — 칩 선택 UI (필터 칩에 재사용)
- `src/components/ui/TextField.tsx` — 텍스트 필드 (키워드 검색에 재사용)
- `src/data/industryData.ts` — 238개 산업분류 데이터 (업종 대분류 필터 원본)

### 대시보드 (시각화 추가 대상)
- `src/pages/Dashboard.tsx` — 대시보드 페이지 (통계 섹션 추가 대상)
- `src/services/sessionService.ts` — 세션 CRUD (통계 데이터 조회 확장)

### 소셜 서비스 (댓글/랭킹 확장 대상)
- `src/services/socialService.ts` — 좋아요/북마크 서비스 (댓글 서비스 확장)
- `src/store/useSocialStore.ts` — 소셜 스토어 (댓글 상태 확장)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/ChipSelector.tsx` — 칩 선택 컴포넌트. 업종/스타일 필터 칩에 직접 재사용 가능
- `src/components/ui/TextField.tsx` — 텍스트 필드. 키워드 검색 입력에 재사용
- `src/components/gallery/GallerySortTabs.tsx` — 정렬 탭 UI. 리더보드 기간 탭에 패턴 참조
- `src/components/gallery/GalleryCard.tsx` — 갤러리 카드. 리더보드 TOP 카드에 패턴 참조
- `src/components/gallery/LikeButton.tsx` — 좋아요 버튼 (showCount prop). 리더보드 카드에 재사용
- `src/data/industryData.ts` — 238개 산업분류 (대분류 추출하여 필터 칩 생성)
- `src/hooks/useInfiniteScroll.ts` — 무한 스크롤 훅. 갤러리 필터링과 연동 필요

### Established Patterns
- Supabase 기반 CRUD (sessionService, galleryService, socialService)
- Zustand 상태 관리 (useGalleryStore, useSocialStore, useFormStore)
- Tailwind CSS 4 유틸리티 스타일링
- 다크 테마: `bg-[#0F0F11]`, `bg-[#1A1A1E]`, `border-white/5`, `text-[#B48C50]` 포인트
- React Router v7 기반 라우팅
- GalleryModal: backdrop onClick + container stopPropagation 패턴

### Integration Points
- `src/pages/GalleryPage.tsx` — 필터바 + 리더보드 섹션 추가
- `src/components/gallery/GalleryModal.tsx` — 댓글 섹션 추가
- `src/pages/Dashboard.tsx` — 통계 시각화 섹션 추가
- `src/services/galleryService.ts` — 필터 쿼리 파라미터 확장
- `src/store/useGalleryStore.ts` — 필터 상태 + 리더보드 데이터 추가
- `src/services/socialService.ts` — 댓글 CRUD 추가
- `src/services/supabase.ts` — Supabase 쿼리 (댓글, 필터, 랭킹)

</code_context>

<specifics>
## Specific Ideas

- 필터바는 GallerySortTabs 바로 아래에 위치하여 정렬+필터가 자연스럽게 연결
- 업종 필터는 대분류 칩만 표시 — 238개 소분류는 과도, 대분류(음식/소매/서비스 등)로 충분
- 자동 태그는 AI가 네이밍 결과 생성 시 함께 추출 — 발행 시점이 아닌 생성 시점에 태깅
- 댓글은 GalleryModal 내 스크롤 가능한 섹션으로 추가 — 모달 높이 조정 필요
- 대시보드 통계는 프로젝트가 3개 이상일 때만 표시 — 데이터 부족 시 의미 없음
- 리더보드 TOP은 3~5개 카드로 가로 스크롤 또는 캐러셀 형태

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 10-refinement-data-visualization*
*Context gathered: 2026-04-06*
