# Phase 4: 산업분류 계층형 드롭다운 - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

기존 14개 flat 업종 드롭다운을 247개 소분류 산업분류 기반 4단 계층형 입력(대분류 > 중분류 > 소분류 드롭다운 + 비고 텍스트)으로 교체. localStorage 마이그레이션 포함. 선택된 업종 경로가 AI 프롬프트에 반영.

</domain>

<decisions>
## Implementation Decisions

### 업종 선택 구조
- **D-01:** 4단 구조 — 대분류 > 중분류 > 소분류(드롭다운 3개) + 비고(텍스트 입력 1개)
- **D-02:** 비고 필드는 소분류로 구분이 부족한 업종(고양이카페, 만화카페 등)을 사용자가 직접 보충하는 용도
- **D-03:** 네이티브 `<select>` 사용 (v1.1 결정사항), 검색/필터 없음 (Out of Scope)

### 레이아웃 배치
- **D-04:** 2열 2행 grid 배치 — 1행: 대분류 | 중분류, 2행: 소분류 | 비고
- **D-05:** 기존 StoreBasicSection의 `grid-cols-2` 패턴과 동일한 레이아웃 유지

### 선택 경험 & 초기화
- **D-06:** 상위 분류 변경 시 하위 전체 초기화 — 대분류 변경 → 중/소분류 + 비고 초기화, 중분류 변경 → 소분류 + 비고 초기화
- **D-07:** 상위 미선택 시 하위 드롭다운은 disabled 상태로 표시 (숨기지 않음 — 전체 구조 파악 가능)

### AI 프롬프트 반영
- **D-08:** 전체 경로를 AI 프롬프트에 전달 — `"업종: 음식점 > 한식 > 분식 (비고: 떡볶이 전문)"` 형태
- **D-09:** gemini.ts의 FIELD_LABELS 및 프롬프트 구성 로직 수정 필요

### localStorage 마이그레이션
- **D-10:** 무음 자동 마이그레이션 — 앱 로드 시 기존 데이터 자동 변환, 사용자는 변화를 모름
- **D-11:** 14개 기존 flat 카테고리 → 새 대/중/소분류 매핑 테이블 작성
- **D-12:** 기존 batches는 그대로 유지, 업종 필드만 새 IndustrySelection 스키마로 변환

### Claude's Discretion
- 247개 소분류 산업분류 데이터의 구체적 분류 체계 (통계청 표준산업분류 등 참고)
- IndustrySelection 타입의 구체적 필드 설계
- 마이그레이션 함수의 매핑 테이블 상세 내용
- 비고 필드의 placeholder 문구

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 프로젝트 요구사항
- `.planning/REQUIREMENTS.md` — INDUSTRY-01~03 요구사항 정의
- `.planning/ROADMAP.md` §Phase 4 — Success Criteria 4개 항목

### 기존 코드 (교체 대상)
- `src/components/sections/StoreBasicSection.tsx` — 현재 CATEGORY_OPTIONS 14개 flat 드롭다운, grid-cols-2 레이아웃
- `src/components/ui/Dropdown.tsx` — 재사용할 네이티브 `<select>` 드롭다운 컴포넌트
- `src/types/form.ts` — StoreBasicState.category: string → IndustrySelection 타입 변경 필요
- `src/store/useFormStore.ts` — Zustand persist 설정, localStorage key: `brand-naming-data`
- `src/services/gemini.ts` — FIELD_LABELS 및 프롬프트 구성 (업종 경로 반영 필요)

### v1.1 결정사항
- `.planning/STATE.md` §Decisions — 네이티브 `<select>` 3개 연쇄, 새 npm 패키지 없음
- `.planning/REQUIREMENTS.md` §Out of Scope — 드롭다운 검색/필터 제외

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Dropdown` 컴포넌트 (src/components/ui/Dropdown.tsx): 네이티브 `<select>` 기반, label/value/onChange/options/disabled props — 3개 드롭다운에 그대로 재사용 가능
- `TextArea` 컴포넌트 (src/components/ui/TextArea.tsx): 비고 필드에 재사용 가능
- `SectionHeader` 컴포넌트: 섹션 제목 표시
- `RecommendButton` 컴포넌트: 추천 버튼

### Established Patterns
- Zustand selector 패턴: `useFormStore((st) => st.storeBasic)` 개별 selector 사용
- grid-cols-2 레이아웃: StoreBasicSection에서 업종+규모 가로 배치 패턴
- persist middleware: batches만 localStorage에 저장, merge 함수로 Date 역직렬화

### Integration Points
- `StoreBasicSection.tsx`: CATEGORY_OPTIONS 제거 → 4단 계층형 UI로 교체
- `form.ts`: StoreBasicState.category 타입 변경 (string → IndustrySelection)
- `useFormStore.ts`: updateStoreBasic 액션, persist merge 로직에 마이그레이션 추가
- `gemini.ts`: FIELD_LABELS.category 및 프롬프트 빌드 로직 수정

</code_context>

<specifics>
## Specific Ideas

- 고양이카페, 만화카페 같은 세분류 불가 업종이 비고 필드의 핵심 사용 사례
- 기존 grid-cols-2 패턴을 그대로 살려서 2열 2행 배치 (일관성)
- AI에게 전체 경로를 전달하여 맥락 파악 극대화

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-industry-dropdown*
*Context gathered: 2026-04-01*
