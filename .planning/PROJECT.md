# 브랜드 네이밍 앱 v2.0: 지능형 로직 및 소셜 협업 플랫폼

## What This Is

소상공인과 브랜드 기획자를 위한 전문 브랜드 네이밍 솔루션. 단순히 이름을 생성하는 것을 넘어, 시장 분석-페르소나 정의-핵심 가치 도출로 이어지는 **논리적 네이밍 프레임워크**를 제공한다. 개인별 네이밍 프로젝트 관리와 타 사용자의 결과물을 참고할 수 있는 **소셜 공유 기능**을 통해 협업적 네이밍 경험을 구현한다.

## Core Value

1.  **Logical Validity:** 데이터에 기반한 체계적인 네이밍 프로세스 (Naming Logic 2.0).
2.  **Social Inspiration:** 다른 기획자들의 네이밍 결과와 로직을 참고하여 영감을 얻는 커뮤니티 공간.
3.  **Persistent Management:** 개인별 네이밍 세션 저장 및 체계적인 분류(카테고리/태그).

## Current State

**v1.1 Shipped:** UX 및 반응형 레이아웃 개선 완료.
**v2.0 Phase 9 Complete:** 소셜 갤러리 & 협업 — 공개 발행/철회, 무한 스크롤 갤러리 피드, 좋아요/북마크 시스템, 상세 모달.
**Status:** Phase 9 complete, advancing to Phase 11 (UX).

## Requirements

### Active (v2.0)

- **지능형 네이밍 로직:**
    - [ ] 시장 분석(경쟁사), 타겟 페르소나, 핵심 가치(USP) 데이터 입력 항목 고도화.
    - [ ] 입력 데이터와 생성 결과 간의 논리적 연결성 강화 (Gemini 프롬프트 최적화).
    - [ ] 네이밍 기법(합성어, 추상어 등) 선택 기능.
- **데이터 관리 및 저장:**
    - [ ] '네이밍 세션' 단위의 프로젝트 저장 및 관리 기능.
    - [ ] 결과물 분류 체계 도입 (산업군, 스타일, 네이밍 기법).
    - [ ] 개인별 네이밍 아카이브 (Private Vault).
- **소셜 및 협업:**
    - [ ] 사용자 인증 및 개인 프로필 (로그인 기능).
    - [ ] 공개 게시판 (Public Gallery): 선별된 네이밍 결과 공유 및 레퍼런스 활용.
    - [ ] 피드백 시스템: 좋아요, 댓글, 추천 점수.
- **UI/UX 고도화:**
    - [ ] 전문가용 대시보드 형태의 UI 구성.
    - [ ] 네이밍 프로세스 단계별 가이드 제공.

### Validated (v1.x)
- ✓ 산업분류 계층형 드롭다운 (v1.1)
- ✓ 추천 카드 그루핑 및 애니메이션 (v1.1)
- ✓ 모바일 반응형 레이아웃 (v1.1)

## Context

- **AI**: Gemini 3.1 Pro (논리적 추론 엔진 고도화 필요).
- **Storage**: Supabase 또는 Firebase 기반 Auth 및 DB 연동 (v2.0 검토 중).
- **Frontend**: React 19 + Tailwind 4 + Zustand.
- **Design**: 'Pro' 지향적인 심플 + 고급스러운 UI.

## Constraints

- **언어**: 한국어 기반 (글로벌 확장성 고려한 아키텍처).
- **성능**: 대량의 네이밍 데이터 로딩 시 최적화.
- **보안**: 개인 네이밍 데이터의 철저한 비공개 보장.


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
