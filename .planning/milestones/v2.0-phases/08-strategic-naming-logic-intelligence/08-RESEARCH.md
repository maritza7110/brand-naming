# Phase 8: Strategic Naming Logic (Intelligence) - Research

**Researched:** 2026-04-03
**Domain:** Wizard UI + Gemini Prompt Engineering + Rationale UI
**Confidence:** HIGH

## Summary

Phase 8은 기존 단일 스크롤 입력 폼을 3단계 탭 위저드(분석-정체성-표현)로 전환하고, 4개 신규 입력 항목(경쟁사, USP, 시장 트렌드, 브랜드 퍼스널리티)을 추가하며, Gemini 프롬프트를 고도화하고, 추천 카드에 Rationale(근거) 확장 UI를 추가하는 대규모 Phase이다.

기존 코드베이스 분석 결과, 핵심 변경 영역은 5가지: (1) `NamingPage.tsx`에서 섹션 직접 렌더링 -> 탭 컨테이너로 전환, (2) `useFormStore.ts`에 신규 필드(competitors, usp, marketTrend, brandPersonality, namingStyle, languageConstraint, keywordWeights) 추가, (3) `gemini.ts`의 SYSTEM_PROMPT/USER_PROMPT를 확장된 구조화 응답으로 고도화, (4) 신규 UI 컴포넌트 6종(WizardTabs, ChipSelector, KeywordWeightSlider, AdvancedOptionsToggle, RationaleExpandedCard 등), (5) `types/form.ts`의 타입 확장.

**Primary recommendation:** Zustand store 확장 + Gemini `responseMimeType: 'application/json'` + `responseSchema` 기반의 구조화 응답으로 rationale 데이터를 안정적으로 추출하고, 탭 UI는 단순 state 기반 조건부 렌더링으로 구현한다.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** 탭 네비게이션 방식. 상단 [분석] [정체성] [표현] 탭, 자유 이동, 순서 강제 없음
- **D-02:** 시장중심 배치:
  - 분석 탭: StoreBasic + 경쟁사(신규) + USP(신규)
  - 정체성 탭: BrandVision + Persona + 시장 트렌드(신규) + 브랜드 퍼스널리티(신규)
  - 표현 탭: Product + 네이밍 스타일/언어 제약(신규, 고급 옵션)
- **D-03:** 각 탭에서 입력할 때마다 해당 단계 데이터로 즉시 추천 유지
- **D-04:** 네이밍 스타일은 기본 AI 자동 판단 + '고급 옵션' 토글로 사용자 직접 선택 병행
- **D-05:** 키워드 가중치는 슬라이더(1~5) 방식
- **D-06:** 경쟁사/USP 프롬프트 반영 방식은 Claude 재량
- **D-07:** 카드 확장 방식 Rationale UI (클릭 시 펼쳐짐)
- **D-08:** 타당성 점수를 백분율(%)로 표시
- **D-09:** 4개 신규 항목 전부 Phase 8에 포함
- **D-10:** 혼합 UI 방식 (텍스트/드롭다운/칩 혼합)

### Claude's Discretion
- 경쟁사/USP 데이터의 구체적 프롬프트 반영 전략 (D-06)
- 각 신규 항목의 placeholder 예시문 및 가이드 텍스트
- 키워드 가중치 슬라이더의 구체적 UI 디자인
- 타당성 점수(%) 산출 알고리즘
- 탭 간 이동 시 애니메이션/트랜지션 효과

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

## Standard Stack

### Core (이미 설치됨)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.x | UI 프레임워크 | 프로젝트 기존 스택 |
| Zustand | 5.0.12 | 폼 상태 관리 + 탭 상태 | 기존 useFormStore 확장 |
| @google/genai | 1.47.0 | Gemini API (구조화 응답) | 기존 프로젝트 사용 중 |
| Tailwind CSS | 4.x | 스타일링 | 기존 프로젝트 사용 중 |
| Lucide React | 0.5x | 아이콘 | 기존 프로젝트 사용 중 |

### Supporting (추가 설치 없음)
| Library | Purpose | When to Use |
|---------|---------|-------------|
| React 내장 useState | 탭 활성 상태, 카드 확장 상태 | 컴포넌트 로컬 상태 |
| CSS transition | 탭 indicator 슬라이드, 카드 확장 애니메이션 | Tailwind 클래스로 처리 |

