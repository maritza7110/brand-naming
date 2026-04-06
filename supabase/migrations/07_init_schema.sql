-- 07-foundation-auth: 초기 스키마 및 보안 정책 설정

-- 1. profiles 테이블 (유저 프로필)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. sessions 테이블 (네이밍 프로젝트)
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT '새 프로젝트',
  industry_id TEXT,
  input_data JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'draft',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. naming_results 테이블 (작명 결과)
CREATE TABLE IF NOT EXISTS public.naming_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  reasoning TEXT,
  based_on JSONB DEFAULT '[]'::jsonb,
  style_tag TEXT,
  score INTEGER DEFAULT 0,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. tags 테이블 (카테고리/태그)
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- 5. session_tags 테이블 (N:M 관계)
CREATE TABLE IF NOT EXISTS public.session_tags (
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (session_id, tag_id)
);

-- Row Level Security (RLS) 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.naming_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_tags ENABLE ROW LEVEL SECURITY;

-- 6. 보안 정책 (Policies)

-- Profiles: 본인 프로필만 조회 및 수정 가능
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Sessions: 본인 데이터 CRUD 가능, 공개 설정된 세션은 조회만 가능
CREATE POLICY "Users can view their own sessions or public ones" ON public.sessions FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can insert their own sessions" ON public.sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sessions" ON public.sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sessions" ON public.sessions FOR DELETE USING (auth.uid() = user_id);

-- Naming Results: 해당 세션의 소유자만 접근 가능
CREATE POLICY "Users can manage results of their own sessions" ON public.naming_results FOR ALL USING (
  EXISTS (SELECT 1 FROM public.sessions WHERE id = session_id AND user_id = auth.uid())
);

-- Tags: 본인 태그만 관리 가능
CREATE POLICY "Users can manage their own tags" ON public.tags FOR ALL USING (auth.uid() = user_id);

-- Session Tags: 해당 세션의 소유자만 관리 가능
CREATE POLICY "Users can manage session tags of their own sessions" ON public.session_tags FOR ALL USING (
  EXISTS (SELECT 1 FROM public.sessions WHERE id = session_id AND user_id = auth.uid())
);

-- 7. Auth 유저 생성 시 Profile 자동 생성 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
