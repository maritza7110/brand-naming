import { Sparkles, Loader2 } from 'lucide-react';

interface MiniRecommendButtonProps { onClick?: () => void; disabled?: boolean; loading?: boolean; }

export function MiniRecommendButton({ onClick, disabled = false, loading = false }: MiniRecommendButtonProps) {
  return (
    <button type="button" onClick={onClick} disabled={disabled || loading}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-[#B48C50] transition-all hover:bg-[#B48C50]/15 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-transparent">
      {loading ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
      <span>추천</span>
    </button>
  );
}
