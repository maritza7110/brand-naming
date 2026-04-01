# Stack Research: v1.1 UX 개선

**Domain:** 브랜드 네이밍 앱 - UX 개선 (계층형 드롭다운, 카드 그루핑, 모바일 반응형)
**Researched:** 2026-04-01
**Confidence:** HIGH

> v1.0 검증된 스택 (React 19, Vite 8, TypeScript 5.9, Tailwind CSS 4.2, Zustand 5,
> Gemini API, Lucide React, Pretendard)은 변경 없이 유지한다.
> 이 문서는 v1.1 신규 기능에 필요한 **추가/변경 사항만** 다룬다.

---

## 핵심 결론: 새 라이브러리 추가 불필요

v1.1의 세 가지 기능 모두 **기존 스택만으로 구현 가능하다.**
외부 UI 라이브러리를 추가하면 번들 크기가 늘고, 기존 커스텀 디자인 시스템과 충돌한다.

| 기능 | 접근 방식 | 외부 라이브러리 | 이유 |
|------|-----------|----------------|------|
| 계층형 드롭다운 | 커스텀 컴포넌트 (3단 연동 `<select>`) | 불필요 | 247개 소분류는 가상 스크롤이 필요 없는 소규모. 기존 Dropdown 컴포넌트 패턴 확장으로 충분 |
| 접기/펼치기 카드 그루핑 | CSS Grid `grid-rows-[0fr]/[1fr]` + React 상태 | 불필요 | Tailwind 4.2 arbitrary values로 애니메이션 가능. JS 라이브러리 불필요 |
| 모바일 반응형 | Tailwind 반응형 유틸리티 (`md:`, `lg:`) | 불필요 | Tailwind 4.x는 mobile-first 반응형을 네이티브 지원 |

---

## 1. 계층형 드롭다운 (대분류 > 중분류 > 소분류)

### 추천: 커스텀 `CascadeDropdown` 컴포넌트 직접 구현

**이유:**
- 247개 소분류는 소규모 데이터셋 -- 가상 스크롤이나 비동기 로딩이 필요 없음
- 기존 `Dropdown.tsx`가 이미 프로젝트 디자인 시스템에 맞춰져 있음 (다크 테마, 둥근 모서리, Lucide 아이콘)
- rc-cascader, PrimeReact CascadeSelect 등은 자체 스타일링이 있어 기존 디자인과 충돌
- 3단계 연동 로직은 `useMemo` + 필터링으로 간단하게 구현 가능

**데이터 구조:**
```typescript
// 정적 JSON 파일로 관리 (빌드 타임에 포함)
interface IndustryCategory {
  code: string;       // "A" ~ "U" (대분류 알파벳)
  name: string;       // "농업, 임업 및 어업"
  중분류: {
    code: string;     // "01" ~ "99"
    name: string;     // "작물 재배업"
    소분류: {
      code: string;   // "011" ~ "999"
      name: string;   // "곡물 및 기타 식량작물 재배업"
    }[];
  }[];
}
```

**구현 패턴:**
```typescript
// 3단 연동: 대분류 선택 → 중분류 필터 → 소분류 필터
const 중분류Options = useMemo(
  () => data.find(d => d.code === selected대분류)?.중분류 ?? [],
  [selected대분류]
);
const 소분류Options = useMemo(
  () => 중분류Options.find(m => m.code === selected중분류)?.소분류 ?? [],
  [selected중분류, 중분류Options]
);
```

**기존 코드 변경점:**
- `StoreBasicState.category: string` → `category: { 대분류: string; 중분류: string; 소분류: string }` 구조로 변경
- `StoreBasicSection.tsx`의 단일 `<Dropdown>` → `<CascadeDropdown>` 교체
- 산업분류 데이터를 `src/data/industryClassification.ts`에 정적 상수로 관리

**왜 라이브러리를 쓰지 않는가:**

