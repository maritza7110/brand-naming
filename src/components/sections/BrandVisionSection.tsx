import { useState, useEffect } from 'react';
import { useFormStore } from '../../store/useFormStore';
import { useRecommend } from '../../hooks/useRecommend';
import { SectionHeader } from '../ui/SectionHeader';
import { MiniRecommendButton } from '../ui/MiniRecommendButton';
import { TextField } from '../ui/TextField';
import { getIndustryPlaceholder } from '../../services/industryPlaceholder';

const FIELDS = [
  { key: 'ceoVision' as const, label: 'CEO 비전/꿈' },
  { key: 'longTermGoal' as const, label: '5년/10년 목표' },
  { key: 'personalStory' as const, label: '개인 스토리' },
];

export function BrandVisionSection() {
  const bv = useFormStore((s) => s.brandVision);
  const u = useFormStore((s) => s.updateBrandVision);
  const { recommend, isLoading } = useRecommend();
  const storeBasic = useFormStore((s) => s.storeBasic);
  const [placeholders, setPlaceholders] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getIndustryPlaceholder('ceoVision', storeBasic.industry),
      getIndustryPlaceholder('longTermGoal', storeBasic.industry),
      getIndustryPlaceholder('personalStory', storeBasic.industry),
    ]).then(([ceoVision, longTermGoal, personalStory]) => {
      if (!cancelled) setPlaceholders({ ceoVision, longTermGoal, personalStory });
    });
    return () => { cancelled = true; };
  }, [storeBasic.industry]);

  return (
    <section className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
      <SectionHeader title="브랜드 비전" />
      <div className="space-y-4">
        {FIELDS.map(({ key, label }) => (
          <TextField
            key={key}
            label={label}
            value={bv[key]}
            onChange={(v) => u(key, v)}
            placeholder={placeholders[key] || ''}
            labelAction={<MiniRecommendButton onClick={recommend} loading={isLoading} disabled={!bv[key].trim()} />}
          />
        ))}
      </div>
    </section>
  );
}
