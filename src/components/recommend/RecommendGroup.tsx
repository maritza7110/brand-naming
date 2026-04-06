import { ChevronDown } from 'lucide-react';
import type { RecommendBatch } from '../../types/form';
import { RecommendCardItem } from './RecommendCardItem';

interface RecommendGroupProps {
  label: string;
  batches: RecommendBatch[];
  isOpen: boolean;
  onToggle: () => void;
  count: number;
}

export function RecommendGroup({ label, batches, isOpen, onToggle, count }: RecommendGroupProps) {
  const latestDate = batches.reduce(
    (latest, b) => (b.createdAt > latest ? b.createdAt : latest),
    batches[0].createdAt,
  );
  const dateStr = `${latestDate.getMonth() + 1}월 ${latestDate.getDate()}일`;

  return (
    <div className="rounded-xl border border-[#4A4440] overflow-hidden">
      {/* 그룹 헤더 */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3.5 lg:py-3 bg-[#332F2C] hover:bg-[#3E3A36] transition-colors"
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            size={16}
            className={`text-[#B48C50] transition-transform duration-300 ${
              isOpen ? 'rotate-0' : '-rotate-90'
            }`}
          />
          <span className="text-[14px] font-semibold text-white">{label}</span>
        </div>
        <span className="text-[12px] text-[#D0CAC2]">{dateStr} · {count}건</span>
      </button>

      {/* CSS Grid 0fr/1fr 접기/펼치기 */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-3 space-y-2">
            {batches.map((b) => (
              <RecommendCardItem key={b.id} batch={b} isGroupOpen={isOpen} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
