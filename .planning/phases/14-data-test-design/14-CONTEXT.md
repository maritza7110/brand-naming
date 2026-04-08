# Phase 14: 데이터 정합성 + 테스트/디자인 시스템 - Context

**Gathered:** 2026-04-08
**Status:** Ready for planning

<domain>
## Phase Boundary

세션 오염 없이 데이터가 정합하고, 핵심 로직에 자동화 테스트가 존재하며, 색상이 CSS 변수로 통합 관리된다. 새 기능 추가 없이 기존 기능의 품질 개선만 수행한다.

</domain>

<decisions>
## Implementation Decisions

### 세션 오염 수정
- **D-01:** Zustand에 `currentSessionId`를 보관. 첫 추천 시 `createSession()`, 이후 추천은 `updateSession()`으로 기존 세션 업데이트
- **D-02:** 추천 결과는 누적 저장 — 이전 batch와 새 batch 모두 보존하여 세션에 전체 히스토리 남김
- **D-03:** 위저드 초기화 시 (새 네이밍 시작 / 페이지 새로고침 / 초기화 버튼) sessionId 리셋 → null로 설정하면 다음 추천 시 새 세션 생성
- **D-04:** 대시보드에서 세션 복원 시 해당 sessionId를 Zustand에 세팅 → 추가 추천을 받으면 기존 세션에 누적

### 리더보드 집계 방식
- **D-05:** 현재 클라이언트 집계 방식 유지 + Supabase `.limit()` 추가로 전송량 제한. 100인 사내 앱에 RPC/View는 과도함
- **D-06:** 로딩 UX는 현재 스켈레톤 로더 그대로 유지

### 테스트 인프라
- **D-07:** Vitest 설치 + `npm run test` 스크립트 설정
- **D-08:** 테스트 범위는 요구사항만 — AI 응답 파싱 (정상/빈값/잘못된 JSON) + 세션 저장/복원 로직
- **D-09:** 순수 로직만 테스트 — Supabase 호출 전/후의 데이터 변환 로직을 테스트. Supabase 모킹 불필요

### CSS 변수 토큰화
- **D-10:** 시맨틱 토큰 네이밍 (--color-bg, --color-surface, --color-accent, --color-text-primary 등 역할 기반)
- **D-11:** index.css의 :root에 CSS 변수 선언. 별도 파일 불필요, Tailwind와 호환

### Claude's Discretion
- 세션 ID 저장을 위한 Zustand store 구조 (기존 useFormStore 확장 vs 별도 store)
- likes 쿼리의 .limit() 적절한 값
- Vitest 설정 세부 사항 (jsdom 등)
- 시맨틱 토큰의 정확한 이름 목록과 매핑

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 프로젝트 요구사항
- `.planning/REQUIREMENTS.md` — DATA-01, DATA-02, TEST-01, TEST-02, TEST-03, DSN-01 요구사항
- `.planning/ROADMAP.md` — Phase 14 Success Criteria 7개 항목

### 이전 Phase 결정
- `.planning/phases/13-stability/13-CONTEXT.md` — "사내 앱이므로 과도한 방어 코드는 피하고 실질적 문제만 해결" 원칙

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/services/sessionService.ts` — `createSession()`, `updateSession()` 모두 존재. updateSession은 naming_results 삭제 후 재삽입 방식 → 누적 저장으로 변경 필요
- `src/hooks/useRecommend.ts` — 추천 흐름의 세션 저장 로직 위치 (line 57). withRetry 헬퍼 이미 구현됨
- `src/store/useFormStore.ts` — Zustand store. currentSessionId 추가 대상
- `src/components/gallery/GalleryLeaderboard.tsx` — 리더보드 UI (스켈레톤 로더 이미 구현)
- `src/services/galleryService.ts:70-100` — 리더보드 데이터 페칭 (likes 전체 조회 후 JS 집계)
- `src/index.css` — :root CSS 변수 선언 위치

### Established Patterns
- Zustand `setError(message)` → 에러 상태 관리 패턴
- `useRecommend.ts`의 try/catch → 기존 에러 처리 흐름
- 하드코딩 색상 7종: #B48C50(골드), #0F0F11(배경), #1A1A1E(서피스), #4A4440(보더), #E8E2DA(텍스트1), #D0CAC2(텍스트2), #A09890(텍스트3)

### Integration Points
- `useRecommend.ts:57` — createSession → createOrUpdate 로직으로 변경
- `galleryService.ts:72` — likes 쿼리에 .limit() 추가
- `index.css :root` — CSS 변수 선언 추가
- 30개 파일 116곳의 하드코딩 색상 → CSS 변수 참조로 교체

</code_context>

<specifics>
## Specific Ideas

- 사내 앱이므로 과도한 엔지니어링 회피 — 리더보드는 RPC 대신 .limit()으로 충분
- 테스트도 핵심 경로만 — 모킹 없이 순수 함수 테스트로 유지보수 부담 최소화
- Phase 13의 원칙 계승: "실질적 문제만 해결"

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 14-data-test-design*
*Context gathered: 2026-04-08*
