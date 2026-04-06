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
