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
  return (
    <div className="rounded-xl border border-[#4A4440] overflow-hidden">
      {/* 그룹 헤더 */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#332F2C] hover:bg-[#3E3A36] transition-colors"
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            size={14}
            className={`text-[#B48C50] transition-transform duration-300 ${
              isOpen ? 'rotate-0' : '-rotate-90'
            }`}
          />
          <span className="text-[12px] font-semibold text-[#E8E2DA]">{label}</span>
        </div>
        <span className="text-[10px] text-[#7A7570]">{count}건</span>
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
              <RecommendCardItem key={b.id} batch={b} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
