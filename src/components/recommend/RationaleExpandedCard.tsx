import type { RationaleData } from '../../types/form';

interface RationaleExpandedCardProps {
  rationale: RationaleData;
  isOpen: boolean;
}

export function RationaleExpandedCard({ rationale, isOpen }: RationaleExpandedCardProps) {
  const { validityScore, namingTechnique, meaningAnalysis, reflectedInputs } = rationale;

  return (
    <div
      className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      }`}
    >
      <div className="overflow-hidden">
        {/* 상단 구분선 */}
        <div className="border-t border-[#332F2C] mt-3 pt-3">

          {/* 타당성 점수 */}
          <div className="flex justify-between items-center">
            <span className="text-[20px] font-semibold text-[#B48C50]">{validityScore}%</span>
            <span className="text-[12px] text-[#A09890]">타당성 점수</span>
          </div>
          <div className="h-[4px] bg-[#4A4440] rounded-full mt-2">
            <div
              className="h-full bg-[#B48C50] rounded-full transition-all duration-[600ms] ease-in-out"
              style={{ width: isOpen ? `${validityScore}%` : '0%' }}
            />
          </div>

          {/* 네이밍 기법 */}
          <div className="border-t border-[#332F2C] mt-3 pt-3">
            <p className="text-[12px] font-semibold text-[#A09890] mb-1.5">네이밍 기법</p>
            <span className="px-2 py-0.5 rounded-full bg-[#4A4440] text-[12px] text-[#D0CAC2]">
              {namingTechnique}
            </span>
          </div>

          {/* 의미 분석 */}
          <div className="border-t border-[#332F2C] mt-3 pt-3">
            <p className="text-[12px] font-semibold text-[#A09890] mb-1.5">의미 분석</p>
            <p className="text-[14px] text-[#D0CAC2] leading-relaxed">{meaningAnalysis}</p>
          </div>

          {/* 반영된 입력 */}
          <div className="border-t border-[#332F2C] mt-3 pt-3">
            <p className="text-[12px] font-semibold text-[#A09890] mb-1.5">반영된 입력</p>
            <div className="flex flex-wrap gap-1.5">
              {reflectedInputs.map((input) => (
                <span
                  key={input}
                  className="px-2 py-0.5 rounded-full bg-[rgba(180,140,80,0.1)] text-[#B48C50] text-[12px]"
                >
                  {input}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
