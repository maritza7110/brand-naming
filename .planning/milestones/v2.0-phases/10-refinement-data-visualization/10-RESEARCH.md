# Phase 10: Refinement & Data Visualization - Research

**Researched:** 2026-04-06
**Domain:** 갤러리 필터링, 댓글 시스템, 데이터 시각화(차트), 인기 랭킹, Supabase 쿼리 확장
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### 갤러리 필터링
- **D-01:** 상단 필터바 방식 채택. 기존 GallerySortTabs 아래에 업종/스타일/태그 칩 필터 줄 + 키워드 검색 필드를 배치.
- **D-02:** 업종 필터는 대분류 단위(음식/소매/서비스 등) 칩으로 제공. 238개 소분류 전체 노출 아님.
- **D-03:** 네이밍 스타일 필터 — Phase 8에서 구현한 네이밍 기법(합성어/추상어/은유/두문자 등)으로 필터링.
- **D-04:** 키워드 검색 — 브랜드명/입력 데이터 텍스트 검색. 기존 TextField 컴포넌트 재사용.
- **D-05:** 자동 태그만 구현. AI가 네이밍 결과에서 스타일/업종/특징을 자동 추출하여 태그 부여. 사용자 수동 태그 없음.

#### 댓글 시스템
- **D-06:** GalleryModal 내 인라인 배치. 모달 하단에 댓글 목록 + 입력 폼 섹션 추가.
- **D-07:** 1단계 플랫 댓글만 지원. 대댓글/스레드 없음.
- **D-08:** 댓글 작성자 프로필명 + 작성일 표시. 삭제는 본인 댓글만 가능.

#### 데이터 시각화
- **D-09:** 대시보드 하단 섹션에 통계 차트 배치. 기존 프로젝트/북마크 탭 아래에 통계 영역 추가.
- **D-10:** 시각화 항목 3가지:
  1. 내 인기 키워드 — 내 프로젝트에서 자주 사용한 키워드/업종 빈도 차트
  2. 업종별 프로젝트 분포 — 내 프로젝트의 업종 분포 파이/도넛 차트
  3. 네이밍 스타일 통계 — AI가 생성한 브랜드명의 네이밍 기법 분포
- **D-11:** 차트 라이브러리 및 구체적 차트 유형은 Claude 재량.

#### 인기 랭킹/리더보드
- **D-12:** 갤러리 상단 통합. 갤러리 페이지 상단에 '이번 주 인기 TOP' 섹션 추가.
- **D-13:** 랭킹 기준은 좋아요 수 단순 정렬. 복합 점수 없음.
- **D-14:** 기간 탭: 주간 + 전체 두 가지.

### Claude's Discretion
- 필터바의 구체적 UI 디자인 (칩 색상, 간격, 반응형 배치)
- 자동 태그 추출 로직 (Gemini 기반 or 규칙 기반)
- 댓글 DB 스키마 설계 (comments 테이블)
- 차트 라이브러리 선택 (recharts, chart.js 등)
- 차트 색상/스타일링
- 리더보드 카드 디자인 및 표시 개수
- 모바일 반응형 처리 (필터바 축소, 차트 리사이즈)
- v2.0 최종 QA 범위 및 배포 체크리스트

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

---

## Summary

Phase 10은 기존 갤러리/대시보드 위에 4가지 기능 레이어를 추가한다: (1) 갤러리 필터바, (2) GalleryModal 댓글 섹션, (3) 대시보드 통계 시각화, (4) 갤러리 상단 리더보드. 모든 기능은 기존 Supabase/Zustand/Tailwind 스택 위에서 증분 구현된다 — 새 라이브러리는 차트 하나뿐이다.

핵심 구현 판단: **Recharts 3.8.1** 선택 (React 19 공식 peer dependency 지원, 서버 없이 클라이언트 렌더링, Tailwind 커스텀 색상과 자연스러운 조합). 자동 태그 추출은 **규칙 기반(Rule-based)** — Gemini API 호출을 추가하면 비용/지연이 발생하므로 `naming_results.style_tag` + `sessions.industry_id` 기존 컬럼을 직접 읽는 방식이 최적이다. 댓글 시스템은 `comments` 테이블 신규 생성 + socialService 확장 패턴으로 기존 likes/bookmarks와 완전히 동일한 패턴을 따른다.

