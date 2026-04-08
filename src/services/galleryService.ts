import { supabase } from './supabase';
import type { GallerySession, GallerySortBy, GalleryFilters, LeaderboardPeriod, LeaderboardEntry } from '../types/gallery';

const PAGE_SIZE = 12;

const SESSION_SELECT = `
  id,
  title,
  industry_id,
  input_data,
  created_at,
  user_id,
  profiles:user_id (full_name),
  naming_results (brand_name, reasoning, style_tag)
`;

export const galleryService = {
  fetchPage: async (page: number, sortBy: GallerySortBy, filters?: GalleryFilters): Promise<GallerySession[]> => {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const orderColumn = sortBy === 'popular' ? 'updated_at' : 'created_at';

    let query = supabase
      .from('sessions')
      .select(SESSION_SELECT)
      .eq('is_public', true)
      .order(orderColumn, { ascending: false })
      .range(from, to);

    if (filters?.industry) {
      query = query.ilike('industry_id', `${filters.industry}%`);
    }

    if (filters?.keyword) {
      query = query.ilike('title', `%${filters.keyword}%`);
    }

    const { data, error } = await query;

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

  fetchLeaderboard: async (period: LeaderboardPeriod, limit = 5): Promise<LeaderboardEntry[]> => {
    const LEADERBOARD_LIKES_LIMIT = 1000;
    // 1. likes 테이블에서 조회 (period === 'week'이면 7일 이내만, 최대 1000건)
    let likesQuery = supabase
      .from('likes')
      .select('session_id, created_at')
      .limit(LEADERBOARD_LIKES_LIMIT);

    if (period === 'week') {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      likesQuery = likesQuery.gte('created_at', sevenDaysAgo);
    }

    const { data: likesData, error: likesError } = await likesQuery;
    if (likesError) throw likesError;

    // 2. session_id별 count 집계
    const countMap = (likesData ?? []).reduce<Record<string, number>>((acc, row: any) => {
      acc[row.session_id] = (acc[row.session_id] ?? 0) + 1;
      return acc;
    }, {});

    // 3. count 내림차순 정렬 후 상위 limit개 session_id 추출
    const topSessionIds = Object.entries(countMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([id]) => id);

    if (topSessionIds.length === 0) return [];

    // 4. 해당 session들의 상세 정보 조회
    const { data: sessionsData, error: sessionsError } = await supabase
      .from('sessions')
      .select(SESSION_SELECT)
      .in('id', topSessionIds)
      .eq('is_public', true);

    if (sessionsError) throw sessionsError;

    // 5. LeaderboardEntry[] 반환 (count 순서 유지)
    const sessionMap = new Map((sessionsData ?? []).map((s: any) => [s.id, s]));

    return topSessionIds
      .map((id) => {
        const session = sessionMap.get(id);
        if (!session) return null;
        return {
          session: { ...session, like_count: countMap[id] ?? 0 } as GallerySession,
          likeCount: countMap[id] ?? 0,
        };
      })
      .filter((entry): entry is LeaderboardEntry => entry !== null);
  },
};
