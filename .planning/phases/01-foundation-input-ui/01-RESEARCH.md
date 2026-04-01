# Phase 1: Foundation & Input UI - Research

**Researched:** 2026-04-01
**Status:** Complete

## RESEARCH COMPLETE

---

## 1. 입력 필드 체계 확정

### 소상공인 마스터 AI 문서 분석

원본 문서는 29개 항목을 8개 카테고리로 분류. Phase 1에서 사용할 4개 섹션(1, 2, 4, 6):

#### 섹션 1: 매장 기본/환경 (소상공인 마스터 AI 카테고리 1)
원본 항목:
- 매장명, 법인/개인 구분, 주소, 대표번호, 홈페이지/SNS 링크
- 주차 가능 대수, 매장 면적(평수), 층수, 좌석 수, 반려동물 동반 여부, 키즈존 여부
- 위도/경도(GPS), 인근 지하철역/버스정류장과의 거리
- 요일별 영업시간, 브레이크 타임, 정기 휴무일, 라스트 오더

**Phase 1 필터링 (브랜드 네이밍에 필요한 것만):**
| 필드 | 타입 | 포함 여부 | 이유 |
|------|------|----------|------|
| 업종/카테고리 | dropdown | ✓ (INPUT-01) | 네이밍의 핵심 맥락 |
| 위치/지역 | text | ✓ (INPUT-02) | 지역 특색 반영 |
| 매장 규모 | dropdown | ✓ (INPUT-03) | 브랜드 톤 영향 |
| 매장명 (현재) | text | ✗ | 새 브랜드명 생성이 목적, 기존 이름은 편향 유발 |
| 법인/개인 구분 | - | ✗ | 네이밍에 무관 |
| 주소/GPS/교통 | - | ✗ | 네이밍에 무관 (위치/지역으로 충분) |
| 주차/면적/층수/좌석 | - | ✗ | 네이밍에 무관 |
| 영업시간/휴무 | - | ✗ | 네이밍에 무관 |
| 반려동물/키즈존 | - | ✗ | 네이밍에 직접 영향 적음 |

#### 섹션 2: 브랜드 정체성 및 비전 (소상공인 마스터 AI 카테고리 2)
원본 항목:
- 브랜드 사명(Mission), 슬로건, 브랜드 페르소나
- 업종 분류(대/중/소), 주력 서비스 설명
- CEO 꿈, 5년/10년 목표, 최우선 사업 전략
- 브랜드 10대 차별화 포인트(사명, BI/BX, 패키징, 배송, AS, 가격, CS, 공간경험, 기술력, 커뮤니티)

**Phase 1 필터링:**
| 필드 | 타입 | 포함 여부 | 매핑 |
|------|------|----------|------|
| 브랜드 사명(Mission) | textarea | ✓ | PERSONA-03 (미션) |
| 슬로건 | textarea | ✓ | PERSONA-02 (슬로건) |
| CEO 철학/꿈 | textarea | ✓ | OWNER-01 (비전/꿈) + PERSONA-01 (철학) |
| 5년/10년 목표 | textarea | ✓ | OWNER-02 |
| 최우선 사업 전략 | textarea | ✗ | 네이밍보다는 경영 전략, Phase 1 범위 초과 |
| 차별화 포인트 | textarea | ✓ | PERSONA-04 기타 항목으로 포함 |
| 업종 분류(대/중/소) | - | ✗ | INPUT-01과 중복 |

#### 섹션 3: 제품/서비스 (소상공인 마스터 AI 카테고리 4)
원본 항목:
- 주력 메뉴/제품 리스트, 원가율, 판매가, 마진율, 조리/제작 소요 시간
- 각 제품의 기획 의도, 타겟 고객에게 주는 핵심 가치(Value Proposition)
- 이전 성공/실패 사례 레포트

**Phase 1 필터링:**
| 필드 | 타입 | 포함 여부 | 매핑 |
|------|------|----------|------|
| 주력 상품/서비스 | textarea | ✓ | INPUT-04 |
| 가격대 | dropdown | ✓ | INPUT-05 |
| 제품 핵심 가치 | textarea | ✓ | PERSONA-04 기타 항목 |
| 원가율/마진율 | - | ✗ | 네이밍에 무관 |
| 성공/실패 사례 | - | ✗ | 네이밍에 무관 |

#### 섹션 4: 고객/시장 환경 (소상공인 마스터 AI 카테고리 6)
원본 항목:
- 타겟 고객: 성별, 나이, 라이프스타일, 소비 패턴, 방문 동기, 주요 방문 시간대
- 경쟁자 분석: 주요 경쟁사 3~5곳, 우위 요소
- 지역 상권: 유동인구, 소득 수준, 선호 취향, 인근 랜드마크

