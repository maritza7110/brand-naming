# Phase 11: 위저드 탭 UX 재설계 - Research

**Researched:** 2026-04-03
**Domain:** React 19 + TypeScript + Tailwind 4 위저드 UI 리팩토링 (탭 구조 재설계, 섹션 그룹핑)
**Confidence:** HIGH (100% 코드베이스 기반 조사, 외부 라이브러리 의존성 없음)

## Summary

Phase 11은 외부 라이브러리 도입이 전혀 없는 **순수 코드베이스 리팩토링**이다. 기존 3탭 위저드(분석/정체성/표현)를 4탭(분석/정체성/페르소나/표현)으로 재배치하고, `PersonaSection` 하나의 섹션을 5개 그룹 컨테이너로 분리하며, `MarketTrendSection`을 정체성탭→분석탭으로 이동한다.

핵심 변경 파일은 10개 이하로 수렴하며, TabId union type 확장(3→4)이 Zustand persist에 영향을 주지 않는다 — `partialize`가 `batches`와 `resetTimestamp`만 persist하고 `activeTab`은 persist 대상이 아니기 때문에 **마이그레이션 불필요**. 현재 PersonaSection은 43줄이고 FormState 타입/스토어 스키마는 그대로 재사용 가능하다 (필드 분리는 렌더링 레이어에서만 발생).

**Primary recommendation:** PersonaSection을 deprecate하지 말고 4~5개의 작은 컴포넌트(`PersonaIdentityGroup`, `PersonaStrategyGroup`, `PersonaMarketGroup`, `PersonaBenefitsGroup`, `PersonaExperienceGroup`)로 쪼개 새 `PersonaTab.tsx` 안에서 조립한다. Zustand 스키마는 건드리지 않는다.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**D-01:** 4탭 구조 채택: 분석 / 정체성 / 페르소나(NEW) / 표현
  - **분석 탭** (시장 환경): 매장기본(StoreBasic) + 경쟁사 + USP + 시장트렌드(이동)
  - **정체성 탭** (브랜드 내부): 브랜드비전(BrandVision) + 브랜드퍼스널리티(BrandPersonality)
  - **페르소나 탭** (브랜드 성격, 신규): 기존 PersonaSection의 16개 필드를 5그룹 컨테이너로 분리
  - **표현 탭** (네이밍 출력): 제품서비스(Product) + 네이밍스타일 + 언어제약

**D-02:** 탭 네비게이션은 기존 WizardTabs 컴포넌트 유지 + 4칸 균등분할(25%). 슬라이딩 인디케이터 width도 25%로 변경.

**D-03:** TabId 타입에 'persona' 추가. Zustand store의 activeTab 기본값은 'analysis' 유지.

**D-04:** MarketTrendSection을 정체성 탭에서 분석 탭으로 이동. 시장트렌드는 외부 환경 분석이므로 분석 탭이 자연스러움.

**D-05:** 기존 페르소나 앱(persona-pearl.vercel.app)의 FIELD_METADATA 카테고리 구분을 그대로 적용:
  1. **브랜드 정체성 (Identity & Visual)** — 철학, 슬로건, 브랜드멘트, 브랜드키워드
  2. **전략 & 경쟁력 (Strategy & Competitiveness)** — 핵심기술, 핵심전략, 비교우위
  3. **고객 & 시장 (Market & Customer)** — 고객정의, 고객가치, 고객문화창조
  4. **혜택 & 가치 (Benefits & Value)** — 품질수준, 가격수준, 기능적혜택, 경험적혜택, 상징적혜택
  5. **고객 경험 (Experience & Management)** — 멤버쉽철학

**D-06:** 5그룹 모두 펼쳐서 스크롤 — 아코디언 접기/펼치기 없이 컨테이너 헤더로 구분. 전부 보이는 상태.

**D-07:** 각 그룹은 기존 섹션 컨테이너 스타일(rounded-2xl, bg/border)과 SectionHeader 패턴 재사용.

**D-08:** 분석탭(경쟁사/USP)과 페르소나탭(전략&경쟁력 그룹)의 중복은 **관점 차이를 레이블/placeholder로 명시**하여 해소:
  - 분석탭 경쟁사: "시장 현황 관점" — 경쟁사가 누구이고 어떤 USP가 있는지 (외부 분석)
  - 페르소나탭 전략&경쟁력: "브랜드 내부 관점" — 우리만의 기술/전략/우위는 무엇인지 (내부 정의)
  - 구체적인 placeholder 문구는 Claude 재량

