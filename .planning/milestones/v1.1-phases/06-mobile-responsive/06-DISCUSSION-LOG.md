# Phase 6: 모바일 반응형 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-02
**Phase:** 06-모바일 반응형
**Areas discussed:** 추천 패널 모바일 배치, 업종 드롭다운 모바일 레이아웃, 모바일 헤더/히어로 처리

---

## 추천 패널 모바일 배치

### Q1: 모바일에서 추천 패널을 어떻게 접근하게 할까요?

| Option | Description | Selected |
|--------|-------------|----------|
| 입력 아래 고정 스택 (권장) | 입력 폼 아래에 추천 패널이 바로 이어짐. 단순하고 MOBILE-01에 부합. 스크롤이 길어질 수 있음 | ✓ |
| 하단 FAB 버튼 | 플로팅 버튼으로 추천 패널을 바텀시트/모달로 열림. 빠른 전환 가능. 추가 UI 요소 필요 | |
| 탭 전환 | 상단 탭으로 입력/추천 전환. 스크롤 문제 없음. 동시에 볼 수 없음 | |

**User's choice:** 입력 아래 고정 스택 (권장)
**Notes:** 없음

### Q2: 모바일에서 추천 버튼 클릭 후 추천 결과 영역으로 자동 스크롤할까요?

| Option | Description | Selected |
|--------|-------------|----------|
| 예, 자동 스크롤 (권장) | 모바일에서만 추천 버튼 클릭 후 추천 결과 영역으로 부드럽게 스크롤 | ✓ |
| 아니요, 수동 | 사용자가 직접 스크롤 | |
| 너가 결정 | Claude 재량 | |

**User's choice:** 예, 자동 스크롤 (권장)
**Notes:** 없음

---

## 업종 드롭다운 모바일 레이아웃

### Q1: 모바일에서 업종 드롭다운 4개를 어떻게 배치할까요?

| Option | Description | Selected |
|--------|-------------|----------|
| 1열 세로 스택 (권장) | 모바일에서 4개 드롭다운을 세로로 나열. 풀 폭으로 터치 타겟 충분 | ✓ |
| 2열 유지 | 데스크톱과 동일한 2x2 grid 유지. 컴팩트하지만 좁아질 수 있음 | |
| 너가 결정 | Claude 재량 | |

**User's choice:** 1열 세로 스택 (권장)
**Notes:** 없음

### Q2: 모바일에서 다른 2열 grid 필드들도 1열로 변경할까요?

| Option | Description | Selected |
|--------|-------------|----------|
| 예, 전부 1열 (권장) | 모든 2열 grid 필드를 모바일에서 1열로 변경. 일관된 모바일 경험 | ✓ |
| 업종만 1열 | 업종 드롭다운만 1열로 변경하고 나머지 2열 필드는 유지 | |
| 너가 결정 | Claude 재량 | |

**User's choice:** 예, 전부 1열 (권장)
**Notes:** 없음

---

## 모바일 헤더/히어로 처리

### Q1: 모바일에서 히어로 영역을 어떻게 처리할까요?

| Option | Description | Selected |
|--------|-------------|----------|
| 축소 + 버튼 재배치 (권장) | 제목/설명 컴팩트하게 축소, API설정·초기화 버튼을 히어로 아래로 재배치 | ✓ |
| 그대로 유지 | 변경 없이 그대로 표시. 단순하지만 버튼이 좁아질 수 있음 | |
| 너가 결정 | Claude 재량 | |

**User's choice:** 축소 + 버튼 재배치 (권장)
**Notes:** 없음

---

## Claude's Discretion

- 터치 타겟 크기, 패딩, 폰트 크기 조정 범위 (MOBILE-03)
- Tailwind 브레이크포인트 전략 (lg: 기준)
- 자동 스크롤 타이밍 및 오프셋
- 히어로 축소 시 구체적인 폰트/패딩 값

## Deferred Ideas

None — discussion stayed within phase scope
