import type { RecommendBatch, IndustrySelection } from '../types/form';

export interface BatchGroup {
  key: string;
  label: string;
  batches: RecommendBatch[];
}

/** 업종 선택에서 그룹 키를 추출. 업종 없으면 null 반환 */
export function getGroupKey(industry?: IndustrySelection): string | null {
  if (!industry) return null;
  return industry.minor || industry.medium || industry.major || null;
}

/** 날짜 키 생성 (같은 날 배치를 하나로 묶기 위함) */
function toDateKey(date: Date): string {
  return `_date_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

/** 날짜를 "N월 D일" 포맷으로 변환 */
export function formatDateLabel(date: Date): string {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

/** 배치 목록을 업종별 그룹으로 변환 (등장 순서 유지). 업종 없는 배치는 같은 날짜끼리 묶음 */
export function groupBatches(batches: RecommendBatch[]): BatchGroup[] {
  const map = new Map<string, RecommendBatch[]>();
  const order: string[] = [];
  const labelMap = new Map<string, string>();

  for (const batch of batches) {
    const industryKey = getGroupKey(batch.industry);

    if (industryKey) {
      if (!map.has(industryKey)) {
        map.set(industryKey, []);
        order.push(industryKey);
        labelMap.set(industryKey, industryKey);
      }
      map.get(industryKey)!.push(batch);
    } else {
      // 업종 없는 배치 → 같은 날짜끼리 하나의 그룹
      const dateKey = toDateKey(batch.createdAt);
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
        order.push(dateKey);
        labelMap.set(dateKey, formatDateLabel(batch.createdAt));
      }
      map.get(dateKey)!.push(batch);
    }
  }

  return order.map((key) => ({
    key,
    label: labelMap.get(key) ?? key,
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
