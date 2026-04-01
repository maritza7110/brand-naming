# Phase 4: 산업분류 계층형 드롭다운 - Research

**Researched:** 2026-04-01
**Domain:** React 계층형 UI, 산업분류 데이터 모델링, Zustand persist 마이그레이션
**Confidence:** HIGH

## Summary

Phase 4는 기존 14개 flat 업종 드롭다운을 3단 계층형 드롭다운(대분류 > 중분류 > 소분류) + 비고 텍스트 입력으로 교체하는 작업이다. 핵심 영역은 (1) 산업분류 데이터 구조화, (2) 계층형 드롭다운 UI, (3) 타입 시스템 변경, (4) AI 프롬프트 통합, (5) localStorage 마이그레이션이다.

중요한 발견: 현재 `useFormStore`의 `partialize`가 `batches`만 persist하므로 **form 필드(category 포함)는 localStorage에 저장되지 않는다**. 따라서 "기존 category string 마이그레이션"은 form 데이터가 아니라 `batches[].basedOn`에 "업종"이라는 라벨이 포함된 경우에 해당한다. 다만 `basedOn`은 단순 라벨 배열(`string[]`)이므로 실제 값 변환이 필요하지 않고 호환성이 유지된다. **진짜 마이그레이션 포인트는 form 필드 persist를 새로 추가하는 경우에만 발생한다.**

**Primary recommendation:** 새 npm 패키지 없이, 정적 TypeScript 데이터 파일 + 기존 `Dropdown` 컴포넌트 3개 + `TextArea` 1개로 구현. `StoreBasicState.category` 타입을 `string`에서 `IndustrySelection` 객체로 변경하되, `buildInputSummary` 등 기존 코드의 `Object.entries().filter(v.trim())` 패턴을 반드시 수정해야 한다.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** 4단 구조 -- 대분류 > 중분류 > 소분류(드롭다운 3개) + 비고(텍스트 입력 1개)
- **D-02:** 비고 필드는 소분류로 구분이 부족한 업종(고양이카페, 만화카페 등)을 사용자가 직접 보충하는 용도
- **D-03:** 네이티브 `<select>` 사용 (v1.1 결정사항), 검색/필터 없음 (Out of Scope)
- **D-04:** 2열 2행 grid 배치 -- 1행: 대분류 | 중분류, 2행: 소분류 | 비고
- **D-05:** 기존 StoreBasicSection의 `grid-cols-2` 패턴과 동일한 레이아웃 유지
- **D-06:** 상위 분류 변경 시 하위 전체 초기화 -- 대분류 변경 -> 중/소분류 + 비고 초기화, 중분류 변경 -> 소분류 + 비고 초기화
- **D-07:** 상위 미선택 시 하위 드롭다운은 disabled 상태로 표시 (숨기지 않음)
- **D-08:** 전체 경로를 AI 프롬프트에 전달 -- `"업종: 음식점 > 한식 > 분식 (비고: 떡볶이 전문)"` 형태
- **D-09:** gemini.ts의 FIELD_LABELS 및 프롬프트 구성 로직 수정 필요
- **D-10:** 무음 자동 마이그레이션 -- 앱 로드 시 기존 데이터 자동 변환
- **D-11:** 14개 기존 flat 카테고리 -> 새 대/중/소분류 매핑 테이블 작성
- **D-12:** 기존 batches는 그대로 유지, 업종 필드만 새 IndustrySelection 스키마로 변환

### Claude's Discretion
- 247개 소분류 산업분류 데이터의 구체적 분류 체계 (통계청 표준산업분류 등 참고)
- IndustrySelection 타입의 구체적 필드 설계
- 마이그레이션 함수의 매핑 테이블 상세 내용
- 비고 필드의 placeholder 문구

