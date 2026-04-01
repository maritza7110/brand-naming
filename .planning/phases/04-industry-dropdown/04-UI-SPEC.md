---
phase: 4
slug: industry-dropdown
status: draft
shadcn_initialized: false
preset: none
created: 2026-04-01
---

# Phase 4 -- UI Design Contract

> 산업분류 계층형 드롭다운의 시각/인터랙션 계약. gsd-ui-researcher 생성, gsd-ui-checker 검증 대상.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (커스텀 Tailwind CSS) |
| Preset | not applicable |
| Component library | none -- 자체 ui/ 컴포넌트 (Dropdown, TextArea, SectionHeader, RecommendButton) |
| Icon library | Lucide React 0.5x |
| Font | Pretendard Variable (CDN) |

> Source: Phase 1 UI-SPEC, CLAUDE.md. 이 Phase는 기존 컴포넌트를 재사용하며 새 UI 컴포넌트를 추가하지 않는다.

---

## Spacing Scale

Phase 1에서 확립된 스케일을 그대로 유지한다.

| Token | Value | Usage (Phase 4 specific) |
|-------|-------|--------------------------|
| xs | 4px | 아이콘-텍스트 간격 |
| sm | 8px | 라벨-입력 간격 (`mb-1.5`에 해당) |
| md | 16px | grid gap (`gap-4`), 드롭다운 간 간격 |
| lg | 24px | 필드 그룹 간 간격 (`space-y-4` 기존 패턴 유지) |
| xl | 32px | 섹션 내부 패딩 (`p-7`에 해당) |
| 2xl | 48px | 섹션 간 간격 |
| 3xl | 64px | 페이지 레벨 간격 |

Exceptions: none

> Source: Phase 1 UI-SPEC spacing scale. 기존 StoreBasicSection의 `p-7`, `gap-4`, `space-y-4` 패턴 유지.

---

## Typography

Phase 1에서 확립된 타이포그래피를 그대로 유지한다.

| Role | Size | Weight | Line Height | Usage (Phase 4 specific) |
|------|------|--------|-------------|--------------------------|
| Display | 26px | 700 (Bold) | 1.2 | 미사용 (Phase 4 범위 외) |
| Heading | 14px | 700 (Bold) | 1.5 | 섹션 헤더 "매장 기본" |
| Body | 14px | 400 (Regular) | 1.6 | 드롭다운 선택값, 비고 입력 텍스트 |
| Label | 12px | 600 (SemiBold) | 1.5 | 드롭다운 라벨 ("대분류", "중분류", "소분류", "비고") |

Font family: `'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif`

> Source: 실제 구현 코드 분석. Dropdown label `text-[12px] font-semibold`, select `text-[14px]`, SectionHeader `text-[14px] font-bold`.

---

## Color

실제 구현된 다크 테마 색상을 기준으로 한다.

| Role | Value | Usage (Phase 4 specific) |
|------|-------|--------------------------|
| Dominant (60%) | `#2C2825` | 앱 배경, 추천 패널 배경 |
| Secondary (30%) | `#E8E4DE` | 입력 섹션 카드 배경 (`rounded-2xl bg-[#E8E4DE]`) |
| Accent (10%) | `#B48C50` | 아래 "Accent reserved for" 참조 |
| Destructive | 미사용 | Phase 4에서 파괴적 액션 없음 |

### 세부 색상 토큰 (구현 참조)

| Token | Value | Usage |
|-------|-------|-------|
| input-bg (dropdown) | `#4A4640` | 드롭다운 select 배경 |
| input-bg (textarea) | `#F5F3F0` | 비고 텍스트 영역 배경 |
| input-border | `#4A4640` | 드롭다운/텍스트 영역 기본 보더 |
| input-border-hover | `#A09890` | 호버 시 보더 |
| input-border-focus | `#B48C50` | 포커스 시 보더 (gold accent) |
| input-focus-bg | `#504A44` | 포커스 시 배경 |
| text-primary (on light) | `#2C2825` | 라이트 섹션 카드 위 텍스트 |
| text-primary (on dark) | `#E8E2DA` | 다크 배경 위 텍스트 |
| text-label | `#5A5550` | 드롭다운 라벨 텍스트 |
| text-placeholder | `#B5AFA8` | 미선택 드롭다운 텍스트, placeholder |
| text-selected | `#FFFFFF` | 선택된 드롭다운 값 |
| icon-muted | `#8A8178` | ChevronDown 아이콘 |
| divider | `#C5BFB7` | 섹션 카드 보더 |
| section-divider | `#D0CAC2` | 섹션 헤더 하단 구분선 |
| disabled-opacity | `0.40` | 비활성 드롭다운/텍스트 영역 |