### Claude's Discretion
- 각 페르소나 그룹 컨테이너의 헤더 디자인 (아이콘, 색상 차별화 여부)
- 페르소나 탭 내 5그룹 간 간격 및 시각적 구분 강도
- 중복 필드의 구체적인 placeholder/가이드 텍스트 문구
- 4탭 모바일 반응형 처리 (기존 패턴 따름)
- 각 탭의 KeywordWeightSlider/RecommendButton 배치는 기존 패턴 유지

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

## Project Constraints (from CLAUDE.md)

- **언어:** 한국어 UI, 한국어 문서, 한국어 커밋 메시지
- **파일 제한:** 모든 소스 파일 500줄 이하 (현재 분리 계획은 넉넉히 준수)
- **Tech Stack:** React 19.x / Vite 6.x / TypeScript 5.x / Tailwind CSS 4.x / Lucide React 0.5x / Pretendard
- **금지 스택:** Next.js, Redux, MUI/AntD, OpenAI — 무관 (이 phase는 외부 의존성 추가 없음)
- **GSD 워크플로우:** Edit/Write는 반드시 GSD 명령을 통해서만 실행

## Current State (3-Tab Wizard Anatomy)

파일별 책임 및 현재 구조 — Phase 8에서 확립된 3탭 패턴.

### `src/types/form.ts` (112줄)
```ts
export type TabId = 'analysis' | 'identity' | 'expression';
```
- `PersonaState`: 16개 string 필드 (philosophy, slogan, coreTechnology, coreStrategy, brandMent, customerDefinition, customerValue, customerCultureCreation, competitiveAdvantage, qualityLevel, priceLevel, functionalBenefit, experientialBenefit, symbolicBenefit, brandKeyword, membershipPhilosophy)
- `AnalysisState`: `{ competitors, usp }`
- `IdentityState`: `{ marketTrend, brandPersonality[] }` — marketTrend는 현재 IdentityState에 포함되지만, 분석탭으로 **이동 후에도 타입은 그대로 IdentityState에 남긴다** (D-04는 렌더링 위치만 이동, 스키마는 건드리지 않음 — 보수적 선택).
- `ExpressionState`: `{ namingStyle[], languageConstraint }`

### `src/store/useFormStore.ts` (222줄)
- Zustand persist **version: 3**, `name: 'brand-naming-data'`
- `partialize`는 `batches`, `resetTimestamp` 두 필드만 persist — **`activeTab`은 persist되지 않음**
- `activeTab` 기본값: `'analysis'`
- `updateIdentityText('marketTrend', v)`: marketTrend는 `identity.marketTrend`로 저장되며, 이 액션은 MarketTrendSection이 분석탭으로 이동해도 동일하게 재사용 가능

### `src/components/wizard/WizardTabs.tsx` (53줄)
- `TABS: Tab[]` 배열에 3개 탭 하드코딩
- 인디케이터: `width: ${100 / 3}%`, `transform: translateX(${activeIndex * 100}%)`
- 각 탭 버튼: `flex-1 h-[44px] text-[14px]` — flex-1이므로 탭 개수와 무관하게 균등분할 자동 작동
- sticky top-0 래핑은 InputPanel에서 담당 (`sticky top-0 z-10 bg-[#2C2825] -mx-5 lg:-mx-8`)

### `src/components/wizard/AnalysisTab.tsx` (77줄)
- 렌더: `<StoreBasicSection /> <CompetitorSection /> <USPSection />` + KeywordWeightSlider + RecommendButton
- 키워드 추출 로직: storeBasic(업종/위치/매장규모/주력상품/가격대/타겟고객) + analysis(경쟁사/USP)
- **변경 후 추가:** `<MarketTrendSection />` + 키워드에 `시장트렌드` 항목 추가

### `src/components/wizard/IdentityTab.tsx` (90줄)
- 현재 렌더: `<BrandVisionSection /> <PersonaSection /> <MarketTrendSection /> <BrandPersonalitySection />`
- **변경 후:** `<BrandVisionSection /> <BrandPersonalitySection />` 만 남긴다
- `PERSONA_LABELS` 상수 16개 — 페르소나탭으로 이동
- `BRAND_VISION_LABELS` 상수 3개 — 유지
- marketTrend 키워드 추출 로직 → AnalysisTab으로 이동
- brandPersonality 키워드 추출 로직 → 유지

### `src/components/wizard/ExpressionTab.tsx` (82줄)
- **변경 없음** (D-01 확인)

