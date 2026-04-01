# Feature Research: v1.1 UX 개선

**Domain:** AI-powered brand naming app -- UX improvements (cascading dropdown, card grouping, mobile responsive)
**Researched:** 2026-04-01
**Confidence:** HIGH (well-established UI patterns, existing codebase analyzed, Tailwind v4 docs verified)

## Feature Landscape

이 문서는 v1.1 마일스톤의 3개 신규 기능에만 집중한다. v1.0 기능은 `.planning/research/FEATURES.md` (이전 버전)에 기록되어 있다.

---

### Table Stakes (이 기능들 없으면 v1.1이 아님)

#### 1. 계층형 업종 드롭다운 (대분류 > 중분류 > 소분류)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| 3단계 연쇄 선택 (대분류 -> 중분류 -> 소분류) | 247개 소분류를 단일 드롭다운에 넣으면 스크롤 지옥. 한국표준산업분류(KSIC) 체계가 대/중/소 3단계이므로 사용자에게 자연스러운 구조. | MEDIUM | 대분류 선택 시 중분류 필터링, 중분류 선택 시 소분류 필터링. 부모 변경 시 자식 값 리셋 필수. |
| 상위 선택 변경 시 하위 자동 리셋 | 대분류를 바꾸면 중분류/소분류가 그대로 남아있으면 잘못된 조합 발생. 모든 연쇄 드롭다운의 기본 행동. | LOW | `useEffect`로 부모 값 변경 감지, 자식 값을 빈 문자열로 리셋. |
| 선택 완료 시 소분류 값만 전달 | AI 추천 프롬프트에는 최종 소분류 값("한식 음식점업")이 전달되어야 함. 중간 분류 코드는 UI 내부 상태. | LOW | `category` 필드에 소분류 텍스트 저장. 대분류/중분류는 파생 가능하므로 별도 저장 불필요. |
| 비활성 상태 관리 | 대분류 미선택 시 중분류 비활성, 중분류 미선택 시 소분류 비활성. 진행 순서를 시각적으로 안내. | LOW | `disabled` prop 활용. 이미 기존 `Dropdown` 컴포넌트에 `disabled` prop 있음. |
| 247개 항목 데이터 구조 | 계층 관계를 코드에서 빠르게 필터링할 수 있는 구조. 대분류~21개, 중분류~77개, 소분류~247개 (KSIC 11차 기준). | LOW | 프로젝트 맞춤 247개이므로 JSON/TS 상수로 관리. KSIC 전체가 아닌 소상공인 관련 소분류만 선별된 데이터셋. |

#### 2. 추천 카드 소분류별 그루핑

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| 소분류 업종별 카드 그룹 헤더 | 업종을 바꿔가며 추천받으면 카드가 섞여서 어떤 업종용 추천인지 혼란. 그룹 헤더로 시각적 구분 필수. | MEDIUM | `RecommendBatch`에 `category` (소분류) 필드 추가. 배치를 소분류별로 `groupBy` 처리. |
| 접기/펼치기 토글 | 이전 업종 카드가 쌓이면 스크롤이 길어짐. 아코디언 패턴으로 관심 있는 그룹만 펼침. | MEDIUM | 그룹 헤더 클릭 시 해당 그룹 카드 show/hide. 애니메이션 있으면 좋지만 없어도 기능 완성. |
| 업종 변경 시 이전 그룹 자동 접힘 | 핵심 UX: 업종을 바꾸면 이전 업종 카드를 자동으로 접어서 새 업종 카드에 시선 집중. | MEDIUM | 새 배치 추가 시 현재 업종과 다른 그룹은 `collapsed: true`로 상태 변경. |
| 그룹 헤더에 카드 개수 표시 | 접힌 상태에서도 해당 업종으로 몇 개 추천을 받았는지 한눈에 파악. | LOW | `(3개 추천)` 같은 카운트 뱃지. |
| 현재 활성 업종 그룹 강조 | 어떤 업종으로 현재 작업 중인지 시각적으로 구분. | LOW | 현재 선택된 소분류와 일치하는 그룹 헤더에 강조 스타일(골드 악센트 등). |

