# Phase 07: Foundation & Authentication - Research

**Researched:** 2026-04-03
**Domain:** Supabase Auth, PostgreSQL Schema Design, Dashboard UI
**Confidence:** HIGH

## Summary

본 단계는 브랜드 네이밍 앱 v2.0의 기반이 되는 사용자 인증(Auth) 시스템과 데이터 저장소(DB)를 구축하는 과정입니다. 기존의 로컬 스토리지 기반 데이터 관리를 Supabase로 이전하여 영속성을 확보하고, 사용자가 자신의 프로젝트를 체계적으로 관리할 수 있는 개인 대시보드를 기획합니다.

**Primary recommendation:** Supabase를 활용하여 Auth 인프라를 구축하고, `profiles`, `sessions`, `naming_results` 계층 구조의 DB 스키마를 설계합니다. 특히 `sessions` 테이블은 v2.0의 논리적 프레임워크 데이터를 수용하기 위해 유연한 JSONB 컬럼을 활용하며, RLS(Row Level Security)를 통해 데이터 보안을 철저히 보장합니다.

## User Constraints (from CONTEXT.md)

*N/A - No CONTEXT.md found. Initial phase context used.*

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| REQ-01 | Supabase 연동 (React 환경) | `@supabase/supabase-js` v2.x를 사용하여 Vite/React 19 환경에 최적화된 연동 방식 확인. |
| REQ-02 | User, Session, NamingResult, Tag 테이블 설계 | v2.0 논리적 프레임워크(분석-정체성-표현)를 반영한 관계형 DB 스키마 도출. |
| REQ-03 | 대시보드 디자인: 내 프로젝트 목록, 검색, 필터링 | 대시보드 레이아웃 및 검색/필터링 UX 패턴 기획. |
| REQ-04 | 보안 규칙 (RLS) 및 API 라우트 설계 | Supabase RLS 정책을 통한 Private Vault 및 Public Gallery 보안 구조 설계. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@supabase/supabase-js` | ^2.101.1 | Supabase SDK | 데이터베이스 연동, 인증, 스토리지 제어 등 핵심 API 제공. |
| `zustand` | ^5.0.12 | 전역 상태 관리 | 인증 상태(Auth) 및 세션 데이터를 효율적으로 관리. (이미 프로젝트에 포함됨) |
| `react-router-dom` | ^7.0.0 | 라우팅 | 대시보드와 메인 네이밍 UI 간의 화면 전환 관리 (추가 권장). |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|--------------|
| `lucide-react` | ^0.479.0 | 아이콘 | 대시보드 UI 요소 표현. (이미 프로젝트에 포함됨) |
| `date-fns` | ^4.1.0 | 날짜 포맷팅 | 프로젝트 생성일, 수정일 등 표시 시 사용. |

**Installation:**
```bash
npm install @supabase/supabase-js react-router-dom date-fns
```

**Version verification:**
- `@supabase/supabase-js`: 2.101.1 (최신 버전 확인 완료)
- `react-router-dom`: 7.x (React 19 호환 확인 완료)

## Architecture Patterns

### Recommended DB Schema Structure (Supabase / PostgreSQL)

1. **`profiles` 테이블 (유저 프로필)**
   - `id`: uuid (PK, references auth.users.id)
   - `full_name`: text
   - `avatar_url`: text
   - `updated_at`: timestamptz

2. **`sessions` 테이블 (네이밍 프로젝트)**
   - `id`: uuid (PK)
   - `user_id`: uuid (FK, references profiles.id)
   - `title`: text (기본값: "새 프로젝트")
   - `industry_id`: text (snapshot of industry path)
   - `input_data`: jsonb (v2.0 논리적 입력값: `storeBasic`, `brandVision`, `persona`, `analysis`, `identity`)
   - `status`: text (draft/active/completed)
   - `is_public`: boolean (default: false, 소셜 갤러리 공유 여부)
   - `created_at`: timestamptz
   - `updated_at`: timestamptz

3. **`naming_results` 테이블 (작명 결과)**
   - `id`: uuid (PK)
   - `session_id`: uuid (FK, references sessions.id)
   - `brand_name`: text
   - `reasoning`: text
   - `based_on`: jsonb (추천 근거 필드 목록)
   - `style_tag`: text (합성어/추상어 등)
   - `score`: int
   - `is_favorite`: boolean
   - `created_at`: timestamptz

4. **`tags` 테이블 (카테고리/태그)**
   - `id`: uuid (PK)
   - `user_id`: uuid (FK)
   - `name`: text

5. **`session_tags` 테이블 (N:M 관계)**
   - `session_id`, `tag_id` (Composite PK)

### Pattern 1: Auth & User Profile Sync
Supabase Auth 가입 시 데이터베이스의 `profiles` 테이블에 자동으로 레코드를 생성하기 위해 PostgreSQL **Trigger**를 사용합니다.

```sql
-- Source: Supabase Official Docs (Database Webhooks / Triggers)
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### Pattern 2: Global Auth Store with Zustand
Vite/React 환경에서는 `onAuthStateChange` 리스너를 Zustand 스토어와 결합하여 전역 인증 상태를 관리합니다.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Authentication | 사용자 계정 관리, 비밀번호 암호화 | Supabase Auth | 보안 수준 보장, 이메일/소셜 로그인/Magic Link 지원. |
| DB Access Control | 서버 사이드 권한 검사 로직 | Supabase RLS | 데이터 계층에서의 철저한 보안, 클라이언트 직접 쿼리 가능. |
| Full-Text Search | JS `filter` 기반 클라이언트 검색 | PostgreSQL `ilike` / `FTS` | 대량 데이터 로딩 방지 및 성능 최적화. |