**Accent reserved for (specific elements only):**
- 추천 받기 버튼 배경 (`bg-[#B48C50]`)
- 추천 받기 버튼 호버 (`hover:bg-[#C49A5C]`)
- Input 포커스 보더 (`focus:border-[#B48C50]`)
- 섹션 헤더 좌측 장식 바 (`bg-[#B48C50]`)
- 추천 카드 브랜드명 텍스트 (`text-[#B48C50]`)

> Source: 실제 구현 코드 분석 -- Dropdown.tsx, TextArea.tsx, SectionHeader.tsx, StoreBasicSection.tsx, RecommendButton.tsx, RecommendCardItem.tsx.

---

## Visual Focal Point

Phase 4에서의 시각적 초점: 2x2 grid로 배치된 4개 입력 요소(대분류, 중분류, 소분류, 비고)가 한 눈에 계층 구조를 전달한다. 상위 미선택 시 하위 요소들이 `opacity-40`으로 흐려지면서 "위에서 아래로, 왼쪽에서 오른쪽으로" 선택 흐름을 시각적으로 안내한다. 유일한 accent 요소인 추천 받기 버튼(`#B48C50`)이 선택 완료 후 최종 액션을 유도한다.

---

## Interaction States

### 계층형 드롭다운 (대분류, 중분류, 소분류)

기존 Dropdown 컴포넌트(`src/components/ui/Dropdown.tsx`)를 그대로 사용한다.

| State | Style | 조건 |
|-------|-------|------|
| Default | `border-[#4A4640] bg-[#4A4640]` | 해당 레벨 활성화 상태 |
| Hover | `border-[#A09890]` + transition 200ms | 활성 상태에서 마우스 오버 |
| Focus | `border-[#B48C50] bg-[#504A44]` + transition 200ms | 키보드/클릭 포커스 |
| Selected | `text-white` | 값이 선택된 상태 |
| Unselected | `text-[#B5AFA8]` (placeholder) | 값 미선택 -- "선택" placeholder 표시 |
| Disabled | `opacity-40 cursor-not-allowed` | 상위 드롭다운 미선택 시 |

### 비고 텍스트 영역

기존 TextArea 컴포넌트(`src/components/ui/TextArea.tsx`)를 그대로 사용한다.

| State | Style | 조건 |
|-------|-------|------|
| Default | `border-[#4A4640] bg-[#F5F3F0] text-[#2C2825]` | 소분류 선택 완료 후 활성 |
| Hover | `border-[#A09890]` + transition 200ms | 활성 상태에서 마우스 오버 |
| Focus | `border-[#B48C50] bg-[#504A44]` + transition 200ms | 키보드/클릭 포커스 |
| Disabled | `opacity-40` | 소분류 미선택 시 |
| Filled | 기본과 동일 | 사용자 입력값 있음 |

### Cascading Reset (D-06)

| Trigger | Effect |
|---------|--------|
| 대분류 변경 | 중분류 = '', 소분류 = '', 비고 = '' -- 중/소분류 disabled, 비고 disabled |
| 중분류 변경 | 소분류 = '', 비고 = '' -- 소분류 enabled (옵션 갱신), 비고 disabled |
| 소분류 변경 | 비고 enabled (값 유지 또는 빈 문자열) |
| 비고 변경 | 다른 드롭다운에 영향 없음 |

> Source: CONTEXT.md D-06, D-07. RESEARCH.md Pattern 3.

---

## Layout Contract

### 전체 레이아웃 (변경 없음)

기존 AppLayout 70/30 분할 유지.

