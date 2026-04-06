import { supabase } from './supabase';
import type { CommentData } from '../types/gallery';

export const socialService = {
  getMyLikedIds: async (userId: string): Promise<Set<string>> => {
    const { data, error } = await supabase
      .from('likes')
      .select('session_id')
      .eq('user_id', userId);

    if (error) throw error;
    return new Set((data ?? []).map((d: { session_id: string }) => d.session_id));
  },

  getMyBookmarkedIds: async (userId: string): Promise<Set<string>> => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('session_id')
      .eq('user_id', userId);

    if (error) throw error;
    return new Set((data ?? []).map((d: { session_id: string }) => d.session_id));
  },

  toggleLike: async (sessionId: string, userId: string, isLiked: boolean): Promise<void> => {
    if (isLiked) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('session_id', sessionId)
        .eq('user_id', userId);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('likes')
        .insert({ session_id: sessionId, user_id: userId });
      if (error) throw error;
    }
  },

  toggleBookmark: async (sessionId: string, userId: string, isBookmarked: boolean): Promise<void> => {
    if (isBookmarked) {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('session_id', sessionId)
        .eq('user_id', userId);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('bookmarks')
        .insert({ session_id: sessionId, user_id: userId });
      if (error) throw error;
    }
  },

  getMyBookmarks: async (userId: string) => {
    const { data, error } = await supabase
      .from('bookmarks')
      .select(`
        session_id,
        sessions:session_id (id, title, industry_id, is_public, created_at, profiles:user_id (full_name))
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  getComments: async (sessionId: string): Promise<CommentData[]> => {
    const { data, error } = await supabase
      .from('comments')
      .select('id, content, created_at, user_id, session_id, profiles:user_id(full_name)')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data ?? []) as unknown as CommentData[];
  },

  addComment: async (sessionId: string, userId: string, content: string): Promise<void> => {
    const { error } = await supabase
      .from('comments')
      .insert({ session_id: sessionId, user_id: userId, content });
    if (error) throw error;
  },

  deleteComment: async (commentId: string): Promise<void> => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);
    if (error) throw error;
  },
};
