export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <span className="text-[18px]">✦</span>
      </div>
      <p className="text-[13px] text-gray-400 leading-relaxed max-w-[200px]">
        왼쪽 항목을 입력하고<br />추천 받기를 눌러보세요
      </p>
    </div>
  );
}
