# Project Research Summary

**Project:** 브랜드 네이밍 앱 v1.1 UX 개선
**Domain:** AI 브랜드 네이밍 웹앱 — 계층형 드롭다운, 카드 그루핑, 모바일 반응형
**Researched:** 2026-04-01
**Confidence:** HIGH

## Executive Summary

v1.1은 신규 앱이 아닌 **검증된 v1.0 코드베이스의 UX 개선**이다. 기존 스택(React 19, Vite, TypeScript, Tailwind CSS 4.2, Zustand, Gemini API)은 변경 없이 그대로 유지한다. 새 npm 패키지를 단 하나도 추가하지 않아도 세 가지 기능을 모두 구현할 수 있다는 것이 핵심 결론이다. 계층형 드롭다운은 네이티브 `<select>` 3개 연쇄로, 접기/펼치기 애니메이션은 CSS Grid `0fr/1fr` 트랜지션으로, 모바일 반응형은 Tailwind의 `lg:` breakpoint 클래스로 해결한다.

세 기능 간에 명확한 의존 관계가 있다. 업종 데이터 구조(`IndustrySelection` 타입, 247개 분류 데이터)가 모든 기능의 기반이 된다. 계층형 드롭다운이 완성되어야 추천 배치에 `category` 값이 태깅되고, 그래야 카드 그루핑이 가능하다. 모바일 반응형만 독립적으로 진행할 수 있지만, 새 컴포넌트가 모두 만들어진 후 마지막에 반응형 클래스를 일괄 적용하는 것이 효율적이다.

가장 큰 리스크는 **localStorage 스키마 변경**이다. v1.0에서 `category: string`으로 저장된 기존 데이터가 v1.1의 `category: IndustrySelection` 객체 스키마와 충돌한다. Zustand persist의 `version` 번호와 `migrate` 함수를 데이터 모델 변경 단계에서 반드시 처리해야 한다. 이것을 건너뛰면 기존 사용자의 추천 이력이 파손된다.

---

## Key Findings

### Recommended Stack

v1.0 스택 전체를 그대로 사용한다. 추가 패키지 없음.

**핵심 기술 (변경 없음):**
- **React 19.2.4 + Vite 8.0.1**: 기존 앱과 동일, 변경 불필요
- **TypeScript 5.9.3**: 새 타입 정의 추가만 필요 (`IndustrySelection`, `RecommendBatch.category`)
- **Tailwind CSS 4.2.2**: `lg:` breakpoint, `grid-rows-[0fr]` arbitrary value, `transition-[grid-template-rows]` 모두 지원 확인됨
- **Zustand 5.0.12**: `collapsedGroups: string[]` 상태 추가, persist 스키마 버전 관리

**새로 추가할 파일 (패키지 아님):**
- `src/data/industryData.ts` — 247개 소분류 계층 데이터 (정적 TS 상수)
- `src/components/ui/IndustryDropdown.tsx` — 3단 cascading 드롭다운 (~80줄)
- `src/components/recommend/RecommendGroup.tsx` — 그룹 헤더 + 접기/펼치기 (~40줄)
- `src/utils/groupBatches.ts` — 배치 그루핑 유틸리티 (~15줄)

**사용하지 않을 것 (명확한 거부 근거):**
- rc-cascader / PrimeReact CascadeSelect: 번들 크기 28KB+, 기존 다크 테마와 스타일 충돌
- Framer Motion: 46KB+ 번들, CSS Grid 트랜지션으로 대체 가능
- Headless UI / Radix Collapsible: 접기/펼치기 하나를 위해 라이브러리 도입은 과도
- `interpolate-size: allow-keywords`: Chromium 전용, Safari/Firefox 미지원

---

### Expected Features

**v1.1 필수 (table stakes):**
- 247개 산업분류 데이터 파일 (모든 기능의 기반)
- 대분류 > 중분류 > 소분류 3단계 연쇄 드롭다운
- 상위 선택 변경 시 하위 값 자동 리셋
- 소분류별 추천 카드 그루핑 + 그룹 헤더
- 접기/펼치기 토글 (업종 변경 시 이전 그룹 자동 접힘)
- `lg` (1024px) 기준 모바일/데스크톱 레이아웃 전환
- RecommendPanel 조건부 sticky (데스크톱만)