**Primary recommendation:** 기존 패턴(Supabase + Zustand + Tailwind)을 그대로 연장하여 최소한의 새 의존성으로 구현한다. 차트만 Recharts를 추가한다.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| recharts | 3.8.1 | 차트 시각화 | React 19 peer dep 공식 지원, 선언형 컴포넌트 API, 번들 경량 |
| @supabase/supabase-js | ^2.101.1 (기존) | comments 테이블 CRUD, 필터 쿼리 확장, 랭킹 정렬 | 이미 프로젝트에 설치됨 |
| zustand | ^5.0.12 (기존) | 필터 상태, 리더보드 상태, 댓글 상태 | 이미 프로젝트에 설치됨 |
| tailwindcss | ^4.2.2 (기존) | 필터바/댓글/리더보드 UI 스타일링 | 이미 프로젝트에 설치됨 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | ^1.7.0 (기존) | Search, Filter, MessageCircle 아이콘 | 필터바 검색 아이콘, 댓글 아이콘 |
| date-fns | ^4.1.0 (기존) | 댓글 작성 시간 포맷 | 댓글 created_at 표시 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Recharts | Chart.js + react-chartjs-2 | Chart.js는 Canvas 기반이라 Tailwind 클래스 직접 적용 불가, 래퍼 라이브러리 추가 필요 |
| Recharts | Nivo | Nivo는 D3 의존성이 크고 번들 사이즈가 큼, 100인 앱에 과도함 |
| 규칙 기반 태그 | Gemini API 태그 추출 | Gemini 호출은 네이밍 결과 저장 시점에 이미 완료됨. `style_tag` 컬럼이 존재하면 재호출 불필요 |

**Installation (신규 패키지만):**
```bash
npm install recharts
```

**Version verification (2026-04-06 기준):**
- recharts: 3.8.1 (npm view 확인 완료, React 19 peer dep 지원 확인 완료)
- 기타 모든 패키지: 이미 package.json에 설치됨

---

## Architecture Patterns

### Recommended Project Structure (Phase 10 신규/수정 파일)
```
src/
├── components/
│   ├── gallery/
│   │   ├── GalleryFilterBar.tsx     # 신규: 업종/스타일 칩 + 키워드 검색
│   │   ├── GalleryLeaderboard.tsx   # 신규: 주간/전체 TOP 랭킹 섹션
│   │   ├── GalleryModal.tsx         # 수정: 댓글 섹션 추가
│   │   └── CommentSection.tsx       # 신규: 댓글 목록 + 입력 폼
│   └── dashboard/
│       └── StatsSection.tsx         # 신규: 3개 차트 통계 영역
├── services/
│   ├── galleryService.ts            # 수정: 필터 쿼리, 랭킹 쿼리 추가
│   └── socialService.ts             # 수정: 댓글 CRUD 추가
├── store/
│   ├── useGalleryStore.ts           # 수정: 필터 상태, 리더보드 상태 추가
│   └── useSocialStore.ts            # 수정: 댓글 상태 추가
├── pages/
│   ├── GalleryPage.tsx              # 수정: 필터바 + 리더보드 섹션 마운트
│   └── Dashboard.tsx                # 수정: 통계 섹션 추가 (프로젝트 3개 이상 조건부)
└── types/
    └── gallery.ts                   # 수정: 필터 타입, 댓글 타입, 랭킹 타입 추가
```

### Pattern 1: 갤러리 필터 상태 + Supabase 쿼리 연동

필터 상태는 `useGalleryStore`에 추가한다. `setSortBy` 패턴과 동일하게 필터 변경 시 `reset()` 후 `fetchNextPage()` 재실행.

