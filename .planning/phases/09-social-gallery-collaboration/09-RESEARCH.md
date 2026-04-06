# Phase 9: Social Gallery & Collaboration - Research

**Researched:** 2026-04-06
**Domain:** Supabase RLS, 공개 갤러리 피드, 좋아요/북마크 스키마, 무한 스크롤
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** 카드 그리드 레이아웃 (Pinterest/Dribbble 스타일 2~3칸). 기존 추천카드 UI 패턴 재사용.
- **D-02:** 카드 요약형: 업종 + 대표 브랜드명 2~3개 + 좋아요 카운트 + 작성자. 클릭 시 상세.
- **D-03:** 카드 클릭 → 모달 팝업 상세 보기 (입력 데이터 + 브랜드명 전체 + rationale + 피드백).
- **D-04:** 발행은 대시보드에서. 세션 목록 → '발행' 버튼 → 갤러리 공개. 기존 `is_public` 필드 활용.
- **D-05:** 공개 중인 세션은 '철회' 버튼으로 비공개 전환.
- **D-06:** 발행 시 세션 전체 데이터 그대로 공개. 별도 편집/선택 단계 없음.
- **D-07:** Phase 9 범위: 좋아요(하트) + 북마크. 댓글은 Phase 10.
- **D-08:** 좋아요 UI: 단순 하트 토글. 카운트 표시. Instagram/Twitter 스타일.
- **D-09:** 북마크: 타인 공개 프로젝트를 내 보관함에 저장. 대시보드 북마크 탭에서 확인.
- **D-10:** 기본 최신순 정렬 + 탭으로 인기순(좋아요 많은 순) 전환.
- **D-11:** 무한 스크롤 로딩. Supabase pagination (`.range()`) 활용.

### Claude's Discretion

- 갤러리 카드의 구체적 시각 디자인 (색상, 간격, 그림자)
- 모달 팝업의 레이아웃 및 트랜지션
- 무한 스크롤의 배치 크기 및 로딩 스켈레톤
- Supabase 테이블 스키마 (likes, bookmarks 테이블 설계)
- 갤러리 빈 상태(Empty State) 디자인
- 모바일 반응형 그리드 (1~2칸)

### Deferred Ideas (OUT OF SCOPE)

- 댓글 기능 — Phase 10으로 보류
- 인기 랭킹/리더보드 — Phase 10
- 업종별 필터링 — Phase 10
</user_constraints>

---

## Summary

Phase 9는 기존 Supabase 인프라(Phase 7) 위에서 세 가지 기능을 추가한다: (1) 세션 발행/철회 토글, (2) 공개 갤러리 피드(/gallery 라우트 + 무한 스크롤), (3) 좋아요·북마크 피드백 시스템. 스키마 측면에서는 `likes`와 `bookmarks` 두 개의 테이블을 새로 생성하고 RLS를 설정하면 된다. 기존 `sessions.is_public` 필드는 이미 존재하고 RLS SELECT 정책도 `is_public = true`인 경우 전체 조회를 허용하도록 이미 작성되어 있어 발행 로직은 단순 `UPDATE is_public = true/false`로 완성된다.

갤러리 무한 스크롤은 Supabase `.range(from, to)` + `.order()` 조합으로 페이지네이션을 구현하고, `IntersectionObserver` API로 스크롤 끝 감지 후 다음 페이지를 로드하는 표준 패턴을 따른다. 외부 라이브러리(react-infinite-scroll-component 등) 없이 커스텀 훅으로 구현 가능하다.

좋아요/북마크는 Upsert + Delete 토글 패턴이 표준이다. RLS 정책은 "SELECT 전체 공개, INSERT/DELETE 본인만"으로 설정하여 카운트 집계가 익명 사용자에게도 보이도록 한다. 사내 앱(100인)이므로 성능 최적화보다 기능 완성도를 우선시한다.

**Primary recommendation:** 기존 `sessionService.ts` 패턴을 복제하여 `galleryService.ts`와 `socialService.ts`로 서비스 계층을 분리하고, 각 기능을 독립적인 Zustand 스토어로 관리한다.

---

## Standard Stack

### Core (기존 스택 — 추가 설치 불필요)

