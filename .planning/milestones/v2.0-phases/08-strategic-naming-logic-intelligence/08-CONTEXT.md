# Phase 8: Strategic Naming Logic (Intelligence) - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

기존 단일 스크롤 입력 폼을 **3단계 탭 위저드(분석-정체성-표현)**로 전환하고, Gemini 프롬프트를 논리적 프레임워크 기반으로 고도화하며, 네이밍 근거(Rationale) UI를 추가한다. 신규 데이터 항목(경쟁사, USP, 네이밍 스타일, 브랜드 퍼스널리티 등)도 이번 Phase에서 구현한다.

</domain>

<decisions>
## Implementation Decisions

### 위저드 전환 방식
- **D-01:** 탭 네비게이션 방식 채택. 상단에 [분석] [정체성] [표현] 탭을 두고 자유롭게 이동. 순서 강제 없이 원하는 단계부터 입력 가능.
- **D-02:** 시장중심 배치로 기존 섹션 재배치:
  - **분석 탭:** 매장기본(StoreBasic) + 경쟁사 분석(신규) + USP/차별화(신규)
  - **정체성 탭:** 브랜드비전(BrandVision) + 페르소나(Persona) + 시장 트렌드(신규) + 브랜드 퍼스널리티(신규)
  - **표현 탭:** 제품/서비스(Product) + 네이밍 스타일/언어 제약(신규, 고급 옵션)
- **D-03:** 기존 오른쪽 추천 패널(30%)은 단계별 즉시 추천 유지. 각 탭에서 입력할 때마다 해당 단계 데이터로 즉시 추천. 단계 진행될수록 더 정교해지는 기존 컨셉 동일.

### 프롬프트 고도화 전략
- **D-04:** 네이밍 스타일(합성어/추상어/은유/두문자 등)은 기본 AI 자동 판단 + '고급 옵션' 토글을 열면 사용자가 직접 선택 가능한 병행 방식.
- **D-05:** 키워드 가중치(HITL)는 슬라이더/점수 방식으로 구현. 각 키워드에 1~5 가중치 슬라이더를 붙여서 세밀하게 조절.
- **D-06:** 경쟁사/USP 데이터의 프롬프트 반영 방식은 Claude 재량. Researcher/Planner가 가장 효과적인 방식을 판단하여 구현.

### Rationale UI 설계
- **D-07:** 카드 확장 방식. 추천 카드를 클릭하면 펼쳐져서 상세 근거 표시: 어떤 입력에서 이 이름이 나왔는지, 네이밍 기법, 의미 분석 등.
- **D-08:** 논리적 타당성 점수를 백분율(%)로 표시. AI가 입력 데이터와의 일치도를 평가하여 각 이름에 % 점수 부여.

### 신규 입력 항목 범위
- **D-09:** 4개 신규 항목 전부 Phase 8에 포함:
  1. 경쟁사 분석 — 텍스트 입력 (분석 탭)
  2. USP/차별화 요소 — 텍스트 입력 (분석 탭)
  3. 네이밍 스타일/언어 제약 — 칩 선택 (표현 탭, 고급 옵션)
  4. 시장 트렌드/브랜드 퍼스널리티 — 트렌드는 텍스트, 퍼스널리티는 드롭다운/칩 (정체성 탭)
- **D-10:** 혼합 UI 방식. 항목 성격에 맞게 텍스트/드롭다운/칩 선택을 자연스럽게 혼합.

### Claude's Discretion
- 경쟁사/USP 데이터의 구체적 프롬프트 반영 전략 (D-06)
- 각 신규 항목의 placeholder 예시문 및 가이드 텍스트
- 키워드 가중치 슬라이더의 구체적 UI 디자인
- 타당성 점수(%) 산출 알고리즘
- 탭 간 이동 시 애니메이션/트랜지션 효과

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 소상공인 마스터 AI 입력 체계
- `C:/Users/고상진/Downloads/소상공인 마스터 ai.pdf` — 입력 섹션 구조의 기본 골격. 신규 항목 배치 시 참조

### 프로젝트 요구사항
- `.planning/REQUIREMENTS.md` — v2.0 요구사항 전체 (지능형 네이밍 로직 섹션)
- `.planning/PROJECT.md` — 프로젝트 핵심 가치 및 제약사항

### 기존 코드베이스
- `src/services/gemini.ts` — 현재 프롬프트 구조 (고도화 대상)
- `src/hooks/useRecommend.ts` — 추천 로직 (위저드 연동 대상)
- `src/store/useFormStore.ts` — 폼 상태 관리 (위저드 상태 확장 대상)
- `src/components/recommend/RecommendCardItem.tsx` — 추천 카드 UI (Rationale 확장 대상)

### Phase 1 컨텍스트
- `.planning/phases/01-foundation-input-ui/01-CONTEXT.md` — 기존 입력 폼 구조, 디자인 언어, 레이아웃 결정사항

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/sections/` — 4개 섹션 컴포넌트 (StoreBasicSection, BrandVisionSection, ProductSection, PersonaSection) → 위저드 탭으로 재배치
- `src/components/ui/Dropdown.tsx` — 드롭다운 컴포넌트 → 신규 항목에서 재사용
- `src/components/ui/TextArea.tsx` — 텍스트 입력 → 경쟁사/USP 텍스트 필드에 재사용
- `src/components/ui/TextField.tsx` — 텍스트 필드 → 재사용
- `src/components/ui/SectionHeader.tsx` — 섹션 헤더 → 탭 내부 섹션 구분에 재사용
- `src/components/recommend/EmptyState.tsx` — 빈 상태 컴포넌트
- `src/store/useFormStore.ts` — Zustand 폼 상태 (storeBasic, brandVision, product, persona)
- `src/store/useSettingsStore.ts` — 설정 상태 관리

### Established Patterns
- Zustand 기반 상태 관리 (useFormStore, useAuthStore, useSettingsStore)
- Tailwind CSS 4 유틸리티 기반 스타일링
- 블루 계열 포인트 컬러 + off-white 배경 + Pretendard 폰트
- 섹션별 추천 버튼 → 단계별 추천 버튼으로 전환 필요
- React Router v7 기반 라우팅 (Phase 7에서 도입)

### Integration Points
- `src/App.tsx` — 메인 레이아웃, InputPanel/RecommendPanel 연동
- `src/components/layout/InputPanel.tsx` — 입력 영역 → 위저드 탭으로 전환 대상
- `src/components/layout/RecommendPanel.tsx` — 추천 패널 → Rationale 확장 연동
- `src/services/gemini.ts` — Gemini API 호출 → 프롬프트 구조 고도화
- `src/services/sessionService.ts` — 세션 저장 (Supabase 연동)

</code_context>

<specifics>
## Specific Ideas

- 기존 한 화면 스크롤 → 3탭 위저드 전환이지만, 기존 "입력할 때마다 즉시 추천" 컨셉은 유지
- 키워드 가중치는 슬라이더(1~5)로 세밀하게 조절 가능
- 네이밍 스타일은 기본 숨김 → '고급 옵션' 토글로 노출하여 초보자/전문가 모두 만족
- Rationale에서 "반영된 입력" 항목을 보여줘서 입력↔결과의 논리적 연결성을 시각화
- 타당성 점수는 백분율(%) 형태로 직관적 표시

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-strategic-naming-logic-intelligence*
*Context gathered: 2026-04-03*
