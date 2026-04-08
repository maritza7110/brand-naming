# Phase 14: 데이터 정합성 + 테스트/디자인 시스템 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-08
**Phase:** 14-데이터 정합성 + 테스트/디자인 시스템
**Areas discussed:** 세션 오염 수정, 리더보드 집계 방식, 테스트 인프라 + 범위, CSS 변수 토큰화

---

## 세션 오염 수정

### 세션 판단 기준

| Option | Description | Selected |
|--------|-------------|----------|
| 클라이언트 sessionId | Zustand에 currentSessionId를 보관. 첫 추천시 createSession, 이후는 updateSession. 위저드 초기화 시 sessionId 리셋 | ✓ |
| 입력값 해시 비교 | formState를 해싱해서 같은 입력이면 기존 세션 업데이트. 다른 입력이면 새 세션 | |

**User's choice:** 클라이언트 sessionId
**Notes:** 추천 (recommended option)

### 결과 업데이트 전략

| Option | Description | Selected |
|--------|-------------|----------|
| 누적 저장 | 이전 batch + 새 batch 모두 보존. 세션에 전체 히스토리 남음 | ✓ |
| 마지막만 유지 | 새 추천 시 이전 naming_results 삭제 후 재삽입. 항상 최신 결과만 | |

**User's choice:** 누적 저장
**Notes:** 추천 (recommended option)

### 세션 리셋 시점

| Option | Description | Selected |
|--------|-------------|----------|
| 위저드 초기화 시 | 사용자가 새 네이밍 시작할 때 (페이지 새로고침/초기화 버튼). sessionId null이면 첫 추천 시 create | ✓ |
| 페이지 진입 시마다 | NamingPage에 들어올 때마다 항상 새 세션. 대시보드에서 복원 시에는 해당 sessionId 사용 | |

**User's choice:** 위저드 초기화 시
**Notes:** 추천 (recommended option)

### 복원 후 누적

| Option | Description | Selected |
|--------|-------------|----------|
| 네, 기존 세션에 누적 | 복원한 세션의 sessionId를 유지하고 updateSession으로 추가 | ✓ |
| 아니오, 새 세션 생성 | 복원 후 추천은 새 프로젝트로 분리 | |

**User's choice:** 네, 기존 세션에 누적
**Notes:** 추천 (recommended option)

---

## 리더보드 집계 방식

### 집계 구현 방법

| Option | Description | Selected |
|--------|-------------|----------|
| Supabase RPC | SQL 함수(RPC)를 만들어 DB에서 집계 후 결과만 전송. 성능 최고 | |
| Supabase View | DB 뷰를 만들고 클라이언트에서 select. 단순하지만 period 파라미터 처리가 제한적 | |
| 클라이언트 그대로 + 제한 | 현재 방식 유지하되 .limit() 추가로 전송량만 줄임. 100인 사내 앱에 초과 엔지니어링일 수 있음 | ✓ |

**User's choice:** 클라이언트 그대로 + 제한
**Notes:** 100인 사내 앱에 RPC/View는 과도함

### 로딩 UX

| Option | Description | Selected |
|--------|-------------|----------|
| 현재 그대로 | 이미 스켈레톤 로더가 있음. 탭 전환 시 스켈레톤 표시 후 결과 교체 | ✓ |
| Claude에게 맡김 | 기술적 세부사항은 Claude가 적절히 구현 | |

**User's choice:** 현재 그대로
**Notes:** 추천 (recommended option)

---

## 테스트 인프라 + 범위

### 테스트 범위

| Option | Description | Selected |
|--------|-------------|----------|
| 요구사항만 | TEST-02 (AI 응답 파싱) + TEST-03 (세션 저장/복원)만. 핵심 경로 2개만 테스트 | ✓ |
| 요구사항 + 유틸리티 | AI 파싱 + 세션 + 추가로 industry 데이터, 폼 유효성 검사 등 순수 함수 테스트 추가 | |

**User's choice:** 요구사항만
**Notes:** 추천 (recommended option)

### API 모킹 전략

| Option | Description | Selected |
|--------|-------------|----------|
| 로직만 테스트 | Supabase 호출 전/후의 순수 로직만 테스트 (파싱, 변환, 데이터 가공). 모킹 불필요 | ✓ |
| vi.mock으로 모킹 | supabase 모듈을 vi.mock으로 대체해서 세션 서비스 전체 테스트 | |

**User's choice:** 로직만 테스트
**Notes:** 추천 (recommended option)

---

## CSS 변수 토큰화

### 토큰 네이밍 스타일

| Option | Description | Selected |
|--------|-------------|----------|
| 시맨틱 토큰 | --color-bg, --color-surface, --color-accent, --color-text-primary 등 역할 기반 이름. 라이트/다크 모드 전환 용이 | ✓ |
| 원시 토큰 | --color-gold, --color-dark, --color-gray-700 등 색상값 기반 이름. 단순하지만 모드 전환 시 혼란 | |
| Claude에게 맡김 | 토큰 네이밍은 Claude가 적절히 설계 | |

**User's choice:** 시맨틱 토큰
**Notes:** 추천 (recommended option)

### 토큰 파일 위치

| Option | Description | Selected |
|--------|-------------|----------|
| index.css :root | 기존 index.css의 :root에 CSS 변수 선언. 별도 파일 불필요, Tailwind과 호환 | ✓ |
| 별도 tokens.css | src/styles/tokens.css를 만들어 분리 관리. index.css에서 import | |

**User's choice:** index.css :root
**Notes:** 추천 (recommended option)

---

## Claude's Discretion

- Zustand store 구조 (기존 확장 vs 별도)
- likes 쿼리 .limit() 값
- Vitest 설정 세부 사항
- 시맨틱 토큰 정확한 이름 목록

## Deferred Ideas

None — discussion stayed within phase scope