### Deferred Ideas (OUT OF SCOPE)
None
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| INDUSTRY-01 | 사용자가 대분류 > 중분류 > 소분류 3단 계층형 드롭다운으로 업종을 선택할 수 있다 | 기존 Dropdown 컴포넌트 3개 재사용, cascading 로직을 StoreBasicSection 내에서 구현 |
| INDUSTRY-02 | 247개 소분류 산업분류 데이터가 정적 TypeScript 파일로 포함된다 | 상권업종분류 체계(대분류 10개, 중분류 75개, 소분류 247개) 기반, 500줄 제한으로 데이터 파일 분할 필요 |
| INDUSTRY-03 | 기존 localStorage 데이터가 새 IndustrySelection 스키마로 자동 마이그레이션된다 | Zustand persist의 version + migrate 패턴 사용, 단 현재 form 필드는 persist되지 않아 batches만 영향 |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Tech Stack**: React 19 + Vite 6 + TypeScript 5 + Tailwind CSS 4 + Zustand 5
- **AI**: Gemini 3.1 Pro API (@google/genai)
- **파일 제한**: 모든 소스 파일 500줄 이하 (황금룰)
- **언어**: 한국어 UI, 한국어 문서
- **사용하지 말 것**: Next.js, Redux, Material UI/Ant Design, OpenAI API, Pinecone
- **v1.1 결정**: 새 npm 패키지 추가 없음
- **GSD 워크플로우**: Edit/Write 전에 GSD 커맨드로 시작

## Standard Stack

이 Phase는 **새 패키지 추가 없이** 기존 스택만으로 구현한다 (v1.1 결정사항).

### Core (기존 — 변경 없음)
| Library | Version | Purpose |
|---------|---------|---------|
| React | 19.2.4 | UI 프레임워크 |
| Zustand | 5.0.12 | 상태 관리 + persist middleware |
| TypeScript | 5.x | 타입 시스템 |
| Tailwind CSS | 4.x | 스타일링 |

### 새로 작성하는 모듈 (패키지가 아닌 프로젝트 내 파일)
| 파일 | Purpose |
|------|---------|
| `src/data/industryData.ts` (or 분할) | 산업분류 정적 데이터 |
| `src/data/industryMigration.ts` | 14개 flat -> 계층형 매핑 테이블 |

## Architecture Patterns

### Recommended File Structure
```
src/
├── data/
│   ├── industryData.ts         # 산업분류 계층 데이터 + 헬퍼 함수
│   └── industryMigration.ts    # 14개 flat category -> IndustrySelection 매핑
├── types/
│   └── form.ts                 # IndustrySelection 타입 추가, StoreBasicState 수정
├── components/
│   └── sections/
│       └── StoreBasicSection.tsx  # 계층형 드롭다운 UI (기존 파일 수정)
├── store/
│   └── useFormStore.ts         # updateStoreBasic 시그니처 변경, persist 마이그레이션
└── services/
    └── gemini.ts               # buildInputSummary 수정, 업종 경로 포맷
```

### Pattern 1: IndustrySelection 타입 설계
**What:** category 필드를 단일 string에서 구조체로 변경
**When to use:** 계층형 데이터를 단일 필드에 저장할 때

```typescript
/** 업종 선택 상태 */
export interface IndustrySelection {
  major: string;    // 대분류명 (예: "음식")
  medium: string;   // 중분류명 (예: "한식")
  minor: string;    // 소분류명 (예: "분식")
  note: string;     // 비고 (예: "떡볶이 전문")
}
```

**설계 근거:**
- 코드를 사용하지 않고 한국어 이름을 직접 저장 -- AI 프롬프트에 그대로 전달 가능
- 4개 필드 모두 string이므로 빈 문자열('')로 초기화 용이
- note 필드를 IndustrySelection 내부에 포함하여 업종 관련 정보를 한 곳에 응집

### Pattern 2: 산업분류 데이터 구조
**What:** 트리 구조를 flat 배열로 표현
**When to use:** 계층형 데이터를 TypeScript 상수로 관리할 때