### `src/components/sections/PersonaSection.tsx` (43줄)
- 현재: 단일 `<section>` 에 16개 TextField를 배열 `F.map()`으로 렌더
- 각 TextField에 `<MiniRecommendButton />` 라벨 액션 — 각 필드별 즉시 추천 가능
- **변경:** 이 파일은 삭제되지 않고 **Deprecated 상태로 남기거나**, 5개 그룹 컴포넌트로 분해 후 완전 제거. 권장: 제거 + 5개 신규 그룹 컴포넌트.

### `src/components/sections/MarketTrendSection.tsx` (21줄)
- 현재 `rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]` + SectionHeader + TextArea
- `useFormStore(s => s.identity.marketTrend)` 및 `updateIdentityText('marketTrend', v)` 사용
- **변경 없음** — IdentityTab에서 import만 제거하고 AnalysisTab에서 import 추가

### `src/pages/NamingPage.tsx` (190줄)
- `{activeTab === 'analysis' && ... }` 3개 분기 — 4번째 분기 추가 필요
- `import { AnalysisTab, IdentityTab, ExpressionTab }` + `PersonaTab` 신규 import
- WizardTabs에 `activeTab`/`setActiveTab` 전달 — 변경 없음

### `src/components/layout/InputPanel.tsx` (87줄)
- `tabBar` prop으로 WizardTabs 수신 — 변경 없음

## Canonical Persona Categories (reference app → our app)

**Source:** `C:/persona/brand/types.ts` line 65 `FIELD_METADATA` array (17 entries, 1 is `brandName` which we exclude).

**⚠️ Discrepancy note:** Reference app's `FIELD_METADATA` puts `keywords` in `Experience & Management` category. CONTEXT.md D-05 places `브랜드키워드` in **Identity & Visual** group. CONTEXT.md D-05 is authoritative (locked decision) — follow CONTEXT, not the reference file.

Also, reference app uses different field keys (`comparativeAdvantage`, `targetAudience`, `genZValue`, `customerCulture`, `customerManagement`) than our PersonaState (`competitiveAdvantage`, `customerDefinition`, `customerValue`, `customerCultureCreation`, `membershipPhilosophy`). **Do not rename our fields** — map by semantic correspondence.

### Final Mapping (authoritative for Phase 11)

| # | Group (D-05 order) | 한국어 라벨 | PersonaState key | 예시 placeholder (기존) |
|---|---|---|---|---|
| **1** | **브랜드 정체성 (Identity & Visual)** | | | |
| 1.1 | | 브랜드철학 | `philosophy` | 좋은 원두, 정직한 한 잔 |
| 1.2 | | 슬로건 | `slogan` | 하루의 시작, 당신만의 한 잔 |
| 1.3 | | 브랜드 멘트 | `brandMent` | 커피 한 잔에 담긴 진심 |
| 1.4 | | 키워드 | `brandKeyword` | 정직, 따뜻함, 장인정신 |
| **2** | **전략 & 경쟁력 (Strategy & Competitiveness)** | | | |
| 2.1 | | 핵심기술 | `coreTechnology` | 산지 직거래 로스팅 |
| 2.2 | | 핵심전략 | `coreStrategy` | 지역 밀착 커뮤니티 브랜딩 |
| 2.3 | | 비교우위 | `competitiveAdvantage` | 핸드드립 전문, 아늑한 인테리어 |
| **3** | **고객 & 시장 (Market & Customer)** | | | |
| 3.1 | | 고객정의 | `customerDefinition` | 20~40대, 품질 좋은 커피를 원하는 고객 |
| 3.2 | | 고객가치 | `customerValue` | 일상 속 여유로운 커피 한 잔 |
| 3.3 | | 고객문화창조 | `customerCultureCreation` | 동네 사랑방 같은 커피 문화 |
| **4** | **혜택 & 가치 (Benefits & Value)** | | | |
| 4.1 | | 품질수준 | `qualityLevel` | 스페셜티 등급 원두 |
| 4.2 | | 가격수준 | `priceLevel` | 아메리카노 3,500원 |
| 4.3 | | 기능적혜택 | `functionalBenefit` | 출근길 빠른 픽업 |
| 4.4 | | 경험적혜택 | `experientialBenefit` | 아늑한 공간, 바리스타와의 대화 |
| 4.5 | | 상징적혜택 | `symbolicBenefit` | 감각적 라이프스타일 |
| **5** | **고객 경험 (Experience & Management)** | | | |
| 5.1 | | 멤버쉽 철학 | `membershipPhilosophy` | 단골에게 특별한 경험과 감사 |

