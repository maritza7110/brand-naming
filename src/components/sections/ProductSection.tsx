import { useFormStore } from '../../store/useFormStore';
import { useRecommend } from '../../hooks/useRecommend';
import { SectionHeader } from '../ui/SectionHeader';
import { TextArea } from '../ui/TextArea';
import { RecommendButton } from '../ui/RecommendButton';

export function ProductSection() {
  const product = useFormStore((s) => s.product);
  const updateProduct = useFormStore((s) => s.updateProduct);
  const { recommend, isLoading } = useRecommend();

  const hasInput = Object.values(product).some((v) => v.trim() !== '');

  return (
    <section className="py-12">
      <SectionHeader title="제품/서비스 핵심" />

      <div className="mt-6 space-y-6">
        <TextArea
          label="제품/서비스 특장점"
          value={product.uniqueStrength}
          onChange={(v) => updateProduct('uniqueStrength', v)}
          placeholder="예: 직접 로스팅한 싱글오리진 원두, 매일 아침 굽는 수제 빵"
          rows={4}
        />
        <TextArea
          label="고객에게 주는 핵심 가치"
          value={product.valueProposition}
          onChange={(v) => updateProduct('valueProposition', v)}
          placeholder="예: 바쁜 일상 속 여유로운 한 잔의 시간"
          rows={4}
        />
      </div>

      <div className="mt-8">
        <RecommendButton onClick={recommend} loading={isLoading} disabled={!hasInput} />
      </div>
    </section>
  );
}