```typescript
// src/data/industryData.ts

export interface IndustryCategory {
  major: string;
  medium: string;
  minor: string;
}

/** 전체 산업분류 데이터 (247개 소분류) */
export const INDUSTRY_DATA: IndustryCategory[] = [
  { major: '음식', medium: '한식', minor: '한식/백반/한정식' },
  { major: '음식', medium: '한식', minor: '분식' },
  { major: '음식', medium: '한식', minor: '육류/고기' },
  // ... 247개
];

/** 대분류 목록 추출 */
export function getMajorCategories(): string[] {
  return [...new Set(INDUSTRY_DATA.map((d) => d.major))];
}

/** 선택된 대분류의 중분류 목록 */
export function getMediumCategories(major: string): string[] {
  return [...new Set(
    INDUSTRY_DATA.filter((d) => d.major === major).map((d) => d.medium)
  )];
}

/** 선택된 중분류의 소분류 목록 */
export function getMinorCategories(major: string, medium: string): string[] {
  return INDUSTRY_DATA
    .filter((d) => d.major === major && d.medium === medium)
    .map((d) => d.minor);
}
```

**Confidence: HIGH** -- 이 flat 배열 접근은 Set 연산으로 유니크 추출이 간단하고, 247개 항목은 성능 이슈 없음.

**500줄 제한 대응:** 247개 항목 배열이 약 250줄, 헬퍼 함수 약 30줄 -> 총 ~280줄로 500줄 이내. 만약 초과 시 데이터 배열만 별도 파일(`industryDataRaw.ts`)로 분리.

### Pattern 3: Cascading Dropdown Reset 로직
**What:** 상위 변경 시 하위 초기화
**When to use:** 종속 드롭다운에서 상위 값 변경 시

```typescript
// StoreBasicSection 내부 핸들러 예시
function handleMajorChange(major: string) {
  updateIndustry({ major, medium: '', minor: '', note: '' });
}

function handleMediumChange(medium: string) {
  updateIndustry({ ...industry, medium, minor: '', note: '' });
}

function handleMinorChange(minor: string) {
  updateIndustry({ ...industry, minor });
}

function handleNoteChange(note: string) {
  updateIndustry({ ...industry, note });
}
```

### Pattern 4: Zustand updateStoreBasic 시그니처 변경
**What:** category가 객체가 되면서 updateStoreBasic 액션 수정 필요
**Critical concern:** 현재 `updateStoreBasic(field: keyof StoreBasicState, value: string)` 시그니처에서 `value`가 항상 `string`이지만, `category`가 `IndustrySelection`이 되면 타입 불일치 발생.

**두 가지 접근:**

A) **별도 액션 추가** (추천):
```typescript
updateIndustry: (selection: IndustrySelection) => void;
```
기존 `updateStoreBasic`은 나머지 string 필드용으로 유지. 변경 범위 최소화.

B) **updateStoreBasic 시그니처 확장:**
```typescript
updateStoreBasic: (field: keyof StoreBasicState, value: string | IndustrySelection) => void;
```
타입 안전성이 약해짐. 비추천.

### Anti-Patterns to Avoid
- **category를 string으로 유지하고 JSON.stringify:** 타입 불투명, AI 프롬프트 구성 시 매번 파싱 필요
- **3개 별도 필드(majorCategory, mediumCategory, minorCategory)를 StoreBasicState에 flat하게 추가:** 필드가 과도하게 늘어나고 D-12 마이그레이션이 복잡해짐
- **드롭다운 컴포넌트 새로 만들기:** 기존 `Dropdown` 컴포넌트가 label/value/onChange/options/disabled를 모두 지원하므로 그대로 재사용

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 계층형 드롭다운 | 커스텀 combobox/searchable select | 네이티브 `<select>` (기존 Dropdown 컴포넌트) | D-03 결정: 검색/필터 Out of Scope, 각 단계 20~30개로 충분히 탐색 가능 |
| 산업분류 데이터 | API 호출로 동적 로딩 | 정적 TypeScript 배열 | INDUSTRY-02: 정적 파일로 포함. 247개는 번들 크기 무시할 수준 (~10KB) |
| 드롭다운 애니메이션 | CSS transition/framer-motion | disabled 상태 표시 | D-07: 숨기지 않고 disabled로 표시. 애니메이션 불필요 |

