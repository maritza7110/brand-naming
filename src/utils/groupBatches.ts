import type { RecommendBatch, IndustrySelection } from '../types/form';

export interface BatchGroup {
  key: string;
  label: string;
  batches: RecommendBatch[];
}

/** 업종 선택에서 그룹 키를 추출 (소분류 > 중분류 > 대분류 > '미분류') */
export function getGroupKey(industry?: IndustrySelection): string {
  if (!industry) return '미분류';
  return industry.minor || industry.medium || industry.major || '미분류';
}

/** 배치 목록을 업종별 그룹으로 변환 (등장 순서 유지) */
export function groupBatches(batches: RecommendBatch[]): BatchGroup[] {
  const map = new Map<string, RecommendBatch[]>();
  const order: string[] = [];

  for (const batch of batches) {
    const key = getGroupKey(batch.industry);
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(batch);
  }

  return order.map((key) => ({
    key,
    label: key,
    batches: map.get(key)!,
  }));
}

/** resetTimestamp 기준으로 current/archived 분리 */
export function splitByReset(
  batches: RecommendBatch[],
  resetTimestamp: Date | null,
): { current: RecommendBatch[]; archived: RecommendBatch[] } {
  if (!resetTimestamp) return { current: batches, archived: [] };
  const current: RecommendBatch[] = [];
  const archived: RecommendBatch[] = [];
  for (const b of batches) {
    if (b.createdAt >= resetTimestamp) {
      current.push(b);
    } else {
      archived.push(b);
    }
  }
  return { current, archived };
}
