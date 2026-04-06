export interface TrademarkItem {
  title: string;
  status: string;
  applicant: string;
  applicationDate: string;
}

export interface TrademarkResult {
  totalCount: number;
  items: TrademarkItem[];
}

export async function searchTrademark(name: string, classCode?: string): Promise<TrademarkResult> {
  const params = new URLSearchParams({ name });
  if (classCode) params.set('classCode', classCode);
  const res = await fetch(`/api/trademark-search?${params}`);
  if (!res.ok) throw new Error('상표 검색 실패');
  return res.json();
}