**추가 설치 불필요.** 모든 기능을 기존 스택으로 구현 가능.

## Architecture Patterns

### 파일 구조 (신규/변경)
```
src/
├── types/
│   └── form.ts                         # FormState 확장 (신규 필드 + RationaleData 타입)
├── store/
│   └── useFormStore.ts                 # 신규 필드 + activeTab 상태 추가
├── services/
│   └── gemini.ts                       # 프롬프트 고도화 + responseSchema 적용
├── hooks/
│   └── useRecommend.ts                 # 키워드 가중치 반영 로직
├── components/
│   ├── wizard/
│   │   ├── WizardTabs.tsx              # 탭 네비게이션 바 (신규)
│   │   ├── AnalysisTab.tsx             # 분석 탭 컨테이너 (신규)
│   │   ├── IdentityTab.tsx             # 정체성 탭 컨테이너 (신규)
│   │   └── ExpressionTab.tsx           # 표현 탭 컨테이너 (신규)
│   ├── sections/
│   │   ├── StoreBasicSection.tsx       # 기존 (분석 탭으로 이동)
│   │   ├── BrandVisionSection.tsx      # 기존 (정체성 탭으로 이동)
│   │   ├── PersonaSection.tsx          # 기존 (정체성 탭으로 이동)
│   │   ├── ProductSection.tsx          # 기존 (표현 탭으로 이동)
│   │   ├── CompetitorSection.tsx       # 신규 (분석 탭)
│   │   ├── USPSection.tsx              # 신규 (분석 탭)
│   │   ├── MarketTrendSection.tsx      # 신규 (정체성 탭)
│   │   └── BrandPersonalitySection.tsx # 신규 (정체성 탭)
│   ├── ui/
│   │   ├── ChipSelector.tsx            # 범용 칩 선택기 (신규)
│   │   ├── KeywordWeightSlider.tsx     # 키워드 가중치 슬라이더 (신규)
│   │   └── AdvancedOptionsToggle.tsx   # 고급 옵션 접기/펼치기 (신규)
│   └── recommend/
│       ├── RecommendCardItem.tsx       # 기존 -> RationaleExpandedCard로 확장
│       └── RationaleExpandedCard.tsx   # 확장형 근거 카드 (신규)
└── pages/
    └── NamingPage.tsx                  # 탭 위저드 통합
```

### Pattern 1: 탭 위저드 -- State 기반 조건부 렌더링

**What:** React state로 활성 탭을 관리하고, 조건부 렌더링으로 탭 콘텐츠 전환. React Router 없이 단일 페이지 내 탭.

**When to use:** D-01에 따라 자유 이동 탭이며, URL 변경 불필요 (같은 NamingPage 내).

**Example:**
```typescript
// WizardTabs.tsx
type TabId = 'analysis' | 'identity' | 'expression';

interface WizardTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'analysis', label: '분석' },
  { id: 'identity', label: '정체성' },
  { id: 'expression', label: '표현' },
];

export function WizardTabs({ activeTab, onTabChange }: WizardTabsProps) {
  const activeIndex = TABS.findIndex((t) => t.id === activeTab);
  return (
    <div className="relative flex border-b border-[#4A4440]">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 h-[44px] text-[14px] font-semibold transition-colors ${
            activeTab === tab.id ? 'text-[#B48C50]' : 'text-[#A09890]'
          }`}
        >
          {tab.label}
        </button>
      ))}
      {/* Sliding indicator */}
      <div
        className="absolute bottom-0 h-[2px] bg-[#B48C50] transition-transform duration-300 ease-in-out"
        style={{
          width: `${100 / TABS.length}%`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
    </div>
  );
}
```

### Pattern 2: Gemini 구조화 응답 (Structured Output)

**What:** `@google/genai`의 `responseMimeType: 'application/json'` + `responseSchema`를 사용하여 rationale 데이터를 포함한 구조화된 JSON 응답을 받는다.

**Why:** 기존 `raw.match(/\[[\s\S]*\]/)` regex 파싱 방식은 fragile. 구조화 응답은 Gemini가 스키마에 맞는 JSON만 반환하도록 강제한다.

**Example:**
```typescript
const response = await ai.models.generateContent({
  model: 'gemini-3.1-flash-lite-preview',
  contents: [{ role: 'user', parts: [{ text: prompt }] }],
  config: {
    systemInstruction: SYSTEM_PROMPT,
    responseMimeType: 'application/json',
    responseSchema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          brandName: { type: 'string', description: '추천 브랜드명 (한글)' },
          reasoning: { type: 'string', description: '추천 이유 (한 문장)' },
          validityScore: { type: 'number', description: '타당성 점수 (0~100)' },
          namingTechnique: { type: 'string', description: '사용된 네이밍 기법' },
          meaningAnalysis: { type: 'string', description: '의미 분석 설명' },
          reflectedInputs: {
            type: 'array',
            items: { type: 'string' },
            description: '반영된 입력 항목명 리스트',
          },
        },
        required: ['brandName', 'reasoning', 'validityScore', 'namingTechnique', 'meaningAnalysis', 'reflectedInputs'],
      },
    },
  },
});
```

### Pattern 3: 범용 ChipSelector 컴포넌트

**What:** BrandPersonalityChips와 NamingStyleChips 모두 사용하는 범용 다중 선택 칩 컴포넌트.

**Example:**
```typescript
interface ChipSelectorProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxSelection: number;
  hint?: string;  // "최대 3개 선택"
}

