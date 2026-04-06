-- Phase 10: Comments table for gallery feedback
CREATE TABLE IF NOT EXISTS comments (
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

-- likes 테이블에 created_at이 없을 경우 추가 (리더보드 주간 필터용)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'likes' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE likes ADD COLUMN created_at TIMESTAMPTZ DEFAULT now();
  END IF;
END $$;
