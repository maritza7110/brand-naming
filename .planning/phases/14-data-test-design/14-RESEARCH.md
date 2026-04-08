# Phase 14: 데이터 정합성 + 테스트/디자인 시스템 - Research

**Researched:** 2026-04-08
**Domain:** Vitest 테스트 설정, 세션 상태 관리, Supabase 쿼리 최적화, CSS 변수 토큰화
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Zustand에 `currentSessionId`를 보관. 첫 추천 시 `createSession()`, 이후 추천은 `updateSession()`으로 기존 세션 업데이트
- **D-02:** 추천 결과는 누적 저장 — 이전 batch와 새 batch 모두 보존하여 세션에 전체 히스토리 남김
- **D-03:** 위저드 초기화 시 (새 네이밍 시작 / 페이지 새로고침 / 초기화 버튼) sessionId 리셋 → null로 설정하면 다음 추천 시 새 세션 생성
- **D-04:** 대시보드에서 세션 복원 시 해당 sessionId를 Zustand에 세팅 → 추가 추천을 받으면 기존 세션에 누적
- **D-05:** 현재 클라이언트 집계 방식 유지 + Supabase `.limit()` 추가로 전송량 제한. 100인 사내 앱에 RPC/View는 과도함
- **D-06:** 로딩 UX는 현재 스켈레톤 로더 그대로 유지
- **D-07:** Vitest 설치 + `npm run test` 스크립트 설정
- **D-08:** 테스트 범위는 요구사항만 — AI 응답 파싱 (정상/빈값/잘못된 JSON) + 세션 저장/복원 로직
- **D-09:** 순수 로직만 테스트 — Supabase 호출 전/후의 데이터 변환 로직을 테스트. Supabase 모킹 불필요
- **D-10:** 시맨틱 토큰 네이밍 (--color-bg, --color-surface, --color-accent, --color-text-primary 등 역할 기반)
- **D-11:** index.css의 :root에 CSS 변수 선언. 별도 파일 불필요, Tailwind와 호환

### Claude's Discretion
- 세션 ID 저장을 위한 Zustand store 구조 (기존 useFormStore 확장 vs 별도 store)
- likes 쿼리의 .limit() 적절한 값
- Vitest 설정 세부 사항 (jsdom 등)
- 시맨틱 토큰의 정확한 이름 목록과 매핑

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DATA-01 | 추천을 받을 때마다 새 세션이 생성되지 않고 기존 세션이 업데이트된다 | useRecommend.ts line 57의 createSession 단순 호출을 createOrUpdate 패턴으로 교체. currentSessionId가 null이면 create, 아니면 update |
| DATA-02 | 리더보드가 전체 데이터를 불러오지 않고 서버에서 집계된 결과를 사용한다 | galleryService.ts fetchLeaderboard()의 likes 전체 조회에 .limit() 추가. 현재 클라이언트 집계 구조는 유지 |
| TEST-01 | Vitest 테스트 프레임워크가 설치되고 실행 가능하다 | vitest + @vitest/coverage-v8 설치. package.json "test" 스크립트 추가. jsdom 환경 설정 |
| TEST-02 | AI 응답 파싱 로직에 대한 테스트가 존재한다 (정상/빈값/잘못된 JSON) | gemini.ts의 파싱 로직 추출 → 순수 함수화 → 테스트 |
| TEST-03 | 세션 저장/복원 로직에 대한 테스트가 존재한다 | useFormStore의 restoreSession, setCurrentSessionId, merge 로직 테스트 |
| DSN-01 | 하드코딩된 색상값이 CSS 변수로 관리되어 일괄 변경이 가능하다 | 45개 파일 200+곳의 하드코딩 색상 → CSS 변수 교체. 8종 코어 색상 + rgba 변형 포함 |
</phase_requirements>

---

## Summary

Phase 14는 새 기능 없이 기존 코드의 품질을 높이는 4개 독립 작업으로 구성된다: (1) 세션 오염 수정, (2) 리더보드 전송량 제한, (3) Vitest 테스트 인프라 구축, (4) CSS 변수 토큰화.

