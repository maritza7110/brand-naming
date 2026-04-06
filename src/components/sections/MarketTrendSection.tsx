import { useFormStore } from '../../store/useFormStore';
import { useRecommend } from '../../hooks/useRecommend';
import { SectionHeader } from '../ui/SectionHeader';
import { TextArea } from '../ui/TextArea';
import { MiniRecommendButton } from '../ui/MiniRecommendButton';

export function MarketTrendSection() {
  const marketTrend = useFormStore((s) => s.identity.marketTrend);
  const updateIdentityText = useFormStore((s) => s.updateIdentityText);
  const { recommend, isLoading } = useRecommend();

  return (
    <section className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
      <SectionHeader title="시장 트렌드" />
      <TextArea
        label="시장 트렌드"
        value={marketTrend}
        onChange={(v) => updateIdentityText('marketTrend', v)}
        placeholder="현재 업계의 주요 흐름이나 소비자 트렌드를 적어주세요 (예: '건강 지향, 비건, 제로슈거 열풍')"
        rows={2}
        labelAction={<MiniRecommendButton onClick={recommend} loading={isLoading} disabled={!marketTrend.trim()} />}
      />
    </section>
  );
}
