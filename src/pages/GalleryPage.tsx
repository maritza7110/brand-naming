import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useGalleryStore } from '../store/useGalleryStore';
import { useSocialStore } from '../store/useSocialStore';
import { useAuthStore } from '../store/useAuthStore';
import GalleryGrid from '../components/gallery/GalleryGrid';
import GallerySortTabs from '../components/gallery/GallerySortTabs';
import type { GallerySession } from '../types/gallery';

export default function GalleryPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { sessions, sortBy, isLoading, hasMore, error, likeCounts, fetchNextPage, setSortBy } =
    useGalleryStore();
  const [selectedSession, setSelectedSession] = useState<GallerySession | null>(null);

  useEffect(() => {
    useGalleryStore.getState().reset();
    fetchNextPage();

    if (user) {
      useSocialStore.getState().initSocialState(user.id);
    }

    return () => {
      useGalleryStore.getState().reset();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0F11] text-white">
      {/* Header — Dashboard와 동일 패턴 */}
      <header className="border-b border-white/5 bg-[#141417]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-[20px] font-semibold">브랜드 갤러리</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <GallerySortTabs activeSort={sortBy} onSortChange={setSortBy} />
        <div className="mt-6">
          {error ? (
            <p className="text-[14px] text-red-400 text-center py-8">
              갤러리를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.
            </p>
          ) : sessions.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-[#A09890] mb-2">아직 공개된 프로젝트가 없습니다</p>
              <p className="text-[#B48C50] text-sm">
                첫 번째 발행자가 되어보세요. 내 프로젝트에서 &apos;갤러리에 발행&apos; 버튼을 눌러보세요.
              </p>
            </div>
          ) : (
            <GalleryGrid
              sessions={sessions}
              likeCounts={likeCounts}
              isLoading={isLoading}
              hasMore={hasMore}
              onLoadMore={fetchNextPage}
              onCardClick={(s) => setSelectedSession(s)}
            />
          )}
        </div>

        {/* GalleryModal은 Plan 04에서 구현 — selectedSession 상태만 준비 */}
        {/* {selectedSession && <GalleryModal session={selectedSession} onClose={() => setSelectedSession(null)} />} */}
        {selectedSession && null}
      </main>
    </div>
  );
}
