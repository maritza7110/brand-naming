import type { GallerySession } from '../../types/gallery';
import GalleryCard from './GalleryCard';
import GallerySkeletonCard from './GallerySkeletonCard';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

interface GalleryGridProps {
  sessions: GallerySession[];
  likeCounts: Record<string, number>;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onCardClick: (session: GallerySession) => void;
}

export default function GalleryGrid({
  sessions,
  likeCounts,
  isLoading,
  hasMore,
  onLoadMore,
  onCardClick,
}: GalleryGridProps) {
  const sentinelRef = useInfiniteScroll(onLoadMore, hasMore, isLoading);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {sessions.map((session) => (
          <GalleryCard
            key={session.id}
            session={session}
            likeCount={likeCounts[session.id] ?? 0}
            onClick={onCardClick}
          />
        ))}
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => <GallerySkeletonCard key={`skeleton-${i}`} />)}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-1" />

      {/* End of feed message */}
      {!hasMore && sessions.length > 0 && (
        <p className="text-[14px] text-[#A09890] text-center py-8">
          모든 프로젝트를 불러왔습니다
        </p>
      )}
    </div>
  );
}