**Phase 1 필터링:**
| 필드 | 타입 | 포함 여부 | 매핑 |
|------|------|----------|------|
| 타겟 고객 | textarea | ✓ | INPUT-06 |
| 경쟁사 분석 | - | ✗ | 네이밍보다는 마케팅 분석 |
| 지역 상권 정보 | - | ✗ | INPUT-02(위치)로 충분 |

### 섹션 5: 브랜드 페르소나 (기존 앱 기반)

기존 앱(brand-ashy-kappa.vercel.app)의 스택: React 19 + Google GenAI + Lucide React + Pretendard.
기존 앱은 브랜드명 → 페르소나 생성(역방향). 이 앱은 페르소나 → 브랜드명(정방향).

CONTEXT.md D-05에 따라 기존 앱의 페르소나 항목을 그대로 반영:
| 필드 | 타입 | REQ |
|------|------|-----|
| 브랜드 철학 | textarea | PERSONA-01 |
| 슬로건 | textarea | PERSONA-02 |
| 미션 | textarea | PERSONA-03 |
| 브랜드 스토리 | textarea | PERSONA-04 |
| 핵심 가치 | textarea | PERSONA-04 |
| 차별화 포인트 | textarea | PERSONA-04 |
| 브랜드 톤앤매너 | textarea | PERSONA-04 |

---

## 2. 최종 입력 필드 목록 (중복 정리 완료)

CONTEXT.md D-06에 따라 섹션 간 중복 항목을 정리한 최종 목록:

### 섹션 1: 매장 기본/환경
| # | 필드명 | 타입 | REQ ID | 비고 |
|---|--------|------|--------|------|
| 1 | 업종/카테고리 | dropdown | INPUT-01 | 대분류(음식점/카페/소매/서비스 등) |
| 2 | 위치/지역 | text | INPUT-02 | 자유 입력 (예: "서울 마포구 연남동") |
| 3 | 매장 규모 | dropdown | INPUT-03 | 소형/중형/대형/프랜차이즈 |
| 4 | 주력 상품/서비스 | textarea | INPUT-04 | 2~3줄 설명 |
| 5 | 가격대 | dropdown | INPUT-05 | 저가/중저가/중가/중고가/고가/프리미엄 |
| 6 | 타겟 고객 | textarea | INPUT-06 | 연령대, 성별, 특징 등 |

### 섹션 2: 브랜드 정체성 및 비전
| # | 필드명 | 타입 | REQ ID | 비고 |
|---|--------|------|--------|------|
| 7 | CEO 비전/꿈 | textarea | OWNER-01 | 사업을 시작한 이유와 꿈 |
| 8 | 5년/10년 목표 | textarea | OWNER-02 | 구체적 성장 목표 |
| 9 | 개인 스토리/동기 | textarea | OWNER-03 | 창업 배경, 개인적 동기 |

### 섹션 3: 제품/서비스 핵심
| # | 필드명 | 타입 | REQ ID | 비고 |
|---|--------|------|--------|------|
| 10 | 제품/서비스 특장점 | textarea | PERSONA-04 | 타 브랜드 대비 차별점 |
| 11 | 고객에게 주는 핵심 가치 | textarea | PERSONA-04 | Value Proposition |

### 섹션 4: 고객/시장 환경
(타겟 고객은 섹션 1의 INPUT-06과 통합 → 이 섹션은 별도로 분리하지 않음)

### 섹션 5: 브랜드 페르소나
| # | 필드명 | 타입 | REQ ID | 비고 |
|---|--------|------|--------|------|
| 12 | 브랜드 철학 | textarea | PERSONA-01 | 브랜드가 추구하는 근본 가치 |
| 13 | 슬로건 | textarea | PERSONA-02 | 한 줄 요약 메시지 |
| 14 | 미션 | textarea | PERSONA-03 | 브랜드가 해결하려는 문제/목표 |
| 15 | 브랜드 스토리 | textarea | PERSONA-04 | 브랜드의 탄생 배경 |
| 16 | 핵심 가치 | textarea | PERSONA-04 | 브랜드가 소중히 여기는 것 |
| 17 | 차별화 포인트 | textarea | PERSONA-04 | 경쟁사 대비 고유한 강점 |
| 18 | 브랜드 톤앤매너 | textarea | PERSONA-04 | 브랜드가 말하는 방식/분위기 |

**총 18개 필드** (dropdown 3개 + text 1개 + textarea 14개)

> 참고: 소상공인 마스터 AI의 카테고리 3(조직/인적자원), 5(온라인 홍보), 7(연간 일정), 8(AI 100가지 질문)은 브랜드 네이밍과 직접적 관련이 없으므로 Phase 1에서 제외.

