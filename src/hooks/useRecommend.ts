import { useCallback } from 'react';
import { useFormStore } from '../store/useFormStore';
import { useAuthStore } from '../store/useAuthStore';
import { generateBrandNames } from '../services/gemini';
import { sessionService } from '../services/sessionService';
import type { FormState } from '../types/form';

// ─── 재시도 헬퍼 ─────────────────────────────────────────────────────────────
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1_000; // 1초 대기 후 재시도

function isRetryableError(err: unknown): boolean {
  if (err instanceof DOMException && err.name === 'TimeoutError') return true;
  if (err instanceof DOMException && err.name === 'AbortError') return true;
  if (err instanceof TypeError) return true; // 네트워크 오류
  return false;
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES && isRetryableError(err)) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

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
      const batch = await withRetry(() => generateBrandNames(form, keywordWeights));
      addBatch(batch);

      // 로그인 상태면 자동 저장 (createOrUpdate — 같은 위저드 세션은 누적)
      const user = useAuthStore.getState().user;
      if (user) {
        const latestState = useFormStore.getState();
        const existingId = latestState.currentSessionId;

        if (existingId) {
          // 기존 세션 업데이트 — 누적된 전체 배치 전달
          sessionService.updateSession(existingId, form, latestState.batches).catch(console.error);
        } else {
          // 최초 세션 생성
          const title = batch.names.map((n) => n.brandName).join(', ');
          sessionService.createSession(user.id, title, form, latestState.batches)
            .then((id) => useFormStore.getState().setCurrentSessionId(id))
            .catch(console.error);
        }
      }
    } catch (err) {
      let message: string;
      if (err instanceof DOMException && (err.name === 'TimeoutError' || err.name === 'AbortError')) {
        message = 'AI 응답 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요.';
      } else if (err instanceof TypeError) {
        message = '네트워크 연결을 확인해 주세요.';
      } else {
        message = err instanceof Error ? err.message : 'AI 추천에 실패했습니다.';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, addBatch]);

  return { recommend, isLoading };
}
