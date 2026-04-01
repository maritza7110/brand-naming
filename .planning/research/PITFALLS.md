# Pitfalls Research: v1.1 UX 개선

**Domain:** 계층형 드롭다운, 접기/펼치기 그루핑, 모바일 반응형 전환
**Researched:** 2026-04-01
**Confidence:** HIGH (코드베이스 직접 분석 + 공식 문서 + 커뮤니티 사례 교차 검증)

---

## Critical Pitfalls

### Pitfall 1: 계층형 드롭다운 — 하위 선택값 초기화 누락

**What goes wrong:**
대분류를 변경하면 중분류/소분류 옵션이 바뀌지만, 이전에 선택한 중분류/소분류 값이 그대로 남아 있음. 존재하지 않는 조합(예: "음식점" 대분류 + "의류 소매" 소분류)이 상태에 저장되고, 이 잘못된 값이 Gemini API 프롬프트에 전달되어 엉뚱한 추천 결과가 나옴.

**Why it happens:**
현재 `useFormStore`에서 `category`는 단일 string 필드. 3단계 계층으로 바꿀 때 각 레벨의 onChange에서 하위 레벨을 리셋하는 로직을 빠뜨리기 쉬움. 특히 React의 비동기 상태 업데이트 때문에 대분류 변경 → 중분류 리셋 → 소분류 리셋이 한 렌더 사이클에서 일어나지 않을 수 있음.

**How to avoid:**
- 대분류 onChange에서 `set({ categoryMajor: value, categoryMedium: '', categorySmall: '' })` 처럼 **한 번의 set 호출**로 3개 필드를 동시에 업데이트
- Zustand의 `set`은 shallow merge이므로 한 번에 여러 필드를 업데이트하면 단일 렌더 사이클에서 처리됨
- 중분류 onChange에서도 `set({ categoryMedium: value, categorySmall: '' })` 패턴 동일 적용
- **절대로** 개별 `updateStoreBasic('categoryMajor', v)` → `updateStoreBasic('categoryMedium', '')` → `updateStoreBasic('categorySmall', '')` 3연속 호출 금지 (3번 렌더 + 중간 상태 노출)

**Warning signs:**
- 대분류 변경 후 소분류에 이전 값이 보임
- AI 추천에 "해당 업종과 맞지 않는" 결과가 섞임
- 콘솔에 "option value not found" 류 경고

**Phase to address:** 계층형 드롭다운 구현 단계

---

### Pitfall 2: localStorage 스키마 변경 — 기존 사용자 데이터 파손

**What goes wrong:**
현재 `useFormStore`의 persist 설정:
```typescript
partialize: (state) => ({ batches: state.batches })
```
`batches` 안의 `RecommendBatch` 타입에는 `basedOn: string[]`이 있는데, 이전에 저장된 배치의 `basedOn`에는 `"음식점/레스토랑"` 같은 단일 카테고리 값이 들어있음. 소분류 그루핑을 추가하면 배치에 `categorySmall` 같은 새 필드가 필요한데, 기존 데이터에는 이 필드가 없어서 그루핑 로직이 `undefined`에서 깨짐.

**Why it happens:**
Zustand persist는 기본적으로 `version`이 없으면 마이그레이션을 실행하지 않음. 현재 코드에 `version` 옵션이 없고, `merge` 함수는 Date 역직렬화만 처리하고 있음. 새 스키마로 코드를 배포하면 기존 localStorage의 구조가 새 코드와 맞지 않아 런타임 에러가 발생.

**How to avoid:**
```typescript
persist(
  (set) => ({ /* ... */ }),
  {
    name: 'brand-naming-data',
    version: 2,  // v1.0은 version 미지정 (=0), v1.1은 2
    partialize: (state) => ({ batches: state.batches }),
    migrate: (persisted, version) => {
      if (version === 0) {
        // v1.0 → v1.1: 기존 배치에 categorySmall 필드 추가
        const p = persisted as { batches?: any[] };
        return {
          batches: (p?.batches ?? []).map(b => ({
            ...b,
            categorySmall: b.categorySmall ?? '미분류',
          })),
        };
      }
      return persisted;
    },
    merge: (persisted, current) => {
      // Date 역직렬화 + 새 필드 기본값 보장
      const p = persisted as { batches?: RecommendBatch[] } | undefined;
      const restoredBatches = (p?.batches ?? []).map((b) => ({
        ...b,
        createdAt: new Date(b.createdAt),
        categorySmall: b.categorySmall ?? '미분류',
      }));
      return { ...current, batches: restoredBatches };
    },
  }
)
```
- `version` 번호를 명시적으로 추가
- `migrate` 함수에서 이전 버전 데이터를 새 스키마로 변환
- `merge` 함수에서도 방어적 기본값 설정 (migrate를 거치지 않는 엣지 케이스 대비)