**Total:** 16 fields = 4 + 3 + 3 + 5 + 1 — D-05와 완벽 일치.

## Change Impact Map

### Files to CREATE
| Path | Purpose | Est. LOC |
|---|---|---|
| `src/components/wizard/PersonaTab.tsx` | 페르소나 탭 루트. 5개 그룹 컨테이너 렌더 + 키워드 슬라이더 + 추천 버튼 | ~100 |
| `src/components/sections/persona/PersonaIdentityGroup.tsx` | 그룹1: 철학/슬로건/브랜드멘트/키워드 (4 fields) | ~40 |
| `src/components/sections/persona/PersonaStrategyGroup.tsx` | 그룹2: 핵심기술/핵심전략/비교우위 (3 fields) | ~40 |
| `src/components/sections/persona/PersonaMarketGroup.tsx` | 그룹3: 고객정의/고객가치/고객문화창조 (3 fields) | ~40 |
| `src/components/sections/persona/PersonaBenefitsGroup.tsx` | 그룹4: 품질/가격/기능/경험/상징혜택 (5 fields) | ~50 |
| `src/components/sections/persona/PersonaExperienceGroup.tsx` | 그룹5: 멤버쉽 철학 (1 field) | ~30 |

### Files to MODIFY
| Path | Change |
|---|---|
| `src/types/form.ts` | `TabId` union에 `'persona'` 추가 (한 줄) |
| `src/store/useFormStore.ts` | 변경 없음 (activeTab 기본값 'analysis' 유지, persist 스키마 무관) — **확인만** |
| `src/components/wizard/WizardTabs.tsx` | TABS 배열에 `{ id: 'persona', label: '페르소나' }` 추가 (analysis와 identity 사이? **아니다** — D-01 순서는 분석 / 정체성 / 페르소나 / 표현, identity와 expression 사이). 인디케이터 `width: 100/3 → 100/4` = 25% |
| `src/components/wizard/AnalysisTab.tsx` | `<MarketTrendSection />` import + 렌더 추가, 키워드 추출에 `시장트렌드` 추가, hasInput 조건에 `identity.marketTrend` 추가, 경쟁사/USP placeholder 또는 헬퍼 텍스트에 "시장 현황 관점" 명시 |
| `src/components/wizard/IdentityTab.tsx` | `<PersonaSection />`, `<MarketTrendSection />` import + 렌더 제거, `PERSONA_LABELS` 상수 제거, persona 키워드 추출 로직 제거, marketTrend 키워드 추출 제거, hasInput 조건 정리 |
| `src/pages/NamingPage.tsx` | `PersonaTab` import 추가, `{activeTab === 'persona' && ...}` 분기 추가 (identity와 expression 사이) |
| `src/components/sections/CompetitorSection.tsx` | placeholder/헬퍼 텍스트에 "시장 현황 관점" 뉘앙스 반영 (D-08) |
| `src/components/sections/USPSection.tsx` | 동일 |

### Files to DELETE
| Path | Reason |
|---|---|
| `src/components/sections/PersonaSection.tsx` | 5개 그룹 컴포넌트로 완전 대체. 어디서도 import되지 않게 된 후 삭제. |

### Files UNCHANGED (verify only)
- `src/components/wizard/ExpressionTab.tsx`
- `src/components/sections/MarketTrendSection.tsx` (스타일/로직 그대로, import 위치만 바뀜)
- `src/components/sections/BrandPersonalitySection.tsx`
- `src/components/sections/BrandVisionSection.tsx`
- `src/components/sections/StoreBasicSection.tsx`
- `src/components/sections/ProductSection.tsx`
- `src/components/layout/InputPanel.tsx`
- `src/hooks/useRecommend.ts` (persona 필드는 이미 form에 포함되어 자동으로 프롬프트에 전달됨)
- `src/services/gemini.ts` (필드 구조 변경 없음 → 프롬프트 영향 없음)

## Component Design

### 1. PersonaTab.tsx (새 루트 탭 컴포넌트)

