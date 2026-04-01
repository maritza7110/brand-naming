# Phase 5: 추천 카드 그루핑 - Research

**Researched:** 2026-04-02
**Domain:** React UI 컴포넌트 (접기/펼치기 그룹, CSS Grid 애니메이션, Zustand 상태 관리)
**Confidence:** HIGH

## Summary

Phase 5는 추천 패널의 flat 카드 목록을 소분류 업종별 그룹으로 재구성하고, 각 그룹에 접기/펼치기 애니메이션을 추가하며, 업종 변경 시 이전 그룹 자동 접힘과 "네이밍 초기화" 버튼을 구현하는 단계이다.

핵심 기술적 과제는 두 가지다. 첫째, 현재 `RecommendBatch` 타입에 업종 정보가 없으므로 배치 생성 시 현재 선택된 `IndustrySelection`을 캡처하여 저장해야 한다. 이는 persist 스키마 변경(version 1 -> 2)과 기존 배치 마이그레이션을 수반한다. 둘째, CSS Grid `grid-template-rows: 0fr/1fr` 트랜지션을 사용한 접기/펼치기 애니메이션이 결정된 방식이며, Tailwind CSS v4의 `grid-rows-[0fr]` / `grid-rows-[1fr]` 임의값 문법과 `transition-[grid-template-rows]` 커스텀 트랜지션으로 구현한다.

새 npm 패키지 추가 없이 기존 스택(React 19, Tailwind CSS 4, Zustand, Lucide React)만으로 모든 기능을 구현할 수 있다. 컴포넌트 구조는 `RecommendGroup` (그룹 래퍼 + 헤더 + 접기/펼치기)을 신규 생성하고, 기존 `RecommendCardItem`은 변경 없이 재사용하며, `App.tsx`의 추천 패널 렌더링 로직을 그룹 기반으로 교체한다.

**Primary recommendation:** RecommendBatch에 industry 필드를 추가하고, 그룹핑 로직은 App.tsx 또는 별도 유틸에서 처리하며, RecommendGroup 컴포넌트가 CSS Grid 0fr/1fr 애니메이션을 캡슐화한다.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| GROUP-01 | 추천 카드가 소분류 업종별로 그룹 헤더와 함께 묶여 표시된다 | RecommendBatch에 industry 필드 추가 + 그룹핑 유틸 함수 + RecommendGroup 컴포넌트 |
| GROUP-02 | 그룹을 클릭하면 접기/펼치기 애니메이션으로 전환된다 | CSS Grid 0fr/1fr 트랜지션 패턴 (Architecture Pattern 1) |
| GROUP-03 | 업종을 변경하면 이전 업종 그룹이 자동으로 접힌다 | Zustand subscribe + 이전 업종 비교 로직 (Architecture Pattern 3) |
| RESET-01 | "네이밍 초기화" 버튼으로 모든 입력 초기화 + 기존 카드를 접힌 컨테이너로 묶기 | resetAll 확장 + archiveBatches 액션 (Architecture Pattern 4) |
</phase_requirements>

## Standard Stack

### Core (변경 없음 -- 기존 스택 재사용)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.x | UI 프레임워크 | 기존 앱 동일 |
| TypeScript | 5.x | 타입 안전성 | 기존 앱 동일 |
| Tailwind CSS | 4.x | CSS Grid 0fr/1fr 애니메이션, 유틸리티 스타일링 | 기존 앱 동일 |
| Zustand | latest | 그룹 접힘 상태 + 배치 industry 필드 관리 | 기존 앱 동일 |
| Lucide React | 0.5x | ChevronDown/ChevronRight 아이콘 (그룹 헤더) | 기존 앱 동일 |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS Grid 0fr/1fr | CSS `height: auto` transition (2025+ 브라우저) | 최신 기능, 브라우저 호환성 불확실. 결정 사항이므로 Grid 사용 |
| CSS Grid 0fr/1fr | max-height hack | 임의 max-height 필요, 큰 콘텐츠에서 딜레이 발생. Grid가 우월 |
| Zustand 그룹 상태 | React useState | 그룹 상태가 업종 변경 시 연동되어야 하므로 Zustand가 적합 |

**Installation:** 없음 -- 새 npm 패키지 추가 없음 (v1.1 제약).

## Architecture Patterns

### Recommended Project Structure (변경/추가 파일)