#### 3. 모바일 반응형 레이아웃

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| 70/30 사이드바이사이드 -> 세로 스택 전환 | 768px 이하에서 7:3 비율 강제 시 입력 패널이 너무 좁아 사용 불가. 모바일에선 입력 위 + 추천 아래 세로 배치가 자연스러움. | MEDIUM | 현재 `grid-cols-[7fr_3fr] min-w-[1024px]`를 반응형으로 교체. `min-w-[1024px]` 제거 필수. |
| 추천 패널 sticky -> 일반 흐름 전환 | 데스크톱: 오른쪽 sticky 사이드바. 모바일: 입력 아래에 자연스럽게 배치. sticky가 모바일에서는 화면 절반을 차지하는 문제. | LOW | `lg:sticky lg:top-0 lg:h-screen` 조건부 sticky. 모바일에서는 일반 블록 요소. |
| 모바일 터치 타겟 보장 | 48px 이상 터치 타겟. 드롭다운, 버튼, 카드 등 인터랙티브 요소. | LOW | 대부분 이미 `py-3` (48px) 이상이지만 검증 필요. |
| 모바일 폰트/여백 조정 | 데스크톱 기준 `px-8`, `pt-12` 등이 모바일에서는 과도할 수 있음. | LOW | `px-4 lg:px-8` 식으로 반응형 여백. |

---

### Differentiators (있으면 사용성이 확 올라감)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **소분류 검색/타이프어헤드** | 247개 소분류를 3단계 탐색하는 것은 정확하지만 느림. "치킨"을 치면 바로 "치킨 전문점"이 뜨는 검색 기능은 탐색 시간을 극적으로 단축. 전문가 UX 연구: 50개 이상 옵션에는 검색 제공 권장. | MEDIUM | 별도 검색 입력 필드 또는 드롭다운 내 filter. 기존 `<select>` 요소에서는 네이티브 지원 안 되므로 커스텀 컴포넌트 필요. v1.1에서 추가할지 판단 필요. |
| **아코디언 애니메이션** | 접기/펼치기가 즉시 전환되면 맥락이 끊김. 부드러운 애니메이션(300ms)이 고급스러운 느낌 유지. CSS `grid-template-rows: 0fr -> 1fr` 트릭으로 JS 라이브러리 없이 구현 가능. | LOW | CSS-only 접근 가능. `grid-template-rows` 트랜지션이 Chromium에서는 완벽 동작. Firefox/Safari에서는 `interpolate-size`가 아직 미지원이라 fallback 필요. |
| **그룹 내 카드 개수 뱃지 + 최근 추천 미리보기** | 접힌 그룹 헤더에 마지막 추천 브랜드명 1개를 미리보기로 표시. 클릭하지 않고도 어떤 추천이 있었는지 힌트. | LOW | 그룹의 첫 번째 배치에서 첫 번째 이름만 추출해서 표시. |
| **모바일에서 추천 패널 토글 버튼** | 세로 스택 레이아웃에서 입력이 길면 추천 패널까지 스크롤이 멀음. FAB(Floating Action Button) 스타일로 추천 패널로 이동하는 버튼. | LOW | `scroll-to` 동작 또는 모바일 전용 고정 버튼. |
| **업종 변경 히스토리** | 어떤 업종 순서로 탐색했는지 타임라인. 여러 업종을 비교 탐색하는 워크플로우 지원. | MEDIUM | 시간순 그룹 헤더가 이미 히스토리 역할. 별도 기능보다는 그루핑 UX 자체가 히스토리. |
| **드롭다운 최근 선택 기억** | 자주 쓰는 업종을 최상단에 표시. 247개 중 같은 업종을 반복 선택하는 사용자 편의. | LOW | localStorage에 최근 선택 3개 저장, 드롭다운 상단에 구분선과 함께 표시. |