| 라이브러리 | 버전 | 장점 | 거부 이유 |
|-----------|------|------|----------|
| rc-cascader | 3.34.x | 검증된 Ant Design 내부 컴포넌트 | Ant Design 스타일 종속, 번들 28KB+, 커스텀 다크 테마 적용 어려움 |
| PrimeReact CascadeSelect | 10.x | 가상화/WCAG 지원 | PrimeReact 전체 테마 시스템 도입 필요, 과도한 의존성 |
| react-dropdown-cascade | 1.x | 의존성 없음 | npm 주간 다운로드 200 미만, 유지보수 불확실, React 19 호환 미검증 |
| react-api-cascade-select | 1.x | React 18+ 지원, TypeScript | 2025년 등장한 신규 라이브러리, 생태계 검증 부족 |

### 신뢰도: HIGH

기존 `<select>` 기반 Dropdown 패턴을 확장하는 것이므로 기술적 위험이 낮다.
247개 항목은 네이티브 `<select>` 요소가 성능 문제 없이 처리하는 규모.

---

## 2. 접기/펼치기 카드 그루핑

### 추천: CSS Grid `grid-rows-[0fr]`/`grid-rows-[1fr]` 트랜지션

**이유:**
- JavaScript 기반 높이 계산 불필요 -- CSS가 `auto` 높이 전환을 처리
- Tailwind 4.2의 arbitrary values (`grid-rows-[0fr]`, `grid-rows-[1fr]`)로 바로 사용 가능
- `transition-all duration-300`과 결합하면 부드러운 애니메이션 구현
- 외부 라이브러리 (react-collapsible, MUI Collapse 등) 없이 가능

**구현 패턴:**
```tsx
// Tailwind 4.2 arbitrary values 활용
<div className={`grid transition-[grid-template-rows] duration-300 ease-out ${
  isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
}`}>
  <div className="overflow-hidden">
    {children}
  </div>
</div>
```

**브라우저 호환성:**
- `grid-template-rows: 0fr` 트랜지션은 Chrome 117+, Firefox 118+, Safari 17.2+ 지원
- 사내 앱 (100인 직원) 환경에서 최신 브라우저 사용 가정 -- 문제 없음
- `interpolate-size: allow-keywords`는 Chromium 전용이므로 사용하지 않음

**대안으로 고려했으나 기각한 것:**

| 기술 | 기각 이유 |
|------|----------|
| `<details>/<summary>` 네이티브 | 애니메이션이 Chromium 전용 (`::details-content`), React 상태 연동 복잡 |
| `max-height` 트랜지션 | 고정 max-height 값 필요, 콘텐츠 크기에 따라 애니메이션 속도 불일치 |
| react-collapsible | 외부 의존성 추가, 자체 스타일링 충돌 |
| MUI Collapse | Material UI 전체 도입 필요, 프로젝트 방침에 위배 |

### 그루핑 상태 관리

기존 Zustand `useFormStore`에 그루핑 상태 추가:

```typescript
// RecommendBatch에 소분류 카테고리 추가
interface RecommendBatch {
  id: string;
  names: { brandName: string; reasoning: string }[];
  basedOn: string[];
  createdAt: Date;
  categoryCode: string;  // 신규: 소분류 코드
  categoryName: string;  // 신규: 소분류 이름
}

// 그루핑 접기/펼치기 상태
interface GroupState {
  expandedGroups: Set<string>;  // 펼쳐진 그룹의 카테고리 코드
}
```

### 신뢰도: HIGH

CSS Grid `0fr`/`1fr` 트랜지션은 2024년부터 모든 주요 브라우저에서 지원되는 검증된 기법.
Tailwind 4.x arbitrary values로 클래스 기반 적용이 가능하다.

---

## 3. 모바일 반응형 레이아웃

### 추천: Tailwind 4.2 네이티브 반응형 유틸리티

**Tailwind 4.x 기본 breakpoint:**

| Breakpoint | 최소 너비 | 용도 |
|------------|----------|------|
| (없음) | 0px | 모바일 기본 |
| `sm` | 640px | 큰 모바일/소형 태블릿 |
| `md` | 768px | 태블릿 |
| `lg` | 1024px | 노트북/데스크톱 |
| `xl` | 1280px | 대형 데스크톱 |

**핵심 변경: `AppLayout.tsx`**

현재 코드:
```tsx
// 고정 7:3 그리드, 최소 너비 1024px
<div className="grid grid-cols-[7fr_3fr] min-h-screen min-w-[1024px]">
```

