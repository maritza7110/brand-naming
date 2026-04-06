import { Sparkles } from 'lucide-react';
import { useFormStore } from '../../../store/useFormStore';
import { useRecommend } from '../../../hooks/useRecommend';
import { SectionHeader } from '../../ui/SectionHeader';
import { TextField } from '../../ui/TextField';
import { MiniRecommendButton } from '../../ui/MiniRecommendButton';
import type { PersonaState } from '../../../types/form';

const FIELDS: { key: keyof PersonaState; label: string; ph: string }[] = [
  { key: 'philosophy', label: '브랜드철학', ph: '좋은 원두, 정직한 한 잔' },
  { key: 'slogan', label: '슬로건', ph: '하루의 시작, 당신만의 한 잔' },
  { key: 'brandMent', label: '브랜드 멘트', ph: '커피 한 잔에 담긴 진심' },
  { key: 'brandKeyword', label: '키워드', ph: '정직, 따뜻함, 장인정신' },
];

export function PersonaIdentityGroup() {
  const p = useFormStore((s) => s.persona);
  const u = useFormStore((s) => s.updatePersona);
  const { recommend, isLoading } = useRecommend();
  return (
    <section className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
      <SectionHeader title="브랜드 정체성" subtitle="1 / 5 · Identity & Visual" icon={Sparkles} />
      <div className="space-y-4">
        {FIELDS.map(({ key, label, ph }) => (
          <TextField key={key} label={label} value={p[key]} onChange={(v) => u(key, v)} placeholder={ph}
            labelAction={<MiniRecommendButton onClick={recommend} loading={isLoading} disabled={!p[key].trim()} />} />
        ))}
      </div>
    </section>
  );
}
