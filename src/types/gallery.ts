export type GallerySortBy = 'latest' | 'popular';

export interface GallerySession {
  id: string;
  title: string;
  industry_id: string | null;
  input_data: any;
  created_at: string;
  user_id: string;
  profiles: { full_name: string | null } | null;
  naming_results: { brand_name: string; reasoning: string }[];
  like_count: number;
  is_bookmarked?: boolean;
}

export interface LikeStatus {
  sessionId: string;
  isLiked: boolean;
  count: number;
}

export interface BookmarkStatus {
  sessionId: string;
  isBookmarked: boolean;
}

export interface GalleryFilters {
  industry: string | null;     // 대분류 (음식, 소매, 생활서비스 등)
  namingStyle: string | null;  // 네이밍 스타일 (합성어, 추상어 등)
  keyword: string;             // 키워드 검색 (브랜드명/title 텍스트 검색)
}

export type LeaderboardPeriod = 'week' | 'all';

export interface LeaderboardEntry {
  session: GallerySession;
  likeCount: number;
}

export interface CommentData {
  id: string;
  session_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles: { full_name: string | null } | null;
}
