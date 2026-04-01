# Architecture Research: v1.1 UX 개선 통합

**Domain:** Brand Naming Web App -- v1.1 feature integration (industry dropdown, card grouping, mobile responsive)
**Researched:** 2026-04-01
**Confidence:** HIGH (existing codebase fully analyzed, patterns well-established)

---

## System Overview: Before vs After

### Current Architecture (v1.0)

```
AppLayout (grid-cols-[7fr_3fr], min-w-[1024px])
  ├── InputPanel (left, scrollable)
  │   ├── StoreBasicSection
  │   │   └── Dropdown (flat options: 14 category strings)  <-- 교체 대상
  │   ├── BrandVisionSection
  │   └── PersonaSection
  └── RecommendPanel (right, sticky)
      └── RecommendCardItem[] (flat list)  <-- 그루핑 대상

State: useFormStore (Zustand + persist)
  ├── storeBasic.category: string (단순 문자열)
  ├── batches: RecommendBatch[] (flat array)
  └── isLoading, error
```

### Target Architecture (v1.1)

```
AppLayout (responsive: grid 7/3 on lg+, stack on <lg)  <-- 반응형
  ├── InputPanel (left / top on mobile)
  │   ├── StoreBasicSection
  │   │   └── IndustryDropdown (3-level cascading)  <-- 신규 컴포넌트
  │   ├── BrandVisionSection
  │   └── PersonaSection
  └── RecommendPanel (right / bottom on mobile)
      └── RecommendGroup[] (grouped by 소분류)  <-- 신규 컴포넌트
          └── RecommendCardItem[]

State: useFormStore (확장)
  ├── storeBasic.category: IndustrySelection (구조화된 객체)
  ├── batches: RecommendBatch[] (category 필드 추가)
  ├── collapsedGroups: Set<string> (접힘 상태)
  └── isLoading, error

Static Data: industryData.ts (대분류 > 중분류 > 소분류 트리)
```

---

## Feature 1: 계층형 업종 드롭다운 (Hierarchical Industry Dropdown)

### Data Architecture

**산업분류 데이터는 정적 TypeScript 파일로 관리한다.** JSON 파일이 아닌 `.ts` 파일을 사용하는 이유:

1. 타입 안전성 -- `as const` 로 리터럴 타입 추론 가능
2. 트리 셰이킹 -- Vite가 사용하지 않는 코드 제거 가능
3. IDE 지원 -- 자동완성, 타입 체크, 리팩터링
4. 247개 소분류는 약 15-20KB -- 번들 영향 무시 가능

**Zustand 스토어에 넣지 않는 이유:** 이 데이터는 불변(immutable)이다. 변경되지 않는 참조 데이터를 전역 상태에 넣으면 불필요한 구독이 발생하고, localStorage 직렬화에 낭비된다. 정적 import가 정답이다.

### Data Structure

```typescript
// src/data/industryData.ts

export interface IndustryCategory {
  code: string;       // 대분류 코드 (예: "A")
  name: string;       // 대분류명 (예: "음식점")
  sub: IndustryMiddle[];
}

export interface IndustryMiddle {
  code: string;       // 중분류 코드 (예: "A1")
  name: string;       // 중분류명 (예: "한식")
  sub: IndustrySmall[];
}

export interface IndustrySmall {
  code: string;       // 소분류 코드 (예: "A1-01")
  name: string;       // 소분류명 (예: "한정식")
}

export const INDUSTRY_DATA: IndustryCategory[] = [
  {
    code: "A", name: "음식점",
    sub: [
      {
        code: "A1", name: "한식",
        sub: [
          { code: "A1-01", name: "한정식" },
          { code: "A1-02", name: "백반/국밥" },
          // ...
        ]
      },
      // ...
    ]
  },
  // ... 총 247개 소분류
];
```

**NOTE:** 247개는 소상공인 맞춤 분류 체계이며, 통계청 한국표준산업분류(KSIC) 전체(2,000+항목)를 사용하지 않는다. 소상공인에게 필요한 업종만 curate한 커스텀 분류로, 데이터는 직접 정의한다.

### Store 변경