export function ChipSelector({ label, options, selected, onChange, maxSelection, hint }: ChipSelectorProps) {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else if (selected.length >= maxSelection) {
      // FIFO: 가장 먼저 선택된 항목 해제 + 신규 추가
      onChange([...selected.slice(1), option]);
    } else {
      onChange([...selected, option]);
    }
  };
  // ... render chips with role="checkbox" aria-checked
}
```

### Pattern 4: 키워드 가중치 -- 입력 필드에서 자동 추출

**What:** 키워드 가중치 슬라이더에 표시할 키워드는 각 탭의 입력된 필드 라벨을 자동으로 추출. 사용자가 입력한 필드만 키워드로 표시.

**Example:**
```typescript
// 탭별로 입력된 필드를 키워드로 추출
function extractKeywords(form: FormState, tab: TabId): string[] {
  switch (tab) {
    case 'analysis':
      return Object.entries({ ...form.storeBasic, ...form.analysis })
        .filter(([k, v]) => k !== 'industry' && typeof v === 'string' && v.trim())
        .map(([k]) => FIELD_LABELS[k] ?? k);
    // ...
  }
}
```

### Anti-Patterns to Avoid
- **탭마다 별도 라우트 사용하지 말 것:** 같은 페이지 내 탭이므로 React Router 불필요. URL이 바뀌면 전체 폼 상태 유실 위험.
- **RecommendBatch 타입에 rationale 필드를 선택적(optional)으로만 추가하지 말 것:** 기존 배치와 신규 배치를 명확히 구분하는 타입 가드 필요.
- **탭 콘텐츠를 display:none으로 숨기지 말 것:** 조건부 렌더링(unmount)이 더 깔끔. 단, 입력 상태는 Zustand에 있으므로 unmount해도 데이터 유실 없음.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JSON 파싱 | regex 기반 JSON 추출 | Gemini `responseMimeType: 'application/json'` + `responseSchema` | 기존 regex 방식은 깨지기 쉬움. 구조화 응답이 공식 지원됨 |
| 칩 선택 로직 | 컴포넌트마다 개별 구현 | 범용 `ChipSelector` 컴포넌트 1개 | BrandPersonality + NamingStyle 동일 패턴 |
| 접기/펼치기 | 커스텀 높이 계산 | CSS `grid-template-rows: 0fr/1fr` 패턴 | 기존 RecommendGroup에서 이미 사용 중인 검증된 패턴 |

## Common Pitfalls

### Pitfall 1: Zustand Store 비대화 (500줄 초과)
**What goes wrong:** 신규 필드 8개+ 추가로 useFormStore.ts가 500줄 초과 위험.
**Why it happens:** 기존 4개 섹션 + 신규 4개 섹션 + 키워드 가중치 + 활성 탭.
**How to avoid:** 신규 필드를 기존 FormState 하위에 그룹핑. `analysis: { competitors, usp }`, `identity: { marketTrend, brandPersonality }`, `expression: { namingStyle, languageConstraint }` 형태로 섹션별 네스팅. 또는 별도 `useWizardStore.ts` 분리.
**Warning signs:** useFormStore.ts가 200줄 이상이면 분리 고려.

### Pitfall 2: 기존 RecommendBatch 타입 호환성
**What goes wrong:** Rationale 필드 추가 시 기존 로컬스토리지 배치 데이터와 호환 불가.
**Why it happens:** Zustand persist로 localStorage에 저장된 기존 배치에는 rationale 필드가 없음.
**How to avoid:** (1) RecommendBatch에 optional `rationale?: RationaleData` 추가, (2) persist 마이그레이션 버전을 v2 -> v3으로 올리기, (3) UI에서 rationale 없으면 확장 비활성화.
**Warning signs:** 새 배포 후 기존 사용자가 카드 클릭 시 에러.

### Pitfall 3: Gemini 구조화 응답 실패
**What goes wrong:** `responseSchema` 사용 시 모델이 스키마를 100% 따르지 않을 수 있음.
**Why it happens:** 복잡한 스키마이거나 한국어 프롬프트와 영문 스키마 혼합.
**How to avoid:** (1) fallback으로 기존 regex 파싱 유지, (2) validityScore 범위(0~100) 검증 로직, (3) try-catch + 재시도.
**Warning signs:** 파싱 에러 빈도 증가.

### Pitfall 4: 키워드 가중치의 프롬프트 반영
**What goes wrong:** 슬라이더 값을 프롬프트에 반영했지만 AI가 실제로 가중치를 존중하지 않음.
**Why it happens:** LLM은 "가중치 5: 키워드A, 가중치 1: 키워드B"를 완벽하게 수치적으로 처리하지 못함.
**How to avoid:** 가중치를 수치가 아닌 자연어로 변환: "매우 중요: 키워드A", "참고 수준: 키워드B". 높은 가중치 키워드를 프롬프트에서 반복/강조.
**Warning signs:** 가중치 변경해도 결과 차이가 미미.

### Pitfall 5: 탭 전환 시 추천 버튼 상태
**What goes wrong:** 분석 탭에서 입력 후 정체성 탭으로 이동하면 추천 버튼이 비활성화.
**Why it happens:** 각 탭의 `hasInput` 체크가 해당 탭 필드만 확인.
**How to avoid:** 추천 버튼은 전체 폼에서 하나라도 입력되었으면 활성화. 또는 해당 탭 + 이전 탭 데이터 모두 고려.
**Warning signs:** 사용자가 탭 이동할 때마다 추천 버튼이 깜빡.

## Code Examples

### Gemini 프롬프트 고도화 -- 경쟁사/USP 반영 전략 (D-06 Claude 재량)

```typescript
// 경쟁사/USP를 "차별화 지침"으로 프롬프트에 삽입
function buildDifferentiationContext(form: ExtendedFormState): string {
  const parts: string[] = [];

  if (form.analysis.competitors.trim()) {
    parts.push(`[경쟁 환경]\n${form.analysis.competitors}`);
    parts.push('위 경쟁사와 명확히 차별화되는 이름을 만드세요. 비슷한 어감/의미는 피하세요.');
  }

  if (form.analysis.usp.trim()) {
    parts.push(`[핵심 차별점 (USP)]\n${form.analysis.usp}`);
    parts.push('이 차별점이 이름에서 직관적으로 느껴져야 합니다.');
  }

  return parts.length > 0 ? '\n\n' + parts.join('\n') : '';
}
```

### 키워드 가중치 -> 프롬프트 자연어 변환

```typescript
const WEIGHT_LABELS: Record<number, string> = {
  1: '참고 수준',
  2: '보통',
  3: '중요',
  4: '매우 중요',
  5: '최우선 반영',
};

