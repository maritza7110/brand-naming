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
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white text-[13px] font-medium transition-all duration-200 hover:bg-gray-800 active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100"
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