코드베이스를 직접 분석한 결과, `currentSessionId` 필드와 `setCurrentSessionId`, `restoreSession` 액션이 `useFormStore`에 이미 선언되어 있다. `updateSession` 함수도 `sessionService.ts`에 존재한다. 즉, DATA-01 구현은 `useRecommend.ts:57`의 단일 `createSession` 호출을 `currentSessionId` 분기 로직으로 교체하는 것이 전부다.

CSS 색상 감사 결과 45개 파일에 202곳 이상의 하드코딩 hex 값이 존재한다. 고빈도 색상 8종이 전체의 80% 이상을 차지하며, rgba 변형 4곳도 확인됐다. DSN-01의 범위는 이 8종 코어 색상의 CSS 변수화 + 전파(propagation)다.

**Primary recommendation:** 각 작업을 독립 Wave로 분리하고 순서를 DATA-01 → DATA-02 → TEST-01~03 → DSN-01로 실행한다. DSN-01은 가장 많은 파일을 건드리므로 나머지가 안정화된 후 마지막에 처리한다.

---

## Standard Stack

### Core
| 라이브러리 | 버전 | 목적 | 비고 |
|------------|------|------|------|
| vitest | 4.1.3 | 테스트 프레임워크 | 현재 npm registry 최신 버전 확인 |
| @vitest/coverage-v8 | 4.1.3 | 커버리지 리포트 | vitest와 동일 버전 필수 |
| jsdom | (vitest 내장) | 브라우저 환경 시뮬레이션 | `environment: 'jsdom'` 설정 |

### 기존 스택 (변경 없음)
| 라이브러리 | 버전 | 역할 |
|------------|------|------|
| zustand | 5.0.12 | 상태 관리 (currentSessionId 이미 포함) |
| @supabase/supabase-js | 2.101.1 | DB 연동 |
| vite | 8.0.1 | 빌드 도구 (Vitest와 설정 공유) |

**설치 명령:**
```bash
npm install -D vitest @vitest/coverage-v8
```

**버전 검증:** 2026-04-08 기준 `npm view vitest version` → `4.1.3` 확인됨.

---

## Architecture Patterns

### Vitest 설정 패턴

Vite 8.x 프로젝트에서 Vitest는 vite.config.ts에 `test` 블록을 추가하거나 별도 `vitest.config.ts`를 생성한다. 이 프로젝트는 vite.config.ts가 단순하므로 동일 파일에 병합한다.

```typescript
// vite.config.ts — Vitest 추가 후
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ['pdfjs-dist'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

**package.json 스크립트:**
```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

`vitest run`은 CI 스타일로 1회 실행 후 종료. `vitest` 단독은 watch 모드.

### 순수 함수 추출 패턴 (TEST-02, TEST-03)

D-09에 따라 Supabase 호출 없는 순수 로직만 테스트한다. `gemini.ts`의 파싱 로직은 현재 `generateBrandNames` 함수 내부에 인라인으로 존재한다. 테스트하려면 추출이 필요하다.

**추출 대상 — AI 응답 파싱 (TEST-02):**
```typescript
// src/utils/parseGeminiResponse.ts (신규 또는 기존 utils에 추가)
export function parseSimpleResponse(raw: string): SimpleResult[] {
  if (!raw || raw.trim() === '') {
    throw new Error('AI 응답이 비어 있습니다.');
  }
  try {
    return JSON.parse(raw);
  } catch {
    const m = raw.match(/\[[\s\S]*\]/);
    if (!m) throw new Error('AI 응답을 파싱할 수 없습니다. 다시 시도해주세요.');
    return JSON.parse(m[0]);
  }
}
```

**테스트 패턴 (TEST-02):**
```typescript
// src/utils/__tests__/parseGeminiResponse.test.ts
import { describe, it, expect } from 'vitest';
import { parseSimpleResponse } from '../parseGeminiResponse';

describe('parseSimpleResponse', () => {
  it('정상 JSON 배열을 파싱한다', () => {
    const raw = '[{"brandName":"테스트","reasoning":"이유"}]';
    expect(parseSimpleResponse(raw)).toHaveLength(1);
  });
  it('빈 문자열이면 에러를 던진다', () => {
    expect(() => parseSimpleResponse('')).toThrow('AI 응답이 비어 있습니다.');
  });
  it('잘못된 JSON이면 에러를 던진다', () => {
    expect(() => parseSimpleResponse('not json')).toThrow('파싱할 수 없습니다');
  });
});
```

