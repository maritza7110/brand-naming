import { useFormStore } from '../../store/useFormStore';
import { SectionHeader } from '../ui/SectionHeader';
import { ChipSelector } from '../ui/ChipSelector';

const PERSONALITY_OPTIONS = [
  '진정성 있는',
  '혁신적인',
  '따뜻한',
  '세련된',
  '대담한',
  '친근한',
  '신뢰감 있는',
  '유쾌한',
  '고급스러운',
  '자연친화적',
];

export function BrandPersonalitySection() {
  const brandPersonality = useFormStore((s) => s.identity.brandPersonality);
  const updateIdentityChips = useFormStore((s) => s.updateIdentityChips);

  return (
    <section className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
      <SectionHeader title="브랜드 퍼스널리티" />
      <ChipSelector
        label="브랜드 퍼스널리티"
        options={PERSONALITY_OPTIONS}
        selected={brandPersonality}
        onChange={(v) => updateIdentityChips('brandPersonality', v)}
        maxSelection={3}
        hint="최대 3개 선택"
      />
    </section>
  );
}