```
src/
  types/
    form.ts                  # RecommendBatch에 industry 필드 추가
  store/
    useFormStore.ts           # persist v2 마이그레이션, archiveBatches 액션 추가
  components/
    recommend/
      RecommendGroup.tsx      # [신규] 그룹 헤더 + 접기/펼치기 래퍼
      RecommendCardItem.tsx   # 변경 없음
    layout/
      InputPanel.tsx          # "네이밍 초기화" 버튼 추가
  utils/
    groupBatches.ts           # [신규] 배치 -> 그룹 변환 유틸 함수
  App.tsx                     # 추천 패널 렌더링 로직 그룹 기반으로 교체
```

### Pattern 1: CSS Grid 0fr/1fr 접기/펼치기 애니메이션

**What:** CSS Grid의 `grid-template-rows` 속성을 `0fr`에서 `1fr`로 트랜지션하여 높이 0에서 자연 높이까지 부드러운 애니메이션 구현
**When to use:** 동적 높이 콘텐츠의 접기/펼치기가 필요할 때
**Example:**

```tsx
// Tailwind CSS v4 임의값 문법
// Source: https://tailwindcss.com/docs/grid-template-rows (v4 docs)
interface CollapsibleProps {
  isOpen: boolean;
  children: React.ReactNode;
}

function Collapsible({ isOpen, children }: CollapsibleProps) {
  return (
    <div
      className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      }`}
    >
      <div className="overflow-hidden">
        {children}
      </div>
    </div>
  );
}
```

**Key constraints:**
- 접히는 콘텐츠를 감싸는 내부 `div`에 반드시 `overflow-hidden` 필요
- 내부 div의 padding/margin이 0이어야 0fr 시 완전히 접힘 (padding이 있으면 최소 높이 유지)
- `transition-[grid-template-rows]`로 grid 속성만 트랜지션 (transition-all 대신 명시적 지정)

### Pattern 2: RecommendBatch에 업종 정보 첨부

**What:** 배치 생성 시 현재 선택된 업종 정보를 캡처하여 `RecommendBatch.industry` 필드에 저장
**When to use:** 그룹핑의 기준 데이터가 배치에 내장되어야 할 때

```typescript
// form.ts 변경
export interface RecommendBatch {
  id: string;
  names: { brandName: string; reasoning: string }[];
  basedOn: string[];
  createdAt: Date;
  industry?: IndustrySelection;  // 신규 -- 선택 시점의 업종 스냅샷
}
```

**그룹핑 키:** `batch.industry?.minor || batch.industry?.medium || batch.industry?.major || '미분류'`
- 소분류가 있으면 소분류로 그룹
- 소분류 없으면 중분류, 그것도 없으면 대분류
- 업종 선택 없는 배치는 "미분류" 그룹

**persist 마이그레이션:** version 1 -> 2. 기존 배치에는 industry 필드가 없으므로 `undefined`로 유지 (optional 필드). 기존 배치는 "미분류" 그룹에 표시.

### Pattern 3: 업종 변경 감지 및 자동 접힘

**What:** Zustand의 `subscribe`를 사용하여 업종 변경을 감지하고, 이전 업종 그룹을 자동으로 접는다
**When to use:** 스토어 상태 변경에 대한 반응적 UI 업데이트

```typescript
// App.tsx 또는 커스텀 훅에서
// 그룹 접힘 상태를 React state로 관리
const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

// 업종 변경 시 이전 업종 그룹 자동 접기
const prevIndustryRef = useRef<string>('');

useEffect(() => {
  const unsubscribe = useFormStore.subscribe(
    (state) => state.storeBasic.industry.minor,
    (currentMinor, prevMinor) => {
      if (prevMinor && prevMinor !== currentMinor) {
        // 이전 업종의 그룹키를 접힌 상태로 추가
        setCollapsedGroups(prev => new Set([...prev, prevMinor]));
      }
    }
  );
  return unsubscribe;
}, []);
```

**대안:** `useEffect` + `useRef`로 이전 값 비교. Zustand subscribe는 컴포넌트 외부에서도 동작하므로 더 유연하지만, 이 경우 `collapsedGroups`가 React state이므로 `useEffect` 방식이 더 자연스러울 수 있음. 최종 구현은 planner 재량.

### Pattern 4: 네이밍 초기화 플로우

**What:** "네이밍 초기화" 버튼 클릭 시 (1) 모든 폼 필드 초기화 + (2) 기존 배치를 접힌 "아카이브" 컨테이너로 이동
**When to use:** 사용자가 새로운 네이밍 세션을 시작할 때

**구현 접근:**
1. 기존 `resetAll()` 액션은 폼 필드만 초기화 (batches는 유지) -- 이미 구현되어 있음
2. 신규 필요: "아카이브" 개념 -- 기존 배치를 그대로 두되 "접힌 상태의 그룹"으로 표시
3. 방법 A: `archivedBatches: RecommendBatch[]` 별도 배열로 이동
4. 방법 B: 기존 batches 배열 유지, `archivedAt?: Date` 타임스탬프로 구분
5. 방법 C (권장): 초기화 시점의 타임스탬프를 기록하고, 그 이전 배치는 모두 접힌 "이전 추천" 그룹으로 표시

**방법 C 상세:**
```typescript
// useFormStore에 추가
resetTimestamp: Date | null;  // 초기화 시점

