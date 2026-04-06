# Phase 07 Human UAT: Foundation & Authentication

**Status:** IN_PROGRESS
**Last updated:** 2026-04-03

## Test Cases

| ID | Feature | Scenario | Result | Notes |
|----|---------|----------|--------|-------|
| T01 | 회원가입 | `SignupPage`에서 유효한 정보 입력 시 성공 메시지 및 로그인 이동 | PENDING | |
| T02 | 로그인 | `LoginPage`에서 가입된 계정으로 로그인 성공 후 메인/대시보드 이동 | PENDING | |
| T03 | 접근 제어 | 로그아웃 상태에서 `/dashboard` 접근 시 `/login` 리다이렉션 | PENDING | |
| T04 | 로그아웃 | 대시보드 헤더의 로그아웃 버튼 클릭 시 세션 종료 및 로그인 이동 | PENDING | |
| T05 | 대시보드 목록 | 로그인 시 본인의 세션 목록 로드 및 검색 필터링 작동 | PENDING | |
| T06 | 데이터 보안 | RLS 정책에 의해 타 사용자의 프로젝트가 목록에 노출되지 않음 | PENDING | (SQL 검토 완료) |
| T07 | 프로젝트 삭제 | 대시보드 카드에서 삭제 버튼 클릭 시 실제 DB 반영 및 UI 업데이트 | PENDING | |

## Automated Checks (Diagnostics)

- [x] `@supabase/supabase-js`, `react-router-dom`, `date-fns` 패키지 설치 완료
- [x] `src/services/supabase.ts` 클라이언트 초기화 코드 검증
- [x] `src/App.tsx` 라우팅 및 리스너 구조 검증
- [x] `supabase/migrations/07_init_schema.sql` RLS 정책 논리 검증

## Feedback & Issues

- N/A

---
**Next Step:** Execute individual tests and record results.
