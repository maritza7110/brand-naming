import type { GallerySession } from '../../types/gallery';
import LikeButton from './LikeButton';
import BookmarkButton from './BookmarkButton';

interface GalleryCardProps {
  session: GallerySession;
  likeCount: number;
  onClick: (session: GallerySession) => void;
}

export default function GalleryCard({ session, likeCount, onClick }: GalleryCardProps) {
  return (
    <div
      className="bg-[var(--color-surface)] border border-white/5 rounded-2xl p-4 hover:border-[var(--color-accent)]/30 transition-all cursor-pointer overflow-hidden relative"
      onClick={() => onClick(session)}
    >
      {/* Industry badge */}
      <span className="inline-block bg-[var(--color-border)] text-[var(--color-text-secondary)] text-[12px] px-2 py-1 rounded-full mb-3">
        {session.industry_id || '미분류'}
      </span>

      {/* Brand names — 최대 3개 표시 */}
      <div className="space-y-1 mb-3">
        {session.naming_results.slice(0, 3).map((r, i) => (
          <p key={i} className="text-[var(--color-accent)] text-[16px] font-semibold truncate">
            {r.brand_name}
          </p>
        ))}
        {session.naming_results.length === 0 && (
          <p className="text-[var(--color-text-muted)] text-[14px]">브랜드명 없음</p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-[var(--color-border)] mt-3 pt-3" />

      {/* Footer row */}
      <div className="flex justify-between items-center">
        <span className="text-[12px] text-[var(--color-text-muted)] truncate max-w-[60%]">
          {session.profiles?.full_name || '익명'}
        </span>
        <div className="flex items-center gap-0">
          <LikeButton sessionId={session.id} count={likeCount} />
          <BookmarkButton sessionId={session.id} />
        </div>
      </div>

      {/* 장식용 그라데이션 — ProjectCard 패턴 */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--color-accent)]/5 to-transparent pointer-events-none" />
    </div>
  );
}
