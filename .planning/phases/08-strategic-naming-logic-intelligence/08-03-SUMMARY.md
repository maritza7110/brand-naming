---
phase: 08-strategic-naming-logic-intelligence
plan: "03"
subsystem: ai-prompt-engineering
tags: [gemini, prompt-engineering, structured-response, keyword-weights, rationale]
dependency_graph:
  requires: ["08-01"]
  provides: ["고도화된 Gemini 프롬프트", "구조화 응답 RationaleData", "키워드 가중치 반영"]
  affects: ["src/services/gemini.ts", "src/hooks/useRecommend.ts"]
tech_stack:
  added: []
  patterns:
    - "Gemini responseSchema 구조화 응답"
    - "JSON fallback with regex"
    - "키워드 가중치 자연어 변환"
key_files:
  created: []
  modified:
    - src/services/gemini.ts
    - src/hooks/useRecommend.ts
decisions:
  - "responseSchema로 RationaleData 구조화 응답 강제 — JSON 형식 지시 텍스트 제거"
  - "키워드 가중치 기본값(3)은 프롬프트에서 생략 — 차별화된 가중치만 표시"
  - "구조화 응답 실패 시 regex fallback으로 안전하게 처리 — 기존 로직 재사용"
metrics:
  duration: "~5 minutes"
  completed: "2026-04-03T05:32:00Z"
  tasks_completed: 2
  files_modified: 2
---

# Phase 08 Plan 03: Gemini 프롬프트 고도화 + 구조화 응답 Summary

Gemini API 호출에 responseSchema 구조화 응답을 적용하고, 경쟁사/USP 차별화 지침 및 키워드 가중치를 자연어로 변환하여 프롬프트에 반영함.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Gemini 프롬프트 고도화 + 구조화 응답 | 5e1987f | src/services/gemini.ts |
| 2 | useRecommend 훅 확장 | 5445cf7 | src/hooks/useRecommend.ts |

## What Was Built

### Task 1: gemini.ts 고도화

**신규 기능:**
- `FIELD_LABELS` 확장: `competitors`, `usp`, `marketTrend`, `brandPersonality`, `namingStyle`, `languageConstraint` 라벨 추가
- `buildInputSummary`: analysis/identity/expression 섹션을 프롬프트에 포함
- `buildDifferentiationContext`: 경쟁사/USP 데이터를 차별화 지침으로 변환
- `buildWeightedKeywords`: 키워드 가중치를 "최우선 반영 (5/5)" 형태의 자연어로 변환 (기본값 3은 생략)
- `WEIGHT_LABELS`: 1~5 가중치를 한국어 레이블로 매핑
- `SYSTEM_PROMPT`: 타당성 점수 산출 기준 (4가지 항목, 가중치 포함) 추가
- `responseSchema`: Gemini API 구조화 응답으로 `validityScore`, `namingTechnique`, `meaningAnalysis`, `reflectedInputs` 강제 추출
- `responseMimeType: 'application/json'` 설정
- `systemInstruction` config 내 설정
- fallback: 구조화 응답 파싱 실패 시 regex로 `[...]` 추출
- `rationale` 매핑: `validityScore` 범위 검증 (`Math.min(100, Math.max(0, ...))`)
- `generateBrandNames` 시그니처에 `keywordWeights?: Record<string, number>` 추가

**파일 크기:** 351줄 (500줄 제한 준수)

### Task 2: useRecommend.ts 확장

- `getState()`에서 `analysis`, `identity`, `expression`, `keywordWeights` 구조 분해
- `form` 객체에 신규 섹션 포함
- `generateBrandNames(form, keywordWeights)` 호출로 가중치 전달

## Deviations from Plan

None - 계획대로 정확히 실행됨.

## Verification

- TypeScript `npx tsc --noEmit`: 오류 없음 (두 task 모두)
- gemini.ts acceptance criteria: 전항목 통과 (13개 기준)
- useRecommend.ts acceptance criteria: 전항목 통과 (4개 기준)

## Known Stubs

None.

## Self-Check: PASSED

- src/services/gemini.ts: FOUND (351 lines)
- src/hooks/useRecommend.ts: FOUND (30 lines)
- Commit 5e1987f: FOUND
- Commit 5445cf7: FOUND
