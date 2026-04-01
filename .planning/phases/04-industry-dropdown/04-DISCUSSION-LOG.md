# Phase 4: 산업분류 계층형 드롭다운 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-01
**Phase:** 04-산업분류 계층형 드롭다운
**Areas discussed:** 드롭다운 배치/레이아웃, 선택 경험 & 초기화 동작, AI 프롬프트 반영 방식, 마이그레이션 전략

---

## 드롭다운 배치/레이아웃

**User clarification:** 3단이 아닌 4단 구조 필요. 소분류로도 구분이 안 되는 업종(고양이카페, 만화카페)이 있어서 비고 텍스트 입력이 4단계로 필요.

| Option | Description | Selected |
|--------|-------------|----------|
| 가로 1줄 + 비고 아래 | 대/중/소 3개 드롭다운 가로 한 줄, 비고는 아래 전체 너비 | |
| 2열 2행 grid | 1행: 대분류/중분류, 2행: 소분류/비고 — 기존 grid-cols-2 패턴 유지 | ✓ |
| 세로 4줄 | 각각 전체 너비로 세로 배치 | |

**User's choice:** 2열 2행 grid (사용자가 직접 제안 — "현재 2열로 되어 있으니, 2열 2행으로 하면 되지 않아")
**Notes:** 기존 StoreBasicSection의 grid-cols-2 패턴과 일관성 유지

---

## 선택 경험 & 초기화 동작

### 초기화 동작

| Option | Description | Selected |
|--------|-------------|----------|
| 전체 초기화 | 상위 변경 시 하위 전체(드롭다운 + 비고) 초기화 | ✓ |
| 비고만 유지 | 하위 드롭다운 초기화하되 비고 텍스트는 유지 | |

**User's choice:** 전체 초기화

### 미선택 하위 드롭다운

| Option | Description | Selected |
|--------|-------------|----------|
| disabled 상태로 표시 | 회색으로 보이지만 클릭 불가 — 전체 구조 한눈에 보임 | ✓ |
| 숨기기 | 상위 선택 전에는 하위 드롭다운 자체가 안 보임 | |

**User's choice:** disabled 상태로 표시

---

## AI 프롬프트 반영 방식

| Option | Description | Selected |
|--------|-------------|----------|
| 전체 경로 | "업종: 음식점 > 한식 > 분식 (비고: 떡볶이 전문)" — AI가 전체 맥락 파악 | ✓ |
| 소분류 + 비고만 | "업종: 분식 (비고: 떡볶이 전문)" — 프롬프트 간결 | |

**User's choice:** 전체 경로

---

## 마이그레이션 전략

### 마이그레이션 방식

| Option | Description | Selected |
|--------|-------------|----------|
| 무음 자동 마이그레이션 | 앱 로드 시 기존 데이터 자동 변환, 사용자는 변화를 모름 | ✓ |
| 기존 데이터 초기화 | localStorage 전체 초기화 — 깨끗하지만 이전 추천 기록 소실 | |

**User's choice:** 무음 자동 마이그레이션

### 기존 카테고리 매핑

| Option | Description | Selected |
|--------|-------------|----------|
| 매핑 테이블 작성 | 14개 기존 카테고리 → 새 대/중/소분류 매핑 | ✓ |
| 빈 값으로 초기화 | 기존 category를 무시하고 업종 미선택 상태로 시작 | |

**User's choice:** 매핑 테이블 작성

---

## Claude's Discretion

- 247개 소분류 산업분류 데이터의 구체적 분류 체계
- IndustrySelection 타입의 구체적 필드 설계
- 마이그레이션 매핑 테이블 상세 내용
- 비고 필드 placeholder 문구

## Deferred Ideas

None — discussion stayed within phase scope