---

### Anti-Features (만들지 말 것)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **업종 자유입력 (free-text)** | "목록에 없는 업종을 쓰고 싶어요" | 247개 소분류에 없는 업종은 그루핑 키가 없어서 카드 분류 불가. AI 프롬프트 일관성도 깨짐. 자유입력과 분류체계가 충돌. | 드롭다운에 "기타" 포함, 기타 선택 시 보조 입력 필드 표시. |
| **커스텀 드롭다운 라이브러리 도입** | "검색 기능 있는 멋진 Select 컴포넌트" | react-select, downshift 등 외부 라이브러리는 번들 크기 증가 + 기존 디자인 시스템과 스타일 불일치. 247개는 3단계로 나누면 각 단계 최대 20~30개로 네이티브 select로 충분. | 네이티브 `<select>` 3개 연쇄 사용. 검색은 differentiator로 자체 구현 고려. |
| **무한 중첩 그룹 (sub-group)** | "대분류별로도 그루핑하면 좋겠다" | 소분류가 그루핑 단위로 충분. 2단계 그루핑은 UI가 너무 복잡해지고, 대분류 안에 소분류가 10개 이상이면 그룹 자체가 길어져 의미 없음. | 소분류 단일 레벨 그루핑. 그룹 헤더에 대분류 정보를 부가 표시하는 정도. |
| **모바일에서 Bottom Sheet 추천 패널** | "인스타그램처럼 아래에서 올라오는 시트" | react-spring-bottom-sheet 등 라이브러리 의존성 추가. 제스처 처리 복잡. 사내 앱 100명 사용자에게 과도한 UX 투자. | 단순 세로 스택 + scroll-to 버튼으로 충분. |
| **Framer Motion 의존성 추가** | "부드러운 레이아웃 애니메이션" | 번들 크기 30KB+ 추가. 아코디언 하나를 위해 애니메이션 라이브러리 전체를 도입하는 것은 과도. | CSS `grid-template-rows` 트랜지션 (Chromium 완벽 지원) + progressive enhancement. 미지원 브라우저에서는 즉시 전환(기능 손실 없음). |
| **실시간 업종 자동 감지** | "상품 설명을 분석해서 업종을 자동 추천" | Gemini API 추가 호출 비용. 잘못된 자동 감지가 사용자 신뢰를 떨어뜨림. 사용자가 자기 업종을 모르는 경우는 거의 없음. | 사용자가 직접 선택. 선택이 어려우면 "기타" 사용. |

---

## Feature Dependencies

```
[업종 드롭다운 체인]
데이터 구조 (industryData.ts)
    ├── CascadingDropdown 컴포넌트
    │       └── StoreBasicSection에서 기존 Dropdown 교체
    └── useFormStore에 category 구조 변경
            └── category: string (소분류 텍스트)

[카드 그루핑 체인]
RecommendBatch에 category 필드 추가
    └── useRecommend에서 배치 생성 시 현재 category 포함
            └── RecommendPanel에서 groupBy(category)
                    ├── GroupHeader 컴포넌트 (접기/펼치기)
                    └── 업종 변경 시 자동 접힘 로직

[모바일 반응형 체인]
AppLayout 반응형 전환
    ├── InputPanel 여백/크기 조정
    ├── RecommendPanel sticky 제거 (모바일)
    └── CascadingDropdown 모바일 레이아웃
            └── 3개 드롭다운 수직 배치 (모바일) vs 수평 배치 (데스크톱)

[의존 관계]
업종 드롭다운 ──requires──> 데이터 구조 (먼저 구축)
카드 그루핑 ──requires──> 업종 드롭다운 (category 값이 있어야 그루핑 가능)
모바일 반응형 ──independent──> 다른 기능과 병렬 가능
카드 그루핑 ──enhances──> 모바일 반응형 (모바일에서 그룹 접기가 더 유용)
```

### Dependency Notes