```tsx
import { useFormStore } from '../../store/useFormStore';
import { PersonaIdentityGroup } from '../sections/persona/PersonaIdentityGroup';
import { PersonaStrategyGroup } from '../sections/persona/PersonaStrategyGroup';
import { PersonaMarketGroup } from '../sections/persona/PersonaMarketGroup';
import { PersonaBenefitsGroup } from '../sections/persona/PersonaBenefitsGroup';
import { PersonaExperienceGroup } from '../sections/persona/PersonaExperienceGroup';
import { KeywordWeightSlider } from '../ui/KeywordWeightSlider';
import { RecommendButton } from '../ui/RecommendButton';
import { useRecommend } from '../../hooks/useRecommend';

const PERSONA_LABELS: Record<string, string> = {
  philosophy: '브랜드철학',
  slogan: '슬로건',
  brandMent: '브랜드멘트',
  brandKeyword: '브랜드키워드',
  coreTechnology: '핵심기술',
  coreStrategy: '핵심전략',
  competitiveAdvantage: '비교우위',
  customerDefinition: '고객정의',
  customerValue: '고객가치',
  customerCultureCreation: '고객문화창조',
  qualityLevel: '품질수준',
  priceLevel: '가격수준',
  functionalBenefit: '기능적혜택',
  experientialBenefit: '경험적혜택',
  symbolicBenefit: '상징적혜택',
  membershipPhilosophy: '멤버쉽철학',
};

export function PersonaTab() {
  const persona = useFormStore((s) => s.persona);
  const keywordWeights = useFormStore((s) => s.keywordWeights);
  const setKeywordWeight = useFormStore((s) => s.setKeywordWeight);
  const { recommend, isLoading } = useRecommend();

  const keywords: { label: string; weight: number }[] = [];
  Object.entries(persona).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim() !== '') {
      const label = PERSONA_LABELS[key] ?? key;
      keywords.push({ label, weight: keywordWeights[label] ?? 3 });
    }
  });

  const hasInput = Object.values(persona).some((v) => v.trim() !== '');

  return (
    <div className="space-y-5">
      <PersonaIdentityGroup />
      <PersonaStrategyGroup />
      <PersonaMarketGroup />
      <PersonaBenefitsGroup />
      <PersonaExperienceGroup />
      {keywords.length > 0 && (
        <div className="rounded-2xl bg-[#363230] p-5 lg:p-7 border border-[#4A4440]">
          <KeywordWeightSlider keywords={keywords} onChange={setKeywordWeight} />
        </div>
      )}
      <div className="flex justify-end">
        <RecommendButton onClick={recommend} loading={isLoading} disabled={!hasInput} />
      </div>
    </div>
  );
}
```

### 2. Group container template (all 5 groups share this shape)

```tsx
// src/components/sections/persona/PersonaIdentityGroup.tsx
import { useFormStore } from '../../../store/useFormStore';
import { useRecommend } from '../../../hooks/useRecommend';
import { SectionHeader } from '../../ui/SectionHeader';
import { MiniRecommendButton } from '../../ui/MiniRecommendButton';
import { TextField } from '../../ui/TextField';
import type { PersonaState } from '../../../types/form';

const FIELDS: { key: keyof PersonaState; label: string; ph: string }[] = [
  { key: 'philosophy', label: '브랜드철학', ph: '좋은 원두, 정직한 한 잔' },
  { key: 'slogan', label: '슬로건', ph: '하루의 시작, 당신만의 한 잔' },
  { key: 'brandMent', label: '브랜드 멘트', ph: '커피 한 잔에 담긴 진심' },
  { key: 'brandKeyword', label: '키워드', ph: '정직, 따뜻함, 장인정신' },
];

export function PersonaIdentityGroup() {
  const p = useFormStore((s) => s.persona);
  const u = useFormStore((s) => s.updatePersona);
  const { recommend, isLoading } = useRecommend();

  return (
    <section className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
      <SectionHeader title="브랜드 정체성" />
      <div className="space-y-4">
        {FIELDS.map(({ key, label, ph }) => (
          <TextField
            key={key}
            label={label}
            value={p[key]}
            onChange={(v) => u(key, v)}
            placeholder={ph}
            labelAction={
              <MiniRecommendButton
                onClick={recommend}
                loading={isLoading}
                disabled={!p[key].trim()}
              />
            }
          />
        ))}
      </div>
    </section>
  );
}
```

각 그룹은 `FIELDS` 배열만 다르고 나머지는 동일. 5개 파일 모두 ~40줄 내외 → 500줄 한도 여유롭게 충족.

### 3. WizardTabs 4-wide math

