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
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[12px] font-medium text-blue-600 bg-blue-50 transition-all duration-200 hover:bg-blue-100 hover:text-blue-700 active:bg-blue-200 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 size={12} className="animate-spin" />
      ) : (
        <Sparkles size={12} />
      )}
      <span>추천</span>
    </button>
  );
}