```typescript
// useGalleryStore.ts 확장 예시 (기존 패턴 연장)
interface GalleryFilters {
  industry: string | null;   // 대분류 (음식, 소매, 생활서비스...)
  namingStyle: string | null; // 네이밍 스타일 (합성어, 추상어...)
  keyword: string;           // 키워드 검색
}

// galleryService.ts 필터 쿼리 확장
const query = supabase
  .from('sessions')
  .select('...')
  .eq('is_public', true);

if (filters.industry) {
  query = query.eq('industry_id', filters.industry); // ilike로 대분류 prefix 매칭도 가능
}
if (filters.keyword) {
  query = query.ilike('title', `%${filters.keyword}%`);
}
```

**중요 판단:** `industry_id` 컬럼은 소분류 전체 텍스트(예: "음식/한식/분식")가 저장된다(Phase 07 스키마 기준). 대분류 필터링은 `ilike('industry_id', '음식%')` 또는 `industry_id.startsWith(major)` 클라이언트 필터링 두 가지가 가능하다. 갤러리는 서버 측 페이지네이션을 사용하므로 **서버 ilike 필터**가 정확하다.

**네이밍 스타일 필터:** `naming_results.style_tag` 컬럼이 존재하는 경우 JOIN 조건으로 필터링. 존재하지 않으면 클라이언트 측 `sessions.input_data.expression.namingStyle` 배열로 필터링.

### Pattern 2: 댓글 시스템 (기존 likes/bookmarks와 동일 패턴)

```sql
-- Supabase SQL: comments 테이블 신규 생성
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 공개 세션 댓글은 모두 읽기 가능
CREATE POLICY "anyone can read comments on public sessions"
ON comments FOR SELECT
USING (
  EXISTS (SELECT 1 FROM sessions WHERE id = session_id AND is_public = true)
);

-- 인증 사용자만 댓글 작성
CREATE POLICY "authenticated users can insert comments"
ON comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 본인 댓글만 삭제
CREATE POLICY "users can delete own comments"
ON comments FOR DELETE
USING (auth.uid() = user_id);
```

```typescript
// socialService.ts 댓글 CRUD 추가 패턴
getComments: async (sessionId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select('id, content, created_at, user_id, profiles:user_id(full_name)')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
},

addComment: async (sessionId: string, userId: string, content: string) => {
  const { error } = await supabase
    .from('comments')
    .insert({ session_id: sessionId, user_id: userId, content });
  if (error) throw error;
},

deleteComment: async (commentId: string) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);
  if (error) throw error;
},
```

### Pattern 3: Recharts 차트 패턴 (프로젝트 테마 적용)

다크 테마 색상: `#B48C50` (골드 포인트), `#1A1A1E` (배경), `#4A4440` (보조).

```typescript
// 도넛 차트 — 업종 분포 (recharts PieChart)
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const CHART_COLORS = ['#B48C50', '#8B6E3A', '#C5A06B', '#6B5030', '#D4B485'];

<ResponsiveContainer width="100%" height={220}>
  <PieChart>
    <Pie
      data={industryData}
      cx="50%"
      cy="50%"
      innerRadius={55}
      outerRadius={90}
      dataKey="value"
    >
      {industryData.map((_, index) => (
        <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
      ))}
    </Pie>
    <Tooltip
      contentStyle={{ backgroundColor: '#1A1A1E', border: '1px solid #4A4440', borderRadius: '8px' }}
      labelStyle={{ color: '#E8E2DA' }}
    />
  </PieChart>
</ResponsiveContainer>
```

```typescript
// 바 차트 — 키워드 빈도 (recharts BarChart)
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={180}>
  <BarChart data={keywordData} layout="vertical">
    <XAxis type="number" hide />
    <YAxis type="category" dataKey="name" tick={{ fill: '#A09890', fontSize: 12 }} width={80} />
    <Tooltip
      contentStyle={{ backgroundColor: '#1A1A1E', border: '1px solid #4A4440', borderRadius: '8px' }}
    />
    <Bar dataKey="count" fill="#B48C50" radius={[0, 4, 4, 0]} />
  </BarChart>
</ResponsiveContainer>
```

### Pattern 4: 리더보드 쿼리 (좋아요 수 JOIN)

