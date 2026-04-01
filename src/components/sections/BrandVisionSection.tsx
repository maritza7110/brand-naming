import { useFormStore } from '../../store/useFormStore';
import { useRecommend } from '../../hooks/useRecommend';
import { SectionHeader } from '../ui/SectionHeader';
import { TextArea } from '../ui/TextArea';
import { RecommendButton } from '../ui/RecommendButton';

export function BrandVisionSection() {
  const brandVision = useFormStore((s) => s.brandVision);
  const updateBrandVision = useFormStore((s) => s.updateBrandVision);
  const { recommend, isLoading } = useRecommend();

  const hasInput = Object.values(brandVision).some((v) => v.trim() !== '');

  return (
    <section className="rounded-xl border border-gray-200/60 bg-white p-6 shadow-sm">
      <SectionHeader title="브랜드 비전" />

      <div className="space-y-4">
        <TextArea
          label="CEO 비전/꿈"
          value={brandVision.ceoVision}
          onChange={(v) => updateBrandVision('ceoVision', v)}
          placeholder="동네에서 가장 사랑받는 카페를 만들고 싶습니다"
          rows={2}
        />
        <TextArea
          label="5년/10년 목표"
          value={brandVision.longTermGoal}
          onChange={(v) => updateBrandVision('longTermGoal', v)}
          placeholder="3년 내 2호점, 자체 원두 로스팅 브랜드 런칭"
          rows={2}
        />
        <TextArea
          label="개인 스토리"
          value={brandVision.personalStory}
          onChange={(v) => updateBrandVision('personalStory', v)}
          placeholder="10년간 바리스타로 일하며 나만의 카페를 꿈꿨습니다"
          rows={2}
        />
      </div>

      <div className="mt-5 flex justify-end">
        <RecommendButton onClick={recommend} loading={isLoading} disabled={!hasInput} />
      </div>
    </section>
  );
}