## Common Pitfalls

### Pitfall 1: Row Level Security (RLS) 누락
**What goes wrong:** 테이블 생성 후 RLS를 활성화하지 않으면, anon 키만으로 모든 데이터에 접근하거나 수정할 수 있는 심각한 보안 이슈가 발생합니다.
**How to avoid:** 모든 테이블 생성 시 `ALTER TABLE name ENABLE ROW LEVEL SECURITY;` 명령을 반드시 수행하고, 적절한 Policy를 설정합니다.

### Pitfall 2: Client-side Session Handling
**What goes wrong:** React 19의 컴포넌트 라이프사이클과 Supabase `onAuthStateChange` 동기화가 맞지 않아 페이지 로드 시 "깜빡임" 현상이나 권한 없는 데이터 요청이 발생할 수 있습니다.
**How to avoid:** `App.tsx` 최상단에서 인증 상태 확인이 완료될 때까지 로딩 UI를 표시하거나, Next.js의 경우 SSR Middleware를 활용(Vite는 전역 로딩 처리)합니다.

## Code Examples

### Supabase Client Initialization (Vite)
```typescript
// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Row Level Security (RLS) Policy Example
```sql
-- sessions 테이블: 본인 데이터만 CRUD 가능, 공개 설정된 세션은 조회만 가능
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own sessions" 
ON sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own sessions or public ones" 
ON sessions FOR SELECT 
USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can update their own sessions" 
ON sessions FOR UPDATE 
USING (auth.uid() = user_id);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `localStorage` 저장 | Supabase DB 연동 | 2024+ (v2.0) | 기기 간 데이터 동기화 및 자산화 가능. |
| 단일 페이지 조건부 렌더링 | React Router v7 | 2024+ | 대시보드, 갤러리 등 복잡한 플랫폼 구조 지원. |
| `@supabase/auth-helpers` | `@supabase/ssr` (or direct) | 2023 | Auth Helpers 지원 중단, 통합 라이브러리로 대체. |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Supabase URL/Key | Auth & DB | ✓ | — | 환경 변수 설정 필요 |
| Supabase CLI | DB Migration & Local Dev | ✗ | — | Supabase Web Console에서 직접 설정 권장 |
| Node.js | Development | ✓ | 20.x+ | — |

**Missing dependencies with no fallback:**
- Supabase 프로젝트 생성 및 URL/Key 확보 (Human Action 필요).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest + React Testing Library |
| Config file | vitest.config.ts (TBD) |
| Quick run command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command |
|--------|----------|-----------|-------------------|
| REQ-01 | Supabase 초기화 및 접속 확인 | Unit/Integration | `npm test supabase-client` |
| REQ-02 | DB 스키마 생성 및 데이터 무결성 | Integration | `npm test db-schema` |
| REQ-04 | RLS 정책 적용 (비인가 접근 차단) | E2E/Integration | `npm test rls-policies` |

## Sources

### Primary (HIGH confidence)
- [Supabase Official Docs](https://supabase.com/docs) - Auth, RLS, Database patterns.
- [React Router v7 Docs](https://reactrouter.com/en/main) - Layouts and Navigation.
- [Zustand Documentation](https://zustand-demo.pmnd.rs/) - Auth state management.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Supabase is a proven standard for React apps.
- Architecture: HIGH - Relational schema is optimal for sessions/results.
- Pitfalls: MEDIUM - Auth/Sync complexity exists in Vite environments.

**Research date:** 2026-04-03
**Valid until:** 2026-05-03