현재 `galleryService.fetchLikeCounts`는 세션 ID 배열에 대해 N개 병렬 쿼리를 날린다. 리더보드는 별도 쿼리로 최적화한다:

```typescript
// TOP 랭킹: likes 카운트 기준 정렬 — Supabase RPC 또는 GROUP BY
// 옵션 A: 클라이언트 집계 (소규모 앱 허용)
// 옵션 B: Supabase DB Function (rpc)
fetchLeaderboard: async (period: 'week' | 'all', limit = 5) => {
  // 주간 필터: 지난 7일 created_at
  const fromDate = period === 'week'
    ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    : undefined;

  // likes 테이블에서 session_id별 count 집계
  let query = supabase
    .from('likes')
    .select('session_id')
    .order('session_id');

  if (fromDate) query = query.gte('created_at', fromDate);

  // 클라이언트에서 집계 후 TOP N sessions JOIN
  // ...
}
```

**현실적 접근:** 100인 사내 앱은 데이터 규모가 작다. 기존 `fetchPage` + `fetchLikeCounts` 패턴을 리더보드용으로 재사용(최신 페이지 로드 후 likeCounts 기준으로 클라이언트 정렬)해도 충분하다. Supabase RPC 오버엔지니어링 불필요.

### Pattern 5: 대시보드 통계 데이터 집계

통계는 이미 로드된 `sessions` 배열에서 클라이언트 집계한다. 별도 API 호출 불필요.

```typescript
// Dashboard.tsx에서 sessions 배열 → 통계 계산
function computeStats(sessions: SessionData[]) {
  // 1. 업종 분포
  const industryCount: Record<string, number> = {};
  sessions.forEach(s => {
    if (s.industry_id) {
      const major = s.industry_id.split('/')[0]; // "음식/한식/분식" → "음식"
      industryCount[major] = (industryCount[major] ?? 0) + 1;
    }
  });

  // 2. 키워드 빈도: input_data.storeBasic.productKeywords 등 집계
  // 3. 네이밍 스타일: naming_results의 style_tag 또는 input_data.expression.namingStyle 집계
  return { industryCount, keywordFreq, styleCount };
}
```

### Anti-Patterns to Avoid

- **모달 내 댓글 높이 고정 없음:** GalleryModal은 현재 `max-h-[80vh] overflow-y-auto`. 댓글 섹션 추가 시 모달 전체 스크롤로 처리 — 별도 내부 스크롤 영역 만들지 말 것 (UX 복잡도 증가).
- **필터 상태를 컴포넌트 로컬 state로 관리:** 필터는 페이지 리셋과 연동되므로 반드시 `useGalleryStore`에 넣어야 한다. GalleryFilterBar 내 `useState`로 분리하면 정렬 탭과 충돌.
- **리더보드용 별도 무한스크롤:** 리더보드는 고정 개수(3~5개) 섹션이다. `useInfiniteScroll` 훅 불필요.
- **500줄 초과 파일 생성:** CLAUDE.md 황금룰. GalleryModal은 현재 122줄이지만 댓글 섹션 추가 시 200줄 이상 될 수 있으므로 `CommentSection.tsx`를 별도 컴포넌트로 분리해야 한다.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| 차트 렌더링 | SVG/Canvas 직접 그리기 | recharts | 반응형, 툴팁, 애니메이션 등 edge case가 매우 많음 |
| 텍스트 검색 | JS `filter` 클라이언트 검색 | Supabase `.ilike()` 서버 쿼리 | 페이지네이션과 결합 시 클라이언트 필터는 현재 페이지만 검색함 |
| 댓글 RLS | 애플리케이션 레이어 권한 검사 | Supabase RLS policy | 클라이언트 앱은 신뢰할 수 없는 환경 |
| 리더보드 랭킹 | 복합 점수 알고리즘 | 좋아요 수 단순 정렬 (D-13 결정) | 결정됨 — 구현하지 말 것 |

**Key insight:** Supabase의 `.ilike()` + `.order()` + `.range()` 조합만으로 필터링+정렬+페이지네이션을 서버에서 처리할 수 있다. 클라이언트 집계는 대시보드 통계처럼 이미 로드된 데이터를 가공할 때만 사용한다.

