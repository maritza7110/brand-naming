# 브랜드 네이밍 앱

## What This Is

소상공인의 상품정보, 사장님 정보, 브랜드 페르소나 항목을 하나씩 입력할 때마다 AI가 브랜드명을 추천하는 사내 웹앱. 기존 "브랜드 페르소나" 앱의 역방향 — 페르소나에서 브랜드명을 만들어간다. 100인 규모 회사 직원 누구나 사용.

## Core Value

페르소나 항목을 채워갈수록 점점 정교해지는 브랜드명 추천 — 입력할 때마다 즉시 결과를 보여주는 인터랙티브 경험.

## Current Milestone: v1.1 UX 개선

**Goal:** 산업분류 체계 기반 업종 선택, 추천 카드 소분류 그루핑, 모바일 반응형 레이아웃으로 사용성을 개선한다.

**Target features:**
- 업종 입력을 대분류 > 중분류 > 소분류 계층형 드롭다운으로 교체 (247개 소분류)
- 오른쪽 패널에서 추천 카드를 소분류 업종별로 그루핑 (접기/펼치기, 업종 변경 시 자동 접힘)
- 모바일 반응형 레이아웃 (세로 스택: 입력 위 + 추천 아래)

## Requirements

### Validated

- ✓ 상품/가게 기본정보 입력 (업종, 위치, 규모, 상품, 가격대) — v1.0 Phase 1
- ✓ 사장님 정보 입력 (비전, 꿈, 5/10년 목표, 스토리) — v1.0 Phase 1
- ✓ 브랜드 페르소나 항목 입력 (철학, 슬로건, 미션 등) — v1.0 Phase 1
- ✓ 왼쪽 70% 입력 / 오른쪽 30% 추천 카드 누적 레이아웃 — v1.0 Phase 1
- ✓ 심플하고 고급스러운 디자인 (Pretendard 폰트) — v1.0 Phase 1

### Active

(All v1.1 requirements validated — see below)

### Validated (v1.1)

- ✓ 업종 입력을 산업분류 계층형 드롭다운으로 교체 (대분류 > 중분류 > 소분류) — Phase 4
- ✓ 추천 카드 소분류 업종별 그루핑 (접기/펼치기) — Phase 5
- ✓ 업종 변경 시 이전 업종 추천 자동 접힘 — Phase 5
- ✓ 모바일 반응형 레이아웃 (세로 스택) — Phase 6

### Out of Scope

- 브랜드명에서 페르소나를 확장하는 기능 — 기존 앱이 담당
- 모바일 앱 — 웹앱 우선, 반응형 웹으로 대응
- 사용자 인증/권한 관리 — v1에서는 사내 직접 접근
- 다국어 지원 — 한국어 전용

## Context

- 기존 "브랜드 페르소나" 앱 존재 (brand-ashy-kappa.vercel.app)
  - React 19 + Google GenAI + Lucide React + Pretendard 폰트
  - 브랜드명 → 페르소나 확장 방향
- 소상공인 마스터 AI 문서의 입력 카테고리 참조
  - 기본정보, 브랜드 아이덴티티, 상품/서비스, 고객/시장, CEO 비전
- AI 추론은 Gemini 3.1 Pro API 사용
- 폐쇄형 RAG 구조 — 업로드된 자료 기반으로만 브랜드명 추론

## Constraints

- **Tech Stack**: React 웹앱 (기존 앱과 동일 스택)
- **AI**: Gemini 3.1 Pro API
- **디자인**: 심플 + 고급스러움, CSS 전문가 수준 퀄리티
- **사용자**: 100인 사내 직원
- **파일 제한**: 모든 소스 파일 500줄 이하
- **언어**: 한국어 UI, 한국어 문서

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 기존 페르소나 항목 그대로 사용 | 일관성, 기존 앱과 연계 | — Pending |
| 한 화면 스크롤 레이아웃 | 탭/단계 전환 없이 자연스러운 흐름 | — Pending |
| 노트북LM 방식 RAG | 업로드 자료 기반 신뢰성 확보 | — Pending |
| Gemini 3.1 Pro | 브랜드명 추론 엔진 | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-02 after Phase 6 complete — all v1.1 phases done*
