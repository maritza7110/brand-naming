import { supabase } from './supabase';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { FormState, RecommendBatch } from '../types/form';

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

export interface NamingResultRow {
  id: string;
  session_id: string;
  brand_name: string;
  reasoning: string | null;
  based_on: string[];
  style_tag: string | null;
  score: number;
  is_favorite: boolean;
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

  // 세션 + naming_results 조회 (복원용)
  getSessionWithResults: async (id: string) => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*, naming_results(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as SessionData & { naming_results: NamingResultRow[] };
  },

  // 세션 생성 (NamingPage → Supabase)
  createSession: async (
    userId: string,
    title: string,
    formState: FormState,
    batches: RecommendBatch[],
  ): Promise<string> => {
    const industry = formState.storeBasic.industry;
    const industryId = [industry.major, industry.medium, industry.minor]
      .filter(Boolean).join('/') || null;

    // input_data: flat merge (갤러리 모달 호환) + _formState + _batches (복원용)
    const inputData = {
      ...formState.storeBasic,
      ...formState.brandVision,
      ...formState.product,
      ...formState.persona,
      ...formState.analysis,
      ...formState.identity,
      ...formState.expression,
      _formState: formState,
      _batches: batches,
    };

    // sessions INSERT
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        user_id: userId,
        title,
        industry_id: industryId,
        input_data: inputData,
        status: 'complete',
        is_public: true,
      })
      .select('id')
      .single();

    if (sessionError) throw sessionError;
    const sessionId = session.id;

    // naming_results bulk INSERT
    const resultRows = batches.flatMap((batch) =>
      batch.names.map((n) => ({
        session_id: sessionId,
        brand_name: n.brandName,
        reasoning: n.reasoning || null,
        based_on: batch.basedOn,
        style_tag: n.rationale?.namingTechnique || null,
        score: n.rationale?.validityScore ?? 0,
      }))
    );

    if (resultRows.length > 0) {
      const { error: resultsError } = await supabase
        .from('naming_results')
        .insert(resultRows);
      if (resultsError) throw resultsError;
    }

    return sessionId;
  },

  // 기존 세션 업데이트 (재저장)
  updateSession: async (
    sessionId: string,
    formState: FormState,
    batches: RecommendBatch[],
  ) => {
    const industry = formState.storeBasic.industry;
    const industryId = [industry.major, industry.medium, industry.minor]
      .filter(Boolean).join('/') || null;

    const inputData = {
      ...formState.storeBasic,
      ...formState.brandVision,
      ...formState.product,
      ...formState.persona,
      ...formState.analysis,
      ...formState.identity,
      ...formState.expression,
      _formState: formState,
      _batches: batches,
    };

    // sessions UPDATE
    const { error: sessionError } = await supabase
      .from('sessions')
      .update({
        industry_id: industryId,
        input_data: inputData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId);
    if (sessionError) throw sessionError;

    // naming_results 교체: 기존 삭제 후 재삽입
    const { error: deleteError } = await supabase
      .from('naming_results')
      .delete()
      .eq('session_id', sessionId);
    if (deleteError) throw deleteError;

    const resultRows = batches.flatMap((batch) =>
      batch.names.map((n) => ({
        session_id: sessionId,
        brand_name: n.brandName,
        reasoning: n.reasoning || null,
        based_on: batch.basedOn,
        style_tag: n.rationale?.namingTechnique || null,
        score: n.rationale?.validityScore ?? 0,
      }))
    );

    if (resultRows.length > 0) {
      const { error: resultsError } = await supabase
        .from('naming_results')
        .insert(resultRows);
      if (resultsError) throw resultsError;
    }
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
  },
};
