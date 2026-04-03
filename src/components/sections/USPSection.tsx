import { useFormStore } from '../../store/useFormStore';
import { SectionHeader } from '../ui/SectionHeader';
import { TextArea } from '../ui/TextArea';

export function USPSection() {
  const usp = useFormStore((s) => s.analysis.usp);
  const updateAnalysis = useFormStore((s) => s.updateAnalysis);

  return (
    <section className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
      <SectionHeader title="USP (차별화 요소)" />
      <TextArea
        label="USP (차별화 요소)"
        value={usp}
        onChange={(v) => updateAnalysis('usp', v)}
        placeholder="다른 브랜드와 구별되는 핵심 차별점을 적어주세요 (예: '로컬 원두 직접 로스팅, 반려동물 동반 특화')"
        rows={2}
      />
    </section>
  );
}
