import { useCallback } from 'react';
import { useFormStore } from '../store/useFormStore';
import { useAuthStore } from '../store/useAuthStore';
import { generateBrandNames } from '../services/gemini';
import { sessionService } from '../services/sessionService';
import type { FormState } from '../types/form';

export function useRecommend() {
  const isLoading = useFormStore((s) => s.isLoading);
  const setLoading = useFormStore((s) => s.setLoading);
  const setError = useFormStore((s) => s.setError);
  const addBatch = useFormStore((s) => s.addBatch);

  const recommend = useCallback(async () => {
    const state = useFormStore.getState();
    const { storeBasic, brandVision, product, persona, analysis, identity, expression, keywordWeights } = state;
    const form: FormState = { storeBasic, brandVision, product, persona, analysis, identity, expression };

    setLoading(true);
    setError(null);
    try {
      const batch = await generateBrandNames(form, keywordWeights);
      addBatch(batch);

      // 로그인 상태면 자동 저장 (1회 추천 = 1개 프로젝트)
      const user = useAuthStore.getState().user;
      if (user) {
        const title = batch.names.map((n) => n.brandName).join(', ');
        await sessionService.createSession(user.id, title, form, [batch]).catch(console.error);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI 추천에 실패했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, addBatch]);

  return { recommend, isLoading };
}
