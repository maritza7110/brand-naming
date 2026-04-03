import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { RecommendBatch } from '../../types/form';
import { RationaleExpandedCard } from './RationaleExpandedCard';

interface Props { batch: RecommendBatch; }

export function RecommendCardItem({ batch }: Props) {
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set());
  const time = batch.createdAt.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
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
                <span className="text-[16px] font-semibold text-[#B48C50]">{n.brandName}</span>
                {hasRationale && (
                  <ChevronDown
                    size={14}
                    className={`mt-1 shrink-0 text-[#A09890] transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                )}
              </div>
              <p className="mt-1 text-[14px] text-[#D0CAC2] leading-relaxed">{n.reasoning}</p>
            </div>

            {hasRationale && n.rationale && (
              <RationaleExpandedCard rationale={n.rationale} isOpen={isExpanded} />
            )}
          </div>
        );
      })}

      <div className="mt-3 pt-2 border-t border-[#332F2C] flex items-center gap-1.5 flex-wrap">
        {batch.basedOn.slice(0, 4).map((t) => (
          <span key={t} className="px-2 py-0.5 rounded-full bg-[#4A4440] text-[12px] text-[#D0CAC2]">{t}</span>
        ))}
        {batch.basedOn.length > 4 && <span className="text-[12px] text-[#D0CAC2]">+{batch.basedOn.length - 4}</span>}
        <span className="ml-auto text-[12px] text-[#B5AFA8]">{time}</span>
      </div>
    </div>
  );
}