- **카드 그루핑 requires 업종 드롭다운:** 소분류 값이 `RecommendBatch`에 포함되어야 그루핑 키로 사용 가능. 업종 드롭다운이 먼저 완성되어야 한다.
- **모바일 반응형은 독립적:** 레이아웃 변경은 기능 로직과 무관. 다른 기능과 동시 진행 가능하지만, CascadingDropdown의 모바일 레이아웃은 드롭다운 완성 후 조정.
- **데이터 구조가 첫 번째:** `industryData.ts` 파일이 모든 기능의 기반. 247개 항목의 대/중/소분류 매핑이 확정되어야 드롭다운과 그루핑 모두 구현 가능.

---

## Implementation Recommendations

### 1. 계층형 드롭다운: 네이티브 `<select>` 3개 연쇄

**Why native select, not custom combobox:**
- 현재 앱이 이미 네이티브 `<select>` 기반 `Dropdown` 컴포넌트를 사용 중
- 3단계 분류로 나누면 각 단계 최대 21개(대분류), 30개(중분류), 15개(소분류) 수준 -- 네이티브 select로 충분한 양
- 모바일에서 네이티브 select의 OS 피커(iOS wheel picker, Android dialog)가 커스텀 드롭다운보다 훨씬 나은 UX
- 외부 라이브러리 zero dependency
- 기존 디자인 시스템과 완벽 일관성

**데이터 구조 권장:**

```typescript
// industryData.ts
interface IndustryCategory {
  large: string;      // 대분류: "음식점업"
  medium: string;     // 중분류: "한식 음식점업"
  small: string;      // 소분류: "한식 일반 음식점업"
}

// 247개 항목의 flat array -- 필터링으로 계층 도출
const INDUSTRY_DATA: IndustryCategory[] = [
  { large: "음식점업", medium: "한식 음식점업", small: "한식 일반 음식점업" },
  { large: "음식점업", medium: "한식 음식점업", small: "한식 육류구이 전문점" },
  // ...247 items
];

// 유틸리티 함수
const getLargeCategories = () => [...new Set(INDUSTRY_DATA.map(d => d.large))];
const getMediumCategories = (large: string) => [...new Set(INDUSTRY_DATA.filter(d => d.large === large).map(d => d.medium))];
const getSmallCategories = (medium: string) => [...new Set(INDUSTRY_DATA.filter(d => d.medium === medium).map(d => d.small))];
```

**Why flat array, not nested tree:**
- 247개는 메모리/성능 문제 없는 작은 데이터셋
- flat 구조가 필터링/검색에 더 유리 (`.filter()` 한 번)
- nested 구조는 코드는 직관적이지만 나중에 검색 기능 추가 시 flatten 작업 필요
- JSON/CSV에서 import하기도 flat이 간단

### 2. 카드 그루핑: 아코디언 패턴 + 자동 접힘

**핵심 UX 결정:**
- **복수 그룹 동시 펼침 허용** -- 단일 아코디언(하나만 열림)이 아니라 복수 그룹 동시 오픈. 이유: 사용자가 두 업종의 추천을 비교하고 싶을 수 있음.
- **자동 접힘은 "업종 변경" 이벤트에만** -- 새 배치 추가 자체로는 접지 않음. 업종이 달라졌을 때만 이전 그룹 접힘.
- **현재 업종 그룹은 항상 펼침** -- 자동 접힘 후에도 현재 업종 그룹은 열린 상태.

**애니메이션 접근:**
- CSS `grid-template-rows: 0fr -> 1fr` 트랜지션 사용 (라이브러리 무의존)
- Chromium(Chrome, Edge): 완벽 동작
- Firefox/Safari: 트랜지션 미지원 -> 즉시 전환 (기능 손실 없음, progressive enhancement)
- 사내 앱이므로 Chrome 사용을 권장하면 100% 커버 가능

**상태 관리:**
```typescript
// 그룹 접힘 상태를 컴포넌트 로컬 상태로 관리 (persist 불필요)
const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
```

