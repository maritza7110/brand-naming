import { useFormStore } from '../../store/useFormStore';
import { useRecommend } from '../../hooks/useRecommend';
import { SectionHeader } from '../ui/SectionHeader';
import { RecommendButton } from '../ui/RecommendButton';
import { MiniRecommendButton } from '../ui/MiniRecommendButton';

export function BrandVisionSection() {
  const brandVision = useFormStore((s) => s.brandVision);
  const updateBrandVision = useFormStore((s) => s.updateBrandVision);
  const { recommend, isLoading } = useRecommend();

  const hasInput = Object.values(brandVision).some((v) => v.trim() !== '');

  const fields = [
    { key: 'ceoVision' as const, label: 'CEO 비전/꿈', placeholder: '동네에서 가장 사랑받는 카페를 만들고 싶습니다' },
    { key: 'longTermGoal' as const, label: '5년/10년 목표', placeholder: '3년 내 2호점, 자체 원두 로스팅 브랜드 런칭' },
    { key: 'personalStory' as const, label: '개인 스토리', placeholder: '10년간 바리스타로 일하며 나만의 카페를 꿈꿨습니다' },
  ];

  return (
    <section className="rounded-xl bg-[#161616] p-6 border border-[#1F1F1F]">
      <SectionHeader title="브랜드 비전" icon="🎯" />

      <div className="space-y-4">
        {fields.map(({ key, label, placeholder }) => (
          <div key={key}>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[12px] font-medium text-[#505050]">{label}</label>
              <MiniRecommendButton onClick={recommend} loading={isLoading} disabled={!brandVision[key].trim()} />
            </div>
            <textarea
              value={brandVision[key]}
              onChange={(e) => updateBrandVision(key, e.target.value)}
              placeholder={placeholder}
              rows={2}
              className="w-full px-4 py-3 rounded-lg bg-[#111] text-[14px] text-[#ccc] leading-relaxed placeholder:text-[#333] border border-[#222] resize-none transition-all duration-200 hover:border-[#333] focus:border-[#D4A853]/40 focus:bg-[#0F0F0F] focus:outline-none"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <RecommendButton onClick={recommend} loading={isLoading} disabled={!hasInput} />
      </div>
    </section>
  );
}