```typescript
// src/types/form.ts -- 변경

// 기존: category: string
// 변경:
export interface IndustrySelection {
  large: string;   // 대분류명 (예: "음식점")
  middle: string;  // 중분류명 (예: "한식")
  small: string;   // 소분류명 (예: "한정식") -- 이것이 카드 그루핑 key
}

export interface StoreBasicState {
  category: IndustrySelection;  // string -> IndustrySelection
  location: string;
  scale: string;
  mainProduct: string;
  priceRange: string;
  targetCustomer: string;
}
```

```typescript
// src/store/useFormStore.ts -- 변경

const initialStoreBasic: StoreBasicState = {
  category: { large: '', middle: '', small: '' },  // string -> object
  // ... 나머지 동일
};

// updateStoreBasic 시그니처 변경:
updateStoreBasic: (field: keyof StoreBasicState, value: string | IndustrySelection) => void;
```

### New Component: IndustryDropdown

```
src/components/ui/IndustryDropdown.tsx (신규)
```

**설계 원칙:**
- 기존 `Dropdown.tsx`를 래핑하지 않고, 독립 컴포넌트로 만든다. 이유: 3-level cascading 로직이 단일 `<select>`와 근본적으로 다른 UX 패턴이다.
- 네이티브 `<select>` 3개를 수평 배치한다. 커스텀 드롭다운은 과도한 복잡성이다.
- 대분류 선택 시 중분류 옵션 필터링, 중분류 선택 시 소분류 옵션 필터링 (순차적 종속)
- 하위 레벨 선택을 초기화하는 상향식 리셋: 대분류 변경 -> 중/소 초기화

**구현 패턴:**

```typescript
// src/components/ui/IndustryDropdown.tsx (핵심 로직만)

interface IndustryDropdownProps {
  value: IndustrySelection;
  onChange: (value: IndustrySelection) => void;
}

export function IndustryDropdown({ value, onChange }: IndustryDropdownProps) {
  // 대분류 -> 해당 중분류 목록 파생 (useMemo)
  const middleOptions = useMemo(() =>
    INDUSTRY_DATA.find(c => c.name === value.large)?.sub ?? [],
    [value.large]
  );

  // 중분류 -> 해당 소분류 목록 파생 (useMemo)
  const smallOptions = useMemo(() =>
    middleOptions.find(m => m.name === value.middle)?.sub ?? [],
    [middleOptions, value.middle]
  );

  const handleLargeChange = (name: string) => {
    onChange({ large: name, middle: '', small: '' }); // 하위 리셋
  };

  const handleMiddleChange = (name: string) => {
    onChange({ ...value, middle: name, small: '' }); // 소분류 리셋
  };

  const handleSmallChange = (name: string) => {
    onChange({ ...value, small: name });
  };

  // 3개의 <select> 렌더링 (수평 배치, 반응형에서는 수직 스택)
}
```

**StoreBasicSection 변경:**

```typescript
// 기존:
<Dropdown label="업종" value={s.category} onChange={(v) => u('category', v)} options={CATEGORY_OPTIONS} />

// 변경:
<IndustryDropdown value={s.category} onChange={(v) => u('category', v)} />
```

`CATEGORY_OPTIONS` 상수는 삭제한다.

### gemini.ts 변경

업종 정보를 프롬프트에 넣는 `buildInputSummary` 함수의 `category` 처리를 변경한다:

```typescript
// 기존: { category: "카페/베이커리" }
// 변경: { category: { large: "음식점", middle: "카페", small: "디저트카페" } }

// buildInputSummary 내부:
if (typeof section.data.category === 'object') {
  const cat = section.data.category as IndustrySelection;
  if (cat.small) lines.push(`- 업종: ${cat.large} > ${cat.middle} > ${cat.small}`);
}
```

### RecommendBatch 변경

카드 그루핑의 key로 사용하기 위해 batch에 업종 정보를 포함시킨다:

```typescript
// src/types/form.ts

export interface RecommendBatch {
  id: string;
  names: { brandName: string; reasoning: string }[];
  basedOn: string[];
  createdAt: Date;
  category: string;  // 신규: 생성 시점의 소분류명 (그루핑 key)
}
```

`generateBrandNames` 함수에서 현재 선택된 `storeBasic.category.small` 값을 batch에 포함시킨다.

---

## Feature 2: 추천 카드 소분류 그루핑

### 그루핑 로직

**데이터 변환은 컴포넌트에서 `useMemo`로 수행한다.** Zustand에 그룹핑된 데이터를 넣지 않는다 -- 파생 상태(derived state)는 원본 데이터에서 계산하는 것이 정석이다.