## Common Pitfalls

### Pitfall 1: Object.entries + trim() 런타임 에러
**What goes wrong:** `StoreBasicState.category`가 `string`에서 `IndustrySelection` 객체로 바뀌면, 기존 코드에서 `Object.values(s).some((v) => v.trim() !== '')`가 `TypeError: v.trim is not a function`을 발생시킨다.
**Why it happens:** `StoreBasicSection`의 `hasInput` 체크와 `gemini.ts`의 `buildInputSummary`가 모든 필드를 string으로 가정하고 `.trim()` 호출.
**How to avoid:** category를 StoreBasicState에서 제거하거나, `hasInput` / `buildInputSummary`에서 category를 별도 처리. `typeof v === 'string'` 가드 또는 필드별 명시적 체크.
**Warning signs:** TypeScript 컴파일 에러가 먼저 잡아줌 (string이 아닌 타입에 trim() 호출 불가). 빌드 실패로 감지.

### Pitfall 2: partialize 미반영으로 마이그레이션 불필요 착각
**What goes wrong:** 현재 `partialize: (state) => ({ batches: state.batches })`이므로 form 필드는 localStorage에 저장되지 않는다. "기존 category를 마이그레이션해야 한다"는 착각으로 불필요한 코드를 작성하거나, 반대로 필요한 마이그레이션을 빠뜨린다.
**Why it happens:** D-10~12가 마이그레이션을 명시하지만, 실제로 persist되는 것은 batches뿐. batches 내 `basedOn` 배열에는 "업종"이라는 라벨만 있고 실제 카테고리 값은 없다.
**How to avoid:** 마이그레이션의 실제 대상을 명확히 파악:
  - batches의 basedOn은 라벨 문자열 배열 -> 호환성 유지, 변환 불필요
  - **만약** 향후 form 필드도 persist하기로 결정하면, 그때 version + migrate 필요
  - **현재는** version 번호만 추가하고 migrate 함수에서 "이전 버전이면 아무것도 안 함" 패턴 적용
**Warning signs:** `partialize`를 확인하지 않고 마이그레이션 코드 작성 시작.

### Pitfall 3: 500줄 제한 초과
**What goes wrong:** 산업분류 데이터 247개 항목이 한 파일에 있으면 데이터 + 헬퍼 함수 합쳐서 500줄 근접.
**Why it happens:** 각 항목이 `{ major: '...', medium: '...', minor: '...' }` 한 줄이면 ~250줄이므로 헬퍼 함수 포함해도 ~300줄로 안전. 하지만 주석이나 포맷이 느슨하면 초과 가능.
**How to avoid:** 한 줄에 한 항목, 최소 주석. 300줄 넘으면 데이터와 함수를 분리.
**Warning signs:** 파일 작성 후 `wc -l` 확인.

### Pitfall 4: Cascading 초기화 누락
**What goes wrong:** 대분류를 변경했을 때 중분류만 초기화하고 소분류를 초기화하지 않으면, 이전 소분류 값이 새 중분류에는 존재하지 않는 값으로 남아 있게 된다.
**Why it happens:** 초기화 로직에서 연쇄적 리셋을 빠뜨림.
**How to avoid:** D-06 명확히 구현: 대분류 변경 -> medium='', minor='', note='' 전체 초기화. 중분류 변경 -> minor='', note='' 초기화.
**Warning signs:** 대분류 변경 후 소분류 드롭다운에 "이전 선택값"이 표시됨.