**v1.1 여유 시 추가 (differentiators):**
- 아코디언 CSS 애니메이션 (`grid-template-rows: 0fr → 1fr`, 300ms)
- 그룹 헤더 카드 개수 뱃지 ("카페/베이커리 (3건)")
- 모바일 추천 패널 이동 FAB (세로 스택 scrolling 편의)

**v1.2 이후 (defer):**
- 소분류 검색/타이프어헤드 (사용자 피드백 확인 후)
- 드롭다운 최근 선택 기억 (localStorage 3개)
- 업종 변경 히스토리 타임라인 (그루핑 자체가 이미 히스토리 역할)

**만들지 말 것 (anti-features):**
- 업종 자유입력 (그루핑 key 없어짐, 프롬프트 일관성 깨짐)
- 커스텀 드롭다운 라이브러리 도입
- 무한 중첩 그룹 (소분류 단일 레벨로 충분)
- 모바일 Bottom Sheet 추천 패널 (과도한 UX 투자)

---

### Architecture Approach

v1.1은 기존 아키텍처를 **최소한으로 확장**한다. 새 컴포넌트 4개, 기존 컴포넌트/파일 8개 수정이 전부다. 핵심 원칙은 데이터와 파생 상태의 분리: `batches` flat 배열은 원본 데이터로 유지하고, 그루핑은 `useMemo`로 렌더링 시 계산한다. `collapsedGroups`만 Zustand에 추가하는데, "업종 변경 시 자동 접힘" 요구사항이 InputPanel과 RecommendPanel 간 크로스-컴포넌트 상태 변경을 요구하기 때문이다.

**주요 컴포넌트와 책임:**
1. `IndustryDropdown.tsx` (신규) — 3단 계층형 업종 선택, 네이티브 `<select>` 3개, `useMemo` 기반 옵션 파생
2. `RecommendGroup.tsx` (신규) — 소분류별 카드 그룹 헤더 + 접기/펼치기 + 카드 목록
3. `useFormStore.ts` (수정) — `IndustrySelection` 타입, `collapsedGroups: string[]`, `toggleGroupCollapsed`, `collapseGroup` 액션, 업종 변경 시 자동 접힘 로직
4. `AppLayout.tsx` (수정) — `min-w-[1024px]` 제거, `flex flex-col lg:grid lg:grid-cols-[7fr_3fr]`
5. `industryData.ts` (신규) — 247개 소분류 계층 정적 데이터 (Zustand 스토어에 넣지 않음)

**핵심 데이터 흐름:**
업종 선택 → `updateStoreBasic('category', IndustrySelection)` → 업종 변경 감지 → 이전 그룹 자동 접힘 + 새 배치에 `category: string` 태깅 → `groupBatchesByCategory(batches)` → `RecommendGroup` 렌더링

---

### Critical Pitfalls

1. **localStorage 스키마 변경** — `category: string` → `IndustrySelection` 객체 변환 시 기존 데이터 파손. 방지: `persist version: 2` + `migrate` 함수 추가, `merge`에서 방어적 기본값 설정. **Phase 1에서 반드시 처리.**

2. **하위 선택값 초기화 누락** — 대분류 변경 시 중/소분류 이전 값이 남아 잘못된 업종 조합이 AI 프롬프트에 전달됨. 방지: 대분류 `onChange`에서 `set({ large: v, middle: '', small: '' })` 단일 호출로 3필드 동시 업데이트. 절대 3번 연속 `updateStoreBasic` 호출 금지.

3. **`min-w-[1024px]` 미제거** — 이 한 줄이 남아있으면 반응형 클래스를 아무리 추가해도 모바일에서 가로 스크롤이 발생하고 레이아웃이 전환되지 않음. 방지: 모바일 반응형 단계 시작 시 **가장 먼저** 제거.

4. **sticky 사이드바 모바일 겹침** — `sticky top-0 h-screen`이 모바일 세로 스택에서 콘텐츠를 덮거나 스크롤이 잠김. 방지: `lg:sticky lg:top-0 lg:h-screen`으로 조건부 sticky.

5. **접기/펼치기 `height: auto` 전환 불가** — CSS `transition`은 `height: auto`를 지원하지 않음. `max-height` 해킹은 타이밍 불일치. 방지: CSS Grid `grid-template-rows: 0fr → 1fr` 트랜지션 사용.

6. **247개 데이터 컴포넌트 하드코딩** — 기존 14개 옵션처럼 컴포넌트 파일에 인라인하면 500줄 제한 초과 + 유지보수 불가. 방지: `src/data/industryData.ts` 별도 파일로 분리.

