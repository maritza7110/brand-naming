-- 모든 사용자의 프로필(이름)을 조회할 수 있도록 정책 추가
-- 기존 "Users can view their own profile" 정책은 본인만 허용
-- 갤러리에서 작성자 이름 표시에 필요

CREATE POLICY "Anyone can view profiles"
  ON public.profiles
  FOR SELECT
  USING (true);
