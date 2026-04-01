import { Sparkles } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24">
      <div className="w-12 h-12 rounded-2xl bg-[#F6F4F0] border border-[#EAE6E0] flex items-center justify-center mb-4">
        <Sparkles size={18} className="text-[#B48C50]" />
      </div>
      <p className="text-[13px] font-medium text-[#8A8580] mb-1">추천 대기 중</p>
      <p className="text-[11px] text-[#B5AFA8] leading-relaxed">
        왼쪽 항목을 입력하고<br />추천 받기를 눌러보세요
      </p>
    </div>
  );
}