### Pitfall 5: gemini.ts buildInputSummary에서 category 처리 누락
**What goes wrong:** `buildInputSummary`가 `Object.entries(form.storeBasic).filter(([, v]) => v.trim() !== '')`로 모든 필드를 순회하는데, category가 IndustrySelection 객체가 되면 `.trim()`이 실패한다.
**Why it happens:** 기존 코드가 모든 storeBasic 필드를 string으로 가정.
**How to avoid:** `buildInputSummary`에서 category/industry를 별도 처리하여 "업종: 음식 > 한식 > 분식 (비고: 떡볶이 전문)" 포맷 문자열로 변환.
**Warning signs:** AI 추천 호출 시 런타임 에러.

## Code Examples

### Example 1: StoreBasicState 타입 변경

```typescript
// src/types/form.ts

export interface IndustrySelection {
  major: string;
  medium: string;
  minor: string;
  note: string;
}

export interface StoreBasicState {
  industry: IndustrySelection;  // 기존 category: string 대체
  location: string;
  scale: string;
  mainProduct: string;
  priceRange: string;
  targetCustomer: string;
}
```

**Note:** 필드명을 `category`에서 `industry`로 변경하는 것이 의미론적으로 더 명확. 다만 FIELD_LABELS 등 연쇄 수정 필요.

### Example 2: 업종 경로 포맷 (AI 프롬프트용)

```typescript
// gemini.ts 또는 유틸리티

function formatIndustryPath(ind: IndustrySelection): string {
  const parts = [ind.major, ind.medium, ind.minor].filter(Boolean);
  if (parts.length === 0) return '';
  let result = parts.join(' > ');
  if (ind.note) result += ` (비고: ${ind.note})`;
  return result;
}
// 결과: "음식 > 한식 > 분식 (비고: 떡볶이 전문)"
```

### Example 3: Zustand persist version + migrate 스켈레톤

```typescript
// useFormStore.ts persist 옵션

{
  name: 'brand-naming-data',
  version: 1,  // 0 -> 1로 버전 업
  partialize: (state) => ({ batches: state.batches }),
  migrate: (persisted: unknown, version: number) => {
    if (version === 0) {
      // v0: batches만 persist, category는 persist 안 됨
      // batches.basedOn은 string[] 라벨이므로 호환성 유지
      return persisted;
    }
    return persisted;
  },
  merge: (persisted, current) => {
    const p = persisted as { batches?: RecommendBatch[] } | undefined;
    const restoredBatches = (p?.batches ?? []).map((b) => ({
      ...b,
      createdAt: new Date(b.createdAt),
    }));
    return { ...current, batches: restoredBatches };
  },
}
```

### Example 4: StoreBasicSection 계층형 드롭다운 (2x2 grid)

```typescript
// StoreBasicSection.tsx 핵심 부분

const industry = useFormStore((st) => st.storeBasic.industry);
const updateIndustry = useFormStore((st) => st.updateIndustry);

const majorOptions = getMajorCategories();
const mediumOptions = industry.major ? getMediumCategories(industry.major) : [];
const minorOptions = industry.major && industry.medium
  ? getMinorCategories(industry.major, industry.medium) : [];

// 2x2 grid (D-04)
<div className="grid grid-cols-2 gap-4">
  <Dropdown label="대분류" value={industry.major}
    onChange={(v) => updateIndustry({ major: v, medium: '', minor: '', note: '' })}
    options={majorOptions} />
  <Dropdown label="중분류" value={industry.medium}
    onChange={(v) => updateIndustry({ ...industry, medium: v, minor: '', note: '' })}
    options={mediumOptions} disabled={!industry.major} />
</div>
<div className="grid grid-cols-2 gap-4">
  <Dropdown label="소분류" value={industry.minor}
    onChange={(v) => updateIndustry({ ...industry, minor: v })}
    options={minorOptions} disabled={!industry.medium} />
  <TextArea label="비고" value={industry.note}
    onChange={(v) => updateIndustry({ ...industry, note: v })}
    placeholder="예: 떡볶이 전문, 고양이카페" rows={1}
    disabled={!industry.minor} />
</div>
```

