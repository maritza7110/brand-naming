import { useFormStore } from '../../store/useFormStore';
import { BrandVisionSection } from '../sections/BrandVisionSection';
import { BrandPersonalitySection } from '../sections/BrandPersonalitySection';
import { KeywordWeightSlider } from '../ui/KeywordWeightSlider';
import { RecommendButton } from '../ui/RecommendButton';
import { useRecommend } from '../../hooks/useRecommend';

const BRAND_VISION_LABELS: Record<string, string> = {
  ceoVision: 'CEO비전',
  longTermGoal: '장기목표',
  personalStory: '개인스토리',
};

export function IdentityTab() {
  const brandVision = useFormStore((s) => s.brandVision);
  const identity = useFormStore((s) => s.identity);
  const keywordWeights = useFormStore((s) => s.keywordWeights);
  const setKeywordWeight = useFormStore((s) => s.setKeywordWeight);
  const { recommend, isLoading } = useRecommend();

  // 입력된 키워드 목록 추출
  const keywords: { label: string; weight: number }[] = [];

  Object.entries(brandVision).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim() !== '') {
      const label = BRAND_VISION_LABELS[key] ?? key;
      keywords.push({ label, weight: keywordWeights[label] ?? 3 });
    }
  });

  if (identity.brandPersonality.length > 0) {
    keywords.push({ label: '브랜드퍼스널리티', weight: keywordWeights['브랜드퍼스널리티'] ?? 3 });
  }

  const hasInput =
    Object.values(brandVision).some((v) => v.trim() !== '') ||
    identity.brandPersonality.length > 0;

  return (
    <div className="space-y-5">
      <BrandVisionSection />
      <BrandPersonalitySection />
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
