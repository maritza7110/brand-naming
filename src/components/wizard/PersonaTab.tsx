import { useFormStore } from '../../store/useFormStore';
import { PersonaIdentityGroup } from '../sections/persona/PersonaIdentityGroup';
import { PersonaStrategyGroup } from '../sections/persona/PersonaStrategyGroup';
import { PersonaMarketGroup } from '../sections/persona/PersonaMarketGroup';
import { PersonaBenefitsGroup } from '../sections/persona/PersonaBenefitsGroup';
import { PersonaExperienceGroup } from '../sections/persona/PersonaExperienceGroup';
import { KeywordWeightSlider } from '../ui/KeywordWeightSlider';
import { RecommendButton } from '../ui/RecommendButton';
import { useRecommend } from '../../hooks/useRecommend';

const PERSONA_LABELS: Record<string, string> = {
  philosophy: '브랜드철학',
  slogan: '슬로건',
  brandMent: '브랜드멘트',
  brandKeyword: '브랜드키워드',
  coreTechnology: '핵심기술',
  coreStrategy: '핵심전략',
  competitiveAdvantage: '비교우위',
  customerDefinition: '고객정의',
  customerValue: '고객가치',
  customerCultureCreation: '고객문화창조',
  qualityLevel: '품질수준',
  priceLevel: '가격수준',
  functionalBenefit: '기능적혜택',
  experientialBenefit: '경험적혜택',
  symbolicBenefit: '상징적혜택',
  membershipPhilosophy: '멤버쉽철학',
};

export function PersonaTab() {
  const persona = useFormStore((s) => s.persona);
  const keywordWeights = useFormStore((s) => s.keywordWeights);
  const setKeywordWeight = useFormStore((s) => s.setKeywordWeight);
  const { recommend, isLoading } = useRecommend();

  const keywords: { label: string; weight: number }[] = [];
  Object.entries(persona).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim() !== '') {
      const label = PERSONA_LABELS[key] ?? key;
      keywords.push({ label, weight: keywordWeights[label] ?? 3 });
    }
  });

  const hasInput = Object.values(persona).some(
    (v) => typeof v === 'string' && v.trim() !== '',
  );

  return (
    <div className="space-y-5">
      <div className="mb-4">
        <h3 className="text-[14px] font-semibold text-[var(--color-text-secondary)] mb-2">
          브랜드 성격을 정의해주세요
        </h3>
        <p className="text-[14px] text-[var(--color-text-muted)]">
          아래 5개 그룹은 브랜드의 내부 관점입니다. 분석 탭이 "시장이 어떻게 보이는가"라면, 여기서는 "우리가 무엇이 되고 싶은가"를 기록합니다.
        </p>
      </div>

      <div className="space-y-8">
        <PersonaIdentityGroup />
        <PersonaStrategyGroup />
        <PersonaMarketGroup />
        <PersonaBenefitsGroup />
        <PersonaExperienceGroup />
      </div>

      {keywords.length > 0 && (
        <div className="mt-8 rounded-2xl bg-[#363230] p-5 lg:p-7 border border-[var(--color-border)]">
          <KeywordWeightSlider keywords={keywords} onChange={setKeywordWeight} />
        </div>
      )}
      <div className="flex justify-end">
        <RecommendButton onClick={recommend} loading={isLoading} disabled={!hasInput} />
      </div>
    </div>
  );
}