## 산업분류 데이터 설계 (Claude's Discretion)

### 분류 체계 선택: 상권업종분류

**Confidence: MEDIUM** -- 공공데이터포털에서 확인한 구조이나, 정확한 247개 항목 목록은 공식 데이터셋 다운로드 필요.

소상공인시장진흥공단의 **상권업종분류** 체계를 기반으로 한다:
- 대분류: 10개 (음식, 소매, 생활서비스, 의료, 학문/교육, 관광/여가/오락, 숙박, 부동산, 수리/개인서비스, 기타)
- 중분류: 75개
- 소분류: 247개

이 체계가 적합한 이유:
1. **소상공인 대상** -- 앱의 타겟이 소상공인이므로 KSIC(한국표준산업분류)의 21개 대분류보다 상권업종분류의 10개 대분류가 직관적
2. **적절한 크기** -- KSIC는 1,200+ 세세분류로 과도. 상권업종분류 247개 소분류가 적정
3. **실용적 분류** -- "고양이카페", "PC방" 등 소상공인 현실에 맞는 분류 제공

### 대분류 10개 (추정, 공식 데이터 확인 필요)

| 대분류 | 중분류 수 (추정) | 대표 중분류 |
|--------|-----------------|------------|
| 음식 | 11 | 한식, 중식, 일식, 분식, 서양식, 카페, 치킨 등 |
| 소매 | 17 | 의류, 화장품, 편의점, 서점, 꽃집 등 |
| 생활서비스 | 13 | 미용실, 세탁소, 부동산중개, 카센터 등 |
| 의료 | ~5 | 병원, 약국, 한의원 등 |
| 학문/교육 | ~5 | 학원, 교습소, 독서실 등 |
| 관광/여가/오락 | ~8 | PC방, 노래방, 영화관, 스포츠 등 |
| 숙박 | ~3 | 호텔, 모텔, 펜션 등 |
| 부동산 | ~3 | 부동산중개, 임대 등 |
| 수리/개인서비스 | ~5 | 수선, 세차, 이삿짐 등 |
| 기타 | ~5 | 미분류 업종 |

**Note:** 정확한 중분류/소분류 목록은 구현 시 공공데이터포털(data.go.kr)의 "소상공인시장진흥공단_상가(상권)정보 업종코드" 데이터셋을 참조하거나, 소상공인에게 실용적인 분류를 직접 설계할 수 있다. **핵심은 대분류 ~10개, 중분류 ~75개, 소분류 ~247개의 3단 구조를 유지하는 것이다.**

### 14개 기존 flat 카테고리 -> 매핑 테이블

기존 CATEGORY_OPTIONS 14개:
```
음식점/레스토랑, 카페/베이커리, 주점/바, 소매/마트, 패션/의류,
뷰티/미용, 건강/피트니스, 교육/학원, IT/테크, 디자인/크리에이티브,
컨설팅/전문서비스, 숙박/펜션, 문화/엔터테인먼트, 기타
```

매핑 예시 (구현 시 확정):
```typescript
const LEGACY_MAPPING: Record<string, Partial<IndustrySelection>> = {
  '음식점/레스토랑': { major: '음식' },
  '카페/베이커리': { major: '음식', medium: '카페/디저트' },
  '주점/바': { major: '음식', medium: '유흥주점' },
  '소매/마트': { major: '소매' },
  '패션/의류': { major: '소매', medium: '의류' },
  '뷰티/미용': { major: '생활서비스', medium: '미용' },
  '건강/피트니스': { major: '관광/여가/오락', medium: '스포츠' },
  '교육/학원': { major: '학문/교육' },
  'IT/테크': { major: '기타' },
  '디자인/크리에이티브': { major: '기타' },
  '컨설팅/전문서비스': { major: '기타' },
  '숙박/펜션': { major: '숙박' },
  '문화/엔터테인먼트': { major: '관광/여가/오락' },
  '기타': { major: '기타' },
};
```