function buildWeightedKeywords(weights: Record<string, number>): string {
  const sorted = Object.entries(weights).sort(([, a], [, b]) => b - a);
  const lines = sorted.map(([keyword, weight]) =>
    `- ${keyword}: ${WEIGHT_LABELS[weight]} (${weight}/5)`
  );
  return `\n\n[키워드 우선순위 — 높은 순서대로 반영하세요]\n${lines.join('\n')}`;
}
```

### RationaleData 타입 정의

```typescript
interface RationaleData {
  validityScore: number;      // 0~100 (%)
  namingTechnique: string;    // "합성어", "은유/상징" 등
  meaningAnalysis: string;    // 의미 분석 설명
  reflectedInputs: string[];  // 반영된 입력 항목명
}

// 확장된 RecommendBatch
interface RecommendBatch {
  id: string;
  names: {
    brandName: string;
    reasoning: string;
    rationale?: RationaleData;  // Phase 8+ 에서만 존재
  }[];
  basedOn: string[];
  createdAt: Date;
  industry?: IndustrySelection;
}
```

### 타당성 점수 산출 -- AI 위임 방식

```typescript
// responseSchema에서 validityScore를 0~100 범위로 요청하되,
// 프롬프트에서 산출 기준을 명시:
const VALIDITY_INSTRUCTION = `
[타당성 점수 산출 기준]
- 입력된 키워드/정보와 브랜드명의 의미적 연관성 (40%)
- 네이밍 기법의 적절성 (20%)  
- 발음 용이성 및 기억성 (20%)
- 업종 특성 반영도 (20%)
각 이름에 0~100 점수를 부여하세요.`;
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| regex JSON 파싱 | `responseMimeType: 'application/json'` + `responseSchema` | @google/genai 1.x | 안정적 구조화 응답, 파싱 에러 제거 |
| 단일 reasoning 문자열 | 구조화된 rationale (점수+기법+분석+반영입력) | Phase 8 신규 | 네이밍 근거의 투명성 향상 |

