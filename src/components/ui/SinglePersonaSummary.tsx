/**
 * SinglePersonaSummary Component
 * 심층 기획에서 완성한 페르소나를 대표 항목 하나만 선정하여 보여줌
 */
import { Star } from 'lucide-react';
import { useFormStore } from '../../store/useFormStore';
import type { PersonaState } from '../../types/form';

const PERSONA_LABELS: Record<keyof PersonaState, string> = {
  philosophy: '브랜드 철학',
  slogan: '슬로건',
  brandMent: '브랜드 멘트',
  brandKeyword: '키워드',
  coreTechnology: '핵심 기술',
  coreStrategy: '핵심 전략',
  competitiveAdvantage: '비교 우위',
  customerDefinition: '고객 정의',
  customerValue: '고객 가치',
  customerCultureCreation: '고객 문화',
  qualityLevel: '품질 수준',
  priceLevel: '가격 수준',
  functionalBenefit: '기능적 혜택',
  experientialBenefit: '경험적 혜택',
  symbolicBenefit: '상징적 혜택',
  membershipPhilosophy: '고객 관리',
};

/** 우선순위 필드 (가장 대표성 높은 것부터) */
const PRIORITY_FIELDS: (keyof PersonaState)[] = [
  'philosophy',
  'slogan',
  'coreTechnology',
  'customerDefinition',
  'functionalBenefit',
];

export function SinglePersonaSummary() {
  const persona = useFormStore((s) => s.persona);
  const builderState = useFormStore((s) => s.builderState);

  // Find the most representative completed field
  // Priority: finalized field with draft > field with most content
  let selectedField: keyof PersonaState | null = null;
  let selectedValue = '';

  for (const key of PRIORITY_FIELDS) {
    const field = builderState[key];
    if (field?.isFinalized && field.draft?.trim()) {
      selectedField = key;
      selectedValue = field.draft;
      break;
    }
  }

  // Fallback: find field with most content from persona
  if (!selectedField) {
    let maxLength = 0;
    for (const [key, value] of Object.entries(persona)) {
      if (typeof value === 'string' && value.length > maxLength) {
        maxLength = value.length;
        selectedField = key as keyof PersonaState;
        selectedValue = value;
      }
    }
  }

  if (!selectedField || !selectedValue.trim()) {
    return null;
  }

  const label = PERSONA_LABELS[selectedField] ?? selectedField;

  return (
    <div className="rounded-2xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 p-5 mb-6">
      <div className="flex items-start gap-3">
        <Star className="w-5 h-5 text-[var(--color-accent)] mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs font-medium text-[var(--color-accent)] mb-1">{label}</p>
          <p className="text-[14px] text-[var(--color-text-primary)] leading-relaxed">
            {selectedValue}
          </p>
        </div>
      </div>
    </div>
  );
}