변경 후:
```tsx
// 모바일: 세로 스택, lg 이상: 7:3 그리드
<div className="flex flex-col lg:grid lg:grid-cols-[7fr_3fr] min-h-screen">
```

**반응형 전략:**

| 화면 | 레이아웃 | 동작 |
|------|---------|------|
| < 1024px (모바일/태블릿) | 세로 스택 (입력 위 + 추천 아래) | 스크롤로 양쪽 접근 |
| >= 1024px (데스크톱) | 기존 7:3 가로 분할 | 오른쪽 패널 sticky |

**패널별 변경:**

```tsx
// RecommendPanel: 데스크톱에서만 sticky
<aside className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto ...">

// InputPanel: 모바일에서 전체 너비
<main className="w-full lg:overflow-y-auto lg:h-screen ...">
```

**Tailwind 4.x에서 이미 제공하는 것:**
- `flex-col` / `lg:grid` -- 레이아웃 전환
- `hidden` / `lg:block` -- 요소 표시/숨김
- `w-full` / `lg:w-auto` -- 너비 제어
- `sticky` / `lg:sticky` -- 스크롤 동작 제어
- `max-md:` / `md:max-lg:` -- 범위 기반 타겟팅 (v4 신기능)

**Container Query 대안:**
Tailwind 4.x는 `@container` / `@md` 등 컨테이너 쿼리도 네이티브 지원하지만,
이 프로젝트에서는 불필요하다. 전체 레이아웃 전환이므로 viewport 기반 breakpoint가 적합.

### `min-w-[1024px]` 제거 필수

현재 `AppLayout`에 `min-w-[1024px]`이 하드코딩되어 있다.
이것이 모바일 반응형의 최대 장애물 -- 이 줄을 제거하지 않으면 모바일에서 가로 스크롤이 발생한다.

### 신뢰도: HIGH

Tailwind 4.x의 반응형 유틸리티는 가장 성숙한 기능이다.
추가 라이브러리 없이 클래스만으로 완전한 반응형 구현이 가능하다.

---

## 기존 스택 유지 (변경 없음)

| 기술 | 현재 버전 | 변경 | 이유 |
|------|----------|------|------|
| React | 19.2.4 | 없음 | v1.1 기능에 React 19 이상 기능 불필요 |
| Vite | 8.0.1 | 없음 | 빌드 설정 변경 없음 |
| TypeScript | 5.9.3 | 없음 | 타입 추가만 필요 |
| Tailwind CSS | 4.2.2 | 없음 | 반응형/arbitrary values 모두 지원 |
| @tailwindcss/vite | 4.2.2 | 없음 | 플러그인 설정 변경 없음 |
| Zustand | 5.0.12 | 없음 | 스토어 구조 확장만 필요 |
| Lucide React | 1.7.0 | 없음 | ChevronDown, ChevronRight 등 이미 포함 |
| @google/genai | 1.47.0 | 없음 | AI 추천 로직 변경 없음 |

---

## 새로 추가할 것: 없음

v1.1에 **새 npm 패키지를 추가하지 않는다.**

## 새로 추가할 파일

| 파일 | 역할 |
|------|------|
| `src/data/industryClassification.ts` | 한국표준산업분류 데이터 (대/중/소분류 247개) |
| `src/components/ui/CascadeDropdown.tsx` | 3단 계층형 드롭다운 컴포넌트 |
| `src/components/ui/CollapsibleGroup.tsx` | 접기/펼치기 그룹 래퍼 컴포넌트 |
| `src/components/recommend/RecommendGroup.tsx` | 소분류별 추천 카드 그룹 |

---

## 사용하지 말 것 (v1.1 관련)

