import { useState } from 'react';
import type { RationaleData } from '../../types/form';
import { TrademarkModal } from './TrademarkModal';

interface RationaleExpandedCardProps {
  rationale: RationaleData;
  isOpen: boolean;
  brandName: string;
}

const RISK_COLOR: Record<string, string> = {
  '낮음': 'text-emerald-400 bg-emerald-400/10',
  '보통': 'text-amber-400 bg-amber-400/10',
  '높음': 'text-red-400 bg-red-400/10',
};

export function RationaleExpandedCard({ rationale, isOpen, brandName }: RationaleExpandedCardProps) {
  const { validityScore, namingTechnique, meaningAnalysis, reflectedInputs, documentReference, trademarkRisk } = rationale;
  const [trademarkOpen, setTrademarkOpen] = useState(false);

  return (
    <div
      className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      }`}
    >
      <div className="overflow-hidden">
        <div className="border-t border-[#332F2C] mt-3 pt-3">

          {/* 타당성 점수 */}
          <div className="flex justify-between items-center">
            <span className="text-[20px] font-semibold text-[var(--color-text-primary)]">{validityScore}%</span>
            <span className="text-[12px] text-[var(--color-border-muted)]">타당성 점수</span>
          </div>
          <div className="h-[4px] bg-[var(--color-border)] rounded-full mt-2">
            <div
              className="h-full bg-[#7BAFD4] rounded-full transition-all duration-[600ms] ease-in-out"
              style={{ width: isOpen ? `${validityScore}%` : '0%' }}
            />
          </div>

          {/* 네이밍 기법 */}
          <div className="border-t border-[#332F2C] mt-3 pt-3">
            <p className="text-[12px] font-semibold text-[var(--color-border-muted)] mb-1.5">네이밍 기법</p>
            <span className="px-2 py-0.5 rounded-full bg-[var(--color-border)] text-[12px] text-[var(--color-text-muted)]">
              {namingTechnique}
            </span>
          </div>

          {/* 의미 분석 */}
          <div className="border-t border-[#332F2C] mt-3 pt-3">
            <p className="text-[12px] font-semibold text-[var(--color-border-muted)] mb-1.5">의미 분석</p>
            <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed">{meaningAnalysis}</p>
          </div>

          {/* 반영된 입력 */}
          <div className="border-t border-[#332F2C] mt-3 pt-3">
            <p className="text-[12px] font-semibold text-[var(--color-border-muted)] mb-1.5">반영된 입력</p>
            <div className="flex flex-wrap gap-1.5">
              {reflectedInputs.map((input) => (
                <span key={input} className="px-2 py-0.5 rounded-full bg-[rgba(74,160,140,0.12)] text-[#4AA08C] text-[12px]">
                  {input}
                </span>
              ))}
            </div>
          </div>

          {/* 적용 원칙 */}
          {documentReference && (
            <div className="border-t border-[#332F2C] mt-3 pt-3">
              <p className="text-[12px] font-semibold text-[var(--color-border-muted)] mb-1.5">적용 원칙</p>
              <p className="text-[13px] text-[var(--color-text-muted)]">{documentReference}</p>
            </div>
          )}

          {/* 상표 예비 판정 */}
          {trademarkRisk && (
            <div className="border-t border-[#332F2C] mt-3 pt-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[12px] font-semibold text-[var(--color-border-muted)]">상표 예비 판정</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setTrademarkOpen(true); }}
                  className="text-[11px] text-[#7BAFD4] hover:text-[#9CCAE8] transition-colors underline underline-offset-2"
                >
                  상표등록 실사 확인
                </button>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${RISK_COLOR[trademarkRisk.riskLevel] ?? 'text-[var(--color-text-muted)]'}`}>
                  위험도 {trademarkRisk.riskLevel}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[var(--color-border)] text-[11px] text-[var(--color-text-secondary)]">
                  {trademarkRisk.identityGrade}
                </span>
              </div>
              <p className="text-[13px] text-[var(--color-text-muted)]">{trademarkRisk.note}</p>
            </div>
          )}

        </div>
      </div>

      <TrademarkModal open={trademarkOpen} onClose={() => setTrademarkOpen(false)} brandName={brandName} />
    </div>
  );
}
