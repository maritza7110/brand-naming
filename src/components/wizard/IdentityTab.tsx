import { useFormStore } from '../../store/useFormStore';
import { BrandVisionSection } from '../sections/BrandVisionSection';
import { PersonaSection } from '../sections/PersonaSection';
import { MarketTrendSection } from '../sections/MarketTrendSection';
import { BrandPersonalitySection } from '../sections/BrandPersonalitySection';
import { KeywordWeightSlider } from '../ui/KeywordWeightSlider';
import { RecommendButton } from '../ui/RecommendButton';
import { useRecommend } from '../../hooks/useRecommend';

const BRAND_VISION_LABELS: Record<string, string> = {
  ceoVision: 'CEO비전',
  longTermGoal: '장기목표',
  personalStory: '개인스토리',
};

const PERSONA_LABELS: Record<string, string> = {
  philosophy: '브랜드철학',
  slogan: '슬로건',
  coreTechnology: '핵심기술',
  coreStrategy: '핵심전략',
  brandMent: '브랜드멘트',
  customerDefinition: '고객정의',
  customerValue: '고객가치',
  customerCultureCreation: '고객문화창조',
  competitiveAdvantage: '비교우위',
  qualityLevel: '품질수준',
  priceLevel: '가격수준',
  functionalBenefit: '기능적혜택',
  experientialBenefit: '경험적혜택',
  symbolicBenefit: '상징적혜택',
  brandKeyword: '브랜드키워드',
  membershipPhilosophy: '멤버쉽철학',
};

export function IdentityTab() {
  const brandVision = useFormStore((s) => s.brandVision);
  const persona = useFormStore((s) => s.persona);
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

  Object.entries(persona).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim() !== '') {
      const label = PERSONA_LABELS[key] ?? key;
      keywords.push({ label, weight: keywordWeights[label] ?? 3 });
    }
  });

  if (identity.marketTrend.trim() !== '') {
    keywords.push({ label: '시장트렌드', weight: keywordWeights['시장트렌드'] ?? 3 });
  }

  if (identity.brandPersonality.length > 0) {
    keywords.push({ label: '브랜드퍼스널리티', weight: keywordWeights['브랜드퍼스널리티'] ?? 3 });
  }

  const hasInput =
    Object.values(brandVision).some((v) => v.trim() !== '') ||
    Object.values(persona).some((v) => v.trim() !== '') ||
    identity.marketTrend.trim() !== '' ||
    identity.brandPersonality.length > 0;

  return (
    <div className="space-y-5">
      <BrandVisionSection />
      <PersonaSection />
      <MarketTrendSection />
      <BrandPersonalitySection />
      {keywords.length > 0 && (
        <div className="rounded-2xl bg-[#363230] p-5 lg:p-7 border border-[#4A4440]">
          <KeywordWeightSlider keywords={keywords} onChange={setKeywordWeight} />
        </div>
      )}
      <div className="flex justify-end">
        <RecommendButton onClick={recommend} loading={isLoading} disabled={!hasInput} />
      </div>
    </div>
  );
}
