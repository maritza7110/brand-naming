# Phase 6: 모바일 반응형 - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Phase Boundary

모바일 기기(1024px 미만)에서 입력(위) + 추천(아래) 세로 스택 레이아웃으로 전환하고, 터치 UX를 최적화한다. 데스크톱(1024px 이상)에서는 기존 70/30 좌우 분할 레이아웃을 유지한다.

</domain>

<decisions>
## Implementation Decisions

### 추천 패널 모바일 배치
- **D-01:** 모바일에서 입력 폼 아래에 추천 패널이 고정 스택으로 배치 (탭/FAB 전환 아님)
- **D-02:** 모바일에서 추천 버튼 클릭 후 추천 결과 영역으로 부드럽게 자동 스크롤 (scrollIntoView smooth)

### 업종 드롭다운 모바일 레이아웃
- **D-03:** 모바일에서 업종 4개 드롭다운(대/중/소분류 + 비고)을 2x2 grid → 1열 세로 스택으로 변경
- **D-04:** 모바일에서 모든 2열 grid 필드를 1열로 변경 (업종뿐 아니라 위치+규모, 가격대+타겟 등 전부)

### 모바일 히어로/헤더 처리
- **D-05:** 모바일에서 히어로 영역 축소 — 제목/설명 컴팩트하게
- **D-06:** API설정·네이밍 초기화 버튼을 히어로 아래로 재배치 (데스크톱의 우측 배치 → 모바일에서 하단 배치)

### Claude's Discretion
- 구체적인 Tailwind 브레이크포인트 전환 전략 (lg: 기준)
- 터치 타겟 크기, 패딩, 폰트 크기 조정 범위 (MOBILE-03)
- 자동 스크롤 타이밍 및 오프셋
- 히어로 축소 시 구체적인 폰트/패딩 값

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 프로젝트 요구사항
- `.planning/REQUIREMENTS.md` — MOBILE-01~03 요구사항 정의
- `.planning/ROADMAP.md` §Phase 6 — Success Criteria 3개 항목

### 핵심 수정 대상 코드
- `src/components/layout/AppLayout.tsx` — `grid grid-cols-[7fr_3fr] min-w-[1024px]` 제거 및 반응형 전환 (최우선)
- `src/components/layout/InputPanel.tsx` — `max-w-[640px] px-8 pt-12` 등 고정값, 히어로 영역 버튼 배치
- `src/components/layout/RecommendPanel.tsx` — `sticky top-0 h-screen` 모바일에서 해제
- `src/App.tsx` — 전체 레이아웃 통합, 자동 스크롤 로직 추가 위치

### 2열 grid 사용 컴포넌트 (1열 전환 대상)
- `src/components/sections/StoreBasicSection.tsx` — 업종 2x2 grid + 기타 필드 grid-cols-2
- `src/components/sections/BrandVisionSection.tsx` — 확인 필요
- `src/components/sections/PersonaSection.tsx` — 확인 필요

### 이전 Phase 결정사항
- `.planning/phases/01-foundation-input-ui/01-CONTEXT.md` — D-07~D-14: 레이아웃/디자인 결정
- `.planning/phases/04-industry-dropdown/04-CONTEXT.md` — D-04: 2x2 grid 배치 결정
- `.planning/STATE.md` §Blockers — `AppLayout의 min-w-[1024px] 제거 필요` 명시

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `AppLayout` 컴포넌트: left/right props 슬롯 구조 — 모바일에서 세로 스택으로 전환만 하면 됨
- `RecommendGroup` 컴포넌트: 접기/펼치기 + CSS Grid 0fr/1fr 트랜지션 — 모바일에서도 그대로 동작
- Tailwind CSS 4.x: `lg:` 브레이크포인트 유틸리티 사용 가능

### Established Patterns
- Tailwind 유틸리티 기반 스타일링 (inline className)
- 고정 px 값 사용 다수: `text-[26px]`, `text-[13px]`, `px-8`, `pt-12` 등
- `grid-cols-2` 패턴: StoreBasicSection에서 필드 2열 배치

### Integration Points
- `AppLayout.tsx`: min-w-[1024px] 제거 + grid-cols-[7fr_3fr] → lg: 브레이크포인트 반응형으로 전환
- `InputPanel.tsx`: 히어로 내부 flex 레이아웃 → 모바일 세로 배치, max-w/px 조정
- `RecommendPanel.tsx`: sticky/h-screen → 모바일에서 해제
- 각 Section 컴포넌트: grid-cols-2 → 모바일 grid-cols-1

</code_context>

<specifics>
## Specific Ideas

- AppLayout의 min-w-[1024px] 제거가 최우선 작업 (STATE.md에서 blocker로 기록)
- 모바일 자동 스크롤은 추천 버튼 클릭 → 로딩 완료 후 추천 결과 섹션으로 smooth scroll
- 데스크톱 레이아웃은 변경 없이 유지 — 모바일 전용 반응형 추가

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-mobile-responsive*
*Context gathered: 2026-04-02*