**Warning signs:**
- 배포 후 "TypeError: Cannot read property of undefined" 에러 리포트
- 추천 카드가 갑자기 사라짐 (파싱 실패로 빈 배열 반환)
- 그루핑 패널에 "미분류" 그룹에 모든 카드가 몰림

**Phase to address:** 데이터 모델 변경 단계 (드롭다운 UI 구현 전에 먼저)

---

### Pitfall 3: min-w-[1024px] 하드코딩 — 모바일 진입 자체가 불가

**What goes wrong:**
현재 `AppLayout.tsx`:
```tsx
<div className="grid grid-cols-[7fr_3fr] min-h-screen min-w-[1024px]">
```
`min-w-[1024px]`이 있어서 모바일 브라우저에서 가로 스크롤이 생기고, 반응형 breakpoint를 아무리 추가해도 레이아웃이 좁아지지 않음. 이 한 줄을 제거하지 않으면 반응형 전환이 **작동하지 않음**.

**Why it happens:**
데스크톱 전용으로 만들 때 "너무 좁으면 깨지니까" 최소 너비를 걸어둔 것. 반응형 전환 시 이런 하드코딩 제약을 빠뜨리기 쉬움 — CSS grid 정의는 바꿨는데 min-width는 그대로 남겨두는 실수.

**How to avoid:**
- `min-w-[1024px]` 제거하고, 대신 breakpoint 기반 grid 전환:
  ```tsx
  <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] min-h-screen">
  ```
- Tailwind의 mobile-first 원칙: 기본값이 모바일(1 column), `lg:` 이상에서 7:3 분할
- 모든 `min-w-*`, `w-[fixed]` 값을 코드베이스에서 검색하여 반응형 전환 대상 목록 작성

**Warning signs:**
- 모바일 시뮬레이터에서 가로 스크롤 발생
- 반응형 코드를 추가했는데 모바일에서 아무 변화 없음
- Chrome DevTools에서 viewport 줄여도 레이아웃이 안 줄어듦

**Phase to address:** 모바일 반응형 단계 (가장 먼저 이 제약 제거)

---

### Pitfall 4: sticky 사이드바 → 모바일에서 콘텐츠 가림/겹침

**What goes wrong:**
현재 `RecommendPanel.tsx`:
```tsx
<aside className="sticky top-0 h-screen overflow-y-auto ...">
```
모바일 세로 스택에서 이 `sticky top-0 h-screen`이 남아 있으면, 추천 패널이 화면 전체를 차지하며 입력 패널 위에 고정되어 스크롤 불가 상태가 됨. 또는 `h-screen`이 모바일에서 주소창/하단 네비게이션에 의해 실제 뷰포트보다 커져서 콘텐츠가 잘림.

**Why it happens:**
`sticky` + `h-screen` 조합은 데스크톱 사이드바에서는 완벽하게 동작하지만, 모바일의 세로 스택에서는 의미가 다름. `position: sticky`는 부모 scroll container 기준이라 세로 레이아웃에서는 "화면에 고정"이 아니라 "스크롤 중 잠깐 멈춤"이 됨 — 의도한 UX가 아님.

**How to avoid:**
- 모바일에서는 sticky 제거, 일반 flow 요소로 전환:
  ```tsx
  <aside className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto ...">
  ```
- `h-screen` 대신 `h-dvh` (dynamic viewport height) 사용 고려 — 모바일 브라우저 주소창 변동에 대응
- 모바일에서 추천 패널은 입력 폼 아래에 자연스럽게 흐르도록 `min-h-0` 또는 `max-h-[50vh]` + overflow-y-auto

**Warning signs:**
- 모바일에서 입력 폼이 보이지 않음
- 추천 패널 아래쪽이 잘림 (모바일 브라우저 크롬에 가려짐)
- 스크롤이 두 영역에서 충돌 (nested scroll)

**Phase to address:** 모바일 반응형 단계

---

### Pitfall 5: 접기/펼치기 애니메이션 — height:auto 전환 불가

