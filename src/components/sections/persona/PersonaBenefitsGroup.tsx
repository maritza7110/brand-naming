import { Gift } from 'lucide-react';
import { useFormStore } from '../../../store/useFormStore';
import { useRecommend } from '../../../hooks/useRecommend';
import { SectionHeader } from '../../ui/SectionHeader';
import { TextField } from '../../ui/TextField';
import { MiniRecommendButton } from '../../ui/MiniRecommendButton';
import type { PersonaState } from '../../../types/form';

const FIELDS: { key: keyof PersonaState; label: string; ph: string }[] = [
  { key: 'qualityLevel', label: '품질수준', ph: '스페셜티 등급 원두' },
  { key: 'priceLevel', label: '가격수준', ph: '아메리카노 3,500원' },
  { key: 'functionalBenefit', label: '기능적혜택', ph: '출근길 빠른 픽업' },
  { key: 'experientialBenefit', label: '경험적혜택', ph: '아늑한 공간, 바리스타와의 대화' },
  { key: 'symbolicBenefit', label: '상징적혜택', ph: '감각적 라이프스타일' },
];

export function PersonaBenefitsGroup() {
  const p = useFormStore((s) => s.persona);
  const u = useFormStore((s) => s.updatePersona);
  const { recommend, isLoading } = useRecommend();
  return (
    <section className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
      <SectionHeader title="혜택 & 가치" subtitle="4 / 5 · Benefits & Value" icon={Gift} />
      <div className="space-y-4">
        {FIELDS.map(({ key, label, ph }) => (
          <TextField key={key} label={label} value={p[key]} onChange={(v) => u(key, v)} placeholder={ph}
            labelAction={<MiniRecommendButton onClick={recommend} loading={isLoading} disabled={!p[key].trim()} />} />
        ))}
      </div>
    </section>
  );
}
