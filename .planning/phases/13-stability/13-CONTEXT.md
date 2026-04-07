# Phase 13: 안정성 개선 - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

AI 추천 요청이 네트워크/API 장애 시에도 사용자 경험을 해치지 않도록 타임아웃과 재시도를 추가한다. 에러 메시지 고도화, 구조화 로깅, 로그아웃 정리 등은 사내 앱에 불필요하므로 제외.

</domain>

<decisions>
## Implementation Decisions

### 타임아웃
- **D-01:** Gemini API 호출에 30초 타임아웃 적용. 30초 초과 시 요청 중단.

### 재시도 전략
- **D-02:** 타임아웃 또는 네트워크 오류 시 최대 2회 자동 재시도
- **D-03:** 재시도는 조용히 수행 — 사용자는 로딩 스피너만 보고 재시도 여부를 모름
- **D-04:** 2회 모두 실패 시에만 에러 메시지 표시 (기존 `setError(message)` 패턴 활용)

### 제외 항목 (사내 앱에 불필요)
- **D-05:** STB-02 (에러 메시지 고도화) — 현재 메시지로 충분
- **D-06:** STB-03 (구조화 로깅) — 100인 사내 앱에 과함
- **D-07:** STB-04 (로그아웃 데이터 정리) — Supabase SDK가 토큰 자체 정리, Zustand 상태도 이미 초기화됨

### Claude's Discretion
- 재시도 간 대기 시간 (backoff 전략)
- AbortController vs Promise.race 타임아웃 구현 방식
- 최종 에러 메시지 문구

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements fully captured in decisions above

### 프로젝트 요구사항
- `.planning/REQUIREMENTS.md` — STB-01 요구사항 (타임아웃 30초 + 2회 재시도)
- `.planning/ROADMAP.md` — Phase 13 Success Criteria 참조

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/hooks/useRecommend.ts` — AI 추천 호출 + 에러 처리 훅 (타임아웃/재시도 로직 추가 대상)
- `src/services/gemini.ts:generateBrandNames()` — Gemini API 호출 함수 (타임아웃 래핑 대상)

### Established Patterns
- Zustand `setError(message)` → 에러 상태 관리 패턴
- `useRecommend.ts`의 try/catch → 에러를 잡아서 사용자에게 표시하는 기존 흐름

### Integration Points
- `generateBrandNames()` 함수에 타임아웃 래핑
- `useRecommend.ts`의 `recommend()` 함수에 재시도 로직 추가

</code_context>

<specifics>
## Specific Ideas

- 사용자가 재시도를 인지하지 못하게 조용히 처리 — 로딩 스피너만 계속 보임
- 사내 앱이므로 과도한 방어 코드는 피하고 실질적 문제(API 먹통 시 무한 로딩)만 해결

</specifics>

<deferred>
## Deferred Ideas

- STB-02 (에러 메시지 고도화) — 현재 충분, 필요 시 나중에 추가
- STB-03 (구조화 로깅) — 사내 앱 규모에 과함
- STB-04 (로그아웃 데이터 정리) — 이미 동작 중, 추가 정리 불필요

</deferred>

---

*Phase: 13-stability*
*Context gathered: 2026-04-08*
