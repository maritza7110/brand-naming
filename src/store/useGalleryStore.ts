import { create } from 'zustand';
import type { GallerySession, GallerySortBy, GalleryFilters, LeaderboardPeriod, LeaderboardEntry } from '../types/gallery';
import { galleryService } from '../services/galleryService';

const PAGE_SIZE = 12;

interface GalleryState {
  sessions: GallerySession[];
  page: number;
  sortBy: GallerySortBy;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
  likeCounts: Record<string, number>;

  filters: GalleryFilters;
  leaderboard: LeaderboardEntry[];
  leaderboardPeriod: LeaderboardPeriod;
  isLeaderboardLoading: boolean;

  fetchNextPage: () => Promise<void>;
  setSortBy: (sortBy: GallerySortBy) => void;
  reset: () => void;
  updateLikeCount: (sessionId: string, delta: number) => void;

  setFilters: (filters: Partial<GalleryFilters>) => void;
  resetFilters: () => void;
  fetchLeaderboard: (period?: LeaderboardPeriod) => Promise<void>;
  setLeaderboardPeriod: (period: LeaderboardPeriod) => void;
}

const DEFAULT_FILTERS: GalleryFilters = {
  industry: null,
  namingStyle: null,
  keyword: '',
};

const initialState = {
  sessions: [],
  page: 0,
  sortBy: 'latest' as GallerySortBy,
  isLoading: false,
  hasMore: true,
  error: null,
  likeCounts: {},
  filters: DEFAULT_FILTERS,
  leaderboard: [],
  leaderboardPeriod: 'week' as LeaderboardPeriod,
  isLeaderboardLoading: false,
};

export const useGalleryStore = create<GalleryState>((set, get) => ({
  ...initialState,

  fetchNextPage: async () => {
    const { isLoading, page, sortBy, filters } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const newSessions = await galleryService.fetchPage(page, sortBy, filters);

      // namingStyle 클라이언트 필터 (input_data.expression.namingStyle 배열에서 매칭)
      let filtered = newSessions;
      if (filters.namingStyle) {
        const style = filters.namingStyle;
        filtered = newSessions.filter((s) => {
          const styles = s.input_data?.expression?.namingStyle;
          return Array.isArray(styles) && styles.includes(style);
        });
      }

      const sessionIds = filtered.map((s) => s.id);
      const counts = await galleryService.fetchLikeCounts(sessionIds);

      set((state) => ({
        sessions: [...state.sessions, ...filtered],
        page: state.page + 1,
        hasMore: newSessions.length >= PAGE_SIZE,
        likeCounts: { ...state.likeCounts, ...counts },
        isLoading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '갤러리를 불러오는 중 오류가 발생했습니다.',
        isLoading: false,
      });
    }
  },

  setSortBy: (sortBy: GallerySortBy) => {
    set({
      sortBy,
      sessions: [],
      page: 0,
      hasMore: true,
      error: null,
    });
    get().fetchNextPage();
  },

  reset: () => {
    set(initialState);
  },

  updateLikeCount: (sessionId: string, delta: number) => {
    set((state) => ({
      likeCounts: {
        ...state.likeCounts,
        [sessionId]: (state.likeCounts[sessionId] ?? 0) + delta,
      },
    }));
  },

  setFilters: (partial: Partial<GalleryFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...partial },
      sessions: [],
      page: 0,
      hasMore: true,
      error: null,
    }));
    get().fetchNextPage();
  },

  resetFilters: () => {
    set({
      filters: DEFAULT_FILTERS,
      sessions: [],
      page: 0,
      hasMore: true,
      error: null,
    });
    get().fetchNextPage();
  },

  fetchLeaderboard: async (period?: LeaderboardPeriod) => {
    const p = period ?? get().leaderboardPeriod;
    set({ isLeaderboardLoading: true });
    try {
      const entries = await galleryService.fetchLeaderboard(p, 5);
      set({ leaderboard: entries, isLeaderboardLoading: false });
    } catch {
      set({ isLeaderboardLoading: false });
    }
  },

  setLeaderboardPeriod: (period: LeaderboardPeriod) => {
    set({ leaderboardPeriod: period });
    get().fetchLeaderboard(period);
  },
}));