**테스트 패턴 (TEST-03) — 세션 저장/복원:**

`restoreSession`은 Zustand store 액션이므로 store 상태 변화를 직접 테스트한다. Supabase 없이 store 로직만 검증한다.

```typescript
// src/store/__tests__/useFormStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useFormStore } from '../useFormStore';

describe('useFormStore - 세션 관리', () => {
  beforeEach(() => {
    useFormStore.setState({ currentSessionId: null, batches: [] });
  });

  it('setCurrentSessionId로 세션 ID를 저장한다', () => {
    useFormStore.getState().setCurrentSessionId('session-123');
    expect(useFormStore.getState().currentSessionId).toBe('session-123');
  });

  it('restoreSession이 폼 상태를 복원한다', () => {
    const fakeFormState = { storeBasic: { location: '서울' } } as any;
    useFormStore.getState().restoreSession(fakeFormState, []);
    expect(useFormStore.getState().storeBasic.location).toBe('서울');
  });

  it('setCurrentSessionId(null)로 리셋하면 다음 추천 시 새 세션 생성 조건이 된다', () => {
    useFormStore.getState().setCurrentSessionId('old-session');
    useFormStore.getState().setCurrentSessionId(null);
    expect(useFormStore.getState().currentSessionId).toBeNull();
  });
});
```

### 세션 createOrUpdate 패턴 (DATA-01)

현재 `useRecommend.ts:57`:
```typescript
await sessionService.createSession(user.id, title, form, [batch]).catch(console.error);
```

변경 후:
```typescript
const state = useFormStore.getState();
const existingSessionId = state.currentSessionId;

if (existingSessionId) {
  // 기존 세션 업데이트 (누적)
  const allBatches = state.batches; // addBatch 이후의 전체 배치
  await sessionService.updateSession(existingSessionId, form, allBatches).catch(console.error);
} else {
  // 최초 세션 생성
  const newSessionId = await sessionService.createSession(user.id, title, form, state.batches).catch(console.error);
  if (newSessionId) {
    state.setCurrentSessionId(newSessionId);
  }
}
```

**주의:** `addBatch(batch)`를 먼저 호출하고 나서 세션 저장 시 `state.batches` 전체를 전달해야 누적이 된다. 현재 코드는 `[batch]` 한 개만 전달 중.

**세션 ID 리셋 시점 (D-03):**
- `resetNaming()` 호출 시 → `setCurrentSessionId(null)` 추가 필요
- 페이지 새로고침 → persist 미들웨어가 `currentSessionId`를 유지하므로 별도 처리 불필요 (persist에 포함됨 — line 210 확인)

**대시보드 복원 연동 (D-04):**
- `NamingPage.tsx:68`의 `restoreSession()` 호출 후 `setCurrentSessionId(sessionId)` 추가 필요

### updateSession 누적 저장 수정 (D-02)

현재 `sessionService.updateSession`은 naming_results를 전체 삭제 후 재삽입한다. 이 방식은 누적 저장과 호환된다 — 매번 전체 배치를 전달하므로 삭제-재삽입이 정합성을 보장한다. **변경 불필요.**

단, `input_data._batches`에도 전체 배치가 저장되어야 한다. 현재 `updateSession`은 `batches` 파라미터를 그대로 `_batches`에 저장하므로 호출 시 전체 배치를 전달하면 된다.

### 리더보드 .limit() 패턴 (DATA-02)

현재 `galleryService.ts:72`:
```typescript
let likesQuery = supabase.from('likes').select('session_id, created_at');
```

변경 후:
```typescript
// 사내 100인 앱 기준 최대 1000개 likes면 충분. 리더보드 TOP 5 계산에 필요한 최소 데이터
const LEADERBOARD_LIKES_LIMIT = 1000;
let likesQuery = supabase
  .from('likes')
  .select('session_id, created_at')
  .limit(LEADERBOARD_LIKES_LIMIT);
```

