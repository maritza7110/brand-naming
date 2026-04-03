import { useFormStore } from '../../store/useFormStore';
import { useRecommend } from '../../hooks/useRecommend';
import { SectionHeader } from '../ui/SectionHeader';
import { MiniRecommendButton } from '../ui/MiniRecommendButton';
import { TextField } from '../ui/TextField';

const fields = [
  { key: 'ceoVision' as const, label: 'CEO 비전/꿈', ph: '동네에서 가장 사랑받는 카페를 만들고 싶습니다' },
  { key: 'longTermGoal' as const, label: '5년/10년 목표', ph: '3년 내 2호점, 자체 원두 로스팅 브랜드 런칭' },
  { key: 'personalStory' as const, label: '개인 스토리', ph: '10년간 바리스타로 일하며 나만의 카페를 꿈꿨습니다' },
];

export function BrandVisionSection() {
  const bv = useFormStore((s) => s.brandVision);
  const u = useFormStore((s) => s.updateBrandVision);
  const { recommend, isLoading } = useRecommend();

  return (
    <section className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
      <SectionHeader title="브랜드 비전" />
      <div className="space-y-4">
        {fields.map(({ key, label, ph }) => (
          <TextField key={key} label={label} value={bv[key]} onChange={(v) => u(key, v)} placeholder={ph}
            labelAction={<MiniRecommendButton onClick={recommend} loading={isLoading} disabled={!bv[key].trim()} />} />
        ))}
      </div>
    </section>
  );
}
