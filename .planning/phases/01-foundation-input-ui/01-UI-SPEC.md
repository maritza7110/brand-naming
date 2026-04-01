---
phase: 1
slug: foundation-input-ui
status: draft
shadcn_initialized: false
preset: none
created: 2026-04-01
---

# Phase 1 -- UI Design Contract

> 입력 폼 + 70/30 레이아웃의 시각/인터랙션 계약. gsd-ui-researcher 생성, gsd-ui-checker 검증 대상.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (커스텀 Tailwind CSS) |
| Preset | not applicable |
| Component library | none -- 자체 ui/ 컴포넌트 (TextField, TextArea, Dropdown, SectionHeader, RecommendButton) |
| Icon library | Lucide React 0.5x |
| Font | Pretendard Variable (CDN: pretendardvariable-dynamic-subset.min.css) |

> Source: CLAUDE.md "사용하지 말 것" -- Material UI / Ant Design 금지, 커스텀 디자인 목표. RESEARCH.md 섹션 3, 4.

---

## Spacing Scale

Declared values (all multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | 아이콘-텍스트 간격, 인라인 패딩 |
| sm | 8px | 라벨-입력 간격 (D-12 여백 중심) |
| md | 16px | 기본 요소 간격 |
| lg | 24px | 필드 간 간격 (space-y-6), 섹션 헤더 -> 첫 필드 (mb-6) |
| xl | 32px | 패널 내부 패딩 (p-8) |
| 2xl | 48px | 섹션 간 간격 (py-12) |
| 3xl | 64px | 페이지 레벨 간격 |

Exceptions: none

> Source: RESEARCH.md 섹션 4 "스페이싱 시스템". 모든 값 4의 배수, 표준 세트 {4, 8, 16, 24, 32, 48, 64} 준수.

---

## Typography

| Role | Size | Weight | Line Height | Letter Spacing | Usage |
|------|------|--------|-------------|----------------|-------|
| Display | 28px | 600 (SemiBold) | 1.2 | -0.02em | 페이지 제목 ("브랜드 네이밍") |
| Heading | 22px | 600 (SemiBold) | 1.3 | -0.01em | 섹션 헤더 (매장 기본/환경, 브랜드 정체성 등) |
| Body | 15px | 400 (Regular) | 1.6 | 0 | 본문 텍스트, textarea 입력 |
| Small | 14px | 400 (Regular) | 1.5 | 0 | 필드 라벨, 드롭다운 선택값, placeholder, 보조 안내문, 빈 상태 본문 |

Font family: `'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif`

> Source: RESEARCH.md 섹션 4 "타이포그래피 스케일". CONTEXT.md D-13 "정교한 타이포그래피 스케일".
> Revision: 5개 사이즈를 4개로 축소 (13px Caption과 14px Label을 14px Small로 통합). 4개 웨이트를 2개로 축소 (400 Regular + 600 SemiBold만 사용).

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `#FAFBFC` | 페이지 배경 (오프화이트) |
| Secondary (30%) | `#FFFFFF` | 카드, 패널, 입력 필드 배경 |
| Accent (10%) | `#2563EB` | 아래 "Accent reserved for" 참조 |
| Accent hover | `#1D4ED8` | 버튼 호버, 링크 호버 |
| Accent light | `#EFF6FF` | 포커스 배경 하이라이트, 액티브 섹션 표시 |
| Accent muted | `#93C5FD` | 비활성 보조 요소, disabled 아이콘 |
| Border | `#E5E7EB` | 입력 필드 보더, 패널 구분선 |
| Text primary | `#111827` | 본문, 헤딩, 라벨 |
| Text secondary | `#6B7280` | 보조 텍스트, 섹션 설명 |
| Text muted | `#9CA3AF` | placeholder, 비활성 텍스트 |
| Destructive | `#EF4444` | 폼 초기화 확인 텍스트에만 사용 |

**Accent reserved for (specific elements only):**
- 추천 받기 버튼 (`bg-blue-600`)
- 추천 받기 버튼 호버 (`bg-blue-700`)
- Input 포커스 링 (`ring-blue-500/20` + `border-blue-500`)
- 섹션 헤더 좌측 장식 바 (있을 경우)
- 빈 상태 아이콘 (`text-blue-300`)

> Source: RESEARCH.md 섹션 4 "컬러 팔레트". CONTEXT.md D-11, D-14.

---

## Visual Focal Point

Primary visual focal point: 각 섹션 하단의 추천 받기 버튼 (페이지 내 유일한 `bg-blue-600` 요소) 및 오른쪽 패널 빈 상태의 Sparkles 아이콘 (`text-blue-300`, size 48). 블루 액센트가 오프화이트/화이트 배경 위에서 즉각적인 시선 유도 역할을 한다.

---

## Interaction States

### Input Fields (TextField, TextArea, Dropdown)

| State | Style |
|-------|-------|
| Default | `border-gray-200 bg-white` |
| Hover | `border-gray-300` |
| Focus | `border-blue-500 ring-2 ring-blue-500/20` + transition 200ms |
| Filled | `border-gray-200 bg-white` (default와 동일) |
| Disabled | `opacity-50 cursor-not-allowed bg-gray-50` |

### Recommend Button (추천 받기)

| State | Style |
|-------|-------|
| Default | `bg-blue-600 text-white shadow-sm` |
| Hover | `bg-blue-700 shadow` + transition 200ms |
| Active | `bg-blue-800 shadow-inner` |
| Disabled | `bg-blue-600 opacity-50 cursor-not-allowed` |
| Loading (Phase 2) | spinner 아이콘 + "추천 중..." 텍스트 |

### Card / Panel Elevation

| State | Style |
|-------|-------|
| Default | `shadow-sm` |
| Hover | `shadow-md` + transition 200ms |

> Source: RESEARCH.md 섹션 4 "고급 CSS 기법". CONTEXT.md D-13.

---

## Layout Contract

| Property | Value |
|----------|-------|
| Split ratio | 70% left / 30% right (`grid-cols-[7fr_3fr]`) |
| Min width | 1024px (데스크탑 전용, D-10) |
| Left panel | `overflow-y-auto` 세로 스크롤 |
| Right panel | `sticky top-0 h-screen` 고정, 내부 `overflow-y-auto` 독립 스크롤 |
| Right panel border | `border-l border-gray-200` |
| Right panel header | `backdrop-blur-xl bg-white/80` (D-13) |
| Panel padding | 32px (`p-8`) |
| Responsive | 불필요 -- 데스크탑 전용 |

### Section Visual Hierarchy

| Element | Style |
|---------|-------|
| Section divider | `bg-gradient-to-r from-transparent via-gray-200 to-transparent h-px` |
| Section gap | 48px (`py-12`) |
| Section header to first field | 24px (`mb-6`) |
| Field to field gap | 24px (`space-y-6`) |
| Label to input gap | 8px (`mb-2`) |

> Source: RESEARCH.md 섹션 5 "레이아웃 구현 전략". CONTEXT.md D-07, D-08, D-10.

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Page title | 브랜드 네이밍 |
| Page subtitle | 페르소나 항목을 채워가며 AI 브랜드명을 추천받으세요 |
| Primary CTA | 추천 받기 |
| CTA disabled tooltip | 최소 1개 항목을 입력하세요 |
| Empty state heading | 브랜드명 추천 대기 중 |
| Empty state body | 왼쪽 항목을 입력하고 "추천 받기" 버튼을 누르면 AI가 브랜드명을 추천합니다 |
| Empty state icon | Lucide `Sparkles` (size 48, `text-blue-300`) |
| Form clear confirmation | 입력 초기화: 모든 입력 내용이 삭제됩니다. 계속하시겠습니까? |
| Section 1 header | 매장 기본/환경 |
| Section 2 header | 브랜드 정체성 및 비전 |
| Section 3 header | 제품/서비스 핵심 |
| Section 5 header | 브랜드 페르소나 |

### Placeholder 예시문 (필드별)

| Field | Placeholder |
|-------|-------------|
| 업종/카테고리 | (드롭다운 -- "업종을 선택하세요") |
| 위치/지역 | 예: 서울 마포구 연남동 |
| 매장 규모 | (드롭다운 -- "규모를 선택하세요") |
| 주력 상품/서비스 | 예: 수제 드립커피, 시그니처 디저트, 브런치 메뉴 |
| 가격대 | (드롭다운 -- "가격대를 선택하세요") |
| 타겟 고객 | 예: 20-30대 직장인, 감성 카페를 즐기는 MZ세대 |
| CEO 비전/꿈 | 예: 동네에서 가장 사랑받는 카페를 만들고 싶습니다 |
| 5년/10년 목표 | 예: 3년 내 2호점, 자체 원두 로스팅 브랜드 런칭 |
| 개인 스토리/동기 | 예: 10년간 바리스타로 일하며 나만의 카페를 꿈꿨습니다 |
| 제품/서비스 특장점 | 예: 직접 로스팅한 싱글오리진 원두, 매일 아침 굽는 수제 빵 |
| 고객에게 주는 핵심 가치 | 예: 바쁜 일상 속 여유로운 한 잔의 시간 |
| 브랜드 철학 | 예: 좋은 원두, 정직한 한 잔 |
| 슬로건 | 예: 하루의 시작, 당신만의 한 잔 |
| 미션 | 예: 누구나 부담 없이 좋은 커피를 즐길 수 있는 공간 |
| 브랜드 스토리 | 예: 강릉 할머니댁 뒷마당에서 커피 나무를 키우던 기억에서 시작했습니다 |
| 핵심 가치 | 예: 진정성, 품질, 따뜻한 환대 |
| 차별화 포인트 | 예: 산지 직거래 원두, 핸드드립 전문, 아늑한 한옥 인테리어 |
| 브랜드 톤앤매너 | 예: 따뜻하고 친근하지만 세련된, 정갈한 톤 |

> Source: CONTEXT.md D-04 "placeholder 예시문 제공". RESEARCH.md 섹션 2 필드 목록.

---

## Component Inventory (Phase 1)

| Component | Location | Props | Notes |
|-----------|----------|-------|-------|
| AppLayout | layout/AppLayout.tsx | children | 70/30 grid 래퍼 |
| InputPanel | layout/InputPanel.tsx | children | 왼쪽 스크롤 패널 |
| RecommendPanel | layout/RecommendPanel.tsx | children | 오른쪽 스티키 패널 |
| TextField | ui/TextField.tsx | label, value, onChange, placeholder, disabled | 한 줄 텍스트 입력 |
| TextArea | ui/TextArea.tsx | label, value, onChange, placeholder, rows(3-5), disabled | 여러 줄 텍스트 입력 |
| Dropdown | ui/Dropdown.tsx | label, value, onChange, options, placeholder, disabled | 선택 드롭다운 |
| SectionHeader | ui/SectionHeader.tsx | title, description | 섹션 구분 헤더 + 하단 설명 |
| RecommendButton | ui/RecommendButton.tsx | onClick, disabled, loading | 섹션 하단 CTA |
| EmptyState | recommend/EmptyState.tsx | (none) | 추천 패널 빈 상태 |
| StoreBasicSection | sections/StoreBasicSection.tsx | (store connected) | 섹션 1: 6 fields |
| BrandVisionSection | sections/BrandVisionSection.tsx | (store connected) | 섹션 2: 3 fields |
| ProductSection | sections/ProductSection.tsx | (store connected) | 섹션 3: 2 fields |
| PersonaSection | sections/PersonaSection.tsx | (store connected) | 섹션 5: 7 fields |

> Source: RESEARCH.md 섹션 3 "프로젝트 폴더 구조".

---

## CSS Techniques Contract (D-13)

Premium visual quality를 위한 필수 CSS 기법:

| Technique | Where | Implementation |
|-----------|-------|----------------|
| Focus ring | 모든 입력 필드 | `ring-2 ring-blue-500/20 border-blue-500 transition-all duration-200` |
| Card elevation | 패널, 카드 | `shadow-sm hover:shadow-md transition-shadow duration-200` |
| Section divider | 섹션 간 구분 | `h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent` |
| Backdrop blur | 우측 패널 헤더 | `backdrop-blur-xl bg-white/80` |
| Button transition | 추천 받기 | `transition-all duration-200` (bg, shadow, transform) |
| Smooth scroll | 왼쪽 패널 | `scroll-behavior: smooth` |
| Subtle hover | 드롭다운 옵션 | `hover:bg-gray-50 transition-colors duration-150` |

> Source: CONTEXT.md D-13 "고급 CSS 기법 적극 활용".

---

## Accessibility Baseline

| Concern | Implementation |
|---------|----------------|
| Color contrast | Text primary (#111827) on Dominant (#FAFBFC) = ratio 17.4:1 (AAA) |
| Focus visible | ring-2 ring-blue-500/20 -- 키보드 탐색 시 시각적 표시 |
| Label association | 모든 입력에 `<label htmlFor>` 연결 |
| Dropdown keyboard | 화살표 키 탐색, Enter 선택, Esc 닫기 |
| Landmark roles | main, aside (추천 패널), form |

---

## Dropdown Options Contract

### INPUT-01: 업종/카테고리
```
음식점/레스토랑, 카페/베이커리, 주점/바, 소매/마트, 패션/의류,
뷰티/미용, 건강/피트니스, 교육/학원, IT/테크, 디자인/크리에이티브,
컨설팅/전문서비스, 숙박/펜션, 문화/엔터테인먼트, 기타
```

### INPUT-03: 매장 규모
```
1인 창업, 소형 (5인 미만), 중형 (5~20인), 대형 (20인 이상), 프랜차이즈
```

### INPUT-05: 가격대
```
저가, 중저가, 중가, 중고가, 고가, 프리미엄
```

> Source: RESEARCH.md 섹션 8.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | not used | not applicable |
| Third-party | none | not applicable |

> 이 프로젝트는 커스텀 Tailwind CSS 컴포넌트를 사용합니다. 외부 컴포넌트 레지스트리 없음.

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending

---

*Phase: 01-foundation-input-ui*
*Created: 2026-04-01*
*Revised: 2026-04-01 -- checker feedback (typography 4size/2weight, spacing standard set, focal point)*
*Sources: CONTEXT.md (D-01~D-16), RESEARCH.md (sections 1-9), REQUIREMENTS.md (INPUT, OWNER, PERSONA, LAYOUT)*
