import { useCallback } from 'react';
import { useFormStore } from '../store/useFormStore';
import { generateBrandNames } from '../services/gemini';

export function useRecommend() {
  const isLoading = useFormStore((s) => s.isLoading);
  const setLoading = useFormStore((s) => s.setLoading);
  const setError = useFormStore((s) => s.setError);
  const addBatch = useFormStore((s) => s.addBatch);

  const recommend = useCallback(async () => {
    // 호출 시점에 최신 상태를 직접 가져옴 (셀렉터 재렌더 방지)
    const { storeBasic, brandVision, product, persona } = useFormStore.getState();
    const form = { storeBasic, brandVision, product, persona };

    setLoading(true);
    setError(null);
    try {
      const batch = await generateBrandNames(form);
      addBatch(batch);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI 추천에 실패했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, addBatch]);

  return { recommend, isLoading };
}
