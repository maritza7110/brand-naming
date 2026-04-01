# Phase 1: Foundation & Input UI - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-01
**Phase:** 01-foundation-input-ui
**Areas discussed:** 입력 폼 구조, 레이아웃 동작, 디자인 언어, 추천 버튼 위치

---

## 입력 폼 구조

### 폼 그룹핑

| Option | Description | Selected |
|--------|-------------|----------|
| 섹션 헤더 구분 | 3개 섹션을 헤더로 구분하고 모두 펼쳐서 한 화면에 표시 | ✓ |
| 아코디언 접기 | 3개 섹션을 아코디언으로 접을 수 있게 | |
| 탭 분리 | 3개 섹션을 탭으로 구분 | |

**User's choice:** 섹션 헤더 구분
**Notes:** 스크롤로 자연스러운 흐름 선호

### 필드 타입 (기본정보)

| Option | Description | Selected |
|--------|-------------|----------|
| 드롭다운 + 텍스트 혼합 | 업종/가격대/규모는 드롭다운, 위치/상품/타겟은 텍스트 | ✓ |
| 모두 텍스트 입력 | 전부 자유 텍스트 | |
| 모두 텍스트 + placeholder | 텍스트 입력 + placeholder 예시 | |

**User's choice:** 드롭다운 + 텍스트 혼합

### 필드 타입 (사장님/페르소나)

| Option | Description | Selected |
|--------|-------------|----------|
| 텍스트영역 (textarea) | 3~5줄 높이의 textarea, placeholder 예시문 제공 | ✓ |
| 텍스트 한 줄 (input) | 간결하지만 추상적 항목에 부족 | |
| 혼합 (input + textarea) | 슬로건은 input, 나머지는 textarea | |

**User's choice:** 텍스트영역 (textarea)

### PERSONA-04 기타 항목 처리

| Option | Description | Selected |
|--------|-------------|----------|
| 기존 앱 항목 확인 후 결정 | 기존 앱의 페르소나 항목을 조사하여 동일하게 반영 | ✓ |
| 범용 textarea 하나 | 단일 텍스트 영역 | |
| v1에서는 생략 | 철학/슬로건/미션만으로 충분 | |

**User's choice:** 기존 앱 항목 확인 후 결정
**Notes:** Researcher가 기존 앱 + 소상공인 마스터 AI 문서 기반으로 확정

### 입력 섹션 구조 변경 (사용자 제안)

**User's input:** 소상공인 마스터 AI를 기본 필드 구조로 사용하고, 기존 브랜드 페르소나 앱의 항목도 소상공인 마스터 AI의 하나의 섹터로 취급. 브랜드 페르소나는 그대로 사용, 브랜드 아이덴티티는 반대 방향.

**결과:** 기존 3개 그룹(기본정보/사장님/페르소나) → 소상공인 마스터 AI 기반 5개 섹션으로 재구성:
1. 매장 기본/환경
2. 브랜드 정체성 및 비전
3. 제품/서비스
4. 고객/시장 환경
5. 브랜드 페르소나 (기존 앱 그대로)

---

## 레이아웃 동작

### 빈 상태 표시

| Option | Description | Selected |
|--------|-------------|----------|
| 안내 메시지 | 안내문 + 일러스트 표시 | ✓ |
| 미니멀 디자인 | 빈 공간만 표시 | |
| 예시 카드 미리보기 | 흐릿한 예시 카드로 미리보기 | |

**User's choice:** 안내 메시지

### 우측 패널 스크롤

| Option | Description | Selected |
|--------|-------------|----------|
| 스티키 패널 | 화면에 고정, 내부만 독립 스크롤 | ✓ |
| 함께 스크롤 | 좌우 함께 스크롤 | |
| Claude 재량 | 기술적 최적 방식 판단 | |

**User's choice:** 스티키 패널

### 반응형 처리

| Option | Description | Selected |
|--------|-------------|----------|
| 데스크탑 전용 | 데스크탑 해상도 전용 설계 | ✓ |
| 상하 분할 전환 | 작은 화면에서 상하 배치 | |
| 탭으로 전환 | 작은 화면에서 탭 전환 | |

**User's choice:** 데스크탑 전용

---

## 디자인 언어

### 색상 톤

| Option | Description | Selected |
|--------|-------------|----------|
| 라이트 모드 | 하얀 배경 + 어두운 텍스트 + 포인트 컬러 | ✓ |
| 다크 모드 | 어두운 배경 + 밝은 텍스트 + 네온 포인트 | |
| Claude 재량 | 고급스러운 느낌에 맞는 색상 판단 | |

**User's choice:** 라이트 모드

### 디자인 스타일

| Option | Description | Selected |
|--------|-------------|----------|
| 여백 중심 미니멀 | 넓은 여백, 엇은 보더, 미니멀 장식 | ✓ |
| 카드 기반 입체감 | 섹션별 카드, 그림자, 둥근 모서리 | |
| 기존 앱 따라가기 | 기존 앱 디자인 스타일 반영 | |

**User's choice:** 여백 중심 미니멀

### 포인트 컬러

| Option | Description | Selected |
|--------|-------------|----------|
| 블루 계열 | 신뢰감, 전문성 | ✓ |
| 바이올렛 계열 | 창의성, 브랜딩 | |
| 보라색 (teal/emerald) | 성장, 신선함 | |
| Claude 재량 | 고급스러운 느낌에 맞는 색상 판단 | |

**User's choice:** 블루 계열

### 추가 요구사항 (사용자 직접 입력)

**User's input:** "전체적으로 정갈하고 고급스러워야 해. 외부 디자인툴 가령 css 고급 디자인을 고려해줘."
**Notes:** CSS 전문가 수준 퀄리티. 미세한 그라데이션, 섬세한 그림자, 부드러운 트랜지션, backdrop-blur, 정교한 타이포그래피 스케일 등 고급 CSS 기법 적극 활용.

---

## 추천 버튼 위치

### 버튼 배치

| Option | Description | Selected |
|--------|-------------|----------|
| 섹션별 버튼 | 각 섹션 하단에 '추천 받기' 버튼 | ✓ |
| 하단 통합 버튼 | 폼 맨 아래에 하나의 버튼 | |
| 플로팅 버튼 | 화면 오른쪽 하단에 항상 떠있는 버튼 | |

**User's choice:** 섹션별 버튼

### 버튼 활성화 조건

| Option | Description | Selected |
|--------|-------------|----------|
| 해당 섹션 1개 이상 입력 | 최소 1개 항목 입력 시 활성화 | ✓ |
| 항상 활성화 | 언제든 누를 수 있음 | |
| Claude 재량 | UX 최적 조건 판단 | |

**User's choice:** 해당 섹션 1개 이상 입력

---

## Claude's Discretion

- 구체적인 색상 값(hex) — 블루 계열 내에서 최적 조합
- 타이포그래피 스케일 (heading/body/caption 크기 비율)
- spacing 시스템 (섹션/필드 간 간격)
- 추천 패널 빈 상태 일러스트/아이콘

## Deferred Ideas

None