---

## Common Pitfalls

### Pitfall 1: 필터 변경 시 페이지네이션 리셋 누락
**What goes wrong:** 필터를 변경하고 `fetchNextPage()`를 호출했지만 `page`가 0으로 초기화되지 않으면, 2페이지부터 로드되거나 이전 필터 데이터와 섞인다.
**Why it happens:** `setSortBy`는 이미 리셋 패턴을 구현(`sessions: [], page: 0`)하지만 필터 상태 추가 시 동일 패턴을 누락하기 쉬움.
**How to avoid:** `setFilters` 액션에서 반드시 `{ sessions: [], page: 0, hasMore: true }` 리셋 + `fetchNextPage()` 호출을 하나의 트랜잭션으로 묶는다.
**Warning signs:** 갤러리에서 필터 변경 후 이전 결과가 잠깐 보임, 또는 이전 데이터 위에 새 결과가 append됨.

### Pitfall 2: GalleryModal 스크롤 충돌
**What goes wrong:** `document.body.style.overflow = 'hidden'` (모달 열릴 때)가 설정된 상태에서 댓글 섹션 내부 스크롤을 별도로 만들면, iOS Safari에서 터치 스크롤이 막힌다.
**Why it happens:** GalleryModal은 이미 `overflow-y-auto`로 모달 전체 스크롤을 처리 중. 내부에 또 다른 scroll context를 만들면 iOS에서 문제 발생.
**How to avoid:** 댓글 섹션을 모달 전체 스크롤 흐름에 포함시킨다. 댓글 내부 별도 스크롤 컨테이너 없이 모달이 길어지게 두는 것이 맞다.

### Pitfall 3: Recharts + Tailwind 4 클래스 충돌
**What goes wrong:** Recharts SVG 요소에 Tailwind 클래스를 직접 적용하려 하면 일부 클래스가 SVG 속성과 충돌한다 (예: `fill-*` 색상).
**Why it happens:** Recharts는 SVG를 렌더링하며 SVG는 CSS `fill` 속성 동작이 HTML과 다름.
**How to avoid:** Recharts `Cell`, `Bar` 등의 `fill` prop에 직접 hex 색상을 넣는다. Tailwind 클래스 대신 `style` prop 또는 `fill="..."` 직접 지정.

### Pitfall 4: 댓글 로딩 — GalleryModal mount 시 자동 실행
**What goes wrong:** GalleryModal이 열릴 때마다 댓글을 자동 fetch하면, 갤러리를 빠르게 여닫을 때 불필요한 쿼리가 대량 발생한다.
**Why it happens:** `useEffect(() => { fetchComments(session.id) }, [session.id])` 패턴은 모달이 열릴 때마다 실행됨.
**How to avoid:** 댓글 섹션을 lazy하게 구현 — 사용자가 댓글 영역으로 스크롤하거나 댓글 토글 버튼을 눌렀을 때 fetch. 또는 단순하게 mount시 fetch를 허용하되 댓글 수 표시로 사용자 기대치를 설정.

### Pitfall 5: `industry_id` 형식 — 대분류 필터링 오류
**What goes wrong:** `sessions.industry_id`에 "음식/한식/분식" 같은 전체 경로가 저장되어 있다. `eq('industry_id', '음식')`으로 필터하면 결과가 0건이다.
**Why it happens:** Phase 07 스키마 설계에서 `industry_id`는 소분류 전체 경로를 저장하도록 설계됨 (`src/services/sessionService.ts` 참조).
**How to avoid:** `.ilike('industry_id', '음식%')` 또는 `.ilike('industry_id', '%음식%')`를 사용한다. prefix 매칭(`음식%`)이 더 정확하다.

### Pitfall 6: 500줄 파일 제한 위반
**What goes wrong:** GalleryModal에 댓글 섹션(50~80줄)을 인라인으로 추가하면 파일이 200줄을 초과할 수 있다. Dashboard.tsx(187줄)에 StatsSection 인라인 추가 시 300줄+.
**How to avoid:** 댓글은 `CommentSection.tsx`로, 통계는 `StatsSection.tsx`로 별도 컴포넌트 분리. 각 파일 개별 500줄 이하 유지.

