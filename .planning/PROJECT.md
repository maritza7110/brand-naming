# 브랜드 네이밍 앱: 지능형 로직 및 소셜 협업 플랫폼

## What This Is

소상공인과 브랜드 기획자를 위한 전문 브랜드 네이밍 솔루션. 4단계 위저드(분석/정체성/페르소나/표현)를 통한 **논리적 네이밍 프레임워크**, 개인 대시보드와 ��션 관리, 공개 갤러리를 통한 **소셜 공유·피드백**, 데이터 시각화를 통한 **네이밍 인사이트**를 제공한다.

## Core Value

1.  **Logical Validity:** 데이터에 기반한 체계적인 네이밍 프로세스 (4탭 위저드 + Rationale).
2.  **Social Inspiration:** 갤러리·댓글·리더보드를 통해 동료들의 네이밍에서 영감을 얻는 커뮤니티.
3.  **Persistent Management:** 개인 세션 저장, 북마크, 통계 시각화를 통한 자산 관리.

## Current Milestone: v2.1 사내 앱 고급화 및 정밀화

**Goal:** 기존 v2.0 기능을 상용 수준의 안정성, 보안, AI 품질로 끌어올리기

**Target features:**
- AI 모델을 gemini-3.1-pro-preview로 업그레이드
- 보안 취약점 전면 수정 (환경변수, CSP, 디버그 제거)
- 에러 처리 완비 (타임아웃, 재시도, 구조화 로깅)
- 세션 오염 수정 (매 추천마다 새 세션 생성 문제)
- 리더보드 성능 수정 (전체 테이블 풀스캔 → 서버사이드 집계)
- 테스트 기반 구축 (Vitest + 핵심 경로 테스트)
- 디자인 시스템화 (CSS 변수 토큰)

## Current State

**v2.0 Shipped (2026-04-06):** 지능형 로직 및 소셜 협업 플랫폼 완성.
- ~55개 TypeScript/TSX 소스 파일 (테스트 포함)
- Supabase Auth + DB, Gemini 3.1 Pro (gemini-3.1-pro-preview), recharts, Vitest
- Phase 12 완료 (2026-04-07): AI 모델 업그레이드
- Phase 13 완료 (2026-04-07): 안정성 개선 — Gemini API 30초 타임아웃 + 2회 자동 재시도
- Phase 14 완료 (2026-04-08): 데이터 정합성 + 테스트 + 디자인 토큰 — 세션 오염 수정, Vitest 14건, CSS 변수 8종

## Requirements

### Validated (v2.0)
- ✓ Supabase 기반 인증 + 사용자 프로필 — v2.0 (Phase 7)
- ✓ 개인 대시보드 + 세션 관리 — v2.0 (Phase 7)
- ✓ 3단계 위저드(분석/정체성/표현) 도입 — v2.0 (Phase 8)
- ✓ 경쟁사·USP·브랜드 퍼스낼리티 등 신규 입력 항목 — v2.0 (Phase 8)
- ✓ 네이밍 기법 선택 + 키워드 가중치 — v2.0 (Phase 8)
- ✓ Rationale UI (논리적 타당성 근거 제시) — v2.0 (Phase 8)
- ✓ 공개 갤러리 + 발행/철회 — v2.0 (Phase 9)
- ✓ 좋아요·북마크·무한 스크롤 — v2.0 (Phase 9)
- ✓ 갤러리 필터링(업종/스타일/키워드) — v2.0 (Phase 10)
- ✓ 댓글 시스템(플랫 댓글) — v2.0 (Phase 10)
- ✓ 인기 랭킹 리더보드(주간/전체) — v2.0 (Phase 10)
- ✓ 대시보드 데이터 시각화(recharts 차트 3종) — v2.0 (Phase 10)
- ✓ 4탭 위저드 재설계(분석/정체성/페르소나/표현) — v2.0 (Phase 11)
- ✓ 페르소나 5그룹 분리 + 관점 차이 배지 — v2.0 (Phase 11)