---

## Implications for Roadmap

세 기능의 의존 관계가 명확하여 자연스러운 Phase 구조가 도출된다. Architecture 연구에서 "Types first" 원칙이 명시적으로 권장됨.

### Phase 1: 타입 + 데이터 기반
**Rationale:** `IndustrySelection` 타입과 247개 데이터가 없으면 다른 두 기능 모두 시작 불가. localStorage 마이그레이션도 이 단계에서 처리해야 기존 사용자 데이터를 보호할 수 있다.
**Delivers:** 타입 정의, 산업분류 정적 데이터, Zustand 스토어 확장, Gemini 프롬프트 업종 경로 포함
**Addresses:** 데이터 구조(FEATURES.md P1), localStorage 스키마 변경 피해 예방
**Avoids:** Pitfall 1 (localStorage 파손), Pitfall 6 (데이터 하드코딩)
**Files:** `form.ts`, `industryData.ts`, `useFormStore.ts`, `gemini.ts`

### Phase 2: 계층형 드롭다운
**Rationale:** Phase 1 타입이 확정된 후 UI 구현 가능. 카드 그루핑보다 먼저 — 드롭다운이 동작해야 새로 생성되는 배치에 `category` 값이 태깅된다.
**Delivers:** `IndustryDropdown` 컴포넌트, `StoreBasicSection` 교체
**Uses:** `IndustrySelection` 타입, `INDUSTRY_DATA`, `useMemo` 필터링
**Implements:** 네이티브 `<select>` 3개 연쇄 (라이브러리 없음)
**Avoids:** Pitfall 2 (하위 선택값 초기화 누락) — 단일 set 호출 패턴

### Phase 3: 카드 그루핑 + 접기/펼치기
**Rationale:** Phase 2가 완성되어 새 배치에 `category` 필드가 붙은 후 구현. 그루핑 key가 없으면 의미 없는 기능이다.
**Delivers:** `groupBatches.ts` 유틸리티, `RecommendGroup` 컴포넌트, `App.tsx` 그루핑 렌더링, 업종 변경 시 자동 접힘
**Implements:** `useMemo` 기반 파생 상태, Zustand `collapsedGroups` 크로스-컴포넌트 상태
**Avoids:** Pitfall 5 (height:auto 애니메이션) — CSS Grid `0fr/1fr` 사용

### Phase 4: 모바일 반응형
**Rationale:** 독립적이나 마지막이 효율적 — 새 컴포넌트(IndustryDropdown, RecommendGroup)가 모두 만들어진 후 반응형 클래스를 일괄 적용. 컴포넌트 구조가 안정된 후 CSS 작업.
**Delivers:** `AppLayout` 반응형 전환, `InputPanel`/`RecommendPanel` 반응형 패딩, `IndustryDropdown` 모바일 수직 스택
**Avoids:** Pitfall 3 (`min-w-[1024px]` — 반응형 단계 시작 시 최우선 제거), Pitfall 4 (sticky 사이드바 겹침)

### Phase 5: 마이그레이션 검증 + 전체 테스트
**Rationale:** 코드 완성 후 기존 사용자 데이터 시나리오를 명시적으로 검증. "Looks Done But Isn't" 체크리스트 항목 전수 확인.
**Delivers:** v1.0 localStorage → v1.1 정상 작동 확인, 모바일 뷰포트 테스트, 전체 플로우 (업종선택 → 추천 → 그루핑 → 업종변경 → 자동접힘) 검증

### Phase Ordering Rationale

- 의존성 체인: 데이터 구조 → 드롭다운 → 그루핑 → 반응형 순서가 Architecture 연구에서 명시적으로 권장됨
- localStorage 마이그레이션은 UI 작업 전 Phase 1에서 처리 — 나중에 하면 개발 중 직접 자신의 로컬 스토리지가 오염됨
- 반응형을 마지막에 두는 이유: 새 컴포넌트 레이아웃이 확정된 후 CSS 작업이 한 번에 끝남 (중간에 하면 컴포넌트 변경마다 반응형 재확인 필요)

### Research Flags

