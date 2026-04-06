import { useFormStore } from '../../store/useFormStore';
import { SectionHeader } from '../ui/SectionHeader';
import { TextArea } from '../ui/TextArea';

export function USPSection() {
  const usp = useFormStore((s) => s.analysis.usp);
  const updateAnalysis = useFormStore((s) => s.updateAnalysis);

  return (
    <section className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
      <SectionHeader title="USP (차별화 요소)" />
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-block px-2 py-0.5 rounded-full text-[14px] text-[#6B6560] bg-[#DDD7CF]">
          시장 현황 관점
        </span>
      </div>
      <p className="text-[14px] text-[#6B6560] mb-4">
        지금 시장에서 경쟁사 대비 눈에 띄는 차별점은 무엇인가요?
      </p>
      <TextArea
        label="USP (차별화 요소)"
        value={usp}
        onChange={(v) => updateAnalysis('usp', v)}
        placeholder="예: 동네 단 하나뿐인 스페셜티 로스터리, 30분 내 픽업"
        rows={2}
      />
    </section>
  );
}
