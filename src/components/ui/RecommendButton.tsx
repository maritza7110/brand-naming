import { Sparkles, Loader2 } from 'lucide-react';

interface RecommendButtonProps { onClick?: () => void; disabled?: boolean; loading?: boolean; }

export function RecommendButton({ onClick, disabled = false, loading = false }: RecommendButtonProps) {
  return (
    <button type="button" onClick={onClick} disabled={disabled || loading}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B48C50] text-[#2C2825] text-[13px] font-bold transition-all duration-200 hover:bg-[#C49A5C] active:scale-[0.97] disabled:opacity-20 disabled:cursor-not-allowed">
      {loading ? <><Loader2 size={14} className="animate-spin" /><span>추천 중...</span></> : <><Sparkles size={14} /><span>추천 받기</span></>}
    </button>
  );
}
