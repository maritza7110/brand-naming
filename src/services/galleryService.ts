import { supabase } from './supabase';
import type { GallerySession, GallerySortBy } from '../types/gallery';

const PAGE_SIZE = 12;

export const galleryService = {
  fetchPage: async (page: number, sortBy: GallerySortBy): Promise<GallerySession[]> => {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const orderColumn = sortBy === 'popular' ? 'updated_at' : 'created_at';

    const { data, error } = await supabase
      .from('sessions')
      .select(`
        id,
        title,
        industry_id,
        input_data,
        created_at,
        user_id,
        profiles:user_id (full_name),
        naming_results (brand_name, reasoning)
      `)
      .eq('is_public', true)
      .order(orderColumn, { ascending: false })
      .range(from, to);

    if (error) throw error;

    return (data ?? []).map((session: any) => ({
      ...session,
      like_count: 0,
    })) as GallerySession[];
  },

  fetchLikeCounts: async (sessionIds: string[]): Promise<Record<string, number>> => {
    if (sessionIds.length === 0) return {};

    const results = await Promise.all(
      sessionIds.map(async (id) => {
        const { count, error } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('session_id', id);

        if (error) throw error;
        return { id, count: count ?? 0 };
      })
    );

    return results.reduce<Record<string, number>>((acc, { id, count }) => {
      acc[id] = count;
      return acc;
    }, {});
  },
};
