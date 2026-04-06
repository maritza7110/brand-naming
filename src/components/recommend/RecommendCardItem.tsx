import { useState, useEffect } from 'react';
import { ChevronDown, ClipboardList, Loader2, Sparkles } from 'lucide-react';
import type { RecommendBatch } from '../../types/form';
import { RationaleExpandedCard } from './RationaleExpandedCard';
import { generateForCriterion } from '../../services/geminiCriteria';

interface Props { batch: RecommendBatch; isGroupOpen?: boolean; }

export function RecommendCardItem({ batch, isGroupOpen }: Props) {
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set());
  // 한 번이라도 열린 적 있는 인덱스 — 한 번도 열리지 않은 항목은 DOM에 렌더하지 않음
  const [everOpenedIndices, setEverOpenedIndices] = useState<Set<number>>(new Set());
  const [checklistOpen, setChecklistOpen] = useState(false);

  useEffect(() => {
    if (!isGroupOpen) {
      setExpandedIndices(new Set());
      setChecklistOpen(false);
    }
  }, [isGroupOpen]);
  const [criteriaResults, setCriteriaResults] = useState<Record<number, { brandName: string; reasoning: string } | 'loading' | 'error'>>({});
  const time = batch.createdAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  const handleCriterionClick = async (criterion: string, index: number) => {
    if (criteriaResults[index] === 'loading') return;
    setCriteriaResults((prev) => ({ ...prev, [index]: 'loading' }));
    try {
      const result = await generateForCriterion(criterion);
      setCriteriaResults((prev) => ({ ...prev, [index]: result }));
    } catch {
      setCriteriaResults((prev) => ({ ...prev, [index]: 'error' }));
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
        setEverOpenedIndices((p) => new Set([...p, index]));
      }
      return next;
    });
  };

  return (
    <div className="rounded-xl bg-[#2C2825] border border-[#4A4440] p-4">
      {batch.names.map((n, i) => {
        const isExpanded = expandedIndices.has(i);
        const hasRationale = Boolean(n.rationale);

        return (
          <div key={i} className={i > 0 ? 'mt-3 pt-3 border-t border-[#4A4440]' : ''}>
            <div
              className={hasRationale ? 'cursor-pointer' : ''}
              role={hasRationale ? 'button' : undefined}
              aria-expanded={hasRationale ? isExpanded : undefined}
              onClick={hasRationale ? () => toggleExpand(i) : undefined}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[22px] font-bold text-[#E8C878] tracking-tight">{n.brandName}</span>
                {hasRationale && (
                  <ChevronDown
                    size={14}
                    className={`mt-1 shrink-0 text-[#A09890] transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                )}
              </div>
              <p className="mt-1.5 text-[13px] text-[#8A8480] leading-relaxed">{n.reasoning}</p>
            </div>

            {hasRationale && n.rationale && everOpenedIndices.has(i) && (
              <RationaleExpandedCard rationale={n.rationale} isOpen={isExpanded} brandName={n.brandName} />
            )}

          </div>
        );
      })}

      {/* 소비자 테스트 체크리스트 (문서 기반 모드) */}
      {batch.consumerChecklist && batch.consumerChecklist.length > 0 && (
        <div className="mt-2 border-t border-[#332F2C] pt-2">
          <button
            type="button"
            onClick={() => setChecklistOpen((v) => !v)}
            className="flex items-center gap-1.5 text-[12px] font-semibold text-[#B48C50] hover:text-[#C49A5C] transition-colors"
          >
            <ClipboardList size={13} />
            <span>소비자 테스트 체크리스트</span>
            <ChevronDown size={12} className={`transition-transform ${checklistOpen ? 'rotate-180' : ''}`} />
          </button>
          {checklistOpen && (
            <ul className="mt-2 space-y-2">
              {batch.consumerChecklist.map((item, i) => {
                const result = criteriaResults[i];
                return (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => handleCriterionClick(item, i)}
                      disabled={result === 'loading'}
                      className="w-full flex items-start gap-2 text-left text-[13px] text-[#D0CAC2] hover:text-white group transition-colors"
                    >
                      <span className="mt-0.5 w-4 h-4 shrink-0 rounded border border-[#4A4440] group-hover:border-[#B48C50] flex items-center justify-center text-[10px] text-[#A09890] transition-colors">
                        {result === 'loading' ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={9} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </span>
                      <span>{item}</span>
                    </button>
                    {result && result !== 'loading' && result !== 'error' && (
                      <div className="mt-1.5 ml-6 pl-3 border-l-2 border-[#B48C50]/40">
                        <span className="text-[14px] font-semibold text-[#B48C50]">{result.brandName}</span>
                        <p className="text-[12px] text-[#A09890] mt-0.5">{result.reasoning}</p>
                      </div>
                    )}
                    {result === 'error' && (
                      <p className="mt-1 ml-6 text-[12px] text-red-400">추천 실패. 다시 클릭해보세요.</p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      <div className="mt-3 pt-2 border-t border-[#332F2C] flex items-center gap-1.5 flex-wrap">
        {batch.basedOn.slice(0, 4).map((t) => (
          <span key={t} className="px-2 py-0.5 rounded-full bg-[#4A4440] text-[12px] text-[#D0CAC2]">{t}</span>
        ))}
        {batch.basedOn.length > 4 && <span className="text-[12px] text-[#D0CAC2]">+{batch.basedOn.length - 4}</span>}
        <span className="ml-auto text-[12px] text-[#B5AFA8]">{time}</span>
      </div>

      {/* processNote (문서 기반 모드) — 카드 최하단 */}
      {batch.processNote && (
        <p className="mt-2 text-[11px] text-[#6A6460] italic leading-relaxed">{batch.processNote}</p>
      )}
    </div>
  );
}
