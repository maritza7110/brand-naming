export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24">
      <div className="w-12 h-12 rounded-xl bg-[#1A1A1A] border border-[#222] flex items-center justify-center mb-5">
        <span className="text-[18px] text-[#D4A853]/40">✦</span>
      </div>
      <p className="text-[13px] text-[#444] mb-1">추천 대기 중</p>
      <p className="text-[11px] text-[#333] leading-relaxed">
        왼쪽 항목을 입력하고<br />추천 받기를 눌러보세요
      </p>
    </div>
  );
}
