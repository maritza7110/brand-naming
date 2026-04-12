import { useState, useEffect } from 'react';
import { useFormStore } from '../../store/useFormStore';
import { useRecommend } from '../../hooks/useRecommend';
import { SectionHeader } from '../ui/SectionHeader';
import { TextArea } from '../ui/TextArea';
import { MiniRecommendButton } from '../ui/MiniRecommendButton';
import { getIndustryPlaceholder } from '../../services/industryPlaceholder';

const DEFAULT_PLACEHOLDER = '현재 업계의 주요 흐름이나 소비자 트렌드를 적어주세요';

export function MarketTrendSection() {
  const marketTrend = useFormStore((s) => s.identity.marketTrend);
  const updateIdentityText = useFormStore((s) => s.updateIdentityText);
  const { recommend, isLoading } = useRecommend();
  const storeBasic = useFormStore((s) => s.storeBasic);

  const [placeholder, setPlaceholder] = useState(DEFAULT_PLACEHOLDER);

  useEffect(() => {
    let cancelled = false;
    getIndustryPlaceholder('marketTrend', storeBasic.industry).then((ph) => {
      if (!cancelled) setPlaceholder(ph || DEFAULT_PLACEHOLDER);
    });
    return () => { cancelled = true; };
  }, [storeBasic.industry]);

  return (
    <section className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
      <SectionHeader title="시장 트렌드" />
      <TextArea
        label="시장 트렌드"
        value={marketTrend}
        onChange={(v) => updateIdentityText('marketTrend', v)}
        placeholder={placeholder}
        rows={2}
        labelAction={<MiniRecommendButton onClick={recommend} loading={isLoading} disabled={!marketTrend.trim()} />}
      />
    </section>
  );
}