| 라이브러리 | 버전 | 용도 | 비고 |
|-----------|------|------|------|
| @supabase/supabase-js | 2.101.1 | DB 쿼리, RLS, pagination | 이미 설치됨 |
| React | 19.2.4 | 컴포넌트 렌더링 | 이미 설치됨 |
| zustand | 5.0.12 | 갤러리/소셜 상태 관리 | 이미 설치됨 |
| react-router-dom | 7.14.0 | /gallery 라우트 추가 | 이미 설치됨 |
| lucide-react | 1.7.0 | Heart, Bookmark 아이콘 | 이미 설치됨 |
| tailwindcss | 4.2.2 | 스타일링 | 이미 설치됨 |

### 추가 설치 없음

이 Phase는 신규 npm 패키지 설치가 필요하지 않다. 무한 스크롤은 `IntersectionObserver` Web API(브라우저 내장)로 구현하며 react-infinite-scroll-component 같은 외부 라이브러리는 불필요하다.

### Alternatives Considered

| 선택한 방법 | 대안 | 트레이드오프 |
|------------|------|-------------|
| IntersectionObserver 커스텀 훅 | react-infinite-scroll-component | 라이브러리 추가 없이 구현 가능, 100인 사내 앱 규모에서 커스텀 훅으로 충분 |
| Supabase .range() | React Query useInfiniteQuery | React Query는 추가 의존성 발생. Supabase 단독으로 페이지네이션 완결 가능 |
| 단순 likes 카운트 집계 쿼리 | Realtime 구독 | 실시간 업데이트는 이 규모에서 불필요. 좋아요 누를 때 로컬 상태 낙관적 업데이트로 충분 |

---

## Architecture Patterns

### 추천 프로젝트 구조 (신규 파일)

```
src/
├── pages/
│   └── GalleryPage.tsx          # /gallery 라우트 진입점
├── components/
│   └── gallery/
│       ├── GalleryGrid.tsx       # 2~3칸 그리드 컨테이너
│       ├── GalleryCard.tsx       # 공개 세션 카드 (D-02 요약형)
│       ├── GalleryModal.tsx      # 클릭 시 상세 모달 (D-03)
│       ├── GallerySortTabs.tsx   # 최신순/인기순 탭 (D-10)
│       ├── LikeButton.tsx        # 하트 토글 (D-08)
│       ├── BookmarkButton.tsx    # 북마크 토글 (D-09)
│       └── GallerySkeletonCard.tsx  # 로딩 스켈레톤
├── services/
│   ├── galleryService.ts        # 공개 세션 조회 + 무한 스크롤
│   └── socialService.ts         # 좋아요/북마크 CRUD
├── store/
│   ├── useGalleryStore.ts       # 갤러리 피드 상태
│   └── useSocialStore.ts        # 좋아요/북마크 로컬 상태
└── hooks/
    └── useInfiniteScroll.ts     # IntersectionObserver 커스텀 훅
```

### Pattern 1: Supabase Pagination (.range() + .order())

**What:** 페이지 번호 기반으로 `.range(from, to)` 쿼리를 사용하여 청크 단위로 데이터를 가져온다.

**When to use:** 무한 스크롤, 더보기 로딩 전반.

**Example:**
```typescript
// Source: https://supabase.com/docs/reference/javascript/range
const PAGE_SIZE = 12;

const fetchGalleryPage = async (page: number, sortBy: 'latest' | 'popular') => {
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const orderColumn = sortBy === 'popular' ? 'like_count' : 'created_at';

  const { data, error } = await supabase
    .from('sessions')
    .select(`
      id, title, industry_id, input_data, user_id, created_at,
      profiles:user_id (full_name),
      naming_results (brand_name, reasoning),
      like_count
    `)
    .eq('is_public', true)
    .order(orderColumn, { ascending: false })
    .range(from, to);

  if (error) throw error;
  return data;
};
```

**주의:** `.order()` 없이 `.range()`를 쓰면 중복/누락이 발생할 수 있다. 항상 함께 사용.

### Pattern 2: IntersectionObserver 무한 스크롤 훅

**What:** 마지막 카드가 뷰포트에 진입할 때 다음 페이지를 로드.

**When to use:** GalleryGrid의 마지막 아이템에 `ref` 부착.

**Example:**
```typescript
// Source: 표준 Web API 패턴 (MDN IntersectionObserver)
import { useCallback, useRef } from 'react';

export function useInfiniteScroll(
  onLoadMore: () => void,
  hasMore: boolean,
  isLoading: boolean
) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastItemRef = useCallback((node: HTMLElement | null) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });

    if (node) observerRef.current.observe(node);
  }, [isLoading, hasMore, onLoadMore]);

  return lastItemRef;
}
```

