import { Sparkles } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center mb-5 shadow-sm">
        <Sparkles size={22} className="text-indigo-400" />
      </div>
      <p className="text-[14px] font-medium text-gray-400 mb-1">
        추천 대기 중
      </p>
      <p className="text-[12px] text-gray-300 leading-relaxed max-w-[180px]">
        왼쪽 항목을 입력하고<br />추천 받기를 눌러보세요
      </p>
    </div>
  );
}
