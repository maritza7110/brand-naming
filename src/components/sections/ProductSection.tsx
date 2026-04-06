import { useFormStore } from '../../store/useFormStore';
import { useRecommend } from '../../hooks/useRecommend';
import { SectionHeader } from '../ui/SectionHeader';
import { TextArea } from '../ui/TextArea';
import { MiniRecommendButton } from '../ui/MiniRecommendButton';

export function ProductSection() {
  const product = useFormStore((s) => s.product);
  const updateProduct = useFormStore((s) => s.updateProduct);
  const { recommend, isLoading } = useRecommend();

  return (
    <section className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
      <SectionHeader title="제품/서비스 핵심" />

      <div className="space-y-4">
        <TextArea
          label="제품/서비스 특장점"
          value={product.uniqueStrength}
          onChange={(v) => updateProduct('uniqueStrength', v)}
          placeholder="예: 직접 로스팅한 싱글오리진 원두, 매일 아침 굽는 수제 빵"
          rows={4}
          labelAction={<MiniRecommendButton onClick={recommend} loading={isLoading} disabled={!product.uniqueStrength.trim()} />}
        />
        <TextArea
          label="고객에게 주는 핵심 가치"
          value={product.valueProposition}
          onChange={(v) => updateProduct('valueProposition', v)}
          placeholder="예: 바쁜 일상 속 여유로운 한 잔의 시간"
          rows={4}
          labelAction={<MiniRecommendButton onClick={recommend} loading={isLoading} disabled={!product.valueProposition.trim()} />}
        />
      </div>
    </section>
  );
}