**표준 패턴 (추가 연구 불필요):**
- **Phase 1** — TypeScript 타입 정의, Zustand persist migration. 공식 문서와 기존 코드베이스 패턴이 명확함
- **Phase 2** — 네이티브 `<select>` cascading. 단순 React `useMemo` + 필터링, 검증된 패턴
- **Phase 3** — `useMemo` 기반 그루핑, Zustand 상태 추가. 기존 스토어 패턴 확장
- **Phase 4** — Tailwind `lg:` breakpoint. 문서화가 가장 잘 된 CSS 기능 중 하나
- **Phase 5** — 검증/테스트. 코드 완성 후 진행

**모니터링이 필요한 세부 항목:**
- CSS Grid `grid-template-rows: 0fr → 1fr` 트랜지션이 Safari 17.2+에서 부드럽게 동작하는지 실제 기기 확인 (기능 자체는 동작하지만 애니메이션 품질 검증)
- 모바일 iOS Safari에서 `100vh` 대신 `h-dvh` 사용 여부 결정 (주소창 변동 대응)

---

## Confidence Assessment

| 영역 | 신뢰도 | 근거 |
|------|--------|------|
| Stack | HIGH | 기존 코드베이스 분석 완료, 새 패키지 불필요 — 기술적 불확실성 없음 |
| Features | HIGH | 세 기능 모두 명확한 UX 요구사항, 구현 패턴까지 상세 정의됨 |
| Architecture | HIGH | 기존 코드베이스 완전 분석 후 구체적 코드 패턴 도출, 의존성 명확 |
| Pitfalls | HIGH | 실제 코드 분석 기반 (min-w, sticky 등 특정 라인 지적), 공식 문서 + 커뮤니티 사례 교차 검증 |

**Overall confidence: HIGH**

### Gaps to Address

- **247개 소분류 데이터 내용**: ARCHITECTURE.md와 STACK.md 모두 "소상공인 맞춤 커스텀 분류"라고 명시하지만, 실제 247개 항목의 목록은 별도로 준비해야 한다. 데이터 파일 작성이 Phase 1의 실질적인 작업량의 대부분을 차지할 수 있음.
- **CSS Grid 애니메이션 Safari 검증**: 브라우저 지원 문서 기준 Safari 17.2+ 지원이지만, 실제 iOS Safari에서의 애니메이션 부드러움은 구현 후 확인 필요. 미지원 시 즉시 전환(기능 손실 없음)으로 fallback됨.
- **기존 사용자 테스트 시나리오**: localStorage에 실제 v1.0 데이터를 수동으로 세팅하고 v1.1 코드를 실행하는 마이그레이션 테스트가 Phase 5에서 명시적으로 필요함.

---

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4 Responsive Design](https://tailwindcss.com/docs/responsive-design) — breakpoint 체계, mobile-first 접근법
- [Tailwind CSS v4 Grid Template Rows](https://tailwindcss.com/docs/grid-template-rows) — `grid-rows-[0fr]` arbitrary value 지원
- [Tailwind CSS v4.0 Blog Post](https://tailwindcss.com/blog/tailwindcss-v4) — v4 변경사항
- [Zustand persist docs](https://zustand.docs.pmnd.rs/reference/integrations/persisting-store-data) — version + migrate 함수
- [CSS Grid Auto Height Transitions](https://css-tricks.com/css-grid-can-do-auto-height-transitions/) — 0fr/1fr 트랜지션 기법
- [CSS interpolate-size Can I Use](https://caniuse.com/mdn-css_properties_interpolate-size) — 브라우저 호환성

### Secondary (MEDIUM confidence)
- [한국표준산업분류 KSIC](http://kssc.kostat.go.kr/) — 대/중/소분류 체계 참조
- [GitHub KSIC Dataset](https://github.com/FinanceData/KSIC) — CSV 형식 산업분류 데이터
- [Polypane position:sticky guide](https://polypane.app/blog/getting-stuck-all-the-ways-position-sticky-can-fail/) — sticky 사이드바 pitfalls
- [UXPin Dropdown Interaction Patterns](https://www.uxpin.com/studio/blog/dropdown-interaction-patterns-a-complete-guide/) — 50+ 항목 시 검색 권장 근거
- [freeCodeCamp dependent dropdowns](https://www.freecodecamp.org/news/how-to-build-dependent-dropdowns-in-react/) — cascading dropdown 패턴

### Tertiary (LOW confidence)
- rc-cascader, PrimeReact CascadeSelect 평가 — 도입 기각 근거로만 참조

---

*Research completed: 2026-04-01*
*Ready for roadmap: yes*