```tsx
const TABS: Tab[] = [
  { id: 'analysis', label: '분석' },
  { id: 'identity', label: '정체성' },
  { id: 'persona', label: '페르소나' },
  { id: 'expression', label: '표현' },
];

// 인디케이터
<span
  className="absolute bottom-0 h-[2px] bg-[#B48C50]"
  style={{
    width: `${100 / 4}%`,                    // 33.33% → 25%
    transform: `translateX(${activeIndex * 100}%)`,  // 공식 동일
    transition: 'transform 300ms ease-in-out',
  }}
/>
```

`flex-1`이 버튼 너비를 자동 균등 분할하므로 버튼 CSS는 변경 불필요. `100 / TABS.length`로 하드코딩을 제거하면 더 안전하지만, 단순함을 위해 25%로 명시해도 무방 (Claude 재량).

### 4. Field deduplication labeling (D-08)

**분석탭 — "시장 현황 관점" (외부 분석)**

| 필드 | 현재 placeholder | 변경 제안 |
|---|---|---|
| 경쟁사 분석 | "주요 경쟁 브랜드명과 그 특징을 적어주세요 (예: '스타벅스 - 프리미엄 이미지, 이디야 - 가성비')" | 유지 + SectionHeader 부제 또는 헬퍼 텍스트 추가: "시장 현황 관점 — 외부에서 본 경쟁 구도" |
| USP (차별화 요소) | "다른 브랜드와 구별되는 핵심 차별점을 적어주세요 (예: '로컬 원두 직접 로스팅')" | "시장 현황 관점 — 시장에서 어떤 차별점으로 비춰지는가" 명시 |

**페르소나탭 — "브랜드 내부 관점" (내부 정의)**

| 필드 | 권장 placeholder |
|---|---|
| 핵심기술 (coreTechnology) | "브랜드 내부 관점 — 우리만의 기술/노하우 (예: 산지 직거래 로스팅)" |
| 핵심전략 (coreStrategy) | "브랜드 내부 관점 — 우리가 이기기 위한 전략 (예: 지역 밀착 커뮤니티 브랜딩)" |
| 비교우위 (competitiveAdvantage) | "브랜드 내부 관점 — 우리의 압도적 한 가지 (예: 핸드드립 전문, 아늑한 인테리어)" |

실제 문구는 Claude 재량(D-08). 그룹 컨테이너 SectionHeader 아래에 회색 부제 텍스트로 "브랜드 내부 관점" 한 줄을 넣는 것도 유효한 선택지.

### 5. Tab-level recommend flow

**현재 패턴 유지** (Phase 8 D-03). 각 탭이 자체 KeywordWeightSlider + RecommendButton을 가진다. 페르소나 탭도 동일 패턴:

- `PersonaTab.tsx` 말미에 `KeywordWeightSlider`(페르소나 16개 중 입력된 키워드만) + `RecommendButton` 배치
- `useRecommend()` 훅은 전역 form state 전체를 읽으므로 탭별 분기 필요 없음
- `generateBrandNames()` 역시 변경 불필요 — persona 필드는 이미 프롬프트에 포함됨

## Migration & State

### TabId 타입 확장

```ts
// src/types/form.ts line 53
export type TabId = 'analysis' | 'identity' | 'persona' | 'expression';
```

**TypeScript 영향 분석** (전체 사용처 4곳):
1. `src/types/form.ts` — 정의 위치. 변경.
2. `src/store/useFormStore.ts` — `activeTab: 'analysis' as TabId` (line 108, 160, 173). **변경 없음** — 새 union에도 'analysis' 포함.
3. `src/components/wizard/WizardTabs.tsx` — `TABS: Tab[]` 배열. 엔트리 추가.
4. `src/pages/NamingPage.tsx` — `activeTab === 'analysis' | 'identity' | 'expression'` 비교. 'persona' 분기 추가.

### Zustand Persist 영향

```ts
// useFormStore.ts line 186
partialize: (state) => ({
  batches: state.batches,
  resetTimestamp: state.resetTimestamp,
}),
```

**결론: persist 마이그레이션 불필요.**
- `activeTab`은 partialize에 포함되지 않으므로 localStorage에 저장되지 않는다.
- 구버전 localStorage에 `activeTab: 'identity'`가 있었다 하더라도, persist가 읽지 않으므로 stale 값 문제 없음.
- `persona` 스키마(PersonaState의 16개 필드)는 전혀 변경되지 않으므로 기존 데이터 호환성 100% 보장.
- **version 3 유지**, migrate 함수 변경 없음.

**만일 version bump 이 필요하다고 오판할 경우의 함정:**
- version 3 → 4 bump + 빈 migrate는 해롭지 않지만 불필요한 변경. 하지 말 것.

