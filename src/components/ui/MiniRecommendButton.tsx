import { Sparkles, Loader2 } from 'lucide-react';

interface MiniRecommendButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function MiniRecommendButton({
  onClick,
  disabled = false,
  loading = false,
}: MiniRecommendButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-indigo-400 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 disabled:opacity-0 disabled:cursor-default"
    >
      {loading ? (
        <Loader2 size={11} className="animate-spin" />
      ) : (
        <Sparkles size={11} />
      )}
      <span>추천</span>
    </button>
  );
}
