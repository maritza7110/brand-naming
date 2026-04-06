import { Target } from 'lucide-react';
import { useFormStore } from '../../../store/useFormStore';
import { SectionHeader } from '../../ui/SectionHeader';
import { TextField } from '../../ui/TextField';
import type { PersonaState } from '../../../types/form';

const FIELDS: { key: keyof PersonaState; label: string; ph: string }[] = [
  { key: 'coreTechnology', label: '핵심기술', ph: '예: 산지 직거래 로스팅, 매일 아침 소량 배전' },
  { key: 'coreStrategy', label: '핵심전략', ph: '예: 지역 주민과 함께 만드는 동네 사랑방 전략' },
  { key: 'competitiveAdvantage', label: '비교우위', ph: '예: 우리는 커피를 팔지 않고, 시간을 판다 — 대체 불가한 공간감' },
];

export function PersonaStrategyGroup() {
  const p = useFormStore((s) => s.persona);
  const u = useFormStore((s) => s.updatePersona);
  return (
    <section className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
      <SectionHeader title="전략 & 경쟁력" subtitle="2 / 5 · Strategy & Competitiveness" icon={Target} />
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-block px-2 py-0.5 rounded-full text-[14px] text-[#6B6560] bg-[#DDD7CF]">
          브랜드 내부 관점
        </span>
      </div>
      <p className="text-[14px] text-[#6B6560] mb-4">
        분석 탭이 시장을 본다면, 여기선 "우리 자신이 누구인지"를 정의합니다. 우리만의 기술·전략·우위를 내부 시각으로 적어주세요.
      </p>
      <div className="space-y-4">
        {FIELDS.map(({ key, label, ph }) => (
          <TextField key={key} label={label} value={p[key]} onChange={(v) => u(key, v)} placeholder={ph} />
        ))}
      </div>
    </section>
  );
}
