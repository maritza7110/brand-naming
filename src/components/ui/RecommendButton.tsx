import { Sparkles, Loader2 } from 'lucide-react';

interface RecommendButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function RecommendButton({
  onClick,
  disabled = false,
  loading = false,
}: RecommendButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[13px] font-semibold shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed disabled:translate-y-0"
    >
      {loading ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          <span>추천 중...</span>
        </>
      ) : (
        <>
          <Sparkles size={14} />
          <span>추천 받기</span>
        </>
      )}
    </button>
  );
}
