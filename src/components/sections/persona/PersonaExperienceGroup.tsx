import { HeartHandshake } from 'lucide-react';
import { useFormStore } from '../../../store/useFormStore';
import { SectionHeader } from '../../ui/SectionHeader';
import { TextArea } from '../../ui/TextArea';

export function PersonaExperienceGroup() {
  const p = useFormStore((s) => s.persona);
  const u = useFormStore((s) => s.updatePersona);
  return (
    <section className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
      <SectionHeader title="고객 경험" subtitle="5 / 5 · Experience & Management" icon={HeartHandshake} />
      <div className="space-y-4">
        <TextArea
          label="멤버쉽 철학"
          value={p.membershipPhilosophy}
          onChange={(v) => u('membershipPhilosophy', v)}
          placeholder="단골에게 특별한 경험과 감사"
          rows={3}
        />
      </div>
    </section>
  );
}
