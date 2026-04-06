import { Heart } from 'lucide-react';
import { useSocialStore } from '../../store/useSocialStore';
import { useAuthStore } from '../../store/useAuthStore';

interface LikeButtonProps {
  sessionId: string;
  count: number;
  showCount?: boolean;
}

export default function LikeButton({ sessionId, count, showCount = true }: LikeButtonProps) {
  const { likedIds, toggleLike } = useSocialStore();
  const user = useAuthStore((s) => s.user);
  const isLiked = likedIds.has(sessionId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    toggleLike(sessionId, user.id);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 min-h-[44px] min-w-[44px] justify-center transition-all"
      aria-label="좋아요"
    >
      <Heart
        size={16}
        className={isLiked ? 'fill-[#B48C50] text-[#B48C50]' : 'text-[#A09890]'}
        style={
          isLiked
            ? { transform: 'scale(1.1)', transition: 'transform 150ms' }
            : { transition: 'transform 150ms' }
        }
      />
      {showCount && <span className="text-[12px] text-[#A09890]">{count}</span>}
    </button>
  );
}