---

## Code Examples

### 필터바 칩 (ChipSelector 재사용 패턴)
```typescript
// GalleryFilterBar.tsx
import { ChipSelector } from '../ui/ChipSelector';
import { TextField } from '../ui/TextField';

// 업종 대분류 — industryData에서 자동 추출
import { INDUSTRY_DATA } from '../../data/industryData';
const MAJOR_CATEGORIES = [...new Set(INDUSTRY_DATA.map(d => d.major))];
// 결과: ['음식', '소매', '생활서비스', '의료', '학문/교육', '관광/여가/오락', '숙박', '부동산', '수리/개인서비스', '기타']

// 네이밍 스타일 (Phase 8 ExpressionTab에서 동일 목록 사용)
const NAMING_STYLE_OPTIONS = ['합성어', '추상어', '은유/상징', '두문자', '의성어/의태어', '외래어 차용', '한글 순수', '숫자 조합'];
```

### Supabase 대분류 필터 쿼리
```typescript
// galleryService.ts 필터 파라미터 추가
interface GalleryFetchOptions {
  page: number;
  sortBy: GallerySortBy;
  filters: {
    industry: string | null;
    namingStyle: string | null;
    keyword: string;
  };
}

// ilike 대분류 prefix 매칭
if (filters.industry) {
  query = query.ilike('industry_id', `${filters.industry}%`);
}
if (filters.keyword) {
  // 브랜드명은 naming_results에 있어 sessions 직접 텍스트 검색은 title로 제한
  query = query.ilike('title', `%${filters.keyword}%`);
}
```

