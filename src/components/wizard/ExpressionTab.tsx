import { useFormStore } from '../../store/useFormStore';
import { ProductSection } from '../sections/ProductSection';
import { AdvancedOptionsToggle } from '../ui/AdvancedOptionsToggle';
import { ChipSelector } from '../ui/ChipSelector';
import { TextField } from '../ui/TextField';
import { KeywordWeightSlider } from '../ui/KeywordWeightSlider';
import { RecommendButton } from '../ui/RecommendButton';
import { useRecommend } from '../../hooks/useRecommend';

const NAMING_STYLE_OPTIONS = [
  '합성어',
  '추상어',
  '은유/상징',
  '두문자',
  '의성어/의태어',
  '외래어 차용',
  '한글 순수',
  '숫자 조합',
];

export function ExpressionTab() {
  const product = useFormStore((s) => s.product);
  const expression = useFormStore((s) => s.expression);
  const keywordWeights = useFormStore((s) => s.keywordWeights);
  const setKeywordWeight = useFormStore((s) => s.setKeywordWeight);
  const updateExpressionChips = useFormStore((s) => s.updateExpressionChips);
  const updateExpressionText = useFormStore((s) => s.updateExpressionText);
  const { recommend, isLoading } = useRecommend();

  // 입력된 키워드 목록 추출
  const keywords: { label: string; weight: number }[] = [];

  if (product.uniqueStrength.trim() !== '') {
    keywords.push({ label: '특장점', weight: keywordWeights['특장점'] ?? 3 });
  }
  if (product.valueProposition.trim() !== '') {
    keywords.push({ label: '핵심가치', weight: keywordWeights['핵심가치'] ?? 3 });
  }
  if (expression.namingStyle.length > 0) {
    keywords.push({ label: '네이밍스타일', weight: keywordWeights['네이밍스타일'] ?? 3 });
  }
  if (expression.languageConstraint.trim() !== '') {
    keywords.push({ label: '언어제약', weight: keywordWeights['언어제약'] ?? 3 });
  }

  const hasInput =
    Object.values(product).some((v) => v.trim() !== '') ||
    expression.namingStyle.length > 0 ||
    expression.languageConstraint.trim() !== '';

  return (
    <div className="space-y-5">
      <div className="mb-4">
        <h3 className="text-[14px] font-semibold text-[var(--color-text-secondary)] mb-2">
          브랜드가 전달하는 것을 정의해주세요
        </h3>
        <p className="text-[14px] text-[var(--color-text-muted)]">
          제품·서비스의 강점과 고객 가치를 입력하면 네이밍에 직접 반영됩니다. 고급 옵션에서 스타일과 언어 제약도 설정할 수 있습니다.
        </p>
      </div>
      <ProductSection />
      <div className="rounded-2xl bg-[#E8E4DE] p-5 lg:p-7 border border-[#C5BFB7]">
        <AdvancedOptionsToggle>
          <ChipSelector
            label="네이밍 스타일"
            options={NAMING_STYLE_OPTIONS}
            selected={expression.namingStyle}
            onChange={(v) => updateExpressionChips('namingStyle', v)}
            maxSelection={2}
            hint="최대 2개 선택"
          />
          <TextField
            label="언어 제약"
            value={expression.languageConstraint}
            onChange={(v) => updateExpressionText('languageConstraint', v)}
            placeholder="예: '영문 5자 이내', '한글+영문 조합', '발음하기 쉬운'"
          />
        </AdvancedOptionsToggle>
      </div>
      {keywords.length > 0 && (
        <div className="rounded-2xl bg-[#363230] p-5 lg:p-7 border border-[var(--color-border)]">
          <KeywordWeightSlider keywords={keywords} onChange={setKeywordWeight} />
        </div>
      )}
      <div className="flex justify-end">
        <RecommendButton onClick={recommend} loading={isLoading} disabled={!hasInput} />
      </div>
    </div>
  );
}
