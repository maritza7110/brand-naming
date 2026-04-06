import { Users } from 'lucide-react';
import { useFormStore } from '../../../store/useFormStore';
import { useRecommend } from '../../../hooks/useRecommend';
import { SectionHeader } from '../../ui/SectionHeader';
import { TextField } from '../../ui/TextField';
import { MiniRecommendButton } from '../../ui/MiniRecommendButton';
import type { PersonaState } from '../../../types/form';

const FIELDS: { key: keyof PersonaState; label: string; ph: string }[] = [
  { key: 'customerDefinition', label: '고객정의', ph: '20~40대, 품질 좋은 커피를 원하는 고객' },
  { key: 'customerValue', label: '고객가치', ph: '일상 속 여유로운 커피 한 잔' },
  { key: 'customerCultureCreation', label: '고객문화창조', ph: '동네 사랑방 같은 커피 문화' },
];

export function PersonaMarketGroup() {
  const p = useFormStore((s) => s.persona);
  const u = useFormStore((s) => s.updatePersona);
  const { recommend, isLoading } = useRecommend();
  return (
    <section className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
      <SectionHeader title="고객 & 시장" subtitle="3 / 5 · Market & Customer" icon={Users} />
      <div className="space-y-4">
        {FIELDS.map(({ key, label, ph }) => (
          <TextField key={key} label={label} value={p[key]} onChange={(v) => u(key, v)} placeholder={ph}
            labelAction={<MiniRecommendButton onClick={recommend} loading={isLoading} disabled={!p[key].trim()} />} />
        ))}
      </div>
    </section>
  );
}
