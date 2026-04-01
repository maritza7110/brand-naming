import { Sparkles } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[400px]">
      <Sparkles size={48} className="text-blue-300" />
      <h3 className="mt-6 text-lg font-semibold text-gray-900">
        브랜드명 추천 대기 중
      </h3>
      <p className="mt-2 text-sm text-gray-500 max-w-[240px]">
        왼쪽 항목을 입력하고 "추천 받기" 버튼을 누르면 AI가 브랜드명을 추천합니다
      </p>
    </div>
  );
}