**What goes wrong:**
CSS `transition`은 `height: auto`를 지원하지 않음. 그루핑된 카드 영역을 접을 때 `height: 0 → auto`로 전환하면 애니메이션 없이 뚝 끊기는 현상이 발생. `max-height` 해킹으로 우회하면 카드 수에 따라 애니메이션 타이밍이 일정하지 않음(카드 2개일 때와 20개일 때 속도가 완전히 다름).

**Why it happens:**
CSS는 `auto`에서 숫자 값으로의 보간(interpolation)을 지원하지 않음. 이것은 CSS의 근본적 한계로, React 개발자가 흔히 간과함. 2025년 Chrome에 `interpolate-size: allow-keywords` 속성이 추가되었지만 Safari/Firefox 지원이 불완전.

**How to avoid:**
- **CSS Grid 기법 (추천)**: `grid-template-rows: 0fr → 1fr` 전환. 크로스 브라우저 지원이 가장 좋고 외부 라이브러리 불필요:
  ```css
  .collapsible {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 300ms ease;
  }
  .collapsible.open {
    grid-template-rows: 1fr;
  }
  .collapsible > div {
    overflow: hidden;
  }
  ```
- 또는 `react-collapsed` 라이브러리 (JS로 실제 높이 측정 후 transition) — 단, 의존성 추가
- `max-height` 해킹은 **사용하지 말 것** — 타이밍 불일치, easing 왜곡

**Warning signs:**
- 접기/펼치기가 애니메이션 없이 순간 전환
- `max-height: 9999px` 같은 매직 넘버가 코드에 등장
- 카드 수에 따라 애니메이션 속도가 들쭉날쭉

**Phase to address:** 추천 카드 그루핑 단계

---

### Pitfall 6: 247개 소분류 데이터 — 하드코딩 vs 구조화

**What goes wrong:**
현재 `CATEGORY_OPTIONS`가 StoreBasicSection.tsx에 14개 항목 배열로 하드코딩되어 있음. 247개 소분류를 같은 방식으로 넣으면:
1. 파일이 500줄 제한을 초과 (대분류 10개 × 중분류 N개 × 소분류 247개의 매핑 데이터)
2. 대분류→중분류→소분류 매핑 관계가 코드에 섞여 유지보수 불가
3. 한 곳에서 수정하면 매핑이 깨질 위험

**Why it happens:**
기존 14개 옵션이 인라인 배열로 잘 동작했으므로 같은 패턴을 확장하려는 관성. 하지만 247개는 **별도 데이터 파일**이 필요한 규모.

**How to avoid:**
- `src/data/industryClassification.ts`에 계층 구조 데이터를 분리:
  ```typescript
  export interface IndustryCategory {
    major: string;        // 대분류
    medium: string;       // 중분류
    small: string;        // 소분류
  }
  export const INDUSTRY_TREE: Record<string, Record<string, string[]>> = {
    '음식점업': {
      '한식': ['한식 일반', '면류 전문', '육류 전문', ...],
      '중식': ['중국 요리', '분식', ...],
    },
    // ...
  };
  ```
- 유틸리티 함수로 필터링: `getMediumCategories(major)`, `getSmallCategories(major, medium)`
- 데이터 파일은 500줄 제한 예외로 두거나, 대분류별로 파일 분리

**Warning signs:**
- 컴포넌트 파일에 100줄 이상의 배열 리터럴
- 카테고리 수정 시 여러 파일을 동시에 바꿔야 함
- import 경로가 순환 참조