**Note:** 이 매핑은 batches가 아닌, **만약 category가 persist되는 경우**에만 필요. 현재 form 필드는 persist 안 되므로, 이 테이블은 "안전장치"로만 존재하며 실제 실행되지 않을 가능성이 높다.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Zustand v4 persist | Zustand v5 persist | 2024 | createWithEqualityFn 폐지, persist API는 동일 |
| 커스텀 select 라이브러리 | 네이티브 `<select>` | 프로젝트 결정 | D-03으로 잠금, react-select 등 불필요 |

## Open Questions

1. **247개 소분류의 정확한 목록**
   - What we know: 상권업종분류 체계(대10/중75/소247)의 구조는 확인됨
   - What's unclear: 정확한 항목명 목록은 공공데이터포털 데이터셋 다운로드 필요
   - Recommendation: 구현 시 공공데이터를 참조하되, 소상공인 실무에 맞게 일부 조정 가능. 데이터 정확도보다 사용성이 우선 -- 이 앱은 통계용이 아닌 브랜드 네이밍용이므로.

2. **form 필드 persist 추가 여부**
   - What we know: 현재 batches만 persist. D-10~12는 마이그레이션을 명시하지만 실제 form은 persist 안 됨
   - What's unclear: 사용자가 새로고침 시 입력 내용이 사라지는 것이 의도된 동작인지
   - Recommendation: Phase 4 범위에서는 현재 동작(form 미persist) 유지. form persist는 별도 판단 사항. version 번호만 올려서 향후 마이그레이션 가능하도록 대비.

3. **비고 필드에 disabled 적용 여부**
   - What we know: D-07은 "상위 미선택 시 하위 disabled"
   - What's unclear: 비고는 소분류 선택 후에만 활성화? 아니면 항상 활성?
   - Recommendation: 소분류 선택 후 활성화 (D-06의 초기화 체인과 일관성 유지). 대/중/소가 모두 선택되어야 비고 입력 가능.

## Sources

### Primary (HIGH confidence)
- 프로젝트 코드 직접 분석 (src/store/useFormStore.ts, src/types/form.ts, src/services/gemini.ts, src/components/sections/StoreBasicSection.tsx)
- Zustand 5.0.12 persist middleware 공식 문서: https://zustand.docs.pmnd.rs/reference/middlewares/persist
- 04-CONTEXT.md: 유저 결정사항 D-01~D-12

### Secondary (MEDIUM confidence)
- 소상공인시장진흥공단 상권업종분류 체계 (대10/중75/소247 구조): https://www.data.go.kr/data/15067631/fileData.do
- Zustand persist migration 패턴: https://dev.to/diballesteros/how-to-migrate-zustand-local-storage-store-to-a-new-version-njp

### Tertiary (LOW confidence)
- 상권업종분류 10개 대분류의 정확한 명칭 목록 -- 다수의 검색 결과에서 일부 확인되었으나 공식 데이터셋 전체 목록은 미확인

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- 기존 스택 그대로 사용, 패키지 추가 없음 확정
- Architecture: HIGH -- 기존 코드 패턴 분석 완료, 변경 지점 명확
- Pitfalls: HIGH -- 코드 분석으로 정확한 breakage point 식별 완료 (Object.entries+trim, buildInputSummary)
- Data: MEDIUM -- 상권업종분류 체계 구조는 확인되었으나 정확한 247개 항목 미확인

**Research date:** 2026-04-01
**Valid until:** 2026-05-01 (안정적 기존 스택, 데이터 구조는 고정)