### 3. 모바일 반응형: Tailwind v4 mobile-first 전환

**핵심 변경점:**

현재 `AppLayout`:
```tsx
// 현재: 데스크톱 전용
<div className="grid grid-cols-[7fr_3fr] min-h-screen min-w-[1024px]">
```

변경:
```tsx
// 변경: mobile-first
<div className="flex flex-col lg:grid lg:grid-cols-[7fr_3fr] min-h-screen">
```

**Breakpoint 전략:**
- `lg` (1024px) 이상: 기존 7:3 사이드바이사이드
- `lg` 미만: 세로 스택 (입력 위, 추천 아래)
- 1024px가 현재 `min-w-[1024px]`와 일치하므로 자연스러운 전환점

**RecommendPanel 변경:**
```tsx
// 현재: 항상 sticky
<aside className="sticky top-0 h-screen overflow-y-auto ...">

// 변경: 데스크톱에서만 sticky
<aside className="lg:sticky lg:top-0 lg:h-screen overflow-y-auto ...">
```

---

## MVP Definition (v1.1 기준)

### Launch With (v1.1 필수)

- [ ] **247개 산업분류 데이터 파일** -- 모든 기능의 기반
- [ ] **CascadingDropdown 컴포넌트** -- 대분류 > 중분류 > 소분류 연쇄 선택
- [ ] **StoreBasicSection 업종 드롭다운 교체** -- 기존 단일 dropdown -> cascading dropdown
- [ ] **RecommendBatch에 category 필드 추가** -- 소분류 값 저장
- [ ] **카드 소분류별 그루핑 + 헤더** -- 그룹 구분 표시
- [ ] **접기/펼치기 토글** -- 기본 아코디언 동작
- [ ] **업종 변경 시 자동 접힘** -- 핵심 UX 차별점
- [ ] **AppLayout 반응형 전환** -- lg 이상 사이드바이사이드, 미만 세로 스택
- [ ] **RecommendPanel 조건부 sticky** -- 데스크톱만 sticky
- [ ] **모바일 여백/크기 조정** -- 터치 타겟, 패딩 반응형

### Add After Validation (v1.1.x)

- [ ] **아코디언 CSS 애니메이션** -- `grid-template-rows` 트랜지션 (기능 완성 후 Polish)
- [ ] **소분류 검색/타이프어헤드** -- 사용자 피드백에서 "업종 찾기 어렵다" 나오면 추가
- [ ] **모바일 추천 패널 이동 FAB** -- 세로 스택에서 추천 패널까지 스크롤이 길면 추가
- [ ] **그룹 헤더 미리보기** -- 접힌 상태에서 마지막 추천 브랜드명 표시

### Defer (v1.2+)

- [ ] **업종 최근 선택 기억** -- nice to have, 핵심 흐름 안정화 후
- [ ] **업종 변경 히스토리 타임라인** -- 그루핑 자체가 이미 히스토리 역할

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority | Phase |
|---------|------------|---------------------|----------|-------|
| 산업분류 데이터 구조 | HIGH | LOW | P1 | 1 |
| CascadingDropdown 컴포넌트 | HIGH | MEDIUM | P1 | 1 |
| StoreBasicSection 교체 | HIGH | LOW | P1 | 1 |
| RecommendBatch category 추가 | HIGH | LOW | P1 | 1 |
| 카드 소분류별 그루핑 | HIGH | MEDIUM | P1 | 2 |
| 접기/펼치기 토글 | HIGH | MEDIUM | P1 | 2 |
| 업종 변경 시 자동 접힘 | HIGH | MEDIUM | P1 | 2 |
| AppLayout 반응형 | HIGH | MEDIUM | P1 | 3 |
| RecommendPanel 조건부 sticky | MEDIUM | LOW | P1 | 3 |
| 모바일 여백 조정 | MEDIUM | LOW | P1 | 3 |
| 아코디언 CSS 애니메이션 | MEDIUM | LOW | P2 | 3 |
| 소분류 검색 | MEDIUM | MEDIUM | P2 | defer |
| 모바일 FAB | LOW | LOW | P3 | defer |