| Property | Value |
|----------|-------|
| Split ratio | 70% left / 30% right (`grid-cols-[7fr_3fr]`) |
| Min width | 1024px (Phase 6에서 제거 예정) |

### 업종 선택 영역 (Phase 4 신규)

기존 StoreBasicSection의 업종 단일 드롭다운 + 규모 드롭다운 행을 4단 계층형 UI로 교체.

| Property | Value | Source |
|----------|-------|--------|
| Grid | `grid grid-cols-2 gap-4` | D-04, D-05 |
| Row 1, Col 1 | 대분류 Dropdown | D-01 |
| Row 1, Col 2 | 중분류 Dropdown | D-01 |
| Row 2, Col 1 | 소분류 Dropdown | D-01 |
| Row 2, Col 2 | 비고 TextArea (rows=1) | D-01, D-02 |

**시각적 배치:**

```
+-------------------+-------------------+
|  대분류           |  중분류           |
|  [select v]       |  [select v]       |
+-------------------+-------------------+
|  소분류           |  비고             |
|  [select v]       |  [textarea]       |
+-------------------+-------------------+
```

> Source: CONTEXT.md D-04 "2열 2행 grid 배치", D-05 "기존 grid-cols-2 패턴과 동일".

### StoreBasicSection 전체 구조

업종 4단 UI가 기존 섹션 상단에 배치되고, 나머지 필드(규모, 주력 상품, 가격대)는 그 아래에 기존 레이아웃으로 유지된다.

```
+-----------------------------------------------+
| [accent bar] 매장 기본                         |
| ─────────────────────────────────── (divider)  |
|                                               |
| [대분류 v]          [중분류 v]                 |
| [소분류 v]          [비고 textarea]            |
|                                               |
| [규모 v]            [가격대 v]                 |
| [주력 상품/서비스 textarea]                    |
|                                               |
|                         [추천 받기 button] --> |
+-----------------------------------------------+
```

**주의:** 기존 코드에서 업종+규모가 같은 `grid-cols-2` 행에 있었다. Phase 4에서 업종이 4칸(2x2)을 차지하므로, 규모는 별도 행으로 이동한다. 가격대와 같은 행에 배치하여 일관성을 유지한다.

---

## Copywriting Contract

| Element | Copy | Source |
|---------|------|--------|
| Primary CTA | 추천 받기 | 기존 유지 |
| 대분류 label | 대분류 | D-01 |
| 중분류 label | 중분류 | D-01 |
| 소분류 label | 소분류 | D-01 |
| 비고 label | 비고 | D-01, D-02 |
| 대분류 placeholder | 선택 | 기존 Dropdown 기본값 |
| 중분류 placeholder | 선택 | 기존 Dropdown 기본값 |
| 소분류 placeholder | 선택 | 기존 Dropdown 기본값 |
| 비고 placeholder | 예: 떡볶이 전문, 고양이카페 | Claude's discretion |
| AI 프롬프트 내 업종 포맷 | 업종: {대분류} > {중분류} > {소분류} (비고: {비고}) | D-08 |
| AI 프롬프트 내 업종 포맷 (비고 없음) | 업종: {대분류} > {중분류} > {소분류} | D-08 |
| AI 프롬프트 내 업종 포맷 (부분 선택) | 업종: {선택된 분류까지만 > 연결} | D-08 |

### Disabled 상태 문구

드롭다운이 disabled일 때 placeholder "선택"이 그대로 표시되며, 추가적인 안내 텍스트는 없다. `opacity-40` 시각 처리로 비활성 상태가 충분히 전달된다 (D-07).

### 에러 상태

Phase 4에는 별도 에러 상태가 없다. 모든 드롭다운은 선택 사항이며, 최소 1개 항목 입력 시 추천 버튼이 활성화되는 기존 로직을 유지한다.

### 파괴적 액션

Phase 4에는 파괴적 액션이 없다. Cascading reset(D-06)은 상위 분류 변경의 자연스러운 결과이며, 확인 대화상자를 표시하지 않는다.

> Source: CONTEXT.md D-01~D-08. RESEARCH.md Example 2, Example 4.

---

## Component Inventory (Phase 4)