---

## 3. 기술 스택 리서치

### Vite + React 19 + TypeScript 프로젝트 구성

```
npx create-vite brand-naming --template react-ts
```

**패키지 설치:**
- `react@19` + `react-dom@19` — 이미 Vite template에 포함
- `tailwindcss@4` + `@tailwindcss/vite` — Vite 플러그인 방식 (postcss 불필요)
- `zustand` — 상태 관리
- `lucide-react` — 아이콘

**Tailwind CSS v4 주의점:**
- v4는 `tailwind.config.js` 대신 CSS 파일 내 `@theme` 디렉티브 사용
- `@import "tailwindcss"` 한 줄로 설치 완료
- 커스텀 컬러/폰트는 `@theme` 블록에 정의

### Pretendard 폰트 설정

```html
<!-- index.html -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
```

CSS에서:
```css
@theme {
  --font-sans: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
}
```

### 프로젝트 폴더 구조

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx         (70/30 분할 레이아웃)
│   │   ├── InputPanel.tsx        (왼쪽 패널 — 스크롤)
│   │   └── RecommendPanel.tsx    (오른쪽 패널 — 스티키)
│   ├── sections/
│   │   ├── StoreBasicSection.tsx  (섹션 1: 매장 기본/환경)
│   │   ├── BrandVisionSection.tsx (섹션 2: 브랜드 정체성)
│   │   ├── ProductSection.tsx     (섹션 3: 제품/서비스)
│   │   └── PersonaSection.tsx     (섹션 5: 브랜드 페르소나)
│   ├── ui/
│   │   ├── TextField.tsx          (공용 텍스트 입력)
│   │   ├── TextArea.tsx           (공용 textarea)
│   │   ├── Dropdown.tsx           (공용 드롭다운)
│   │   ├── SectionHeader.tsx      (섹션 구분 헤더)
│   │   └── RecommendButton.tsx    (추천 받기 버튼)
│   └── recommend/
│       └── EmptyState.tsx         (추천 패널 빈 상태)
├── store/
│   └── useFormStore.ts            (Zustand 폼 상태)
├── types/
│   └── form.ts                    (타입 정의)
├── App.tsx
├── main.tsx
└── index.css                      (Tailwind + 커스텀 테마)
```

**500줄 제한 준수 전략:**
- 각 섹션 컴포넌트: ~100~200줄 (필드 정의 + 렌더링)
- 레이아웃 컴포넌트: ~50~80줄
- UI 공용 컴포넌트: ~30~60줄
- 스토어: ~80~120줄
- 모든 파일 500줄 미만 보장

---

## 4. 디자인 시스템 리서치

### 컬러 팔레트 (블루 계열)

CONTEXT.md D-11, D-14에 따라 블루 계열 포인트 컬러:

```
Primary:     #2563EB (Blue-600) — 버튼, 링크, 강조
Primary-hover: #1D4ED8 (Blue-700) — 호버 상태
Primary-light: #EFF6FF (Blue-50) — 배경 하이라이트
Primary-muted: #93C5FD (Blue-300) — 비활성/보조
Background:  #FAFBFC — 오프화이트 배경
Surface:     #FFFFFF — 카드/패널 배경
Border:      #E5E7EB (Gray-200) — 얇은 보더
Text-primary: #111827 (Gray-900) — 본문
Text-secondary: #6B7280 (Gray-500) — 보조 텍스트
Text-muted:  #9CA3AF (Gray-400) — placeholder
```

### 타이포그래피 스케일

```
h1: 28px / 700 weight / -0.02em tracking (페이지 제목)
h2: 22px / 600 weight / -0.01em tracking (섹션 헤더)
h3: 18px / 600 weight (서브 헤더)
body: 15px / 400 weight / 1.6 line-height (본문)
caption: 13px / 400 weight (보조 텍스트)
label: 14px / 500 weight (필드 라벨)
```

### 스페이싱 시스템

```
섹션 간: 48px (py-12)
섹션 헤더 → 첫 필드: 24px (mb-6)
필드 간: 20px (space-y-5)
필드 라벨 → 입력: 8px (mb-2)
패널 내부 패딩: 32px (p-8)
```

### 고급 CSS 기법 (CONTEXT.md D-13)

- **Input focus**: `ring-2 ring-blue-500/20` + `border-blue-500` transition
- **Card elevation**: `shadow-sm hover:shadow-md` + 부드러운 transition
- **Section divider**: 얇은 그라데이션 라인 `bg-gradient-to-r from-transparent via-gray-200 to-transparent`
- **Backdrop blur**: 오른쪽 패널 헤더에 `backdrop-blur-xl bg-white/80`
- **Button**: `bg-blue-600 hover:bg-blue-700` + `shadow-sm hover:shadow` + `transition-all duration-200`
- **Disabled button**: `opacity-50 cursor-not-allowed`

---

## 5. 레이아웃 구현 전략

### 70/30 분할

```tsx
// CSS Grid 방식 (권장)
<div className="grid grid-cols-[7fr_3fr] h-screen">
  <div className="overflow-y-auto">{/* 왼쪽 입력 패널 */}</div>
  <div className="sticky top-0 h-screen overflow-y-auto border-l">
    {/* 오른쪽 추천 패널 */}
  </div>