### Pattern 3: 좋아요 낙관적 업데이트 (Optimistic Update)

**What:** 버튼 클릭 즉시 UI를 업데이트하고, 백그라운드에서 DB 동기화. 실패 시 롤백.

**When to use:** LikeButton, BookmarkButton 모두 적용.

**Example:**
```typescript
// 낙관적 업데이트 패턴
const toggleLike = async (sessionId: string) => {
  const wasLiked = likedIds.has(sessionId);
  
  // 1. 즉시 UI 업데이트 (낙관적)
  setLikedIds(prev => {
    const next = new Set(prev);
    wasLiked ? next.delete(sessionId) : next.add(sessionId);
    return next;
  });

  try {
    if (wasLiked) {
      await supabase.from('likes').delete()
        .eq('session_id', sessionId).eq('user_id', userId);
    } else {
      await supabase.from('likes').insert({ session_id: sessionId, user_id: userId });
    }
  } catch {
    // 롤백
    setLikedIds(prev => {
      const next = new Set(prev);
      wasLiked ? next.add(sessionId) : next.delete(sessionId);
      return next;
    });
  }
};
```

### Pattern 4: 발행/철회 토글

**What:** `sessions` 테이블의 `is_public` 필드를 단순 boolean UPDATE.

**When to use:** ProjectCard 또는 대시보드 세션 목록에서 발행 버튼 클릭.

**Example:**
```typescript
// galleryService.ts에 추가
publishSession: async (id: string, isPublic: boolean) => {
  const { error } = await supabase
    .from('sessions')
    .update({ is_public: isPublic, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
},
```

### Anti-Patterns to Avoid

- **`.range()` 없이 `.order()` 없음:** 정렬 기준 없이 pagination을 쓰면 페이지 간 중복/누락 발생. 항상 `.order()` 후 `.range()`.
- **좋아요 카운트를 JOIN 없이 별도 쿼리:** N+1 문제 발생. `like_count` 계산 컬럼 또는 `select count(*)` 서브쿼리를 하나의 쿼리에 포함시킬 것.
- **갤러리 상태를 FormStore에 넣기:** 기존 `useFormStore`는 네이밍 세션용이다. 갤러리/소셜 상태는 별도 스토어(`useGalleryStore`, `useSocialStore`)로 분리.
- **모달을 별도 라우트로 만들기:** 사내 앱 규모에서 모달 방식이 더 단순하다. `/gallery/:id` 라우트 불필요.
- **RLS 없이 likes/bookmarks 테이블 배포:** RLS를 활성화하지 않으면 다른 사용자의 좋아요를 삭제할 수 있다.

---

## Don't Hand-Roll

