import { Sparkles } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24">
      <div className="w-12 h-12 rounded-2xl bg-[#3E3A36] border border-[#4A4640] flex items-center justify-center mb-4">
        <Sparkles size={18} className="text-[var(--color-accent)]/50" />
      </div>
      <p className="text-[13px] font-medium text-[var(--color-text-muted)] mb-1">추천 대기 중</p>
      <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
        각 탭의 항목을 입력하고 추천 받기를 눌러보세요.<br />
        단계가 진행될수록 더 정교한 이름이 나옵니다.
      </p>
    </div>
  );
}
