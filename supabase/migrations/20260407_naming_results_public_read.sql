-- 공개 세션의 naming_results를 모든 사용자가 조회할 수 있도록 정책 추가
-- 기존 "Users can manage results of their own sessions" 정책은 소유자만 허용
-- 갤러리에서 타인의 브랜드명을 표시하려면 이 정책이 필요

CREATE POLICY "Anyone can view results of public sessions"
  ON public.naming_results
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sessions
      WHERE id = naming_results.session_id AND is_public = true
    )
  );