```typescript
// 그루핑 유틸리티 (src/utils/groupBatches.ts)

export function groupBatchesByCategory(batches: RecommendBatch[]): Map<string, RecommendBatch[]> {
  const groups = new Map<string, RecommendBatch[]>();
  for (const batch of batches) {
    const key = batch.category || '미분류';
    const existing = groups.get(key) ?? [];
    groups.set(key, [...existing, batch]);
  }
  return groups;
}
```

### 접기/펼치기 상태 관리

**`collapsedGroups`를 useFormStore에 추가한다.** 이유:

1. 접힘 상태는 업종 변경 시 자동으로 변경되어야 하므로 Zustand action에서 제어 필요
2. 여러 컴포넌트(RecommendPanel, 각 RecommendGroup)가 이 상태를 공유
3. `useState`로 RecommendPanel에만 두면 요구사항의 "업종 변경 시 자동 접힘"을 구현하기 어려움

```typescript
// src/store/useFormStore.ts -- 추가

interface FormActions {
  // ... 기존 액션들
  toggleGroupCollapsed: (category: string) => void;
  collapseGroup: (category: string) => void;    // 특정 그룹 접기
}

// 상태 추가:
collapsedGroups: string[];  // Set 대신 string[] (persist 직렬화 용이)

// 액션:
toggleGroupCollapsed: (category) =>
  set((state) => ({
    collapsedGroups: state.collapsedGroups.includes(category)
      ? state.collapsedGroups.filter(c => c !== category)
      : [...state.collapsedGroups, category]
  })),

collapseGroup: (category) =>
  set((state) => ({
    collapsedGroups: state.collapsedGroups.includes(category)
      ? state.collapsedGroups
      : [...state.collapsedGroups, category]
  })),
```

**업종 변경 시 자동 접힘:**

`updateStoreBasic`에서 `category` 필드 변경 감지 시, 이전 업종의 그룹을 접는다:

```typescript
updateStoreBasic: (field, value) =>
  set((state) => {
    const newState = { storeBasic: { ...state.storeBasic, [field]: value } };
    // 업종 변경 시 이전 업종 그룹 자동 접기
    if (field === 'category') {
      const oldSmall = state.storeBasic.category.small;
      if (oldSmall && oldSmall !== (value as IndustrySelection).small) {
        return {
          ...newState,
          collapsedGroups: state.collapsedGroups.includes(oldSmall)
            ? state.collapsedGroups
            : [...state.collapsedGroups, oldSmall],
        };
      }
    }
    return newState;
  }),
```

### New Components

```
src/components/recommend/RecommendGroup.tsx (신규)
```

```typescript
// RecommendGroup -- 소분류 헤더 + 접기/펼치기 + 카드 목록

interface RecommendGroupProps {
  category: string;
  batches: RecommendBatch[];
  collapsed: boolean;
  onToggle: () => void;
}

export function RecommendGroup({ category, batches, collapsed, onToggle }: RecommendGroupProps) {
  return (
    <div>
      <button onClick={onToggle} className="...">
        <ChevronDown className={collapsed ? '-rotate-90' : ''} />
        <span>{category}</span>
        <span className="text-xs text-muted">{batches.length}건</span>
      </button>
      {!collapsed && (
        <div className="space-y-3">
          {batches.map(b => <RecommendCardItem key={b.id} batch={b} />)}
        </div>
      )}
    </div>
  );
}
```

### App.tsx 변경

```typescript
// 기존 (flat list):
{batches.map((b) => <RecommendCardItem key={b.id} batch={b} />)}

// 변경 (grouped):
const groups = useMemo(() => groupBatchesByCategory(batches), [batches]);
const collapsedGroups = useFormStore((s) => s.collapsedGroups);
const toggleGroup = useFormStore((s) => s.toggleGroupCollapsed);

{Array.from(groups.entries()).map(([category, groupBatches]) => (
  <RecommendGroup
    key={category}
    category={category}
    batches={groupBatches}
    collapsed={collapsedGroups.includes(category)}
    onToggle={() => toggleGroup(category)}
  />
))}
```

### persist 변경

`collapsedGroups`도 localStorage에 저장한다 (배열이므로 직렬화 문제 없음):

```typescript
partialize: (state) => ({
  batches: state.batches,
  collapsedGroups: state.collapsedGroups,
}),
```