### Validated (v1.x)
- ✓ 산업분류 계층형 드롭다운 — v1.1
- ✓ 추천 카드 그루핑 및 애니메이션 — v1.1
- ✓ 모바일 반응형 레이아웃 — v1.1
- ✓ 기본 정보 입력 및 AI 추천 엔진 — v1.0
- ✓ pdf.js 기반 RAG — v1.0

### Active (v2.1)
- [x] AI 모델 gemini-3.1-pro-preview로 업그레이드 — Validated in Phase 12
- [ ] Supabase 자격증명 환경변수로 이동
- [ ] unsafe-eval CSP 제거, 디버그 엔드포인트 제거
- [x] Gemini API 30초 타임아웃 + 2회 재시도 — Validated in Phase 13
- [ ] 빈 응답/파싱 실패 시 명확한 에러 메시지
- [ ] 구조화된 에러 로깅 (서비스 전체)
- [x] 세션 오염 수정 (매 추천 시 새 세션 생성 방지) — Validated in Phase 14
- [x] 리더보드 likes 쿼리 1000건 limit — Validated in Phase 14
- [x] 테스트 인프라 (Vitest) + 핵심 경로 테스트 — Validated in Phase 14
- [x] 색상 CSS 변수 토큰화 (8종, 214곳) — Validated in Phase 14
- [ ] 로그아웃 시 로컬 데이터 정리

### Out of Scope
- 실시간 자동 상표권 검색 API 연동 (복잡도 이슈로 v3.0 이후 검토)
- 모바일 네��티브 앱 개발 (PWA 수준으로 대응)
- 기업용 유료 구독 모델 (초��에는 모든 직원 무료 접근)

## Context

- **AI**: Gemini 3.1 Pro — 네이밍 추론 + Rationale 생성
- **Storage**: Supabase (Auth + PostgreSQL + Row Level Security)
- **Frontend**: React 19 + Tailwind CSS 4 + Zustand + React Router v7
- **Charts**: recharts 3.8.x
- **Design**: 다크 테마 (#0F0F11), 골드 포인트 (#B48C50), Pretendard 폰트
- **Deploy**: Vercel

## Constraints

- **파일 제한**: 모든 소스 파일 500줄 이하
- **언어**: 한국어 UI, 한국어 문서
- **사용자**: 100인 ���내 직원
- **성능**: 무한 스크롤 + ���관적 업데이트 패턴

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 기존 페르소나 항목 그대로 사용 | 일관성, 기존 앱과 연계 | ✓ Good |
| Gemini 3.1 Pro | 브랜드명 추론 엔진 | ✓ Good |
| 237개 정적 산업분류 데이터 | 서버 불필요, 빠른 탐색 | ✓ Good (v1.1) |
| mobile-first 반응형 | 모바일 기본 → lg: 데스크톱 확장 | ✓ Good (v1.1) |
| Supabase Auth + RLS | 서버���스 인증, 행 수준 보안 | ✓ Good (v2.0) |
| 3→4탭 위저드 재설계 | 페르소나 분리로 입력 부담 감소 | ✓ Good (v2.0) |
| recharts 차트 라이브러리 | 가볍고 React 네이티브, ��크 테마 호환 | ✓ Good (v2.0) |
| 플랫 댓글 (대댓글 없음) | 100인 사내 앱에 충분, ���잡도 최소화 | ✓ Good (v2.0) |
| 좋아요 수 단순 ���렬 리더보드 | 복합 점수 없이 직관적 | ✓ Good (v2.0) |
| gemini-3.1-pro-preview 선택 | 14바이블+4Layer 채점에 Pro 급 추론 필요 | ✓ Good (v2.1 Phase 12) |
| HOLD SCOPE 리뷰 모드 | 새 기능 없이 품질 고급화 집중 | — Pending (v2.1) |

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
*Last updated: 2026-04-08 after Phase 14 completion (v2.1 마지막 phase)*
