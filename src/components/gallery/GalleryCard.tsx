import { Heart } from 'lucide-react';
import type { GallerySession } from '../../types/gallery';

interface GalleryCardProps {
  session: GallerySession;
  likeCount: number;
  onClick: (session: GallerySession) => void;
}

export default function GalleryCard({ session, likeCount, onClick }: GalleryCardProps) {
  return (
    <div
      className="bg-[#1A1A1E] border border-white/5 rounded-2xl p-4 hover:border-[#B48C50]/30 transition-all cursor-pointer overflow-hidden relative"
      onClick={() => onClick(session)}
    >
      {/* Industry badge */}
      <span className="inline-block bg-[#4A4440] text-[#D0CAC2] text-[12px] px-2 py-1 rounded-full mb-3">
        {session.industry_id || '미분류'}
      </span>

      {/* Brand names — 최대 3개 표시 */}
      <div className="space-y-1 mb-3">
        {session.naming_results.slice(0, 3).map((r, i) => (
          <p key={i} className="text-[#B48C50] text-[16px] font-semibold truncate">
            {r.brand_name}
          </p>
        ))}
        {session.naming_results.length === 0 && (
          <p className="text-[#A09890] text-[14px]">브랜드명 없음</p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-[#4A4440] mt-3 pt-3" />

      {/* Footer row — Plan 04에서 LikeButton/BookmarkButton으로 교체 예정 */}
      <div className="flex justify-between items-center">
        <span className="text-[12px] text-[#A09890] truncate max-w-[60%]">
          {session.profiles?.full_name || '익명'}
        </span>
        <div className="flex items-center gap-1 text-[#A09890]">
          <Heart size={14} />
          <span className="text-[12px]">{likeCount}</span>
        </div>
      </div>

      {/* 장식용 그라데이션 — ProjectCard 패턴 */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#B48C50]/5 to-transparent pointer-events-none" />
    </div>
  );
}