### 기본값

- `activeTab` 기본값은 `'analysis'` 유지 (D-03 명시)
- `resetAll()`, `resetNaming()`의 activeTab 리셋값도 `'analysis'` 유지

## Pitfalls & Edge Cases

### P1. Reference app FIELD_METADATA의 keywords 카테고리 불일치
**증상:** 참조 파일(`C:/persona/brand/types.ts`)은 `keywords`를 **Experience & Management**에 배치.
**실제:** CONTEXT.md D-05는 **Identity & Visual**에 배치 (brandKeyword로).
**조치:** CONTEXT(locked decision)를 따른다. 참조 파일은 참고용일 뿐 권위가 아니다.

### P2. Reference app 필드 키 불일치
참조 앱: `targetAudience`, `comparativeAdvantage`, `customerCulture`, `customerManagement`, `genZValue`
우리 앱: `customerDefinition`, `competitiveAdvantage`, `customerCultureCreation`, `membershipPhilosophy`, (없음 — 우리는 고객가치가 `customerValue`)
**조치:** 우리 PersonaState 필드 키를 **절대 변경하지 않는다**. 스키마 변경 시 persist migrate 필요하고 기존 데이터 손실 위험. 의미로만 매핑.

### P3. PersonaSection.tsx 삭제 타이밍
**함정:** 5개 그룹 컴포넌트를 만들기 전에 PersonaSection을 삭제하면 IdentityTab 컴파일 에러.
**조치:** (1) 5개 그룹 컴포넌트 생성 → (2) PersonaTab 생성 → (3) IdentityTab에서 import 제거 → (4) NamingPage에서 PersonaTab 라우팅 → (5) 전체 빌드 green 확인 → (6) PersonaSection.tsx 삭제. 이 순서 준수.

### P4. MarketTrendSection 이동 시 키워드 추출 이중 계산
**함정:** AnalysisTab에 `시장트렌드` 키워드를 추가하면서 IdentityTab에서 제거하지 않으면 중복.
**조치:** 두 파일 동시 수정. 테스트: `identity.marketTrend`에 값 입력 후 AnalysisTab의 KeywordWeightSlider에만 표시되는지 확인.

### P5. sticky top-0 WizardTabs 레이아웃 겹침
**현재:** InputPanel이 `sticky top-0 z-10 bg-[#2C2825] -mx-5 lg:-mx-8`로 탭바를 래핑.
**4탭 시:** 모바일(<640px)에서 '페르소나' 라벨(3 chars) + 나머지 3개가 한 줄에 들어가는지 확인. `flex-1` + `text-[14px]`면 375px 기준 각 93px — 충분.
**조치:** 모바일에서 별도 처리 불필요. 라벨을 2자로 줄일 필요 없음.

### P6. 슬라이딩 인디케이터 activeIndex 계산
**함정:** `activeIndex = TABS.findIndex(t => t.id === activeTab)` — 만약 구버전 localStorage에 `'identity'`가 저장되어 있고 새 순서(analysis/identity/persona/expression)에서 index 1이 `identity`이므로 정상. 단, **TABS 배열 순서를 D-01과 일치**시켜야 한다.
**올바른 순서:** `analysis(0) → identity(1) → persona(2) → expression(3)`

### P7. Tailwind arbitrary color 클래스 purge
**함정:** 새 파일이 `bg-[#E8E4DE]`, `border-[#C5BFB7]` 등 arbitrary value 사용. Tailwind 4 JIT는 정적 분석 기반이므로 템플릿 리터럴로 클래스를 조립하면 purge됨.
**조치:** 기존 섹션 파일과 **동일한 문자열**로 하드코딩. 동적 조립 금지.

### P8. D-06 "5그룹 모두 펼쳐서 스크롤"
**함정:** 아코디언 패턴(`grid-template-rows 0fr/1fr`)을 적용하고 싶은 유혹.
**조치:** 명시적으로 **금지**. 그룹 컨테이너는 항상 펼쳐진 상태 — `<section>`으로 단순 렌더만 한다.

### P9. 빈 persona 필드의 MiniRecommendButton 동작
**현재:** PersonaSection은 각 TextField에 `disabled={!p[key].trim()}` 적용. 5개 그룹으로 쪼개도 동일 패턴 유지. `useRecommend`는 전체 form state를 읽으므로 한 필드에서 추천을 눌러도 다른 탭 데이터까지 반영됨 — 의도된 동작.

