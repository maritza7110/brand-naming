# Phase 13: 안정성 개선 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-08
**Phase:** 13-안정성 개선
**Areas discussed:** 재시도 UX

---

## Phase 범위 결정

| Option | Description | Selected |
|--------|-------------|----------|
| 타임아웃+재시도만 | Gemini API 30초 타임아웃 + 2회 재시도만 추가. 나머지는 건너뛰기 | ✓ |
| Phase 자체를 제거 | 사내 앱에 불필요한 안정성 단계를 로드맵에서 삭제 | |
| 전체 요구사항 유지 | 타임아웃/재시도/에러메시지/로깅/로그아웃 정리 모두 구현 | |

**User's choice:** 타임아웃+재시도만
**Notes:** 사용자 피드백 — "에러가 없도록 만드는게 먼저", "사내 앱에 무슨 이게 큰 작업이라고 하는지 모르겠다", "현재 특별한 에러 없어". 과도한 방어 코드 불필요.

---

## 재시도 UX

| Option | Description | Selected |
|--------|-------------|----------|
| 조용히 재시도 | 사용자는 로딩 스피너만 보면서 내부적으로 자동 재시도. 2회 모두 실패 시에만 에러 표시 | ✓ |
| 재시도 카운트 노출 | "응답 지연... 재시도 중 (1/2)" 같은 메시지를 로딩 중에 표시 | |
| 수동 재시도 버튼 | 타임아웃 되면 "다시 시도" 버튼을 보여주고 사용자가 직접 클릭 | |

**User's choice:** 조용히 재시도
**Notes:** 사내 앱에 맞는 심플한 접근

---

## Claude's Discretion

- 재시도 간 backoff 전략
- 타임아웃 구현 방식 (AbortController vs Promise.race)
- 최종 에러 메시지 문구

## Deferred Ideas

- STB-02 에러 메시지 고도화 — 현재 충분
- STB-03 구조화 로깅 — 100인 사내 앱에 과함
- STB-04 로그아웃 데이터 정리 — 이미 동작 중
