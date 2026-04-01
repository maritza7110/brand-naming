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
      className="w-full py-3 px-6 rounded-lg bg-blue-600 text-white font-medium text-[15px] shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow active:bg-blue-800 active:shadow-inner disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>추천 중...</span>
        </>
      ) : (
        <>
          <Sparkles size={18} />
          <span>추천 받기</span>
        </>
      )}
    </button>
  );
}