### P10. 파일 크기 500줄 한도
- 모든 신규 파일 <100줄 예상
- AnalysisTab (현재 77줄) + MarketTrendSection 키워드 추가 → ~90줄
- IdentityTab (현재 90줄) → 페르소나 로직 제거 → ~50줄로 **감소**
- PersonaTab (신규) → ~100줄
- 5개 그룹 파일 → 각 30~50줄
- **결론:** 한도 위반 리스크 전혀 없음.

### P11. 테스트 / E2E selector 영향
**확인 결과:** 현재 프로젝트에는 단위 테스트/E2E 테스트 인프라 없음 (package.json에 test script 없고 `src/**/*.test.*` 없음). 따라서 셀렉터 깨짐 리스크 없음. 수동 검증(manual smoke)으로 충분.

## Open Questions

1. **페르소나 그룹 간 시각적 구분 강도** — 5개 그룹 모두 동일 배경색(`#E8E4DE`)을 쓸지, 살짝씩 색상/아이콘을 달리할지. CONTEXT D-07은 "기존 스타일 재사용" + Claude 재량으로 남김. **권장:** 첫 이터레이션은 동일 스타일 + SectionHeader 제목만으로 구분 → 실사용 피드백 후 조정.

2. **SectionHeader 확장 여부** — 현재 `title: string` 하나만 받음. D-08의 "브랜드 내부 관점" 같은 부제를 넣으려면 `subtitle?: string` prop 추가가 필요. 추가 옵션: (a) SectionHeader 확장, (b) 그룹 컨테이너 내부에 별도 `<p>` 태그. **권장:** SectionHeader에 optional `subtitle` 추가 (1줄 변경).

3. **경쟁사/USP placeholder의 한국어 톤** — "시장 현황 관점"이라는 표현이 UI에서 어색할 수 있음. 대안: 섹션 설명 텍스트로 풀어쓰기 ("외부에서 본 경쟁 구도"). 구체 문구는 Claude 재량(D-08).

## Sources

### Primary (HIGH confidence)
- `C:/BRAND/.planning/phases/11-ux/11-CONTEXT.md` — 잠긴 결정사항 D-01~D-08
- `C:/BRAND/src/types/form.ts` (line 53, 33-50) — TabId, PersonaState 정의
- `C:/BRAND/src/store/useFormStore.ts` (line 108, 186-201) — activeTab, persist 설정
- `C:/BRAND/src/components/wizard/WizardTabs.tsx` (line 8-12, 46-47) — TABS 배열, 인디케이터 math
- `C:/BRAND/src/components/wizard/AnalysisTab.tsx`
- `C:/BRAND/src/components/wizard/IdentityTab.tsx`
- `C:/BRAND/src/components/wizard/ExpressionTab.tsx`
- `C:/BRAND/src/components/sections/PersonaSection.tsx` (전체 43줄)
- `C:/BRAND/src/components/sections/MarketTrendSection.tsx`
- `C:/BRAND/src/components/sections/CompetitorSection.tsx`
- `C:/BRAND/src/components/sections/USPSection.tsx`
- `C:/BRAND/src/pages/NamingPage.tsx`
- `C:/BRAND/src/components/layout/InputPanel.tsx`
- `C:/BRAND/src/components/ui/SectionHeader.tsx`
- `C:/BRAND/src/hooks/useRecommend.ts`
- `C:/persona/brand/types.ts` (line 65-308) — FIELD_METADATA 5-category 원본

### Secondary (MEDIUM confidence)
- `C:/BRAND/.planning/phases/08-strategic-naming-logic-intelligence/08-CONTEXT.md` — Phase 8 3탭 결정 배경

### Tertiary (LOW confidence)
None.

## Metadata

**Confidence breakdown:**
- 현재 코드 상태: **HIGH** — 전체 파일 직접 읽음
- 필드→그룹 매핑: **HIGH** — CONTEXT D-05 잠긴 결정 + 참조 파일로 교차 확인
- Persist 영향 분석: **HIGH** — partialize 코드 직접 검증
- 변경 영향 범위: **HIGH** — TabId grep 전수 조사 완료
- Pitfalls: **HIGH** — 파일 크기, 이동/삭제 순서, 키워드 중복 모두 코드 근거

**Research date:** 2026-04-03
**Valid until:** 2026-05-03 (30일 — 외부 라이브러리 의존성 없는 내부 리팩토링이므로 장기 유효)

---

## RESEARCH COMPLETE
