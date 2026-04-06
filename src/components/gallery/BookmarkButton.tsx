import { Bookmark } from 'lucide-react';
import { useSocialStore } from '../../store/useSocialStore';
import { useAuthStore } from '../../store/useAuthStore';

interface BookmarkButtonProps {
  sessionId: string;
}

export default function BookmarkButton({ sessionId }: BookmarkButtonProps) {
  const { bookmarkedIds, toggleBookmark } = useSocialStore();
  const user = useAuthStore((s) => s.user);
  const isBookmarked = bookmarkedIds.has(sessionId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    toggleBookmark(sessionId, user.id);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center min-h-[44px] min-w-[44px] justify-center transition-all"
      aria-label="북마크"
    >
      <Bookmark
        size={16}
        className={isBookmarked ? 'fill-[#B48C50] text-[#B48C50]' : 'text-[#A09890]'}
        style={
          isBookmarked
            ? { transform: 'scale(1.1)', transition: 'transform 150ms' }
            : { transition: 'transform 150ms' }
        }
      />
    </button>
  );
}
