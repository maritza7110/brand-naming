# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.1 — UX 개선

**Shipped:** 2026-04-02
**Phases:** 3 | **Plans:** 6 | **Sessions:** 1

### What Was Built
- 237개 산업분류 데이터 기반 대분류>중분류>소분류 3단 계층형 드롭다운
- 추천 카드 소분류 업종별 그루핑 + CSS Grid 접기/펼치기 + 업종 변경 자동 접힘
- 네이밍 초기화 버튼 (기존 추천 아카이브 처리)
- 모바일 반응형 레이아웃 (세로 스택 + 터치 UX + 자동 스크롤)

### What Worked
- discuss-phase → plan-phase → execute-phase 자동 체인이 효율적 (auto_advance 설정)
- UI-SPEC.md가 정확한 Tailwind 클래스를 명시해서 executor가 모호함 없이 구현
- 파일 크기가 작아서 (최대 284줄) 검증이 빠르고 정확함
- Wave 기반 병렬 실행이 dependency 있는 plan 간 순서를 자연스럽게 보장

### What Was Inefficient
- Phase 05 VERIFICATION.md 누락 — execute-phase에서 verifier를 건너뛴 것으로 보임
- 일부 SUMMARY.md에 one_liner 필드 누락 — milestone 통계 추출 시 수동 보완 필요
- v1.0 phases (1-3)는 GSD 이전에 구축되어 SUMMARY/VERIFICATION 아티팩트가 불완전

### Patterns Established
- `lg:` (1024px) 기준 mobile-first 반응형 패턴 정착
- Zustand persist version 관리 체계 (v0→v1→v2 마이그레이션 체인)
- CSS Grid `grid-rows-[0fr]/[1fr]` 접기/펼치기 애니메이션 패턴
- 업종 데이터는 정적 TypeScript 파일로 관리

### Key Lessons
1. UI-SPEC.md에 exact Tailwind 클래스를 명시하면 executor가 정확하게 구현한다 — 모호한 디자인 지시보다 concrete 클래스가 효과적
2. Phase 완료 시 VERIFICATION.md 생성을 건너뛰면 milestone audit에서 "verification gap"으로 잡힌다 — verifier_enabled 설정 확인 필요
3. 모바일 반응형은 대부분 className 교체만으로 충분 — 새 컴포넌트/패키지 불필요

### Cost Observations
- Model mix: 주로 opus (planner/executor), sonnet (checker/verifier)
- Sessions: 1 session으로 3 phases 완료
- Notable: auto_advance로 discuss→plan→execute 체인 자동화

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | N/A | 3 | Pre-GSD 구축, 아티팩트 불완전 |
| v1.1 | 1 | 3 | Full GSD workflow, auto-advance, UI-SPEC |

### Top Lessons (Verified Across Milestones)

1. 파일 500줄 제한이 검증과 리팩토링 모두에서 효과적 — 작은 파일이 정확한 검증을 가능하게 한다
2. UI-SPEC → PLAN → EXECUTE 체인에서 concrete 값이 흘러야 shallow execution을 방지한다