**Phase to address:** 데이터 모델 설계 단계 (UI 구현 전)

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| 3개 native `<select>`로 계층형 구현 | 빠른 구현, 의존성 없음 | 모바일 UX 열악(iOS select 스크롤이 247개에서 느림), 검색 불가 | v1.1 MVP까지만. 검색형 드롭다운은 v1.2에서 |
| 그루핑을 배치 배열 순회로 매번 계산 | 상태 추가 없음 | 배치 100개 이상일 때 매 렌더마다 O(n) 재계산 | 100인 사내 앱이면 허용. `useMemo`로 캐싱은 최소한 필요 |
| `max-height` 애니메이션 | 한 줄로 구현 가능 | 타이밍 불일치, easing 왜곡 | **사용 금지** — CSS Grid 방식이 코드량 비슷하면서 정확함 |
| 모바일에서 추천 패널 숨김 (탭 전환) | 구현 단순 | 핵심 가치인 "즉시 결과" 경험이 깨짐 | **사용 금지** — 세로 스택이 정답 |
| localStorage 마이그레이션 없이 배포 | 개발 빠름 | 기존 사용자 데이터 손실, 에러 리포트 폭주 | **절대 불가** |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Zustand persist + 스키마 변경 | `version` 없이 필드 추가 → 기존 데이터 무시됨 | `version: 2` + `migrate` 함수로 기존 데이터 변환 |
| Gemini API + 소분류 카테고리 | 소분류명("한식 일반")만 보내면 AI가 맥락 이해 못함 | "대분류 > 중분류 > 소분류" 전체 경로를 프롬프트에 포함 |
| Tailwind CSS 4 breakpoint + 기존 하드코딩 | responsive class 추가했지만 `min-w-[1024px]`이 여전히 존재 | 모든 고정 width/min-width를 반응형 variant로 전환 |
| `h-screen` + 모바일 브라우저 | 모바일 주소창 때문에 `100vh`가 실제 뷰포트보다 큼 | `h-dvh` (dynamic viewport height) 사용 또는 `lg:h-screen` |
| 카드 그루핑 + 업종 변경 이벤트 | 드롭다운 onChange에서 그루핑 상태를 리셋하지 않음 | 업종 변경 시 `collapseGroups` action을 같은 set 호출에서 실행 |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| 247개 `<option>` DOM 렌더링 | 소분류 드롭다운 열릴 때 지연 | native `<select>`는 247개도 문제없음. 커스텀 dropdown일 때만 가상화 필요 | 커스텀 UI에서 500개 이상 |
| 그루핑 필터링을 매 렌더마다 실행 | 입력할 때마다 추천 패널이 깜빡임 | `useMemo(() => groupBatches(batches, category), [batches, category])` | 배치 50개 이상에서 체감 |
| 모바일 세로 스택에서 입력+추천 동시 렌더 | 초기 로딩 느림, 스크롤 버벅 | 추천 패널에 `Intersection Observer` 기반 lazy render 또는 CSS `content-visibility: auto` | 카드 30개 이상 |
| 접기/펼치기 트리거마다 전체 리스트 리렌더 | 한 그룹 접을 때 다른 그룹 카드도 깜빡 | collapse 상태를 그룹별 독립 관리, React.memo로 카드 컴포넌트 래핑 | 그룹 5개 이상 |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| 3단계 드롭다운이 한 줄에 나란히 배치 | 모바일에서 각 드롭다운이 너무 좁아 텍스트 잘림 | 모바일: 세로 스택, 데스크톱: 가로 배치. 대분류 선택 전 중/소분류는 disabled 상태로 시각적 힌트 |
| 소분류 선택 전에 중분류 드롭다운이 활성화 | 빈 목록이 보여서 혼란 | 상위 선택 완료 전 하위 드롭다운 disabled + "대분류를 먼저 선택하세요" placeholder |
| 업종 변경 시 이전 추천이 갑자기 접힘 | 사용자가 "내 추천이 사라졌다" 오해 | 접힘 애니메이션 + 접힌 그룹 헤더에 카드 수 표시 ("카페/베이커리 (3건)") |
| 모바일에서 추천 결과를 보려면 긴 스크롤 | 입력 폼이 길어서 추천 패널까지 스크롤 피로 | 플로팅 "추천 보기" 버튼으로 추천 영역으로 smooth scroll, 또는 추천 카드 수 뱃지 |
| 그루핑된 카드 전체 접기 후 새 추천 생성 | 새 추천이 접힌 그룹 안에 들어가서 사용자가 못 봄 | 새 추천이 추가된 그룹은 자동 펼침 + 스크롤 이동 |

---

## "Looks Done But Isn't" Checklist

