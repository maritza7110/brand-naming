# Phase 1: Foundation & Input UI - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

프로젝트 셋업(React 19 + Vite + TypeScript + Tailwind CSS) + 70/30 분할 레이아웃 + 소상공인 마스터 AI 기반 5개 섹션 입력 폼 + 프리미엄 디자인 시스템 구축.

이 Phase에서는 입력 UI와 레이아웃만 구현한다. AI 추천 연동(Phase 2), RAG 시스템(Phase 3)은 포함하지 않는다.

</domain>

<decisions>
## Implementation Decisions

### 입력 폼 구조
- **D-01:** 소상공인 마스터 AI 문서를 입력 섹션의 기본 골격으로 사용. 5개 섹션으로 구성:
  1. 매장 기본/환경 (소상공인 마스터 AI 섹션 1)
  2. 브랜드 정체성 및 비전 (섹션 2 — 사명, 슬로건, CEO 철학, 차별화 포인트)
  3. 제품/서비스 (섹션 4)
  4. 고객/시장 환경 (섹션 6)
  5. 브랜드 페르소나 (기존 앱 brand-ashy-kappa.vercel.app 항목 그대로 유지)
- **D-02:** 섹션 헤더로 구분하고 모든 섹션을 펼쳐서 한 화면 스크롤로 표시 (아코디언/탭 사용 안 함)
- **D-03:** 기본정보 필드는 드롭다운 + 텍스트 혼합 (업종/가격대/규모는 드롭다운, 위치/상품/타겟은 텍스트)
- **D-04:** 사장님 정보/페르소나 필드는 모두 textarea (3~5줄 높이, placeholder 예시문 제공)
- **D-05:** PERSONA-04 '기타 페르소나 항목'은 기존 브랜드 페르소나 앱의 항목을 그대로 반영. Researcher가 기존 앱 + 소상공인 마스터 AI 문서를 조사하여 구체적 필드 목록 확정
- **D-06:** 각 섹션의 구체적 필드 목록은 researcher가 소상공인 마스터 AI 문서와 기존 앱을 기반으로 확정하되, 섹션 간 중복 항목 정리 필요

### 레이아웃 동작
- **D-07:** 왼쪽 70% 입력 / 오른쪽 30% 추천 패널 — 고정 비율
- **D-08:** 오른쪽 추천 패널은 스티키(sticky) — 왼쪽 스크롤해도 화면에 고정. 패널 내부만 독립 스크롤
- **D-09:** 추천 전 빈 상태: 안내 메시지 + 일러스트 표시 ("항목을 입력하고 추천 버튼을 누르면 브랜드명이 여기에 표시됩니다")
- **D-10:** 데스크탑 전용 설계. 모바일/태블릿 반응형 불필요 (사내 앱, 데스크탑에서 사용)

### 디자인 언어
- **D-11:** 라이트 모드 — 하얀 배경(off-white) + 어두운 텍스트 + 블루 계열 포인트 컬러
- **D-12:** 여백 중심 미니멀 디자인 — 넓은 간격, 엇은 보더, 미니멀 장식. Pretendard 폰트의 깨끗함을 살림
- **D-13:** 정갈하고 고급스러운 CSS 전문가 수준 퀄리티 — 미세한 그라데이션, 섬세한 그림자, 부드러운 트랜지션, backdrop-blur, 정교한 타이포그래피 스케일 등 고급 CSS 기법 적극 활용
- **D-14:** 블루 계열 포인트 컬러 — 신뢰감, 전문성. 버튼/링크/강조에 사용

### 추천 버튼
- **D-15:** 각 섹션 하단에 '추천 받기' 버튼 배치 (섹션별 개별 트리거)
- **D-16:** 해당 섹션에서 최소 1개 항목 입력 시 버튼 활성화. 빈 상태에서는 disabled

### Claude's Discretion
- 구체적인 색상 값(hex) 확정 — 블루 계열 내에서 최적의 조합 선택
- 타이포그래피 스케일 (heading/body/caption 크기 비율)
- 섹션 간 간격, 필드 간 간격 등 spacing 시스템
- 추천 패널 빈 상태의 일러스트/아이콘 디자인

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 소상공인 마스터 AI 입력 체계
- `C:/Users/고상진/Downloads/소상공인 마스터 ai.pdf` — 입력 섹션 구조의 기본 골격. 8개 카테고리 중 1(매장 기본), 2(브랜드 정체성), 4(제품/서비스), 6(고객/시장)을 사용

### 기존 브랜드 페르소나 앱
- `https://brand-ashy-kappa.vercel.app/` — 브랜드 페르소나 항목의 원본. 이 앱의 페르소나 필드를 그대로 반영해야 함 (PERSONA-04 확정용)

### 프로젝트 요구사항
- `.planning/REQUIREMENTS.md` — v1 요구사항 전체 (INPUT, OWNER, PERSONA, LAYOUT 섹션)
- `.planning/research/FEATURES.md` — 경쟁사 분석, 기능 우선순위, Anti-Features 목록

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- 없음 (그린필드 프로젝트 — 코드베이스 비어있음)

### Established Patterns
- 없음 (Phase 1에서 모든 패턴을 새로 수립)
- 기존 앱(brand-ashy-kappa.vercel.app) 참고: React 19 + Google GenAI + Lucide React + Pretendard

### Integration Points
- Phase 2에서 추천 버튼 클릭 → Gemini API 호출 연동 예정
- Phase 2에서 추천 카드가 오른쪽 패널에 누적되는 로직 추가 예정

</code_context>

<specifics>
## Specific Ideas

- 소상공인 마스터 AI 문서의 카테고리 체계를 그대로 섹션 구조에 반영 (사용자의 핵심 요구)
- 기존 브랜드 페르소나 앱의 항목은 변경 없이 그대로 사용 (브랜드 아이덴티티와는 별개 섹터로 취급)
- 외부 디자인 툴 수준의 고급 CSS 퀄리티 — Figma/Dribbble 레퍼런스급 완성도

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-input-ui*
*Context gathered: 2026-04-01*
