import { useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { useGalleryStore } from '../../store/useGalleryStore';
import LikeButton from './LikeButton';
import type { LeaderboardPeriod } from '../../types/gallery';

const PERIOD_TABS: { key: LeaderboardPeriod; label: string }[] = [
  { key: 'week', label: '이번 주' },
  { key: 'all', label: '역대' },
];

export default function GalleryLeaderboard() {
  const {
    leaderboard,
    leaderboardPeriod,
    isLeaderboardLoading,
    fetchLeaderboard,
    setLeaderboardPeriod,
  } = useGalleryStore();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="border-b border-[#4A4440] pb-6 mb-2">
      {/* 섹션 헤더 */}
      <div className="flex items-center gap-2 mb-3">
        <Trophy size={20} className="text-[#B48C50]" />
        <h2 className="text-[20px] font-semibold text-[#E8E2DA]">이번 주 인기 TOP</h2>
      </div>

      {/* 기간 탭 */}
      <div className="flex gap-0 border-b border-[#4A4440] mb-4">
        {PERIOD_TABS.map(({ key, label }) =>
          leaderboardPeriod === key ? (
            <span
              key={key}
              className="px-4 py-2 text-[14px] text-[#B48C50] border-b-2 border-[#B48C50] cursor-default"
            >
              {label}
            </span>
          ) : (
            <button
              key={key}
              onClick={() => setLeaderboardPeriod(key)}
              className="px-4 py-2 text-[14px] text-[#A09890] cursor-pointer hover:text-[#E8E2DA] transition-colors duration-150"
            >
              {label}
            </button>
          )
        )}
      </div>

      {/* 카드 행 */}
      {isLeaderboardLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-[#4A4440] rounded-xl min-w-[200px] h-[140px] flex-shrink-0"
            />
          ))}
        </div>
      ) : leaderboard.length === 0 ? (
        <p className="text-[14px] text-[#A09890] text-center py-8">
          아직 발행된 프로젝트가 없습니다
        </p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {leaderboard.map((entry, index) => {
            const brandName = entry.session.naming_results?.[0]?.brand_name ?? '—';
            const industry = entry.session.industry_id ?? '미분류';

            return (
              <div
                key={entry.session.id}
                className="bg-[#1A1A1E] border border-white/5 rounded-xl p-4 min-w-[200px] flex-shrink-0 hover:border-[#B48C50]/30 transition-all"
              >
                {/* 순위 배지 */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#4A4440] flex items-center justify-center text-[12px] font-semibold text-[#D0CAC2]">
                    {index + 1}
                  </div>
                </div>

                {/* 브랜드명 */}
                <p className="text-[#B48C50] text-[16px] font-semibold truncate mb-1">
                  {brandName}
                </p>

                {/* 업종 배지 */}
                <span className="bg-[#4A4440] text-[#D0CAC2] text-[12px] px-2 py-0.5 rounded-full inline-block mb-2">
                  {industry}
                </span>

                {/* 좋아요 */}
                <div className="flex justify-end">
                  <LikeButton
                    sessionId={entry.session.id}
                    count={entry.likeCount}
                    showCount
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
