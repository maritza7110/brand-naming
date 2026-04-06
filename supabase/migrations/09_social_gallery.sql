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
