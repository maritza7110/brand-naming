import { useState } from 'react';
import { Sparkles, Pencil } from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';
import { PersonaIdentityGroup } from '../sections/persona/PersonaIdentityGroup';
import { PersonaStrategyGroup } from '../sections/persona/PersonaStrategyGroup';
import { PersonaMarketGroup } from '../sections/persona/PersonaMarketGroup';
import { PersonaBenefitsGroup } from '../sections/persona/PersonaBenefitsGroup';
import { PersonaExperienceGroup } from '../sections/persona/PersonaExperienceGroup';
import { KeywordWeightSlider } from '../ui/KeywordWeightSlider';
import { RecommendButton } from '../ui/RecommendButton';
import { useRecommend } from '../../hooks/useRecommend';
import { WorkshopBuilder } from './WorkshopBuilder';
import { SinglePersonaSummary } from '../ui/SinglePersonaSummary';

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
  const [workshopMode, setWorkshopMode] = useState(true);
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
      {/* Mode Toggle */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-[var(--color-text-secondary)] mb-2">
            브랜드 성격을 정의해주세요
          </h3>
          <p className="text-[14px] text-[var(--color-text-muted)]">
            아래 5개 그룹은 브랜드의 내부 관점입니다.
          </p>
        </div>
        <button
          onClick={() => setWorkshopMode(!workshopMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            workshopMode 
              ? 'bg-[var(--color-accent)] text-white' 
              : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
          }`}
        >
          {workshopMode ? (
            <>
              <Sparkles className="w-4 h-4" />
              심플 모드
            </>
          ) : (
            <>
              <Pencil className="w-4 h-4" />
              심층 기획
            </>
          )}
        </button>
      </div>

      {/* Conditional Render */}
      {workshopMode ? (
        <WorkshopBuilder />
      ) : (
        <>
          <SinglePersonaSummary persona={persona} />
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
        </>
      )}
    </div>
  );
}
