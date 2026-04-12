import { useState, useEffect } from 'react';
import { useFormStore } from '../../store/useFormStore';
import { useRecommend } from '../../hooks/useRecommend';
import { SectionHeader } from '../ui/SectionHeader';
import { TextArea } from '../ui/TextArea';
import { MiniRecommendButton } from '../ui/MiniRecommendButton';
import { getIndustryPlaceholder } from '../../services/industryPlaceholder';

export function ProductSection() {
  const product = useFormStore((s) => s.product);
  const updateProduct = useFormStore((s) => s.updateProduct);
  const { recommend, isLoading } = useRecommend();
  const storeBasic = useFormStore((s) => s.storeBasic);
  const [uniqueStrengthPh, setUniqueStrengthPh] = useState('');
  const [valuePropositionPh, setValuePropositionPh] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getIndustryPlaceholder('uniqueStrength', storeBasic.industry),
      getIndustryPlaceholder('valueProposition', storeBasic.industry),
    ]).then(([uniqueStrength, valueProposition]) => {
      if (!cancelled) {
        setUniqueStrengthPh(uniqueStrength);
        setValuePropositionPh(valueProposition);
      }
    });
    return () => { cancelled = true; };
  }, [storeBasic.industry]);

  return (
    <section className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
      <SectionHeader title="제품/서비스 핵심" />

      <div className="space-y-4">
        <TextArea
          label="제품/서비스 특장점"
          value={product.uniqueStrength}
          onChange={(v) => updateProduct('uniqueStrength', v)}
          placeholder={uniqueStrengthPh || '제품/서비스의 특장점을 입력해주세요'}
          rows={4}
          labelAction={<MiniRecommendButton onClick={recommend} loading={isLoading} disabled={!product.uniqueStrength.trim()} />}
        />
        <TextArea
          label="고객에게 주는 핵심 가치"
          value={product.valueProposition}
          onChange={(v) => updateProduct('valueProposition', v)}
          placeholder={valuePropositionPh || '고객에게 주는 핵심 가치를 입력해주세요'}
          rows={4}
          labelAction={<MiniRecommendButton onClick={recommend} loading={isLoading} disabled={!product.valueProposition.trim()} />}
        />
      </div>
    </section>
  );
}
