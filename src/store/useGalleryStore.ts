import { create } from 'zustand';
import type { GallerySession, GallerySortBy } from '../types/gallery';
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

  fetchNextPage: () => Promise<void>;
  setSortBy: (sortBy: GallerySortBy) => void;
  reset: () => void;
  updateLikeCount: (sessionId: string, delta: number) => void;
}

const initialState = {
  sessions: [],
  page: 0,
  sortBy: 'latest' as GallerySortBy,
  isLoading: false,
  hasMore: true,
  error: null,
  likeCounts: {},
};

export const useGalleryStore = create<GalleryState>((set, get) => ({
  ...initialState,

  fetchNextPage: async () => {
    const { isLoading, page, sortBy } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const newSessions = await galleryService.fetchPage(page, sortBy);
      const sessionIds = newSessions.map((s) => s.id);
      const counts = await galleryService.fetchLikeCounts(sessionIds);

      set((state) => ({
        sessions: [...state.sessions, ...newSessions],
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
}));
