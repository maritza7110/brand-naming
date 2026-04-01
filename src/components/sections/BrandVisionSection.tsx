import { useFormStore } from '../../store/useFormStore';
import { SectionHeader } from '../ui/SectionHeader';
import { TextArea } from '../ui/TextArea';
import { RecommendButton } from '../ui/RecommendButton';

export function BrandVisionSection() {
  const brandVision = useFormStore((s) => s.brandVision);
  const updateBrandVision = useFormStore((s) => s.updateBrandVision);

  const hasInput = Object.values(brandVision).some((v) => v.trim() !== '');

  return (
    <section className="py-12">
      <SectionHeader title="브랜드 정체성 및 비전" />

      <div className="mt-6 space-y-6">
        <TextArea
          label="CEO 비전/꿈"
          value={brandVision.ceoVision}
          onChange={(v) => updateBrandVision('ceoVision', v)}
          placeholder="예: 동네에서 가장 사랑받는 카페를 만들고 싶습니다"
          rows={4}
        />
        <TextArea
          label="5년/10년 목표"
          value={brandVision.longTermGoal}
          onChange={(v) => updateBrandVision('longTermGoal', v)}
          placeholder="예: 3년 내 2호점, 자체 원두 로스팅 브랜드 런칭"
          rows={4}
        />
        <TextArea
          label="개인 스토리/동기"
          value={brandVision.personalStory}
          onChange={(v) => updateBrandVision('personalStory', v)}
          placeholder="예: 10년간 바리스타로 일하며 나만의 카페를 꿈꿨습니다"
          rows={4}
        />
      </div>

      <div className="mt-8">
        <RecommendButton disabled={!hasInput} />
      </div>
    </section>
  );
}
