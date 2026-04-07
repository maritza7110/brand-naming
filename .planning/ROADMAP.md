# Roadmap: 브랜드 네이밍 앱

## Milestones

- ✅ **v1.0 MVP** — 기초 UI 및 AI 추천 엔진 (shipped 2026-04-01)
- ✅ **v1.1 UX 개선** — 산업분류 및 모바일 반응형 (shipped 2026-04-02)
- ✅ **v2.0 Logic & Social** — 지능형 로직 및 소셜 협업 플랫폼 (shipped 2026-04-06)
- 🚧 **v2.1 고급화 및 정밀화** — Phases 12-16 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-3) — SHIPPED 2026-04-01</summary>

- [x] Phase 1-3: Foundation + Input UI + AI Recommend (3/3 plans)

</details>

<details>
<summary>✅ v1.1 UX 개선 (Phases 4-6) — SHIPPED 2026-04-02</summary>

- [x] Phase 4-6: Industry Dropdown + Card Grouping + Mobile Responsive (6/6 plans)

</details>

<details>
<summary>✅ v2.0 Logic & Social (Phases 7-11) — SHIPPED 2026-04-06</summary>

- [x] Phase 7: Foundation & Authentication (3/3 plans) — Supabase Auth + 대시보드
- [x] Phase 8: Strategic Naming Logic (4/4 plans) — 3탭 위저드 + Rationale UI
- [x] Phase 9: Social Gallery & Collaboration (4/4 plans) — 갤러리 + 좋아요/북마크
- [x] Phase 10: Refinement & Data Visualization (4/4 plans) — 필터/댓글/리더보드/차트
- [x] Phase 11: UX 재설계 (3/3 plans) — 4탭 위저드 + 페르소나 5그룹

</details>

### 🚧 v2.1 사내 앱 고급화 및 정밀화 (In Progress)

**Milestone Goal:** 기존 v2.0 기능을 상용 수준의 안정성, 보안, AI 품질로 끌어올리기. 새 기능 없음 — 품질 고급화만.

- [x] **Phase 12: AI 모델 업그레이드** — gemini-3.1-pro-preview 전환으로 추천 품질 향상 (completed 2026-04-07)
- [ ] **Phase 13: 보안 강화** — 환경변수, CSP, 디버그 엔드포인트 정리
- [ ] **Phase 14: 안정성 개선** — 타임아웃/재시도/에러 처리/로그아웃 정리
- [ ] **Phase 15: 데이터 정합성** — 세션 오염 수정, 리더보드 서버사이드 집계
- [ ] **Phase 16: 테스트 및 디자인 시스템** — Vitest 기반 구축, CSS 변수 토큰화

## Phase Details

### Phase 12: AI 모델 업그레이드
**Goal**: AI 추천이 gemini-3.1-pro-preview 모델로 실행되어 추론 품질이 향상된다
**Depends on**: Phase 11 (v2.0 완성)
**Requirements**: AI-01, AI-02
**Success Criteria** (what must be TRUE):
  1. 추천 요청 시 gemini-3.1-pro-preview 모델이 실제로 사용된다
  2. CLAUDE.md의 모델명이 소스 코드에서 사용 중인 모델명과 일치한다
  3. 기존 추천 기능이 모델 교체 후에도 정상 동작한다
**Plans**: 1 plan
Plans:
- [x] 12-01-PLAN.md — MODEL_NAME 상수 변경 + CLAUDE.md 문서 동기화

### Phase 13: 보안 강화
**Goal**: 앱이 프로덕션 보안 기준을 충족한다 — 자격증명 노출 없음, CSP 강화, 디버그 경로 없음
**Depends on**: Phase 12
**Requirements**: SEC-01, SEC-02, SEC-03
**Success Criteria** (what must be TRUE):
  1. Supabase URL과 키가 소스 코드 어디에도 하드코딩되어 있지 않고 환경변수에서만 읽힌다
  2. CSP 헤더에 unsafe-eval이 포함되지 않아 브라우저 보안 경고가 없다
  3. /api/debug 등 디버그용 엔드포인트가 프로덕션 빌드에서 접근 불가하다
**Plans**: TBD

### Phase 14: 안정성 개선
**Goal**: AI 요청 실패, 응답 파싱 오류, 로그아웃 잔류 데이터가 사용자에게 올바르게 처리된다
**Depends on**: Phase 13
**Requirements**: STB-01, STB-02, STB-03, STB-04
**Success Criteria** (what must be TRUE):
  1. AI 추천 요청이 30초를 초과하면 타임아웃 메시지가 표시되고 2회까지 자동 재시도된다
  2. AI 응답이 비어있거나 잘못된 형식일 때 "다시 시도해 주세요" 같은 명확한 안내가 화면에 표시된다
  3. 에러 발생 시 서비스명·오류코드·타임스탬프가 포함된 로그가 콘솔에 기록된다
  4. 로그아웃 후 브라우저 localStorage/sessionStorage에서 개인 데이터가 삭제된다
**Plans**: TBD
**UI hint**: yes

### Phase 15: 데이터 정합성
**Goal**: 세션이 오염 없이 누적되고 리더보드가 서버사이드 집계로 성능 문제 없이 동작한다
**Depends on**: Phase 14
**Requirements**: DATA-01, DATA-02
**Success Criteria** (what must be TRUE):
  1. 같은 사용자가 동일 입력으로 추천을 여러 번 받아도 세션이 하나만 존재하고 업데이트된다
  2. 리더보드 로딩 시 전체 행이 아닌 집계된 결과만 네트워크로 전송된다
  3. 리더보드가 100개 이상의 세션이 있어도 지연 없이 표시된다
**Plans**: TBD

### Phase 16: 테스트 및 디자인 시스템
**Goal**: 핵심 로직에 자동화 테스트가 존재하고 색상이 CSS 변수로 통합 관리된다
**Depends on**: Phase 15
**Requirements**: TEST-01, TEST-02, TEST-03, DSN-01
**Success Criteria** (what must be TRUE):
  1. `npm run test`로 Vitest 테스트가 실행되고 통과한다
  2. AI 응답 파싱 함수에 대해 정상/빈값/잘못된 JSON 케이스가 모두 테스트된다
  3. 세션 저장 및 복원 로직에 대한 테스트가 존재하고 통과한다
  4. 하드코딩된 색상값 (#B48C50, #0F0F11 등)이 CSS 변수로 교체되어 토큰 파일 하나로 전체 변경이 가능하다
**Plans**: TBD
**UI hint**: yes

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1-3. MVP | v1.0 | 3/3 | Complete | 2026-04-01 |
| 4-6. UX 개선 | v1.1 | 6/6 | Complete | 2026-04-02 |
| 7. Auth & DB | v2.0 | 3/3 | Complete | 2026-04-03 |
| 8. Naming Logic | v2.0 | 4/4 | Complete | 2026-04-05 |
| 9. Social Gallery | v2.0 | 4/4 | Complete | 2026-04-05 |
| 10. Refinement | v2.0 | 4/4 | Complete | 2026-04-06 |
| 11. UX 재설계 | v2.0 | 3/3 | Complete | 2026-04-06 |
| 12. AI 모델 업그레이드 | v2.1 | 1/1 | Complete    | 2026-04-07 |
| 13. 보안 강화 | v2.1 | 0/TBD | Not started | - |
| 14. 안정성 개선 | v2.1 | 0/TBD | Not started | - |
| 15. 데이터 정합성 | v2.1 | 0/TBD | Not started | - |
| 16. 테스트 및 디자인 시스템 | v2.1 | 0/TBD | Not started | - |