resetNaming: () => void;  // resetAll + resetTimestamp 기록
```

초기화 후 렌더링:
- `resetTimestamp` 이후 배치: 정상 그룹 표시 (현재 세션)
- `resetTimestamp` 이전 배치: "이전 추천" 접힌 컨테이너 1개로 묶어 표시

### Anti-Patterns to Avoid

- **max-height 애니메이션:** 임의의 max-height 값이 필요하고 콘텐츠 크기에 따라 애니메이션 속도가 달라짐. CSS Grid 0fr/1fr 사용
- **React ref + scrollHeight:** DOM 측정 기반 애니메이션은 레이아웃 스래싱(layout thrashing) 유발. CSS-only 방식이 성능적으로 우월
- **그룹 상태를 Zustand persist에 저장:** 접힘 상태는 세션 UI 상태이며, 새로고침 시 초기화되어야 함. React state가 적합
- **배치에서 업종 역추론:** basedOn 배열의 "업종" 라벨로 그룹핑 시도하면 정확도가 떨어짐. 구조적 industry 필드를 사용

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 접기/펼치기 애니메이션 | JavaScript 기반 높이 계산 | CSS Grid 0fr/1fr transition | 레이아웃 스래싱 없음, 동적 높이 자동 처리 |
| 아이콘 회전 애니메이션 | transform 직접 계산 | Tailwind `rotate-0` / `-rotate-90` + `transition-transform` | Tailwind 유틸리티가 이미 제공 |
| 그룹핑 유틸리티 | 복잡한 reduce 체인 | 간단한 Map<string, Batch[]> 변환 | 배치 수가 수십 개 수준, 과도한 최적화 불필요 |

**Key insight:** 이 Phase의 모든 기능은 기존 스택의 CSS + React state 조합으로 충분하며, 외부 애니메이션 라이브러리(framer-motion 등)가 전혀 필요 없다.

## Common Pitfalls

### Pitfall 1: overflow-hidden 누락으로 0fr 접힘 실패

**What goes wrong:** CSS Grid `grid-rows-[0fr]`을 적용해도 콘텐츠가 보임
**Why it happens:** 내부 요소에 `overflow-hidden`이 없으면 Grid 셀이 0fr이어도 콘텐츠가 넘침
**How to avoid:** Grid 컨테이너 바로 안쪽에 `<div className="overflow-hidden">` 래퍼 필수
**Warning signs:** 접기 애니메이션에서 콘텐츠가 갑자기 잘리지 않고 항상 보이는 현상

### Pitfall 2: 내부 요소 padding/margin으로 최소 높이 유지

**What goes wrong:** `grid-rows-[0fr]`인데 약간의 높이가 남아있음
**Why it happens:** overflow-hidden div 안쪽의 첫 번째 자식에 padding-top/margin-top이 있으면 Grid 최소 크기 계산에 포함됨
**How to avoid:** overflow-hidden div의 직접 자식에는 외부 padding을 주지 않고, 내부에서 padding 처리. 또는 그룹 래퍼 구조 설계 시 padding을 overflow-hidden 바깥으로 배치
**Warning signs:** 접힌 상태에서 8-16px 정도의 잔여 높이

### Pitfall 3: persist 마이그레이션 시 기존 배치 데이터 손실

**What goes wrong:** 앱 업데이트 후 기존 추천 카드가 사라짐
**Why it happens:** persist version 변경 시 migrate 함수가 기존 데이터를 올바르게 변환하지 않음
**How to avoid:** migrate 함수에서 기존 배치의 industry 필드를 `undefined`로 유지 (optional). merge 함수에서 Date 복원 로직 유지
**Warning signs:** localStorage에 데이터는 있는데 앱에서 표시 안 됨

### Pitfall 4: 업종 변경 감지의 타이밍 문제

**What goes wrong:** 업종 변경 후 바로 추천을 받으면 이전 그룹이 접히기 전에 새 배치가 추가됨
**Why it happens:** 업종 변경 감지와 추천 생성이 동시에 발생
**How to avoid:** 업종 변경 감지는 `storeBasic.industry` 구독으로 즉시 처리. 추천 생성은 비동기이므로 그룹 접힘이 먼저 완료됨. 시간 순서 보장
**Warning signs:** 새 배치가 이전 업종 그룹에 잠깐 표시되다 이동

### Pitfall 5: 네이밍 초기화 시 batches 삭제 vs 보존 혼동

**What goes wrong:** 초기화 시 기존 추천 카드가 완전히 사라짐
**Why it happens:** resetAll이 batches 배열까지 비우거나, 아카이브 로직이 누락됨
**How to avoid:** 요구사항 명확: "기존 추천 카드가 접힌 컨테이너로 묶인다" -- 삭제가 아님. resetAll은 폼만 초기화, batches는 별도 아카이브 처리
**Warning signs:** 사용자 테스트에서 "이전 추천 어디갔어?" 피드백

## Code Examples

Verified patterns from official sources:

### Example 1: RecommendGroup 컴포넌트 (접기/펼치기)

```tsx
// Source: Tailwind CSS v4 docs + CSS Grid 0fr/1fr 패턴
// https://tailwindcss.com/docs/grid-template-rows
import { ChevronDown } from 'lucide-react';
import type { RecommendBatch } from '../../types/form';
import { RecommendCardItem } from './RecommendCardItem';