---

## Feature 3: 모바일 반응형 레이아웃

### 브레이크포인트 결정

**`lg` (1024px)을 브레이크포인트로 사용한다.** 이유:

1. 현재 `AppLayout`이 `min-w-[1024px]`을 설정 -- 이것이 이미 "데스크탑"의 암시적 기준점
2. Tailwind v4 기본 `lg` = 1024px -- 커스텀 브레이크포인트 불필요
3. 1024px 미만에서는 70/30 split이 물리적으로 좁아 사용 불가 (30% = 307px에 카드 표시 불가)

### AppLayout 변경

```typescript
// 기존:
<div className="grid grid-cols-[7fr_3fr] min-h-screen min-w-[1024px]">

// 변경:
<div className="flex flex-col lg:grid lg:grid-cols-[7fr_3fr] min-h-screen">
```

**핵심 변경:**
- `min-w-[1024px]` 제거 -- 반응형과 모순
- `flex flex-col` -- 모바일 기본: 수직 스택 (입력 위, 추천 아래)
- `lg:grid lg:grid-cols-[7fr_3fr]` -- 데스크탑: 기존 7:3 분할 유지

### InputPanel 변경

```typescript
// 기존:
<main className="overflow-y-auto h-screen scroll-smooth bg-[#2C2825]">
  <div className="max-w-[640px] mx-auto px-8 pt-12 pb-20">

// 변경:
<main className="overflow-y-auto lg:h-screen scroll-smooth bg-[#2C2825]">
  <div className="max-w-[640px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12 pb-12 lg:pb-20">
```

**변경사항:**
- `h-screen` -> `lg:h-screen`: 모바일에서는 콘텐츠에 따라 높이 자동 조절 (스크롤은 페이지 전체)
- `px-8` -> `px-4 sm:px-8`: 좁은 화면에서 패딩 줄임
- `pt-12` -> `pt-8 sm:pt-12`: 상단 여백 축소
- `pb-20` -> `pb-12 lg:pb-20`: 하단 여백 조절

### RecommendPanel 변경

```typescript
// 기존:
<aside className="sticky top-0 h-screen overflow-y-auto bg-[#252220] border-l border-[#4A4440]">

// 변경:
<aside className="lg:sticky lg:top-0 lg:h-screen overflow-y-auto bg-[#252220]
  border-t lg:border-t-0 lg:border-l border-[#4A4440]">
```

**변경사항:**
- `sticky top-0 h-screen` -> `lg:sticky lg:top-0 lg:h-screen`: 모바일에서는 sticky 해제, 입력 아래에 자연스럽게 배치
- `border-l` -> `border-t lg:border-t-0 lg:border-l`: 모바일에서는 상단 보더, 데스크탑에서는 좌측 보더

### StoreBasicSection 내 IndustryDropdown 반응형

```typescript
// IndustryDropdown 내부 3개 select 배치:
<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
  {/* 대분류 select */}
  {/* 중분류 select */}
  {/* 소분류 select */}
</div>
```

모바일 (`< sm`): 3개가 세로로 쌓임
태블릿 이상 (`>= sm`): 3개가 한 줄에 나란히

### 히어로 영역 반응형

```typescript
// InputPanel 내부 히어로:
// 기존: text-[26px]
// 변경: text-[22px] sm:text-[26px]
// 기존: px-8 py-9
// 변경: px-5 sm:px-8 py-6 sm:py-9
```

### 추가 필요 없는 것

- **미디어 쿼리 훅 (useMediaQuery):** 불필요. Tailwind의 반응형 클래스만으로 모든 레이아웃 전환 처리 가능. JS로 브레이크포인트를 감지할 이유가 없다.
- **Container queries:** 불필요. 이 앱은 뷰포트 기반 반응형이면 충분하다. 컴포넌트가 다른 컨테이너에 재사용되는 케이스가 없다.
- **별도 모바일 컴포넌트:** 불필요. 동일 컴포넌트에서 Tailwind 클래스만 분기한다.

---

## Component Responsibilities (v1.1 완료 후)

