import { create } from 'zustand';
import { socialService } from '../services/socialService';
import { useGalleryStore } from './useGalleryStore';

interface SocialState {
  likedIds: Set<string>;
  bookmarkedIds: Set<string>;
  isInitialized: boolean;

  initSocialState: (userId: string) => Promise<void>;
  toggleLike: (sessionId: string, userId: string) => Promise<void>;
  toggleBookmark: (sessionId: string, userId: string) => Promise<void>;
}

export const useSocialStore = create<SocialState>((set, get) => ({
  likedIds: new Set<string>(),
  bookmarkedIds: new Set<string>(),
  isInitialized: false,

  initSocialState: async (userId: string) => {
    const [likedIds, bookmarkedIds] = await Promise.all([
      socialService.getMyLikedIds(userId),
      socialService.getMyBookmarkedIds(userId),
    ]);
    set({ likedIds, bookmarkedIds, isInitialized: true });
  },

  toggleLike: async (sessionId: string, userId: string) => {
    const { likedIds } = get();
    const wasLiked = likedIds.has(sessionId);

    // 낙관적 업데이트: 즉시 UI 변경
    const nextLikedIds = new Set(likedIds);
    wasLiked ? nextLikedIds.delete(sessionId) : nextLikedIds.add(sessionId);
    set({ likedIds: nextLikedIds });
    useGalleryStore.getState().updateLikeCount(sessionId, wasLiked ? -1 : 1);

    try {
      await socialService.toggleLike(sessionId, userId, wasLiked);
    } catch {
      // 롤백: 실패 시 원래 상태로 복원
      const rollbackIds = new Set(get().likedIds);
      wasLiked ? rollbackIds.add(sessionId) : rollbackIds.delete(sessionId);
      set({ likedIds: rollbackIds });
      useGalleryStore.getState().updateLikeCount(sessionId, wasLiked ? 1 : -1);
    }
  },

  toggleBookmark: async (sessionId: string, userId: string) => {
    const { bookmarkedIds } = get();
    const wasBookmarked = bookmarkedIds.has(sessionId);

    // 낙관적 업데이트: 즉시 UI 변경
    const nextBookmarkedIds = new Set(bookmarkedIds);
    wasBookmarked ? nextBookmarkedIds.delete(sessionId) : nextBookmarkedIds.add(sessionId);
    set({ bookmarkedIds: nextBookmarkedIds });

    try {
      await socialService.toggleBookmark(sessionId, userId, wasBookmarked);
    } catch {
      // 롤백: 실패 시 원래 상태로 복원
      const rollbackIds = new Set(get().bookmarkedIds);
      wasBookmarked ? rollbackIds.add(sessionId) : rollbackIds.delete(sessionId);
      set({ bookmarkedIds: rollbackIds });
    }
  },
}));
