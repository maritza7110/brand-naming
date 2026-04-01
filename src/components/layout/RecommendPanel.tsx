interface RecommendPanelProps {
  children: React.ReactNode;
}

export function RecommendPanel({ children }: RecommendPanelProps) {
  return (
    <aside className="sticky top-0 h-screen overflow-y-auto bg-[#252220] border-l border-[#3A3632]">
      <div className="sticky top-0 z-10 px-6 pt-7 pb-4 bg-[#252220]/90 backdrop-blur-md border-b border-[#3A3632]">
        <h2 className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#B48C50]">
          추천 결과
        </h2>
      </div>
      <div className="px-6 pb-6 pt-3">{children}</div>
    </aside>
  );
}