| Component | Responsibility | Status | File |
|-----------|---------------|--------|------|
| `AppLayout` | 반응형 7:3 / 세로 스택 레이아웃 | **수정** | layout/AppLayout.tsx |
| `InputPanel` | 왼쪽(위) 입력 패널, 반응형 패딩 | **수정** | layout/InputPanel.tsx |
| `RecommendPanel` | 오른쪽(아래) 추천 패널, 반응형 sticky | **수정** | layout/RecommendPanel.tsx |
| `StoreBasicSection` | 매장 기본 섹션, IndustryDropdown 사용 | **수정** | sections/StoreBasicSection.tsx |
| `IndustryDropdown` | 3-level 계층형 업종 선택 | **신규** | ui/IndustryDropdown.tsx |
| `RecommendGroup` | 소분류별 카드 그룹 (헤더 + 접기/펼치기) | **신규** | recommend/RecommendGroup.tsx |
| `RecommendCardItem` | 개별 추천 카드 (변경 없음) | 유지 | recommend/RecommendCardItem.tsx |
| `App.tsx` | 그루핑 로직, 그룹 렌더링 | **수정** | App.tsx |

### New Files

| File | Purpose | Estimated Lines |
|------|---------|----------------|
| `src/data/industryData.ts` | 247개 소분류 계층 데이터 | ~400 (데이터 파일, 500줄 제한 별도 적용 가능) |
| `src/components/ui/IndustryDropdown.tsx` | 3-level cascading dropdown | ~80 |
| `src/components/recommend/RecommendGroup.tsx` | 그룹 헤더 + 접기/펼치기 | ~40 |
| `src/utils/groupBatches.ts` | 배치 그루핑 유틸리티 | ~15 |

### Modified Files

| File | Changes |
|------|---------|
| `src/types/form.ts` | `IndustrySelection` 인터페이스 추가, `StoreBasicState.category` 타입 변경, `RecommendBatch.category` 필드 추가 |
| `src/store/useFormStore.ts` | 초기값 변경, `collapsedGroups` 상태 추가, `toggleGroupCollapsed`/`collapseGroup` 액션, 업종 변경 시 자동접힘 로직, persist partialize 확장 |
| `src/services/gemini.ts` | `buildInputSummary`에서 업종 객체 처리, `generateBrandNames`에서 batch.category 포함 |
| `src/components/layout/AppLayout.tsx` | 반응형 grid/flex 전환 |
| `src/components/layout/InputPanel.tsx` | 반응형 패딩/여백 |
| `src/components/layout/RecommendPanel.tsx` | 반응형 sticky/border |
| `src/components/sections/StoreBasicSection.tsx` | IndustryDropdown 교체, CATEGORY_OPTIONS 제거 |
| `src/App.tsx` | 그루핑 로직, RecommendGroup 렌더링 |

---

## Data Flow (v1.1)

### Flow 1: 업종 선택 -> 추천 카드 생성

```
1. 사용자가 IndustryDropdown에서 대분류 선택
2. 중분류 옵션 파생 (useMemo), 중분류 선택
3. 소분류 옵션 파생 (useMemo), 소분류 선택
4. onChange -> updateStoreBasic('category', { large, middle, small })
5. 사용자가 "추천 받기" 클릭
6. useRecommend -> generateBrandNames(form)
7. buildInputSummary: "업종: 음식점 > 카페 > 디저트카페"
8. Gemini 응답 -> RecommendBatch { ..., category: "디저트카페" }
9. addBatch -> batches 배열에 추가
10. App.tsx: groupBatchesByCategory(batches) -> 그룹별 렌더링
```

### Flow 2: 업종 변경 -> 자동 접힘

```
1. 현재 업종: "디저트카페" (소분류)
2. 사용자가 대분류를 "패션"으로 변경
3. updateStoreBasic('category', { large: '패션', middle: '', small: '' })
4. 이전 소분류 "디저트카페"가 collapsedGroups에 추가됨
5. RecommendGroup(category="디저트카페")가 접힌 상태로 렌더링
6. 사용자가 "패션 > 여성복 > 캐주얼" 선택 후 추천 받기
7. 새 배치: { ..., category: "캐주얼" }
8. "캐주얼" 그룹은 열린 상태로 표시 (collapsedGroups에 없으므로)
```

### Flow 3: 모바일 레이아웃

