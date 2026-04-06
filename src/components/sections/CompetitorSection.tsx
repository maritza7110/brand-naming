import { useFormStore } from '../../store/useFormStore';
import { useRecommend } from '../../hooks/useRecommend';
import { SectionHeader } from '../ui/SectionHeader';
import { TextArea } from '../ui/TextArea';
import { MiniRecommendButton } from '../ui/MiniRecommendButton';

export function CompetitorSection() {
  const competitors = useFormStore((s) => s.analysis.competitors);
  const updateAnalysis = useFormStore((s) => s.updateAnalysis);
  const { recommend, isLoading } = useRecommend();

  return (
    <section className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
      <SectionHeader title="경쟁사 분석" />
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-block px-2 py-0.5 rounded-full text-[14px] text-[#6B6560] bg-[#DDD7CF]">
          시장 현황 관점
        </span>
      </div>
      <p className="text-[14px] text-[#6B6560] mb-4">
        경쟁사가 누구이고, 시장에서 어떤 포지션을 점유하고 있는지 적어주세요. 외부에서 바라본 사실 위주로.
      </p>
      <TextArea
        label="경쟁사 분석"
        value={competitors}
        onChange={(v) => updateAnalysis('competitors', v)}
        placeholder="예: 스타벅스, 블루보틀 — 프리미엄 원두와 공간 경험으로 선점"
        rows={3}
        labelAction={<MiniRecommendButton onClick={recommend} loading={isLoading} disabled={!competitors.trim()} />}
      />
    </section>
  );
}
