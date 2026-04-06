---
phase: 11-ux
plan: 01
subsystem: wizard-navigation
tags: [ux, tabs, accessibility, typescript]
dependency_graph:
  requires: []
  provides: [TabId-4tabs, SectionHeader-subtitle, WizardTabs-4tab-a11y, NamingPage-persona-routing]
  affects: [src/types/form.ts, src/components/wizard/WizardTabs.tsx, src/components/ui/SectionHeader.tsx, src/pages/NamingPage.tsx]
tech_stack:
  added: []
  patterns: [roving-tabindex, tablist-keyboard-nav, optional-props-backward-compat]
key_files:
  created: []
  modified:
    - src/types/form.ts
    - src/components/ui/SectionHeader.tsx
    - src/components/wizard/WizardTabs.tsx
    - src/pages/NamingPage.tsx
decisions:
  - "WizardTabs 슬라이딩 인디케이터: 100/3 하드코딩 → 100/TABS.length 동적 계산으로 확장성 확보"
  - "PersonaTab은 Plan 02 전까지 NamingPage 내부 inline placeholder로 처리 (import 없이)"
  - "SectionHeader icon/subtitle prop은 optional로 추가 — 기존 call site 수정 불필요"
metrics:
  duration: "~8 minutes"
  completed: "2026-04-06"
  tasks: 3
  files: 4
---

# Phase 11 Plan 01: 4탭 위저드 기반 인프라 구축 Summary

**One-liner:** TabId 타입 4탭 확장 + WizardTabs ARIA 접근성 + NamingPage persona 라우팅으로 4탭 위저드 인프라 완성.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | TabId 타입 확장 + SectionHeader subtitle prop | 1f9de9b | src/types/form.ts, src/components/ui/SectionHeader.tsx |
| 2 | WizardTabs 4탭 전환 + 접근성 개선 | 251e928 | src/components/wizard/WizardTabs.tsx |
| 3 | NamingPage 페르소나 탭 라우팅 추가 | adbbd79 | src/pages/NamingPage.tsx |

## What Was Built

### Task 1: 타입 + UI 기반
- `src/types/form.ts`: `TabId = 'analysis' | 'identity' | 'persona' | 'expression'` (3→4탭)
- `src/components/ui/SectionHeader.tsx`: `subtitle?: string` (12px eyebrow), `icon?: LucideIcon` optional prop 추가. 기존 call site 전부 하위 호환.

### Task 2: WizardTabs 4탭 + ARIA
- TABS 배열에 `{ id: 'persona', label: '페르소나', ariaLabel: '페르소나 탭 — 브랜드 성격' }` 추가
- `role="tablist"` 컨테이너, `role="tab"` 각 버튼
- `tabIndex={isActive ? 0 : -1}` 로버 탭인덱스 패턴
- `ArrowRight` / `ArrowLeft` / `Home` / `End` 키보드 네비게이션 + `.focus()` 호출
- `focus-visible:outline-2 focus-visible:outline-[#B48C50]` 포커스 링
- 인디케이터 너비: `100 / TABS.length` 동적 계산

### Task 3: NamingPage 페르소나 라우팅
- `PersonaTabPlaceholder` 컴포넌트 inline 정의 (Plan 02에서 실제 PersonaTab으로 교체 예정)
- `{activeTab === 'persona' && <div className="animate-fadeIn"><PersonaTabPlaceholder /></div>}` 분기 추가
- 기존 expression 분기 보존 확인

## Decisions Made

1. **WizardTabs 슬라이딩 인디케이터 동적 계산:** 하드코딩된 `100/3` 대신 `100/TABS.length`로 변경하여 탭 수 변경 시 자동 적응.
2. **PersonaTab placeholder 전략:** Plan 02 완료 전까지 NamingPage 내부 inline 컴포넌트로 처리. 별도 파일 생성 없이 TypeScript 컴파일 통과.
3. **SectionHeader 하위 호환:** subtitle/icon은 optional prop — 기존 사용처 수정 불필요.

## Deviations from Plan

None - 계획대로 정확히 실행됨.

## Known Stubs

- `PersonaTabPlaceholder` in `src/pages/NamingPage.tsx` (line ~19): 실제 PersonaTab 컴포넌트 연결 전 placeholder. Plan 02 Task에서 교체 예정. 현재 "페르소나 탭 / Plan 02에서 구현 예정" 텍스트 표시. 이 stub은 Plan 02의 존재 목적이므로 의도적.

## Verification

- TypeScript 컴파일: 에러 없음 (`npx tsc --noEmit` 통과)
- Vite 빌드: 성공 (`built in 758ms`)
- 4탭 전환: analysis/identity/persona/expression 모두 라우팅 작동

## Self-Check: PASSED

- FOUND: src/types/form.ts
- FOUND: src/components/ui/SectionHeader.tsx
- FOUND: src/components/wizard/WizardTabs.tsx
- FOUND: src/pages/NamingPage.tsx
- FOUND commit: 1f9de9b
- FOUND commit: 251e928
- FOUND commit: adbbd79