| 문제 | 직접 구현하지 말 것 | 사용할 것 | 이유 |
|------|-------------------|-----------|------|
| 무한 스크롤 감지 | scroll 이벤트 + scrollTop 계산 | IntersectionObserver API (브라우저 내장) | scroll 이벤트는 성능 부담, IntersectionObserver가 표준 |
| 날짜 포맷팅 | 직접 Date 파싱 | 기존 `sessionService.formatDate()` (date-fns 기반) | 이미 구현됨 |
| 로그인 상태 확인 | 직접 supabase.auth.getUser() 호출 | `useAuthStore()` (Zustand) | Phase 7에서 이미 구현된 패턴 |
| 카드 스타일 | 새 컴포넌트 디자인 | `ProjectCard.tsx` 패턴 참조 (bg-[#1A1A1E], rounded-2xl 등) | 기존 다크 테마 일관성 |
| 세션 공개 조회 RLS | 커스텀 미들웨어 | 기존 sessions RLS `is_public = true` 정책 | Phase 7에서 이미 설정됨 |

---

## DB 스키마 설계 (Claude's Discretion)

### 신규 테이블: likes

```sql
-- 09-social-gallery: likes 테이블
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, session_id)  -- 중복 좋아요 방지
);

ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- SELECT: 전체 공개 (갤러리 카운트 표시용)
CREATE POLICY "Anyone can view likes" ON public.likes
  FOR SELECT USING (true);

-- INSERT: 본인만
CREATE POLICY "Users can like sessions" ON public.likes
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- DELETE: 본인만
CREATE POLICY "Users can unlike sessions" ON public.likes
  FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

-- 인덱스 (갤러리 카드 like_count 집계 쿼리 성능)
CREATE INDEX IF NOT EXISTS likes_session_id_idx ON public.likes(session_id);
CREATE INDEX IF NOT EXISTS likes_user_id_idx ON public.likes(user_id);
```

### 신규 테이블: bookmarks

```sql
-- 09-social-gallery: bookmarks 테이블
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, session_id)  -- 중복 북마크 방지
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- SELECT: 본인만 (북마크는 프라이빗)
CREATE POLICY "Users can view their own bookmarks" ON public.bookmarks
  FOR SELECT TO authenticated
  USING ((select auth.uid()) = user_id);

-- INSERT: 본인만
CREATE POLICY "Users can bookmark sessions" ON public.bookmarks
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- DELETE: 본인만
CREATE POLICY "Users can remove bookmarks" ON public.bookmarks
  FOR DELETE TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS bookmarks_session_id_idx ON public.bookmarks(session_id);
```

**설계 근거:**
- `likes`는 SELECT 전체 공개 — 갤러리 카드에서 집계 카운트가 보여야 하기 때문.
- `bookmarks`는 SELECT 본인만 — 북마크는 개인 보관함 개념, 타인에게 노출 불필요.
- `UNIQUE(user_id, session_id)` 제약으로 중복 방지. Upsert 대신 INSERT + DELETE 토글 패턴 사용 가능.

---

## 갤러리 쿼리 설계

### 공개 세션 목록 조회 (likes 카운트 포함)

```typescript
// Source: Supabase JS 공식 docs - https://supabase.com/docs/reference/javascript/select
const { data, error } = await supabase
  .from('sessions')
  .select(`
    id,
    title,
    industry_id,
    input_data,
    created_at,
    user_id,
    profiles:user_id (full_name),
    naming_results (brand_name, reasoning),
    likes (count)
  `)
  .eq('is_public', true)
  .order('created_at', { ascending: false })
  .range(from, to);
```

**주의:** Supabase의 관계형 집계 `likes (count)`는 실제 동작하지 않을 수 있다. 대안으로 likes 테이블을 별도 쿼리로 가져오거나, `like_count` 계산 컬럼(generated column)을 sessions 테이블에 추가하는 방법이 있다. 이 Phase에서는 단순성을 위해 **별도 쿼리** 접근을 권장한다.

```typescript
// 대안: 별도 카운트 쿼리
const { count } = await supabase
  .from('likes')
  .select('*', { count: 'exact', head: true })
  .eq('session_id', sessionId);
```

### 내 북마크 목록 조회 (대시보드용)

```typescript
const { data } = await supabase
  .from('bookmarks')
  .select(`
    session_id,
    sessions:session_id (
      id, title, industry_id, is_public,
      profiles:user_id (full_name)
    )
  `)
  .order('created_at', { ascending: false });
```

---

## Common Pitfalls

### Pitfall 1: .range() 없이 정렬 기준 누락

**What goes wrong:** 최신순/인기순 탭 전환 시 동일 세션이 여러 페이지에 중복 표시되거나 누락됨.
**Why it happens:** PostgreSQL은 ORDER BY 없이 행 순서를 보장하지 않음.
**How to avoid:** 모든 `.range()` 호출 전에 반드시 `.order('created_at', { ascending: false })` 또는 `.order('like_count', { ascending: false })` 추가.
**Warning signs:** 갤러리 피드에서 같은 카드가 두 번 나타남.

### Pitfall 2: 탭 전환 시 이전 데이터 초기화 누락

**What goes wrong:** 최신순 → 인기순으로 탭 전환 시 기존 데이터가 남아 섞여 보임.
**Why it happens:** 페이지 상태(page, items)를 탭 변경 시 리셋하지 않음.
**How to avoid:** `sortBy` 상태 변경 시 `page = 0`, `items = []` 동시 리셋.
**Warning signs:** 인기순 탭에서 최신 데이터가 뒤섞여 표시됨.

### Pitfall 3: RLS 미설정으로 갤러리가 빈 화면

**What goes wrong:** `/gallery` 접속 시 아무 데이터도 안 나옴.
**Why it happens:** Supabase RLS가 활성화되어 있으면 기본적으로 모든 행이 숨겨진다. `is_public = true` 정책이 없으면 공개 세션도 조회 불가.
**How to avoid:** Phase 7의 sessions SELECT 정책 `"Users can view their own sessions or public ones"` 확인. 이미 `is_public = true` 케이스가 포함되어 있으므로 sessions 테이블은 OK. likes/bookmarks 테이블은 신규 생성이므로 반드시 RLS 정책 추가 필요.
**Warning signs:** 갤러리 쿼리가 빈 배열 반환 (에러 없이).

### Pitfall 4: 좋아요 카운트 불일치 (낙관적 업데이트 후)

**What goes wrong:** 좋아요 클릭 후 카운트가 +1 됐는데, 실제 DB에서는 실패해서 다시 새로고침하면 원래 값으로 돌아옴.
**Why it happens:** 낙관적 업데이트는 로컬 상태만 변경하고 DB 결과를 기다리지 않음.
**How to avoid:** DB 실패 시 catch 블록에서 로컬 상태 롤백 로직 구현. 또는 실패 시 `loadLikeCount()` 재호출.
**Warning signs:** 좋아요 카운트가 새로고침 전후 다름.

### Pitfall 5: 모달에서 input_data JSONB 파싱 오류

**What goes wrong:** GalleryModal에서 세션의 `input_data` JSONB를 렌더링할 때 undefined 에러.
**Why it happens:** `input_data` 컬럼은 `any` 타입 JSONB이며, 구 세션은 새 필드(analysis, identity, expression)가 없을 수 있음.
**How to avoid:** 옵셔널 체이닝 (`input_data?.analysis?.competitors ?? ''`) 사용. 모달 렌더링 전 항상 nullish 처리.
**Warning signs:** "Cannot read properties of undefined" 에러.

### Pitfall 6: 500줄 초과 (CLAUDE.md 황금룰)

**What goes wrong:** GalleryModal은 입력 데이터 전체 + 브랜드명 전체 + rationale + 피드백 버튼을 포함하므로 단일 파일이 커질 수 있다.
**Why it happens:** 모달 컴포넌트에 모든 섹션을 직접 작성.
**How to avoid:** GalleryModal을 최상위 컨테이너로만 유지하고, 내부 섹션을 GalleryModalHeader, GalleryModalBrandList, GalleryModalActions 등으로 분리.
**Warning signs:** GalleryModal.tsx가 300줄 이상 되면 분리 검토.

---

## 기존 인프라 재사용 포인트

### 이미 완성된 것 (변경 불필요)

| 항목 | 위치 | 재사용 방법 |
|------|------|------------|
| sessions.is_public 컬럼 | supabase/migrations/07_init_schema.sql | 발행/철회 UPDATE만 추가 |
| sessions RLS (공개 조회) | `"Users can view their own sessions or public ones"` | 그대로 사용 |
| Supabase 클라이언트 | src/services/supabase.ts | import만 |
| 인증 상태 (user.id) | src/store/useAuthStore.ts | 좋아요/북마크 시 user_id 참조 |
| 카드 스타일 패턴 | src/components/dashboard/ProjectCard.tsx | GalleryCard 디자인 참조 |
| 빈 상태 컴포넌트 | src/components/recommend/EmptyState.tsx | 갤러리 빈 상태 재사용 |
| 라우터 | src/App.tsx | /gallery 라우트 추가 |
| 다크 테마 토큰 | bg-[#1A1A1E], bg-[#363230], border-[#4A4440] | GalleryCard, GalleryModal에 동일 적용 |

### 수정 필요한 기존 파일

| 파일 | 수정 내용 |
|------|----------|
| src/App.tsx | `/gallery` 라우트 추가 (ProtectedRoute로 보호) |
| src/pages/Dashboard.tsx | 발행/철회 버튼 UI, 북마크 탭 추가 |
| src/components/dashboard/ProjectCard.tsx | 발행 상태 배지, 발행/철회 버튼 추가 |
| src/services/sessionService.ts | `publishSession(id, isPublic)` 메서드 추가 |

---

## Code Examples

### 갤러리 서비스 패턴

```typescript
// src/services/galleryService.ts
// Source: Supabase JS 공식 문서 패턴
import { supabase } from './supabase';

const PAGE_SIZE = 12;

export type GallerySortBy = 'latest' | 'popular';

export interface GallerySession {
  id: string;
  title: string;
  industry_id: string | null;
  created_at: string;
  user_id: string;
  profiles: { full_name: string | null } | null;
  naming_results: { brand_name: string; reasoning: string }[];
}

export const galleryService = {
  fetchPage: async (page: number, sortBy: GallerySortBy): Promise<GallerySession[]> => {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const orderColumn = sortBy === 'popular' ? 'updated_at' : 'created_at';
    // 인기순은 Phase 9에서는 단순 최근 좋아요 기준으로 대체 가능

    const { data, error } = await supabase
      .from('sessions')
      .select(`
        id, title, industry_id, created_at, user_id,
        profiles:user_id (full_name),
        naming_results (brand_name, reasoning)
      `)
      .eq('is_public', true)
      .order(orderColumn, { ascending: false })
      .range(from, to);

    if (error) throw error;
    return (data ?? []) as unknown as GallerySession[];
  },

  fetchLikeCount: async (sessionId: string): Promise<number> => {
    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', sessionId);
    if (error) throw error;
    return count ?? 0;
  },
};
```

### 소셜 서비스 패턴

```typescript
// src/services/socialService.ts
import { supabase } from './supabase';

export const socialService = {
  getLikeStatus: async (sessionId: string, userId: string): Promise<boolean> => {
    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('session_id', sessionId)
      .eq('user_id', userId)
      .maybeSingle();
    return !!data;
  },

  toggleLike: async (sessionId: string, userId: string, isLiked: boolean): Promise<void> => {
    if (isLiked) {
      await supabase.from('likes').delete()
        .eq('session_id', sessionId).eq('user_id', userId);
    } else {
      await supabase.from('likes').insert({ session_id: sessionId, user_id: userId });
    }
  },

  toggleBookmark: async (sessionId: string, userId: string, isBookmarked: boolean): Promise<void> => {
    if (isBookmarked) {
      await supabase.from('bookmarks').delete()
        .eq('session_id', sessionId).eq('user_id', userId);
    } else {
      await supabase.from('bookmarks').insert({ session_id: sessionId, user_id: userId });
    }
  },

  getMyBookmarks: async (userId: string) => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select(`
        session_id,
        sessions:session_id (id, title, industry_id, is_public, created_at)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
};
```

### 모달 오픈/클로즈 패턴 (다크 오버레이)

```typescript
// GalleryModal 패턴 — 기존 다크 테마 일관성 유지
// 배경 오버레이: fixed inset-0 bg-black/60 z-50
// 모달 컨테이너: bg-[#1A1A1E] border border-[#4A4440] rounded-2xl
// 닫기: ESC 키 + 오버레이 클릭

useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [onClose]);
```

---

## State of the Art

| 기존 방식 | 현재 방식 | 변경 시점 | 영향 |
|----------|----------|----------|------|
| scroll 이벤트로 무한 스크롤 감지 | IntersectionObserver API | ~2019, 현재 표준 | 성능 우수, 별도 라이브러리 불필요 |
| 별도 카운트 API 엔드포인트 | Supabase `.select('*', { count: 'exact' })` | Supabase v2 | 서버리스 환경에서 카운트 쿼리 간소화 |
| 전역 좋아요 상태 서버 동기화 | 낙관적 업데이트 + 로컬 Set | 현재 SPA 표준 패턴 | 즉각적인 UI 반응성, 실패 시 롤백 |

---

## Open Questions

1. **인기순 정렬 컬럼**
   - What we know: `likes` 테이블은 세션과 별도 테이블. sessions에 `like_count` 컬럼 없음.
   - What's unclear: 인기순 정렬을 위해 sessions에 `like_count` 계산 컬럼을 추가할지, 아니면 galleryService에서 likes 카운트를 별도 조회 후 클라이언트에서 정렬할지.
   - Recommendation: 100인 사내 앱 규모에서는 **클라이언트 측 정렬**이 충분. 갤러리 페이지 첫 로드 시 like 카운트를 배치 조회하여 로컬 정렬. DB 컬럼 추가는 Phase 10 최적화로 보류.

2. **북마크 탭 — 대시보드 UI 분리 여부**
   - What we know: D-09에서 "대시보드에서 북마크 목록 확인"으로 결정됨.
   - What's unclear: 기존 "내 프로젝트" 탭 옆에 "북마크" 탭을 추가할지, 별도 섹션으로 아래에 배치할지.
   - Recommendation: 탭 방식 (내 프로젝트 | 북마크). Dashboard.tsx가 현재 탭 없는 단순 목록이므로 탭 추가가 필요하며 이는 구현 범위에 포함된다.

3. **발행 시 naming_results 스냅샷**
   - What we know: `sessions.input_data`(JSONB)는 폼 입력 데이터. `naming_results` 테이블은 별도 테이블에 저장됨.
   - What's unclear: 갤러리 카드에 표시할 "대표 브랜드명 2~3개"가 `naming_results` 테이블에 실제로 저장되어 있는지 (현재 앱이 naming_results를 DB에 저장하는지) 확인 필요.
   - Recommendation: 플래닝 단계에서 `naming_results` INSERT 로직이 구현되어 있는지 소스 검증 필요. 없다면 갤러리 카드는 `input_data.batches` (로컬 폼 상태)에서 대표 이름을 추출하는 대안 검토.

---

## Environment Availability

Step 2.6: 이 Phase는 신규 npm 패키지 없이 기존 Supabase 인프라를 확장하는 작업이다. 외부 도구 의존성 없음.

| 의존성 | 필요 이유 | 가용 여부 | 비고 |
|--------|----------|----------|------|
| Supabase 프로젝트 (라이브) | DB 스키마 변경, RLS 정책 | 확인 필요 | supabase.ts에 URL/키 하드코딩됨 — 프로젝트 접근 가능하면 OK |
| @supabase/supabase-js 2.101.1 | 모든 DB 쿼리 | ✓ 설치됨 | — |
| IntersectionObserver API | 무한 스크롤 | ✓ 브라우저 내장 | Chrome/Firefox/Safari 모두 지원 |
| lucide-react Heart, Bookmark | 좋아요/북마크 아이콘 | ✓ 설치됨 | 버전 1.7.0 |

**Missing dependencies with no fallback:** 없음.

**주의:** Supabase 마이그레이션(SQL 실행)은 Supabase Dashboard 또는 supabase CLI를 통해 실행 필요. `supabase` CLI가 로컬에 설치되어 있는지 확인하거나, Dashboard에서 직접 SQL 실행.

---

## Project Constraints (from CLAUDE.md)

| 제약 | 내용 |
|------|------|
| Tech Stack | React 19, Vite 6, TypeScript 5, Tailwind CSS 4, Zustand, Supabase. Next.js/Redux/Material UI 사용 금지. |
| AI | Gemini API (@google/genai). OpenAI 사용 금지. |
| 파일 제한 | 모든 소스 파일 500줄 이하. |
| 언어 | 한국어 UI, 한국어 문서. |
| 디자인 | 심플 + 고급스러움. CSS 전문가 수준 퀄리티. |
| GSD 워크플로우 | Edit/Write 도구 사용 전 GSD 커맨드로 진입 필요. |

---

## Sources

### Primary (HIGH confidence)
- Supabase JS 2.x 설치본 (node_modules/@supabase/supabase-js@2.101.1) — 버전 확인
- `supabase/migrations/07_init_schema.sql` — 기존 스키마 + RLS 정책 확인
- `src/services/sessionService.ts` — 기존 서비스 패턴
- `src/store/useAuthStore.ts` — 기존 인증 상태 패턴
- https://supabase.com/docs/reference/javascript/range — .range() API
- https://supabase.com/docs/guides/database/postgres/row-level-security — RLS 정책 패턴

### Secondary (MEDIUM confidence)
- IntersectionObserver API — MDN 표준 Web API, 브라우저 호환성 HIGH
- 낙관적 업데이트 패턴 — React 커뮤니티 표준 패턴 (검증됨)

### Tertiary (LOW confidence)
- Supabase 관계형 집계 `likes (count)` 동작 여부 — 실제 환경 테스트 필요. 별도 카운트 쿼리 사용을 권장.
- 인기순 정렬을 위한 like_count 서브쿼리 성능 — 100인 규모에서는 문제 없을 것으로 예상되나 미검증.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — 기존 Phase 7 인프라 분석 완료, 신규 패키지 없음
- Architecture: HIGH — Supabase RLS 패턴 공식 문서 확인, 기존 코드베이스 패턴 분석 완료
- DB 스키마: HIGH — 공식 RLS 정책 예시 기반 설계
- Pitfalls: MEDIUM — Supabase RLS 공식 문서 + 코드 분석 기반. Supabase 관계형 집계 쿼리는 LOW (미검증)

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (Supabase JS 안정 버전, 30일)