- [ ] **계층형 드롭다운:** 대분류 변경 시 중/소분류 값이 실제로 리셋되는지 — Zustand devtools에서 state 확인
- [ ] **계층형 드롭다운:** 소분류 "미선택" 상태에서 추천 버튼이 비활성화 되는지 — 빈 소분류로 AI 호출 방지
- [ ] **그루핑:** 그루핑 키가 없는 기존 배치(v1.0 데이터)가 "미분류" 그룹에 정상 표시되는지
- [ ] **그루핑:** 접기 상태가 브라우저 새로고침 후에도 유지되는지 (또는 의도적으로 초기화인지 결정)
- [ ] **모바일:** 가로/세로 모드 전환 시 레이아웃이 깨지지 않는지
- [ ] **모바일:** iOS Safari에서 100vh 문제로 콘텐츠 잘림 없는지
- [ ] **모바일:** 모바일 키보드가 올라올 때 입력 필드가 가려지지 않는지
- [ ] **모바일:** native `<select>` 드롭다운이 모바일에서 OS 기본 picker로 열리는지 (커스텀 드롭다운은 터치 UX 열화)
- [ ] **데이터:** localStorage v1.0 → v1.1 마이그레이션이 실제로 동작하는지 (이전 데이터 수동 세팅 후 테스트)
- [ ] **접기 애니메이션:** CSS Grid `0fr → 1fr` 전환이 Safari에서도 부드러운지

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| 하위 선택값 초기화 누락 | LOW | Zustand set 호출을 단일 호출로 리팩터링 (1시간) |
| localStorage 스키마 파손 | MEDIUM | migrate 함수 추가 + 기존 사용자에게 "데이터 복원 중" 토스트. 이미 깨진 데이터는 try/catch로 잡아서 기본값 대입 |
| min-w-[1024px] 남겨둠 | LOW | 해당 클래스 제거 + breakpoint 추가 (30분). 단, 데스크톱 좁은 창에서 레이아웃 확인 필요 |
| sticky 사이드바 모바일 겹침 | LOW | `lg:` prefix 추가로 조건부 sticky (1시간) |
| height:auto 애니메이션 실패 | MEDIUM | max-height 해킹 → CSS Grid 방식으로 리팩터링 (접기/펼치기 컴포넌트 재작성 2-3시간) |
| 247개 데이터 하드코딩 | MEDIUM | 데이터 파일 분리 + import 경로 수정 (반나절). 이미 참조하는 곳이 많으면 더 오래 걸림 |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| localStorage 스키마 변경 | Phase 1 (데이터 모델) | v1.0 localStorage로 v1.1 코드 실행 시 에러 없음 |
| 247개 데이터 구조화 | Phase 1 (데이터 모델) | 데이터 파일 단독 import 가능, 각 파일 500줄 이하 |
| 하위 선택값 초기화 | Phase 2 (계층형 드롭다운) | 대분류 변경 → DevTools에서 중/소분류 빈 값 확인 |
| 접기 애니메이션 | Phase 3 (그루핑) | 접기/펼치기 시 부드러운 300ms 전환, Safari 포함 |
| 업종 변경 시 자동 접힘 | Phase 3 (그루핑) | 드롭다운 변경 → 이전 업종 그룹 자동 접힘 확인 |
| min-w-[1024px] 제거 | Phase 4 (반응형) — 가장 먼저 | Chrome 360px viewport에서 가로 스크롤 없음 |
| sticky 사이드바 전환 | Phase 4 (반응형) | 모바일 시뮬레이터에서 두 패널 세로 스택 정상 |
| 모바일 viewport height | Phase 4 (반응형) | iOS Safari 실기기에서 콘텐츠 잘림 없음 |

---

## Sources

- Zustand persist migration: [Zustand persist docs](https://zustand.docs.pmnd.rs/reference/integrations/persisting-store-data), [Discussion #1717](https://github.com/pmndrs/zustand/discussions/1717), [DEV Community migration guide](https://dev.to/diballesteros/how-to-migrate-zustand-local-storage-store-to-a-new-version-njp)
- CSS height:auto transition: [CSS-Tricks](https://css-tricks.com/using-css-transitions-auto-dimensions/), [Josh Comeau interpolate-size](https://www.joshwcomeau.com/snippets/html/interpolate-size/)
- Tailwind responsive: [Tailwind CSS responsive design docs](https://tailwindcss.com/docs/responsive-design)
- Sticky sidebar pitfalls: [Polypane position:sticky guide](https://polypane.app/blog/getting-stuck-all-the-ways-position-sticky-can-fail/), [Medium handling sticky in responsive](https://medium.com/@Adekola_Olawale/handling-fixed-and-sticky-elements-in-responsive-layouts-7a79a70a014b)
- Cascading dropdown patterns: [freeCodeCamp dependent dropdowns](https://www.freecodecamp.org/news/how-to-build-dependent-dropdowns-in-react/)
- Korean Standard Industrial Classification: [classification.codes KSIC](https://classification.codes/classifications/industry/ksic)
- React select performance: [Syncfusion virtualization blog](https://www.syncfusion.com/blogs/post/virtualization-in-react-multiselect-dropdown)

---
*Pitfalls research for: v1.1 UX 개선 (계층형 드롭다운, 그루핑, 모바일 반응형)*
*Researched: 2026-04-01*
