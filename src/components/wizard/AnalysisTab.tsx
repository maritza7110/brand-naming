import { useFormStore } from '../../store/useFormStore';
import { StoreBasicSection } from '../sections/StoreBasicSection';
import { CompetitorSection } from '../sections/CompetitorSection';
import { USPSection } from '../sections/USPSection';
import { MarketTrendSection } from '../sections/MarketTrendSection';
import { KeywordWeightSlider } from '../ui/KeywordWeightSlider';
import { RecommendButton } from '../ui/RecommendButton';
import { useRecommend } from '../../hooks/useRecommend';

const ANALYSIS_LABELS: Record<string, string> = {
  competitors: '경쟁사',
  usp: 'USP',
};

const STORE_BASIC_LABELS: Record<string, string> = {
  location: '위치',
  scale: '매장규모',
  mainProduct: '주력상품',
  priceRange: '가격대',
  targetCustomer: '타겟고객',
};

export function AnalysisTab() {
  const storeBasic = useFormStore((s) => s.storeBasic);
  const analysis = useFormStore((s) => s.analysis);
  const identity = useFormStore((s) => s.identity);
  const keywordWeights = useFormStore((s) => s.keywordWeights);
  const setKeywordWeight = useFormStore((s) => s.setKeywordWeight);
  const { recommend, isLoading } = useRecommend();

  // 입력된 키워드 목록 추출
  const keywords: { label: string; weight: number }[] = [];

  if (storeBasic.industry.major) {
    const label = '업종';
    keywords.push({ label, weight: keywordWeights[label] ?? 3 });
  }

  Object.entries(storeBasic).forEach(([key, value]) => {
    if (key === 'industry') return;
    if (typeof value === 'string' && value.trim() !== '') {
      const label = STORE_BASIC_LABELS[key] ?? key;
      keywords.push({ label, weight: keywordWeights[label] ?? 3 });
    }
  });

  if (analysis.competitors.trim() !== '') {
    const label = ANALYSIS_LABELS.competitors;
    keywords.push({ label, weight: keywordWeights[label] ?? 3 });
  }
  if (analysis.usp.trim() !== '') {
    const label = ANALYSIS_LABELS.usp;
    keywords.push({ label, weight: keywordWeights[label] ?? 3 });
  }
  if (identity.marketTrend.trim() !== '') {
    keywords.push({ label: '시장트렌드', weight: keywordWeights['시장트렌드'] ?? 3 });
  }

  const hasInput =
    storeBasic.industry.major !== '' ||
    Object.entries(storeBasic)
      .filter(([k]) => k !== 'industry')
      .some(([, v]) => typeof v === 'string' && v.trim() !== '') ||
    analysis.competitors.trim() !== '' ||
    analysis.usp.trim() !== '' ||
    identity.marketTrend.trim() !== '';

  return (
    <div className="space-y-5">
      <StoreBasicSection />
      <CompetitorSection />
      <USPSection />
      <MarketTrendSection />
      {keywords.length > 0 && (
        <div className="rounded-2xl bg-[#363230] p-5 lg:p-7 border border-[var(--color-border)]">
          <KeywordWeightSlider keywords={keywords} onChange={setKeywordWeight} />
        </div>
      )}
      <div className="flex justify-end">
        <RecommendButton onClick={recommend} loading={isLoading} disabled={!hasInput} />
      </div>
    </div>
  );
}
