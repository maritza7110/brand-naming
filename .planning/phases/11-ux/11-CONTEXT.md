# Phase 11: 위저드 탭 UX 재설계 - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

기존 3탭 위저드(분석/정체성/표현)를 **4탭 구조(분석/정체성/페르소나/표현)**로 재설계한다. 16개 페르소나 필드를 의미 기반 5그룹 컨테이너로 분리하고, 시장트렌드를 분석탭으로 이동하며, 탭 간 필드 중복을 관점 차이 명시로 해소한다.

</domain>

<decisions>
## Implementation Decisions

### 탭 구조 재설계 (3탭 → 4탭)
- **D-01:** 4탭 구조 채택: 분석 / 정체성 / 페르소나(NEW) / 표현
  - **분석 탭** (시장 환경): 매장기본(StoreBasic) + 경쟁사 + USP + 시장트렌드(이동)
  - **정체성 탭** (브랜드 내부): 브랜드비전(BrandVision) + 브랜드퍼스널리티(BrandPersonality)
  - **페르소나 탭** (브랜드 성격, 신규): 기존 PersonaSection의 16개 필드를 5그룹 컨테이너로 분리
  - **표현 탭** (네이밍 출력): 제품서비스(Product) + 네이밍스타일 + 언어제약
- **D-02:** 탭 네비게이션은 기존 WizardTabs 컴포넌트 유지 + 4칸 균등분할(25%). 슬라이딩 인디케이터 width도 25%로 변경.
- **D-03:** TabId 타입에 'persona' 추가. Zustand store의 activeTab 기본값은 'analysis' 유지.

### 시장트렌드 이동
- **D-04:** MarketTrendSection을 정체성 탭에서 분석 탭으로 이동. 시장트렌드는 외부 환경 분석이므로 분석 탭이 자연스러움.

### 페르소나 5그룹 컨테이너 분리
- **D-05:** 기존 페르소나 앱(persona-pearl.vercel.app)의 FIELD_METADATA 카테고리 구분을 그대로 적용:
  1. **브랜드 정체성 (Identity & Visual)** — 철학, 슬로건, 브랜드멘트, 브랜드키워드
  2. **전략 & 경쟁력 (Strategy & Competitiveness)** — 핵심기술, 핵심전략, 비교우위
  3. **고객 & 시장 (Market & Customer)** — 고객정의, 고객가치, 고객문화창조
  4. **혜택 & 가치 (Benefits & Value)** — 품질수준, 가격수준, 기능적혜택, 경험적혜택, 상징적혜택
  5. **고객 경험 (Experience & Management)** — 멤버쉽철학
- **D-06:** 5그룹 모두 펼쳐서 스크롤 — 아코디언 접기/펼치기 없이 컨테이너 헤더로 구분. 전부 보이는 상태.
- **D-07:** 각 그룹은 기존 섹션 컨테이너 스타일(rounded-2xl, bg/border)과 SectionHeader 패턴 재사용.

### 필드 중복 해소
- **D-08:** 분석탭(경쟁사/USP)과 페르소나탭(전략&경쟁력 그룹)의 중복은 **관점 차이를 레이블/placeholder로 명시**하여 해소:
  - 분석탭 경쟁사: "시장 현황 관점" — 경쟁사가 누구이고 어떤 USP가 있는지 (외부 분석)
  - 페르소나탭 전략&경쟁력: "브랜드 내부 관점" — 우리만의 기술/전략/우위는 무엇인지 (내부 정의)
  - 구체적인 placeholder 문구는 Claude 재량

### Claude's Discretion
- 각 페르소나 그룹 컨테이너의 헤더 디자인 (아이콘, 색상 차별화 여부)
- 페르소나 탭 내 5그룹 간 간격 및 시각적 구분 강도
- 중복 필드의 구체적인 placeholder/가이드 텍스트 문구
- 4탭 모바일 반응형 처리 (기존 패턴 따름)
- 각 탭의 KeywordWeightSlider/RecommendButton 배치는 기존 패턴 유지

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 기존 페르소나 앱 (카테고리 구분 원본)
- `C:/persona/brand/types.ts` — FIELD_METADATA의 5개 category 정의. 페르소나 그룹핑의 원본 기준
- `C:/persona/brand/components/PersonaBuilder.tsx` — 기존 앱의 페르소나 빌더 UI 패턴 참조

### 현재 코드베이스 (수정 대상)
- `src/components/wizard/WizardTabs.tsx` — 3탭 → 4탭 변경 대상
- `src/components/wizard/AnalysisTab.tsx` — 시장트렌드 섹션 추가 대상
- `src/components/wizard/IdentityTab.tsx` — PersonaSection/MarketTrendSection 제거 대상
- `src/components/wizard/ExpressionTab.tsx` — 변경 없음 (확인용)
- `src/components/sections/PersonaSection.tsx` — 5그룹 분리 리팩토링 대상
- `src/store/useFormStore.ts` — TabId 타입 확장 대상
- `src/types/form.ts` — TabId 타입 정의 위치

### Phase 8 컨텍스트
- `.planning/phases/08-strategic-naming-logic-intelligence/08-CONTEXT.md` — 기존 3탭 위저드 결정사항 (D-01~D-03)

### 프로젝트 요구사항
- `.planning/REQUIREMENTS.md` — v2.0 UI/UX 개선 요구사항

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/wizard/WizardTabs.tsx` — 탭 네비게이션 + 슬라이딩 인디케이터. TABS 배열에 항목 추가 + width 33%→25% 변경으로 4탭 대응
- `src/components/sections/PersonaSection.tsx` — 현재 16개 필드 단일 렌더링. 5개 서브 컴포넌트로 분리 필요
- `src/components/ui/SectionHeader.tsx` — 섹션 헤더 컴포넌트. 각 그룹 컨테이너 헤더에 재사용
- `src/components/sections/MarketTrendSection.tsx` — 분석탭으로 이동할 컴포넌트
- `src/components/ui/KeywordWeightSlider.tsx` — 각 탭의 키워드 가중치 슬라이더
- `src/components/ui/RecommendButton.tsx` — 각 탭의 추천 버튼

### Established Patterns
- 탭별 독립 추천 흐름: 각 탭이 자체 RecommendButton + KeywordWeightSlider 보유
- 섹션 컨테이너: `rounded-2xl bg-[#363230] p-5 lg:p-7 border border-[#4A4440]`
- grid-template-rows 0fr/1fr 패턴 (RecommendGroup의 접기/펼치기)
- Zustand persist version 3 (migration 필요할 수 있음)

### Integration Points
- `src/pages/NamingPage.tsx` — WizardTabs + 탭 컨텐츠 렌더링 위치
- `src/components/layout/InputPanel.tsx` — tabBar prop으로 WizardTabs 수신
- `src/types/form.ts` — TabId union type 정의

</code_context>

<specifics>
## Specific Ideas

- 기존 페르소나 앱(persona-pearl.vercel.app)의 5개 카테고리 구분을 그대로 채택 — 이미 검증된 의미 분류
- 페르소나 탭은 "브랜드 성격"이라는 독립된 관심사를 가지므로 별도 탭으로 승격
- 5그룹 전부 펼쳐서 보여주되, 컨테이너 헤더로 시각적 구분을 명확히
- 분석탭과 페르소나탭의 유사 필드는 "시장 현황 관점" vs "브랜드 내부 관점"으로 차별화

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 11-ux*
*Context gathered: 2026-04-03*