</div>
```

- 데스크탑 전용 (D-10) → 반응형 불필요, 최소 너비 1024px 가정
- 왼쪽: `overflow-y-auto` 세로 스크롤 (D-02, LAYOUT-02)
- 오른쪽: `sticky top-0 h-screen` 고정 + 내부 독립 스크롤 (D-08)

### 빈 상태 (D-09)

오른쪽 패널 빈 상태:
- 중앙 정렬 안내 메시지
- Lucide 아이콘 (Sparkles 또는 Lightbulb) — 크게, muted 컬러
- 텍스트: "항목을 입력하고 추천 버튼을 누르면 브랜드명이 여기에 표시됩니다"
- `text-gray-400` + `text-sm`

---

## 6. 상태 관리 설계

### Zustand 스토어 구조

```typescript
interface FormState {
  // 섹션 1: 매장 기본/환경
  storeBasic: {
    category: string;       // INPUT-01 업종
    location: string;       // INPUT-02 위치
    scale: string;          // INPUT-03 규모
    mainProduct: string;    // INPUT-04 주력 상품
    priceRange: string;     // INPUT-05 가격대
    targetCustomer: string; // INPUT-06 타겟 고객
  };
  // 섹션 2: 브랜드 정체성/비전
  brandVision: {
    ceoVision: string;      // OWNER-01
    longTermGoal: string;   // OWNER-02
    personalStory: string;  // OWNER-03
  };
  // 섹션 3: 제품/서비스
  product: {
    uniqueStrength: string; // PERSONA-04 특장점
    valueProposition: string; // PERSONA-04 핵심 가치
  };
  // 섹션 5: 브랜드 페르소나
  persona: {
    philosophy: string;     // PERSONA-01
    slogan: string;         // PERSONA-02
    mission: string;        // PERSONA-03
    brandStory: string;     // PERSONA-04
    coreValues: string;     // PERSONA-04
    differentiation: string; // PERSONA-04
    toneAndManner: string;  // PERSONA-04
  };
}
```

### 섹션별 추천 버튼 로직 (D-15, D-16)

각 섹션 컴포넌트 하단에 '추천 받기' 버튼:
- 해당 섹션에서 최소 1개 필드에 값이 있으면 활성화
- 비어있으면 disabled
- Phase 2에서 onClick에 API 호출 연결 예정 (Phase 1에서는 UI만)

---

## 7. Phase 2 연동 대비

Phase 1은 입력 UI만 구현하지만, Phase 2 연동을 위한 인터페이스 설계:

- Zustand 스토어에 `recommendations: RecommendCard[]` 배열 예비
- 추천 버튼 onClick은 Phase 1에서는 no-op, Phase 2에서 API 호출로 교체
- 오른쪽 패널은 `recommendations.length === 0`일 때 EmptyState, 아닐 때 카드 리스트 (Phase 2)

---

## 8. 드롭다운 옵션값

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

---

## 9. 리스크 및 주의사항

| 리스크 | 영향 | 대응 |
|--------|------|------|
| 필드 18개 → 한 화면 스크롤이 길어짐 | UX 피로 | 섹션 헤더로 시각적 구분, 충분한 여백, 섹션 간 구분선 |
| textarea placeholder가 부실하면 사용자가 뭘 써야 할지 모름 | 입력 품질 저하 | 각 필드에 구체적 예시문 제공 필수 |
| Tailwind CSS v4 설정이 v3와 다름 | 빌드 에러 | `@tailwindcss/vite` 플러그인 사용, `@theme` 디렉티브로 커스텀 |
| 500줄 제한 | 컴포넌트 분리 필요 | UI 공용 컴포넌트 적극 활용, 섹션별 분리 |
| 기존 앱 필드 목록 미확인 | PERSONA-04 누락 가능 | 기존 앱에서 확인된 패턴 + 소상공인 마스터 AI 문서로 보완 |

---

*Phase: 01-foundation-input-ui*
*Researched: 2026-04-01*
