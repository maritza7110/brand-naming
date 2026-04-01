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
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-gray-400 transition-all duration-150 hover:text-blue-600 hover:bg-blue-50 disabled:opacity-0 disabled:cursor-default"
    >
      {loading ? (
        <Loader2 size={10} className="animate-spin" />
      ) : (
        <Sparkles size={10} />
      )}
      <span>추천</span>
    </button>
  );
}
