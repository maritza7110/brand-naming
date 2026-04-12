import { useState, useEffect } from 'react';
import { useFormStore } from '../../store/useFormStore';
import { useRecommend } from '../../hooks/useRecommend';
import { SectionHeader } from '../ui/SectionHeader';
import { TextArea } from '../ui/TextArea';
import { MiniRecommendButton } from '../ui/MiniRecommendButton';
import { getIndustryPlaceholder } from '../../services/industryPlaceholder';

const DEFAULT_PLACEHOLDER = '경쟁사 대비 차별점을 입력해주세요';

export function USPSection() {
  const usp = useFormStore((s) => s.analysis.usp);
  const updateAnalysis = useFormStore((s) => s.updateAnalysis);
  const { recommend, isLoading } = useRecommend();
  const storeBasic = useFormStore((s) => s.storeBasic);

  const [placeholder, setPlaceholder] = useState(DEFAULT_PLACEHOLDER);

  useEffect(() => {
    let cancelled = false;
    getIndustryPlaceholder('usp', storeBasic.industry).then((ph) => {
      if (!cancelled) setPlaceholder(ph);
    });
    return () => { cancelled = true; };
  }, [storeBasic.industry]);

  return (
    <section className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
      <SectionHeader title="USP (차별화 요소)" />
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-block px-2 py-0.5 rounded-full text-[14px] text-[#6B6560] bg-[#DDD7CF]">
          시장 현황 관점
        </span>
      </div>
      <p className="text-[14px] text-[#6B6560] mb-4">
        지금 시장에서 경쟁사 대비 눈에 띄는 차별점은 무엇인가요?
      </p>
      <TextArea
        label="USP (차별화 요소)"
        value={usp}
        onChange={(v) => updateAnalysis('usp', v)}
        placeholder={placeholder}
        rows={2}
        labelAction={<MiniRecommendButton onClick={recommend} loading={isLoading} disabled={!usp.trim()} />}
      />
    </section>
  );
}
