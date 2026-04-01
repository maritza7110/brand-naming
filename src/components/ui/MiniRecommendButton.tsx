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
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-[#D4A853]/60 transition-all duration-200 hover:text-[#D4A853] hover:bg-[#D4A853]/10 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#D4A853]/60"
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