### 재사용하는 기존 컴포넌트

| Component | Location | Role in Phase 4 |
|-----------|----------|-----------------|
| Dropdown | `src/components/ui/Dropdown.tsx` | 대분류, 중분류, 소분류 드롭다운 (3개 인스턴스) |
| TextArea | `src/components/ui/TextArea.tsx` | 비고 입력 (rows=1) |
| SectionHeader | `src/components/ui/SectionHeader.tsx` | "매장 기본" 섹션 헤더 (기존 유지) |
| RecommendButton | `src/components/ui/RecommendButton.tsx` | 추천 받기 버튼 (기존 유지) |

### 수정하는 기존 파일

| File | Modification |
|------|-------------|
| `src/components/sections/StoreBasicSection.tsx` | CATEGORY_OPTIONS 제거, 4단 계층형 UI로 교체 |
| `src/types/form.ts` | IndustrySelection 타입 추가, StoreBasicState.category -> industry 변경 |
| `src/store/useFormStore.ts` | updateIndustry 액션 추가, persist version 업그레이드 |
| `src/services/gemini.ts` | buildInputSummary에서 industry 별도 처리, formatIndustryPath 함수 |

### 신규 생성 파일

| File | Purpose |
|------|---------|
| `src/data/industryData.ts` | 산업분류 정적 데이터 (247개 소분류) + 헬퍼 함수 |
| `src/data/industryMigration.ts` | 14개 기존 flat category -> IndustrySelection 매핑 (안전장치) |

> Source: CONTEXT.md canonical refs. RESEARCH.md file structure, Pattern 4.

---

## Data Contract

### IndustrySelection 타입

```typescript
export interface IndustrySelection {
  major: string;    // 대분류 (예: "음식")
  medium: string;   // 중분류 (예: "한식")
  minor: string;    // 소분류 (예: "분식")
  note: string;     // 비고 (예: "떡볶이 전문")
}
```

초기값: `{ major: '', medium: '', minor: '', note: '' }`

### hasInput 판정 변경

기존: `Object.values(s).some((v) => v.trim() !== '')`
변경: industry 필드는 `s.industry.major !== ''`로 별도 체크. 나머지 string 필드는 기존 `.trim()` 패턴 유지.

> Source: RESEARCH.md Pitfall 1, Pattern 4.

---

## Accessibility Baseline

| Concern | Implementation |
|---------|----------------|
| Label association | 각 드롭다운/텍스트 영역에 `<label htmlFor>` 연결 (기존 Dropdown/TextArea 패턴) |
| Disabled state | `disabled` 속성 + `opacity-40` + `cursor-not-allowed` -- 스크린 리더에서 비활성 상태 전달 |
| Keyboard navigation | 네이티브 `<select>` -- 화살표 키, Enter, Tab 기본 지원 |
| Focus order | Tab 순서: 대분류 -> 중분류 -> 소분류 -> 비고 (DOM 순서와 일치) |
| Color contrast | Label `#5A5550` on `#E8E4DE` = ratio 3.3:1 (AA 미달, 기존 설계 유지) |
| Selected text | `#FFFFFF` on `#4A4640` = ratio 8.6:1 (AAA) |

> Note: Label 대비 비율이 AA 미달이지만 Phase 1에서 확립된 기존 디자인. Phase 4에서는 기존 패턴을 변경하지 않는다.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | not used | not applicable |
| Third-party | none | not applicable |

> 이 프로젝트는 커스텀 Tailwind CSS 컴포넌트를 사용하며, Phase 4에서 외부 레지스트리를 추가하지 않는다 (v1.1 결정: 새 npm 패키지 없음).

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending

---

*Phase: 04-industry-dropdown*
*Created: 2026-04-01*
*Sources: 04-CONTEXT.md (D-01~D-12), 04-RESEARCH.md (Patterns 1-4, Pitfalls 1-5, Code Examples 1-4), 01-UI-SPEC.md (design tokens baseline), REQUIREMENTS.md (INDUSTRY-01~03), 실제 코드 분석 (Dropdown.tsx, TextArea.tsx, SectionHeader.tsx, StoreBasicSection.tsx)*