```
1. 뷰포트 < 1024px
2. AppLayout: flex-col (세로 스택)
3. InputPanel: h-auto (콘텐츠 높이), px-4
4. RecommendPanel: sticky 해제, border-top
5. 사용자가 스크롤하면 입력 -> 추천 순서로 보임
6. IndustryDropdown: grid-cols-1 (세로 3줄)
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: 산업분류 데이터를 API에서 로드

**잘못된 접근:** 서버 API에서 산업분류 데이터를 fetch하여 로딩 상태 관리
**문제:** 247개 항목은 정적 데이터다. API 호출은 불필요한 네트워크 지연, 로딩 상태, 에러 핸들링을 추가한다.
**올바른 접근:** 정적 TypeScript 파일로 import. 빌드 타임에 번들에 포함된다.

### Anti-Pattern 2: 커스텀 드롭다운 UI 라이브러리 도입

**잘못된 접근:** Headless UI, React Select, Radix 등 드롭다운 라이브러리 설치
**문제:** 네이티브 `<select>`가 모바일에서 OS 기본 picker를 사용하여 접근성과 UX가 우수하다. 247개는 가상 스크롤이 필요한 규모가 아니다. 외부 의존성 추가는 번들 크기와 유지보수 비용을 높인다.
**올바른 접근:** 네이티브 `<select>` 3개를 기존 Dropdown 스타일링과 통일.

### Anti-Pattern 3: 그루핑 상태를 컴포넌트 로컬 state로 관리

**잘못된 접근:** RecommendPanel 내부에서 `useState`로 collapsed 관리
**문제:** "업종 변경 시 자동 접힘" 요구사항은 InputPanel의 업종 변경이 RecommendPanel의 접힘 상태를 변경해야 한다. 로컬 state로는 이 크로스-컴포넌트 통신이 불가능하다 (prop drilling 또는 callback 지옥 없이).
**올바른 접근:** Zustand 스토어에서 collapsedGroups 관리. updateStoreBasic 액션에서 자동 접힘 로직 포함.

### Anti-Pattern 4: useMediaQuery 훅으로 JS 기반 반응형

**잘못된 접근:** `window.matchMedia`를 감지하여 조건부 렌더링
**문제:** SSR 비호환 (이 앱은 SPA이므로 문제 없지만), hydration mismatch 위험, 불필요한 리렌더링. Tailwind의 `lg:` prefix가 CSS만으로 동일한 결과를 달성한다.
**올바른 접근:** Tailwind 반응형 클래스만 사용. 모바일과 데스크탑에서 동일 컴포넌트 트리, 다른 CSS.

### Anti-Pattern 5: batches 배열을 그루핑된 구조로 변환하여 저장

**잘못된 접근:** Zustand에 `groupedBatches: Record<string, RecommendBatch[]>` 저장
**문제:** 원본 데이터(flat array)와 파생 데이터(grouped)가 동기화 이탈 가능. 배치 추가/삭제 시 두 곳을 업데이트해야 한다.
**올바른 접근:** batches는 flat array로 유지. 그루핑은 `useMemo`로 렌더링 시점에 계산.

---

## Suggested Build Order

의존성 기반으로 3개 피처의 구현 순서를 결정한다.

### Phase 1: 타입 + 데이터 기반 (Day 1)

**먼저 해야 하는 이유:** 다른 두 피처 모두 이 타입 변경에 의존한다.

1. `src/types/form.ts` -- `IndustrySelection` 타입 추가, `StoreBasicState.category` 변경, `RecommendBatch.category` 추가
2. `src/data/industryData.ts` -- 247개 소분류 계층 데이터 작성
3. `src/store/useFormStore.ts` -- 초기값 변경, `collapsedGroups` 추가, 액션 추가
4. `src/services/gemini.ts` -- `buildInputSummary` 업종 처리 수정, batch.category 포함

### Phase 2: 계층형 드롭다운 (Day 2)

**Phase 1 완료 후 가능.** 카드 그루핑보다 먼저 -- 드롭다운이 있어야 카드에 category가 태깅된다.

5. `src/components/ui/IndustryDropdown.tsx` -- 신규 컴포넌트
6. `src/components/sections/StoreBasicSection.tsx` -- IndustryDropdown 교체

### Phase 3: 카드 그루핑 (Day 3)

**Phase 2 완료 후 가능.** 드롭다운에서 업종이 선택되어야 카드에 category가 부여된다.

7. `src/utils/groupBatches.ts` -- 그루핑 유틸리티
8. `src/components/recommend/RecommendGroup.tsx` -- 그룹 컴포넌트
9. `src/App.tsx` -- 그루핑 렌더링으로 교체

### Phase 4: 모바일 반응형 (Day 4)

**독립적이나 마지막이 적합.** Phase 2~3의 새 컴포넌트가 모두 만들어진 후 반응형 클래스를 한꺼번에 적용하는 것이 효율적이다.

10. `src/components/layout/AppLayout.tsx` -- 반응형 전환
11. `src/components/layout/InputPanel.tsx` -- 반응형 패딩
12. `src/components/layout/RecommendPanel.tsx` -- 반응형 sticky/border
13. IndustryDropdown, RecommendGroup에 반응형 클래스 확인/추가

### Phase 5: 마이그레이션 + 테스트 (Day 5)

14. localStorage 마이그레이션 -- 기존 `category: string` 데이터를 `IndustrySelection` 객체로 변환
15. 전체 플로우 테스트: 업종선택 -> 추천 -> 그루핑 -> 업종변경 -> 자동접힘
16. 모바일 뷰포트 테스트

**Build order rationale:** Types first (다른 모든 것이 의존), then input (데이터 생산), then output (데이터 소비), then layout (순수 CSS), then migration (안전망).

---

## localStorage Migration

기존 사용자의 localStorage에는 `category: "카페/베이커리"` 같은 문자열이 저장되어 있다. v1.1에서 이를 객체로 변경하면 기존 데이터가 깨진다.

**해결책:** persist의 `merge` 함수에서 마이그레이션 처리:

```typescript
merge: (persisted, current) => {
  const p = persisted as { batches?: RecommendBatch[] } | undefined;
  const restoredBatches = (p?.batches ?? []).map((b) => ({
    ...b,
    createdAt: new Date(b.createdAt),
    category: b.category ?? '미분류',  // 기존 배치에 category 없으면 '미분류'
  }));
  return { ...current, batches: restoredBatches };
},
```

`storeBasic`은 persist에 포함되지 않으므로 (`partialize`에서 `batches`만 저장) 마이그레이션 불필요.

---

## Scaling Considerations

| Concern | 현재 (v1.0) | v1.1 후 | 비고 |
|---------|-------------|---------|------|
| 산업분류 데이터 크기 | N/A | ~15KB (번들 내) | 무시 가능 |
| 카드 그루핑 성능 | N/A | O(n) per render, useMemo 캐싱 | 100개 배치까지 문제 없음 |
| collapsedGroups 크기 | N/A | 업종 수만큼 (최대 ~50개) | 무시 가능 |
| 모바일 렌더링 | 지원 안 함 | Tailwind CSS만 추가, JS 비용 0 | 성능 영향 없음 |
| localStorage 크기 | batches만 | batches + collapsedGroups | collapsedGroups는 수십 바이트 |

v1.1 피처 중 성능에 우려되는 것은 없다. 모두 클라이언트 사이드에서 소량 데이터를 처리하는 수준이다.

---

## Sources

- [Tailwind CSS v4 Responsive Design](https://tailwindcss.com/docs/responsive-design) -- HIGH confidence, 공식 문서. 기본 브레이크포인트: sm=640, md=768, lg=1024, xl=1280
- [Tailwind CSS v4 CSS-first Configuration](https://devtoolbox.dedyn.io/blog/tailwind-css-v4-complete-guide) -- MEDIUM confidence. @theme 기반 커스텀 브레이크포인트 정의 방법
- [React Cascading Dropdown Patterns 2026](https://copyprogramming.com/howto/javascript-cascading-dropdown-in-react-js-code-example) -- MEDIUM confidence. useState + useEffect 기반 cascading 패턴
- [FinanceData/KSIC GitHub](https://github.com/FinanceData/KSIC) -- HIGH confidence. 한국표준산업분류 데이터 (참고용, 실제는 소상공인 맞춤 분류 사용)
- [Zustand Working Patterns (TkDodo)](https://tkdodo.eu/blog/working-with-zustand) -- HIGH confidence. 파생 상태를 스토어 외부에서 계산하는 패턴
- [React Collapse/Expand Group Pattern](https://dev.to/vier31/expand--collapse-groups-of-items-in-a-list-275g) -- MEDIUM confidence. 그룹 접기/펼치기 UI 패턴

---
*Architecture research for: v1.1 UX improvements (industry dropdown, card grouping, mobile responsive)*
*Researched: 2026-04-01*
