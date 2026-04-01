import { Sparkles } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24">
      <div className="w-12 h-12 rounded-2xl bg-[#332F2C] border border-[#3E3A36] flex items-center justify-center mb-4">
        <Sparkles size={18} className="text-[#B48C50]/50" />
      </div>
      <p className="text-[13px] font-medium text-[#8A8178] mb-1">추천 대기 중</p>
      <p className="text-[11px] text-[#6A6158] leading-relaxed">왼쪽 항목을 입력하고<br />추천 받기를 눌러보세요</p>
    </div>
  );
}
