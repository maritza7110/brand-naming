import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { Loader2, Mail, Lock } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setError('이메일 인증이 완료되지 않았습니다. 메일함에서 인증 링크를 확인해주세요.');
      } else {
        setError(error.message);
      }
      setIsLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 ml-1">이메일</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#1A1A1E] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#B48C50] transition-colors"
            placeholder="example@email.com"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300 ml-1">비밀번호</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#1A1A1E] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#B48C50] transition-colors"
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      {error && (
        <div className="text-red-400 text-sm px-1 py-2 font-medium">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#B48C50] hover:bg-[#C5A06B] text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? <Loader2 className="animate-spin" size={20} /> : '로그인'}
      </button>

      <p className="text-center text-gray-500 text-sm mt-4">
        계정이 없으신가요?{' '}
        <Link to="/signup" className="text-[#B48C50] hover:underline">
          회원가입
        </Link>
      </p>
    </form>
  );
}
