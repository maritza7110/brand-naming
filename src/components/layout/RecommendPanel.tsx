interface RecommendPanelProps {
  children: React.ReactNode;
}

export function RecommendPanel({ children }: RecommendPanelProps) {
  return (
    <aside className="sticky top-0 h-screen overflow-y-auto bg-[#111111] border-l border-[#1F1F1F]">
      <div className="sticky top-0 z-10 px-6 pt-7 pb-4 bg-[#111111]/90 backdrop-blur-md border-b border-[#1F1F1F]">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4A853]" />
          <h2 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#606060]">
            추천 결과
          </h2>
        </div>
      </div>
      <div className="px-6 pb-6 pt-4">{children}</div>
    </aside>
  );
}