### 댓글 입력 폼 (optimistic update 패턴)
```typescript
// CommentSection.tsx — 기존 toggleLike 낙관적 업데이트 패턴과 동일
const handleSubmit = async () => {
  if (!content.trim() || !user) return;
  const tempComment = { id: crypto.randomUUID(), content, user_id: user.id, profiles: { full_name: user.email } };
  setComments(prev => [...prev, tempComment]); // optimistic
  setContent('');
  try {
    await socialService.addComment(sessionId, user.id, content);
    // re-fetch or leave optimistic
  } catch {
    setComments(prev => prev.filter(c => c.id !== tempComment.id)); // rollback
  }
};
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Chart.js (imperative Canvas) | Recharts (declarative React SVG) | 2018 이후 React 생태계 표준 | JSX로 차트 선언, ref 없이 반응형 처리 |
| 클라이언트 필터 전체 데이터 로드 | Supabase 서버 쿼리 `.ilike()` | Supabase v2.x | 페이지네이션과 결합, 대규모 데이터도 성능 유지 |
| 댓글 polling | Supabase Realtime (선택적) | 2022 | 사내 100인 앱은 실시간 불필요 — 단순 fetch 충분 |

**Deprecated/outdated:**
- `react-chartjs-2`: Chart.js 래퍼. Canvas 기반이라 React 19 Concurrent Mode와 궁합 좋지 않음. Recharts 사용.
- 클라이언트 전체 데이터 로드 후 JS filter: 갤러리 데이터가 늘어날 경우 성능 문제.

---

## Open Questions

1. **`naming_results.style_tag` 컬럼 실제 데이터 존재 여부**
   - What we know: Phase 07 스키마 설계에 `style_tag: text` 컬럼이 포함됨. Phase 08에서 AI가 `rationale` 구조화 응답을 반환하지만 `style_tag` 저장 로직은 직접 확인 필요.
   - What's unclear: 실제 Supabase 테이블에 데이터가 있는지, naming_results 저장 시 style_tag를 populate하는지.
   - Recommendation: 플래너/실행자가 `src/services/gemini.ts` 또는 naming_results INSERT 로직 확인 후 없으면 `input_data.expression.namingStyle` 배열로 fallback.

2. **리더보드 주간 필터 — likes.created_at 컬럼 존재 여부**
   - What we know: `likes` 테이블은 Phase 09에서 `session_id, user_id` INSERT로만 구현됨 (`socialService.ts` 확인). `created_at` default 컬럼이 있는지 불명확.
   - What's unclear: Supabase 테이블에 `created_at DEFAULT now()`가 자동으로 포함되는지.
   - Recommendation: 실행자가 Supabase 대시보드 또는 마이그레이션 SQL 확인. 없으면 전체 랭킹만 먼저 구현하고 주간 탭은 created_at 추가 마이그레이션 후 구현.

3. **자동 태그 저장 시점 — 생성 시점 vs 발행 시점**
   - What we know: D-05에서 "발행 시점이 아닌 생성 시점에 태깅"으로 명시됨.
   - What's unclear: `naming_results`가 저장될 때 현재 `style_tag` 컬럼을 채우는 코드가 있는지.
   - Recommendation: 규칙 기반으로 `input_data.expression.namingStyle[0]`를 `style_tag`로 저장하는 로직을 naming_results INSERT 시 추가하는 방식으로 단순화.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | npm install recharts | ✓ | v22.17.0 | — |
| npm | 패키지 설치 | ✓ | 10.9.2 | — |
| recharts | 차트 시각화 | ✗ (미설치) | 3.8.1 (npm 최신) | — |
| Supabase (런타임) | 댓글/필터/랭킹 쿼리 | 환경변수 필요 | ^2.101.1 (설치됨) | .env.example 참조 |

**Missing dependencies with no fallback:**
- `recharts` — 설치 필요. `npm install recharts`. 차트 기능 전체가 이에 의존.

**Missing dependencies with fallback:**
- Supabase 환경 변수 미설정 시 댓글/필터/랭킹 기능 작동 불가. 기존 알려진 블로커 (STATE.md 기록됨).

---

## Project Constraints (from CLAUDE.md)

| 제약 | 내용 |
|------|------|
| Tech Stack | React 19, Vite 6, TypeScript 5, Tailwind CSS 4, Lucide React — 이 스택에서 벗어나지 말 것 |
| AI | Gemini API (`@google/genai`) 전용 — OpenAI 사용 금지 |
| 파일 제한 | **모든 소스 파일 500줄 이하** — 황금룰. 컴포넌트 분리로 준수 |
| 금지 라이브러리 | Next.js, Redux, Material UI, Ant Design, Pinecone |
| 디자인 | 심플 + 고급스러움, CSS 전문가 수준 — 다크 테마 `#0F0F11`, 골드 `#B48C50` |
| UI 언어 | 한국어 UI |
| 배포 | Vercel |

---

## Sources

### Primary (HIGH confidence)
- recharts npm registry — 버전 3.8.1, React 19 peer dependency 직접 확인 (2026-04-06)
- `src/` 코드베이스 직접 분석 — galleryService, socialService, useGalleryStore, GalleryModal, Dashboard, ChipSelector, industryData 전체 읽기
- `.planning/phases/07-foundation-auth/07-RESEARCH.md` — DB 스키마(sessions, naming_results, likes 테이블 구조)

### Secondary (MEDIUM confidence)
- `.planning/phases/08-strategic-naming-logic-intelligence/08-CONTEXT.md` — NAMING_STYLE_OPTIONS 목록 (ExpressionTab.tsx 직접 확인으로 HIGH로 상향)
- `.planning/phases/09-social-gallery-collaboration/09-CONTEXT.md` — likes/bookmarks 패턴

### Tertiary (LOW confidence)
- `likes.created_at` 컬럼 존재 여부 — 코드에서 직접 확인 불가, INSERT 코드만 보임. 실행 시 Supabase 스키마 확인 필요.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — 패키지 버전 직접 확인, 기존 의존성 코드베이스 검증
- Architecture: HIGH — 기존 코드 패턴(likes/bookmarks/galleryService) 직접 분석, 동일 패턴 연장
- Pitfalls: HIGH — 코드베이스에서 실제 구조(GalleryModal overflow, industry_id 저장 형식 등) 직접 확인
- Open Questions: MEDIUM — 런타임 DB 상태는 코드로 100% 확인 불가

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (안정적 스택, 1개월 유효)
