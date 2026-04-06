# Phase 11: 위저드 탭 UX 재설계 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-03
**Phase:** 11-ux
**Areas discussed:** 탭 역할 재정의, 페르소나 필드 구조조정, 탭 간 필드 재배치, 사용성 개선

---

## 탭 역할 재정의

| Option | Description | Selected |
|--------|-------------|----------|
| 시장→브랜드→네이밍 | 분석=시장/경쟁/고객, 정체성=브랜드 가치/철학/페르소나, 표현=네이밍 스타일/언어/제품표현 | ✓ |
| 외부→내부→출력 | 분석=외부환경, 정체성=내부정체성/제품, 표현=출력설정 | |
| Claude가 판단 | 코드베이스와 필드 분석 기반 제안 | |

**User's choice:** 시장→브랜드→네이밍
**Notes:** 이후 시장트렌드를 분석탭으로 이동하는 것도 결정됨

---

## 페르소나 필드 구조조정

**User's initial feedback:** "브랜드 페르소나를 의미별로 나눈 다음 컨테이너로도 나눴으면 해. 한번에 16개가 전부 있으니 힘든 숙제 같아."

**User's refinement:** "페르소나 별 의미를 좀 더 명확히 정의해서 구분해줬으면 하는데. 지금은 너무 기계적으로 분류한 것 같아."

**Reference:** 기존 페르소나 앱(persona-pearl.vercel.app = C:/persona/brand) 참조 요청

| Option | Description | Selected |
|--------|-------------|----------|
| 5그룹 그대로 적용 | Identity/Strategy/Market/Benefits/Experience — 기존 앱과 일관성 유지 | ✓ |
| 4그룹으로 압축 | Experience를 Identity에 통합 | |
| 직접 정하고 싶어요 | 그룹핑을 직접 정의 | |

**User's choice:** 기존 페르소나 앱의 5그룹 카테고리 그대로 적용
**Notes:** C:/persona/brand/types.ts의 FIELD_METADATA 카테고리 구분이 원본 기준

---

## 탭 간 필드 재배치

**Key decision:** 페르소나 5그룹을 별도 상단 탭으로 분리 → 3탭에서 4탭으로 변경

| Option | Description | Selected |
|--------|-------------|----------|
| 페르소나는 정체성탭에 모두 유지 | 5그룹 전부 정체성 탭에 유지, 경쟁사/USP와 중복은 관점이 다르므로 유지 | (초기 선택) |
| 페르소나를 독립 탭으로 승격 | 4탭 구조: 분석/정체성/페르소나/표현 | ✓ (최종) |

**중복 해소 방식:**

| Option | Description | Selected |
|--------|-------------|----------|
| 관점 차이 명시 | 분석탭="시장 현황 관점", 페르소나탭="브랜드 내부 관점" — 레이블/placeholder로 차별화 | ✓ |
| Claude가 판단 | 적절한 레이블/placeholder 구분을 위임 | |

---

## 사용성 개선

**5그룹 컨테이너 표시 방식:**

| Option | Description | Selected |
|--------|-------------|----------|
| 아코디언 접기/펼치기 | 처음에는 첫 그룹만 펼치고 나머지 접힘 | |
| 전부 펼쳐서 스크롤 | 5그룹 모두 펼쳐놓고 컨테이너 헤더로 구분 | ✓ |
| Claude가 판단 | 코드 패턴과 사용성 고려 제안 | |

**탭 네비게이션 UI:**

| Option | Description | Selected |
|--------|-------------|----------|
| 현재 탭바 유지 + 4칸 균등분할 | WizardTabs에 4번째 탭 추가, 인디케이터 width 25% | ✓ |
| 아이콘 탭으로 변경 | 텍스트 대신 아이콘+레이블로 모바일 대응 | |
| Claude가 판단 | 모바일/데스크톱 모두 고려 제안 | |

---

## Claude's Discretion

- 각 페르소나 그룹 컨테이너의 헤더 디자인
- 페르소나 탭 내 5그룹 간 간격
- 중복 필드의 구체적인 placeholder/가이드 텍스트
- 4탭 모바일 반응형 처리

## Deferred Ideas

None