**Priority key:**
- P1: v1.1 필수 -- 이것 없이는 마일스톤 미완성
- P2: v1.1 여유되면 추가 -- Polish 단계
- P3: v1.2 이후 고려

---

## Key Technical Decisions

### 네이티브 `<select>` vs 커스텀 드롭다운

**결론: 네이티브 `<select>` 3개 연쇄 사용**

| 기준 | 네이티브 `<select>` | 커스텀 (react-select 등) |
|------|---------------------|--------------------------|
| 모바일 UX | OS 네이티브 피커 (우수) | 커스텀 드롭다운 (보통) |
| 접근성 | 기본 내장 | 직접 구현 필요 |
| 번들 크기 | 0 KB | 10-30 KB |
| 기존 디자인 일관성 | 기존 Dropdown 재사용 | 새 스타일링 필요 |
| 검색/필터 | 미지원 | 지원 |
| 항목 수 적합성 | 각 단계 20-30개 -> 충분 | 247개 단일 목록에 적합 |

3단계 분류로 나누면 각 단계의 옵션 수가 20-30개 이하로 충분히 관리 가능. 검색 기능은 사용자 피드백으로 필요성 확인 후 추가.

### 아코디언 애니메이션: CSS-only vs JS 라이브러리

**결론: CSS `grid-template-rows` 트랜지션 (progressive enhancement)**

| 기준 | CSS grid-template-rows | Framer Motion |
|------|------------------------|---------------|
| 번들 크기 | 0 KB | 30+ KB |
| 브라우저 지원 | Chromium (Chrome/Edge) | 전체 |
| 구현 난이도 | LOW | MEDIUM |
| 비동작 시 | 즉시 전환 (기능 유지) | N/A |
| 의존성 | 없음 | framer-motion |

사내 앱이므로 Chrome 권장으로 커버 가능. 비Chromium에서도 기능 자체는 동작(애니메이션만 없음).

### 모바일 Breakpoint 선택

**결론: `lg` (1024px) 사용**

- 현재 `min-w-[1024px]`와 정확히 일치 -> 자연스러운 전환
- Tailwind v4 기본 breakpoint (`--breakpoint-lg: 64rem`)
- 태블릿(768px-1024px)에서도 세로 스택이 더 적합 (7:3 비율이 태블릿에서는 좁음)

---

## Sources

- [Tailwind CSS v4 Responsive Design](https://tailwindcss.com/docs/responsive-design) -- breakpoint 값, container query, mobile-first 접근법
- [CSS grid-template-rows accordion](https://medium.com/likeacoffee-dev/creating-a-dynamic-height-accordion-with-css-grid-38bdb2e3a29b) -- CSS-only 아코디언 구현
- [CSS interpolate-size browser support](https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size) -- height: auto 트랜지션 브라우저 지원 현황
- [Josh Comeau - interpolate-size](https://www.joshwcomeau.com/snippets/html/interpolate-size/) -- CSS keyword 트랜지션 기법
- [UXPin Dropdown Interaction Patterns](https://www.uxpin.com/studio/blog/dropdown-interaction-patterns-a-complete-guide/) -- 50+ 항목 시 검색 권장
- [Mobbin Accordion UI Patterns](https://mobbin.com/glossary/accordion) -- 아코디언 UX 모범 사례
- [Canada.ca Expand/Collapse Pattern](https://design.canada.ca/common-design-patterns/collapsible-content.html) -- 접근성 고려 접기/펼치기 패턴
- [한국표준산업분류 KSIC](http://kssc.kostat.go.kr/) -- 대/중/소분류 체계 참조
- [GitHub KSIC Dataset](https://github.com/FinanceData/KSIC) -- CSV 형식 산업분류 데이터

---
*Feature research for: v1.1 UX improvements (cascading dropdown, card grouping, mobile responsive)*
*Researched: 2026-04-01*
