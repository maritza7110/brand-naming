import { supabase } from './supabase';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export interface SessionData {
  id: string;
  user_id: string;
  title: string;
  industry_id: string | null;
  input_data: any;
  status: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export const sessionService = {
  // 사용자의 세션 목록 가져오기
  getSessions: async () => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as SessionData[];
  },

  // 특정 세션 삭제하기
  deleteSession: async (id: string) => {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // 세션 제목 수정하기
  updateSessionTitle: async (id: string, title: string) => {
    const { error } = await supabase
      .from('sessions')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  },

  // 세션 발행/철회
  publishSession: async (id: string, isPublic: boolean) => {
    const { error } = await supabase
      .from('sessions')
      .update({ is_public: isPublic, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },

  // 날짜 포맷팅 유틸리티
  formatDate: (dateString: string) => {
    return format(new Date(dateString), 'yyyy년 MM월 dd일 HH:mm', { locale: ko });
  }
};