interface RecommendGroupProps {
  label: string;        // 그룹 헤더 텍스트 (예: "분식")
  batches: RecommendBatch[];
  isOpen: boolean;
  onToggle: () => void;
  count: number;        // 그룹 내 배치 수
}

export function RecommendGroup({ label, batches, isOpen, onToggle, count }: RecommendGroupProps) {
  return (
    <div className="rounded-xl border border-[#4A4440] overflow-hidden">
      {/* 그룹 헤더 -- 클릭으로 토글 */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#332F2C] hover:bg-[#3E3A36] transition-colors"
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            size={14}
            className={`text-[#B48C50] transition-transform duration-300 ${
              isOpen ? 'rotate-0' : '-rotate-90'
            }`}
          />
          <span className="text-[12px] font-semibold text-[#E8E2DA]">{label}</span>
        </div>
        <span className="text-[10px] text-[#7A7570]">{count}건</span>
      </button>

      {/* 접기/펼치기 영역 -- CSS Grid 0fr/1fr */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-3 space-y-2">
            {batches.map((b) => (
              <RecommendCardItem key={b.id} batch={b} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Example 2: 배치 그룹핑 유틸 함수

```typescript
// Source: 프로젝트 도메인 로직
import type { RecommendBatch, IndustrySelection } from '../types/form';

interface BatchGroup {
  key: string;       // 그룹핑 키 (소분류 업종명 또는 "미분류")
  label: string;     // 표시 라벨
  batches: RecommendBatch[];
}

/** 업종 정보로부터 그룹핑 키 추출 */
function getGroupKey(industry?: IndustrySelection): string {
  if (!industry) return '미분류';
  return industry.minor || industry.medium || industry.major || '미분류';
}

/** 배치 배열을 업종별 그룹으로 변환 (순서 유지) */
export function groupBatches(batches: RecommendBatch[]): BatchGroup[] {
  const map = new Map<string, RecommendBatch[]>();
  const order: string[] = [];

  for (const batch of batches) {
    const key = getGroupKey(batch.industry);
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(batch);
  }

  return order.map((key) => ({
    key,
    label: key,
    batches: map.get(key)!,
  }));
}
```

### Example 3: "네이밍 초기화" 버튼 (InputPanel 내 배치)

```tsx
// Source: 사용자 요구사항 -- API 설정 버튼 하단 배치
import { RotateCcw } from 'lucide-react';

<button
  type="button"
  onClick={onResetClick}
  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[#A09890] text-[11px] font-medium transition hover:text-red-400 hover:bg-[#504A44]"
>
  <RotateCcw size={14} />
  <span>네이밍 초기화</span>
</button>
```

### Example 4: Zustand persist v2 마이그레이션

```typescript
// Source: 기존 useFormStore.ts persist 패턴 확장
{
  name: 'brand-naming-data',
  version: 2,  // 1 -> 2
  partialize: (state) => ({
    batches: state.batches,
    resetTimestamp: state.resetTimestamp,
  }),
  migrate: (persisted: unknown, version: number) => {
    // v1 -> v2: batches에 industry 필드 추가 (optional이므로 변환 불필요)
    // resetTimestamp 추가 (null 기본값)
    if (version === 1) {
      const p = persisted as { batches?: RecommendBatch[] };
      return { ...p, resetTimestamp: null };
    }
    return persisted;
  },
  merge: (persisted, current) => {
    const p = persisted as {
      batches?: RecommendBatch[];
      resetTimestamp?: string | null;
    } | undefined;
    const restoredBatches = (p?.batches ?? []).map((b) => ({
      ...b,
      createdAt: new Date(b.createdAt),
    }));
    const restoredTimestamp = p?.resetTimestamp
      ? new Date(p.resetTimestamp)
      : null;
    return {
      ...current,
      batches: restoredBatches,
      resetTimestamp: restoredTimestamp,
    };
  },
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| max-height hack | CSS Grid 0fr/1fr | 2023 (CSS Grid Level 2) | 정확한 높이 계산 불필요, 동적 콘텐츠에 완벽 대응 |
| JavaScript scrollHeight 측정 | CSS-only animation | 2023+ | 레이아웃 스래싱 제거, 성능 향상 |
| transition: height (0 to auto) | CSS Grid 0fr/1fr OR `interpolate-size: allow-keywords` | 2025+ | allow-keywords는 아직 일부 브라우저만 지원, Grid 방식이 안정적 |

**Deprecated/outdated:**
- `max-height: 9999px` 패턴: 속도 불일치 문제, 사용 금지
- `Element.animate()` API 직접 사용: React 상태와 동기화 어려움

## Open Questions

1. **"이전 추천" 아카이브 컨테이너의 표시 형태**
   - What we know: 초기화 시 기존 카드를 접힌 컨테이너로 묶는다
   - What's unclear: 여러 번 초기화 시 아카이브가 중첩되는지, 하나의 "이전 추천" 그룹으로 합치는지
   - Recommendation: 단순하게 모든 이전 배치를 하나의 "이전 추천" 접힌 그룹으로 표시 (중첩 방지)

2. **그룹 헤더의 상세 정보 수준**
   - What we know: 소분류 업종별로 그룹핑
   - What's unclear: 헤더에 "음식 > 한식 > 분식" 전체 경로를 표시할지, "분식"만 표시할지
   - Recommendation: 그룹 헤더에는 간결하게 소분류명만 표시 + 배치 수. 공간이 좁은 오른쪽 패널 특성상 간결한 것이 좋음

## Project Constraints (from CLAUDE.md)

- **파일 제한:** 모든 소스 파일 500줄 이하 (황금룰)
- **언어:** 한국어 UI, 한국어 문서
- **디자인:** 심플 + 고급스러움, CSS 전문가 수준 퀄리티
- **Tech Stack:** React 19 + Vite + TypeScript + Tailwind CSS 4 + Zustand
- **AI:** Gemini 3.1 Pro API
- **v1.1 제약:** 새 npm 패키지 추가 없음
- **CSS Grid 0fr/1fr:** 결정된 애니메이션 방식 (STATE.md)
- **Icon:** Lucide React (기존 ChevronDown 패턴 재사용)
- **사용하지 말 것:** Material UI, Ant Design, Redux, Next.js

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4 grid-template-rows 공식 문서](https://tailwindcss.com/docs/grid-template-rows) -- 임의값 문법 `grid-rows-[0fr]` / `grid-rows-[1fr]` 확인
- [Tailwind CSS v4 transition-property 공식 문서](https://tailwindcss.com/docs/transition-property) -- `transition-[grid-template-rows]` 커스텀 트랜지션 확인
- 프로젝트 소스 코드 분석 -- RecommendBatch 타입, useFormStore persist 패턴, RecommendPanel 렌더링 구조

### Secondary (MEDIUM confidence)
- [CSS Grid 0fr/1fr 애니메이션 패턴 (Cruip)](https://cruip.com/building-a-simple-animated-accordion-component-with-tailwind-css/) -- Tailwind + React 구현 예시
- [CSS Grid 0fr/1fr 패턴 (DEV Community)](https://dev.to/francescovetere/css-trick-transition-from-height-0-to-auto-21de) -- overflow-hidden 필수 사항 확인
- [Tailwind GitHub Discussion #11186](https://github.com/tailwindlabs/tailwindcss/discussions/11186) -- 0fr/1fr 유틸리티 논의
- [MDN grid-template-rows](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/grid-template-rows) -- 브라우저 호환성

### Tertiary (LOW confidence)
- 없음

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- 기존 스택 재사용, 새 패키지 없음
- Architecture: HIGH -- CSS Grid 0fr/1fr 패턴은 잘 문서화됨, Tailwind v4 문법 확인 완료
- Pitfalls: HIGH -- overflow-hidden/padding 이슈는 공식 문서 + 커뮤니티에서 반복 확인됨

**Research date:** 2026-04-02
**Valid until:** 2026-05-02 (안정적 기술, 30일 유효)
