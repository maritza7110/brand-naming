# 브랜드 네이밍 앱

## What This Is

소상공인의 상품정보, 사장님 정보, 브랜드 페르소나 항목을 하나씩 입력할 때마다 AI가 브랜드명을 추천하는 사내 웹앱. 237개 산업분류 체계 기반 업종 선택, 업종별 추천 카드 그루핑, 모바일 반응형 레이아웃을 제공한다. 100인 규모 회사 직원 누구나 사용.

## Core Value

페르소나 항목을 채워갈수록 점점 정교해지는 브랜드명 추천 — 입력할 때마다 즉시 결과를 보여주는 인터랙티브 경험.

## Current State

**Shipped:** v1.1 UX 개선 (2026-04-02)
**Codebase:** 1,739 LOC TypeScript/TSX, React 19 + Vite 6 + Tailwind CSS 4 + Zustand
**Status:** Planning next milestone

**v1.1에서 추가된 것:**
- 237개 산업분류 데이터 기반 대분류>중분류>소분류 3단 계층형 드롭다운
- 추천 카드 소분류 업종별 그루핑 + CSS Grid 접기/펼치기 애니메이션
- 업종 변경 시 이전 그룹 자동 접힘 + 네이밍 초기화 버튼
- 모바일 반응형 레이아웃 (세로 스택 전환, min-w 제거, lg: 브레이크포인트)
- 모바일 터치 UX 최적화 (44px 터치 타겟, 추천 완료 시 자동 스크롤)

## Requirements

### Validated

- ✓ 상품/가게 기본정보 입력 (업종, 위치, 규모, 상품, 가격대) — v1.0 Phase 1
- ✓ 사장님 정보 입력 (비전, 꿈, 5/10년 목표, 스토리) — v1.0 Phase 1
- ✓ 브랜드 페르소나 항목 입력 (철학, 슬로건, 미션 등) — v1.0 Phase 1
- ✓ 왼쪽 70% 입력 / 오른쪽 30% 추천 카드 누적 레이아웃 — v1.0 Phase 1
- ✓ 심플하고 고급스러운 디자인 (Pretendard 폰트) — v1.0 Phase 1
- ✓ 업종 입력을 산업분류 계층형 드롭다운으로 교체 — v1.1 Phase 4
- ✓ 추천 카드 소분류 업종별 그루핑 (접기/펼치기) — v1.1 Phase 5
- ✓ 업종 변경 시 이전 업종 추천 자동 접힘 — v1.1 Phase 5
- ✓ 모바일 반응형 레이아웃 (세로 스택) — v1.1 Phase 6

### Active

(Next milestone에서 정의)

### Out of Scope

- 브랜드명에서 페르소나를 확장하는 기능 — 기존 앱이 담당
- 모바일 네이티브 앱 — 반응형 웹으로 대응 완료 (v1.1)
- 사용자 인증/권한 관리 — 사내 앱, 직접 접근
- 다국어 지원 — 한국어 전용
- 실시간 자동 추천 — 비용 낭비 + UX 혼란, 버튼 클릭 방식 유지

## Context

- React 19 + Vite 6 + Tailwind CSS 4.2 + Zustand + Lucide React + Pretendard 폰트
- AI: Gemini 3.1 Pro API (Google GenAI SDK)
- 폐쇄형 RAG: pdf.js 텍스트 추출 → 인메모리 청크 검색
- 237개 산업분류 데이터 (정적 TypeScript)
- Zustand persist v2 (localStorage 마이그레이션 체계)
- 모바일 반응형: `lg:` (1024px) 브레이크포인트 기반

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
| 기존 페르소나 항목 그대로 사용 | 일관성, 기존 앱과 연계 | ✓ Good |
| 한 화면 스크롤 레이아웃 | 탭/단계 전환 없이 자연스러운 흐름 | ✓ Good |
| 노트북LM 방식 RAG | 업로드 자료 기반 신뢰성 확보 | ✓ Good |
| Gemini 3.1 Pro | 브랜드명 추론 엔진 | ✓ Good |
| 237개 정적 산업분류 데이터 | 서버 불필요, 빠른 탐색 | ✓ Good (v1.1) |
| lg: 1024px 브레이크포인트 | Tailwind 기본값, 태블릿/데스크톱 자연 분기 | ✓ Good (v1.1) |
| mobile-first 반응형 | 모바일 기본 → lg: 데스크톱 확장 | ✓ Good (v1.1) |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition:**
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone:**
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-02 after v1.1 milestone complete*
