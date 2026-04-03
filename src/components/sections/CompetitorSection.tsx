import { useFormStore } from '../../store/useFormStore';
import { SectionHeader } from '../ui/SectionHeader';
import { TextArea } from '../ui/TextArea';

export function CompetitorSection() {
  const competitors = useFormStore((s) => s.analysis.competitors);
  const updateAnalysis = useFormStore((s) => s.updateAnalysis);

  return (
    <section className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
      <SectionHeader title="경쟁사 분석" />
      <TextArea
        label="경쟁사 분석"
        value={competitors}
        onChange={(v) => updateAnalysis('competitors', v)}
        placeholder="주요 경쟁 브랜드명과 그 특징을 적어주세요 (예: '스타벅스 - 프리미엄 이미지, 이디야 - 가성비')"
        rows={3}
      />
    </section>
  );
}
