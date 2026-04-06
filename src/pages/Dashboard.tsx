import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, Loader2, Bookmark } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { sessionService } from '../services/sessionService';
import { socialService } from '../services/socialService';
import { useSocialStore } from '../store/useSocialStore';
import type { SessionData } from '../services/sessionService';
import ProjectList from '../components/dashboard/ProjectList';

export default function Dashboard() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'bookmarks'>('projects');
  const [bookmarkedSessions, setBookmarkedSessions] = useState<any[]>([]);
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const data = await sessionService.getSessions();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (activeTab === 'bookmarks' && user) {
      // 소셜 상태 초기화 (북마크 탭 진입 시 bookmarkedIds 동기화)
      useSocialStore.getState().initSocialState(user.id);
      // 북마크 목록 로드
      socialService.getMyBookmarks(user.id).then(setBookmarkedSessions).catch(console.error);
    }
  }, [activeTab, user]);

  const handleDelete = async (id: string) => {
    try {
      await sessionService.deleteSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      alert('프로젝트 삭제에 실패했습니다.');
    }
  };

  const handleSelect = (session: SessionData) => {
    console.log('Selected session:', session);
    navigate('/');
  };

  const handlePublishToggle = async (id: string, isPublic: boolean) => {
    try {
      await sessionService.publishSession(id, isPublic);
      setSessions(prev => prev.map(s => s.id === id ? { ...s, is_public: isPublic } : s));
    } catch (error) {
      alert(isPublic ? '발행에 실패했습니다.' : '철회에 실패했습니다.');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0F0F11] text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#141417]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent cursor-pointer" onClick={() => navigate('/')}>
            BRAND NAMING
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 hidden sm:block">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="로그아웃"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-1">내 대시보드</h2>
            <p className="text-gray-500">네이밍 프로젝트를 관리하고 갤러리에 공유하세요.</p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 bg-[#B48C50] hover:bg-[#C5A06B] text-white px-5 py-3 rounded-2xl font-bold transition-all"
          >
            <Plus size={20} />
            <span>새 프로젝트 시작</span>
          </button>
        </div>

        {/* 탭 */}
        <div className="flex gap-0 border-b border-white/5 mb-8">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 text-[14px] transition-colors ${
              activeTab === 'projects'
                ? 'text-[#B48C50] border-b-2 border-[#B48C50]'
                : 'text-[#A09890] cursor-pointer hover:text-[#E8E2DA]'
            }`}
          >
            내 프로젝트
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-2 text-[14px] transition-colors ${
              activeTab === 'bookmarks'
                ? 'text-[#B48C50] border-b-2 border-[#B48C50]'
                : 'text-[#A09890] cursor-pointer hover:text-[#E8E2DA]'
            }`}
          >
            북마크
          </button>
        </div>

        {/* 탭 콘텐츠 */}
        {activeTab === 'projects' ? (
          isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-[#B48C50] mb-4" size={40} />
              <p className="text-gray-500">프로젝트를 불러오는 중...</p>
            </div>
          ) : (
            <ProjectList
              sessions={sessions}
              onDelete={handleDelete}
              onSelect={handleSelect}
              onPublishToggle={handlePublishToggle}
            />
          )
        ) : (
          /* 북마크 탭 */
          bookmarkedSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-4 bg-[#B48C50]/10 rounded-2xl mb-4">
                <Bookmark className="text-[#B48C50]" size={32} />
              </div>
              <p className="text-white font-medium mb-2">저장한 프로젝트가 없습니다</p>
              <p className="text-gray-500 text-sm">갤러리에서 마음에 드는 프로젝트를 북마크해보세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarkedSessions.map((item: any) => {
                const s = item.sessions;
                if (!s) return null;
                return (
                  <div
                    key={s.id}
                    className="bg-[#1A1A1E] border border-white/5 rounded-2xl p-5 hover:border-[#B48C50]/30 transition-all"
                  >
                    <h3 className="text-white font-bold text-lg mb-2 truncate">{s.title}</h3>
                    <div className="text-[#B48C50]/70 text-[13px] font-medium mb-1">
                      {s.industry_id || '산업분류 미지정'}
                    </div>
                    {s.profiles?.full_name && (
                      <div className="text-gray-500 text-[13px]">
                        by {s.profiles.full_name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
      </main>
    </div>
  );
}