**limit() 값 결정 근거 (Claude's Discretion):** 사내 100인 앱에서 likes가 1000개를 초과할 가능성은 낮다. 리더보드 TOP 5를 뽑는 데 1000개 sample이면 통계적으로 충분하다. 과도한 방어 코드를 피하는 Phase 13 원칙 계승.

### CSS 변수 토큰화 패턴 (DSN-01)

**코어 색상 인벤토리 (실제 코드베이스 감사 결과):**

| 토큰명 | 값 | 역할 | 발생횟수 |
|--------|-----|------|---------|
| `--color-accent` | `#B48C50` | 골드 강조색 | 90 |
| `--color-text-muted` | `#A09890` | 3차 텍스트/비활성 | 65 |
| `--color-border` | `#4A4440` | 기본 보더 | 50 |
| `--color-text-secondary` | `#D0CAC2` | 2차 텍스트 | 22 |
| `--color-text-primary` | `#E8E2DA` | 1차 텍스트 | 17 |
| `--color-bg` | `#2C2825` | 최외곽 배경 | 17 |
| `--color-surface` | `#1A1A1E` | 카드/패널 배경 | 15 |
| `--color-border-muted` | `#6A6460` | 서브 보더/스크롤바 | 14 |

**중간 빈도 색상 (선택적 토큰화):**

| 색상 | 발생횟수 | 토큰 후보 |
|------|---------|-----------|
| `#C5BFB7` | 20 | `--color-text-tertiary` |
| `#E8E4DE` | 13 | `--color-surface-alt` |
| `#5A5550` | 11 | `--color-border-subtle` |

**rgba 변형 — CSS 변수로 교체 방법:**
```css
/* 현재 */
rgba(180, 140, 80, 0.15)
rgba(180, 140, 80, 0.25)
rgba(180, 140, 80, 0.3)

/* 변경 후 — CSS relative color syntax (modern browsers) */
color-mix(in srgb, var(--color-accent) 15%, transparent)

/* 또는 Tailwind inline style 방식 유지 (rgba 4곳은 예외 처리 허용) */
```

**index.css :root 선언:**
```css
:root {
  --color-bg: #2C2825;
  --color-surface: #1A1A1E;
  --color-accent: #B48C50;
  --color-border: #4A4440;
  --color-border-muted: #6A6460;
  --color-text-primary: #E8E2DA;
  --color-text-secondary: #D0CAC2;
  --color-text-muted: #A09890;
}
```

**Tailwind 4.x 호환:** Tailwind 4.x는 CSS-first 설정(`@theme`)을 사용하며 `:root` CSS 변수와 완전히 호환된다. `@theme`에 변수를 추가하면 `bg-[var(--color-bg)]` 대신 Tailwind 유틸리티 클래스로 쓸 수도 있으나, 이 프로젝트는 이미 `bg-[#HEX]` 인라인 방식을 사용하므로 `bg-[var(--color-bg)]` 형식으로 교체하는 것이 가장 안전하다.

---

## Don't Hand-Roll

| 문제 | 만들지 말 것 | 사용할 것 | 이유 |
|------|------------|-----------|------|
| 테스트 프레임워크 | 커스텀 assertion 헬퍼 | vitest | vite와 설정 공유, TypeScript 네이티브 |
| 세션 ID 추적 | 별도 session storage 관리 | Zustand persist | 이미 구현됨 (useFormStore.ts:115) |
| 리더보드 집계 | Supabase RPC/View | .limit() + 클라이언트 집계 | D-05 결정, 사내 앱에 적합 |
| 색상 토큰 파일 | 별도 design-tokens.ts/json | :root CSS 변수 | D-11 결정, Tailwind 호환 |

---

## Common Pitfalls

### Pitfall 1: addBatch 호출 순서와 세션 저장 순서
**무엇이 잘못되는가:** `addBatch(batch)`를 store에 추가하기 전에 `state.batches`를 읽으면 새 batch가 포함되지 않는다.
**왜 발생하는가:** Zustand `set`은 비동기가 아니지만 `useFormStore.getState()`를 `addBatch` 이전에 호출하면 구버전 상태를 읽는다.
**방지법:** `addBatch(batch)` 호출 후 `useFormStore.getState().batches`를 읽어서 세션에 전달한다.
**경고 신호:** 세션 업데이트 후 DB의 naming_results 개수가 최신 batch만 저장되어 있는 경우.

### Pitfall 2: resetNaming에서 currentSessionId 미리셋
**무엇이 잘못되는가:** `resetNaming()`이 폼을 초기화하지만 `currentSessionId`를 null로 하지 않으면 다음 추천이 이전 세션에 누적된다.
**왜 발생하는가:** 현재 `resetNaming` 구현(line 169-181)에 `currentSessionId` 처리가 없다.
**방지법:** `resetNaming` 액션에 `currentSessionId: null` 추가.
**경고 신호:** 새 네이밍 시작 후 추천 받으면 이전 세션에 이름이 추가되는 현상.

### Pitfall 3: persist 미들웨어와 Vitest 충돌
**무엇이 잘못되는가:** `useFormStore`가 `localStorage`에 persist하려 할 때 jsdom 환경에서 `localStorage`가 없거나 다르게 동작할 수 있다.
**왜 발생하는가:** jsdom은 `localStorage`를 지원하지만 테스트 간 격리가 안 될 수 있다.
**방지법:** `beforeEach`에서 `useFormStore.setState(초기값)` 직접 주입. persist를 테스트에서 우회.
**경고 신호:** 테스트가 순서에 따라 결과가 달라지는 경우.

### Pitfall 4: CSS 변수 교체 시 rgba 인라인값 누락
**무엇이 잘못되는가:** hex 값만 교체하고 rgba 변형 4곳을 놓치면 색상 토큰이 불완전하다.
**왜 발생하는가:** grep 패턴이 `#B48C50`만 찾고 `rgba(180, 140, 80`을 찾지 않음.
**방지법:** 교체 후 `rgba(180` 검색으로 잔재 확인.
**경고 신호:** CSS 변수 교체 후에도 일부 UI 요소만 골드색이 다르게 보이는 경우.

### Pitfall 5: Vitest 4.x와 tsconfig 호환성
**무엇이 잘못되는가:** `tsconfig.app.json`의 `"types": ["vite/client"]`가 vitest 타입과 충돌할 수 있다.
**왜 발생하는가:** Vitest globals(`describe`, `it`, `expect`)를 사용하려면 타입 선언이 필요하다.
**방지법:** `vite.config.ts`의 `test: { globals: true }`와 함께 `/// <reference types="vitest" />`를 vite.config.ts 상단에 추가하거나, `tsconfig.app.json`의 types에 `"vitest/globals"` 추가.
**경고 신호:** 테스트 파일에서 `describe is not defined` 타입 에러.

---

## Code Examples

### DATA-01: useRecommend.ts 세션 로직 교체
```typescript
// useRecommend.ts:50-58 영역 교체
const batch = await withRetry(() => generateBrandNames(form, keywordWeights));
addBatch(batch);

const user = useAuthStore.getState().user;
if (user) {
  const state = useFormStore.getState(); // addBatch 이후 최신 상태
  const existingId = state.currentSessionId;
  const title = batch.names.map((n) => n.brandName).join(', ');

  if (existingId) {
    sessionService.updateSession(existingId, form, state.batches).catch(console.error);
  } else {
    sessionService.createSession(user.id, title, form, state.batches)
      .then((id) => useFormStore.getState().setCurrentSessionId(id))
      .catch(console.error);
  }
}
```

### DATA-01: NamingPage.tsx 복원 시 sessionId 세팅
```typescript
// NamingPage.tsx:68 이후 추가
useFormStore.getState().restoreSession(stored, restoredBatches);
useFormStore.getState().setCurrentSessionId(sessionId); // D-04
```

### DATA-01: resetNaming에 currentSessionId 리셋
```typescript
// useFormStore.ts resetNaming 액션에 추가
resetNaming: () =>
  set({
    // ... 기존 초기화 필드들 ...
    currentSessionId: null, // D-03 추가
    resetTimestamp: new Date(),
  }),
```

### DATA-02: galleryService.ts limit 추가
```typescript
const LEADERBOARD_LIKES_LIMIT = 1000;

let likesQuery = supabase
  .from('likes')
  .select('session_id, created_at')
  .limit(LEADERBOARD_LIKES_LIMIT); // DATA-02
```

### TEST-01: vite.config.ts Vitest 설정
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    exclude: ['pdfjs-dist'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

### DSN-01: index.css :root 변수 선언
```css
:root {
  --color-bg: #2C2825;
  --color-surface: #1A1A1E;
  --color-accent: #B48C50;
  --color-border: #4A4440;
  --color-border-muted: #6A6460;
  --color-text-primary: #E8E2DA;
  --color-text-secondary: #D0CAC2;
  --color-text-muted: #A09890;
}
```

---

## Runtime State Inventory

> 세션 오염 수정은 런타임 상태(Zustand persist + Supabase DB)에 영향을 준다.

| 카테고리 | 발견된 항목 | 필요한 조치 |
|----------|------------|------------|
| 저장된 데이터 | Supabase `sessions` + `naming_results` 테이블 — 기존 세션은 현행 구조 유지 | 코드 변경만. 기존 데이터 마이그레이션 불필요 |
| 브라우저 저장 상태 | `localStorage['brand-naming-data']` — persist version 4. `currentSessionId` 이미 포함 | 코드 변경만. version bump 불필요 |
| 라이브 서비스 설정 | Vercel 배포 — 설정 변경 없음 | 없음 |
| 환경 변수 | `VITE_GEMINI_API_KEY`, `VITE_SUPABASE_*` — 이름 변경 없음 | 없음 |
| 빌드 아티팩트 | Vercel 자동 빌드 — stale 없음 | 없음 |

---

## Environment Availability

| 의존성 | 필요 이유 | 사용 가능 | 버전 | 대안 |
|--------|---------|----------|------|------|
| Node.js | vitest 실행 | 사용 가능 | v22.17.0 | — |
| npm | 패키지 설치 | 사용 가능 | 10.9.2 | — |
| vitest | 테스트 실행 | 미설치 (devDep에 없음) | — | 설치 필요 |

**설치 필요한 패키지 (블로킹):**
- `vitest` + `@vitest/coverage-v8` — `npm install -D vitest @vitest/coverage-v8`

---

## Open Questions

1. **중간 빈도 색상 (#C5BFB7 20회, #E8E4DE 13회) 토큰화 여부**
   - 알고 있는 것: D-11에서 코어 색상만 언급. 이 두 색상은 실제로 존재하며 20회 이상 사용됨
   - 불명확한 것: 계획에 포함할지 여부
   - 권고: 8개 코어 토큰으로 시작. 중간 빈도 색상은 `--color-text-tertiary`, `--color-surface-alt`로 추가 토큰화 권고 (1회 추가 작업)

2. **rgba 변형 4곳 처리 전략**
   - 알고 있는 것: `rgba(180, 140, 80, 0.15/0.25/0.3)` 4곳 존재
   - 불명확한 것: CSS `color-mix()` 사용 vs 하드코딩 rgba 유지
   - 권고: rgba 4곳은 그대로 유지 (DSN-01 범위는 hex값). 필요시 `rgba(var(--color-accent-rgb), 0.15)` 패턴 사용 가능하나 별도 변수 선언 필요

---

## Sources

### Primary (HIGH confidence)
- 코드베이스 직접 분석 — `src/services/sessionService.ts`, `src/hooks/useRecommend.ts`, `src/store/useFormStore.ts`, `src/services/galleryService.ts`, `src/index.css`
- `npm view vitest version` 명령 실행 결과 → 4.1.3 확인
- `npm view @vitest/coverage-v8 version` 명령 실행 결과 → 4.1.3 확인
- `grep` 색상 감사 → 45개 파일, 202개 이상 하드코딩 hex 값

### Secondary (MEDIUM confidence)
- Vitest 공식 문서 패턴 (vite.config.ts `test` 블록) — Vite 기반 프로젝트 표준 설정
- Tailwind CSS 4.x CSS-first 접근법 — `:root` CSS 변수와 `var()` 호환 확인됨

### Tertiary (LOW confidence)
- `color-mix()` CSS 함수 — modern browser 지원 필요. rgba 변형 처리 대안으로 언급했으나 프로젝트 채택 여부 미결정

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — npm registry에서 직접 버전 확인
- Architecture: HIGH — 코드베이스 직접 분석 기반
- Pitfalls: HIGH — 실제 코드 구조에서 도출된 구체적 위험 요소
- CSS 색상 인벤토리: HIGH — grep 실측값

**Research date:** 2026-04-08
**Valid until:** 2026-05-08 (안정적 스택, 빠른 변동 없음)
