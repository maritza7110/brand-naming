# Requirements: 브랜드 네이밍 앱

**Defined:** 2026-04-08
**Core Value:** 데이터 기반 논리적 네이밍 + 소셜 협업 + 개인 자산 관리

## v2.1 Requirements

사내 앱 고급화 및 정밀화. 새 기능 없이 기존 기능의 품질을 상용 수준으로 끌어올림.

### AI 품질

- [ ] **AI-01**: AI 모델이 gemini-3.1-pro-preview를 사용하여 추천 품질이 향상된다
- [ ] **AI-02**: CLAUDE.md의 모델명이 실제 사용 모델과 일치한다

### 보안

- [ ] **SEC-01**: Supabase 접속 정보가 소스 코드가 아닌 환경변수에서 관리된다
- [ ] **SEC-02**: CSP 헤더에서 unsafe-eval이 제거된다
- [ ] **SEC-03**: 디버그용 API 엔드포인트가 프로덕션에서 제거된다

### 안정성

- [x] **STB-01**: AI 추천 요청이 30초 타임아웃 + 2회 재시도로 안정적으로 처리된다
- [x] **STB-02**: AI 응답이 비었거나 잘못된 형식일 때 사용자에게 명확한 안내가 표시된다
- [x] **STB-03**: 모든 서비스에서 에러 발생 시 원인 파악 가능한 로그가 남는다
- [x] **STB-04**: 로그아웃 시 브라우저에 저장된 개인 데이터가 정리된다

### 데이터 정합성

- [ ] **DATA-01**: 추천을 받을 때마다 새 세션이 생성되지 않고 기존 세션이 업데이트된다
- [ ] **DATA-02**: 리더보드가 전체 데이터를 불러오지 않고 서버에서 집계된 결과를 사용한다

### 테스트

- [ ] **TEST-01**: Vitest 테스트 프레임워크가 설치되고 실행 가능하다
- [ ] **TEST-02**: AI 응답 파싱 로직에 대한 테스트가 존재한다 (정상/빈값/잘못된 JSON)
- [ ] **TEST-03**: 세션 저장/복원 로직에 대한 테스트가 존재한다

### 디자인

- [ ] **DSN-01**: 하드코딩된 색상값이 CSS 변수로 관리되어 일괄 변경이 가능하다

## Future Requirements

- 외부 제품화 시 Gemini API 서버 프록시 (Vercel Serverless Function)
- SEO 랜딩 페이지 (vite-plugin-prerender)
- 다크/라이트 모드 전환 (CSS 변수 기반 준비됨)
- 오프라인 지원

## Out of Scope

| Feature | Reason |
|---------|--------|
| Gemini 서버 프록시 | 사내 앱이므로 클라이언트 호출 유지. 외부 공개 시 필수 |
| 새 기능 추가 | HOLD SCOPE 모드. 품질 고급화만 집중 |
| 외부 모니터링 (Sentry) | 100인 사내 앱에 과함. 구조화 로깅으로 충분 |
| 전체 테스트 커버리지 | 핵심 경로만. 80%+ 커버리지는 다음 마일스톤 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AI-01 | Phase 12 | Pending |
| AI-02 | Phase 12 | Pending |
| SEC-01 | Phase 13 | Pending |
| SEC-02 | Phase 13 | Pending |
| SEC-03 | Phase 13 | Pending |
| STB-01 | Phase 14 | Complete |
| STB-02 | Phase 14 | Complete |
| STB-03 | Phase 14 | Complete |
| STB-04 | Phase 14 | Complete |
| DATA-01 | Phase 15 | Pending |
| DATA-02 | Phase 15 | Pending |
| TEST-01 | Phase 16 | Pending |
| TEST-02 | Phase 16 | Pending |
| TEST-03 | Phase 16 | Pending |
| DSN-01 | Phase 16 | Pending |

**Coverage:**
- v2.1 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-08*
*Last updated: 2026-04-08 after roadmap creation*
