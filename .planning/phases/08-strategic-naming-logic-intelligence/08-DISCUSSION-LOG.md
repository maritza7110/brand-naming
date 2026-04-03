# Phase 8: Strategic Naming Logic (Intelligence) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-03
**Phase:** 08-strategic-naming-logic-intelligence
**Areas discussed:** 위저드 전환 방식, 프롬프트 고도화 전략, Rationale UI 설계, 신규 입력 항목 범위

---

## 위저드 전환 방식

### 단계 간 전환 방식

| Option | Description | Selected |
|--------|-------------|----------|
| 탭 네비게이션 (추천) | 상단에 분석/정체성/표현 탭, 자유 이동, 순서 강제 없음 | ✓ |
| 순차적 스텝바 | 1→2→3 순서대로 진행, 이전 단계 완료 후 다음 해금 | |
| 하이브리드 (탭 + 안내) | 탭으로 자유 이동하되, 소프트 가이드로 논리적 순서 유도 | |

**User's choice:** 탭 네비게이션
**Notes:** 없음

### 섹션 배치

| Option | Description | Selected |
|--------|-------------|----------|
| 시장중심 배치 (추천) | 분석: 매장기본+경쟁사/USP, 정체성: 비전+페르소나, 표현: 제품+스타일 | ✓ |
| 기존 순서 유지 | 분석: 매장기본+제품, 정체성: 비전+페르소나, 표현: 스타일+경쟁사 | |
| 직접 정하겠다 | 사용자가 각 단계 포함 섹션 직접 지정 | |

**User's choice:** 시장중심 배치
**Notes:** 없음

### 추천 패널 연동

| Option | Description | Selected |
|--------|-------------|----------|
| 단계별 즉시 추천 (추천) | 각 탭에서 입력할 때마다 즉시 추천, 기존 컨셉 유지 | ✓ |
| 전체 완료 후 추천 | 3단계 모두 입력 완료 후 최종 추천 버튼 | |
| 둘 다 | 단계별 즉시 추천 + 전체 완료 후 '전략적 추천' 별도 제공 | |

**User's choice:** 단계별 즉시 추천
**Notes:** 없음

---

## 프롬프트 고도화 전략

### 네이밍 스타일 선택

| Option | Description | Selected |
|--------|-------------|----------|
| 사용자가 선택 (추천) | 표현 탭에 체크박스/칩으로 원하는 스타일 선택 | |
| AI 자동 판단 | 입력 데이터를 보고 AI가 적합한 스타일 자동 선택 | |
| 둘 다 제공 | 기본 AI 자동 + '고급 옵션' 토글로 직접 선택 가능 | ✓ |

**User's choice:** 둘 다 제공
**Notes:** 사용자가 처음에 "네이밍 기법" 개념이 불명확하여 구체적 예시(카카오톡=합성어, 코닥=추상어 등)로 재설명 후 결정

### 키워드 가중치(HITL)

| Option | Description | Selected |
|--------|-------------|----------|
| 태그 클릭 방식 (추천) | 키워드를 태그/칩으로 표시, 클릭하면 강조 | |
| 슬라이더/점수 방식 | 각 키워드에 1~5 가중치 슬라이더 | ✓ |
| 이번 Phase에서 제외 | 키워드 가중치는 v2.0 후반에 추가 | |

**User's choice:** 슬라이더/점수 방식
**Notes:** 없음

### 경쟁사/USP 프롬프트 반영

| Option | Description | Selected |
|--------|-------------|----------|
| 차별화 지시어 (추천) | 프롬프트에 '이 브랜드들과 차별화되는 이름을 만들어라' 지시 | |
| 분석 컨텍스트로 전달 | 경쟁사 정보를 시장 분석 컨텍스트로 전달 | |
| Claude 재량 | 가장 효과적인 방식을 구현 시 판단 | ✓ |

**User's choice:** Claude 재량
**Notes:** 없음

---

## Rationale UI 설계

### 근거 표시 방식

| Option | Description | Selected |
|--------|-------------|----------|
| 카드 확장 방식 (추천) | 카드 클릭 시 펼쳐져서 근거/기법/반영된 입력 표시 | ✓ |
| 사이드 패널 방식 | 카드 클릭 시 오른쪽 상세 패널 열림 | |
| 툴팁 방식 | 마우스 hover 시 간단한 근거 툴팁 | |

**User's choice:** 카드 확장 방식
**Notes:** 없음

### 타당성 점수

| Option | Description | Selected |
|--------|-------------|----------|
| 점수 표시 (추천) | A/B/C 등급 또는 백분율로 논리적 타당성 표시 | ✓ |
| 점수 없이 근거만 | 텍스트 근거만 제공 | |
| Claude 재량 | 구현 시 판단 | |

**User's choice:** 점수 표시 — 백분율(%)
**Notes:** 사용자가 "100분율로 하자"라고 명시. 백분율(%) 형태로 확정.

---

## 신규 입력 항목 범위

### 포함 항목

| Option | Description | Selected |
|--------|-------------|----------|
| 경쟁사 분석 | 경쟁 브랜드명 텍스트 입력 (분석 탭) | ✓ |
| USP/차별화 요소 | 핵심 차별점 텍스트 입력 (분석 탭) | ✓ |
| 네이밍 스타일/언어 제약 | 칩 선택 (표현 탭, 고급 옵션) | ✓ |
| 시장 트렌드/브랜드 퍼스널리티 | 트렌드 텍스트 + 퍼스널리티 드롭다운/칩 (정체성 탭) | ✓ |

**User's choice:** 4개 전부 포함
**Notes:** 없음

### 입력 형태

| Option | Description | Selected |
|--------|-------------|----------|
| 혼합 UI (추천) | 항목 성격에 맞게 텍스트/드롭다운/칩 혼합 | ✓ |
| 모두 텍스트 | 전부 textarea로 통일 | |
| Claude 재량 | 구현 시 판단 | |

**User's choice:** 혼합 UI
**Notes:** 기존 항목과의 중복은 Researcher/Planner가 조율하기로 함

---

## Claude's Discretion

- 경쟁사/USP 데이터의 구체적 프롬프트 반영 전략
- 각 신규 항목의 placeholder 예시문 및 가이드 텍스트
- 키워드 가중치 슬라이더의 구체적 UI 디자인
- 타당성 점수(%) 산출 알고리즘
- 탭 간 이동 시 애니메이션/트랜지션 효과

## Deferred Ideas

None — discussion stayed within phase scope