## Project Constraints (from CLAUDE.md)

- **Tech Stack:** React 19.x + Vite 6.x + TypeScript 5.x + Tailwind CSS 4.x
- **AI:** Gemini 3.1 Pro API (@google/genai)
- **파일 제한:** 모든 소스 파일 500줄 이하
- **언어:** 한국어 UI, 한국어 문서
- **사용 금지:** Next.js, Redux, Material UI, OpenAI API, Pinecone
- **상태 관리:** Zustand
- **아이콘:** Lucide React
- **폰트:** Pretendard

## Open Questions

1. **Gemini 3.1 flash-lite-preview와 responseSchema 호환성**
   - What we know: @google/genai 1.47.0에 responseSchema 지원 확인 (타입 정의에 존재). Gemini Pro/Flash에서 지원됨.
   - What's unclear: `gemini-3.1-flash-lite-preview` 모델이 구조화 응답을 안정적으로 지원하는지 확인 필요.
   - Recommendation: 구현 시 먼저 테스트하고, 실패하면 기존 regex 파싱을 fallback으로 유지.

2. **키워드 추출 범위**
   - What we know: D-05에 따라 키워드 가중치 슬라이더 구현 필요.
   - What's unclear: "키워드"가 필드 라벨(예: "위치", "주력상품")인지, 필드 값의 핵심 단어인지.
   - Recommendation: 필드 라벨을 키워드로 사용 (구현 단순, UX 직관적). 필드 값에서 키워드 추출은 추가 AI 호출이 필요하여 과도함.

## Sources

### Primary (HIGH confidence)
- `C:\BRAND\node_modules\@google\genai\dist\genai.d.ts` -- GenerateContentConfig, responseMimeType, responseSchema 타입 확인
- `C:\BRAND\src\services\gemini.ts` -- 현재 프롬프트 구조 분석
- `C:\BRAND\src\store\useFormStore.ts` -- 현재 Zustand 상태 구조 분석
- `C:\BRAND\src\types\form.ts` -- 현재 타입 정의 분석
- `C:\BRAND\src\components\recommend\RecommendCardItem.tsx` -- 현재 카드 UI 분석
- `C:\BRAND\src\pages\NamingPage.tsx` -- 현재 페이지 구조 분석

### Secondary (MEDIUM confidence)
- Phase 8 UI-SPEC (`.planning/phases/08-strategic-naming-logic-intelligence/08-UI-SPEC.md`) -- 디자인 계약서
- Phase 8 CONTEXT.md -- 사용자 결정사항

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- 기존 스택 확장, 추가 패키지 불필요
- Architecture: HIGH -- 기존 패턴(Zustand, 섹션 컴포넌트) 확장, 코드베이스 직접 분석 완료
- Pitfalls: HIGH -- 기존 코드의 localStorage persist, 타입 시스템, 프롬프트 구조를 직접 확인
- Gemini responseSchema: MEDIUM -- 타입 존재 확인했으나 flash-lite-preview 모델의 실제 동작은 테스트 필요

**Research date:** 2026-04-03
**Valid until:** 2026-05-03 (안정적 스택, 기존 코드 확장)
