import { useFormStore } from '../../store/useFormStore';
import { useRecommend } from '../../hooks/useRecommend';
import { SectionHeader } from '../ui/SectionHeader';
import { RecommendButton } from '../ui/RecommendButton';
import { MiniRecommendButton } from '../ui/MiniRecommendButton';

const fields = [
  { key: 'ceoVision' as const, label: 'CEO 비전/꿈', ph: '동네에서 가장 사랑받는 카페를 만들고 싶습니다' },
  { key: 'longTermGoal' as const, label: '5년/10년 목표', ph: '3년 내 2호점, 자체 원두 로스팅 브랜드 런칭' },
  { key: 'personalStory' as const, label: '개인 스토리', ph: '10년간 바리스타로 일하며 나만의 카페를 꿈꿨습니다' },
];

export function BrandVisionSection() {
  const bv = useFormStore((s) => s.brandVision);
  const u = useFormStore((s) => s.updateBrandVision);
  const { recommend, isLoading } = useRecommend();
  const hasInput = Object.values(bv).some((v) => v.trim() !== '');

  return (
    <section className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
      <SectionHeader title="브랜드 비전" />
      <div className="space-y-4">
        {fields.map(({ key, label, ph }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[12px] font-semibold text-[#5A5550]">{label}</label>
              <MiniRecommendButton onClick={recommend} loading={isLoading} disabled={!bv[key].trim()} />
            </div>
            <textarea value={bv[key]} onChange={(e) => u(key, e.target.value)} placeholder={ph} rows={2}
              className="w-full px-4 py-3 rounded-xl bg-[#F5F3F0] text-[14px] text-[#2C2825] leading-relaxed placeholder:text-[#B5AFA8] border border-[#C5BFB7] resize-none transition-all duration-200 hover:border-[#A09890] focus:border-[#B48C50] focus:bg-white focus:outline-none" />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end">
        <RecommendButton onClick={recommend} loading={isLoading} disabled={!hasInput} />
      </div>
    </section>
  );
}