| 기술 | 이유 | 대신 사용 |
|------|------|----------|
| rc-cascader / Ant Design Cascader | 번들 크기 28KB+, 스타일 충돌, 과도한 의존성 | 커스텀 CascadeDropdown |
| PrimeReact CascadeSelect | 전체 테마 시스템 도입 필요 | 커스텀 CascadeDropdown |
| react-collapsible | 외부 의존성, 자체 스타일링 | CSS Grid 0fr/1fr 트랜지션 |
| Headless UI / Radix UI | Disclosure/Collapsible 하나를 위해 라이브러리 도입은 과도 | 직접 구현 |
| Framer Motion | 접기/펼치기 하나를 위해 46KB+ 번들 추가는 비효율 | CSS 트랜지션 |
| Bootstrap / Tailwind UI | 프로젝트 디자인 시스템과 충돌 | 커스텀 Tailwind 클래스 |
| CSS `interpolate-size` | Chromium 전용, Safari/Firefox 미지원 | CSS Grid 0fr/1fr |

---

## 버전 호환성

| 패키지 | 호환 대상 | 비고 |
|--------|----------|------|
| Tailwind CSS 4.2.2 | `grid-rows-[0fr]` arbitrary value | v4.0부터 arbitrary values 완전 지원 |
| Tailwind CSS 4.2.2 | `md:`, `lg:` 반응형 | mobile-first breakpoint, v2부터 있던 핵심 기능 |
| Tailwind CSS 4.2.2 | `transition-[grid-template-rows]` | arbitrary transition property 지원 |
| React 19.2.4 | `useMemo`, `useState` | 계층형 드롭다운 필터링에 사용, 안정 API |
| Zustand 5.0.12 | `Set<string>` 상태 | expandedGroups 관리, immutable 업데이트 필요 |

---

## CSS 트릭 참고: Grid 0fr/1fr 트랜지션

Tailwind 4.x에서 사용 가능한 접기/펼치기 패턴:

```html
<!-- 펼침 상태 -->
<div class="grid grid-rows-[1fr] transition-[grid-template-rows] duration-300">
  <div class="overflow-hidden">콘텐츠</div>
</div>

<!-- 접힘 상태 -->
<div class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300">
  <div class="overflow-hidden">콘텐츠</div>
</div>
```

**작동 원리:**
1. 외부 `div`에 `display: grid` + `grid-template-rows` 설정
2. 내부 `div`에 `overflow: hidden` -- 콘텐츠가 넘치지 않도록
3. `grid-template-rows`를 `0fr` (높이 0) ↔ `1fr` (자연 높이)로 전환
4. `transition`이 부드러운 애니메이션을 처리
5. 고정 높이 값이 필요 없음 -- CSS Grid가 `auto` 높이를 자동 계산

**브라우저 지원:** Chrome 117+, Firefox 118+, Safari 17.2+ (2024년 이후 모든 주요 브라우저)

---

## Sources

- [Tailwind CSS v4 Responsive Design](https://tailwindcss.com/docs/responsive-design) -- breakpoint 체계, mobile-first 접근법 확인 (HIGH confidence)
- [Tailwind CSS v4 Grid Template Rows](https://tailwindcss.com/docs/grid-template-rows) -- `grid-rows-[0fr]` arbitrary value 지원 확인 (HIGH confidence)
- [CSS Grid Auto Height Transitions](https://css-tricks.com/css-grid-can-do-auto-height-transitions/) -- 0fr/1fr 트랜지션 기법 (HIGH confidence)
- [Animated CSS Accordions](https://www.stefanjudis.com/snippets/how-to-animate-height-with-css-grid/) -- CSS Grid 접기/펼치기 구현 패턴 (HIGH confidence)
- [Tailwind CSS v4.0 Blog Post](https://tailwindcss.com/blog/tailwindcss-v4) -- v4 변경사항 확인 (HIGH confidence)
- [rc-cascader npm](https://www.npmjs.com/package/rc-cascader) -- 계층형 드롭다운 라이브러리 평가 (MEDIUM confidence)
- [한국표준산업분류 KSIC GitHub](https://github.com/FinanceData/KSIC) -- 산업분류 데이터 구조 참조 (MEDIUM confidence)
- [CSS interpolate-size Can I Use](https://caniuse.com/mdn-css_properties_interpolate-size) -- 브라우저 호환성 확인 (HIGH confidence)

---
*Stack research for: v1.1 UX 개선 (계층형 드롭다운, 카드 그루핑, 모바일 반응형)*
*Researched: 2026-04-01*
